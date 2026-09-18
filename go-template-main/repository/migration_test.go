package repository

// Tests for the migration runner's decision logic (Open Finding F-16, 2026-09-18).
//
// These cover the parts that decide WHAT to do -- filename parsing, ordering, pending selection and
// the baseline split -- against fstest.MapFS, so they need no database. That split is deliberate:
// this package has no test harness and no live PG in CI (verified: zero test files existed under
// repository/ before this one), so logic that can only be checked against a real server would be
// checked by nobody. The DB-touching half is kept thin for exactly that reason and is exercised
// live instead, against the running stack, with the result recorded in the checkpoint.

import (
	"testing"
	"testing/fstest"

	"github.com/stretchr/testify/assert"
)

// realFileNames mirrors the actual sql/pg contents at the time of writing. Kept literal rather than
// generated so that adding V7 does not silently change what these tests assert.
var realFileNames = []string{
	"V0__Initial_Table.sql",
	"V1__Assets_Table.sql",
	"V2__Employees_Table.sql",
	"V3__Tickets_Table.sql",
	"V4__Audit_Table.sql",
	"V5__AssetHandovers_Table.sql",
	"V6__Additional_Indexes.sql",
}

func fsWith(names ...string) fstest.MapFS {
	m := fstest.MapFS{}
	for _, n := range names {
		m["pg/"+n] = &fstest.MapFile{Data: []byte("SELECT 1;")}
	}
	return m
}

func TestParseMigrations_RealFileNames(t *testing.T) {
	got, err := ParseMigrations(fsWith(realFileNames...), "pg")
	assert.NoError(t, err)
	assert.Len(t, got, 7)

	for i, m := range got {
		assert.Equal(t, i, m.Version, "versions must come back 0..6 in order")
	}
	assert.Equal(t, "Additional_Indexes", got[6].Name)
	assert.Equal(t, "pg/V6__Additional_Indexes.sql", got[6].Path)
}

// Directory order is not version order once double digits appear -- V10 sorts before V2
// lexically. If the runner ever trusted readdir order it would apply migrations out of sequence.
func TestParseMigrations_OrdersNumericallyNotLexically(t *testing.T) {
	got, err := ParseMigrations(fsWith("V2__b.sql", "V10__c.sql", "V1__a.sql"), "pg")
	assert.NoError(t, err)

	versions := []int{}
	for _, m := range got {
		versions = append(versions, m.Version)
	}
	assert.Equal(t, []int{1, 2, 10}, versions, "V10 must come after V2, not before it")
}

// A file that does not match the convention is an error, not something to skip. Skipping quietly is
// precisely how a migration goes missing unnoticed -- the failure mode F-16 exists for.
func TestParseMigrations_RejectsUnconventionalNames(t *testing.T) {
	for _, bad := range []string{"init.sql", "V1_single_underscore.sql", "v1__lowercase.sql", "VX__nonnumeric.sql"} {
		_, err := ParseMigrations(fsWith("V0__ok.sql", bad), "pg")
		assert.Error(t, err, "expected %q to be rejected rather than skipped", bad)
	}
}

func TestParseMigrations_RejectsDuplicateVersions(t *testing.T) {
	_, err := ParseMigrations(fsWith("V1__first.sql", "V1__second.sql"), "pg")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "appears twice")
}

func TestPendingMigrations(t *testing.T) {
	available, err := ParseMigrations(fsWith(realFileNames...), "pg")
	assert.NoError(t, err)

	t.Run("nothing applied yet returns everything", func(t *testing.T) {
		assert.Len(t, PendingMigrations(available, map[int]bool{}), 7)
	})

	t.Run("fully applied returns nothing", func(t *testing.T) {
		applied := map[int]bool{}
		for i := 0; i <= 6; i++ {
			applied[i] = true
		}
		assert.Empty(t, PendingMigrations(available, applied))
	})

	// The real case F-16 was raised for: a developer's volume was created before V6 existed, so it
	// has V0-V5 and is silently missing the indexes.
	t.Run("a stale volume missing only the newest returns just that one", func(t *testing.T) {
		applied := map[int]bool{0: true, 1: true, 2: true, 3: true, 4: true, 5: true}
		pending := PendingMigrations(available, applied)
		assert.Len(t, pending, 1)
		assert.Equal(t, 6, pending[0].Version)
	})

	// A hole in the middle is what a database baselined before that migration existed looks like.
	// It must be applied, not treated as corruption -- refusing would strand the database.
	t.Run("a gap in the middle is applied, not rejected", func(t *testing.T) {
		applied := map[int]bool{0: true, 1: true, 2: true, 4: true, 5: true, 6: true}
		pending := PendingMigrations(available, applied)
		assert.Len(t, pending, 1)
		assert.Equal(t, 3, pending[0].Version)
	})
}

func TestSplitAtBaseline(t *testing.T) {
	available, err := ParseMigrations(fsWith(realFileNames...), "pg")
	assert.NoError(t, err)

	t.Run("baseline 6 records every current migration and applies none", func(t *testing.T) {
		record, apply := SplitAtBaseline(available, 6)
		assert.Len(t, record, 7)
		assert.Empty(t, apply, "a database already at V6 must have nothing executed against it")
	})

	t.Run("baseline 5 records V0-V5 and applies only V6", func(t *testing.T) {
		record, apply := SplitAtBaseline(available, 5)
		assert.Len(t, record, 6)
		assert.Len(t, apply, 1)
		assert.Equal(t, 6, apply[0].Version)
	})

	// Baseline 0 is meaningful and must not be confused with "no baseline requested", which is
	// signalled by a negative value. V0 exists, so this records exactly it.
	t.Run("baseline 0 records only V0", func(t *testing.T) {
		record, apply := SplitAtBaseline(available, 0)
		assert.Len(t, record, 1)
		assert.Equal(t, 0, record[0].Version)
		assert.Len(t, apply, 6)
	})

	t.Run("a baseline above every version applies nothing", func(t *testing.T) {
		record, apply := SplitAtBaseline(available, 99)
		assert.Len(t, record, 7)
		assert.Empty(t, apply)
	})
}

package repository

// Fourth and last repository on the integration harness with behaviour that only a real database
// can show (see pgharness_test.go). What makes Audit different from the three before it:
//
//  1. THE STORED SHAPE AND THE WIRE SHAPE DIFFER BY DESIGN. Insert writes a `doc` jsonb column
//     holding the whole entry; SQL_audit_pg_list_base's SELECT list deliberately omits it, and
//     AuditLogModel has no field for it. So `doc` is written on every insert and never read back
//     by the application. That is invisible to any mock -- a mock has one representation.
//  2. IMMUTABILITY IS ENFORCED BY OMISSION. AC-AUDIT-001-02 requires audit entries to be
//     immutable, and nothing checks it at runtime: the guarantee is that no UPDATE or DELETE
//     against audit_logs exists anywhere. That is a property of the code's shape, so it is tested
//     as one.
//  3. Ordering is newest-first on a timestamp rather than on a code, so the ORDER BY is the only
//     thing standing between a reader and an arbitrary order.
//
// Skips unless a test database is configured; fails rather than skips in CI.

import (
	"fmt"
	"reflect"
	"testing"

	"singer/go-template-new-2026-06/model"

	"github.com/stretchr/testify/assert"
)

func newAuditEntry(seq int, actor, action, entityType, entityID, createdAt string) model.AuditLogModel {
	return model.AuditLogModel{
		ID:         fmt.Sprintf("aud-%04d", seq),
		Actor:      actor,
		Action:     action,
		EntityType: entityType,
		EntityID:   entityID,
		CreatedAt:  createdAt,
	}
}

func auditIDsOf(rows []model.AuditLogModel) []string {
	out := make([]string, 0, len(rows))
	for _, r := range rows {
		out = append(out, r.ID)
	}
	return out
}

// TestAuditPGRepository_InterfaceIsAppendOnly encodes AC-AUDIT-001-02. The audit log's
// immutability is not enforced by a constraint, a trigger, or a runtime check -- it is enforced by
// there being no way to express a change. This test fails the day someone adds one, which is the
// only moment the guarantee can quietly disappear.
//
// It needs no database, so it runs everywhere, unlike the rest of this file.
func TestAuditPGRepository_InterfaceIsAppendOnly(t *testing.T) {
	iface := reflect.TypeOf((*AuditPGRepository)(nil)).Elem()

	got := make([]string, 0, iface.NumMethod())
	for i := 0; i < iface.NumMethod(); i++ {
		got = append(got, iface.Method(i).Name)
	}

	assert.ElementsMatch(t, []string{"Insert", "List"}, got,
		"AuditPGRepository must expose only Insert and List. AC-AUDIT-001-02 makes audit entries "+
			"immutable, and that is guaranteed solely by the absence of an Update or Delete -- "+
			"adding one removes the guarantee without any other test noticing.")
}

// TestAuditPGRepository_DocIsWrittenButNeverReturned covers the deliberate gap between what is
// stored and what is served. The column is populated on every insert and is absent from every
// response.
func TestAuditPGRepository_DocIsWrittenButNeverReturned(t *testing.T) {
	h := newPGHarness(t)
	repo := NewAuditPGRepository()

	entry := newAuditEntry(1, "admin", "Asset created", "asset", "asset-1", "2026-09-01T10:00:00Z")
	assert.NoError(t, repo.Insert(entry))

	t.Run("the doc column really is populated", func(t *testing.T) {
		var doc string
		err := h.DB.QueryRow(`SELECT doc::text FROM audit_logs WHERE id = $1`, entry.ID).Scan(&doc)
		assert.NoError(t, err)
		assert.Contains(t, doc, "Asset created", "the whole entry is stored as JSON alongside the columns")
		assert.Contains(t, doc, "asset-1")
	})

	t.Run("and List returns the columns, not the document", func(t *testing.T) {
		rows, _, err := repo.List(model.AuditListQuery{})
		assert.NoError(t, err)
		assert.Len(t, rows, 1)
		got := rows[0]
		assert.Equal(t, "admin", got.Actor)
		assert.Equal(t, "Asset created", got.Action)
		assert.Equal(t, "asset", got.EntityType)
		assert.Equal(t, "asset-1", got.EntityID)
	})

	// The model has no field for it, so this is a statement about intent rather than a behaviour
	// that could break: if `doc` ever needs to reach callers, both the SELECT and the struct have
	// to change together, and this test is where that decision should be recorded.
	t.Run("AuditLogModel has no doc field to return it in", func(t *testing.T) {
		mt := reflect.TypeOf(model.AuditLogModel{})
		_, exists := mt.FieldByName("Doc")
		assert.False(t, exists,
			"the stored doc is deliberately not part of the wire shape -- see RAISE-API-DB-SPEC.md §5")
	})
}

// TestAuditPGRepository_OrderedNewestFirst covers ORDER BY created_at DESC. Audit readers depend on
// the newest entry appearing first; without the ORDER BY, PostgreSQL may return any order at all,
// and it will often look sorted by accident on small data.
func TestAuditPGRepository_OrderedNewestFirst(t *testing.T) {
	newPGHarness(t)
	repo := NewAuditPGRepository()

	// Inserted deliberately out of order, so a passing result cannot be insertion order.
	assert.NoError(t, repo.Insert(newAuditEntry(2, "admin", "Second", "asset", "asset-1", "2026-09-02T10:00:00Z")))
	assert.NoError(t, repo.Insert(newAuditEntry(4, "admin", "Fourth", "asset", "asset-1", "2026-09-04T10:00:00Z")))
	assert.NoError(t, repo.Insert(newAuditEntry(1, "admin", "First", "asset", "asset-1", "2026-09-01T10:00:00Z")))
	assert.NoError(t, repo.Insert(newAuditEntry(3, "admin", "Third", "asset", "asset-1", "2026-09-03T10:00:00Z")))

	rows, total, err := repo.List(model.AuditListQuery{})
	assert.NoError(t, err)
	assert.Equal(t, 4, total)
	assert.Equal(t, []string{"aud-0004", "aud-0003", "aud-0002", "aud-0001"}, auditIDsOf(rows),
		"newest first, by created_at -- not by id and not by insertion order")
}

func TestAuditPGRepository_Filters(t *testing.T) {
	newPGHarness(t)
	repo := NewAuditPGRepository()

	assert.NoError(t, repo.Insert(newAuditEntry(1, "admin", "Asset created", "asset", "asset-1", "2026-09-01T10:00:00Z")))
	assert.NoError(t, repo.Insert(newAuditEntry(2, "admin", "Asset assigned", "asset", "asset-2", "2026-09-02T10:00:00Z")))
	assert.NoError(t, repo.Insert(newAuditEntry(3, "admin", "Ticket created", "ticket", "tkt-1", "2026-09-03T10:00:00Z")))
	assert.NoError(t, repo.Insert(newAuditEntry(4, "admin", "Handover initiated", "asset_handover", "aho-1", "2026-09-04T10:00:00Z")))

	t.Run("entityType narrows to one domain", func(t *testing.T) {
		rows, total, err := repo.List(model.AuditListQuery{EntityType: "asset"})
		assert.NoError(t, err)
		assert.Equal(t, 2, total)
		assert.Equal(t, []string{"aud-0002", "aud-0001"}, auditIDsOf(rows))
	})

	// The three entity types are distinct values, and "asset" is a prefix of "asset_handover".
	// A LIKE-based filter would fold them together; this is an equality filter and must not.
	t.Run("entityType is exact, so asset does not match asset_handover", func(t *testing.T) {
		_, total, err := repo.List(model.AuditListQuery{EntityType: "asset"})
		assert.NoError(t, err)
		assert.Equal(t, 2, total, "asset_handover must not be swept in by a prefix match")

		_, handovers, err := repo.List(model.AuditListQuery{EntityType: "asset_handover"})
		assert.NoError(t, err)
		assert.Equal(t, 1, handovers)
	})

	t.Run("entityId narrows to one record", func(t *testing.T) {
		rows, total, err := repo.List(model.AuditListQuery{EntityID: "asset-2"})
		assert.NoError(t, err)
		assert.Equal(t, 1, total)
		assert.Equal(t, "Asset assigned", rows[0].Action)
	})

	// The pair is how a detail screen asks for one record's history.
	t.Run("entityType and entityId combine with AND", func(t *testing.T) {
		_, total, err := repo.List(model.AuditListQuery{EntityType: "ticket", EntityID: "asset-1"})
		assert.NoError(t, err)
		assert.Equal(t, 0, total, "a ticket filter with an asset's id must match nothing")

		_, match, err := repo.List(model.AuditListQuery{EntityType: "asset", EntityID: "asset-1"})
		assert.NoError(t, err)
		assert.Equal(t, 1, match)
	})

	t.Run("no filter returns every entry", func(t *testing.T) {
		_, total, err := repo.List(model.AuditListQuery{})
		assert.NoError(t, err)
		assert.Equal(t, 4, total)
	})
}

func TestAuditPGRepository_Pagination(t *testing.T) {
	newPGHarness(t)
	repo := NewAuditPGRepository()

	for i := 1; i <= 10; i++ {
		assert.NoError(t, repo.Insert(newAuditEntry(i, "admin", fmt.Sprintf("Action %d", i),
			"asset", "asset-1", fmt.Sprintf("2026-09-%02dT10:00:00Z", i))))
	}

	t.Run("a page is one page while total stays the full count", func(t *testing.T) {
		rows, total, err := repo.List(model.AuditListQuery{Limit: 4})
		assert.NoError(t, err)
		assert.Len(t, rows, 4)
		assert.Equal(t, 10, total)
		assert.Equal(t, []string{"aud-0010", "aud-0009", "aud-0008", "aud-0007"}, auditIDsOf(rows))
	})

	t.Run("paging covers every entry exactly once, newest first", func(t *testing.T) {
		var seen []string
		for page := 1; ; page++ {
			rows, _, err := repo.List(model.AuditListQuery{Limit: 4, Page: page})
			assert.NoError(t, err)
			if len(rows) == 0 {
				break
			}
			seen = append(seen, auditIDsOf(rows)...)
			if page > 5 {
				t.Fatal("paging did not terminate")
			}
		}
		var want []string
		for i := 10; i >= 1; i-- {
			want = append(want, fmt.Sprintf("aud-%04d", i))
		}
		assert.Equal(t, want, seen)
	})

	t.Run("total reflects the filter, not the table", func(t *testing.T) {
		assert.NoError(t, repo.Insert(newAuditEntry(99, "admin", "Ticket created", "ticket", "tkt-9", "2026-09-30T10:00:00Z")))

		_, total, err := repo.List(model.AuditListQuery{EntityType: "asset", Limit: 2})
		assert.NoError(t, err)
		assert.Equal(t, 10, total, "11 rows exist, 10 match the filter, 2 are returned")
	})
}

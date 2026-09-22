package repository

// Integration-test harness for the PostgreSQL repositories.
//
// WHY THIS EXISTS. Before it, 17 of the 18 files in this package had no automated coverage at all
// (the exception being migration.go, added 2026-09-18). The pagination SQL shipped in PR #129 was
// verified exactly once, by hand, against the live stack on 2026-09-16 -- a real check, but one
// nothing repeats. Every other test in this module stops at the service layer, driven by in-memory
// mocks, so no test has ever executed a line of the SQL in model/*.go against a real server.
//
// WHY IT SKIPS BY DEFAULT. These tests need a real PostgreSQL, which `go test ./...` on a laptop
// cannot assume. Absent configuration they skip, so the default developer and CI experience is
// unchanged; CI opts in by starting a postgres service and setting the variables below (see
// .github/workflows/ci.yml). A skipped test is honest about what it did not check -- it is not a
// pass.
//
// CONFIGURATION. Set RAISE_TEST_PG_HOST, and optionally _PORT, _USER, _PASS, _DB.
// Against the project's own dev stack:
//
//	docker exec stl_asset_pj-db-1 psql -U raise -d postgres -c "CREATE DATABASE raise_test;"
//	RAISE_TEST_PG_HOST=localhost RAISE_TEST_PG_USER=raise \
//	  RAISE_TEST_PG_PASS=raise_dev_password go test -count=1 ./repository/
//
// SAFETY. The harness TRUNCATES every table it knows about between tests, so pointing it at a
// database holding real data would destroy it. It therefore refuses any database whose name does
// not end in `_test`, and fails loudly rather than skipping -- a misconfigured run must not look
// like an absent one. That guard is the reason the variables are named RAISE_TEST_PG_* instead of
// reusing DB_PG_*: no value already present in a developer's shell or .env can steer these tests
// onto a real database by accident.

import (
	"database/sql"
	"fmt"
	"os"
	"strings"
	"testing"

	"github.com/spf13/viper"
)

// truncatedTables lists every table the migrations create, in no particular order -- TRUNCATE with
// CASCADE handles ordering. Kept literal rather than discovered from information_schema so that a
// new migration's table is a deliberate addition here, not something silently wiped.
var truncatedTables = []string{
	"samplemodel",
	"assets",
	"employees",
	"tickets",
	"technicians",
	"audit_logs",
	"asset_handovers",
}

type pgHarness struct {
	t  *testing.T
	DB *sql.DB
}

// newPGHarness connects to the configured test database, brings its schema up to date, and empties
// it. It skips the test when no test database is configured, and fails it when one is configured
// wrongly.
func newPGHarness(t *testing.T) *pgHarness {
	t.Helper()

	host := strings.TrimSpace(os.Getenv("RAISE_TEST_PG_HOST"))
	if host == "" {
		t.Skip("RAISE_TEST_PG_HOST not set -- skipping PostgreSQL integration tests (see pgharness_test.go)")
	}

	dbName := envOr("RAISE_TEST_PG_DB", "raise_test")
	// Loud, not silent: a misconfigured run must not be mistaken for an absent one.
	if !strings.HasSuffix(dbName, "_test") {
		t.Fatalf("refusing to run against database %q: these tests TRUNCATE every table, so the "+
			"database name must end in \"_test\"", dbName)
	}

	viper.Set("DB_PG_SERVER", host)
	viper.Set("DB_PG_PORT", envOr("RAISE_TEST_PG_PORT", "5432"))
	viper.Set("DB_PG_USER", envOr("RAISE_TEST_PG_USER", "raise"))
	viper.Set("DB_PG_PASS", envOr("RAISE_TEST_PG_PASS", "raise_dev_password"))
	viper.Set("DB_PG_INST", dbName)
	viper.Set("DB_PG_SCHEMA", "public")
	viper.Set("DB_PG_SSLMODE", "disable")
	viper.Set("DB_PG_REPLICAS", "")

	db, err := GetPGWriteDb()
	if err != nil {
		t.Fatalf("cannot reach the test database at %s:%s/%s: %v",
			host, envOr("RAISE_TEST_PG_PORT", "5432"), dbName, err)
	}

	h := &pgHarness{t: t, DB: db}
	h.migrate()
	h.truncate()
	return h
}

// migrate brings the test database's schema up to date using the same runner the application uses,
// reading the migration files from disk rather than the binary's embedded copy (that embed lives in
// package main, and a test binary has no access to it). Running the real runner means these tests
// also exercise it against a real server on every run.
func (h *pgHarness) migrate() {
	h.t.Helper()
	if _, err := RunPGMigrations(h.DB, os.DirFS("../sql"), "pg", MigrateOptions{Baseline: -1}); err != nil {
		h.t.Fatalf("migrating the test database failed: %v", err)
	}
}

// truncate empties every known table. RESTART IDENTITY keeps sequences from drifting across runs;
// CASCADE means the table order above does not matter.
func (h *pgHarness) truncate() {
	h.t.Helper()
	stmt := fmt.Sprintf("TRUNCATE %s RESTART IDENTITY CASCADE", strings.Join(truncatedTables, ", "))
	if _, err := h.DB.Exec(stmt); err != nil {
		h.t.Fatalf("truncating the test database failed: %v", err)
	}
}

// exec runs a statement against the test database, failing the test on error. For arranging
// fixtures that have no repository Insert of their own.
func (h *pgHarness) exec(query string, args ...any) {
	h.t.Helper()
	if _, err := h.DB.Exec(query, args...); err != nil {
		h.t.Fatalf("test setup statement failed: %v\n%s", err, query)
	}
}

func envOr(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

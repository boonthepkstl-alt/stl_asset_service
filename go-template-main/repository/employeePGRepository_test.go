package repository

// The first tests to run this package's SQL against a real PostgreSQL server.
//
// They concentrate on List's pagination and count behaviour, because that is the specific thing
// with no repeatable coverage: PR #129 added LIMIT/OFFSET to three domains, the service-layer tests
// that cover it exercise in-memory mocks rather than SQL, and the only execution against a real
// server was a manual pass on 2026-09-16 that nothing repeats.
//
// The property worth guarding hardest is that `total` stays the FULL filtered count while `data` is
// one page of it. A mock cannot prove it -- the mock computes both from the same slice -- and
// getting it wrong is silent: every page looks right in isolation and the page count is wrong.
// PR #129 deliberately left SQL_employee_pg_count_base unpaginated for exactly this reason, and
// four documents had described that decision incorrectly before PR #132 corrected them.
//
// Skips unless a test database is configured -- see pgharness_test.go.

import (
	"fmt"
	"testing"

	"singer/go-template-new-2026-06/model"

	"github.com/stretchr/testify/assert"
)

// seedEmployees inserts n employees through the real repository, numbered so that ordering is
// predictable: the list query sorts by employee_code, and zero-padding keeps lexical order equal to
// numeric order (the trap V10-vs-V2 sprang on the migration runner).
func seedEmployees(t *testing.T, repo EmployeePGRepository, n int, department string) []string {
	t.Helper()
	codes := make([]string, 0, n)
	for i := 1; i <= n; i++ {
		code := fmt.Sprintf("EMP-%04d", i)
		err := repo.Insert(model.EmployeeModel{
			ID:              fmt.Sprintf("emp-%04d", i),
			EmployeeCode:    code,
			Name:            fmt.Sprintf("Employee %04d", i),
			Email:           fmt.Sprintf("emp%04d@example.invalid", i),
			Phone:           "+66 2 000 0000",
			JobTitle:        "Tester",
			Title:           "Tester",
			Department:      department,
			DepartmentID:    "DEPT-TEST",
			Location:        "HQ",
			DeskLocation:    "Desk",
			Manager:         "Manager",
			ManagerID:       "",
			Status:          "Active",
			AvatarColor:     "#888888",
			Initials:        "TE",
			StartDate:       "2026-01-01",
			WorkstationType: "Laptop",
			PrimaryOS:       "Windows",
			AssignedCount:   0,
		})
		if err != nil {
			t.Fatalf("seeding employee %s failed: %v", code, err)
		}
		codes = append(codes, code)
	}
	return codes
}

func codesOf(rows []model.EmployeeModel) []string {
	out := make([]string, 0, len(rows))
	for _, r := range rows {
		out = append(out, r.EmployeeCode)
	}
	return out
}

func TestEmployeePGRepository_ListPagination(t *testing.T) {
	newPGHarness(t)
	repo := NewEmployeePGRepository()
	all := seedEmployees(t, repo, 25, "Engineering")

	t.Run("no limit returns every row, and total matches", func(t *testing.T) {
		rows, total, err := repo.List(model.EmployeeListQuery{})
		assert.NoError(t, err)
		assert.Equal(t, 25, total)
		assert.Len(t, rows, 25, "an unparameterised list is unbounded by design -- see CHECKPOINT-2026-09-18-001")
	})

	t.Run("a page is one page, while total stays the full count", func(t *testing.T) {
		rows, total, err := repo.List(model.EmployeeListQuery{Limit: 10})
		assert.NoError(t, err)
		assert.Len(t, rows, 10)
		assert.Equal(t, 25, total, "total must be the full filtered count, never the size of the page returned")
		assert.Equal(t, all[0:10], codesOf(rows))
	})

	t.Run("page advances the offset by exactly one page", func(t *testing.T) {
		rows, total, err := repo.List(model.EmployeeListQuery{Limit: 10, Page: 2})
		assert.NoError(t, err)
		assert.Equal(t, 25, total)
		assert.Equal(t, all[10:20], codesOf(rows))
	})

	t.Run("the last page may be partial", func(t *testing.T) {
		rows, total, err := repo.List(model.EmployeeListQuery{Limit: 10, Page: 3})
		assert.NoError(t, err)
		assert.Equal(t, 25, total)
		assert.Len(t, rows, 5)
		assert.Equal(t, all[20:25], codesOf(rows))
	})

	// A page past the end is an ordinary empty page. If this ever became an error, every client
	// paging to the end would start failing at the boundary instead of finishing.
	t.Run("a page past the end is empty, not an error", func(t *testing.T) {
		rows, total, err := repo.List(model.EmployeeListQuery{Limit: 10, Page: 99})
		assert.NoError(t, err)
		assert.Equal(t, 25, total)
		assert.Empty(t, rows)
	})

	t.Run("page 0 and page 1 are the same page", func(t *testing.T) {
		first, _, err := repo.List(model.EmployeeListQuery{Limit: 5, Page: 1})
		assert.NoError(t, err)
		zero, _, err := repo.List(model.EmployeeListQuery{Limit: 5, Page: 0})
		assert.NoError(t, err)
		assert.Equal(t, codesOf(first), codesOf(zero), "page<=0 defaults to page 1")
	})

	// Every page concatenated must reproduce the unpaginated list exactly -- no row skipped, none
	// served twice. Off-by-one offsets pass every single-page assertion above and fail here.
	t.Run("paging through covers every row exactly once", func(t *testing.T) {
		var seen []string
		for page := 1; ; page++ {
			rows, _, err := repo.List(model.EmployeeListQuery{Limit: 7, Page: page})
			assert.NoError(t, err)
			if len(rows) == 0 {
				break
			}
			seen = append(seen, codesOf(rows)...)
			if page > 10 {
				t.Fatal("paging did not terminate")
			}
		}
		assert.Equal(t, all, seen)
	})
}

func TestEmployeePGRepository_ListFilterWithPagination(t *testing.T) {
	h := newPGHarness(t)
	repo := NewEmployeePGRepository()
	seedEmployees(t, repo, 12, "Engineering")

	// A second department, so the filter has something to exclude. Without this the filter case
	// proves only that the query ran -- the trap the 2026-09-16 manual pass fell into, where all
	// five seeded employees happened to share one department.
	h.exec(`INSERT INTO employees (id, employee_code, name, email, phone, job_title, title,
		department, department_id, location, desk_location, manager, manager_id, status,
		avatar_color, initials, start_date, workstation_type, primary_os, assigned_count)
		VALUES ('emp-fin-1', 'EMP-9001', 'Finance One', 'fin1@example.invalid', '+66 2 000 0000',
		'Analyst', 'Analyst', 'Finance', 'DEPT-FIN', 'HQ', 'Desk', 'Manager', '', 'Active',
		'#888888', 'FO', '2026-01-01', 'Laptop', 'Windows', 0)`)

	t.Run("the filter actually discriminates", func(t *testing.T) {
		_, total, err := repo.List(model.EmployeeListQuery{Department: "Engineering"})
		assert.NoError(t, err)
		assert.Equal(t, 12, total, "the Finance employee must be excluded")

		_, allTotal, err := repo.List(model.EmployeeListQuery{})
		assert.NoError(t, err)
		assert.Equal(t, 13, allTotal)
	})

	t.Run("total is the filtered count, not the table count, when a page is requested", func(t *testing.T) {
		rows, total, err := repo.List(model.EmployeeListQuery{Department: "Engineering", Limit: 5})
		assert.NoError(t, err)
		assert.Len(t, rows, 5)
		assert.Equal(t, 12, total, "filter and pagination must compose: 12 matches, 5 returned")
	})

	t.Run("a filter matching nothing returns an empty page and a zero total", func(t *testing.T) {
		rows, total, err := repo.List(model.EmployeeListQuery{Department: "Nonexistent", Limit: 5})
		assert.NoError(t, err)
		assert.Empty(t, rows)
		assert.Equal(t, 0, total)
	})
}

// The repository scans several nullable columns into plain strings, so a row written outside the
// application -- a manual fix, an import, a future migration's backfill -- can make List fail
// wholesale. Found incidentally on 2026-09-18 while seeding data by hand
// (CHECKPOINT-2026-09-18-001) and recorded then without a test. This pins the current behaviour so
// the day someone decides to handle NULLs, the change is visible rather than silent.
func TestEmployeePGRepository_ListFailsOnNullNullableColumn(t *testing.T) {
	h := newPGHarness(t)
	repo := NewEmployeePGRepository()

	h.exec(`INSERT INTO employees (id, employee_code, name, email, department, location, start_date)
		VALUES ('emp-null', 'EMP-8001', 'Null Phone', 'null@example.invalid', 'Engineering', 'HQ', '2026-01-01')`)

	_, _, err := repo.List(model.EmployeeListQuery{})
	assert.Error(t, err, "documents today's behaviour: a NULL in a nullable column fails the whole list")
	if err != nil {
		assert.Contains(t, err.Error(), "converting NULL to string",
			"if this message changes, NULL handling changed -- update this test deliberately")
	}
}

package service

import (
	"errors"
	"fmt"
	"singer/go-template-new-2026-06/model"
	"sort"
	"testing"

	"github.com/stretchr/testify/assert"
)

// mockEmployeeRepository is an in-memory stand-in for EmployeeRepository, same pattern as
// mockAssetRepository -- no live DB required to run these tests.
type mockEmployeeRepository struct {
	employees map[string]model.EmployeeModel
}

func newMockEmployeeRepository() *mockEmployeeRepository {
	return &mockEmployeeRepository{employees: map[string]model.EmployeeModel{}}
}

func (m *mockEmployeeRepository) Create(employee model.EmployeeModel) error {
	m.employees[employee.ID] = employee
	return nil
}

func (m *mockEmployeeRepository) GetByID(id string) (model.EmployeeModel, error) {
	if e, ok := m.employees[id]; ok {
		return e, nil
	}
	for _, e := range m.employees {
		if e.EmployeeCode == id {
			return e, nil
		}
	}
	return model.EmployeeModel{}, errors.New("not found")
}

func (m *mockEmployeeRepository) Update(id string, employee model.EmployeeModel) (bool, error) {
	if _, ok := m.employees[id]; !ok {
		return false, nil
	}
	m.employees[id] = employee
	return true, nil
}

func (m *mockEmployeeRepository) Delete(id string) (bool, error) {
	if _, ok := m.employees[id]; !ok {
		return false, nil
	}
	delete(m.employees, id)
	return true, nil
}

// List applies the same pagination semantics as employeePGRepository.List / the real
// employees SQL (ORDER BY employee_code, then LIMIT/OFFSET), so service-level tests can
// exercise real page/limit behavior without a live Postgres connection (there is no
// repository-level test harness for any PG repository in this codebase -- this mock is the
// closest thing to one). Filters (Search/Department/Location/Status) are unaffected by this
// change and remain unapplied here, matching this mock's existing (pre-pagination-hardening)
// fidelity level -- a pre-existing gap, not introduced or fixed by this change.
func (m *mockEmployeeRepository) List(query model.EmployeeListQuery) ([]model.EmployeeModel, int, error) {
	items := make([]model.EmployeeModel, 0, len(m.employees))
	for _, e := range m.employees {
		items = append(items, e)
	}
	sort.Slice(items, func(i, j int) bool { return items[i].EmployeeCode < items[j].EmployeeCode })

	total := len(items)
	limit := query.Limit
	if limit <= 0 {
		limit = total
		if limit <= 0 {
			limit = 1
		}
	}
	page := query.Page
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	if offset >= len(items) {
		return []model.EmployeeModel{}, total, nil
	}
	end := offset + limit
	if end > len(items) {
		end = len(items)
	}
	return items[offset:end], total, nil
}

func TestCreateEmployee_DefaultsMatchMockEmployeeRepository(t *testing.T) {
	svc := NewEmployeeService(newMockEmployeeRepository())

	created, err := svc.CreateEmployee(model.CreateEmployeeRequest{
		Name:       "Sarah Chen",
		Email:      "sarah.chen@example.com",
		Department: "Engineering",
		Location:   "HQ",
	})

	assert.NoError(t, err)
	assert.NotEmpty(t, created.ID)
	assert.NotEmpty(t, created.EmployeeCode)
	// Same defaulting behavior as frontend/src/services/employee-repository.ts's
	// MockEmployeeRepository.create.
	assert.Equal(t, "+1 (555) 000-0000", created.Phone)
	assert.Equal(t, "Staff Specialist", created.JobTitle)
	assert.Equal(t, "Staff Specialist", created.Title)
	assert.Equal(t, "Open Desk", created.DeskLocation)
	assert.Equal(t, "Active", created.Status)
	assert.Equal(t, "SC", created.Initials)
	assert.Equal(t, 0, created.AssignedCount)
}

func TestCreateEmployee_RespectsSuppliedOptionalFields(t *testing.T) {
	svc := NewEmployeeService(newMockEmployeeRepository())

	created, err := svc.CreateEmployee(model.CreateEmployeeRequest{
		Name:     "Marcus Johnson",
		Email:    "marcus@example.com",
		JobTitle: "Senior Engineer",
		Phone:    "+66 12 345 6789",
		Status:   "On Leave",
	})

	assert.NoError(t, err)
	assert.Equal(t, "Senior Engineer", created.JobTitle)
	assert.Equal(t, "+66 12 345 6789", created.Phone)
	assert.Equal(t, "On Leave", created.Status)
}

func TestUpdateEmployee_OnlyOverwritesSuppliedFields(t *testing.T) {
	repo := newMockEmployeeRepository()
	svc := NewEmployeeService(repo)

	created, err := svc.CreateEmployee(model.CreateEmployeeRequest{
		Name:       "James Wilson",
		Email:      "james@example.com",
		Department: "Sales",
		Location:   "Boston Branch",
		Phone:      "+1 111 111 1111",
	})
	assert.NoError(t, err)

	newDept := "Marketing"
	updated, err := svc.UpdateEmployee(created.ID, model.UpdateEmployeeRequest{
		Department: &newDept,
	})

	assert.NoError(t, err)
	assert.Equal(t, "Marketing", updated.Department)
	// Untouched fields survive exactly as they were.
	assert.Equal(t, "Sales", created.Department) // sanity: original struct unmutated
	assert.Equal(t, "Boston Branch", updated.Location)
	assert.Equal(t, "+1 111 111 1111", updated.Phone)
}

func TestUpdateEmployee_UnknownIDReturnsNotFound(t *testing.T) {
	svc := NewEmployeeService(newMockEmployeeRepository())

	newDept := "Engineering"
	_, err := svc.UpdateEmployee("does-not-exist", model.UpdateEmployeeRequest{Department: &newDept})

	assert.ErrorIs(t, err, ErrEmployeeNotFound)
}

func TestListEmployees_ReturnsDataAndTotal(t *testing.T) {
	svc := NewEmployeeService(newMockEmployeeRepository())

	_, _ = svc.CreateEmployee(model.CreateEmployeeRequest{Name: "Employee One", Email: "one@example.com"})
	_, _ = svc.CreateEmployee(model.CreateEmployeeRequest{Name: "Employee Two", Email: "two@example.com"})

	resp, err := svc.ListEmployees(model.EmployeeListQuery{})

	assert.NoError(t, err)
	assert.Equal(t, 2, resp.Total)
	assert.Len(t, resp.Data, 2)
}

// Regression guard for the backend parity fix shipped in PR #80. Before it,
// CreateEmployee always overwrote input.EmployeeCode with a generated value, so the
// optional "Employee Code" field on the Create Employee form was silently discarded
// server-side -- the frontend field would have been purely cosmetic. That fix was
// verified live against the running stack but never covered by a unit test (recorded in
// DEVELOPMENT-LOG.md #80 as "No Go unit test covers the newly-honoured path"), which is
// what this closes. Mirrors AssetService.CreateAsset's supplied-code behaviour.
func TestCreateEmployee_EmployeeCode(t *testing.T) {
	t.Run("honours a supplied code verbatim", func(t *testing.T) {
		svc := NewEmployeeService(newMockEmployeeRepository())

		// 8 digits, first 2 = Gregorian join year -- the company's real convention,
		// confirmed 2026-09-03 and enforced by the frontend since PR #81 (F-36).
		created, err := svc.CreateEmployee(model.CreateEmployeeRequest{
			Name:         "Priya Raman",
			Email:        "priya@example.com",
			EmployeeCode: "26725898",
		})

		assert.NoError(t, err)
		assert.Equal(t, "26725898", created.EmployeeCode)
		assert.NotContains(t, created.EmployeeCode, "EMP-", "a supplied code must not be replaced by a generated one")
	})

	t.Run("generates a code when none is supplied", func(t *testing.T) {
		svc := NewEmployeeService(newMockEmployeeRepository())

		created, err := svc.CreateEmployee(model.CreateEmployeeRequest{
			Name:  "Priya Raman",
			Email: "priya@example.com",
		})

		assert.NoError(t, err)
		// Asserting the shape, not just non-emptiness: the fallback is what F-36 records as
		// still emitting the legacy EMP-<8> form the frontend's own 8-digit check rejects.
		// If that is ever changed, this test should fail and force the decision to surface.
		assert.Regexp(t, `^EMP-[0-9a-f]{8}$`, created.EmployeeCode)
	})
}

// seedEmployeesForPagination seeds n employees directly into the mock repo (bypassing
// CreateEmployee, whose generated codes aren't predictable) with EmployeeCode "EMP-01".."EMP-0n"
// so ordering (ORDER BY employee_code, matching the real SQL) is deterministic and known ahead
// of time.
func seedEmployeesForPagination(t *testing.T, repo *mockEmployeeRepository, n int) {
	t.Helper()
	for i := 1; i <= n; i++ {
		code := fmt.Sprintf("EMP-%02d", i)
		repo.employees[code] = model.EmployeeModel{ID: code, EmployeeCode: code, Name: code}
	}
}

func codesOf(items []model.EmployeeModel) []string {
	codes := make([]string, len(items))
	for i, e := range items {
		codes[i] = e.EmployeeCode
	}
	return codes
}

// Pagination hardening (2026-09-11, Finding: employees/tickets/asset_handovers list queries had
// no LIMIT/OFFSET at all). These cover the eight scenarios called for: default, explicit limit,
// explicit page, boundary, empty, filters-alongside-pagination, deterministic ordering, and
// confirmation that pre-existing (non-pagination) behavior is untouched.
func TestListEmployees_Pagination(t *testing.T) {
	t.Run("default (no page/limit) returns everything, preserving pre-hardening behavior", func(t *testing.T) {
		repo := newMockEmployeeRepository()
		seedEmployeesForPagination(t, repo, 5)
		svc := NewEmployeeService(repo)

		resp, err := svc.ListEmployees(model.EmployeeListQuery{})

		assert.NoError(t, err)
		assert.Equal(t, 5, resp.Total)
		assert.Len(t, resp.Data, 5)
		assert.Equal(t, []string{"EMP-01", "EMP-02", "EMP-03", "EMP-04", "EMP-05"}, codesOf(resp.Data))
	})

	t.Run("explicit limit narrows the page without changing total", func(t *testing.T) {
		repo := newMockEmployeeRepository()
		seedEmployeesForPagination(t, repo, 5)
		svc := NewEmployeeService(repo)

		resp, err := svc.ListEmployees(model.EmployeeListQuery{Limit: 2})

		assert.NoError(t, err)
		assert.Equal(t, 5, resp.Total, "total reflects the full matching set, not just this page")
		assert.Equal(t, []string{"EMP-01", "EMP-02"}, codesOf(resp.Data))
	})

	t.Run("explicit page advances the offset", func(t *testing.T) {
		repo := newMockEmployeeRepository()
		seedEmployeesForPagination(t, repo, 5)
		svc := NewEmployeeService(repo)

		resp, err := svc.ListEmployees(model.EmployeeListQuery{Limit: 2, Page: 2})

		assert.NoError(t, err)
		assert.Equal(t, 5, resp.Total)
		assert.Equal(t, []string{"EMP-03", "EMP-04"}, codesOf(resp.Data))
	})

	t.Run("boundary: last page may be a partial page", func(t *testing.T) {
		repo := newMockEmployeeRepository()
		seedEmployeesForPagination(t, repo, 5)
		svc := NewEmployeeService(repo)

		resp, err := svc.ListEmployees(model.EmployeeListQuery{Limit: 2, Page: 3})

		assert.NoError(t, err)
		assert.Equal(t, 5, resp.Total)
		assert.Equal(t, []string{"EMP-05"}, codesOf(resp.Data))
	})

	t.Run("boundary: a page entirely past the end returns an empty page, not an error", func(t *testing.T) {
		repo := newMockEmployeeRepository()
		seedEmployeesForPagination(t, repo, 5)
		svc := NewEmployeeService(repo)

		resp, err := svc.ListEmployees(model.EmployeeListQuery{Limit: 2, Page: 10})

		assert.NoError(t, err)
		assert.Equal(t, 5, resp.Total, "total is unaffected by requesting a page past the end")
		assert.Empty(t, resp.Data)
	})

	t.Run("empty result: no employees at all, with pagination params supplied", func(t *testing.T) {
		svc := NewEmployeeService(newMockEmployeeRepository())

		resp, err := svc.ListEmployees(model.EmployeeListQuery{Limit: 10, Page: 1})

		assert.NoError(t, err)
		assert.Equal(t, 0, resp.Total)
		assert.Empty(t, resp.Data)
	})

	t.Run("a filter query param alongside pagination params does not break the pagination math", func(t *testing.T) {
		// This mock does not apply Search/Department/Location/Status filtering (a pre-existing
		// gap unrelated to and not fixed by this change -- only the real PG query filters), so
		// this asserts pagination still behaves correctly when filter fields are also set on the
		// query, not that filtering itself works here.
		repo := newMockEmployeeRepository()
		seedEmployeesForPagination(t, repo, 5)
		svc := NewEmployeeService(repo)

		resp, err := svc.ListEmployees(model.EmployeeListQuery{Department: "Engineering", Limit: 2, Page: 2})

		assert.NoError(t, err)
		assert.Equal(t, []string{"EMP-03", "EMP-04"}, codesOf(resp.Data))
	})

	t.Run("ordering is deterministic across repeated calls with identical params", func(t *testing.T) {
		repo := newMockEmployeeRepository()
		seedEmployeesForPagination(t, repo, 5)
		svc := NewEmployeeService(repo)

		first, err := svc.ListEmployees(model.EmployeeListQuery{Limit: 3})
		assert.NoError(t, err)
		second, err := svc.ListEmployees(model.EmployeeListQuery{Limit: 3})
		assert.NoError(t, err)

		assert.Equal(t, codesOf(first.Data), codesOf(second.Data))
	})
}

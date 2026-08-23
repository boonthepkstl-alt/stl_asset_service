package service

import (
	"errors"
	"singer/go-template-new-2026-06/model"
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

func (m *mockEmployeeRepository) List(query model.EmployeeListQuery) ([]model.EmployeeModel, int, error) {
	items := make([]model.EmployeeModel, 0, len(m.employees))
	for _, e := range m.employees {
		items = append(items, e)
	}
	return items, len(items), nil
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

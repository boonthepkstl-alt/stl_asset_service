package repository

import "singer/go-template-new-2026-06/model"

// EmployeeRepository -- same 5-method-CRUD, PostgreSQL-only shape as AssetRepository.
type EmployeeRepository interface {
	Create(employee model.EmployeeModel) error
	GetByID(id string) (model.EmployeeModel, error)
	Update(id string, employee model.EmployeeModel) (bool, error)
	Delete(id string) (bool, error)
	List(query model.EmployeeListQuery) ([]model.EmployeeModel, int, error)
}

type employeeRepository struct {
	pg EmployeePGRepository
}

func NewEmployeeRepository(pg EmployeePGRepository) EmployeeRepository {
	return &employeeRepository{pg: pg}
}

func (r *employeeRepository) Create(employee model.EmployeeModel) error {
	return r.pg.Insert(employee)
}

func (r *employeeRepository) GetByID(id string) (model.EmployeeModel, error) {
	return r.pg.GetByID(id)
}

func (r *employeeRepository) Update(id string, employee model.EmployeeModel) (bool, error) {
	return r.pg.Update(id, employee)
}

func (r *employeeRepository) Delete(id string) (bool, error) {
	return r.pg.Delete(id)
}

func (r *employeeRepository) List(query model.EmployeeListQuery) ([]model.EmployeeModel, int, error) {
	return r.pg.List(query)
}

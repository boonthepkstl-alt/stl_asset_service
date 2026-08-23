package model

// EmployeeModel mirrors the frontend Employee type (frontend/src/types/employee.ts)
// field-for-field, same convention as AssetModel -- RAISE-FR-ASSET-003 (custody/assignment)
// depends on Employee records existing as a real domain, not just Asset.assignedTo strings.
// PostgreSQL only, same rationale as Asset: no per-database fan-out for a real domain.
type EmployeeModel struct {
	ID              string `json:"id"`
	EmployeeCode    string `json:"employeeCode"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	Phone           string `json:"phone"`
	JobTitle        string `json:"jobTitle"`
	Title           string `json:"title"`
	Department      string `json:"department"`
	DepartmentID    string `json:"departmentId"`
	Location        string `json:"location"`
	DeskLocation    string `json:"deskLocation"`
	Manager         string `json:"manager"`
	ManagerID       string `json:"managerId"`
	Status          string `json:"status"`
	AvatarColor     string `json:"avatarColor"`
	Initials        string `json:"initials"`
	StartDate       string `json:"startDate"`
	WorkstationType string `json:"workstationType"`
	PrimaryOS       string `json:"primaryOs"`
	AssignedCount   int    `json:"assignedCount"`
}

// EmployeeListQuery mirrors the frontend's EmployeeListQuery (frontend/src/types/employee.ts).
type EmployeeListQuery struct {
	Search     string `query:"search"`
	Department string `query:"department"`
	Location   string `query:"location"`
	Status     string `query:"status"`
}

// EmployeeListResponse mirrors the frontend's EmployeeListResult shape ({data, total}), same
// as AssetListResponse.
type EmployeeListResponse struct {
	Data  []EmployeeModel `json:"data"`
	Total int             `json:"total"`
}

// CreateEmployeeRequest mirrors the frontend's CreateEmployeeInput.
type CreateEmployeeRequest struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	JobTitle     string `json:"jobTitle,omitempty"`
	Phone        string `json:"phone,omitempty"`
	Department   string `json:"department"`
	Location     string `json:"location"`
	DeskLocation string `json:"deskLocation,omitempty"`
	Manager      string `json:"manager,omitempty"`
	Status       string `json:"status,omitempty"`
}

// UpdateEmployeeRequest mirrors the frontend's UpdateEmployeeInput -- every field optional
// (pointer) so the service can distinguish "not supplied" from "cleared to empty string",
// matching MockEmployeeRepository.update's `input.field ?? existing.field` behavior exactly.
type UpdateEmployeeRequest struct {
	JobTitle     *string `json:"jobTitle,omitempty"`
	Department   *string `json:"department,omitempty"`
	Location     *string `json:"location,omitempty"`
	DeskLocation *string `json:"deskLocation,omitempty"`
	Phone        *string `json:"phone,omitempty"`
	Manager      *string `json:"manager,omitempty"`
	Status       *string `json:"status,omitempty"`
}

// PostgreSQL SQL -- the only engine this domain targets.
var SQL_employee_pg_get = `SELECT id, employee_code, name, email, phone, job_title, title, department, department_id, location, desk_location, manager, manager_id, status, avatar_color, initials, start_date, workstation_type, primary_os, assigned_count FROM employees WHERE id = $1 OR employee_code = $1`

var SQL_employee_pg_insert = `INSERT INTO employees (id, employee_code, name, email, phone, job_title, title, department, department_id, location, desk_location, manager, manager_id, status, avatar_color, initials, start_date, workstation_type, primary_os, assigned_count)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`

var SQL_employee_pg_update = `UPDATE employees SET job_title = $1, title = $2, department = $3, location = $4, desk_location = $5, phone = $6, manager = $7, status = $8 WHERE id = $9`

var SQL_employee_pg_delete = `DELETE FROM employees WHERE id = $1`

var SQL_employee_pg_count_base = `SELECT COUNT(*) FROM employees WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR job_title ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%' OR department ILIKE '%' || $1 || '%' OR employee_code ILIKE '%' || $1 || '%') AND ($2 = '' OR department = $2) AND ($3 = '' OR location = $3) AND ($4 = '' OR status = $4)`

var SQL_employee_pg_list_base = `SELECT id, employee_code, name, email, phone, job_title, title, department, department_id, location, desk_location, manager, manager_id, status, avatar_color, initials, start_date, workstation_type, primary_os, assigned_count FROM employees WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR job_title ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%' OR department ILIKE '%' || $1 || '%' OR employee_code ILIKE '%' || $1 || '%') AND ($2 = '' OR department = $2) AND ($3 = '' OR location = $3) AND ($4 = '' OR status = $4) ORDER BY employee_code`

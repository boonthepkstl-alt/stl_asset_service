package repository

import (
	"context"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
)

type EmployeePGRepository interface {
	Insert(employee model.EmployeeModel) error
	GetByID(id string) (model.EmployeeModel, error)
	Update(id string, employee model.EmployeeModel) (bool, error)
	Delete(id string) (bool, error)
	List(query model.EmployeeListQuery) ([]model.EmployeeModel, int, error)
}

type employeePGRepository struct{}

func NewEmployeePGRepository() EmployeePGRepository {
	return &employeePGRepository{}
}

func scanEmployee(row interface{ Scan(dest ...any) error }) (model.EmployeeModel, error) {
	var e model.EmployeeModel
	err := row.Scan(
		&e.ID, &e.EmployeeCode, &e.Name, &e.Email, &e.Phone, &e.JobTitle, &e.Title,
		&e.Department, &e.DepartmentID, &e.Location, &e.DeskLocation, &e.Manager, &e.ManagerID,
		&e.Status, &e.AvatarColor, &e.Initials, &e.StartDate, &e.WorkstationType, &e.PrimaryOS,
		&e.AssignedCount,
	)
	if err != nil {
		return model.EmployeeModel{}, err
	}
	return e, nil
}

func (r *employeePGRepository) GetByID(id string) (model.EmployeeModel, error) {
	log := logger.GetLogger()
	log.Debugf("employee PG get id=%s", id)

	rdb, err := GetPGReadDB()
	if err != nil {
		return model.EmployeeModel{}, err
	}

	row := rdb.DB.QueryRowContext(context.Background(), model.SQL_employee_pg_get, id)
	employee, err := scanEmployee(row)
	if err != nil {
		log.Errorf("employee PG get scan: %v", err)
		return model.EmployeeModel{}, err
	}

	log.Infof("read served by %s (employee get id=%s)", rdb.Label, id)
	return employee, nil
}

func (r *employeePGRepository) List(query model.EmployeeListQuery) ([]model.EmployeeModel, int, error) {
	log := logger.GetLogger()
	log.Debugf("employee PG list query=%+v", query)

	rdb, err := GetPGReadDB()
	if err != nil {
		return nil, 0, err
	}
	ctx := context.Background()

	var total int
	if err = rdb.DB.QueryRowContext(ctx, model.SQL_employee_pg_count_base, query.Search, query.Department, query.Location, query.Status).Scan(&total); err != nil {
		log.Errorf("employee PG count query: %v", err)
		return nil, 0, err
	}

	rows, err := rdb.DB.QueryContext(ctx, model.SQL_employee_pg_list_base, query.Search, query.Department, query.Location, query.Status)
	if err != nil {
		log.Errorf("employee PG list query: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	items := []model.EmployeeModel{}
	for rows.Next() {
		employee, err := scanEmployee(rows)
		if err != nil {
			log.Errorf("employee PG list scan: %v", err)
			return nil, 0, err
		}
		items = append(items, employee)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	log.Infof("read served by %s (employee list total=%d)", rdb.Label, total)
	return items, total, nil
}

func (r *employeePGRepository) Insert(employee model.EmployeeModel) error {
	log := logger.GetLogger()
	log.Debugf("employee PG insert id=%s", employee.ID)

	db, err := GetPGWriteDb()
	if err != nil {
		return err
	}

	stmt, err := db.Prepare(model.SQL_employee_pg_insert)
	if err != nil {
		log.Errorf("employee PG insert prepare: %v", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		employee.ID, employee.EmployeeCode, employee.Name, employee.Email, employee.Phone,
		employee.JobTitle, employee.Title, employee.Department, employee.DepartmentID,
		employee.Location, employee.DeskLocation, employee.Manager, employee.ManagerID,
		employee.Status, employee.AvatarColor, employee.Initials, employee.StartDate,
		employee.WorkstationType, employee.PrimaryOS, employee.AssignedCount,
	)
	if err != nil {
		log.Errorf("employee PG insert exec: %v", err)
		return err
	}

	log.Infof("write served by MASTER (employee insert id=%s)", employee.ID)
	return nil
}

func (r *employeePGRepository) Update(id string, employee model.EmployeeModel) (bool, error) {
	log := logger.GetLogger()
	log.Debugf("employee PG update id=%s", id)

	db, err := GetPGWriteDb()
	if err != nil {
		return false, err
	}
	ctx := context.Background()

	stmt, err := db.PrepareContext(ctx, model.SQL_employee_pg_update)
	if err != nil {
		log.Errorf("employee PG update prepare: %v", err)
		return false, err
	}
	defer stmt.Close()

	result, err := stmt.ExecContext(ctx,
		employee.JobTitle, employee.Title, employee.Department, employee.Location,
		employee.DeskLocation, employee.Phone, employee.Manager, employee.Status, id,
	)
	if err != nil {
		log.Errorf("employee PG update exec: %v", err)
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}

	log.Infof("write served by MASTER (employee update id=%s)", id)
	return rowsAffected > 0, nil
}

func (r *employeePGRepository) Delete(id string) (bool, error) {
	log := logger.GetLogger()
	log.Debugf("employee PG delete id=%s", id)

	db, err := GetPGWriteDb()
	if err != nil {
		return false, err
	}
	ctx := context.Background()

	stmt, err := db.PrepareContext(ctx, model.SQL_employee_pg_delete)
	if err != nil {
		log.Errorf("employee PG delete prepare: %v", err)
		return false, err
	}
	defer stmt.Close()

	result, err := stmt.ExecContext(ctx, id)
	if err != nil {
		log.Errorf("employee PG delete exec: %v", err)
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}

	log.Infof("write served by MASTER (employee delete id=%s)", id)
	return rowsAffected > 0, nil
}

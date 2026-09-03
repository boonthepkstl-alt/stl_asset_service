package service

import (
	"errors"
	"fmt"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/repository"
	"strings"
	"time"

	"github.com/google/uuid"
)

var ErrEmployeeNotFound = errors.New("employee not found")

// EmployeeService -- CreateEmployee/UpdateEmployee defaulting mirrors
// frontend/src/services/employee-repository.ts's MockEmployeeRepository exactly (phone/
// jobTitle defaults, initials derivation, update-only-supplied-fields semantics) so swapping
// the frontend's mock for a real HTTP call changes no page-visible behavior.
type EmployeeService interface {
	ListEmployees(query model.EmployeeListQuery) (*model.EmployeeListResponse, error)
	GetEmployee(id string) (model.EmployeeModel, error)
	CreateEmployee(input model.CreateEmployeeRequest) (model.EmployeeModel, error)
	UpdateEmployee(id string, input model.UpdateEmployeeRequest) (model.EmployeeModel, error)
}

type employeeService struct {
	repo repository.EmployeeRepository
}

func NewEmployeeService(repo repository.EmployeeRepository) EmployeeService {
	return &employeeService{repo: repo}
}

func (s *employeeService) ListEmployees(query model.EmployeeListQuery) (*model.EmployeeListResponse, error) {
	log := logger.GetLogger()
	log.Infof("ListEmployees - query: %+v", query)

	items, total, err := s.repo.List(query)
	if err != nil {
		return nil, err
	}

	return &model.EmployeeListResponse{Data: items, Total: total}, nil
}

func (s *employeeService) GetEmployee(id string) (model.EmployeeModel, error) {
	log := logger.GetLogger()
	log.Infof("GetEmployee - id: %s", id)

	return s.repo.GetByID(id)
}

func deriveInitials(name string) string {
	words := strings.Fields(name)
	initials := ""
	for _, w := range words {
		initials += string(w[0])
	}
	initials = strings.ToUpper(initials)
	if len(initials) > 2 {
		initials = initials[:2]
	}
	if initials == "" {
		initials = "EM"
	}
	return initials
}

func (s *employeeService) CreateEmployee(input model.CreateEmployeeRequest) (model.EmployeeModel, error) {
	log := logger.GetLogger()
	log.Infof("CreateEmployee - input: %+v", input)

	id := uuid.New().String()
	code := input.EmployeeCode
	if code == "" {
		code = fmt.Sprintf("EMP-%s", id[:8])
	}

	phone := input.Phone
	if phone == "" {
		phone = "+1 (555) 000-0000"
	}
	jobTitle := input.JobTitle
	if jobTitle == "" {
		jobTitle = "Staff Specialist"
	}
	deskLocation := input.DeskLocation
	if deskLocation == "" {
		deskLocation = "Open Desk"
	}
	status := input.Status
	if status == "" {
		status = "Active"
	}

	employee := model.EmployeeModel{
		ID:              id,
		EmployeeCode:    code,
		Name:            input.Name,
		Email:           input.Email,
		Phone:           phone,
		JobTitle:        jobTitle,
		Title:           jobTitle,
		Department:      input.Department,
		DepartmentID:    fmt.Sprintf("DEPT-%s", strings.ToUpper(safeSlice(input.Department, 3))),
		Location:        input.Location,
		DeskLocation:    deskLocation,
		Manager:         input.Manager,
		ManagerID:       "",
		Status:          status,
		AvatarColor:     "bg-brand-500",
		Initials:        deriveInitials(input.Name),
		StartDate:       time.Now().Format("2006-01-02"),
		WorkstationType: "Standard Corporate Workstation",
		PrimaryOS:       "macOS & Windows 11",
		AssignedCount:   0,
	}

	if err := s.repo.Create(employee); err != nil {
		log.Errorf("CreateEmployee error: %v", err)
		return model.EmployeeModel{}, err
	}

	return employee, nil
}

func safeSlice(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n]
}

// UpdateEmployee only overwrites fields the caller actually supplied, matching
// MockAssetRepository.update's `input.field ?? existing.field` semantics exactly.
func (s *employeeService) UpdateEmployee(id string, input model.UpdateEmployeeRequest) (model.EmployeeModel, error) {
	log := logger.GetLogger()
	log.Infof("UpdateEmployee - id: %s", id)

	existing, err := s.repo.GetByID(id)
	if err != nil {
		return model.EmployeeModel{}, ErrEmployeeNotFound
	}

	if input.JobTitle != nil {
		existing.JobTitle = *input.JobTitle
		existing.Title = *input.JobTitle
	}
	if input.Department != nil {
		existing.Department = *input.Department
	}
	if input.Location != nil {
		existing.Location = *input.Location
	}
	if input.DeskLocation != nil {
		existing.DeskLocation = *input.DeskLocation
	}
	if input.Phone != nil {
		existing.Phone = *input.Phone
	}
	if input.Manager != nil {
		existing.Manager = *input.Manager
	}
	if input.Status != nil {
		existing.Status = *input.Status
	}

	updated, err := s.repo.Update(id, existing)
	if err != nil {
		log.Errorf("UpdateEmployee error: %v", err)
		return model.EmployeeModel{}, err
	}
	if !updated {
		return model.EmployeeModel{}, ErrEmployeeNotFound
	}

	return existing, nil
}

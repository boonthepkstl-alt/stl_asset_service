package controller

import (
	"errors"
	"net/http"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/service"

	"github.com/gofiber/fiber/v2"
)

type EmployeeController interface {
	ListEmployees(c *fiber.Ctx) error
	GetEmployeeByID(c *fiber.Ctx) error
	CreateEmployee(c *fiber.Ctx) error
	UpdateEmployee(c *fiber.Ctx) error
}

type employeeController struct {
	employeeService service.EmployeeService
}

func NewEmployeeController(employeeService service.EmployeeService) EmployeeController {
	return &employeeController{employeeService: employeeService}
}

// ListEmployees godoc
// GET /employees?search=&department=&location=&status=
func (obj *employeeController) ListEmployees(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	var query model.EmployeeListQuery
	if err := c.QueryParser(&query); err != nil {
		log.Errorf("ListEmployees parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid query parameters",
			"error":   err.Error(),
		})
	}
	if query.Department == "ALL" {
		query.Department = ""
	}
	if query.Location == "ALL" {
		query.Location = ""
	}
	if query.Status == "ALL" {
		query.Status = ""
	}

	resp, err := obj.employeeService.ListEmployees(query)
	if err != nil {
		log.Errorf("ListEmployees service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to retrieve employees",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(resp)
}

// GetEmployeeByID godoc
// GET /employees/:id -- id may be either the internal id or the employee code, matching
// MockEmployeeRepository.getById's dual lookup.
func (obj *employeeController) GetEmployeeByID(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	id := c.Params("id")
	if id == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "id is required"})
	}

	employee, err := obj.employeeService.GetEmployee(id)
	if err != nil {
		log.Errorf("GetEmployeeByID error: %v", err)
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"message": "Employee not found",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(employee)
}

// CreateEmployee godoc
// POST /employees
func (obj *employeeController) CreateEmployee(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	var input model.CreateEmployeeRequest
	if err := c.BodyParser(&input); err != nil {
		log.Errorf("CreateEmployee parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	created, err := obj.employeeService.CreateEmployee(input)
	if err != nil {
		log.Errorf("CreateEmployee service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create employee",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusCreated).JSON(created)
}

// UpdateEmployee godoc
// PUT /employees/:id
func (obj *employeeController) UpdateEmployee(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	id := c.Params("id")
	if id == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "id is required"})
	}

	var input model.UpdateEmployeeRequest
	if err := c.BodyParser(&input); err != nil {
		log.Errorf("UpdateEmployee parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	updated, err := obj.employeeService.UpdateEmployee(id, input)
	if err != nil {
		log.Errorf("UpdateEmployee service error: %v", err)
		if errors.Is(err, service.ErrEmployeeNotFound) {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Employee not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update employee",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(updated)
}

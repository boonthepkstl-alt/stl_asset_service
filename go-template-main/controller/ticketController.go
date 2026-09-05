package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/service"

	"github.com/gofiber/fiber/v2"
)

var errBadRequestBody = errors.New("invalid request body")

func parseInto(body []byte, target interface{}) error {
	if err := json.Unmarshal(body, target); err != nil {
		return fmt.Errorf("%w: %v", errBadRequestBody, err)
	}
	return nil
}

type TicketController interface {
	ListTickets(c *fiber.Ctx) error
	GetTicketByCode(c *fiber.Ctx) error
	ListTechnicians(c *fiber.Ctx) error
	CreateTicket(c *fiber.Ctx) error
	DecideApproval(c *fiber.Ctx) error
	Dispatch(c *fiber.Ctx) error
	UpdateExecutionStatus(c *fiber.Ctx) error
}

type ticketController struct {
	ticketService service.TicketService
	auditService  service.AuditService
}

func NewTicketController(ticketService service.TicketService, auditService service.AuditService) TicketController {
	return &ticketController{ticketService: ticketService, auditService: auditService}
}

// recordAudit is the Ticket domain's counterpart to assetController.go's recordAudit --
// same best-effort, non-atomic trade-off (RAISE-FR-AUDIT-001's first cut, PR #31), now extended
// to a second domain per that PR's own documented "Remaining Work" (see
// docs/project-management/PROJECT-CHECKPOINTS.md CHECKPOINT-2026-08-25-002).
func (obj *ticketController) recordAudit(c *fiber.Ctx, action, entityID string) {
	log := logger.GetLoggerWithFiber(c)
	actor, _ := c.Locals("username").(string)
	if actor == "" {
		actor = "unknown"
	}
	if _, err := obj.auditService.Record(actor, action, "ticket", entityID); err != nil {
		log.Errorf("recordAudit failed (action=%s entity=ticket/%s): %v", action, entityID, err)
	}
}

// ListTickets godoc
// GET /tickets?search=&status=&priority=&category=&department=&requesterName=
func (obj *ticketController) ListTickets(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	var query model.TicketListQuery
	if err := c.QueryParser(&query); err != nil {
		log.Errorf("ListTickets parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid query parameters", "error": err.Error()})
	}
	if query.Status == "ALL" {
		query.Status = ""
	}
	if query.Priority == "ALL" {
		query.Priority = ""
	}
	if query.Category == "ALL" {
		query.Category = ""
	}
	if query.Department == "ALL" {
		query.Department = ""
	}

	resp, err := obj.ticketService.ListTickets(query)
	if err != nil {
		log.Errorf("ListTickets service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to retrieve tickets"})
	}
	return c.Status(http.StatusOK).JSON(resp)
}

// GetTicketByCode godoc
// GET /tickets/:code -- code may be either the ticket_code or internal id.
func (obj *ticketController) GetTicketByCode(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	code := c.Params("code")
	if code == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "code is required"})
	}

	ticket, err := obj.ticketService.GetTicket(code)
	if err != nil {
		log.Errorf("GetTicketByCode error: %v", err)
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Ticket not found"})
	}
	return c.Status(http.StatusOK).JSON(ticket)
}

// ListTechnicians godoc
// GET /technicians
func (obj *ticketController) ListTechnicians(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	technicians, err := obj.ticketService.ListTechnicians()
	if err != nil {
		log.Errorf("ListTechnicians service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to retrieve technicians"})
	}
	return c.Status(http.StatusOK).JSON(technicians)
}

// CreateTicket godoc
// POST /tickets
func (obj *ticketController) CreateTicket(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	var input model.CreateTicketRequest
	if err := c.BodyParser(&input); err != nil {
		log.Errorf("CreateTicket parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body", "error": err.Error()})
	}

	created, err := obj.ticketService.CreateTicket(input)
	if err != nil {
		log.Errorf("CreateTicket service error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Failed to create ticket"})
	}
	obj.recordAudit(c, "Ticket created", created.ID)
	return c.Status(http.StatusCreated).JSON(created)
}

// DecideApproval godoc
// POST /tickets/:code/approval
func (obj *ticketController) DecideApproval(c *fiber.Ctx) error {
	return obj.updateTicket(c, func(id string, body []byte) (model.TicketModel, error) {
		var input model.ApprovalDecisionRequest
		if err := parseInto(body, &input); err != nil {
			return model.TicketModel{}, err
		}
		updated, err := obj.ticketService.DecideApproval(id, input)
		if err != nil {
			return model.TicketModel{}, err
		}
		obj.recordAudit(c, fmt.Sprintf("Ticket %sd", input.Decision), updated.ID)
		return updated, nil
	})
}

// Dispatch godoc
// POST /tickets/:code/dispatch
func (obj *ticketController) Dispatch(c *fiber.Ctx) error {
	return obj.updateTicket(c, func(id string, body []byte) (model.TicketModel, error) {
		var input model.DispatchRequest
		if err := parseInto(body, &input); err != nil {
			return model.TicketModel{}, err
		}
		updated, err := obj.ticketService.Dispatch(id, input)
		if err != nil {
			return model.TicketModel{}, err
		}
		technicianName := "an unassigned technician"
		if updated.ITAssignment.TechnicianName != nil {
			technicianName = *updated.ITAssignment.TechnicianName
		}
		obj.recordAudit(c, fmt.Sprintf("Ticket dispatched to %s", technicianName), updated.ID)
		return updated, nil
	})
}

// UpdateExecutionStatus godoc
// POST /tickets/:code/status
func (obj *ticketController) UpdateExecutionStatus(c *fiber.Ctx) error {
	return obj.updateTicket(c, func(id string, body []byte) (model.TicketModel, error) {
		var input model.StatusUpdateRequest
		if err := parseInto(body, &input); err != nil {
			return model.TicketModel{}, err
		}
		updated, err := obj.ticketService.UpdateExecutionStatus(id, input)
		if err != nil {
			return model.TicketModel{}, err
		}
		obj.recordAudit(c, fmt.Sprintf("Ticket status updated to %s", input.Status), updated.ID)
		return updated, nil
	})
}

// updateTicket is the shared request/response plumbing for the three stage-transition
// endpoints above: parse code param, parse body via the caller's typed unmarshal, call the
// service, map ErrTicketNotFound to 404.
func (obj *ticketController) updateTicket(c *fiber.Ctx, run func(id string, body []byte) (model.TicketModel, error)) error {
	log := logger.GetLoggerWithFiber(c)

	code := c.Params("code")
	if code == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "code is required"})
	}

	updated, err := run(code, c.Body())
	if err != nil {
		if errors.Is(err, errBadRequestBody) {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body", "error": err.Error()})
		}
		log.Errorf("ticket update error: %v", err)
		if errors.Is(err, service.ErrTicketNotFound) {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Ticket not found"})
		}
		if errors.Is(err, service.ErrTechnicianNotFound) {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Technician not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to update ticket"})
	}
	return c.Status(http.StatusOK).JSON(updated)
}

package controller

import (
	"errors"
	"fmt"
	"net/http"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/service"

	"github.com/gofiber/fiber/v2"
)

// AssetHandoverController -- RAISE-FR-OPS-002's IT Hardware Assignment Approval Workflow
// (PRD Sec16 Resolved Question 43). Same request/response plumbing pattern as
// ticketController.go's stage-transition endpoints.
type AssetHandoverController interface {
	ListHandovers(c *fiber.Ctx) error
	GetHandoverByCode(c *fiber.Ctx) error
	InitiateHandover(c *fiber.Ctx) error
	ConfirmReceipt(c *fiber.Ctx) error
	ProcessHandover(c *fiber.Ctx) error
	DecideHandover(c *fiber.Ctx) error
}

type assetHandoverController struct {
	handoverService service.AssetHandoverService
	auditService    service.AuditService
}

func NewAssetHandoverController(handoverService service.AssetHandoverService, auditService service.AuditService) AssetHandoverController {
	return &assetHandoverController{handoverService: handoverService, auditService: auditService}
}

func (obj *assetHandoverController) recordAudit(c *fiber.Ctx, action, entityID string) {
	log := logger.GetLoggerWithFiber(c)
	actor, _ := c.Locals("username").(string)
	if actor == "" {
		actor = "unknown"
	}
	if _, err := obj.auditService.Record(actor, action, "asset_handover", entityID); err != nil {
		log.Errorf("recordAudit failed (action=%s entity=asset_handover/%s): %v", action, entityID, err)
	}
}

// ListHandovers godoc
// GET /handovers?search=&status=&recipientEmployeeId=
func (obj *assetHandoverController) ListHandovers(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	var query model.AssetHandoverListQuery
	if err := c.QueryParser(&query); err != nil {
		log.Errorf("ListHandovers parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid query parameters", "error": err.Error()})
	}
	if query.Status == "ALL" {
		query.Status = ""
	}

	resp, err := obj.handoverService.ListHandovers(query)
	if err != nil {
		log.Errorf("ListHandovers service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to retrieve handovers", "error": err.Error()})
	}
	return c.Status(http.StatusOK).JSON(resp)
}

// GetHandoverByCode godoc
// GET /handovers/:code -- code may be either the handover_code or internal id.
func (obj *assetHandoverController) GetHandoverByCode(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	code := c.Params("code")
	if code == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "code is required"})
	}

	handover, err := obj.handoverService.GetHandover(code)
	if err != nil {
		log.Errorf("GetHandoverByCode error: %v", err)
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Handover not found", "error": err.Error()})
	}
	return c.Status(http.StatusOK).JSON(handover)
}

// InitiateHandover godoc
// POST /assets/:id/handover -- Stage 1, the IT Hardware-scoped counterpart to
// POST /assets/:id/assign (which rejects IT Hardware with 409, directing here).
func (obj *assetHandoverController) InitiateHandover(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	assetID := c.Params("id")
	if assetID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "id is required"})
	}

	var input model.InitiateHandoverRequest
	if err := c.BodyParser(&input); err != nil {
		log.Errorf("InitiateHandover parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body", "error": err.Error()})
	}

	actorName, _ := c.Locals("username").(string)
	initiatedBy := model.HandoverPerson{ID: actorName, Name: actorName, Role: "Initiator"}

	created, err := obj.handoverService.InitiateHandover(assetID, input, initiatedBy)
	if err != nil {
		log.Errorf("InitiateHandover service error: %v", err)
		return mapHandoverError(c, err)
	}
	obj.recordAudit(c, fmt.Sprintf("Handover initiated for %s", input.EmployeeName), created.ID)
	return c.Status(http.StatusCreated).JSON(created)
}

// ConfirmReceipt godoc
// POST /handovers/:code/confirm -- Stage 2.
func (obj *assetHandoverController) ConfirmReceipt(c *fiber.Ctx) error {
	return obj.updateHandover(c, "Recipient confirmed receipt", func(id string, body []byte) (model.AssetHandoverModel, error) {
		var input model.ConfirmReceiptRequest
		if err := parseInto(body, &input); err != nil {
			return model.AssetHandoverModel{}, err
		}
		return obj.handoverService.ConfirmReceipt(id, input)
	})
}

// ProcessHandover godoc
// POST /handovers/:code/process -- Stage 3.
func (obj *assetHandoverController) ProcessHandover(c *fiber.Ctx) error {
	return obj.updateHandover(c, "IT processed handover", func(id string, body []byte) (model.AssetHandoverModel, error) {
		var input model.ProcessHandoverRequest
		if err := parseInto(body, &input); err != nil {
			return model.AssetHandoverModel{}, err
		}
		return obj.handoverService.ProcessHandover(id, input)
	})
}

// DecideHandover godoc
// POST /handovers/:code/decision -- Stage 4 approve, or Stage 3/4 reject.
func (obj *assetHandoverController) DecideHandover(c *fiber.Ctx) error {
	return obj.updateHandover(c, "Handover decision recorded", func(id string, body []byte) (model.AssetHandoverModel, error) {
		var input model.HandoverDecisionRequest
		if err := parseInto(body, &input); err != nil {
			return model.AssetHandoverModel{}, err
		}
		return obj.handoverService.DecideHandover(id, input)
	})
}

// updateHandover is the shared request/response plumbing for the three stage-transition
// endpoints above -- same shape as ticketController.go's updateTicket.
func (obj *assetHandoverController) updateHandover(c *fiber.Ctx, auditAction string, run func(id string, body []byte) (model.AssetHandoverModel, error)) error {
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
		log.Errorf("handover update error: %v", err)
		return mapHandoverError(c, err)
	}
	obj.recordAudit(c, auditAction, updated.ID)
	return c.Status(http.StatusOK).JSON(updated)
}

func mapHandoverError(c *fiber.Ctx, err error) error {
	switch {
	case errors.Is(err, service.ErrHandoverNotFound), errors.Is(err, service.ErrAssetNotFound):
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Not found", "error": err.Error()})
	case errors.Is(err, service.ErrInvalidRecipient):
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body", "error": err.Error()})
	case errors.Is(err, service.ErrAssetNotITHardware),
		errors.Is(err, service.ErrAssetNotAvailable),
		errors.Is(err, service.ErrHandoverAlreadyActive),
		errors.Is(err, service.ErrHandoverWrongStage),
		errors.Is(err, service.ErrHandoverWrongRecipient),
		errors.Is(err, service.ErrInvalidDecision):
		return c.Status(http.StatusConflict).JSON(fiber.Map{"message": "Handover request could not be completed", "error": err.Error()})
	default:
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to process handover", "error": err.Error()})
	}
}

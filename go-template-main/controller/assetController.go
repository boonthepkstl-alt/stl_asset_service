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

type AssetController interface {
	ListAssets(c *fiber.Ctx) error
	GetAssetByID(c *fiber.Ctx) error
	CreateAsset(c *fiber.Ctx) error
	AssignAsset(c *fiber.Ctx) error
	CheckInAsset(c *fiber.Ctx) error
}

type assetController struct {
	assetService service.AssetService
	auditService service.AuditService
}

func NewAssetController(assetService service.AssetService, auditService service.AuditService) AssetController {
	return &assetController{assetService: assetService, auditService: auditService}
}

// recordAudit is a best-effort audit write (RAISE-FR-AUDIT-001): logged on failure, but does
// not fail the primary request. This is a deliberate first-cut trade-off, not an oversight --
// there is no outbox/transactional-write pattern here, so a rare audit-write failure means a
// mutation could complete without a matching audit entry. Making both writes atomic would need
// a shared transaction across the asset and audit repositories, which is a larger change than
// this first cut's scope (see NEXT-STEP.md's "needs a scoped-down first cut" framing).
func (obj *assetController) recordAudit(c *fiber.Ctx, action, entityID string) {
	log := logger.GetLoggerWithFiber(c)
	actor, _ := c.Locals("username").(string)
	if actor == "" {
		actor = "unknown"
	}
	if _, err := obj.auditService.Record(actor, action, "asset", entityID); err != nil {
		log.Errorf("recordAudit failed (action=%s entity=asset/%s): %v", action, entityID, err)
	}
}

// ListAssets godoc
// GET /assets?search=&status=&department=&page=&limit=
func (obj *assetController) ListAssets(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	var query model.AssetListQuery
	if err := c.QueryParser(&query); err != nil {
		log.Errorf("ListAssets parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid query parameters",
			"error":   err.Error(),
		})
	}
	if query.Status == "all" {
		query.Status = ""
	}
	if query.Department == "all" {
		query.Department = ""
	}

	resp, err := obj.assetService.ListAssets(query)
	if err != nil {
		log.Errorf("ListAssets service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to retrieve assets",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(resp)
}

// GetAssetByID godoc
// GET /assets/:id -- :id may be either the internal id or the asset's `code` (e.g. "AST-0004"),
// the value actually encoded in a printed/scanned QR/barcode (RAISE-FR-OPS-001).
func (obj *assetController) GetAssetByID(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	id := c.Params("id")
	if id == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "id is required"})
	}

	asset, err := obj.assetService.GetAsset(id)
	if err != nil {
		log.Errorf("GetAssetByID error: %v", err)
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"message": "Asset not found",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(asset)
}

// CreateAsset godoc
// POST /assets
func (obj *assetController) CreateAsset(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	var input model.CreateAssetRequest
	if err := c.BodyParser(&input); err != nil {
		log.Errorf("CreateAsset parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	created, err := obj.assetService.CreateAsset(input)
	if err != nil {
		log.Errorf("CreateAsset service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create asset",
			"error":   err.Error(),
		})
	}

	obj.recordAudit(c, "Asset created", created.ID)
	return c.Status(http.StatusCreated).JSON(created)
}

// AssignAsset godoc
// POST /assets/:id/assign
func (obj *assetController) AssignAsset(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	id := c.Params("id")
	if id == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "id is required"})
	}

	var input model.AssignAssetRequest
	if err := c.BodyParser(&input); err != nil {
		log.Errorf("AssignAsset parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	updated, err := obj.assetService.AssignAsset(id, input)
	if err != nil {
		log.Errorf("AssignAsset service error: %v", err)
		if errors.Is(err, service.ErrAssetNotFound) {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Asset not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to assign asset",
			"error":   err.Error(),
		})
	}

	obj.recordAudit(c, fmt.Sprintf("Asset assigned to %s", input.EmployeeName), id)
	return c.Status(http.StatusOK).JSON(updated)
}

// CheckInAsset godoc
// POST /assets/:id/checkin -- no request body, mirrors AssignAsset.
func (obj *assetController) CheckInAsset(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	id := c.Params("id")
	if id == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "id is required"})
	}

	updated, err := obj.assetService.CheckInAsset(id)
	if err != nil {
		log.Errorf("CheckInAsset service error: %v", err)
		if errors.Is(err, service.ErrAssetNotFound) {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Asset not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to check in asset",
			"error":   err.Error(),
		})
	}

	obj.recordAudit(c, "Asset checked in", id)
	return c.Status(http.StatusOK).JSON(updated)
}

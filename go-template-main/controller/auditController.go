package controller

import (
	"net/http"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/service"

	"github.com/gofiber/fiber/v2"
)

// AuditController deliberately exposes only a list endpoint (AC-AUDIT-001-03: authorized users
// can view audit information) -- there is no create/update/delete route, matching the
// service/repository layers below it. Recording happens as a side effect of other domains'
// mutations (see assetController.go), not through a route a client could call directly.
type AuditController interface {
	ListAuditLogs(c *fiber.Ctx) error
}

type auditController struct {
	auditService service.AuditService
}

func NewAuditController(auditService service.AuditService) AuditController {
	return &auditController{auditService: auditService}
}

// ListAuditLogs godoc
// GET /audit-logs?entityType=&entityId=&page=&limit=
//
// No RequireRole gate: AC-AUDIT-001-03's "audit-review access" role model is undefined
// (PRD §16 Q22) -- same reasoning already applied to /assets, /employees, /tickets (RAISE-NFR-
// SEC-RBAC-001's confirmed MVP enforcement level is UI-only/client-side). Authenticated
// (JWTAuth) is the correct and only gate for MVP; do not invent a role gate here.
func (obj *auditController) ListAuditLogs(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	var query model.AuditListQuery
	if err := c.QueryParser(&query); err != nil {
		log.Errorf("ListAuditLogs parse error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid query parameters",
			"error":   err.Error(),
		})
	}

	resp, err := obj.auditService.ListAuditLogs(query)
	if err != nil {
		log.Errorf("ListAuditLogs service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to retrieve audit logs",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(resp)
}

package controller

import (
	"net/http"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/service"

	"github.com/gofiber/fiber/v2"
)

// DashboardController deliberately exposes only a read-only stats endpoint -- there is no
// create/update/delete route, since this domain has no state of its own (it's a computed view
// over Asset domain data).
type DashboardController interface {
	GetDashboardStats(c *fiber.Ctx) error
}

type dashboardController struct {
	dashboardService service.DashboardService
}

func NewDashboardController(dashboardService service.DashboardService) DashboardController {
	return &dashboardController{dashboardService: dashboardService}
}

// GetDashboardStats godoc
// GET /dashboard/stats
//
// No RequireRole gate -- same reasoning already applied to /assets|/employees|/tickets|
// /audit-logs (RAISE-NFR-SEC-RBAC-001's confirmed MVP enforcement level is UI-only/
// client-side). Authenticated (JWTAuth) is the correct and only gate for MVP.
func (obj *dashboardController) GetDashboardStats(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)

	stats, err := obj.dashboardService.GetDashboardStats()
	if err != nil {
		log.Errorf("GetDashboardStats service error: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to retrieve dashboard stats",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(stats)
}

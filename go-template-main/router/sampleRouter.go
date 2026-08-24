package router

import (
	"net/http"
	"singer/go-template-new-2026-06/controller"
	"singer/go-template-new-2026-06/handler"
	"singer/go-template-new-2026-06/middleware"
	"singer/go-template-new-2026-06/repository"
	"singer/go-template-new-2026-06/service"

	"github.com/gofiber/fiber/v2"
	"github.com/spf13/viper"
)

var version = "0.99.2026.04.26.001"

func SetupRoutes(app *fiber.App, dbManager *repository.DBManager) {
	app.Use(middleware.Tracing())
	app.Use(middleware.Recovery())

	sampleRepo := repository.NewSampleRepository(
		repository.NewSampleTTRepository(),
		repository.NewSamplePGRepository(),
		repository.NewSampleOracleRepository(dbManager),
		repository.NewSampleMSSQLRepository(dbManager),
	)

	sampleHandler := handler.NewSampleHandler()
	sampleService := service.NewSampleService(sampleHandler, dbManager, sampleRepo)
	sampleCtrl := controller.NewSampleController(sampleService)

	assetRepo := repository.NewAssetRepository(repository.NewAssetPGRepository())
	assetService := service.NewAssetService(assetRepo)
	assetCtrl := controller.NewAssetController(assetService)

	employeeRepo := repository.NewEmployeeRepository(repository.NewEmployeePGRepository())
	employeeService := service.NewEmployeeService(employeeRepo)
	employeeCtrl := controller.NewEmployeeController(employeeService)

	ticketRepo := repository.NewTicketRepository(repository.NewTicketPGRepository())
	ticketService := service.NewTicketService(ticketRepo, assetService, employeeService)
	ticketCtrl := controller.NewTicketController(ticketService)

	authService := service.NewAuthService()
	authCtrl := controller.NewAuthController(authService)

	api := app.Group("/api")

	api.Get("/ping", func(c *fiber.Ctx) error {
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"status":   "ok",
			"message":  "go-template-new-2026-api",
			"instance": viper.GetString("INSTANCE"),
			"version":  version,
		})
	})

	api.Post("/auth/login", authCtrl.Login)

	protected := api.Group("", middleware.JWTAuth())
	protected.Get("/health", sampleCtrl.Health)
	protected.Post("/auth/logout", authCtrl.Logout)
	protected.Post("/sample", sampleCtrl.SampleControllerFunction)

	// Read access is open to any authenticated role; mutations require "admin". This is the
	// reference wiring for middleware.RequireRole (previously implemented but unused by any
	// route — see docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md, Blocking Item B-1's
	// backend residual). Applied here to /samples as the only existing mutating CRUD group in
	// this template; there is no real admin/user/role management endpoint to gate yet.
	protected.Get("/samples", sampleCtrl.ListSamples)
	protected.Get("/samples/:id", sampleCtrl.GetSampleByID)
	protected.Post("/samples", middleware.RequireRole("admin"), sampleCtrl.CreateSample)
	protected.Put("/samples/:id", middleware.RequireRole("admin"), sampleCtrl.UpdateSample)
	protected.Delete("/samples/:id", middleware.RequireRole("admin"), sampleCtrl.DeleteSample)

	// RAISE-FR-ASSET-001 (Asset Registry). No RequireRole gate here, unlike /samples above --
	// RAISE-NFR-SEC-RBAC-001's confirmed MVP enforcement level is UI-only/client-side, with
	// backend enforcement explicitly deferred to Roadmap (RAISE-PRD.md Sec11, Sec16 Resolved
	// Question 38). Adding RequireRole here would be enforcing a decision the business
	// specifically chose not to make yet -- authenticated (JWTAuth) is the correct and only
	// gate for MVP.
	protected.Get("/assets", assetCtrl.ListAssets)
	protected.Get("/assets/:id", assetCtrl.GetAssetByID)
	protected.Post("/assets", assetCtrl.CreateAsset)
	protected.Post("/assets/:id/assign", assetCtrl.AssignAsset)
	protected.Post("/assets/:id/checkin", assetCtrl.CheckInAsset)

	// Employee domain, supporting RAISE-FR-ASSET-003 (custody/assignment). Same RBAC
	// reasoning as /assets above -- no RequireRole gate for MVP.
	protected.Get("/employees", employeeCtrl.ListEmployees)
	protected.Get("/employees/:id", employeeCtrl.GetEmployeeByID)
	protected.Post("/employees", employeeCtrl.CreateEmployee)
	protected.Put("/employees/:id", employeeCtrl.UpdateEmployee)

	// Ticket domain (RAISE-FR-MAINT-001, "IT Requisition & Maintenance"). Same RBAC reasoning
	// as /assets and /employees above -- no RequireRole gate for MVP.
	protected.Get("/tickets", ticketCtrl.ListTickets)
	protected.Get("/tickets/:code", ticketCtrl.GetTicketByCode)
	protected.Post("/tickets", ticketCtrl.CreateTicket)
	protected.Post("/tickets/:code/approval", ticketCtrl.DecideApproval)
	protected.Post("/tickets/:code/dispatch", ticketCtrl.Dispatch)
	protected.Post("/tickets/:code/status", ticketCtrl.UpdateExecutionStatus)
	protected.Get("/technicians", ticketCtrl.ListTechnicians)
}

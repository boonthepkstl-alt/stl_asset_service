package controller

import (
	"fmt"
	"net/http/httptest"
	"singer/go-template-new-2026-06/model"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

// Maximum page size on the RAISE list endpoints (2026-09-18).
//
// These tests assert on the query the SERVICE ACTUALLY RECEIVED, not on the response body. The
// clamp lives in the controller, between QueryParser and the service call, so a test that only
// inspected the returned rows would pass just as happily against a controller that ignored Limit
// entirely -- the seeded fakes below return a fixed payload either way. Capturing the query is
// what makes these tests capable of failing for the right reason.
//
// Driven through fiber.App.Test() against fake services, following controller/ticketController_test.go
// -- no live Postgres/MSSQL/Tarantool needed, unlike sampleController_test.go's TestMain.

// --- capturing fakes, one per RAISE list endpoint -------------------------------------------

type capturingEmployeeService struct{ got model.EmployeeListQuery }

func (f *capturingEmployeeService) ListEmployees(q model.EmployeeListQuery) (*model.EmployeeListResponse, error) {
	f.got = q
	return &model.EmployeeListResponse{}, nil
}
func (f *capturingEmployeeService) GetEmployee(string) (model.EmployeeModel, error) {
	return model.EmployeeModel{}, nil
}
func (f *capturingEmployeeService) CreateEmployee(model.CreateEmployeeRequest) (model.EmployeeModel, error) {
	return model.EmployeeModel{}, nil
}
func (f *capturingEmployeeService) UpdateEmployee(string, model.UpdateEmployeeRequest) (model.EmployeeModel, error) {
	return model.EmployeeModel{}, nil
}

type capturingAssetService struct{ got model.AssetListQuery }

func (f *capturingAssetService) ListAssets(q model.AssetListQuery) (*model.AssetListResponse, error) {
	f.got = q
	return &model.AssetListResponse{}, nil
}
func (f *capturingAssetService) GetAsset(string) (model.AssetModel, error) {
	return model.AssetModel{}, nil
}
func (f *capturingAssetService) CreateAsset(model.CreateAssetRequest) (model.AssetModel, error) {
	return model.AssetModel{}, nil
}
func (f *capturingAssetService) AssignAsset(string, model.AssignAssetRequest) (model.AssetModel, error) {
	return model.AssetModel{}, nil
}
func (f *capturingAssetService) CheckInAsset(string) (model.AssetModel, error) {
	return model.AssetModel{}, nil
}
func (f *capturingAssetService) CompleteHandoverAssignment(string, string, string) (model.AssetModel, error) {
	return model.AssetModel{}, nil
}

type capturingTicketService struct{ got model.TicketListQuery }

func (f *capturingTicketService) ListTickets(q model.TicketListQuery) (*model.TicketListResponse, error) {
	f.got = q
	return &model.TicketListResponse{}, nil
}
func (f *capturingTicketService) GetTicket(string) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}
func (f *capturingTicketService) ListTechnicians() ([]model.ITTechnician, error) { return nil, nil }
func (f *capturingTicketService) CreateTicket(model.CreateTicketRequest) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}
func (f *capturingTicketService) DecideApproval(string, model.ApprovalDecisionRequest) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}
func (f *capturingTicketService) Dispatch(string, model.DispatchRequest) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}
func (f *capturingTicketService) UpdateExecutionStatus(string, model.StatusUpdateRequest) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}

type capturingHandoverService struct{ got model.AssetHandoverListQuery }

func (f *capturingHandoverService) ListHandovers(q model.AssetHandoverListQuery) (*model.AssetHandoverListResponse, error) {
	f.got = q
	return &model.AssetHandoverListResponse{}, nil
}
func (f *capturingHandoverService) GetHandover(string) (model.AssetHandoverModel, error) {
	return model.AssetHandoverModel{}, nil
}
func (f *capturingHandoverService) InitiateHandover(string, model.InitiateHandoverRequest, model.HandoverPerson) (model.AssetHandoverModel, error) {
	return model.AssetHandoverModel{}, nil
}
func (f *capturingHandoverService) ConfirmReceipt(string, model.ConfirmReceiptRequest) (model.AssetHandoverModel, error) {
	return model.AssetHandoverModel{}, nil
}
func (f *capturingHandoverService) ProcessHandover(string, model.ProcessHandoverRequest) (model.AssetHandoverModel, error) {
	return model.AssetHandoverModel{}, nil
}
func (f *capturingHandoverService) DecideHandover(string, model.HandoverDecisionRequest) (model.AssetHandoverModel, error) {
	return model.AssetHandoverModel{}, nil
}

type capturingAuditService struct{ got model.AuditListQuery }

func (f *capturingAuditService) Record(string, string, string, string) (model.AuditLogModel, error) {
	return model.AuditLogModel{}, nil
}
func (f *capturingAuditService) ListAuditLogs(q model.AuditListQuery) (*model.AuditListResponse, error) {
	f.got = q
	return &model.AuditListResponse{}, nil
}

// --- the table ------------------------------------------------------------------------------

// getLimit issues GET <path><query> against app and returns the Limit the fake service saw.
func getLimit(t *testing.T, app *fiber.App, path, query string, read func() int) int {
	t.Helper()
	resp, err := app.Test(httptest.NewRequest("GET", path+query, nil), 10000)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	return read()
}

func TestListEndpoints_ClampMaxPageLimit(t *testing.T) {
	empSvc := &capturingEmployeeService{}
	assetSvc := &capturingAssetService{}
	ticketSvc := &capturingTicketService{}
	handoverSvc := &capturingHandoverService{}
	auditSvc := &capturingAuditService{}

	// A separate audit fake for the side-effect dependency, so the one asserted on
	// (auditSvc, wired to /audit-logs) only ever records what that endpoint passed it.
	sideEffectAudit := &capturingAuditService{}

	app := fiber.New()
	app.Get("/employees", NewEmployeeController(empSvc).ListEmployees)
	app.Get("/assets", NewAssetController(assetSvc, sideEffectAudit).ListAssets)
	app.Get("/tickets", NewTicketController(ticketSvc, sideEffectAudit).ListTickets)
	app.Get("/handovers", NewAssetHandoverController(handoverSvc, sideEffectAudit).ListHandovers)
	app.Get("/audit-logs", NewAuditController(auditSvc).ListAuditLogs)

	endpoints := []struct {
		name string
		path string
		read func() int
	}{
		{"employees", "/employees", func() int { return empSvc.got.Limit }},
		{"assets", "/assets", func() int { return assetSvc.got.Limit }},
		{"tickets", "/tickets", func() int { return ticketSvc.got.Limit }},
		{"handovers", "/handovers", func() int { return handoverSvc.got.Limit }},
		{"audit-logs", "/audit-logs", func() int { return auditSvc.got.Limit }},
	}

	for _, ep := range endpoints {
		t.Run(ep.name+": a limit above the ceiling is clamped, not rejected", func(t *testing.T) {
			got := getLimit(t, app, ep.path, "?limit=999999", ep.read)
			assert.Equal(t, model.MaxPageLimit, got,
				"an over-large limit must reach the service clamped to MaxPageLimit")
		})

		t.Run(ep.name+": a limit exactly at the ceiling passes through unchanged", func(t *testing.T) {
			got := getLimit(t, app, ep.path, fmt.Sprintf("?limit=%d", model.MaxPageLimit), ep.read)
			assert.Equal(t, model.MaxPageLimit, got, "the boundary value itself must not be altered")
		})

		t.Run(ep.name+": a limit below the ceiling is untouched", func(t *testing.T) {
			got := getLimit(t, app, ep.path, "?limit=7", ep.read)
			assert.Equal(t, 7, got, "a reasonable page size must not be rewritten")
		})

		// The load-bearing case. limit<=0 means "no limit requested" and is resolved downstream in
		// each PG repository as "the full result set", which is what preserves the behaviour of
		// every caller that predates pagination (PR #129). If the clamp ever rewrote 0 to
		// MaxPageLimit, those callers would silently start receiving truncated lists.
		t.Run(ep.name+": no limit supplied stays 0 and is NOT rewritten to the ceiling", func(t *testing.T) {
			got := getLimit(t, app, ep.path, "", ep.read)
			assert.Equal(t, 0, got,
				"an absent limit must reach the service as 0 so the repository's full-result-set default still applies")
		})
	}
}

// Unit-level companion to the HTTP tests above: the clamp function's own boundary behaviour,
// asserted without a router in the way.
func TestClampPageLimit(t *testing.T) {
	cases := []struct {
		in   int
		want int
		why  string
	}{
		{in: 0, want: 0, why: "absent limit passes through; the repository resolves the default"},
		{in: -5, want: -5, why: "negative passes through; same downstream default path as 0"},
		{in: 1, want: 1, why: "below the ceiling is untouched"},
		{in: model.MaxPageLimit - 1, want: model.MaxPageLimit - 1, why: "just below the ceiling is untouched"},
		{in: model.MaxPageLimit, want: model.MaxPageLimit, why: "the ceiling itself is not altered"},
		{in: model.MaxPageLimit + 1, want: model.MaxPageLimit, why: "just above the ceiling clamps"},
		{in: 999999, want: model.MaxPageLimit, why: "far above the ceiling clamps"},
	}
	for _, c := range cases {
		assert.Equal(t, c.want, model.ClampPageLimit(c.in), "ClampPageLimit(%d): %s", c.in, c.why)
	}
}

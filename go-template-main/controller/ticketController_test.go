package controller

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http/httptest"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/service"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

// Finding 3 from the 2026-09-09 code review: CreateTicket used to map every service error --
// employee/asset not found, an unrecognized Priority, and a genuine repository/DB failure alike
// -- to a blanket 400, indistinguishable to the caller and to any 5xx-based monitoring. These
// tests exercise the controller's HTTP-level response directly, against a fake TicketService, so
// they need none of the live MSSQL/Postgres/Tarantool setup TestMain (sampleController_test.go)
// requires -- CreateTicket's only collaborator here is the TicketService interface.

type fakeTicketService struct {
	createFn func(model.CreateTicketRequest) (model.TicketModel, error)
}

func (f *fakeTicketService) ListTickets(model.TicketListQuery) (*model.TicketListResponse, error) {
	return &model.TicketListResponse{}, nil
}
func (f *fakeTicketService) GetTicket(string) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}
func (f *fakeTicketService) ListTechnicians() ([]model.ITTechnician, error) { return nil, nil }
func (f *fakeTicketService) CreateTicket(input model.CreateTicketRequest) (model.TicketModel, error) {
	return f.createFn(input)
}
func (f *fakeTicketService) DecideApproval(string, model.ApprovalDecisionRequest) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}
func (f *fakeTicketService) Dispatch(string, model.DispatchRequest) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}
func (f *fakeTicketService) UpdateExecutionStatus(string, model.StatusUpdateRequest) (model.TicketModel, error) {
	return model.TicketModel{}, nil
}

type fakeAuditService struct{}

func (fakeAuditService) Record(actor, action, entityType, entityID string) (model.AuditLogModel, error) {
	return model.AuditLogModel{}, nil
}
func (fakeAuditService) ListAuditLogs(model.AuditListQuery) (*model.AuditListResponse, error) {
	return &model.AuditListResponse{}, nil
}

func newTicketTestApp(ticketSvc service.TicketService) *fiber.App {
	app := fiber.New()
	ctrl := NewTicketController(ticketSvc, fakeAuditService{})
	app.Post("/tickets", ctrl.CreateTicket)
	return app
}

func postCreateTicket(t *testing.T, app *fiber.App) (int, map[string]interface{}) {
	t.Helper()
	body, err := json.Marshal(model.CreateTicketRequest{
		RequesterID: "e1",
		AssetID:     "a1",
		Category:    "Hardware Fault & Repair",
		Priority:    "Critical",
		Title:       "test",
	})
	assert.NoError(t, err)

	req := httptest.NewRequest("POST", "/tickets", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	assert.NoError(t, err)

	var parsed map[string]interface{}
	assert.NoError(t, json.NewDecoder(resp.Body).Decode(&parsed))
	return resp.StatusCode, parsed
}

func TestCreateTicket_ClientErrorsReturn400(t *testing.T) {
	cases := []struct {
		name string
		err  error
	}{
		{"employee not found", fmt.Errorf("employee e1 not found: %w", service.ErrEmployeeNotFound)},
		{"asset not found", fmt.Errorf("asset a1 not found: %w", service.ErrAssetNotFound)},
		{"invalid priority", fmt.Errorf("%w: %q", service.ErrInvalidPriority, "critical")},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			app := newTicketTestApp(&fakeTicketService{
				createFn: func(model.CreateTicketRequest) (model.TicketModel, error) {
					return model.TicketModel{}, tc.err
				},
			})
			status, body := postCreateTicket(t, app)

			assert.Equal(t, fiber.StatusBadRequest, status)
			// The 400 body may safely name the cause -- unlike a 5xx body, this is our own
			// controlled message, not raw driver/db text (F-19/F-41's concern is 4xx/5xx bodies
			// leaking underlying error internals, not a business-rule rejection like this one).
			assert.Contains(t, body, "error")
		})
	}
}

func TestCreateTicket_RepositoryErrorReturns500WithoutLeakingDetail(t *testing.T) {
	dbErr := errors.New("pq: connection refused, host=10.0.0.5 port=5432")
	app := newTicketTestApp(&fakeTicketService{
		createFn: func(model.CreateTicketRequest) (model.TicketModel, error) {
			return model.TicketModel{}, dbErr
		},
	})
	status, body := postCreateTicket(t, app)

	assert.Equal(t, fiber.StatusInternalServerError, status)
	// F-19 convention: a 5xx body must never carry the raw underlying error string.
	for _, v := range body {
		if s, ok := v.(string); ok {
			assert.NotContains(t, s, "pq:")
			assert.NotContains(t, s, "10.0.0.5")
		}
	}
}

func TestCreateTicket_SucceedsWithNoError(t *testing.T) {
	app := newTicketTestApp(&fakeTicketService{
		createFn: func(input model.CreateTicketRequest) (model.TicketModel, error) {
			return model.TicketModel{ID: "t1", TicketCode: "ITR-2026-999", Priority: input.Priority, SLATargetHours: 2}, nil
		},
	})
	status, body := postCreateTicket(t, app)

	assert.Equal(t, fiber.StatusCreated, status)
	assert.Equal(t, "ITR-2026-999", body["ticketCode"])
}

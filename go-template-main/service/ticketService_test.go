package service

import (
	"singer/go-template-new-2026-06/model"
	"testing"

	"github.com/stretchr/testify/assert"
)

// mockTicketRepository is an in-memory stand-in for TicketRepository, same pattern as
// mockAssetRepository/mockEmployeeRepository -- no live DB required to run these tests.
// Reuses those two mocks (via real AssetService/EmployeeService instances) since
// TicketService depends on them to resolve requesterId/assetId, mirroring
// frontend/src/services/ticket-service.ts's one-way dependency exactly.
type mockTicketRepository struct {
	tickets     map[string]model.TicketModel
	technicians []model.ITTechnician
}

func newMockTicketRepository() *mockTicketRepository {
	return &mockTicketRepository{
		tickets: map[string]model.TicketModel{},
		technicians: []model.ITTechnician{
			{ID: "tech-1", Name: "Alex Rivera", Role: "Lead Hardware Specialist", Specialty: "Apple Certified"},
		},
	}
}

func (m *mockTicketRepository) Create(ticket model.TicketModel) error {
	m.tickets[ticket.ID] = ticket
	return nil
}

func (m *mockTicketRepository) GetByCode(code string) (model.TicketModel, error) {
	if t, ok := m.tickets[code]; ok {
		return t, nil
	}
	for _, t := range m.tickets {
		if t.TicketCode == code {
			return t, nil
		}
	}
	return model.TicketModel{}, ErrTicketNotFound
}

func (m *mockTicketRepository) Update(id string, ticket model.TicketModel) (bool, error) {
	if _, ok := m.tickets[id]; !ok {
		return false, nil
	}
	m.tickets[id] = ticket
	return true, nil
}

func (m *mockTicketRepository) List(query model.TicketListQuery) ([]model.TicketModel, int, error) {
	items := make([]model.TicketModel, 0, len(m.tickets))
	for _, t := range m.tickets {
		items = append(items, t)
	}
	return items, len(items), nil
}

func (m *mockTicketRepository) ListTechnicians() ([]model.ITTechnician, error) {
	return m.technicians, nil
}

// seedTicketDeps creates a real AssetService/EmployeeService (mock-repo-backed) with one
// asset and one employee already created, plus a fresh TicketService wired to them -- the
// combination CreateTicket needs to resolve requesterId/assetId.
func seedTicketDeps(t *testing.T) (TicketService, string, string) {
	t.Helper()

	assetSvc := NewAssetService(newMockAssetRepository())
	asset, err := assetSvc.CreateAsset(model.CreateAssetRequest{Name: "MacBook Pro 16\"", Department: "Engineering", Location: "HQ"})
	assert.NoError(t, err)

	employeeSvc := NewEmployeeService(newMockEmployeeRepository())
	employee, err := employeeSvc.CreateEmployee(model.CreateEmployeeRequest{Name: "Sarah Chen", Email: "sarah@example.com", Department: "Engineering", Location: "HQ"})
	assert.NoError(t, err)

	ticketSvc := NewTicketService(newMockTicketRepository(), assetSvc, employeeSvc)
	return ticketSvc, employee.ID, asset.ID
}

func TestCreateTicket_BuildsSnapshotAndInitialTimeline(t *testing.T) {
	ticketSvc, employeeID, assetID := seedTicketDeps(t)

	ticket, err := ticketSvc.CreateTicket(model.CreateTicketRequest{
		RequesterID: employeeID,
		AssetID:     assetID,
		Category:    "Hardware Fault & Repair",
		Priority:    "High",
		Title:       "Laptop won't power on",
	})

	assert.NoError(t, err)
	assert.NotEmpty(t, ticket.ID)
	assert.NotEmpty(t, ticket.TicketCode)
	assert.Equal(t, "PENDING_DEPT_APPROVAL", ticket.Status)
	assert.Equal(t, 8, ticket.SLATargetHours) // High priority, matching frontend's SLA_HOURS map
	assert.Equal(t, "Sarah Chen", ticket.Requester.Name)
	assert.Equal(t, "MacBook Pro 16\"", ticket.Asset.Name)
	assert.Equal(t, "Pending", ticket.DepartmentApproval.Status)
	assert.Equal(t, "Pending Dispatch", ticket.ITExecution.CurrentStatus)
	assert.Len(t, ticket.Timeline, 1)
	assert.Equal(t, "Creation", ticket.Timeline[0].Stage)
}

func TestCreateTicket_UnknownRequesterOrAssetFails(t *testing.T) {
	ticketSvc, _, assetID := seedTicketDeps(t)

	_, err := ticketSvc.CreateTicket(model.CreateTicketRequest{RequesterID: "does-not-exist", AssetID: assetID})
	assert.Error(t, err)
}

func TestDecideApproval_ApproveMovesToPendingITDispatch(t *testing.T) {
	ticketSvc, employeeID, assetID := seedTicketDeps(t)
	ticket, err := ticketSvc.CreateTicket(model.CreateTicketRequest{RequesterID: employeeID, AssetID: assetID, Priority: "Low"})
	assert.NoError(t, err)

	approverName := "David Chen"
	updated, err := ticketSvc.DecideApproval(ticket.ID, model.ApprovalDecisionRequest{
		Decision:     "Approve",
		ApproverName: &approverName,
	})

	assert.NoError(t, err)
	assert.Equal(t, "PENDING_IT_DISPATCH", updated.Status)
	assert.Equal(t, "Approved", updated.DepartmentApproval.Status)
	assert.Equal(t, "David Chen", updated.DepartmentApproval.ApproverName)
	assert.Len(t, updated.Timeline, 2) // Creation + Dept Approval
}

func TestDecideApproval_RejectMovesToRejectedByDept(t *testing.T) {
	ticketSvc, employeeID, assetID := seedTicketDeps(t)
	ticket, err := ticketSvc.CreateTicket(model.CreateTicketRequest{RequesterID: employeeID, AssetID: assetID, Priority: "Low"})
	assert.NoError(t, err)

	updated, err := ticketSvc.DecideApproval(ticket.ID, model.ApprovalDecisionRequest{Decision: "Reject"})

	assert.NoError(t, err)
	assert.Equal(t, "REJECTED_BY_DEPT", updated.Status)
	assert.Equal(t, "Rejected", updated.DepartmentApproval.Status)
}

func TestDispatch_AssignsTechnicianAndMovesToInProgress(t *testing.T) {
	ticketSvc, employeeID, assetID := seedTicketDeps(t)
	ticket, err := ticketSvc.CreateTicket(model.CreateTicketRequest{RequesterID: employeeID, AssetID: assetID, Priority: "Medium"})
	assert.NoError(t, err)
	_, err = ticketSvc.DecideApproval(ticket.ID, model.ApprovalDecisionRequest{Decision: "Approve"})
	assert.NoError(t, err)

	updated, err := ticketSvc.Dispatch(ticket.ID, model.DispatchRequest{TechnicianID: "tech-1"})

	assert.NoError(t, err)
	assert.Equal(t, "IN_PROGRESS", updated.Status)
	assert.NotNil(t, updated.ITAssignment.TechnicianName)
	assert.Equal(t, "Alex Rivera", *updated.ITAssignment.TechnicianName)
	assert.Equal(t, "In-Progress", updated.ITExecution.CurrentStatus)
}

func TestUpdateExecutionStatus_DoneSetsCompletedAtAndResolutionFields(t *testing.T) {
	ticketSvc, employeeID, assetID := seedTicketDeps(t)
	ticket, err := ticketSvc.CreateTicket(model.CreateTicketRequest{RequesterID: employeeID, AssetID: assetID, Priority: "Medium"})
	assert.NoError(t, err)
	_, err = ticketSvc.DecideApproval(ticket.ID, model.ApprovalDecisionRequest{Decision: "Approve"})
	assert.NoError(t, err)
	_, err = ticketSvc.Dispatch(ticket.ID, model.DispatchRequest{TechnicianID: "tech-1"})
	assert.NoError(t, err)

	notes := "Replaced logic board."
	updated, err := ticketSvc.UpdateExecutionStatus(ticket.ID, model.StatusUpdateRequest{
		Status:          "Done",
		ResolutionNotes: &notes,
	})

	assert.NoError(t, err)
	assert.Equal(t, "DONE", updated.Status)
	assert.Equal(t, "Done", updated.ITExecution.CurrentStatus)
	assert.NotNil(t, updated.ITExecution.CompletedAt)
	assert.NotNil(t, updated.ITExecution.ResolutionNotes)
	assert.Equal(t, notes, *updated.ITExecution.ResolutionNotes)
}

func TestUpdateExecutionStatus_UnknownTicketReturnsNotFound(t *testing.T) {
	ticketSvc, _, _ := seedTicketDeps(t)

	_, err := ticketSvc.UpdateExecutionStatus("does-not-exist", model.StatusUpdateRequest{Status: "Planning"})

	assert.ErrorIs(t, err, ErrTicketNotFound)
}

func TestListTechnicians_ReturnsSeededTechnicians(t *testing.T) {
	ticketSvc, _, _ := seedTicketDeps(t)

	technicians, err := ticketSvc.ListTechnicians()

	assert.NoError(t, err)
	assert.Len(t, technicians, 1)
	assert.Equal(t, "Alex Rivera", technicians[0].Name)
}

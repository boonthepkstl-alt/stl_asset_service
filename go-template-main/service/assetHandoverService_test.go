package service

import (
	"singer/go-template-new-2026-06/model"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

// mockAssetHandoverRepository is an in-memory stand-in for AssetHandoverRepository, same
// pattern as mockTicketRepository -- no live DB required to run these tests.
type mockAssetHandoverRepository struct {
	handovers map[string]model.AssetHandoverModel
}

func newMockAssetHandoverRepository() *mockAssetHandoverRepository {
	return &mockAssetHandoverRepository{handovers: map[string]model.AssetHandoverModel{}}
}

func (m *mockAssetHandoverRepository) Create(handover model.AssetHandoverModel) error {
	m.handovers[handover.ID] = handover
	return nil
}

func (m *mockAssetHandoverRepository) GetByCode(code string) (model.AssetHandoverModel, error) {
	if h, ok := m.handovers[code]; ok {
		return h, nil
	}
	for _, h := range m.handovers {
		if h.HandoverCode == code {
			return h, nil
		}
	}
	return model.AssetHandoverModel{}, ErrHandoverNotFound
}

func (m *mockAssetHandoverRepository) Update(id string, handover model.AssetHandoverModel) (bool, error) {
	if _, ok := m.handovers[id]; !ok {
		return false, nil
	}
	m.handovers[id] = handover
	return true, nil
}

func (m *mockAssetHandoverRepository) List(query model.AssetHandoverListQuery) ([]model.AssetHandoverModel, int, error) {
	items := make([]model.AssetHandoverModel, 0, len(m.handovers))
	for _, h := range m.handovers {
		items = append(items, h)
	}
	return items, len(items), nil
}

func (m *mockAssetHandoverRepository) HasActiveForAsset(assetID string) (bool, error) {
	for _, h := range m.handovers {
		if h.Asset.ID == assetID && h.Status != HandoverStatusAssigned && h.Status != HandoverStatusRejected {
			return true, nil
		}
	}
	return false, nil
}

func (m *mockAssetHandoverRepository) CountByCodePrefix(prefix string) (int, error) {
	count := 0
	for _, h := range m.handovers {
		if strings.HasPrefix(h.HandoverCode, prefix) {
			count++
		}
	}
	return count, nil
}

// seedHandoverDeps creates a real AssetService (mock-repo-backed) with one IT Hardware asset
// already created, plus a fresh AssetHandoverService wired to it -- the combination
// InitiateHandover needs to resolve/guard the asset.
func seedHandoverDeps(t *testing.T) (AssetHandoverService, AssetService, model.AssetModel) {
	t.Helper()

	assetSvc := NewAssetService(newMockAssetRepository())
	asset, err := assetSvc.CreateAsset(model.CreateAssetRequest{
		Name:     "ThinkPad X1 Carbon",
		Category: CategoryITHardware,
		Type:     "Laptop",
		Location: "HQ",
	})
	assert.NoError(t, err)

	handoverSvc := NewAssetHandoverService(newMockAssetHandoverRepository(), assetSvc)
	return handoverSvc, assetSvc, asset
}

var initiator = model.HandoverPerson{ID: "admin-1", Name: "IT Admin", Role: "Initiator"}

func TestInitiateHandover_CreatesPendingRecipientConfirmation(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)

	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{
		EmployeeID:   "emp-1",
		EmployeeName: "Sarah Chen",
	}, initiator)

	assert.NoError(t, err)
	assert.NotEmpty(t, handover.ID)
	assert.NotEmpty(t, handover.HandoverCode)
	assert.Equal(t, HandoverStatusPendingRecipientConfirmation, handover.Status)
	assert.Equal(t, "Sarah Chen", handover.Recipient.Name)
	assert.Equal(t, asset.ID, handover.Asset.ID)
	assert.Len(t, handover.Timeline, 1)
	assert.Equal(t, "Initiation", handover.Timeline[0].Stage)
}

func TestInitiateHandover_NonITHardwareAssetRejected(t *testing.T) {
	assetSvc := NewAssetService(newMockAssetRepository())
	asset, err := assetSvc.CreateAsset(model.CreateAssetRequest{Name: "Office Chair", Category: "Office Equipment"})
	assert.NoError(t, err)
	handoverSvc := NewAssetHandoverService(newMockAssetHandoverRepository(), assetSvc)

	_, err = handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)

	assert.ErrorIs(t, err, ErrAssetNotITHardware)
}

func TestInitiateHandover_NotAvailableAssetRejected(t *testing.T) {
	handoverSvc, assetSvc, asset := seedHandoverDeps(t)
	_, err := assetSvc.CompleteHandoverAssignment(asset.ID, "emp-0", "Someone Else")
	assert.NoError(t, err)

	_, err = handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)

	assert.ErrorIs(t, err, ErrAssetNotAvailable)
}

func TestInitiateHandover_EmptyRecipientRejected(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)

	_, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "", EmployeeName: ""}, initiator)

	assert.ErrorIs(t, err, ErrInvalidRecipient)
}

func TestInitiateHandover_EmptyRecipientCannotBeConfirmedByEmptyID(t *testing.T) {
	// Regression guard for the ConfirmReceipt empty-string identity bypass: since
	// InitiateHandover now rejects an empty recipient outright, no handover can ever reach
	// ConfirmReceipt with Recipient.ID == "", so an empty RecipientID on confirm can never match.
	handoverSvc, _, asset := seedHandoverDeps(t)
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)

	_, err = handoverSvc.ConfirmReceipt(handover.ID, model.ConfirmReceiptRequest{RecipientID: "", RecipientName: ""})

	assert.ErrorIs(t, err, ErrHandoverWrongRecipient)
}

func TestInitiateHandover_SequenceIsScopedPerYear(t *testing.T) {
	handoverSvc, assetSvc, asset := seedHandoverDeps(t)
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)
	assert.True(t, strings.HasSuffix(handover.HandoverCode, "-001"), "expected first handover of the year to end in -001, got %s", handover.HandoverCode)

	asset2, err := assetSvc.CreateAsset(model.CreateAssetRequest{Name: "Second Laptop", Category: CategoryITHardware, Type: "Laptop"})
	assert.NoError(t, err)
	handover2, err := handoverSvc.InitiateHandover(asset2.ID, model.InitiateHandoverRequest{EmployeeID: "emp-2", EmployeeName: "Other Employee"}, initiator)
	assert.NoError(t, err)
	assert.True(t, strings.HasSuffix(handover2.HandoverCode, "-002"), "expected second handover of the year to end in -002, got %s", handover2.HandoverCode)
}

func TestInitiateHandover_AlreadyActiveHandoverRejected(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)
	_, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)

	_, err = handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-2", EmployeeName: "Someone Else"}, initiator)

	assert.ErrorIs(t, err, ErrHandoverAlreadyActive)
}

func TestConfirmReceipt_MovesToPendingITProcessing(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)

	updated, err := handoverSvc.ConfirmReceipt(handover.ID, model.ConfirmReceiptRequest{RecipientID: "emp-1", RecipientName: "Sarah Chen"})

	assert.NoError(t, err)
	assert.Equal(t, HandoverStatusPendingITProcessing, updated.Status)
	assert.NotNil(t, updated.ConfirmedAt)
	assert.Len(t, updated.Timeline, 2)
}

func TestConfirmReceipt_WrongRecipientRejected(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)

	_, err = handoverSvc.ConfirmReceipt(handover.ID, model.ConfirmReceiptRequest{RecipientID: "emp-999", RecipientName: "Someone Else"})

	assert.ErrorIs(t, err, ErrHandoverWrongRecipient)
}

func TestConfirmReceipt_WrongStageRejected(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)
	_, err = handoverSvc.ConfirmReceipt(handover.ID, model.ConfirmReceiptRequest{RecipientID: "emp-1", RecipientName: "Sarah Chen"})
	assert.NoError(t, err)

	_, err = handoverSvc.ConfirmReceipt(handover.ID, model.ConfirmReceiptRequest{RecipientID: "emp-1", RecipientName: "Sarah Chen"})

	assert.ErrorIs(t, err, ErrHandoverWrongStage)
}

func fullyProcessedHandover(t *testing.T, handoverSvc AssetHandoverService, asset model.AssetModel) model.AssetHandoverModel {
	t.Helper()
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)
	handover, err = handoverSvc.ConfirmReceipt(handover.ID, model.ConfirmReceiptRequest{RecipientID: "emp-1", RecipientName: "Sarah Chen"})
	assert.NoError(t, err)
	handover, err = handoverSvc.ProcessHandover(handover.ID, model.ProcessHandoverRequest{ActorID: "it-1", ActorName: "Jamie IT"})
	assert.NoError(t, err)
	return handover
}

func TestProcessHandover_MovesToPendingITSupervisorApproval(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)
	handover, err = handoverSvc.ConfirmReceipt(handover.ID, model.ConfirmReceiptRequest{RecipientID: "emp-1", RecipientName: "Sarah Chen"})
	assert.NoError(t, err)

	updated, err := handoverSvc.ProcessHandover(handover.ID, model.ProcessHandoverRequest{ActorID: "it-1", ActorName: "Jamie IT"})

	assert.NoError(t, err)
	assert.Equal(t, HandoverStatusPendingITSupervisorApproval, updated.Status)
	assert.NotNil(t, updated.ProcessedBy)
	assert.Equal(t, "Jamie IT", updated.ProcessedBy.Name)
}

func TestDecideHandover_ApproveAssignsAssetAndSetsStatus(t *testing.T) {
	handoverSvc, assetSvc, asset := seedHandoverDeps(t)
	handover := fullyProcessedHandover(t, handoverSvc, asset)

	updated, err := handoverSvc.DecideHandover(handover.ID, model.HandoverDecisionRequest{Decision: "APPROVE", ActorID: "mgr-1", ActorName: "Morgan Lead"})

	assert.NoError(t, err)
	assert.Equal(t, HandoverStatusAssigned, updated.Status)
	assert.NotNil(t, updated.ApprovedBy)
	assert.Equal(t, "Morgan Lead", updated.ApprovedBy.Name)

	refreshed, err := assetSvc.GetAsset(asset.ID)
	assert.NoError(t, err)
	assert.Equal(t, "Assigned", refreshed.Status)
	assert.NotNil(t, refreshed.AssignedEmployeeID)
	assert.Equal(t, "emp-1", *refreshed.AssignedEmployeeID)
}

func TestDecideHandover_ApproveBeforeSupervisorStageRejected(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)

	_, err = handoverSvc.DecideHandover(handover.ID, model.HandoverDecisionRequest{Decision: "APPROVE", ActorID: "mgr-1", ActorName: "Morgan Lead"})

	assert.ErrorIs(t, err, ErrHandoverWrongStage)
}

func TestDecideHandover_RejectAtITProcessingReturnsAssetAvailable(t *testing.T) {
	handoverSvc, assetSvc, asset := seedHandoverDeps(t)
	handover, err := handoverSvc.InitiateHandover(asset.ID, model.InitiateHandoverRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"}, initiator)
	assert.NoError(t, err)
	handover, err = handoverSvc.ConfirmReceipt(handover.ID, model.ConfirmReceiptRequest{RecipientID: "emp-1", RecipientName: "Sarah Chen"})
	assert.NoError(t, err)

	updated, err := handoverSvc.DecideHandover(handover.ID, model.HandoverDecisionRequest{Decision: "REJECT", ActorID: "it-1", ActorName: "Jamie IT"})

	assert.NoError(t, err)
	assert.Equal(t, HandoverStatusRejected, updated.Status)
	assert.NotNil(t, updated.RejectionStage)
	assert.Equal(t, "IT Processing", *updated.RejectionStage)

	refreshed, err := assetSvc.GetAsset(asset.ID)
	assert.NoError(t, err)
	assert.Equal(t, "Available", refreshed.Status)
}

func TestDecideHandover_RejectAtSupervisorApprovalTerminal(t *testing.T) {
	handoverSvc, assetSvc, asset := seedHandoverDeps(t)
	handover := fullyProcessedHandover(t, handoverSvc, asset)

	updated, err := handoverSvc.DecideHandover(handover.ID, model.HandoverDecisionRequest{Decision: "REJECT", ActorID: "mgr-1", ActorName: "Morgan Lead"})

	assert.NoError(t, err)
	assert.Equal(t, HandoverStatusRejected, updated.Status)
	assert.Equal(t, "IT Supervisor Approval", *updated.RejectionStage)

	refreshed, err := assetSvc.GetAsset(asset.ID)
	assert.NoError(t, err)
	assert.Equal(t, "Available", refreshed.Status)

	// Terminal: a second decision on an already-rejected handover is rejected.
	_, err = handoverSvc.DecideHandover(updated.ID, model.HandoverDecisionRequest{Decision: "APPROVE", ActorID: "mgr-1", ActorName: "Morgan Lead"})
	assert.ErrorIs(t, err, ErrHandoverWrongStage)
}

func TestDecideHandover_InvalidDecisionRejected(t *testing.T) {
	handoverSvc, _, asset := seedHandoverDeps(t)
	handover := fullyProcessedHandover(t, handoverSvc, asset)

	_, err := handoverSvc.DecideHandover(handover.ID, model.HandoverDecisionRequest{Decision: "MAYBE", ActorID: "mgr-1", ActorName: "Morgan Lead"})

	assert.ErrorIs(t, err, ErrInvalidDecision)
}

func TestAssignAsset_ITHardwareRejectedRequiresHandover(t *testing.T) {
	_, assetSvc, asset := seedHandoverDeps(t)

	_, err := assetSvc.AssignAsset(asset.ID, model.AssignAssetRequest{EmployeeID: "emp-1", EmployeeName: "Sarah Chen"})

	assert.ErrorIs(t, err, ErrRequiresHandoverApproval)
}

func TestGetHandover_UnknownCodeReturnsNotFound(t *testing.T) {
	handoverSvc, _, _ := seedHandoverDeps(t)

	_, err := handoverSvc.GetHandover("does-not-exist")

	assert.ErrorIs(t, err, ErrHandoverNotFound)
}

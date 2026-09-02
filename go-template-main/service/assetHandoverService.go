package service

import (
	"errors"
	"fmt"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/repository"
	"time"

	"github.com/google/uuid"
)

var (
	ErrHandoverNotFound       = errors.New("asset handover not found")
	ErrAssetNotITHardware     = errors.New("asset is not IT Hardware category")
	ErrAssetNotAvailable      = errors.New("asset is not Available")
	ErrHandoverAlreadyActive  = errors.New("asset already has an active handover pending")
	ErrHandoverWrongStage     = errors.New("handover is not at the expected stage for this action")
	ErrHandoverWrongRecipient = errors.New("only the recipient may confirm receipt")
	ErrInvalidDecision        = errors.New("decision must be APPROVE or REJECT")
	ErrInvalidRecipient       = errors.New("employeeId and employeeName are required")
)

const (
	HandoverStatusPendingRecipientConfirmation = "PENDING_RECIPIENT_CONFIRMATION"
	HandoverStatusPendingITProcessing          = "PENDING_IT_PROCESSING"
	HandoverStatusPendingITSupervisorApproval  = "PENDING_IT_SUPERVISOR_APPROVAL"
	HandoverStatusAssigned                     = "ASSIGNED"
	HandoverStatusRejected                     = "REJECTED"
)

// AssetHandoverService -- RAISE-FR-OPS-002's IT Hardware Assignment Approval Workflow
// (PRD Sec16 Resolved Question 43, narrowing Resolved Question 42; RAISE-DESIGN.md Sec4.2).
// Confirmed 4-stage state model:
//
//	PENDING_RECIPIENT_CONFIRMATION -> PENDING_IT_PROCESSING -> PENDING_IT_SUPERVISOR_APPROVAL -> ASSIGNED
//	                                                                                           -> REJECTED (terminal, Stage 3 or 4 only)
//
// No recipient-decline path at Stage 2 is implemented -- not confirmed, not invented (see
// RAISE-DESIGN.md's own "Open Design Point"/"Explicitly Not Designed Here" notes). No role
// check is performed here (IT_STAFF/IT_MANAGER) -- matching this codebase's existing,
// documented, project-wide MVP decision that RBAC enforcement is UI-only/client-side for
// every domain (PRD Sec16 Resolved Question 38); the actor identity passed in is trusted the
// same way TicketService trusts ApprovalDecisionRequest.ApproverName.
type AssetHandoverService interface {
	ListHandovers(query model.AssetHandoverListQuery) (*model.AssetHandoverListResponse, error)
	GetHandover(code string) (model.AssetHandoverModel, error)
	InitiateHandover(assetID string, input model.InitiateHandoverRequest, initiatedBy model.HandoverPerson) (model.AssetHandoverModel, error)
	ConfirmReceipt(id string, input model.ConfirmReceiptRequest) (model.AssetHandoverModel, error)
	ProcessHandover(id string, input model.ProcessHandoverRequest) (model.AssetHandoverModel, error)
	DecideHandover(id string, input model.HandoverDecisionRequest) (model.AssetHandoverModel, error)
}

type assetHandoverService struct {
	repo         repository.AssetHandoverRepository
	assetService AssetService
}

func NewAssetHandoverService(repo repository.AssetHandoverRepository, assetService AssetService) AssetHandoverService {
	return &assetHandoverService{repo: repo, assetService: assetService}
}

func (s *assetHandoverService) ListHandovers(query model.AssetHandoverListQuery) (*model.AssetHandoverListResponse, error) {
	items, total, err := s.repo.List(query)
	if err != nil {
		return nil, err
	}
	return &model.AssetHandoverListResponse{Data: items, Total: total}, nil
}

func (s *assetHandoverService) GetHandover(code string) (model.AssetHandoverModel, error) {
	handover, err := s.repo.GetByCode(code)
	if err != nil {
		return model.AssetHandoverModel{}, ErrHandoverNotFound
	}
	return handover, nil
}

func handoverTimelineID() string {
	return "hl-" + uuid.New().String()
}

// InitiateHandover is Stage 1 -- same trigger action as the general Assign flow (an IT/Admin
// user selects an employee), but for an IT Hardware asset this creates a pending approval
// record instead of immediately flipping the asset's status. Guards: asset must exist, must be
// IT Hardware category, must currently be Available, and must not already have an active
// (non-terminal) handover -- the last guard is an implementation-level safeguard against two
// concurrent handovers on the same asset, not an invented business rule.
func (s *assetHandoverService) InitiateHandover(assetID string, input model.InitiateHandoverRequest, initiatedBy model.HandoverPerson) (model.AssetHandoverModel, error) {
	log := logger.GetLogger()
	log.Infof("InitiateHandover - assetId: %s, employeeId: %s", assetID, input.EmployeeID)

	if input.EmployeeID == "" || input.EmployeeName == "" {
		return model.AssetHandoverModel{}, ErrInvalidRecipient
	}

	asset, err := s.assetService.GetAsset(assetID)
	if err != nil {
		return model.AssetHandoverModel{}, ErrAssetNotFound
	}
	if asset.Category != CategoryITHardware {
		return model.AssetHandoverModel{}, ErrAssetNotITHardware
	}
	if asset.Status != "Available" {
		return model.AssetHandoverModel{}, ErrAssetNotAvailable
	}

	hasActive, err := s.repo.HasActiveForAsset(assetID)
	if err != nil {
		return model.AssetHandoverModel{}, err
	}
	if hasActive {
		return model.AssetHandoverModel{}, ErrHandoverAlreadyActive
	}

	// Known residual risk (code-review, 2026-09-02): count-then-insert has a TOCTOU window --
	// two concurrent InitiateHandover calls can read the same count and collide on
	// handover_code's UNIQUE constraint, surfacing as a 500 to the loser. Same unaddressed
	// pattern as TicketService.CreateTicket's ticket-code generation; a real fix needs a DB
	// sequence or SELECT ... FOR UPDATE, which is a larger change than this first cut's scope.
	year := time.Now().Year()
	codePrefix := fmt.Sprintf("AHO-%d-", year)
	countThisYear, err := s.repo.CountByCodePrefix(codePrefix)
	if err != nil {
		return model.AssetHandoverModel{}, err
	}
	seq := countThisYear + 1

	now := time.Now().Format(time.RFC3339)
	handover := model.AssetHandoverModel{
		ID:           uuid.New().String(),
		HandoverCode: fmt.Sprintf("%s%03d", codePrefix, seq),
		Status:       HandoverStatusPendingRecipientConfirmation,
		CreatedAt:    now,
		Asset: model.HandoverAsset{
			ID:       asset.ID,
			Code:     asset.Code,
			Name:     asset.Name,
			Category: asset.Category,
			Type:     asset.Type,
		},
		Recipient: model.HandoverPerson{
			ID:   input.EmployeeID,
			Name: input.EmployeeName,
		},
		InitiatedBy: initiatedBy,
		InitiatedAt: now,
		Timeline: []model.TimelineEvent{
			{
				ID:        handoverTimelineID(),
				Stage:     "Initiation",
				ActorName: initiatedBy.Name,
				ActorRole: initiatedBy.Role,
				Timestamp: now,
				Action:    fmt.Sprintf("Assignment initiated for %s -- awaiting recipient confirmation.", input.EmployeeName),
			},
		},
	}

	if err := s.repo.Create(handover); err != nil {
		log.Errorf("InitiateHandover create error: %v", err)
		return model.AssetHandoverModel{}, err
	}

	return handover, nil
}

// ConfirmReceipt is Stage 2 -- the recipient employee confirms receipt themselves (combines
// the real paper form's recipient + recipient-supervisor signatures into one digital step, per
// confirmed business decision). Only the recipient named at Stage 1 may confirm.
func (s *assetHandoverService) ConfirmReceipt(id string, input model.ConfirmReceiptRequest) (model.AssetHandoverModel, error) {
	handover, err := s.repo.GetByCode(id)
	if err != nil {
		return model.AssetHandoverModel{}, ErrHandoverNotFound
	}
	if handover.Status != HandoverStatusPendingRecipientConfirmation {
		return model.AssetHandoverModel{}, ErrHandoverWrongStage
	}
	if handover.Recipient.ID != input.RecipientID {
		return model.AssetHandoverModel{}, ErrHandoverWrongRecipient
	}

	now := time.Now().Format(time.RFC3339)
	handover.Status = HandoverStatusPendingITProcessing
	handover.ConfirmedAt = strPtr(now)
	handover.Timeline = append(handover.Timeline, model.TimelineEvent{
		ID:        handoverTimelineID(),
		Stage:     "Recipient Confirmation",
		ActorName: input.RecipientName,
		ActorRole: "Recipient",
		Timestamp: now,
		Action:    "Recipient confirmed receipt of equipment.",
	})

	if _, err := s.repo.Update(handover.ID, handover); err != nil {
		return model.AssetHandoverModel{}, err
	}
	return handover, nil
}

// ProcessHandover is Stage 3 -- an IT_STAFF user (role gated at the UI layer, see this
// service's doc comment) processes the confirmed handover.
func (s *assetHandoverService) ProcessHandover(id string, input model.ProcessHandoverRequest) (model.AssetHandoverModel, error) {
	handover, err := s.repo.GetByCode(id)
	if err != nil {
		return model.AssetHandoverModel{}, ErrHandoverNotFound
	}
	if handover.Status != HandoverStatusPendingITProcessing {
		return model.AssetHandoverModel{}, ErrHandoverWrongStage
	}

	now := time.Now().Format(time.RFC3339)
	handover.Status = HandoverStatusPendingITSupervisorApproval
	handover.ProcessedBy = &model.HandoverPerson{ID: input.ActorID, Name: input.ActorName, Role: "IT Staff"}
	handover.ProcessedAt = strPtr(now)
	handover.Timeline = append(handover.Timeline, model.TimelineEvent{
		ID:        handoverTimelineID(),
		Stage:     "IT Processing",
		ActorName: input.ActorName,
		ActorRole: "IT Staff",
		Timestamp: now,
		Action:    "IT processed the handover -- awaiting supervisor approval.",
	})

	if _, err := s.repo.Update(handover.ID, handover); err != nil {
		return model.AssetHandoverModel{}, err
	}
	return handover, nil
}

// DecideHandover is Stage 4 (approve, by an IT_MANAGER user) -- but also accepts a REJECT
// decision from Stage 3 (an IT_STAFF user rejecting during processing), per PRD Sec16 Resolved
// Question 43's confirmed rule that rejection is possible at either Stage 3 or Stage 4.
// Approval is the only action in the entire workflow that flips the asset's status to
// Assigned. Rejection is terminal (no reopening), matching RAISE-FR-MAINT-001's
// REJECTED_BY_DEPT precedent -- the asset was never touched, so no revert is needed, it simply
// stays Available.
//
// Known residual risk (code-review, 2026-09-02): the APPROVE branch's asset-state write
// (CompleteHandoverAssignment) and this handover record's own status write below are two
// separate, non-transactional calls -- there is no shared-transaction mechanism across
// services in this codebase (same best-effort trade-off already documented on
// assetController.recordAudit). If the asset write succeeds but the handover-record write then
// fails, the two tables are left permanently disagreeing with no repair path. A real fix needs
// a shared DB transaction spanning both repositories, which is a larger change than this first
// cut's scope.
func (s *assetHandoverService) DecideHandover(id string, input model.HandoverDecisionRequest) (model.AssetHandoverModel, error) {
	handover, err := s.repo.GetByCode(id)
	if err != nil {
		return model.AssetHandoverModel{}, ErrHandoverNotFound
	}

	switch input.Decision {
	case "APPROVE":
		if handover.Status != HandoverStatusPendingITSupervisorApproval {
			return model.AssetHandoverModel{}, ErrHandoverWrongStage
		}
		if _, err := s.assetService.CompleteHandoverAssignment(handover.Asset.ID, handover.Recipient.ID, handover.Recipient.Name); err != nil {
			return model.AssetHandoverModel{}, err
		}

		now := time.Now().Format(time.RFC3339)
		handover.Status = HandoverStatusAssigned
		handover.ApprovedBy = &model.HandoverPerson{ID: input.ActorID, Name: input.ActorName, Role: "IT Supervisor"}
		handover.ApprovedAt = strPtr(now)
		handover.Timeline = append(handover.Timeline, model.TimelineEvent{
			ID:        handoverTimelineID(),
			Stage:     "IT Supervisor Approval",
			ActorName: input.ActorName,
			ActorRole: "IT Supervisor",
			Timestamp: now,
			Action:    "IT Supervisor approved -- asset assigned.",
		})

	case "REJECT":
		if handover.Status != HandoverStatusPendingITProcessing && handover.Status != HandoverStatusPendingITSupervisorApproval {
			return model.AssetHandoverModel{}, ErrHandoverWrongStage
		}

		rejectionStage := "IT Processing"
		actorRole := "IT Staff"
		if handover.Status == HandoverStatusPendingITSupervisorApproval {
			rejectionStage = "IT Supervisor Approval"
			actorRole = "IT Supervisor"
		}

		now := time.Now().Format(time.RFC3339)
		handover.Status = HandoverStatusRejected
		handover.RejectedBy = &model.HandoverPerson{ID: input.ActorID, Name: input.ActorName, Role: actorRole}
		handover.RejectedAt = strPtr(now)
		handover.RejectionStage = strPtr(rejectionStage)
		handover.RejectionReason = input.Reason
		handover.Timeline = append(handover.Timeline, model.TimelineEvent{
			ID:        handoverTimelineID(),
			Stage:     rejectionStage,
			ActorName: input.ActorName,
			ActorRole: actorRole,
			Timestamp: now,
			Action:    "Rejected -- asset remains Available.",
			Notes:     input.Reason,
		})

	default:
		return model.AssetHandoverModel{}, ErrInvalidDecision
	}

	if _, err := s.repo.Update(handover.ID, handover); err != nil {
		return model.AssetHandoverModel{}, err
	}
	return handover, nil
}

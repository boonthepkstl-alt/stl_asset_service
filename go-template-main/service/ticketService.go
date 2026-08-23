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
	ErrTicketNotFound     = errors.New("ticket not found")
	ErrTechnicianNotFound = errors.New("technician not found")
)

// slaHours mirrors frontend/src/services/ticket-service.ts's SLA_HOURS map exactly.
var slaHours = map[string]int{
	"Critical": 2,
	"High":     8,
	"Medium":   24,
	"Low":      48,
}

// statusMap mirrors ticket-repository.ts's updateExecutionStatus statusMap exactly.
var executionStatusMap = map[string]string{
	"Planning":    "PLANNING",
	"In-Progress": "IN_PROGRESS",
	"On-Hold":     "ON_HOLD",
	"Done":        "DONE",
}

// TicketService -- RAISE-FR-MAINT-001. Deliberately narrower than the frontend's
// ticketService: changeAsset/changeRequester (admin correction utilities) and
// listDelegationSettings (delegated-approver *configuration*, as opposed to the
// isDelegated/delegatedBy fields already on a ticket, which this domain does carry) are not
// implemented here. Neither is part of the confirmed 4-stage-workflow AC set
// (AC-MAINT-001-03..09); adding them would be inventing scope beyond what PRD Sec16 Resolved
// Question 33 actually confirmed. Flagged here, not silently done -- a future PR can add them
// once/if they're confirmed needed.
type TicketService interface {
	ListTickets(query model.TicketListQuery) (*model.TicketListResponse, error)
	GetTicket(code string) (model.TicketModel, error)
	ListTechnicians() ([]model.ITTechnician, error)
	CreateTicket(input model.CreateTicketRequest) (model.TicketModel, error)
	DecideApproval(id string, input model.ApprovalDecisionRequest) (model.TicketModel, error)
	Dispatch(id string, input model.DispatchRequest) (model.TicketModel, error)
	UpdateExecutionStatus(id string, input model.StatusUpdateRequest) (model.TicketModel, error)
}

type ticketService struct {
	repo            repository.TicketRepository
	assetService    AssetService
	employeeService EmployeeService
}

func NewTicketService(repo repository.TicketRepository, assetService AssetService, employeeService EmployeeService) TicketService {
	return &ticketService{repo: repo, assetService: assetService, employeeService: employeeService}
}

func (s *ticketService) ListTickets(query model.TicketListQuery) (*model.TicketListResponse, error) {
	items, total, err := s.repo.List(query)
	if err != nil {
		return nil, err
	}
	return &model.TicketListResponse{Data: items, Total: total}, nil
}

func (s *ticketService) GetTicket(code string) (model.TicketModel, error) {
	return s.repo.GetByCode(code)
}

func (s *ticketService) ListTechnicians() ([]model.ITTechnician, error) {
	return s.repo.ListTechnicians()
}

func timelineID() string {
	return "tl-" + uuid.New().String()
}

// CreateTicket resolves requesterId/assetId against the Employee/Asset domains and builds the
// same requester/asset snapshot + initial timeline event as
// frontend/src/services/ticket-service.ts's createTicket, so a backend-created ticket looks
// identical to a mock-created one.
func (s *ticketService) CreateTicket(input model.CreateTicketRequest) (model.TicketModel, error) {
	log := logger.GetLogger()
	log.Infof("CreateTicket - input: %+v", input)

	requester, err := s.employeeService.GetEmployee(input.RequesterID)
	if err != nil {
		return model.TicketModel{}, fmt.Errorf("employee %s not found", input.RequesterID)
	}
	asset, err := s.assetService.GetAsset(input.AssetID)
	if err != nil {
		return model.TicketModel{}, fmt.Errorf("asset %s not found", input.AssetID)
	}

	_, total, err := s.repo.List(model.TicketListQuery{})
	if err != nil {
		return model.TicketModel{}, err
	}
	seq := total + 1

	description := input.Description
	if description == "" {
		description = "User requested inspection and servicing."
	}
	location := input.Location
	if location == "" {
		location = asset.Location
	}

	isMyAssignedAsset := asset.AssignedEmployeeID != nil && *asset.AssignedEmployeeID == requester.ID

	ticket := model.TicketModel{
		ID:             uuid.New().String(),
		TicketCode:     fmt.Sprintf("ITR-%d-%03d", time.Now().Year(), seq),
		Category:       input.Category,
		Priority:       input.Priority,
		SLATargetHours: slaHours[input.Priority],
		Title:          input.Title,
		Description:    description,
		Location:       location,
		CreatedAt:      time.Now().Format(time.RFC3339),
		Status:         "PENDING_DEPT_APPROVAL",
		Requester: model.TicketRequester{
			ID:          requester.ID,
			Name:        requester.Name,
			Email:       requester.Email,
			JobTitle:    requester.JobTitle,
			Department:  requester.Department,
			Initials:    requester.Initials,
			AvatarColor: requester.AvatarColor,
		},
		Asset: model.TicketAsset{
			ID:                asset.ID,
			Code:              asset.Code,
			Name:              asset.Name,
			Type:              asset.Type,
			SerialNumber:      asset.SerialNumber,
			Location:          asset.Location,
			IsMyAssignedAsset: isMyAssignedAsset,
			PurchaseCost:      asset.PurchaseCost,
			CurrentValue:      asset.CurrentValue,
		},
		DepartmentApproval: model.DepartmentApproval{
			Status:        "Pending",
			ApproverName:  orDefault(requester.Manager, "Department Lead"),
			ApproverTitle: "Department Head",
			IsDelegated:   false,
		},
		ITAssignment: model.ITAssignment{},
		ITExecution:  model.ITExecution{CurrentStatus: "Pending Dispatch"},
		Timeline: []model.TimelineEvent{
			{
				ID:        timelineID(),
				Stage:     "Creation",
				ActorName: requester.Name,
				ActorRole: fmt.Sprintf("Requester (%s)", requester.JobTitle),
				Timestamp: time.Now().Format(time.RFC3339),
				Action:    "Requisition submitted and routed to department head for review.",
			},
		},
	}

	if err := s.repo.Create(ticket); err != nil {
		log.Errorf("CreateTicket error: %v", err)
		return model.TicketModel{}, err
	}

	return ticket, nil
}

func orDefault(value, def string) string {
	if value == "" {
		return def
	}
	return value
}

func strPtr(s string) *string { return &s }

// DecideApproval mirrors ticket-repository.ts's decideApproval exactly: Approve ->
// PENDING_IT_DISPATCH, Reject -> REJECTED_BY_DEPT.
func (s *ticketService) DecideApproval(id string, input model.ApprovalDecisionRequest) (model.TicketModel, error) {
	ticket, err := s.repo.GetByCode(id)
	if err != nil {
		return model.TicketModel{}, ErrTicketNotFound
	}

	isApproved := input.Decision == "Approve"
	approverName := ticket.DepartmentApproval.ApproverName
	if input.ApproverName != nil {
		approverName = *input.ApproverName
	}
	isDelegated := ticket.DepartmentApproval.IsDelegated
	if input.IsDelegated != nil {
		isDelegated = *input.IsDelegated
	}
	delegatedBy := ticket.DepartmentApproval.DelegatedBy
	if input.DelegatedBy != nil {
		delegatedBy = input.DelegatedBy
	}
	comments := input.Comments
	if comments == nil || *comments == "" {
		defaultComment := "Rejected."
		if isApproved {
			defaultComment = "Approved."
		}
		comments = &defaultComment
	}

	if isApproved {
		ticket.Status = "PENDING_IT_DISPATCH"
	} else {
		ticket.Status = "REJECTED_BY_DEPT"
	}
	ticket.DepartmentApproval = model.DepartmentApproval{
		Status:        map[bool]string{true: "Approved", false: "Rejected"}[isApproved],
		ApproverName:  approverName,
		ApproverTitle: ticket.DepartmentApproval.ApproverTitle,
		IsDelegated:   isDelegated,
		DelegatedBy:   delegatedBy,
		ApprovedAt:    strPtr(time.Now().Format(time.RFC3339)),
		Comments:      comments,
	}

	actorRole := "Department Head"
	if isDelegated {
		actorRole = "Delegated Acting Approver"
	}
	action := "Department Head Sign-off Rejected"
	if isApproved {
		action = "Department Head Sign-off Approved"
	}
	ticket.Timeline = append(ticket.Timeline, model.TimelineEvent{
		ID:        timelineID(),
		Stage:     "Dept Approval",
		ActorName: approverName,
		ActorRole: actorRole,
		Timestamp: time.Now().Format(time.RFC3339),
		Action:    action,
		Notes:     input.Comments,
	})

	if _, err := s.repo.Update(ticket.ID, ticket); err != nil {
		return model.TicketModel{}, err
	}
	return ticket, nil
}

// Dispatch mirrors ticket-repository.ts's dispatch exactly: assigns a technician, moves the
// ticket to IN_PROGRESS.
func (s *ticketService) Dispatch(id string, input model.DispatchRequest) (model.TicketModel, error) {
	ticket, err := s.repo.GetByCode(id)
	if err != nil {
		return model.TicketModel{}, ErrTicketNotFound
	}

	technicians, err := s.repo.ListTechnicians()
	if err != nil {
		return model.TicketModel{}, err
	}
	var tech *model.ITTechnician
	for i := range technicians {
		if technicians[i].ID == input.TechnicianID {
			tech = &technicians[i]
			break
		}
	}
	if tech == nil {
		if len(technicians) == 0 {
			return model.TicketModel{}, ErrTechnicianNotFound
		}
		tech = &technicians[0]
	}

	role := tech.Role
	if role == "" {
		role = tech.Specialty
	}

	ticket.Status = "IN_PROGRESS"
	ticket.ITAssignment = model.ITAssignment{
		AssignedAt:           strPtr(time.Now().Format(time.RFC3339)),
		TechnicianID:         strPtr(tech.ID),
		TechnicianName:       strPtr(tech.Name),
		TechnicianRole:       strPtr(role),
		TechnicianAvatar:     strPtr(tech.AvatarColor),
		EstimatedCost:        input.EstimatedCost,
		TargetResolutionDate: input.TargetResolutionDate,
	}
	diagnosticNotes := ticket.ITExecution.DiagnosticNotes
	if input.Notes != nil {
		diagnosticNotes = input.Notes
	}
	ticket.ITExecution.CurrentStatus = "In-Progress"
	ticket.ITExecution.DiagnosticNotes = diagnosticNotes

	ticket.Timeline = append(ticket.Timeline, model.TimelineEvent{
		ID:        timelineID(),
		Stage:     "IT Assignment",
		ActorName: tech.Name,
		ActorRole: role,
		Timestamp: time.Now().Format(time.RFC3339),
		Action:    fmt.Sprintf("Assigned to %s (%s)", tech.Name, role),
		Notes:     input.Notes,
	})

	if _, err := s.repo.Update(ticket.ID, ticket); err != nil {
		return model.TicketModel{}, err
	}
	return ticket, nil
}

// UpdateExecutionStatus mirrors ticket-repository.ts's updateExecutionStatus exactly,
// including which fields only apply on the ON_HOLD/DONE transitions.
func (s *ticketService) UpdateExecutionStatus(id string, input model.StatusUpdateRequest) (model.TicketModel, error) {
	ticket, err := s.repo.GetByCode(id)
	if err != nil {
		return model.TicketModel{}, ErrTicketNotFound
	}

	nextStatus, ok := executionStatusMap[input.Status]
	if !ok {
		return model.TicketModel{}, fmt.Errorf("invalid status %q", input.Status)
	}

	ticket.Status = nextStatus
	ticket.ITExecution.CurrentStatus = input.Status
	if nextStatus == "ON_HOLD" {
		ticket.ITExecution.HoldCategory = input.HoldCategory
		ticket.ITExecution.HoldReason = input.HoldReason
	}
	if input.DiagnosticNotes != nil {
		ticket.ITExecution.DiagnosticNotes = input.DiagnosticNotes
	}
	if nextStatus == "DONE" {
		if input.ResolutionNotes != nil {
			ticket.ITExecution.ResolutionNotes = input.ResolutionNotes
		}
		if input.ActualCost != nil {
			ticket.ITExecution.ActualCost = input.ActualCost
		}
		if input.DowntimeHours != nil {
			ticket.ITExecution.DowntimeHours = input.DowntimeHours
		}
		if input.PartsUsed != nil {
			ticket.ITExecution.PartsUsed = input.PartsUsed
		}
		ticket.ITExecution.CompletedAt = strPtr(time.Now().Format(time.RFC3339))
	}

	stage := "In-Progress"
	if nextStatus == "DONE" {
		stage = "Resolution"
	} else if nextStatus == "ON_HOLD" {
		stage = "On-Hold"
	}
	actorName := "Unassigned Technician"
	if ticket.ITAssignment.TechnicianName != nil {
		actorName = *ticket.ITAssignment.TechnicianName
	}
	actorRole := "Assigned Technician"
	if ticket.ITAssignment.TechnicianRole != nil {
		actorRole = *ticket.ITAssignment.TechnicianRole
	}
	var notes *string
	if nextStatus == "ON_HOLD" {
		holdCategory := ""
		if input.HoldCategory != nil {
			holdCategory = *input.HoldCategory
		}
		holdReason := ""
		if input.HoldReason != nil {
			holdReason = *input.HoldReason
		}
		notes = strPtr(fmt.Sprintf("Hold: %s — %s", holdCategory, holdReason))
	} else if nextStatus == "DONE" {
		notes = input.ResolutionNotes
	} else {
		notes = input.DiagnosticNotes
	}

	ticket.Timeline = append(ticket.Timeline, model.TimelineEvent{
		ID:        timelineID(),
		Stage:     stage,
		ActorName: actorName,
		ActorRole: actorRole,
		Timestamp: time.Now().Format(time.RFC3339),
		Action:    fmt.Sprintf("Status updated to %s", input.Status),
		Notes:     notes,
	})

	if _, err := s.repo.Update(ticket.ID, ticket); err != nil {
		return model.TicketModel{}, err
	}
	return ticket, nil
}

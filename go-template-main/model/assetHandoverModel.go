package model

// AssetHandover domain (RAISE-FR-OPS-002's IT Hardware Assignment Approval Workflow,
// PRD Sec16 Resolved Question 43, narrowing Resolved Question 42). Category-scoped exception:
// assigning an IT Hardware asset creates one of these records instead of immediately flipping
// the asset's status to Assigned. Every other category's Check-out, and all Check-in, are
// completely unaffected -- see service/assetService.go's AssignAsset for the branch point.
//
// Confirmed state model (RAISE-DESIGN.md Sec4.2 "IT Hardware Assignment Approval Workflow" --
// design-level vocabulary, not PRD-defined identifiers):
//
//	PENDING_RECIPIENT_CONFIRMATION -> PENDING_IT_PROCESSING -> PENDING_IT_SUPERVISOR_APPROVAL -> ASSIGNED
//	                                                                                           -> REJECTED (terminal, from stage 3 or 4 only)
//
// No recipient-decline path at Stage 2 is defined -- not invented here. No e-signature/
// acknowledgment-text capture is defined -- not invented here (see PRD's own
// ## NEEDS_PRD_CONFIRMATION note). Custody History write-timing across the 4 stages is a
// separate, still-open design question (RAISE-DESIGN.md Sec4.2) -- this model does not decide it.
//
// Storage: one JSONB document per record, same reasoning and convention as
// model/ticketModel.go (a handful of columns denormalized purely for List() filters).
type AssetHandoverModel struct {
	ID              string          `json:"id"`
	HandoverCode    string          `json:"handoverCode"`
	Status          string          `json:"status"`
	CreatedAt       string          `json:"createdAt"`
	Asset           HandoverAsset   `json:"asset"`
	Recipient       HandoverPerson  `json:"recipient"`
	InitiatedBy     HandoverPerson  `json:"initiatedBy"`
	InitiatedAt     string          `json:"initiatedAt"`
	ConfirmedAt     *string         `json:"confirmedAt,omitempty"`
	ProcessedBy     *HandoverPerson `json:"processedBy,omitempty"`
	ProcessedAt     *string         `json:"processedAt,omitempty"`
	ApprovedBy      *HandoverPerson `json:"approvedBy,omitempty"`
	ApprovedAt      *string         `json:"approvedAt,omitempty"`
	RejectedBy      *HandoverPerson `json:"rejectedBy,omitempty"`
	RejectedAt      *string         `json:"rejectedAt,omitempty"`
	RejectionStage  *string         `json:"rejectionStage,omitempty"`
	RejectionReason *string         `json:"rejectionReason,omitempty"`
	Timeline        []TimelineEvent `json:"timeline"`
}

// HandoverAsset is a point-in-time snapshot of the referenced Asset, not a live join -- same
// TicketAsset-snapshot convention as model/ticketModel.go.
type HandoverAsset struct {
	ID       string `json:"id"`
	Code     string `json:"code"`
	Name     string `json:"name"`
	Category string `json:"category"`
	Type     string `json:"type"`
}

// HandoverPerson is a point-in-time snapshot of an actor (recipient, initiator, IT staff,
// IT supervisor) at the moment they acted -- same reasoning as TicketRequester.
type HandoverPerson struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Role string `json:"role,omitempty"`
}

// AssetHandoverListQuery mirrors the frontend's equivalent list-query shape.
type AssetHandoverListQuery struct {
	Search              string `query:"search"`
	Status              string `query:"status"`
	RecipientEmployeeID string `query:"recipientEmployeeId"`
}

type AssetHandoverListResponse struct {
	Data  []AssetHandoverModel `json:"data"`
	Total int                  `json:"total"`
}

// InitiateHandoverRequest is issued by an IT/Admin user via Stage 1 -- same trigger as the
// general Assign action (POST /assets/:id/assign), branched server-side by Asset.Category.
type InitiateHandoverRequest struct {
	EmployeeID   string `json:"employeeId"`
	EmployeeName string `json:"employeeName"`
}

// ConfirmReceiptRequest is issued by the recipient employee at Stage 2.
type ConfirmReceiptRequest struct {
	RecipientID   string `json:"recipientId"`
	RecipientName string `json:"recipientName"`
}

// ProcessHandoverRequest is issued by an IT_STAFF user at Stage 3.
type ProcessHandoverRequest struct {
	ActorID   string `json:"actorId"`
	ActorName string `json:"actorName"`
}

// ApprovalDecisionRequest is issued by an IT_MANAGER user at Stage 4 -- approve or reject.
// Rejection is also accepted here for Stage 3 (an IT_STAFF user rejecting during processing),
// per PRD Sec16 Resolved Question 43's confirmed rule that rejection is possible at either
// Stage 3 or Stage 4.
type HandoverDecisionRequest struct {
	Decision  string  `json:"decision"` // "APPROVE" or "REJECT"
	ActorID   string  `json:"actorId"`
	ActorName string  `json:"actorName"`
	Reason    *string `json:"reason,omitempty"`
}

// PostgreSQL SQL -- the only engine this domain targets. The `doc` column holds the full
// AssetHandoverModel JSON; the other columns are denormalized purely for List()'s filters.
var SQL_asset_handover_pg_get = `SELECT doc FROM asset_handovers WHERE id = $1 OR handover_code = $1`

var SQL_asset_handover_pg_insert = `INSERT INTO asset_handovers (id, handover_code, asset_id, asset_code, asset_name, recipient_employee_id, recipient_name, status, doc)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

var SQL_asset_handover_pg_update = `UPDATE asset_handovers SET status = $1, doc = $2 WHERE id = $3`

var SQL_asset_handover_pg_count_base = `SELECT COUNT(*) FROM asset_handovers WHERE
	($1 = '' OR handover_code ILIKE '%' || $1 || '%' OR asset_name ILIKE '%' || $1 || '%' OR asset_code ILIKE '%' || $1 || '%' OR recipient_name ILIKE '%' || $1 || '%')
	AND ($2 = '' OR status = $2)
	AND ($3 = '' OR recipient_employee_id = $3)`

var SQL_asset_handover_pg_list_base = `SELECT doc FROM asset_handovers WHERE
	($1 = '' OR handover_code ILIKE '%' || $1 || '%' OR asset_name ILIKE '%' || $1 || '%' OR asset_code ILIKE '%' || $1 || '%' OR recipient_name ILIKE '%' || $1 || '%')
	AND ($2 = '' OR status = $2)
	AND ($3 = '' OR recipient_employee_id = $3)
	ORDER BY handover_code DESC`

// SQL_asset_handover_pg_active_for_asset guards against creating a second concurrent handover
// for the same asset while one is already pending -- an implementation-level safeguard (not an
// invented business rule), same spirit as an asset having exactly one open Maintenance ticket
// path at a time.
var SQL_asset_handover_pg_active_for_asset = `SELECT COUNT(*) FROM asset_handovers WHERE asset_id = $1 AND status NOT IN ('ASSIGNED', 'REJECTED')`

// SQL_asset_handover_pg_count_by_code_prefix backs the HandoverCode sequence number -- scoped to
// the current year's code prefix (e.g. "AHO-2026-") via a cheap COUNT-only query, instead of
// fetching and JSON-unmarshalling every historical row via List() just to discard them.
var SQL_asset_handover_pg_count_by_code_prefix = `SELECT COUNT(*) FROM asset_handovers WHERE handover_code LIKE $1`

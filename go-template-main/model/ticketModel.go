package model

// Ticket domain (RAISE-FR-MAINT-001, "IT Requisition & Maintenance"). Mirrors the frontend's
// Ticket type (frontend/src/types/ticket.ts, re-exporting ITRequisitionTicket from
// frontend/src/data/fixtures/requisitionData.ts) field-for-field, same JSON-tag-parity
// convention as Asset/Employee. The confirmed business rule (PRD Sec16 Resolved Question 33)
// is the 4-stage workflow shape and this exact state model:
//
//	PENDING_DEPT_APPROVAL -> PENDING_IT_DISPATCH -> PLANNING/IN_PROGRESS/ON_HOLD -> DONE
//
// SLA-per-stage, vendor model, cost model, and delegated-approver configuration rules remain
// TBD -- fields for them exist (matching the frontend shape exactly) but no validation/
// business logic is invented around them here; they're passed through as opaque data, same as
// the frontend's MockTicketRepository does.
//
// Storage: the whole ticket is stored as one JSONB document (see Doc()/scan in
// repository/ticketPGRepository.go) rather than ~25 flat columns, since this is a
// display-snapshot-shaped entity (requester/asset are point-in-time copies, not live joins --
// same reasoning the frontend's own code comments give for why Ticket embeds full Asset/
// Employee snapshots instead of just IDs). A handful of columns are denormalized alongside the
// document purely to support List()'s filters/search without parsing JSON in SQL.
type TicketModel struct {
	ID                 string             `json:"id"`
	TicketCode         string             `json:"ticketCode"`
	Title              string             `json:"title"`
	Category           string             `json:"category"`
	Priority           string             `json:"priority"`
	SLATargetHours     int                `json:"slaTargetHours"`
	Description        string             `json:"description"`
	Location           string             `json:"location"`
	CreatedAt          string             `json:"createdAt"`
	Status             string             `json:"status"`
	Requester          TicketRequester    `json:"requester"`
	Asset              TicketAsset        `json:"asset"`
	DepartmentApproval DepartmentApproval `json:"departmentApproval"`
	ITAssignment       ITAssignment       `json:"itAssignment"`
	ITExecution        ITExecution        `json:"itExecution"`
	Timeline           []TimelineEvent    `json:"timeline"`
}

type TicketRequester struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	JobTitle    string `json:"jobTitle"`
	Department  string `json:"department"`
	Initials    string `json:"initials"`
	AvatarColor string `json:"avatarColor"`
}

// TicketAsset is a point-in-time snapshot of the referenced Asset, not a live join -- matching
// frontend/src/services/ticket-service.ts's createTicket, which copies these fields off the
// Asset domain's record at creation time.
type TicketAsset struct {
	ID                string  `json:"id"`
	Code              string  `json:"code"`
	Name              string  `json:"name"`
	Type              string  `json:"type"`
	SerialNumber      string  `json:"serialNumber"`
	Location          string  `json:"location"`
	IsMyAssignedAsset bool    `json:"isMyAssignedAsset"`
	PurchaseCost      float64 `json:"purchaseCost"`
	CurrentValue      float64 `json:"currentValue"`
}

type DepartmentApproval struct {
	Status        string  `json:"status"`
	ApproverName  string  `json:"approverName"`
	ApproverTitle string  `json:"approverTitle"`
	IsDelegated   bool    `json:"isDelegated"`
	DelegatedBy   *string `json:"delegatedBy,omitempty"`
	ApprovedAt    *string `json:"approvedAt,omitempty"`
	Comments      *string `json:"comments,omitempty"`
}

type ITAssignment struct {
	AssignedBy           *string  `json:"assignedBy,omitempty"`
	AssignedAt           *string  `json:"assignedAt,omitempty"`
	TechnicianID         *string  `json:"technicianId,omitempty"`
	TechnicianName       *string  `json:"technicianName,omitempty"`
	TechnicianRole       *string  `json:"technicianRole,omitempty"`
	TechnicianAvatar     *string  `json:"technicianAvatar,omitempty"`
	EstimatedCost        *float64 `json:"estimatedCost,omitempty"`
	TargetResolutionDate *string  `json:"targetResolutionDate,omitempty"`
}

type ITExecution struct {
	CurrentStatus          string   `json:"currentStatus"`
	HoldReason             *string  `json:"holdReason,omitempty"`
	HoldCategory           *string  `json:"holdCategory,omitempty"`
	DiagnosticNotes        *string  `json:"diagnosticNotes,omitempty"`
	ResolutionNotes        *string  `json:"resolutionNotes,omitempty"`
	PartsUsed              []string `json:"partsUsed,omitempty"`
	ActualCost             *float64 `json:"actualCost,omitempty"`
	DowntimeHours          *float64 `json:"downtimeHours,omitempty"`
	CompletedAt            *string  `json:"completedAt,omitempty"`
	UserSatisfactionRating *int     `json:"userSatisfactionRating,omitempty"`
}

type TimelineEvent struct {
	ID        string  `json:"id"`
	Stage     string  `json:"stage"`
	ActorName string  `json:"actorName"`
	ActorRole string  `json:"actorRole"`
	Timestamp string  `json:"timestamp"`
	Action    string  `json:"action"`
	Notes     *string `json:"notes,omitempty"`
	Badge     *string `json:"badge,omitempty"`
}

// ITTechnician mirrors the frontend's ITTechnician type. Read-only/seeded for now (see
// sql/pg/V3__Tickets_Table.sql) -- MockTicketRepository.listTechnicians is read-only too, no
// create/update path exists on the frontend for technicians yet.
type ITTechnician struct {
	ID                 string `json:"id"`
	Name               string `json:"name"`
	Role               string `json:"role"`
	Specialty          string `json:"specialty"`
	AvatarColor        string `json:"avatarColor"`
	Initials           string `json:"initials"`
	ActiveTicketsCount int    `json:"activeTicketsCount"`
	CompletedThisMonth int    `json:"completedThisMonth"`
}

// TicketListQuery mirrors the frontend's TicketListQuery.
type TicketListQuery struct {
	Search        string `query:"search"`
	Status        string `query:"status"`
	Priority      string `query:"priority"`
	Category      string `query:"category"`
	Department    string `query:"department"`
	RequesterName string `query:"requesterName"`
}

type TicketListResponse struct {
	Data  []TicketModel `json:"data"`
	Total int           `json:"total"`
}

// CreateTicketRequest mirrors the frontend's CreateTicketInput -- requesterId/assetId are
// resolved server-side against the Employee/Asset domains, same one-way dependency the
// frontend's ticketService.createTicket has.
type CreateTicketRequest struct {
	RequesterID string `json:"requesterId"`
	AssetID     string `json:"assetId"`
	Category    string `json:"category"`
	Priority    string `json:"priority"`
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
	Location    string `json:"location,omitempty"`
}

// ApprovalDecisionRequest mirrors the frontend's ApprovalDecisionInput.
type ApprovalDecisionRequest struct {
	Decision     string  `json:"decision"`
	ApproverName *string `json:"approverName,omitempty"`
	IsDelegated  *bool   `json:"isDelegated,omitempty"`
	DelegatedBy  *string `json:"delegatedBy,omitempty"`
	Comments     *string `json:"comments,omitempty"`
}

// DispatchRequest mirrors the frontend's DispatchInput.
type DispatchRequest struct {
	TechnicianID         string   `json:"technicianId"`
	EstimatedCost        *float64 `json:"estimatedCost,omitempty"`
	TargetResolutionDate *string  `json:"targetResolutionDate,omitempty"`
	Notes                *string  `json:"notes,omitempty"`
}

// StatusUpdateRequest mirrors the frontend's StatusUpdateInput.
type StatusUpdateRequest struct {
	Status          string   `json:"status"`
	HoldCategory    *string  `json:"holdCategory,omitempty"`
	HoldReason      *string  `json:"holdReason,omitempty"`
	DiagnosticNotes *string  `json:"diagnosticNotes,omitempty"`
	ResolutionNotes *string  `json:"resolutionNotes,omitempty"`
	ActualCost      *float64 `json:"actualCost,omitempty"`
	DowntimeHours   *float64 `json:"downtimeHours,omitempty"`
	PartsUsed       []string `json:"partsUsed,omitempty"`
}

// PostgreSQL SQL -- the only engine this domain targets. The `doc` column holds the full
// TicketModel JSON; the other columns are denormalized purely for List()'s WHERE clauses.
var SQL_ticket_pg_get = `SELECT doc FROM tickets WHERE id = $1 OR ticket_code = $1`

var SQL_ticket_pg_insert = `INSERT INTO tickets (id, ticket_code, title, status, category, priority, department, requester_name, technician_name, asset_name, asset_code, doc)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`

var SQL_ticket_pg_update = `UPDATE tickets SET status = $1, department = $2, requester_name = $3, technician_name = $4, asset_name = $5, asset_code = $6, doc = $7 WHERE id = $8`

var SQL_ticket_pg_count_base = `SELECT COUNT(*) FROM tickets WHERE
	($1 = '' OR ($1 = 'ACTIVE' AND status IN ('PLANNING','IN_PROGRESS','ON_HOLD')) OR ($1 != 'ACTIVE' AND status = $1))
	AND ($2 = '' OR priority = $2)
	AND ($3 = '' OR category = $3)
	AND ($4 = '' OR department = $4)
	AND ($5 = '' OR requester_name = $5)
	AND ($6 = '' OR title ILIKE '%' || $6 || '%' OR ticket_code ILIKE '%' || $6 || '%' OR asset_name ILIKE '%' || $6 || '%' OR asset_code ILIKE '%' || $6 || '%' OR requester_name ILIKE '%' || $6 || '%' OR technician_name ILIKE '%' || $6 || '%')`

var SQL_ticket_pg_list_base = `SELECT doc FROM tickets WHERE
	($1 = '' OR ($1 = 'ACTIVE' AND status IN ('PLANNING','IN_PROGRESS','ON_HOLD')) OR ($1 != 'ACTIVE' AND status = $1))
	AND ($2 = '' OR priority = $2)
	AND ($3 = '' OR category = $3)
	AND ($4 = '' OR department = $4)
	AND ($5 = '' OR requester_name = $5)
	AND ($6 = '' OR title ILIKE '%' || $6 || '%' OR ticket_code ILIKE '%' || $6 || '%' OR asset_name ILIKE '%' || $6 || '%' OR asset_code ILIKE '%' || $6 || '%' OR requester_name ILIKE '%' || $6 || '%' OR technician_name ILIKE '%' || $6 || '%')
	ORDER BY ticket_code DESC`

var SQL_technician_pg_list = `SELECT id, name, role, specialty, avatar_color, initials, active_tickets_count, completed_this_month FROM technicians ORDER BY id`

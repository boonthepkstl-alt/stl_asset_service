package model

// AuditLogModel is RAISE-FR-AUDIT-001's Immutable Audit Log entry -- a first cut scoped to
// exactly the fields AC-AUDIT-001-01 and Design §15 confirm as required: Actor, Timestamp
// (CreatedAt), Action, Entity (EntityType + EntityID). Design §15 also lists Before/After,
// Source, and Result as "design candidates, not finalized PRD requirements" -- those are
// deliberately NOT modeled here; adding them later is additive, not a breaking change, since
// no code currently assumes their absence means something.
type AuditLogModel struct {
	ID         string `json:"id"`
	Actor      string `json:"actor"`
	Action     string `json:"action"`
	EntityType string `json:"entityType"`
	EntityID   string `json:"entityId"`
	CreatedAt  string `json:"createdAt"`
}

// AuditListQuery mirrors the frontend's AuditListQuery (frontend/src/types/audit.ts).
// EntityType/EntityID together scope the log to one entity's history (e.g. one asset's audit
// trail on Asset Detail); both empty means "all entries" (a future full Audit Log page, not yet
// built on the frontend -- AC-AUDIT-001-03 only requires that entries are viewable, not that a
// dedicated standalone page exists).
type AuditListQuery struct {
	EntityType string `query:"entityType"`
	EntityID   string `query:"entityId"`
	Page       int    `query:"page"`
	Limit      int    `query:"limit"`
}

// AuditListResponse mirrors AssetListResponse's {data, total} shape for consistency across
// domains in this codebase.
type AuditListResponse struct {
	Data  []AuditLogModel `json:"data"`
	Total int             `json:"total"`
}

// PostgreSQL SQL -- the only engine this domain targets (same convention as Asset/Employee/
// Ticket). Deliberately NO update/delete statement exists anywhere for this table -- that
// omission is how AC-AUDIT-001-02 (entries cannot be modified/deleted through normal
// application operation) is enforced at the code level; see sql/pg/V4__Audit_Table.sql for the
// matching note on database-level enforcement being a further hardening step, not done here.
var SQL_audit_pg_insert = `INSERT INTO audit_logs (id, actor, action, entity_type, entity_id, created_at, doc)
	VALUES ($1, $2, $3, $4, $5, $6, $7)`

var SQL_audit_pg_count_base = `SELECT COUNT(*) FROM audit_logs WHERE ($1 = '' OR entity_type = $1) AND ($2 = '' OR entity_id = $2)`

var SQL_audit_pg_list_base = `SELECT id, actor, action, entity_type, entity_id, created_at FROM audit_logs WHERE ($1 = '' OR entity_type = $1) AND ($2 = '' OR entity_id = $2) ORDER BY created_at DESC LIMIT $3 OFFSET $4`

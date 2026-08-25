// Domain types for RAISE-FR-AUDIT-001 (Immutable Audit Log) -- first cut. Field set mirrors
// go-template-main/model/auditModel.go exactly (Actor/Action/EntityType/EntityID/CreatedAt),
// the only fields RAISE-DESIGN.md §15 and AC-AUDIT-001-01 confirm as required. Before/After,
// Source, and Result are explicitly "design candidates, not finalized PRD requirements" and are
// deliberately not modeled here.

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

export interface AuditListQuery {
  entityType?: string;
  entityId?: string;
  page?: number;
  limit?: number;
}

export interface AuditListResult {
  data: AuditLogEntry[];
  total: number;
}

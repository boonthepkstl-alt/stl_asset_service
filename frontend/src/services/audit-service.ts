import { AUDIT_API_ENABLED } from '@/config/featureFlags';
import { HttpAuditRepository, MockAuditRepository, type AuditRepository } from '@/services/audit-repository';
import type { AuditListQuery, AuditListResult } from '@/types/audit';

const repository: AuditRepository = AUDIT_API_ENABLED ? new HttpAuditRepository() : new MockAuditRepository();

/**
 * The stable frontend contract for the Audit Log (RAISE-FR-AUDIT-001). Every page that shows
 * audit entries -- currently just Asset Detail's "Audit" tab -- calls this, never the
 * repository directly, so which repository implementation is active (Mock vs Http) is
 * invisible to callers. Read-only by design: there is no `record`/`create` method here (see
 * audit-repository.ts's comment on AC-AUDIT-001-02).
 */
export const auditService = {
  listAuditLogs: (query: AuditListQuery = {}): Promise<AuditListResult> => repository.list(query),
};

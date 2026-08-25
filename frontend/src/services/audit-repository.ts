import apiClient from '@/services/api-client';
import { STORAGE_KEYS } from '@/config/constants';
import type { AuditLogEntry, AuditListQuery, AuditListResult } from '@/types/audit';

/**
 * Contract the AuditService depends on. HttpAuditRepository is the real implementation,
 * backed by go-template-main's Audit Log domain (go-template-main/controller/
 * auditController.go, RAISE-FR-AUDIT-001) -- gated off by default behind AUDIT_API_ENABLED
 * (config/featureFlags.ts). MockAuditRepository is the fallback used whenever that flag is
 * off, same convention as Asset/Employee/Ticket. Deliberately read-only: there is no
 * create/update/delete method here (AC-AUDIT-001-02) -- recording happens through
 * `recordMockAuditEntry` below (mock) or automatically server-side as a side effect of other
 * domains' mutations (real backend), never through a method a page could call directly.
 */
export interface AuditRepository {
  list(query: AuditListQuery): Promise<AuditListResult>;
}

// Shared in-memory store so every MockAuditRepository instance (and every other domain's
// Mock*Repository, via recordMockAuditEntry below) reads/writes the same data -- mirrors how a
// real Postgres table is one shared store regardless of which service instance queries it.
// Module-level (not inside the class) so it survives across the separate MockAssetRepository/
// MockTicketRepository instances that write into it.
const mockAuditStore: AuditLogEntry[] = [];

// Reads the same localStorage key AuthContext.tsx writes on login (STORAGE_KEYS.USER) --
// MockAssetRepository/MockTicketRepository are plain classes outside React and can't call
// useAuth(), so this reuses the existing persisted-session convention instead of threading an
// `actor` parameter through every mutating method's public signature (which would ripple into
// every existing call site and test). Falls back to "unknown" if no session is stored (e.g. in
// a unit test that doesn't go through AuthContext).
function currentActorName(): string {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return 'unknown';
    const user = JSON.parse(raw) as { fullName?: string; username?: string };
    return user.fullName || user.username || 'unknown';
  } catch {
    return 'unknown';
  }
}

// Used by MockAssetRepository/MockTicketRepository (RAISE-FR-AUDIT-001 first cut covers Asset
// mutations; Ticket hook-in is documented remaining work, not yet wired) to append an entry to
// the same store MockAuditRepository.list() reads from.
export function recordMockAuditEntry(action: string, entityType: string, entityId: string): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `audit-${mockAuditStore.length + 1}-${Date.now()}`,
    actor: currentActorName(),
    action,
    entityType,
    entityId,
    createdAt: new Date().toISOString(),
  };
  mockAuditStore.unshift(entry);
  return entry;
}

export class MockAuditRepository implements AuditRepository {
  async list(query: AuditListQuery): Promise<AuditListResult> {
    const filtered = mockAuditStore.filter((e) => {
      const matchesType = !query.entityType || e.entityType === query.entityType;
      const matchesId = !query.entityId || e.entityId === query.entityId;
      return matchesType && matchesId;
    });
    return { data: filtered, total: filtered.length };
  }
}

/**
 * Backed by go-template-main's real Audit Log endpoint (GET /audit-logs). Response field names
 * match the Go backend's AuditLogModel JSON tags exactly, same convention as the other domains.
 */
export class HttpAuditRepository implements AuditRepository {
  async list(query: AuditListQuery): Promise<AuditListResult> {
    const params: Record<string, string | number> = {};
    if (query.entityType) params.entityType = query.entityType;
    if (query.entityId) params.entityId = query.entityId;
    if (query.page) params.page = query.page;
    if (query.limit) params.limit = query.limit;

    const response = await apiClient.get<AuditListResult>('/audit-logs', { params });
    return response.data;
  }
}

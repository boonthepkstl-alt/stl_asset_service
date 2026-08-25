import { useEffect, useState, useCallback } from 'react';
import { auditService } from '@/services/audit-service';
import type { AuditLogEntry, AuditListQuery } from '@/types/audit';

interface UseAuditLogsResult {
  entries: AuditLogEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// RAISE-FR-AUDIT-001 -- scopes to one entity's audit trail (e.g. entityType: 'asset',
// entityId: asset.id on Asset Detail's "Audit" tab). Pass no filter for a full log, though no
// page currently does that (AC-AUDIT-001-03 only requires entries be viewable, not that a
// dedicated all-entities page exists yet).
export function useAuditLogs(query: AuditListQuery): UseAuditLogsResult {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    auditService
      .listAuditLogs(query)
      .then((result) => {
        if (cancelled) return;
        setEntries(result.data);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Unable to load audit logs. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-fetch on entityType/entityId/reloadToken, not on a new query object identity each render
  }, [query.entityType, query.entityId, query.page, query.limit, reloadToken]);

  return { entries, loading, error, refetch };
}

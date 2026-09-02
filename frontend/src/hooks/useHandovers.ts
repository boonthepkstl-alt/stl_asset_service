import { useEffect, useState, useCallback } from 'react';
import { handoverService } from '@/services/handover-service';
import type { AssetHandoverModel, HandoverListQuery } from '@/types/handover';

interface UseHandoversResult {
  handovers: AssetHandoverModel[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHandovers(query: HandoverListQuery): UseHandoversResult {
  const [handovers, setHandovers] = useState<AssetHandoverModel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    handoverService
      .listHandovers(query)
      .then((result) => {
        if (cancelled) return;
        setHandovers(result.data);
        setTotal(result.total);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Unable to load handovers. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run on any query field change or explicit refetch
  }, [query.search, query.status, query.recipientEmployeeId, reloadToken]);

  return { handovers, total, loading, error, refetch };
}

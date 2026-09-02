import { useEffect, useState, useCallback } from 'react';
import { handoverService } from '@/services/handover-service';
import type { AssetHandoverModel } from '@/types/handover';

interface UseHandoverResult {
  handover: AssetHandoverModel | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  refetch: () => void;
}

export function useHandover(handoverCode: string | undefined): UseHandoverResult {
  const [handover, setHandover] = useState<AssetHandoverModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    if (!handoverCode) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    handoverService
      .getHandover(handoverCode)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setNotFound(true);
        } else {
          setHandover(result);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError('Unable to load this handover. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [handoverCode, reloadToken]);

  return { handover, loading, error, notFound, refetch };
}

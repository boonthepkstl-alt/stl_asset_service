import { useEffect, useState, useCallback, useRef } from 'react';
import { aiDecisionService } from '@/services/ai-decision-service';
import type { AIDecisionProfile } from '@/types/ai-decision';

interface UseAIDecisionProfilesResult {
  profiles: AIDecisionProfile[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAIDecisionProfiles(): UseAIDecisionProfilesResult {
  const [profiles, setProfiles] = useState<AIDecisionProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    return aiDecisionService
      .listProfiles()
      .then((result) => {
        if (mountedRef.current) setProfiles(result);
      })
      .catch(() => {
        if (mountedRef.current) setError('Unable to load AI decision profiles. Please try again.');
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { profiles, loading, error, refetch: load };
}

import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { matchService } from '../services/matchService';

export function useStabilityScore() {
  const { stabilitySummary, setStabilitySummary, activeMatch, setLoading, setError } =
    useAppStore();

  const fetchStability = useCallback(async () => {
    if (!activeMatch?.id) return;
    try {
      setLoading(true);
      const summary = await matchService.getStabilitySummary(activeMatch.id);
      setStabilitySummary(summary);
    } catch (err) {
      setError('Failed to load stability data');
    } finally {
      setLoading(false);
    }
  }, [activeMatch?.id, setStabilitySummary, setLoading, setError]);

  return { stabilitySummary, fetchStability };
}

import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { matchService } from '../services/matchService';

export function useActiveMatch() {
  const { activeMatch, setActiveMatch, adopterId, setLoading, setError } = useAppStore();

  const fetchActiveMatch = useCallback(async () => {
    if (!adopterId) return;
    try {
      setLoading(true);
      const match = await matchService.getActiveMatch(adopterId);
      setActiveMatch(match);
    } catch (err) {
      setError('Failed to load match');
    } finally {
      setLoading(false);
    }
  }, [adopterId, setActiveMatch, setLoading, setError]);

  const confirmMatch = useCallback(
    async (petId: string) => {
      if (!adopterId) return null;
      try {
        setLoading(true);
        const match = await matchService.createMatch(adopterId, petId);
        // Re-fetch the full active match
        const active = await matchService.getActiveMatch(adopterId);
        if (active) setActiveMatch(active);
        return match;
      } catch (err) {
        setError('Failed to confirm match');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [adopterId, setActiveMatch, setLoading, setError]
  );

  return {
    activeMatch,
    hasActiveMatch: activeMatch !== null &&
      (activeMatch.status === 'confirmed' || activeMatch.status === 'in_foster'),
    fetchActiveMatch,
    confirmMatch,
  };
}

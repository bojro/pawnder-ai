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

  /**
   * Cancel / end the current active match and clear it from the store.
   */
  const cancelMatch = useCallback(async () => {
    if (!activeMatch) return;
    try {
      setLoading(true);
      await matchService.cancelMatch(activeMatch.id);
      setActiveMatch(null);
    } catch {
      setError('Failed to cancel match');
    } finally {
      setLoading(false);
    }
  }, [activeMatch, setActiveMatch, setLoading, setError]);

  /**
   * Transition the current match from 'confirmed' → 'in_foster' after a
   * successful first visit, then re-fetch the full active match so the
   * foster dashboard renders the complete view.
   */
  const advanceToFoster = useCallback(async () => {
    if (!activeMatch || !adopterId) return;
    try {
      setLoading(true);
      await matchService.updateMatchStatus(activeMatch.id, 'in_foster');
      // Re-fetch so the store has the updated status
      const refreshed = await matchService.getActiveMatch(adopterId);
      setActiveMatch(refreshed);
    } catch {
      setError('Failed to update match status');
    } finally {
      setLoading(false);
    }
  }, [activeMatch, adopterId, setActiveMatch, setLoading, setError]);

  return {
    activeMatch,
    hasActiveMatch:
      activeMatch !== null &&
      (activeMatch.status === 'confirmed' || activeMatch.status === 'in_foster'),
    fetchActiveMatch,
    confirmMatch,
    cancelMatch,
    advanceToFoster,
  };
}

import apiClient from './api';
import { mockActiveMatch, mockPets, mockAdopter } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { Match, ActiveMatch, StabilitySummary } from '../types';

export const matchService = {
  async createMatch(adopterId: string, petId: string): Promise<Match> {
    if (useAppStore.getState().mockMode) {
      const now = new Date();
      return {
        id: `match-${Date.now()}`,
        adopterId,
        petId,
        status: 'confirmed',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        stabilizationEndDate: new Date(
          now.getTime() + 90 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    }
    const response = await apiClient.post<Match>('/matches', { adopterId, petId });
    return response.data;
  },

  async getActiveMatch(adopterId: string): Promise<ActiveMatch | null> {
    if (useAppStore.getState().mockMode) {
      return null; // Return null by default; set mockActiveMatch to test foster flow
    }
    try {
      const response = await apiClient.get<ActiveMatch>(
        `/adopters/${adopterId}/active-match`
      );
      return response.data;
    } catch {
      return null;
    }
  },

  async getStabilitySummary(matchId: string): Promise<StabilitySummary> {
    if (useAppStore.getState().mockMode) {
      return {
        stabilityScore: mockActiveMatch.stabilityScore,
        bondScore: mockActiveMatch.bondScore,
        incidentCount: mockActiveMatch.incidentCount,
        trainingAdherencePercent: mockActiveMatch.trainingAdherencePercent,
        trend: [45, 50, 55, 58, 62, 65, 68, 70, 72],
        daysRemaining: 76,
      };
    }
    const response = await apiClient.get<StabilitySummary>(
      `/matches/${matchId}/stability`
    );
    return response.data;
  },
};

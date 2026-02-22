import apiClient from './api';
import { useAppStore } from '../store/useAppStore';
import { DailyCheckIn, WeeklyCheckIn, DayRating } from '../types';

export const checkinService = {
  async submitDailyCheckIn(
    matchId: string,
    adopterId: string,
    data: { dayRating: DayRating; stressSignals: boolean; notes?: string }
  ): Promise<DailyCheckIn> {
    if (useAppStore.getState().mockMode) {
      return {
        id: `dc-${Date.now()}`,
        matchId,
        adopterId,
        ...data,
        createdAt: new Date().toISOString(),
      };
    }
    const response = await apiClient.post<DailyCheckIn>('/checkins/daily', {
      matchId,
      adopterId,
      ...data,
    });
    return response.data;
  },

  async submitWeeklyCheckIn(
    matchId: string,
    adopterId: string,
    data: {
      incidentCount: number;
      ownerStress: 1 | 2 | 3 | 4 | 5;
      trainingAdherencePercent: number;
      exerciseAdequacy: boolean;
      bond: 1 | 2 | 3 | 4 | 5;
      notes?: string;
    }
  ): Promise<WeeklyCheckIn> {
    if (useAppStore.getState().mockMode) {
      return {
        id: `wc-${Date.now()}`,
        matchId,
        adopterId,
        ...data,
        createdAt: new Date().toISOString(),
      };
    }
    const response = await apiClient.post<WeeklyCheckIn>('/checkins/weekly', {
      matchId,
      adopterId,
      ...data,
    });
    return response.data;
  },
};

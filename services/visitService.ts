import apiClient from './api';
import { mockVisitSlots } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { VisitSlot, Visit } from '../types';

export const visitService = {
  async getAvailableSlots(petId: string): Promise<VisitSlot[]> {
    if (useAppStore.getState().mockMode) {
      return mockVisitSlots.filter((s) => s.available);
    }
    const response = await apiClient.get<VisitSlot[]>(`/pets/${petId}/visit-slots`);
    return response.data;
  },

  async scheduleVisit(matchId: string, slotId: string): Promise<Visit> {
    if (useAppStore.getState().mockMode) {
      const slot = mockVisitSlots.find((s) => s.id === slotId);
      return {
        id: `visit-${Date.now()}`,
        matchId,
        slotId,
        status: 'scheduled',
        scheduledDate: slot?.date || '2026-02-25',
        scheduledTime: slot?.startTime || '10:00',
        createdAt: new Date().toISOString(),
      };
    }
    const response = await apiClient.post<Visit>('/visits', { matchId, slotId });
    return response.data;
  },
};

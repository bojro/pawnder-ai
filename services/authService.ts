import apiClient from './api';
import { mockAdopter } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { Adopter } from '../types';

export const authService = {
  async createAdopter(deviceId: string): Promise<Adopter> {
    if (useAppStore.getState().mockMode) {
      return { ...mockAdopter, deviceId, id: `adopter-${Date.now()}` };
    }
    const response = await apiClient.post<Adopter>('/adopters', { deviceId });
    return response.data;
  },

  async getAdopter(adopterId: string): Promise<Adopter> {
    if (useAppStore.getState().mockMode) {
      return { ...mockAdopter, id: adopterId };
    }
    const response = await apiClient.get<Adopter>(`/adopters/${adopterId}`);
    return response.data;
  },
};

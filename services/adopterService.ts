import apiClient from './api';
import { mockAdopter } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { Adopter } from '../types';

export const adopterService = {
  async updateProfile(adopterId: string, data: Partial<Adopter>): Promise<Adopter> {
    if (useAppStore.getState().mockMode) {
      return { ...mockAdopter, ...data, id: adopterId, onboardingComplete: true };
    }
    const response = await apiClient.patch<Adopter>(`/adopters/${adopterId}`, data);
    return response.data;
  },
};

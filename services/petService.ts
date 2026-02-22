import apiClient from './api';
import { mockPets } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { PetWithCompatibility } from '../types';

export const petService = {
  async getPets(limit: number = 20): Promise<PetWithCompatibility[]> {
    if (useAppStore.getState().mockMode) {
      return mockPets.slice(0, limit);
    }
    const response = await apiClient.get<PetWithCompatibility[]>('/pets', {
      params: { limit },
    });
    return response.data;
  },

  async getPetById(petId: string): Promise<PetWithCompatibility> {
    if (useAppStore.getState().mockMode) {
      const pet = mockPets.find((p) => p.id === petId);
      if (!pet) throw new Error('Pet not found');
      return pet;
    }
    const response = await apiClient.get<PetWithCompatibility>(`/pets/${petId}`);
    return response.data;
  },
};

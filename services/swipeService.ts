import apiClient from './api';
import { useAppStore } from '../store/useAppStore';
import { Swipe, SwipeDirection, SwipeReason } from '../types';

export const swipeService = {
  async recordSwipe(
    adopterId: string,
    petId: string,
    direction: SwipeDirection,
    reason?: SwipeReason
  ): Promise<Swipe> {
    if (useAppStore.getState().mockMode) {
      return {
        id: `swipe-${Date.now()}`,
        adopterId,
        petId,
        direction,
        reason,
        createdAt: new Date().toISOString(),
      };
    }
    const response = await apiClient.post<Swipe>('/swipes', {
      adopterId,
      petId,
      direction,
      reason,
    });
    return response.data;
  },
};

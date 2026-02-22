import apiClient from './api';
import { mockTrainingPlan } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { TrainingPlan } from '../types';

export const trainingService = {
  async getTrainingPlan(matchId: string): Promise<TrainingPlan> {
    if (useAppStore.getState().mockMode) {
      return { ...mockTrainingPlan, matchId };
    }
    const response = await apiClient.get<TrainingPlan>(`/training-plan/${matchId}`);
    return response.data;
  },

  async toggleTaskCompletion(
    taskId: string,
    completed: boolean
  ): Promise<void> {
    if (useAppStore.getState().mockMode) {
      return;
    }
    await apiClient.patch(`/training-tasks/${taskId}`, { completed });
  },
};

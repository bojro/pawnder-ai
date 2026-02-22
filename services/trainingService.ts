import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { mockTrainingPlan } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { TrainingPlan } from '../types';

export const trainingService = {
  async getTrainingPlan(matchId: string): Promise<TrainingPlan> {
    if (useAppStore.getState().mockMode) {
      return { ...mockTrainingPlan, matchId };
    }
    const ref = doc(db, 'trainingPlans', matchId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      // Return an empty plan structure if none exists yet
      return {
        id: matchId,
        matchId,
        adopterId: auth.currentUser?.uid || '',
        weeks: [],
        completionPercent: 0,
        premiumUpsellAvailable: true,
      };
    }
    return { id: matchId, ...snap.data() } as TrainingPlan;
  },

  async saveTrainingPlan(plan: TrainingPlan): Promise<void> {
    const ref = doc(db, 'trainingPlans', plan.matchId);
    // Ensure adopterId is set for Firestore security rules
    const planWithOwner = {
      ...plan,
      adopterId: plan.adopterId || auth.currentUser?.uid || '',
    };
    await setDoc(ref, planWithOwner);
  },

  async toggleTaskCompletion(
    taskId: string,
    completed: boolean,
  ): Promise<void> {
    if (useAppStore.getState().mockMode) {
      return;
    }
    // For simplicity, the client updates its local state and re-saves the full plan.
    // This is a no-op for the individual task endpoint; the full plan is saved via saveTrainingPlan.
  },
};

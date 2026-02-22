import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { mockAdopter } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { Adopter } from '../types';
import { DEFAULT_ONBOARDING_DRAFT } from '../types/adopter';

function newAdopterDoc(uid: string): Adopter {
  const now = new Date().toISOString();
  return {
    id: uid,
    deviceId: uid,
    ...DEFAULT_ONBOARDING_DRAFT,
    housingType: 'apartment',
    environment: 'suburban',
    experienceLevel: 'beginner',
    onboardingComplete: false,
    createdAt: now,
    updatedAt: now,
  };
}

export const authService = {
  /** Create a new adopter doc in Firestore keyed by Firebase Auth uid */
  async createAdopter(uid: string): Promise<Adopter> {
    if (useAppStore.getState().mockMode) {
      return { ...mockAdopter, deviceId: uid, id: `adopter-${Date.now()}` };
    }
    const ref = doc(db, 'adopters', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: uid, ...snap.data() } as Adopter;
    }
    const adopter = newAdopterDoc(uid);
    const { id: _id, ...adopterData } = adopter;
    await setDoc(ref, { ...adopterData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return adopter;
  },

  /** Fetch an existing adopter doc */
  async getAdopter(uid: string): Promise<Adopter> {
    if (useAppStore.getState().mockMode) {
      return { ...mockAdopter, id: uid };
    }
    const ref = doc(db, 'adopters', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Adopter not found');
    return { id: uid, ...snap.data() } as Adopter;
  },
};

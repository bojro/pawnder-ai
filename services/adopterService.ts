import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { mockAdopter } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { Adopter } from '../types';

export const adopterService = {
  async updateProfile(adopterId: string, data: Partial<Adopter>): Promise<Adopter> {
    if (useAppStore.getState().mockMode) {
      return { ...mockAdopter, ...data, id: adopterId, onboardingComplete: true };
    }
    const ref = doc(db, 'adopters', adopterId);
    // Strip id and any undefined values before writing to Firestore
    const { id: _id, ...rest } = data as any;
    const cleanData: Record<string, any> = {};
    for (const [key, val] of Object.entries(rest)) {
      if (val !== undefined) cleanData[key] = val;
    }
    cleanData.updatedAt = serverTimestamp();
    await updateDoc(ref, cleanData);
    // Read back the complete document so the returned Adopter is accurate
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: adopterId, ...snap.data() } as Adopter;
    }
    // Fallback: merge input data with defaults
    const existing = useAppStore.getState().adopter;
    return { ...(existing || {} as Adopter), ...data, id: adopterId } as Adopter;
  },
};

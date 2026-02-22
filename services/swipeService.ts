import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useAppStore } from '../store/useAppStore';
import { Swipe, SwipeDirection, SwipeReason } from '../types';

export const swipeService = {
  async recordSwipe(
    adopterId: string,
    petId: string,
    direction: SwipeDirection,
    reason?: SwipeReason,
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
    const ref = await addDoc(collection(db, 'swipes'), {
      adopterId,
      petId,
      direction,
      reason: reason || null,
      createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      adopterId,
      petId,
      direction,
      reason,
      createdAt: new Date().toISOString(),
    };
  },
};

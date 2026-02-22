export type SwipeDirection = 'left' | 'right';

export type SwipeReason =
  | 'not_compatible'
  | 'too_energetic'
  | 'size_mismatch'
  | 'not_ready'
  | 'other';

export interface Swipe {
  id: string;
  adopterId: string;
  petId: string;
  direction: SwipeDirection;
  reason?: SwipeReason;
  feedback?: string;
  createdAt: string;
}

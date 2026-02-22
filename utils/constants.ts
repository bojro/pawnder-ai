export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const STABILIZATION_DAYS = 90;

export const ONBOARDING_STEPS = [
  'location',
  'housing',
  'lifestyle',
  'experience',
  'preferences',
  'narrative',
] as const;

export const HOUSING_OPTIONS: { label: string; value: string }[] = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Farm / Rural', value: 'farm' },
];

export const EXPERIENCE_OPTIONS: { label: string; value: string }[] = [
  { label: 'First-time owner', value: 'beginner' },
  { label: 'Some experience', value: 'intermediate' },
  { label: 'Experienced owner', value: 'experienced' },
];

export const DAY_RATING_OPTIONS: { label: string; value: string }[] = [
  { label: 'Calm', value: 'calm' },
  { label: 'Normal', value: 'normal' },
  { label: 'Difficult', value: 'difficult' },
];

export const SWIPE_REASON_OPTIONS: { label: string; value: string }[] = [
  { label: 'Not compatible', value: 'not_compatible' },
  { label: 'Too energetic', value: 'too_energetic' },
  { label: 'Size mismatch', value: 'size_mismatch' },
  { label: 'Not ready', value: 'not_ready' },
  { label: 'Other', value: 'other' },
];

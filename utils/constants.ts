export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const STABILIZATION_DAYS = 90;

export const TOTAL_ONBOARDING_STEPS = 9;

export const ONBOARDING_STEPS = [
  'profile',
  'location',
  'housing',
  'lifestyle',
  'experience',
  'allergies',
  'training-willingness',
  'preferences',
  'narrative',
] as const;

export const HOUSING_OPTIONS: { label: string; value: string }[] = [
  { label: 'Unhoused', value: 'unhoused' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Small House (< 1,000 sqft)', value: 'house_small' },
  { label: 'Medium House (1,000–2,000 sqft)', value: 'house_medium' },
  { label: 'Large House (2,000+ sqft)', value: 'house_large' },
];

export const ENVIRONMENT_OPTIONS: { label: string; value: string }[] = [
  { label: 'City', value: 'city' },
  { label: 'Suburban', value: 'suburban' },
  { label: 'Rural', value: 'rural' },
];

export const EXPERIENCE_OPTIONS: { label: string; value: string; subtitle: string }[] = [
  { label: 'First-time owner', value: 'beginner', subtitle: '0 yrs experience' },
  { label: 'Some experience', value: 'intermediate', subtitle: '1–2 yrs experience' },
  { label: 'Experienced owner', value: 'experienced', subtitle: '3+ yrs experience' },
];

export const PET_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Cats', value: 'cats' },
  { label: 'Dogs', value: 'dogs' },
  { label: 'Fish', value: 'fish' },
  { label: 'Rabbits', value: 'rabbits' },
  { label: 'Hamsters / Guinea Pigs / Gerbils / Mice', value: 'small_animals' },
  { label: 'Birds', value: 'birds' },
  { label: 'Reptiles', value: 'reptiles' },
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

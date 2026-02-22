export type HousingType = 'apartment' | 'house' | 'farm';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced';
export type ActivityLevel = 1 | 2 | 3 | 4 | 5;

export interface Adopter {
  id: string;
  deviceId: string;
  zipCode: string;
  searchRadius: number;
  housingType: HousingType;
  hoursAwayPerDay: number;
  activityLevel: ActivityLevel;
  experienceLevel: ExperienceLevel;
  hasKids: boolean;
  hasExistingPets: boolean;
  barkingTolerance: number;
  sheddingTolerance: number;
  trainingCommitment: number;
  specialNeedsWilling: boolean;
  narrative1: string;
  narrative2: string;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingDraft {
  zipCode: string;
  searchRadius: number;
  housingType: HousingType | null;
  hoursAwayPerDay: number;
  activityLevel: ActivityLevel;
  experienceLevel: ExperienceLevel | null;
  hasKids: boolean;
  hasExistingPets: boolean;
  barkingTolerance: number;
  sheddingTolerance: number;
  trainingCommitment: number;
  specialNeedsWilling: boolean;
  narrative1: string;
  narrative2: string;
}

export const DEFAULT_ONBOARDING_DRAFT: OnboardingDraft = {
  zipCode: '',
  searchRadius: 25,
  housingType: null,
  hoursAwayPerDay: 8,
  activityLevel: 3,
  experienceLevel: null,
  hasKids: false,
  hasExistingPets: false,
  barkingTolerance: 3,
  sheddingTolerance: 3,
  trainingCommitment: 3,
  specialNeedsWilling: false,
  narrative1: '',
  narrative2: '',
};

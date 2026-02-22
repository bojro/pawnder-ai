export type HousingType = 'unhoused' | 'apartment' | 'house_small' | 'house_medium' | 'house_large';
export type EnvironmentType = 'city' | 'suburban' | 'rural';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced';
export type PetType = 'cats' | 'dogs' | 'fish' | 'rabbits' | 'small_animals' | 'birds' | 'reptiles';

export interface Adopter {
  id: string;
  deviceId: string;
  // Profile
  name: string;
  age: string;
  phone: string;
  email: string;
  // Location
  zipCode: string;
  searchRadius: number;
  // Housing
  housingType: HousingType;
  environment: EnvironmentType;
  householdSize: number;
  kidsCount: number;
  kidsAges: string;
  // Lifestyle
  hoursAwayPerDay: number;
  activityHoursPerWeek: number;
  // Experience
  experienceLevel: ExperienceLevel;
  existingPetTypes: PetType[];
  // Allergies
  allergies: string;
  // Training willingness
  willingGroupClasses: boolean;
  willingPrivateTrainer: boolean;
  willingDailyExercises: boolean;
  trainingHoursPerWeek: number;
  // Preferences
  barkingTolerance: number;
  sheddingTolerance: number;
  trainingCommitment: number;
  specialNeedsWilling: boolean;
  // Narratives
  narrative1: string;
  narrative2: string;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingDraft {
  // Profile
  name: string;
  age: string;
  phone: string;
  email: string;
  // Location
  zipCode: string;
  searchRadius: number;
  // Housing
  housingType: HousingType | null;
  environment: EnvironmentType | null;
  householdSize: number;
  kidsCount: number;
  kidsAges: string;
  // Lifestyle
  hoursAwayPerDay: number;
  activityHoursPerWeek: number;
  // Experience
  experienceLevel: ExperienceLevel | null;
  existingPetTypes: PetType[];
  // Allergies
  allergies: string;
  // Training willingness
  willingGroupClasses: boolean;
  willingPrivateTrainer: boolean;
  willingDailyExercises: boolean;
  trainingHoursPerWeek: number;
  // Preferences
  barkingTolerance: number;
  sheddingTolerance: number;
  trainingCommitment: number;
  specialNeedsWilling: boolean;
  // Narratives
  narrative1: string;
  narrative2: string;
}

export const DEFAULT_ONBOARDING_DRAFT: OnboardingDraft = {
  // Profile
  name: '',
  age: '',
  phone: '',
  email: '',
  // Location
  zipCode: '',
  searchRadius: 25,
  // Housing
  housingType: null,
  environment: null,
  householdSize: 1,
  kidsCount: 0,
  kidsAges: '',
  // Lifestyle
  hoursAwayPerDay: 8,
  activityHoursPerWeek: 5,
  // Experience
  experienceLevel: null,
  existingPetTypes: [],
  // Allergies
  allergies: '',
  // Training willingness
  willingGroupClasses: false,
  willingPrivateTrainer: false,
  willingDailyExercises: false,
  trainingHoursPerWeek: 0,
  // Preferences
  barkingTolerance: 3,
  sheddingTolerance: 3,
  trainingCommitment: 3,
  specialNeedsWilling: false,
  // Narratives
  narrative1: '',
  narrative2: '',
};

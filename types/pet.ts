export type PetSize = 'small' | 'medium' | 'large';
export type PetAge = 'puppy' | 'young' | 'adult' | 'senior';
export type BehaviorTrait =
  | 'energetic'
  | 'calm'
  | 'social'
  | 'reserved'
  | 'protective'
  | 'playful'
  | 'independent'
  | 'affectionate';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: PetAge;
  size: PetSize;
  description: string;
  imageUrls: string[];
  barkingLevel: number;
  sheddingLevel: number;
  trainingLevel: number;
  energyLevel: number;
  sociability: number;
  spaceRequirement: number;
  specialNeeds: boolean;
  specialNeedsDescription?: string;
  behaviorTraits: BehaviorTrait[];
  promptLabel?: string;
  promptAnswer?: string;
  createdAt: string;
}

export interface PetWithCompatibility extends Pet {
  compatibilityScore: number;
  whyMatch: string[];
  potentialChallenges: string[];
  aiSummary: string;
}

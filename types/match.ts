import { PetWithCompatibility } from './pet';
import { Adopter } from './adopter';

export type MatchStatus = 'pending' | 'confirmed' | 'in_foster' | 'completed' | 'failed';

export interface Match {
  id: string;
  adopterId: string;
  petId: string;
  status: MatchStatus;
  visitId?: string;
  createdAt: string;
  updatedAt: string;
  stabilizationEndDate: string;
}

export interface ActiveMatch extends Match {
  pet: PetWithCompatibility;
  adopter: Adopter;
  daysInFoster: number;
  stabilityScore: number;
  bondScore: number;
  incidentCount: number;
  trainingAdherencePercent: number;
}

export interface StabilitySummary {
  stabilityScore: number;
  bondScore: number;
  incidentCount: number;
  trainingAdherencePercent: number;
  trend: number[];
  daysRemaining: number;
}

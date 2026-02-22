export type DayRating = 'calm' | 'normal' | 'difficult';

export interface DailyCheckIn {
  id: string;
  matchId: string;
  adopterId: string;
  dayRating: DayRating;
  stressSignals: boolean;
  notes?: string;
  createdAt: string;
}

export interface WeeklyCheckIn {
  id: string;
  matchId: string;
  adopterId: string;
  incidentCount: number;
  ownerStress: 1 | 2 | 3 | 4 | 5;
  trainingAdherencePercent: number;
  exerciseAdequacy: boolean;
  bond: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAt: string;
}

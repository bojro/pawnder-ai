export interface TrainingTask {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface TrainingWeek {
  weekNumber: number;
  title: string;
  tasks: TrainingTask[];
}

export interface TrainingPlan {
  id: string;
  matchId: string;
  weeks: TrainingWeek[];
  completionPercent: number;
  premiumUpsellAvailable: boolean;
}

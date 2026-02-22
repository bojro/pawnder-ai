export interface VisitSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Visit {
  id: string;
  matchId: string;
  slotId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  createdAt: string;
}

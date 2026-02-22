/**
 * Training Plan Engine — rule-based 12-week plan generator.
 *
 * Selects week themes and tasks based on:
 * - Pet energy, training level, breed, age, special needs, behavior traits
 * - Adopter experience level
 */

import { Adopter } from '../types/adopter';
import { Pet } from '../types/pet';
import { TrainingPlan, TrainingWeek, TrainingTask } from '../types/training';

// ─── Week theme pool ───

interface WeekTheme {
  title: string;
  condition: (pet: Pet, adopter: Adopter) => boolean;
  priority: number; // lower = selected earlier
  tasks: { title: string; description: string; minutesPerDay: number }[];
}

const WEEK_THEMES: WeekTheme[] = [
  {
    title: 'Foundation & Trust Building',
    condition: () => true, // always first
    priority: 0,
    tasks: [
      { title: 'Establish Safe Space', description: 'Set up a designated area with bed, water, and toys. Let the pet explore at their pace.', minutesPerDay: 15 },
      { title: 'Feeding Routine', description: 'Feed at consistent times. Hand-feed some meals to build trust.', minutesPerDay: 10 },
      { title: 'Calm Bonding', description: 'Sit quietly near your pet for 10 minutes. No pressure to interact.', minutesPerDay: 10 },
    ],
  },
  {
    title: 'Name Recognition & Recall',
    condition: () => true,
    priority: 1,
    tasks: [
      { title: 'Name Game', description: 'Say name → treat. Repeat 10 times per session, 3 sessions/day.', minutesPerDay: 10 },
      { title: 'Indoor Recall', description: 'Call name from short distance. Reward immediately on approach.', minutesPerDay: 10 },
      { title: 'Attention Building', description: 'Reward eye contact when pet looks at you voluntarily.', minutesPerDay: 5 },
    ],
  },
  {
    title: 'Basic Commands',
    condition: (pet) => pet.trainingLevel <= 3,
    priority: 2,
    tasks: [
      { title: 'Sit & Down', description: 'Practice "sit" and "down" with lure-reward method. 10 reps each.', minutesPerDay: 15 },
      { title: 'Stay Introduction', description: 'Ask for sit-stay for 5 seconds, gradually increase.', minutesPerDay: 10 },
      { title: 'Positive Reinforcement Log', description: 'Track 3 good behaviors you caught and rewarded today.', minutesPerDay: 5 },
    ],
  },
  {
    title: 'Leash Fundamentals',
    condition: (pet) => pet.energyLevel >= 2,
    priority: 3,
    tasks: [
      { title: 'Leash Introduction', description: 'Let pet wear leash indoors. Reward calm behavior.', minutesPerDay: 10 },
      { title: 'Short Walks', description: '10-minute walk with frequent stops. Reward loose-leash walking.', minutesPerDay: 15 },
      { title: 'Direction Changes', description: 'Practice turning and stopping. Reward pet for following.', minutesPerDay: 10 },
    ],
  },
  {
    title: 'Socialization',
    condition: (pet) => pet.sociability >= 3,
    priority: 4,
    tasks: [
      { title: 'New Person Introduction', description: 'Introduce pet to one new person using treats and calm energy.', minutesPerDay: 15 },
      { title: 'Sound Desensitization', description: 'Play recorded sounds (doorbell, traffic) at low volume during meals.', minutesPerDay: 10 },
      { title: 'Novel Object Exploration', description: 'Introduce one new object per day. Let pet investigate at own pace.', minutesPerDay: 5 },
    ],
  },
  {
    title: 'Impulse Control',
    condition: (pet) => pet.energyLevel >= 3,
    priority: 5,
    tasks: [
      { title: 'Wait at Doors', description: 'Practice waiting before going through doorways. Release with cue.', minutesPerDay: 10 },
      { title: 'Leave It', description: 'Place treat on floor, cover with hand. Reward looking away.', minutesPerDay: 10 },
      { title: 'Calm Settling', description: 'Reward pet for lying calmly on their bed. Extend duration.', minutesPerDay: 10 },
    ],
  },
  {
    title: 'High-Energy Exercise Plan',
    condition: (pet) => pet.energyLevel >= 4,
    priority: 5,
    tasks: [
      { title: 'Structured Play', description: 'Two 15-minute fetch or tug sessions with start/stop cues.', minutesPerDay: 30 },
      { title: 'Mental Stimulation', description: 'Use puzzle feeders or snuffle mats for one meal.', minutesPerDay: 15 },
      { title: 'Decompression Walk', description: 'Long-line walk in quiet area. Let pet sniff freely.', minutesPerDay: 20 },
    ],
  },
  {
    title: 'Alone-Time Training',
    condition: () => true,
    priority: 6,
    tasks: [
      { title: 'Short Absences', description: 'Leave room for 1 minute. Return calmly. Gradually extend.', minutesPerDay: 10 },
      { title: 'Departure Cues', description: 'Pick up keys, put on shoes — then sit down. Desensitize departure signals.', minutesPerDay: 5 },
      { title: 'Enrichment Before Leaving', description: 'Give a Kong or chew toy 5 minutes before leaving.', minutesPerDay: 5 },
    ],
  },
  {
    title: 'Advanced Obedience',
    condition: (pet, adopter) => adopter.experienceLevel !== 'beginner' && pet.trainingLevel <= 3,
    priority: 7,
    tasks: [
      { title: 'Distance Commands', description: 'Practice sit/down/stay from increasing distances.', minutesPerDay: 15 },
      { title: 'Proofing in Distractions', description: 'Practice commands outdoors with mild distractions.', minutesPerDay: 15 },
      { title: 'Place Command', description: 'Teach "place" — go to a specific mat/bed and stay.', minutesPerDay: 10 },
    ],
  },
  {
    title: 'Behavioral Adjustment',
    condition: (pet) => pet.specialNeeds || pet.energyLevel >= 4,
    priority: 7,
    tasks: [
      { title: 'Trigger Identification', description: 'Note what causes reactivity or stress. Log triggers and intensity.', minutesPerDay: 5 },
      { title: 'Counter-Conditioning', description: 'Pair trigger at low intensity with high-value treats.', minutesPerDay: 15 },
      { title: 'Management Practice', description: 'Practice using management tools (leash, gates) smoothly.', minutesPerDay: 10 },
    ],
  },
  {
    title: 'Routine Solidification',
    condition: () => true,
    priority: 8,
    tasks: [
      { title: 'Full Day Routine', description: 'Follow complete daily schedule: meals, walks, training, rest.', minutesPerDay: 10 },
      { title: 'Consistency Check', description: 'Ensure all household members use same commands and rules.', minutesPerDay: 5 },
      { title: 'Progress Review', description: 'Review training log. Identify what\'s working and what needs more work.', minutesPerDay: 10 },
    ],
  },
  {
    title: 'Stress Management & Calming',
    condition: () => true,
    priority: 9,
    tasks: [
      { title: 'Relaxation Protocol', description: 'Practice Karen Overall\'s relaxation protocol. Reward calm.', minutesPerDay: 15 },
      { title: 'Massage & Touch', description: 'Gentle massage. Note areas pet is comfortable/uncomfortable with.', minutesPerDay: 10 },
      { title: 'Environmental Enrichment', description: 'Rotate toys. Add new sniffing opportunities.', minutesPerDay: 10 },
    ],
  },
  {
    title: 'Real-World Readiness',
    condition: () => true,
    priority: 10,
    tasks: [
      { title: 'Public Space Practice', description: 'Visit a pet-friendly store or cafe. Practice calm behavior.', minutesPerDay: 20 },
      { title: 'Car Ride Training', description: 'Short car rides with rewards at destination.', minutesPerDay: 15 },
      { title: 'Visitor Protocol', description: 'Practice greeting visitors politely. Use place command.', minutesPerDay: 10 },
    ],
  },
  {
    title: 'Graduation & Maintenance',
    condition: () => true,
    priority: 11,
    tasks: [
      { title: 'Skills Assessment', description: 'Test all learned commands in various environments.', minutesPerDay: 15 },
      { title: 'Maintenance Plan', description: 'Create ongoing weekly training schedule for continued practice.', minutesPerDay: 10 },
      { title: 'Celebrate Progress', description: 'Special outing or treat. Document how far you\'ve come together!', minutesPerDay: 5 },
    ],
  },
];

// ─── Public API ───

export function generateTrainingPlan(
  pet: Pet,
  adopter: Adopter,
  matchId: string,
): TrainingPlan {
  // Filter themes that apply to this pet/adopter combo
  const applicable = WEEK_THEMES
    .filter(t => t.condition(pet, adopter))
    .sort((a, b) => a.priority - b.priority);

  // Select 12 weeks (cycle if fewer themes available)
  const weeks: TrainingWeek[] = [];
  const now = Date.now();

  for (let i = 0; i < 12; i++) {
    const theme = applicable[i % applicable.length];
    const weekNumber = i + 1;
    const weekStart = new Date(now + i * 7 * 24 * 60 * 60 * 1000);

    const tasks: TrainingTask[] = theme.tasks.map((t, taskIdx) => ({
      id: `${matchId}-w${weekNumber}-t${taskIdx + 1}`,
      weekNumber,
      title: t.title,
      description: `${t.description} (~${t.minutesPerDay} min/day)`,
      completed: false,
      dueDate: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    weeks.push({
      weekNumber,
      title: theme.title,
      tasks,
    });
  }

  return {
    id: `tp-${matchId}`,
    matchId,
    weeks,
    completionPercent: 0,
    premiumUpsellAvailable: true,
  };
}

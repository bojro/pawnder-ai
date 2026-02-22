/**
 * Matching algorithm — runs client-side.
 *
 * Step 1: Hard-constraint filtering
 * Step 2: Weighted compatibility score (0–100)
 * Step 3: Explainability (top 3 positives, top 2 risks)
 */

import { Adopter } from '../types/adopter';
import { Pet, PetWithCompatibility } from '../types/pet';

// ─── Types ───

interface ScoreComponent {
  category: string;
  label: string;
  points: number;    // actual earned
  maxPoints: number; // maximum possible
  isPositive: boolean;
}

// ─── Step 1: Hard constraint filtering ───

export function filterPets(adopter: Adopter, pets: Pet[]): Pet[] {
  return pets.filter((pet) => {
    // Kids compatibility: high-energy large dogs flagged for homes with small kids
    if (adopter.kidsCount > 0) {
      const youngestKid = parseKidsAge(adopter.kidsAges);
      // If youngest kid is under 5 and the pet is large + high energy → skip
      if (youngestKid < 5 && pet.size === 'large' && pet.energyLevel >= 4) {
        return false;
      }
    }

    // Apartment suitability: large high-space-requirement pets need a house
    if (adopter.housingType === 'apartment' || adopter.housingType === 'unhoused') {
      if (pet.spaceRequirement >= 4) return false;
    }

    // Existing pets compatibility (soft check — keep unless obviously conflicting)
    // For now, no hard filter on existing pets; handled in scoring

    return true;
  });
}

// ─── Step 2: Weighted score ───

const WEIGHTS = {
  lifestyle: 30,
  environment: 25,
  experience: 15,
  behavioral: 20,
  specialNeeds: 10,
};

export function scorePet(adopter: Adopter, pet: Pet): { score: number; components: ScoreComponent[] } {
  const components: ScoreComponent[] = [];

  // --- Lifestyle fit (30pts) ---
  // Compare adopter activity hours vs pet energy level
  const activityMatch = 1 - Math.abs(normalizeActivity(adopter.activityHoursPerWeek) - pet.energyLevel / 5);
  // Hours away vs alone-time tolerance (inferred from pet traits)
  const awayPenalty = adopter.hoursAwayPerDay > 8 && pet.energyLevel >= 4 ? 0.3 : 0;
  const lifestyleRaw = Math.max(0, activityMatch - awayPenalty);
  const lifestylePts = Math.round(lifestyleRaw * WEIGHTS.lifestyle);
  components.push({
    category: 'lifestyle',
    label: activityMatch > 0.6
      ? 'Your activity level is a great match'
      : 'Your activity level may not fully meet this pet\'s needs',
    points: lifestylePts,
    maxPoints: WEIGHTS.lifestyle,
    isPositive: lifestylePts >= WEIGHTS.lifestyle * 0.6,
  });

  // --- Environment fit (25pts) ---
  const spaceScore = getSpaceScore(adopter, pet);
  const noiseScore = adopter.barkingTolerance >= pet.barkingLevel ? 1 : Math.max(0, 1 - (pet.barkingLevel - adopter.barkingTolerance) * 0.25);
  const envRaw = (spaceScore * 0.6 + noiseScore * 0.4);
  const envPts = Math.round(envRaw * WEIGHTS.environment);
  components.push({
    category: 'environment',
    label: spaceScore > 0.7
      ? 'Your home provides good space for this pet'
      : 'This pet may need more space than your home offers',
    points: envPts,
    maxPoints: WEIGHTS.environment,
    isPositive: envPts >= WEIGHTS.environment * 0.6,
  });

  // --- Experience fit (15pts) ---
  const expScore = getExperienceScore(adopter, pet);
  const expPts = Math.round(expScore * WEIGHTS.experience);
  components.push({
    category: 'experience',
    label: expScore > 0.7
      ? 'Your experience level matches this pet\'s needs'
      : 'This pet may need a more experienced owner',
    points: expPts,
    maxPoints: WEIGHTS.experience,
    isPositive: expPts >= WEIGHTS.experience * 0.6,
  });

  // --- Behavioral alignment (20pts) ---
  const sheddingDelta = Math.abs(adopter.sheddingTolerance - pet.sheddingLevel);
  const barkingDelta = Math.abs(adopter.barkingTolerance - pet.barkingLevel);
  const behavRaw = Math.max(0, 1 - (sheddingDelta + barkingDelta) / 10);
  const behavPts = Math.round(behavRaw * WEIGHTS.behavioral);
  const sheddingOk = adopter.sheddingTolerance >= pet.sheddingLevel;
  const barkingOk = adopter.barkingTolerance >= pet.barkingLevel;
  components.push({
    category: 'behavioral',
    label: sheddingOk && barkingOk
      ? 'Shedding and noise levels fit your tolerance'
      : !sheddingOk
        ? 'This pet sheds more than your stated preference'
        : 'This pet may be noisier than your stated preference',
    points: behavPts,
    maxPoints: WEIGHTS.behavioral,
    isPositive: behavPts >= WEIGHTS.behavioral * 0.6,
  });

  // --- Special needs (10pts) ---
  let specialPts: number;
  if (!pet.specialNeeds) {
    specialPts = WEIGHTS.specialNeeds; // full marks if no special needs
  } else {
    specialPts = adopter.specialNeedsWilling ? WEIGHTS.specialNeeds : Math.round(WEIGHTS.specialNeeds * 0.3);
  }
  components.push({
    category: 'specialNeeds',
    label: pet.specialNeeds
      ? (adopter.specialNeedsWilling
        ? 'You\'re open to special needs — great match'
        : 'This pet has special needs to consider')
      : 'No special care requirements',
    points: specialPts,
    maxPoints: WEIGHTS.specialNeeds,
    isPositive: specialPts >= WEIGHTS.specialNeeds * 0.6,
  });

  const score = components.reduce((sum, c) => sum + c.points, 0);
  return { score: Math.min(100, Math.max(0, score)), components };
}

// ─── Step 3: Explainability ───

export function explainMatch(
  components: ScoreComponent[],
): { whyMatch: string[]; potentialChallenges: string[] } {
  const sorted = [...components].sort((a, b) => b.points - a.points);
  const whyMatch = sorted
    .filter(c => c.isPositive)
    .slice(0, 3)
    .map(c => c.label);

  const risks = sorted
    .filter(c => !c.isPositive)
    .slice(0, 2)
    .map(c => c.label);

  return { whyMatch, potentialChallenges: risks };
}

// ─── Public: full pipeline ───

export function matchAndScorePets(adopter: Adopter, rawPets: Pet[]): PetWithCompatibility[] {
  const filtered = filterPets(adopter, rawPets);

  const scored = filtered.map((pet) => {
    const { score, components } = scorePet(adopter, pet);
    const { whyMatch, potentialChallenges } = explainMatch(components);
    return {
      ...pet,
      compatibilityScore: score,
      whyMatch,
      potentialChallenges,
      aiSummary: generateSummary(pet, score),
    } as PetWithCompatibility;
  });

  // Sort by score descending
  scored.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  return scored;
}

// ─── Helpers ───

function parseKidsAge(kidsAges: string): number {
  if (!kidsAges.trim()) return 99;
  const nums = kidsAges.match(/\d+/g);
  if (!nums) return 99;
  return Math.min(...nums.map(Number));
}

/** Normalize adopter activity hours (0–20+ hrs/week) to 0–1 scale */
function normalizeActivity(hoursPerWeek: number): number {
  return Math.min(1, hoursPerWeek / 15);
}

function getSpaceScore(adopter: Adopter, pet: Pet): number {
  const housingRank: Record<string, number> = {
    unhoused: 0,
    apartment: 1,
    house_small: 2,
    house_medium: 3,
    house_large: 4,
  };
  const housingVal = housingRank[adopter.housingType] ?? 1;
  const needed = pet.spaceRequirement; // 1–5
  if (housingVal >= needed) return 1;
  return Math.max(0, 1 - (needed - housingVal) * 0.25);
}

function getExperienceScore(adopter: Adopter, pet: Pet): number {
  const expRank: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    experienced: 3,
  };
  const adopterExp = expRank[adopter.experienceLevel] ?? 1;
  // trainingLevel 1 = untrained (needs experienced), 5 = fully trained (easy)
  const petDifficulty = 6 - pet.trainingLevel; // invert: 1=easy, 5=hard
  const diff = petDifficulty - adopterExp;
  if (diff <= 0) return 1;
  return Math.max(0, 1 - diff * 0.3);
}

function generateSummary(pet: Pet, score: number): string {
  const quality = score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'fair';
  return `${pet.name} is a ${quality} match. A ${pet.age} ${pet.breed} with ${pet.energyLevel >= 4 ? 'high' : pet.energyLevel >= 2 ? 'moderate' : 'low'} energy.`;
}

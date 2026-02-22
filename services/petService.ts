import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { mockPets } from './mockData';
import { useAppStore } from '../store/useAppStore';
import { PetWithCompatibility, BehaviorTrait } from '../types';
import { CHALLENGE_OPTIONS } from '../utils/shelterConstants';

/** Convert Firestore Timestamp or string to ISO string */
function toISOString(val: any): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === 'string') return val;
  if (val.toDate) return val.toDate().toISOString(); // Firestore Timestamp duck-type
  return new Date().toISOString();
}

// ─── Derive behavior traits from shelter slider data ───

function deriveBehaviorTraits(data: Record<string, any>): BehaviorTrait[] {
  const traits: BehaviorTrait[] = [];
  const energy = data.energyLevel ?? 3;
  const friendliness = data.friendlinessAdults ?? 3;
  const confidence = data.confidenceLevel ?? 3;
  const touchSensitivity = data.touchSensitivity ?? 3;
  const separationAnxiety = data.separationAnxietyRisk ?? 3;

  if (energy >= 4) traits.push('energetic');
  else if (energy <= 2) traits.push('calm');

  if (friendliness >= 4) traits.push('social');
  else if (friendliness <= 2) traits.push('reserved');

  if (confidence >= 4) traits.push('protective');

  if (touchSensitivity >= 4) traits.push('affectionate');

  if (separationAnxiety <= 2 && confidence >= 3) traits.push('independent');

  if (energy >= 3 && friendliness >= 3 && !traits.includes('calm')) traits.push('playful');

  return traits;
}

// ─── Derive potential challenges from shelter topChallenges ───

const CHALLENGE_LABEL_MAP: Record<string, string> = {};
CHALLENGE_OPTIONS.forEach((opt) => { CHALLENGE_LABEL_MAP[opt.value] = opt.label; });

function deriveChallenges(data: Record<string, any>): string[] {
  const raw: string[] = data.topChallenges || [];
  return raw
    .map((val: string) => CHALLENGE_LABEL_MAP[val] || val.replace(/_/g, ' '))
    .slice(0, 3);
}

// ─── Build a PetWithCompatibility from raw Firestore data ───

function mapFirestoreDocToPet(id: string, data: Record<string, any>): PetWithCompatibility {
  return {
    id,
    name: data.name || 'Unknown',
    breed: data.breed || 'Mixed',
    age: mapAge(data.ageYears),
    size: mapSize(data.sizeCategory),
    description: data.oneLineBlurb || data.structuredNotes || '',
    imageUrls: data.photoUris || [],
    barkingLevel: data.barkingLevel ?? 3,
    sheddingLevel: data.sheddingLevel ?? 3,
    trainingLevel: mapTrainingLevel(data.houseTraining),
    energyLevel: data.energyLevel ?? 3,
    sociability: data.friendlinessAdults ?? 3,
    spaceRequirement: mapSpaceReq(data.sizeCategory),
    specialNeeds: (data.knownConditions?.length ?? 0) > 0 || data.medsNeeded === true,
    specialNeedsDescription: data.knownConditions?.map((c: any) => c.name).join(', ') || undefined,
    behaviorTraits: deriveBehaviorTraits(data),
    promptLabel: data.topStrengths?.[0] ? 'Strength' : undefined,
    promptAnswer: data.topStrengths?.[0] || undefined,
    createdAt: toISOString(data.createdAt),
    // Placeholder scores — filled by matching algorithm in usePets hook
    compatibilityScore: 0,
    whyMatch: [],
    potentialChallenges: deriveChallenges(data),
    aiSummary: data.structuredNotes || data.oneLineBlurb || '',
  };
}

export const petService = {
  /**
   * Fetch published pets from Firestore shelterPets collection.
   * Compatibility scoring is done client-side in utils/matching.ts.
   * In mock mode, returns pre-scored mock data.
   */
  async getPets(limit: number = 20): Promise<PetWithCompatibility[]> {
    if (useAppStore.getState().mockMode) {
      return mockPets.slice(0, limit);
    }
    const q = query(
      collection(db, 'shelterPets'),
      where('status', '==', 'published'),
    );
    const snap = await getDocs(q);
    const pets: PetWithCompatibility[] = [];
    snap.forEach((d) => {
      pets.push(mapFirestoreDocToPet(d.id, d.data()));
    });
    return pets.slice(0, limit);
  },

  async getPetById(petId: string): Promise<PetWithCompatibility> {
    if (useAppStore.getState().mockMode) {
      const pet = mockPets.find((p) => p.id === petId);
      if (!pet) throw new Error('Pet not found');
      return pet;
    }
    const ref = doc(db, 'shelterPets', petId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Pet not found');
    return mapFirestoreDocToPet(snap.id, snap.data());
  },
};

// ─── Helpers to map shelter schema → pet card schema ───

function mapAge(years: number | undefined): 'puppy' | 'young' | 'adult' | 'senior' {
  if (!years || years < 1) return 'puppy';
  if (years < 3) return 'young';
  if (years < 8) return 'adult';
  return 'senior';
}

function mapSize(cat: string | null | undefined): 'small' | 'medium' | 'large' {
  if (!cat) return 'medium';
  if (cat === 'tiny' || cat === 'small') return 'small';
  if (cat === 'medium') return 'medium';
  return 'large';
}

function mapTrainingLevel(level: string | null | undefined): number {
  switch (level) {
    case 'fully_trained': return 5;
    case 'mostly_trained': return 4;
    case 'some_training': return 3;
    case 'minimal': return 2;
    case 'none': default: return 1;
  }
}

function mapSpaceReq(cat: string | null | undefined): number {
  switch (cat) {
    case 'tiny': return 1;
    case 'small': return 2;
    case 'medium': return 3;
    case 'large': return 4;
    case 'extra_large': return 5;
    default: return 3;
  }
}

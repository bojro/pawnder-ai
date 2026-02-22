import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ShelterPet,
  PetIntakeDraft,
  DEFAULT_PET_INTAKE_DRAFT,
  PetStatus,
} from '../types/shelter';

const STORAGE_KEY = 'pawnder_shelter_pets';
const DRAFT_STORAGE_KEY = 'pawnder_shelter_current_draft';

// ─── Completion calculator ───
export function computeCompletion(draft: PetIntakeDraft): number {
  let filled = 0;
  let total = 0;

  // Step 1: Basic Profile (8 required fields)
  total += 8;
  if (draft.name.trim()) filled++;
  if (draft.species) filled++;
  if (draft.breed.trim()) filled++;
  if (draft.sex) filled++;
  if (draft.sizeCategory) filled++;
  if (draft.intakeDate) filled++;
  if (draft.intakeSource) filled++;
  if (draft.weightLbs > 0) filled++;

  // Step 2: Health (3 key fields)
  total += 3;
  if (draft.vaccineStatus !== 'unknown') filled++;
  if (draft.spayNeuterStatus !== 'unknown') filled++;
  if (draft.groomingNeed !== 'low' || draft.mobilityLimit !== 'none') filled++;

  // Step 3: Temperament Social (6 sliders — count as filled if any changed from default 3)
  total += 1;
  const socialSliders = [
    draft.friendlinessAdults, draft.friendlinessKids,
    draft.friendlinessDogs, draft.friendlinessCats,
    draft.confidenceLevel, draft.touchSensitivity,
  ];
  if (socialSliders.some(v => v !== 3)) filled++;

  // Step 4: Temperament Behavior
  total += 1;
  const behaviorSliders = [
    draft.startleResponse, draft.vocalizationLevel,
    draft.preyDrive, draft.resourceGuardingRisk,
    draft.separationAnxietyRisk, draft.leashReactivity,
  ];
  if (behaviorSliders.some(v => v !== 3)) filled++;

  // Step 5: Daily Needs
  total += 1;
  if (draft.energyLevel !== 3 || draft.exerciseMinPerDay !== 30 || draft.houseTraining !== 'none') filled++;

  // Step 6: Environment Fit
  total += 1;
  if (draft.bestHousingTypes.length > 0) filled++;

  // Step 7: Training Plan
  total += 1;
  if (draft.trainingFocusAreas.length > 0) filled++;

  // Step 8: Observations
  total += 2;
  if (draft.topStrengths.length > 0) filled++;
  if (draft.oneLineBlurb.trim()) filled++;

  // Step 9: Media & Assessment
  total += 2;
  if (draft.photoUris.length > 0) filled++;
  if (draft.assessorRole) filled++;

  return Math.round((filled / total) * 100);
}

function generateId(): string {
  return 'pet-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

interface ShelterState {
  // Data
  shelterPets: ShelterPet[];
  currentDraft: PetIntakeDraft;
  currentEditId: string | null;
  isLoaded: boolean;

  // Actions
  loadFromStorage: () => Promise<void>;
  updateDraft: (partial: Partial<PetIntakeDraft>) => void;
  resetDraft: () => void;
  startNewPet: () => void;
  editPet: (id: string) => void;
  saveDraft: () => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  updatePetStatus: (id: string, status: PetStatus) => Promise<void>;
}

export const useShelterStore = create<ShelterState>((set, get) => ({
  shelterPets: [],
  currentDraft: { ...DEFAULT_PET_INTAKE_DRAFT },
  currentEditId: null,
  isLoaded: false,

  loadFromStorage: async () => {
    try {
      const petsJson = await AsyncStorage.getItem(STORAGE_KEY);
      const draftJson = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
      const pets: ShelterPet[] = petsJson ? JSON.parse(petsJson) : [];
      const savedDraft = draftJson ? JSON.parse(draftJson) : null;
      set({
        shelterPets: pets,
        currentDraft: savedDraft?.draft || { ...DEFAULT_PET_INTAKE_DRAFT },
        currentEditId: savedDraft?.editId || null,
        isLoaded: true,
      });
    } catch (error) {
      console.error('Failed to load shelter data:', error);
      set({ isLoaded: true });
    }
  },

  updateDraft: (partial) => {
    const newDraft = { ...get().currentDraft, ...partial };
    set({ currentDraft: newDraft });
    // Autosave to AsyncStorage
    AsyncStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ draft: newDraft, editId: get().currentEditId }),
    ).catch(console.error);
  },

  resetDraft: () => {
    set({ currentDraft: { ...DEFAULT_PET_INTAKE_DRAFT }, currentEditId: null });
    AsyncStorage.removeItem(DRAFT_STORAGE_KEY).catch(console.error);
  },

  startNewPet: () => {
    set({ currentDraft: { ...DEFAULT_PET_INTAKE_DRAFT }, currentEditId: null });
    AsyncStorage.removeItem(DRAFT_STORAGE_KEY).catch(console.error);
  },

  editPet: (id: string) => {
    const pet = get().shelterPets.find(p => p.id === id);
    if (!pet) return;
    const { id: _id, completionPercent: _c, lastUpdated: _l, createdAt: _cr, ...draft } = pet;
    set({ currentDraft: draft as PetIntakeDraft, currentEditId: id });
    AsyncStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ draft, editId: id }),
    ).catch(console.error);
  },

  saveDraft: async () => {
    const { currentDraft, currentEditId, shelterPets } = get();
    const now = new Date().toISOString();
    const completion = computeCompletion(currentDraft);

    let updatedPets: ShelterPet[];

    if (currentEditId) {
      // Update existing pet
      updatedPets = shelterPets.map(p =>
        p.id === currentEditId
          ? { ...p, ...currentDraft, completionPercent: completion, lastUpdated: now }
          : p,
      );
    } else {
      // Create new pet
      const newPet: ShelterPet = {
        id: generateId(),
        completionPercent: completion,
        lastUpdated: now,
        createdAt: now,
        ...currentDraft,
      };
      updatedPets = [newPet, ...shelterPets];
      set({ currentEditId: newPet.id });
    }

    set({ shelterPets: updatedPets });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPets));
    await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
  },

  deletePet: async (id: string) => {
    const updatedPets = get().shelterPets.filter(p => p.id !== id);
    set({ shelterPets: updatedPets });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPets));
  },

  updatePetStatus: async (id: string, status: PetStatus) => {
    const now = new Date().toISOString();
    const updatedPets = get().shelterPets.map(p =>
      p.id === id ? { ...p, status, lastUpdated: now } : p,
    );
    set({ shelterPets: updatedPets });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPets));
  },
}));

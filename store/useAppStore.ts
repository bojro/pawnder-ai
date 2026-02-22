import { create } from 'zustand';
import {
  Adopter,
  OnboardingDraft,
  DEFAULT_ONBOARDING_DRAFT,
  ActiveMatch,
  StabilitySummary,
} from '../types';

interface AppState {
  // Auth
  adopterId: string | null;
  adopter: Adopter | null;
  isAuthenticated: boolean;

  // Onboarding
  onboardingDraft: OnboardingDraft;
  onboardingStep: number;

  // Match
  activeMatch: ActiveMatch | null;

  // Stability
  stabilitySummary: StabilitySummary | null;

  // UI state
  mockMode: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  setAdopter: (adopter: Adopter) => void;
  setAuthenticated: (val: boolean) => void;

  // Onboarding actions
  updateOnboardingDraft: (partial: Partial<OnboardingDraft>) => void;
  setOnboardingStep: (step: number) => void;
  resetOnboarding: () => void;

  // Match actions
  setActiveMatch: (match: ActiveMatch | null) => void;
  hasActiveMatch: () => boolean;

  // Stability actions
  setStabilitySummary: (summary: StabilitySummary | null) => void;

  // UI actions
  toggleMockMode: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  adopterId: null,
  adopter: null,
  isAuthenticated: false,

  // Onboarding
  onboardingDraft: { ...DEFAULT_ONBOARDING_DRAFT },
  onboardingStep: 0,

  // Match
  activeMatch: null,

  // Stability
  stabilitySummary: null,

  // UI
  mockMode: false,
  isLoading: false,
  error: null,

  // Auth actions
  setAdopter: (adopter) =>
    set({ adopter, adopterId: adopter.id, isAuthenticated: true }),
  setAuthenticated: (val) => set({ isAuthenticated: val }),

  // Onboarding actions
  updateOnboardingDraft: (partial) =>
    set((state) => ({
      onboardingDraft: { ...state.onboardingDraft, ...partial },
    })),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  resetOnboarding: () =>
    set({
      onboardingDraft: { ...DEFAULT_ONBOARDING_DRAFT },
      onboardingStep: 0,
    }),

  // Match actions
  setActiveMatch: (match) => set({ activeMatch: match }),
  hasActiveMatch: () => {
    const match = get().activeMatch;
    return match !== null && (match.status === 'confirmed' || match.status === 'in_foster');
  },

  // Stability actions
  setStabilitySummary: (summary) => set({ stabilitySummary: summary }),

  // UI actions
  toggleMockMode: () => set((state) => ({ mockMode: !state.mockMode })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Reset
  reset: () =>
    set({
      adopterId: null,
      adopter: null,
      isAuthenticated: false,
      activeMatch: null,
      stabilitySummary: null,
      onboardingDraft: { ...DEFAULT_ONBOARDING_DRAFT },
      onboardingStep: 0,
      error: null,
    }),
}));

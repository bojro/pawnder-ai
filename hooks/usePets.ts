import { useCallback, useState } from 'react';
import { petService } from '../services/petService';
import { useAppStore } from '../store/useAppStore';
import { matchAndScorePets, scorePet, explainMatch } from '../utils/matching';
import { PetWithCompatibility } from '../types';

/**
 * Module-level cache so the detail screen can look up a pet that was
 * already scored during the swipe-deck fetch, even though it uses a
 * separate hook instance.
 */
const scoredPetCache = new Map<string, PetWithCompatibility>();

export function usePets() {
  const [pets, setPets] = useState<PetWithCompatibility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async (limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      const rawPets = await petService.getPets(limit);
      const adopter = useAppStore.getState().adopter;
      const isMock = useAppStore.getState().mockMode;

      let result: PetWithCompatibility[];
      if (adopter && !isMock) {
        result = matchAndScorePets(adopter, rawPets);
      } else {
        result = rawPets;
      }

      // Populate cache so the detail screen can reuse scored data
      scoredPetCache.clear();
      result.forEach((p) => scoredPetCache.set(p.id, p));

      setPets(result);
    } catch (err) {
      setError('Failed to load pets');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Look up a pet by ID.
   * 1. Check the in-memory scored cache first (preserves matching data).
   * 2. Fall back to Firestore fetch + client-side scoring.
   */
  const fetchPetById = useCallback(async (id: string): Promise<PetWithCompatibility | null> => {
    // 1. Check cache (has whyMatch / potentialChallenges / score from swipe deck)
    const cached = scoredPetCache.get(id);
    if (cached) return cached;

    // 2. Fetch from Firestore and score locally
    try {
      setLoading(true);
      setError(null);
      const pet = await petService.getPetById(id);
      const adopter = useAppStore.getState().adopter;
      const isMock = useAppStore.getState().mockMode;

      if (adopter && !isMock) {
        const { score, components } = scorePet(adopter, pet);
        const { whyMatch, potentialChallenges } = explainMatch(components);
        const scored: PetWithCompatibility = {
          ...pet,
          compatibilityScore: score,
          whyMatch,
          // Keep shelter-derived challenges as fallback, prefer matching-derived ones
          potentialChallenges: potentialChallenges.length > 0 ? potentialChallenges : pet.potentialChallenges,
          aiSummary: pet.aiSummary || `${pet.name} is a ${pet.age} ${pet.breed}.`,
        };
        scoredPetCache.set(id, scored);
        return scored;
      }

      return pet;
    } catch (err) {
      setError('Failed to load pet details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { pets, loading, error, fetchPets, fetchPetById };
}

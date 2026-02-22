import { useCallback, useState } from 'react';
import { petService } from '../services/petService';
import { PetWithCompatibility } from '../types';

export function usePets() {
  const [pets, setPets] = useState<PetWithCompatibility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async (limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await petService.getPets(limit);
      setPets(data);
    } catch (err) {
      setError('Failed to load pets');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPetById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      return await petService.getPetById(id);
    } catch (err) {
      setError('Failed to load pet details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { pets, loading, error, fetchPets, fetchPetById };
}

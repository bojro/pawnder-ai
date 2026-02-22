import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/authService';
import {
  getDeviceId,
  saveDeviceId,
  generateDeviceId,
  getAdopterId,
  saveAdopterId,
} from '../utils/storage';

export function useAuth() {
  const { adopter, setAdopter, isAuthenticated, setAuthenticated, setLoading, setError } =
    useAppStore();
  const [isReady, setIsReady] = useState(false);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);

      // Check for existing adopter
      const storedAdopterId = await getAdopterId();
      if (storedAdopterId) {
        const existingAdopter = await authService.getAdopter(storedAdopterId);
        setAdopter(existingAdopter);
        setIsReady(true);
        return;
      }

      // Check for device ID
      let deviceId = await getDeviceId();
      if (!deviceId) {
        deviceId = generateDeviceId();
        await saveDeviceId(deviceId);
      }

      setIsReady(true);
    } catch (err) {
      setError('Failed to initialize');
      setIsReady(true);
    } finally {
      setLoading(false);
    }
  }, [setAdopter, setLoading, setError]);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      let deviceId = await getDeviceId();
      if (!deviceId) {
        deviceId = generateDeviceId();
        await saveDeviceId(deviceId);
      }

      const newAdopter = await authService.createAdopter(deviceId);
      await saveAdopterId(newAdopter.id);
      setAdopter(newAdopter);
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  }, [setAdopter, setLoading, setError]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { adopter, isAuthenticated, isReady, login };
}

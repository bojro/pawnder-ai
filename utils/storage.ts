import * as SecureStore from 'expo-secure-store';

const KEYS = {
  DEVICE_ID: 'pawnder_device_id',
  ADOPTER_ID: 'pawnder_adopter_id',
} as const;

export async function getDeviceId(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.DEVICE_ID);
  } catch {
    return null;
  }
}

export async function saveDeviceId(deviceId: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.DEVICE_ID, deviceId);
  } catch (error) {
    console.error('Failed to save device ID:', error);
  }
}

export async function getAdopterId(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.ADOPTER_ID);
  } catch {
    return null;
  }
}

export async function saveAdopterId(adopterId: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.ADOPTER_ID, adopterId);
  } catch (error) {
    console.error('Failed to save adopter ID:', error);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEYS.DEVICE_ID);
    await SecureStore.deleteItemAsync(KEYS.ADOPTER_ID);
  } catch (error) {
    console.error('Failed to clear secure store:', error);
  }
}

export function generateDeviceId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

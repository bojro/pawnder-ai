import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA8XRDY66xvW8_0NsishAoTpYRKqkFlPUk',
  authDomain: 'pawnder-ai.firebaseapp.com',
  projectId: 'pawnder-ai',
  storageBucket: 'pawnder-ai.firebasestorage.app',
  messagingSenderId: '173542979158',
  appId: '1:173542979158:web:e8f4ec4a9f83e0cf1dadf7',
  measurementId: 'G-2JMH9T279K',
};

// Prevent re-initialization crashes during HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use initializeAuth with AsyncStorage persistence, but fall back to getAuth if already initialized
let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e: any) {
  // auth/already-initialized happens during HMR — fall back to existing instance
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export default app;

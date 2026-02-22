import { useCallback, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/authService';

export function useAuth() {
  const { adopter, setAdopter, isAuthenticated, setLoading, setError } =
    useAppStore();
  const [isReady, setIsReady] = useState(false);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const mockMode = useAppStore.getState().mockMode;
    if (mockMode) {
      setIsReady(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      try {
        if (user) {
          const existingAdopter = await authService.getAdopter(user.uid).catch(() => null);
          if (existingAdopter) {
            setAdopter(existingAdopter);
          }
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        setIsReady(true);
      }
    });
    return unsubscribe;
  }, []);

  /** Sign up with email & password */
  const signup = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        const mockMode = useAppStore.getState().mockMode;

        if (mockMode) {
          const localUid = `mock-${Date.now()}`;
          const newAdopter = await authService.createAdopter(localUid);
          setAdopter(newAdopter);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const newAdopter = await authService.createAdopter(cred.user.uid);
        setAdopter(newAdopter);
      } catch (err: any) {
        const msg = friendlyError(err?.code);
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [setAdopter, setLoading, setError],
  );

  /** Log in with email & password */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        const mockMode = useAppStore.getState().mockMode;

        if (mockMode) {
          const localUid = `mock-${Date.now()}`;
          const newAdopter = await authService.createAdopter(localUid);
          setAdopter(newAdopter);
          return;
        }

        const cred = await signInWithEmailAndPassword(auth, email, password);
        const existingAdopter = await authService.createAdopter(cred.user.uid);
        setAdopter(existingAdopter);
      } catch (err: any) {
        const msg = friendlyError(err?.code);
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [setAdopter, setLoading, setError],
  );

  /** Sign out */
  const logout = useCallback(async () => {
    try {
      const mockMode = useAppStore.getState().mockMode;
      if (!mockMode) {
        await signOut(auth);
      }
      useAppStore.getState().reset();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  return { adopter, isAuthenticated, isReady, login, signup, logout };
}

/** Map Firebase error codes to user-friendly messages */
function friendlyError(code?: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email. Try signing up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

import { useEffect } from 'react';
import { router } from 'expo-router';

export default function OnboardingIndex() {
  useEffect(() => {
    router.replace('/(onboarding)/profile');
  }, []);

  return null;
}

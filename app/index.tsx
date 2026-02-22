import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { getUserRole } from '../utils/storage';
import { colors } from '../utils/theme';

export default function Index() {
  const { adopter, isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    const checkRoute = async () => {
      const role = await getUserRole();

      if (role === 'shelter') {
        router.replace('/(shelter)/dashboard');
        return;
      }

      if (!isAuthenticated || !adopter) {
        router.replace('/(auth)/login');
      } else if (!adopter.onboardingComplete) {
        router.replace('/(onboarding)');
      } else {
        router.replace('/(main)/swipe');
      }
    };

    checkRoute();
  }, [isReady, isAuthenticated, adopter]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.teal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
});

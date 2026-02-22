import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../utils/theme';

export default function Index() {
  const { adopter, isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated || !adopter) {
      router.replace('/(auth)/login');
    } else if (!adopter.onboardingComplete) {
      router.replace('/(onboarding)');
    } else {
      router.replace('/(main)/swipe');
    }
  }, [isReady, isAuthenticated, adopter]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.plum} />
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

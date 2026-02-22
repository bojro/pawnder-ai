import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store/useAppStore';
import { colors, typography, spacing } from '../../utils/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const isLoading = useAppStore((s) => s.isLoading);

  const handleContinue = async () => {
    await login();
    router.replace('/(onboarding)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.brand}>Pawnder.</Text>
          <Text style={styles.tagline}>
            Find your perfect companion through behavioral compatibility.
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationPlaceholder}>
            <Text style={styles.pawEmoji}>🐾</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
          />
          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    justifyContent: 'space-between',
  },
  hero: {
    paddingTop: 60,
  },
  welcome: {
    ...typography.bodyLg,
    color: colors.gray600,
  },
  brand: {
    ...typography.displayLg,
    fontSize: 48,
    color: colors.plum,
    marginTop: 4,
  },
  tagline: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginTop: spacing.md,
    maxWidth: 260,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.plumLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pawEmoji: {
    fontSize: 80,
  },
  footer: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  disclaimer: {
    ...typography.bodySm,
    color: colors.gray400,
    textAlign: 'center',
  },
});

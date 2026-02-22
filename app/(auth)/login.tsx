import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import TextInput from '../../components/ui/TextInput';
import SelectionChip from '../../components/ui/SelectionChip';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store/useAppStore';
import { saveUserRole, UserRole } from '../../utils/storage';
import { colors, typography, spacing } from '../../utils/theme';

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const isLoading = useAppStore((s) => s.isLoading);

  const [role, setRole] = useState<UserRole>('adopter');
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!email.trim()) return 'Please enter your email.';
    if (!password) return 'Please enter a password.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (isSignUp && password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const err = validate();
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);

    try {
      await saveUserRole(role);

      if (isSignUp) {
        await signup(email.trim(), password);
      } else {
        await login(email.trim(), password);
      }

      // Navigate based on role and onboarding status
      if (role === 'shelter') {
        router.push('/(shelter)/dashboard');
      } else {
        const adopter = useAppStore.getState().adopter;
        if (adopter?.onboardingComplete) {
          router.push('/(main)/swipe');
        } else {
          router.push('/(onboarding)');
        }
      }
    } catch (e: any) {
      // Error is already set in the store by useAuth, but also show locally
      setLocalError(e.message || 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Hero */}
            <View style={styles.hero}>
              <Text style={styles.welcome}>Welcome to</Text>
              <Image
                source={require('../../assets/pawnder-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.tagline}>
                Find your perfect companion through behavioral compatibility.
              </Text>
            </View>

            {/* Paw illustration */}
            <View style={styles.illustrationContainer}>
              <View style={styles.illustrationPlaceholder}>
                <Text style={styles.pawEmoji}>🐾</Text>
              </View>
            </View>

            {/* Auth form */}
            <View style={styles.form}>
              {/* Toggle between Sign Up / Log In */}
              <View style={styles.authToggle}>
                <TouchableOpacity
                  style={[styles.authTab, isSignUp && styles.authTabActive]}
                  onPress={() => { setIsSignUp(true); setLocalError(null); }}
                >
                  <Text style={[styles.authTabText, isSignUp && styles.authTabTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authTab, !isSignUp && styles.authTabActive]}
                  onPress={() => { setIsSignUp(false); setLocalError(null); }}
                >
                  <Text style={[styles.authTabText, !isSignUp && styles.authTabTextActive]}>
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                label="Password"
                placeholder="At least 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {isSignUp && (
                <TextInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              )}

              {localError && (
                <Text style={styles.errorText}>{localError}</Text>
              )}

              {/* Role toggle */}
              <View style={styles.roleSection}>
                <Text style={styles.roleLabel}>I am a...</Text>
                <View style={styles.roleRow}>
                  <SelectionChip
                    label="🏠  Adopter"
                    selected={role === 'adopter'}
                    onPress={() => setRole('adopter')}
                    style={styles.roleChip}
                  />
                  <SelectionChip
                    label="🏥  Shelter"
                    selected={role === 'shelter'}
                    onPress={() => setRole('shelter')}
                    style={styles.roleChip}
                  />
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Button
                title={isSignUp ? 'Create Account' : 'Log In'}
                onPress={handleSubmit}
                loading={isLoading}
              />
              <Text style={styles.disclaimer}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    justifyContent: 'space-between',
  },
  hero: {
    paddingTop: 48,
  },
  welcome: {
    ...typography.bodyLg,
    color: colors.gray600,
  },
  logo: {
    width: 240,
    height: 64,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tagline: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginTop: spacing.md,
    maxWidth: 260,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  illustrationPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pawEmoji: {
    fontSize: 52,
  },
  form: {
    gap: spacing.xs,
  },
  authToggle: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.md,
  },
  authTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  authTabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  authTabText: {
    ...typography.labelMd,
    color: colors.gray400,
  },
  authTabTextActive: {
    color: colors.teal,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.red,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  roleSection: {
    marginTop: spacing.sm,
  },
  roleLabel: {
    ...typography.labelMd,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleChip: {
    flex: 1,
  },
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  disclaimer: {
    ...typography.bodySm,
    color: colors.gray400,
    textAlign: 'center',
  },
});

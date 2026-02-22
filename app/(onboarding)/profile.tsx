import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import TextInput from '../../components/ui/TextInput';
import { useAppStore } from '../../store/useAppStore';
import { auth } from '../../services/firebase';
import { TOTAL_ONBOARDING_STEPS } from '../../utils/constants';
import { spacing } from '../../utils/theme';

export default function OnboardingProfile() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  // Auto-populate email from Firebase Auth if not already filled
  useEffect(() => {
    if (!onboardingDraft.email && auth.currentUser?.email) {
      updateOnboardingDraft({ email: auth.currentUser.email });
    }
  }, []);

  const canContinue =
    onboardingDraft.name.trim().length >= 2 &&
    onboardingDraft.age.trim().length > 0 &&
    onboardingDraft.email.trim().length > 3;

  return (
    <OnboardingStep
      title="Let's get to know you."
      subtitle="We'll use this info to personalize your experience."
      currentStep={0}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onNext={() => router.push('/(onboarding)/location')}
      nextDisabled={!canContinue}
    >
      <View style={styles.content}>
        <TextInput
          label="Full Name"
          placeholder="e.g. Alex Johnson"
          value={onboardingDraft.name}
          onChangeText={(text) => updateOnboardingDraft({ name: text })}
          autoCapitalize="words"
          autoComplete="name"
        />
        <TextInput
          label="Age"
          placeholder="e.g. 28"
          value={onboardingDraft.age}
          onChangeText={(text) => updateOnboardingDraft({ age: text })}
          keyboardType="number-pad"
          maxLength={3}
        />
        <TextInput
          label="Phone Number"
          placeholder="e.g. 555-123-4567"
          value={onboardingDraft.phone}
          onChangeText={(text) => updateOnboardingDraft({ phone: text })}
          keyboardType="phone-pad"
          autoComplete="tel"
        />
        <TextInput
          label="Email"
          placeholder="e.g. alex@example.com"
          value={onboardingDraft.email}
          onChangeText={(text) => updateOnboardingDraft({ email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
});

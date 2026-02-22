import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import TextInput from '../../components/ui/TextInput';
import { useAppStore } from '../../store/useAppStore';
import { TOTAL_ONBOARDING_STEPS } from '../../utils/constants';
import { spacing } from '../../utils/theme';

export default function OnboardingLocation() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  const canContinue = onboardingDraft.zipCode.length >= 5;

  return (
    <OnboardingStep
      title="Where are you located?"
      subtitle="We'll find pets near you."
      currentStep={1}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onNext={() => router.push('/(onboarding)/housing')}
      nextDisabled={!canContinue}
    >
      <View style={styles.content}>
        <TextInput
          label="Zip Code"
          placeholder="e.g. 90210"
          value={onboardingDraft.zipCode}
          onChangeText={(text) => updateOnboardingDraft({ zipCode: text })}
          keyboardType="number-pad"
          maxLength={5}
        />
        <TextInput
          label="Search Radius (miles)"
          placeholder="25"
          value={onboardingDraft.searchRadius === 0 ? '' : onboardingDraft.searchRadius.toString()}
          onChangeText={(text) =>
            updateOnboardingDraft({ searchRadius: text === '' ? 0 : parseInt(text) || 0 })
          }
          keyboardType="number-pad"
        />
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
});

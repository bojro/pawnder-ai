import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import TextArea from '../../components/ui/TextArea';
import { useAppStore } from '../../store/useAppStore';
import { TOTAL_ONBOARDING_STEPS } from '../../utils/constants';
import { spacing } from '../../utils/theme';

export default function OnboardingAllergies() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  return (
    <OnboardingStep
      title="Do you have any allergies?"
      subtitle="This helps us flag pets that may trigger allergies."
      currentStep={5}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onNext={() => router.push('/(onboarding)/training-willingness')}
    >
      <View style={styles.content}>
        <TextArea
          label="List any allergies (optional)"
          placeholder="e.g. cat dander, hay, certain medications..."
          hint="Leave blank if none"
          value={onboardingDraft.allergies}
          onChangeText={(text) => updateOnboardingDraft({ allergies: text })}
        />
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
});

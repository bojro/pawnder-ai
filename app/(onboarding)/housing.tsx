import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import SelectionChip from '../../components/ui/SelectionChip';
import { useAppStore } from '../../store/useAppStore';
import { HOUSING_OPTIONS } from '../../utils/constants';
import { HousingType } from '../../types';
import { spacing } from '../../utils/theme';

export default function OnboardingHousing() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  return (
    <OnboardingStep
      title="What type of home do you have?"
      subtitle="This helps us match pets suited to your living space."
      currentStep={1}
      totalSteps={6}
      onNext={() => router.push('/(onboarding)/lifestyle')}
      nextDisabled={!onboardingDraft.housingType}
    >
      <View style={styles.options}>
        {HOUSING_OPTIONS.map((opt) => (
          <SelectionChip
            key={opt.value}
            label={opt.label}
            selected={onboardingDraft.housingType === opt.value}
            onPress={() =>
              updateOnboardingDraft({ housingType: opt.value as HousingType })
            }
          />
        ))}
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.md,
  },
});

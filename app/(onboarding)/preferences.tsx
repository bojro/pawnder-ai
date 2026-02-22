import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import Slider from '../../components/ui/Slider';
import SelectionChip from '../../components/ui/SelectionChip';
import { useAppStore } from '../../store/useAppStore';
import { spacing } from '../../utils/theme';

export default function OnboardingPreferences() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  return (
    <OnboardingStep
      title="Set your tolerance levels."
      subtitle="Help us avoid dealbreakers."
      currentStep={4}
      totalSteps={6}
      onNext={() => router.push('/(onboarding)/narrative')}
    >
      <View style={styles.content}>
        <Slider
          label="Barking Tolerance"
          value={onboardingDraft.barkingTolerance}
          min={1}
          max={5}
          labels={['None', 'Low', 'Some', 'High', 'Any']}
          onValueChange={(val) =>
            updateOnboardingDraft({ barkingTolerance: val })
          }
        />
        <Slider
          label="Shedding Tolerance"
          value={onboardingDraft.sheddingTolerance}
          min={1}
          max={5}
          labels={['None', 'Low', 'Some', 'High', 'Any']}
          onValueChange={(val) =>
            updateOnboardingDraft({ sheddingTolerance: val })
          }
        />
        <Slider
          label="Training Commitment"
          value={onboardingDraft.trainingCommitment}
          min={1}
          max={5}
          labels={['Min', 'Low', 'Med', 'High', 'Max']}
          onValueChange={(val) =>
            updateOnboardingDraft({ trainingCommitment: val })
          }
        />
        <SelectionChip
          label="Open to special needs pets"
          selected={onboardingDraft.specialNeedsWilling}
          onPress={() =>
            updateOnboardingDraft({
              specialNeedsWilling: !onboardingDraft.specialNeedsWilling,
            })
          }
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

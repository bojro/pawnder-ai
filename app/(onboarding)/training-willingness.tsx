import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import SelectionChip from '../../components/ui/SelectionChip';
import Slider from '../../components/ui/Slider';
import { useAppStore } from '../../store/useAppStore';
import { TOTAL_ONBOARDING_STEPS } from '../../utils/constants';
import { spacing } from '../../utils/theme';

export default function OnboardingTrainingWillingness() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  return (
    <OnboardingStep
      title="How willing are you to train?"
      subtitle="Training strengthens the bond between you and your pet."
      currentStep={6}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onNext={() => router.push('/(onboarding)/preferences')}
    >
      <View style={styles.content}>
        <SelectionChip
          label="Willing to attend group training classes"
          selected={onboardingDraft.willingGroupClasses}
          onPress={() =>
            updateOnboardingDraft({
              willingGroupClasses: !onboardingDraft.willingGroupClasses,
            })
          }
        />
        <SelectionChip
          label="Willing to hire a private trainer"
          selected={onboardingDraft.willingPrivateTrainer}
          onPress={() =>
            updateOnboardingDraft({
              willingPrivateTrainer: !onboardingDraft.willingPrivateTrainer,
            })
          }
        />
        <SelectionChip
          label="Comfortable doing daily training exercises at home"
          selected={onboardingDraft.willingDailyExercises}
          onPress={() =>
            updateOnboardingDraft({
              willingDailyExercises: !onboardingDraft.willingDailyExercises,
            })
          }
        />
        <Slider
          label="Hours per week available for training"
          value={onboardingDraft.trainingHoursPerWeek}
          min={0}
          max={10}
          step={1}
          labels={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
          onValueChange={(val) =>
            updateOnboardingDraft({ trainingHoursPerWeek: val })
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

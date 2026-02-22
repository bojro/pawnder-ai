import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import Slider from '../../components/ui/Slider';
import TextInput from '../../components/ui/TextInput';
import { useAppStore } from '../../store/useAppStore';
import { TOTAL_ONBOARDING_STEPS } from '../../utils/constants';
import { spacing } from '../../utils/theme';

export default function OnboardingLifestyle() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  return (
    <OnboardingStep
      title="Tell us about your lifestyle."
      subtitle="Your daily routine helps determine the best fit."
      currentStep={3}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onNext={() => router.push('/(onboarding)/experience')}
    >
      <View style={styles.content}>
        <TextInput
          label="Hours away from home per day"
          placeholder="8"
          value={onboardingDraft.hoursAwayPerDay === 0 ? '' : onboardingDraft.hoursAwayPerDay.toString()}
          onChangeText={(text) =>
            updateOnboardingDraft({ hoursAwayPerDay: text === '' ? 0 : parseInt(text) || 0 })
          }
          keyboardType="number-pad"
        />
        <Slider
          label="Active hours per week"
          icon="barbell-outline"
          value={onboardingDraft.activityHoursPerWeek}
          min={0}
          max={40}
          step={5}
          labels={['0', '5', '10', '15', '20', '25', '30', '35', '40']}
          onValueChange={(val) =>
            updateOnboardingDraft({ activityHoursPerWeek: val })
          }
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

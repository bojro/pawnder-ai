import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import Slider from '../../components/ui/Slider';
import TextInput from '../../components/ui/TextInput';
import { useAppStore } from '../../store/useAppStore';
import { ActivityLevel } from '../../types';
import { spacing } from '../../utils/theme';

export default function OnboardingLifestyle() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  return (
    <OnboardingStep
      title="Tell us about your lifestyle."
      subtitle="Your daily routine helps determine the best fit."
      currentStep={2}
      totalSteps={6}
      onNext={() => router.push('/(onboarding)/experience')}
    >
      <View style={styles.content}>
        <TextInput
          label="Hours away from home per day"
          placeholder="8"
          value={onboardingDraft.hoursAwayPerDay.toString()}
          onChangeText={(text) =>
            updateOnboardingDraft({ hoursAwayPerDay: parseInt(text) || 0 })
          }
          keyboardType="number-pad"
        />
        <Slider
          label="Activity Level"
          value={onboardingDraft.activityLevel}
          min={1}
          max={5}
          labels={['Low', 'Light', 'Moderate', 'Active', 'Intense']}
          onValueChange={(val) =>
            updateOnboardingDraft({ activityLevel: val as ActivityLevel })
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

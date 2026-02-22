import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import SelectionChip from '../../components/ui/SelectionChip';
import { useAppStore } from '../../store/useAppStore';
import { EXPERIENCE_OPTIONS } from '../../utils/constants';
import { ExperienceLevel } from '../../types';
import { colors, typography, spacing } from '../../utils/theme';

export default function OnboardingExperience() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  return (
    <OnboardingStep
      title="What's your experience with pets?"
      currentStep={3}
      totalSteps={6}
      onNext={() => router.push('/(onboarding)/preferences')}
      nextDisabled={!onboardingDraft.experienceLevel}
    >
      <View style={styles.content}>
        <View style={styles.options}>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={onboardingDraft.experienceLevel === opt.value}
              onPress={() =>
                updateOnboardingDraft({
                  experienceLevel: opt.value as ExperienceLevel,
                })
              }
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Household</Text>
        <View style={styles.row}>
          <SelectionChip
            label="I have kids"
            selected={onboardingDraft.hasKids}
            onPress={() =>
              updateOnboardingDraft({ hasKids: !onboardingDraft.hasKids })
            }
          />
          <SelectionChip
            label="I have other pets"
            selected={onboardingDraft.hasExistingPets}
            onPress={() =>
              updateOnboardingDraft({
                hasExistingPets: !onboardingDraft.hasExistingPets,
              })
            }
          />
        </View>
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  options: {
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.gray600,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});

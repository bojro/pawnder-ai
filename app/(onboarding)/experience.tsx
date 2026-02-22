import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import SelectionChip from '../../components/ui/SelectionChip';
import { useAppStore } from '../../store/useAppStore';
import {
  EXPERIENCE_OPTIONS,
  PET_TYPE_OPTIONS,
  TOTAL_ONBOARDING_STEPS,
} from '../../utils/constants';
import { ExperienceLevel, PetType } from '../../types';
import { colors, typography, spacing } from '../../utils/theme';

export default function OnboardingExperience() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  const togglePetType = (type: PetType) => {
    const current = onboardingDraft.existingPetTypes;
    if (current.includes(type)) {
      updateOnboardingDraft({
        existingPetTypes: current.filter((t) => t !== type),
      });
    } else {
      updateOnboardingDraft({
        existingPetTypes: [...current, type],
      });
    }
  };

  return (
    <OnboardingStep
      title="What's your experience with pets?"
      currentStep={4}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onNext={() => router.push('/(onboarding)/allergies')}
      nextDisabled={!onboardingDraft.experienceLevel}
    >
      {/* Experience Level */}
      <View style={styles.options}>
        {EXPERIENCE_OPTIONS.map((opt) => (
          <SelectionChip
            key={opt.value}
            label={`${opt.label}\n${opt.subtitle}`}
            selected={onboardingDraft.experienceLevel === opt.value}
            onPress={() =>
              updateOnboardingDraft({
                experienceLevel: opt.value as ExperienceLevel,
              })
            }
          />
        ))}
      </View>

      {/* Pet Types */}
      <Text style={styles.sectionLabel}>Current Pets in Household</Text>
      <View style={styles.petGrid}>
        {PET_TYPE_OPTIONS.map((opt) => (
          <SelectionChip
            key={opt.value}
            label={opt.label}
            selected={onboardingDraft.existingPetTypes.includes(opt.value as PetType)}
            onPress={() => togglePetType(opt.value as PetType)}
            style={styles.petChip}
          />
        ))}
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.gray600,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  petChip: {
    marginBottom: 0,
  },
});

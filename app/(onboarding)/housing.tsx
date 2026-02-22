import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import SelectionChip from '../../components/ui/SelectionChip';
import TextInput from '../../components/ui/TextInput';
import { useAppStore } from '../../store/useAppStore';
import {
  HOUSING_OPTIONS,
  ENVIRONMENT_OPTIONS,
  TOTAL_ONBOARDING_STEPS,
} from '../../utils/constants';
import { HousingType, EnvironmentType } from '../../types';
import { colors, typography, spacing } from '../../utils/theme';

export default function OnboardingHousing() {
  const { onboardingDraft, updateOnboardingDraft } = useAppStore();

  const canContinue =
    onboardingDraft.housingType !== null && onboardingDraft.environment !== null;

  return (
    <OnboardingStep
      title="Tell us about your home."
      subtitle="This helps us match pets suited to your living space."
      currentStep={2}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onNext={() => router.push('/(onboarding)/lifestyle')}
      nextDisabled={!canContinue}
    >
      {/* Housing Type */}
      <Text style={styles.sectionLabel}>Housing Type</Text>
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

      {/* Environment */}
      <Text style={styles.sectionLabel}>Environment</Text>
      <View style={styles.chipRow}>
        {ENVIRONMENT_OPTIONS.map((opt) => (
          <SelectionChip
            key={opt.value}
            label={opt.label}
            selected={onboardingDraft.environment === opt.value}
            onPress={() =>
              updateOnboardingDraft({ environment: opt.value as EnvironmentType })
            }
            style={styles.chipFlex}
          />
        ))}
      </View>

      {/* Household */}
      <Text style={styles.sectionLabel}>Household</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <TextInput
            label="People in home"
            placeholder="1"
            value={onboardingDraft.householdSize === 0 ? '' : onboardingDraft.householdSize.toString()}
            onChangeText={(text) =>
              updateOnboardingDraft({ householdSize: text === '' ? 0 : parseInt(text) || 0 })
            }
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        <View style={styles.inputHalf}>
          <TextInput
            label="Number of kids"
            placeholder="0"
            value={onboardingDraft.kidsCount === 0 ? '' : onboardingDraft.kidsCount.toString()}
            onChangeText={(text) =>
              updateOnboardingDraft({ kidsCount: text === '' ? 0 : parseInt(text) || 0 })
            }
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
      </View>

      {onboardingDraft.kidsCount > 0 && (
        <TextInput
          label="Kids' ages (comma-separated)"
          placeholder="e.g. 3, 7, 12"
          value={onboardingDraft.kidsAges}
          onChangeText={(text) => updateOnboardingDraft({ kidsAges: text })}
        />
      )}
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...typography.labelMd,
    color: colors.gray600,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  options: {
    gap: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chipFlex: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import IntakeStep from '../../../components/IntakeStep';
import TextInput from '../../../components/ui/TextInput';
import SelectionChip from '../../../components/ui/SelectionChip';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import Slider from '../../../components/ui/Slider';
import { useShelterStore } from '../../../store/useShelterStore';
import {
  TOTAL_INTAKE_STEPS,
  HOUSING_FIT_OPTIONS,
  YARD_REQUIREMENT_OPTIONS,
  TEMPERAMENT_SLIDER_LABELS_LEVEL,
} from '../../../utils/shelterConstants';
import { HousingFit, YardRequirement } from '../../../types/shelter';
import { colors, typography, spacing } from '../../../utils/theme';

export default function IntakeEnvironment() {
  const { currentDraft, updateDraft } = useShelterStore();

  const toggleHousingFit = (value: HousingFit) => {
    const current = currentDraft.bestHousingTypes;
    if (current.includes(value)) {
      updateDraft({ bestHousingTypes: current.filter(v => v !== value) });
    } else {
      updateDraft({ bestHousingTypes: [...current, value] });
    }
  };

  return (
    <IntakeStep
      title="Environment Fit"
      subtitle="Define the ideal living environment and constraints."
      currentStep={5}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={() => router.push('/(shelter)/(intake)/training-plan')}
    >
      <View style={styles.content}>
        {/* Best Housing Types (multi-select) */}
        <Text style={styles.sectionLabel}>Best Housing Types (select all that apply)</Text>
        <View style={styles.chipRow}>
          {HOUSING_FIT_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.bestHousingTypes.includes(opt.value)}
              onPress={() => toggleHousingFit(opt.value)}
            />
          ))}
        </View>

        {/* Yard Requirement */}
        <Text style={styles.sectionLabel}>Yard / Fence Requirement</Text>
        <View style={styles.chipRow}>
          {YARD_REQUIREMENT_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.yardRequirement === opt.value}
              onPress={() => updateDraft({ yardRequirement: opt.value })}
            />
          ))}
        </View>

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Stairs OK</Text>
          <ToggleSwitch
            value={currentDraft.stairsOk}
            onToggle={() => updateDraft({ stairsOk: !currentDraft.stairsOk })}
          />
        </View>

        <Slider
          label="Noise Tolerance"
          icon="volume-medium-outline"
          value={currentDraft.noiseTolerance}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_LEVEL}
          onValueChange={(val) => updateDraft({ noiseTolerance: val })}
        />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Single Pet Only</Text>
          <ToggleSwitch
            value={currentDraft.singlePetOnly}
            onToggle={() => updateDraft({ singlePetOnly: !currentDraft.singlePetOnly })}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Compatible with Kids</Text>
          <ToggleSwitch
            value={currentDraft.compatibleWithKids}
            onToggle={() => updateDraft({ compatibleWithKids: !currentDraft.compatibleWithKids })}
          />
        </View>

        {currentDraft.compatibleWithKids && (
          <TextInput
            label="Minimum Kid Age"
            placeholder="0 (no minimum)"
            value={currentDraft.minimumKidAge === 0 ? '' : currentDraft.minimumKidAge.toString()}
            onChangeText={(text) => updateDraft({ minimumKidAge: text === '' ? 0 : parseInt(text) || 0 })}
            keyboardType="number-pad"
            maxLength={2}
          />
        )}

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Needs Experienced Owner</Text>
          <ToggleSwitch
            value={currentDraft.needsExperiencedOwner}
            onToggle={() => updateDraft({ needsExperiencedOwner: !currentDraft.needsExperiencedOwner })}
          />
        </View>
      </View>
    </IntakeStep>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.gray600,
    marginTop: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggleLabel: {
    ...typography.bodyMd,
    color: colors.charcoal,
  },
});

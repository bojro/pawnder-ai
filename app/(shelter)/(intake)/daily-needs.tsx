import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import IntakeStep from '../../../components/IntakeStep';
import TextInput from '../../../components/ui/TextInput';
import SelectionChip from '../../../components/ui/SelectionChip';
import Slider from '../../../components/ui/Slider';
import { useShelterStore } from '../../../store/useShelterStore';
import {
  TOTAL_INTAKE_STEPS,
  TRAINING_LEVEL_OPTIONS,
  TEMPERAMENT_SLIDER_LABELS_LEVEL,
  TEMPERAMENT_SLIDER_LABELS_RISK,
} from '../../../utils/shelterConstants';
import { TrainingLevel } from '../../../types/shelter';
import { colors, typography, spacing } from '../../../utils/theme';

export default function IntakeDailyNeeds() {
  const { currentDraft, updateDraft } = useShelterStore();

  return (
    <IntakeStep
      title="Daily Needs"
      subtitle="Quantify this pet's day-to-day requirements."
      currentStep={4}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={() => router.push('/(shelter)/(intake)/environment')}
    >
      <View style={styles.content}>
        <Slider
          label="Energy Level"
          icon="flash-outline"
          value={currentDraft.energyLevel}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_LEVEL}
          onValueChange={(val) => updateDraft({ energyLevel: val })}
        />

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <TextInput
              label="Exercise (min/day)"
              placeholder="30"
              value={currentDraft.exerciseMinPerDay === 0 ? '' : currentDraft.exerciseMinPerDay.toString()}
              onChangeText={(text) => updateDraft({ exerciseMinPerDay: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
          <View style={styles.inputHalf}>
            <TextInput
              label="Enrichment (min/day)"
              placeholder="15"
              value={currentDraft.enrichmentMinPerDay === 0 ? '' : currentDraft.enrichmentMinPerDay.toString()}
              onChangeText={(text) => updateDraft({ enrichmentMinPerDay: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <TextInput
              label="Potty breaks/day"
              placeholder="4"
              value={currentDraft.pottyBreaksPerDay === 0 ? '' : currentDraft.pottyBreaksPerDay.toString()}
              onChangeText={(text) => updateDraft({ pottyBreaksPerDay: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={styles.inputHalf}>
            <TextInput
              label="Alone-time (hrs)"
              placeholder="4"
              value={currentDraft.aloneTimeTolerance === 0 ? '' : currentDraft.aloneTimeTolerance.toString()}
              onChangeText={(text) => updateDraft({ aloneTimeTolerance: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>House Training</Text>
        <View style={styles.chipRowInline}>
          {TRAINING_LEVEL_OPTIONS.map((opt) => (
            <SelectionChip
              key={`house-${opt.value}`}
              label={opt.label}
              selected={currentDraft.houseTraining === opt.value}
              onPress={() => updateDraft({ houseTraining: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Leash Training</Text>
        <View style={styles.chipRowInline}>
          {TRAINING_LEVEL_OPTIONS.map((opt) => (
            <SelectionChip
              key={`leash-${opt.value}`}
              label={opt.label}
              selected={currentDraft.leashTraining === opt.value}
              onPress={() => updateDraft({ leashTraining: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Crate Training</Text>
        <View style={styles.chipRowInline}>
          {TRAINING_LEVEL_OPTIONS.map((opt) => (
            <SelectionChip
              key={`crate-${opt.value}`}
              label={opt.label}
              selected={currentDraft.crateTraining === opt.value}
              onPress={() => updateDraft({ crateTraining: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        <Slider
          label="Destructive Risk"
          icon="hammer-outline"
          value={currentDraft.destructiveRisk}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_RISK}
          onValueChange={(val) => updateDraft({ destructiveRisk: val })}
        />

        <Slider
          label="Escape Risk"
          icon="exit-outline"
          value={currentDraft.escapeRisk}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_RISK}
          onValueChange={(val) => updateDraft({ escapeRisk: val })}
        />

        <Slider
          label="Shedding Level"
          value={currentDraft.sheddingLevel}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_LEVEL}
          onValueChange={(val) => updateDraft({ sheddingLevel: val })}
        />

        <Slider
          label="Barking Level"
          icon="volume-medium-outline"
          value={currentDraft.barkingLevel}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_LEVEL}
          onValueChange={(val) => updateDraft({ barkingLevel: val })}
        />
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
  chipRowInline: {
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

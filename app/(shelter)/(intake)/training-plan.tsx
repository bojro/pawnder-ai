import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import IntakeStep from '../../../components/IntakeStep';
import TextInput from '../../../components/ui/TextInput';
import SelectionChip from '../../../components/ui/SelectionChip';
import { useShelterStore } from '../../../store/useShelterStore';
import {
  TOTAL_INTAKE_STEPS,
  TRAINING_FOCUS_OPTIONS,
  TRAINING_URGENCY_OPTIONS,
  TRAINING_FORMAT_OPTIONS,
  KNOWN_TRIGGER_OPTIONS,
  MANAGEMENT_TOOL_OPTIONS,
} from '../../../utils/shelterConstants';
import {
  TrainingFocusArea,
  TrainingUrgency,
  TrainingFormat,
  KnownTrigger,
  ManagementTool,
} from '../../../types/shelter';
import { colors, typography, spacing } from '../../../utils/theme';

export default function IntakeTrainingPlan() {
  const { currentDraft, updateDraft } = useShelterStore();

  const toggleArrayItem = <T extends string>(
    field: 'trainingFocusAreas' | 'recommendedFormat' | 'knownTriggers' | 'managementTools',
    value: T,
  ) => {
    const current = currentDraft[field] as T[];
    if (current.includes(value)) {
      updateDraft({ [field]: current.filter(v => v !== value) });
    } else {
      updateDraft({ [field]: [...current, value] });
    }
  };

  return (
    <IntakeStep
      title="Training Plan"
      subtitle="Set up training recommendations for future adopters."
      currentStep={6}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={() => router.push('/(shelter)/(intake)/observations')}
    >
      <View style={styles.content}>
        {/* Focus Areas */}
        <Text style={styles.sectionLabel}>Recommended Focus Areas</Text>
        <View style={styles.chipRow}>
          {TRAINING_FOCUS_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.trainingFocusAreas.includes(opt.value)}
              onPress={() => toggleArrayItem('trainingFocusAreas', opt.value)}
            />
          ))}
        </View>

        {/* Urgency */}
        <Text style={styles.sectionLabel}>Urgency Level</Text>
        <View style={styles.chipRowInline}>
          {TRAINING_URGENCY_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.trainingUrgency === opt.value}
              onPress={() => updateDraft({ trainingUrgency: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        {/* Time estimates */}
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <TextInput
              label="Hours first month"
              placeholder="10"
              value={currentDraft.estTrainingHoursFirstMonth === 0 ? '' : currentDraft.estTrainingHoursFirstMonth.toString()}
              onChangeText={(text) => updateDraft({ estTrainingHoursFirstMonth: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
          <View style={styles.inputHalf}>
            <TextInput
              label="Ongoing hrs/week"
              placeholder="2"
              value={currentDraft.estTrainingHoursOngoingWeekly === 0 ? '' : currentDraft.estTrainingHoursOngoingWeekly.toString()}
              onChangeText={(text) => updateDraft({ estTrainingHoursOngoingWeekly: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        {/* Format */}
        <Text style={styles.sectionLabel}>Recommended Format</Text>
        <View style={styles.chipRow}>
          {TRAINING_FORMAT_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.recommendedFormat.includes(opt.value)}
              onPress={() => toggleArrayItem('recommendedFormat', opt.value)}
            />
          ))}
        </View>

        {/* Triggers */}
        <Text style={styles.sectionLabel}>Known Triggers</Text>
        <View style={styles.chipRow}>
          {KNOWN_TRIGGER_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.knownTriggers.includes(opt.value)}
              onPress={() => toggleArrayItem('knownTriggers', opt.value)}
            />
          ))}
        </View>

        {/* Management Tools */}
        <Text style={styles.sectionLabel}>Suggested Management Tools</Text>
        <View style={styles.chipRow}>
          {MANAGEMENT_TOOL_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.managementTools.includes(opt.value)}
              onPress={() => toggleArrayItem('managementTools', opt.value)}
            />
          ))}
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

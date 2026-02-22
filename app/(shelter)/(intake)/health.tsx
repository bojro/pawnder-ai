import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import IntakeStep from '../../../components/IntakeStep';
import TextInput from '../../../components/ui/TextInput';
import TextArea from '../../../components/ui/TextArea';
import SelectionChip from '../../../components/ui/SelectionChip';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { useShelterStore } from '../../../store/useShelterStore';
import {
  TOTAL_INTAKE_STEPS,
  VAX_STATUS_OPTIONS,
  SPAY_NEUTER_OPTIONS,
  GROOMING_NEED_OPTIONS,
  MOBILITY_LIMIT_OPTIONS,
  CONDITION_PICKLIST,
} from '../../../utils/shelterConstants';
import {
  VaxStatus,
  SpayNeuterStatus,
  GroomingNeed,
  MobilityLimit,
  ConditionSeverity,
  KnownCondition,
} from '../../../types/shelter';
import { colors, typography, spacing, radii } from '../../../utils/theme';

export default function IntakeHealth() {
  const { currentDraft, updateDraft } = useShelterStore();
  const [showConditionPicker, setShowConditionPicker] = useState(false);

  const addCondition = (name: string) => {
    if (currentDraft.knownConditions.some(c => c.name === name)) return;
    updateDraft({
      knownConditions: [...currentDraft.knownConditions, { name, severity: 'mild' }],
    });
  };

  const removeCondition = (name: string) => {
    updateDraft({
      knownConditions: currentDraft.knownConditions.filter(c => c.name !== name),
    });
  };

  const updateConditionSeverity = (name: string, severity: ConditionSeverity) => {
    updateDraft({
      knownConditions: currentDraft.knownConditions.map(c =>
        c.name === name ? { ...c, severity } : c,
      ),
    });
  };

  return (
    <IntakeStep
      title="Health & Care"
      subtitle="Record medical history and care requirements."
      currentStep={1}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={() => router.push('/(shelter)/(intake)/temperament-social')}
    >
      <View style={styles.content}>
        {/* Vaccine Status */}
        <Text style={styles.sectionLabel}>Vaccine Status</Text>
        <View style={styles.chipRow}>
          {VAX_STATUS_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.vaccineStatus === opt.value}
              onPress={() => updateDraft({ vaccineStatus: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        {/* Microchipped */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Microchipped</Text>
          <ToggleSwitch
            value={currentDraft.microchipped}
            onToggle={() => updateDraft({ microchipped: !currentDraft.microchipped })}
          />
        </View>

        {/* Spay/Neuter */}
        <Text style={styles.sectionLabel}>Spay / Neuter Status</Text>
        <View style={styles.chipRowInline}>
          {SPAY_NEUTER_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.spayNeuterStatus === opt.value}
              onPress={() => updateDraft({ spayNeuterStatus: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        {/* Medications */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Medications Needed</Text>
          <ToggleSwitch
            value={currentDraft.medsNeeded}
            onToggle={() => updateDraft({ medsNeeded: !currentDraft.medsNeeded })}
          />
        </View>
        {currentDraft.medsNeeded && (
          <TextInput
            label="Medication Frequency"
            placeholder="e.g. Daily heartworm preventative"
            value={currentDraft.medsFrequency}
            onChangeText={(text) => updateDraft({ medsFrequency: text })}
          />
        )}

        {/* Special Diet */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Special Diet</Text>
          <ToggleSwitch
            value={currentDraft.specialDiet}
            onToggle={() => updateDraft({ specialDiet: !currentDraft.specialDiet })}
          />
        </View>
        {currentDraft.specialDiet && (
          <TextInput
            label="Diet Type"
            placeholder="e.g. Grain-free, prescription"
            value={currentDraft.specialDietType}
            onChangeText={(text) => updateDraft({ specialDietType: text })}
          />
        )}

        {/* Known Conditions */}
        <Text style={styles.sectionLabel}>Known Conditions</Text>
        {currentDraft.knownConditions.length > 0 && (
          <View style={styles.conditionList}>
            {currentDraft.knownConditions.map((condition) => (
              <View key={condition.name} style={styles.conditionItem}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionName}>{condition.name}</Text>
                  <TouchableOpacity onPress={() => removeCondition(condition.name)}>
                    <Ionicons name="close-circle" size={20} color={colors.red} />
                  </TouchableOpacity>
                </View>
                <View style={styles.severityRow}>
                  {(['mild', 'moderate', 'severe'] as ConditionSeverity[]).map((sev) => (
                    <SelectionChip
                      key={sev}
                      label={sev.charAt(0).toUpperCase() + sev.slice(1)}
                      selected={condition.severity === sev}
                      onPress={() => updateConditionSeverity(condition.name, sev)}
                      style={styles.severityChip}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowConditionPicker(!showConditionPicker)}
        >
          <Ionicons name={showConditionPicker ? 'chevron-up' : 'add'} size={18} color={colors.teal} />
          <Text style={styles.addButtonText}>
            {showConditionPicker ? 'Hide conditions' : 'Add condition'}
          </Text>
        </TouchableOpacity>
        {showConditionPicker && (
          <View style={styles.conditionPickerGrid}>
            {CONDITION_PICKLIST.filter(
              name => !currentDraft.knownConditions.some(c => c.name === name)
            ).map((name) => (
              <TouchableOpacity
                key={name}
                style={styles.conditionPickerItem}
                onPress={() => addCondition(name)}
              >
                <Ionicons name="add-circle-outline" size={16} color={colors.teal} />
                <Text style={styles.conditionPickerText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Grooming */}
        <Text style={styles.sectionLabel}>Grooming Needs</Text>
        <View style={styles.chipRow}>
          {GROOMING_NEED_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.groomingNeed === opt.value}
              onPress={() => updateDraft({ groomingNeed: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        {/* Mobility */}
        <Text style={styles.sectionLabel}>Mobility Limits</Text>
        <View style={styles.chipRow}>
          {MOBILITY_LIMIT_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.mobilityLimit === opt.value}
              onPress={() => updateDraft({ mobilityLimit: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        {/* Allergies */}
        <TextInput
          label="Known Allergies"
          placeholder="e.g. Chicken, grass pollen"
          value={currentDraft.petAllergies}
          onChangeText={(text) => updateDraft({ petAllergies: text })}
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chipRowInline: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chipFlex: {},
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
  conditionList: {
    gap: spacing.sm,
  },
  conditionItem: {
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  conditionName: {
    ...typography.labelMd,
    color: colors.charcoal,
  },
  severityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  severityChip: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  addButtonText: {
    ...typography.labelSm,
    color: colors.teal,
  },
  conditionPickerGrid: {
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: spacing.sm,
  },
  conditionPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  conditionPickerText: {
    ...typography.bodyMd,
    color: colors.charcoal,
  },
});

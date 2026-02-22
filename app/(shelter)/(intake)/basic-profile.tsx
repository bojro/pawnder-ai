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
  SPECIES_OPTIONS,
  SEX_OPTIONS,
  AGE_CONFIDENCE_OPTIONS,
  SIZE_CATEGORY_OPTIONS,
  INTAKE_SOURCE_OPTIONS,
  ADOPTION_STATUS_OPTIONS,
} from '../../../utils/shelterConstants';
import {
  Species,
  PetSex,
  AgeConfidence,
  SizeCategory,
  IntakeSource,
  AdoptionStatus,
} from '../../../types/shelter';
import { colors, typography, spacing } from '../../../utils/theme';

function getSizeFromWeight(lbs: number): SizeCategory | null {
  if (lbs <= 0) return null;
  if (lbs < 5) return 'tiny';
  if (lbs < 25) return 'small';
  if (lbs < 50) return 'medium';
  if (lbs < 100) return 'large';
  return 'extra_large';
}

export default function IntakeBasicProfile() {
  const { currentDraft, updateDraft, saveDraft } = useShelterStore();

  const canContinue = currentDraft.name.trim().length > 0 && currentDraft.species !== null;

  const handleSaveAndExit = async () => {
    await saveDraft();
    router.replace('/(shelter)/dashboard');
  };

  return (
    <IntakeStep
      title="Basic Profile"
      subtitle="Start with the essentials about this pet."
      currentStep={0}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={() => router.push('/(shelter)/(intake)/health')}
      nextDisabled={!canContinue}
      showBack={true}
      onBack={handleSaveAndExit}
      backLabel="Save & Exit"
    >
      <View style={styles.content}>
        <TextInput
          label="Pet Name"
          placeholder="e.g. Luna"
          value={currentDraft.name}
          onChangeText={(text) => updateDraft({ name: text })}
          autoCapitalize="words"
        />

        <Text style={styles.sectionLabel}>Species</Text>
        <View style={styles.chipRow}>
          {SPECIES_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.species === opt.value}
              onPress={() => updateDraft({ species: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        <TextInput
          label="Breed / Mix"
          placeholder="e.g. Golden Retriever Mix"
          value={currentDraft.breed}
          onChangeText={(text) => updateDraft({ breed: text })}
        />

        <Text style={styles.sectionLabel}>Sex</Text>
        <View style={styles.chipRowInline}>
          {SEX_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.sex === opt.value}
              onPress={() => updateDraft({ sex: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Age</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <TextInput
              label="Years"
              placeholder="0"
              value={currentDraft.ageYears === 0 ? '' : currentDraft.ageYears.toString()}
              onChangeText={(text) => updateDraft({ ageYears: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={styles.inputHalf}>
            <TextInput
              label="Months"
              placeholder="0"
              value={currentDraft.ageMonths === 0 ? '' : currentDraft.ageMonths.toString()}
              onChangeText={(text) => updateDraft({ ageMonths: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Age Confidence</Text>
        <View style={styles.chipRowInline}>
          {AGE_CONFIDENCE_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.ageConfidence === opt.value}
              onPress={() => updateDraft({ ageConfidence: opt.value })}
              style={styles.chipFlex}
            />
          ))}
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <TextInput
              label="Weight (lbs)"
              placeholder="0"
              value={currentDraft.weightLbs === 0 ? '' : currentDraft.weightLbs.toString()}
              onChangeText={(text) => {
                const w = text === '' ? 0 : parseInt(text) || 0;
                const autoSize = getSizeFromWeight(w);
                updateDraft({ weightLbs: w, ...(autoSize ? { sizeCategory: autoSize } : {}) });
              }}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
          <View style={styles.inputHalf}>
            <TextInput
              label="Adoption Fee ($)"
              placeholder="0"
              value={currentDraft.adoptionFee === 0 ? '' : currentDraft.adoptionFee.toString()}
              onChangeText={(text) => updateDraft({ adoptionFee: text === '' ? 0 : parseInt(text) || 0 })}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Size Category</Text>
        <View style={styles.chipRow}>
          {SIZE_CATEGORY_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.sizeCategory === opt.value}
              onPress={() => updateDraft({ sizeCategory: opt.value })}
            />
          ))}
        </View>

        <TextInput
          label="Intake Date"
          placeholder="YYYY-MM-DD"
          value={currentDraft.intakeDate}
          onChangeText={(text) => updateDraft({ intakeDate: text })}
        />

        <Text style={styles.sectionLabel}>Intake Source</Text>
        <View style={styles.chipRow}>
          {INTAKE_SOURCE_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.intakeSource === opt.value}
              onPress={() => updateDraft({ intakeSource: opt.value })}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Adoption Status</Text>
        <View style={styles.chipRow}>
          {ADOPTION_STATUS_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.adoptionStatus === opt.value}
              onPress={() => updateDraft({ adoptionStatus: opt.value })}
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
    // Allow natural sizing
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
});

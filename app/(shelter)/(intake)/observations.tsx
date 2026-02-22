import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import IntakeStep from '../../../components/IntakeStep';
import TextInput from '../../../components/ui/TextInput';
import TextArea from '../../../components/ui/TextArea';
import SelectionChip from '../../../components/ui/SelectionChip';
import { useShelterStore } from '../../../store/useShelterStore';
import {
  TOTAL_INTAKE_STEPS,
  STRENGTH_OPTIONS,
  CHALLENGE_OPTIONS,
} from '../../../utils/shelterConstants';
import { PetStrength, PetChallenge } from '../../../types/shelter';
import { colors, typography, spacing } from '../../../utils/theme';

export default function IntakeObservations() {
  const { currentDraft, updateDraft } = useShelterStore();

  const toggleStrength = (value: PetStrength) => {
    const current = currentDraft.topStrengths;
    if (current.includes(value)) {
      updateDraft({ topStrengths: current.filter(v => v !== value) });
    } else if (current.length < 3) {
      updateDraft({ topStrengths: [...current, value] });
    }
  };

  const toggleChallenge = (value: PetChallenge) => {
    const current = currentDraft.topChallenges;
    if (current.includes(value)) {
      updateDraft({ topChallenges: current.filter(v => v !== value) });
    } else if (current.length < 3) {
      updateDraft({ topChallenges: [...current, value] });
    }
  };

  return (
    <IntakeStep
      title="Observations & Narrative"
      subtitle="Summarize strengths, challenges, and notes."
      currentStep={7}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={() => router.push('/(shelter)/(intake)/availability')}
    >
      <View style={styles.content}>
        {/* Strengths */}
        <Text style={styles.sectionLabel}>
          Top Strengths (choose up to 3) — {currentDraft.topStrengths.length}/3
        </Text>
        <View style={styles.chipRow}>
          {STRENGTH_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.topStrengths.includes(opt.value)}
              onPress={() => toggleStrength(opt.value)}
              disabled={
                !currentDraft.topStrengths.includes(opt.value) &&
                currentDraft.topStrengths.length >= 3
              }
            />
          ))}
        </View>

        {/* Challenges */}
        <Text style={styles.sectionLabel}>
          Top Challenges (choose up to 3) — {currentDraft.topChallenges.length}/3
        </Text>
        <View style={styles.chipRow}>
          {CHALLENGE_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.topChallenges.includes(opt.value)}
              onPress={() => toggleChallenge(opt.value)}
              disabled={
                !currentDraft.topChallenges.includes(opt.value) &&
                currentDraft.topChallenges.length >= 3
              }
            />
          ))}
        </View>

        {/* One-line blurb */}
        <View>
          <TextInput
            label={`One-line blurb (${currentDraft.oneLineBlurb.length}/120)`}
            placeholder="A joyful golden who greets everyone..."
            value={currentDraft.oneLineBlurb}
            onChangeText={(text) => updateDraft({ oneLineBlurb: text.slice(0, 120) })}
            maxLength={120}
          />
        </View>

        {/* Structured notes */}
        <TextArea
          label={`Structured notes (${currentDraft.structuredNotes.length}/400)`}
          placeholder="Background, behavior observations, medical notes..."
          value={currentDraft.structuredNotes}
          onChangeText={(text) => updateDraft({ structuredNotes: text.slice(0, 400) })}
          maxLength={400}
        />

        {/* Ideal adopter notes */}
        <TextArea
          label={`Ideal adopter profile (${currentDraft.idealAdopterNotes.length}/400)`}
          placeholder="Active family with a yard. Patient with training..."
          value={currentDraft.idealAdopterNotes}
          onChangeText={(text) => updateDraft({ idealAdopterNotes: text.slice(0, 400) })}
          maxLength={400}
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
});

import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import IntakeStep from '../../../components/IntakeStep';
import TextInput from '../../../components/ui/TextInput';
import SelectionChip from '../../../components/ui/SelectionChip';
import Slider from '../../../components/ui/Slider';
import ImagePickerGrid from '../../../components/shelter/ImagePickerGrid';
import { useShelterStore } from '../../../store/useShelterStore';
import {
  TOTAL_INTAKE_STEPS,
  ASSESSOR_ROLE_OPTIONS,
  ASSESSMENT_METHOD_OPTIONS,
} from '../../../utils/shelterConstants';
import { AssessorRole, AssessmentMethod } from '../../../types/shelter';
import { colors, typography, spacing } from '../../../utils/theme';

export default function IntakeMedia() {
  const { currentDraft, updateDraft, saveDraft } = useShelterStore();

  const handleFinish = async () => {
    try {
      await saveDraft();
      Alert.alert('Saved!', 'Pet profile has been saved to your dashboard.', [
        { text: 'OK', onPress: () => router.replace('/(shelter)/dashboard') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save. Please try again.');
    }
  };

  return (
    <IntakeStep
      title="Media & Assessment"
      subtitle="Add photos and record who assessed this pet."
      currentStep={8}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={handleFinish}
      nextLabel="Save & Finish"
    >
      <View style={styles.content}>
        {/* Photos */}
        <ImagePickerGrid
          imageUris={currentDraft.photoUris}
          coverIndex={currentDraft.coverPhotoIndex}
          onImagesChange={(uris) => updateDraft({ photoUris: uris })}
          onCoverChange={(index) => updateDraft({ coverPhotoIndex: index })}
        />

        {/* Assessment provenance */}
        <Text style={styles.sectionLabel}>Assessor Role</Text>
        <View style={styles.chipRow}>
          {ASSESSOR_ROLE_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.assessorRole === opt.value}
              onPress={() => updateDraft({ assessorRole: opt.value })}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Assessment Method</Text>
        <View style={styles.chipRow}>
          {ASSESSMENT_METHOD_OPTIONS.map((opt) => (
            <SelectionChip
              key={opt.value}
              label={opt.label}
              selected={currentDraft.assessmentMethod === opt.value}
              onPress={() => updateDraft({ assessmentMethod: opt.value })}
            />
          ))}
        </View>

        <TextInput
          label="Total Observation Hours"
          placeholder="e.g. 12"
          value={currentDraft.observationHours === 0 ? '' : currentDraft.observationHours.toString()}
          onChangeText={(text) => updateDraft({ observationHours: text === '' ? 0 : parseInt(text) || 0 })}
          keyboardType="number-pad"
          maxLength={4}
        />

        <Slider
          label="Overall Confidence Score"
          icon="ribbon-outline"
          value={currentDraft.overallConfidence}
          min={1}
          max={5}
          labels={['Very low', 'Low', 'Moderate', 'High', 'Very high']}
          onValueChange={(val) => updateDraft({ overallConfidence: val })}
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

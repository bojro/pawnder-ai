import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import IntakeStep from '../../../components/IntakeStep';
import Slider from '../../../components/ui/Slider';
import { useShelterStore } from '../../../store/useShelterStore';
import {
  TOTAL_INTAKE_STEPS,
  TEMPERAMENT_SLIDER_LABELS_FRIENDLINESS,
  TEMPERAMENT_SLIDER_LABELS_CONFIDENCE,
  TEMPERAMENT_SLIDER_LABELS_SENSITIVITY,
} from '../../../utils/shelterConstants';
import { spacing } from '../../../utils/theme';

export default function IntakeTemperamentSocial() {
  const { currentDraft, updateDraft } = useShelterStore();

  return (
    <IntakeStep
      title="Temperament — Social"
      subtitle="Rate how this pet interacts with people and other animals."
      currentStep={2}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={() => router.push('/(shelter)/(intake)/temperament-behavior')}
    >
      <View style={styles.content}>
        <Slider
          label="Friendliness to Adults"
          icon="people-outline"
          value={currentDraft.friendlinessAdults}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_FRIENDLINESS}
          onValueChange={(val) => updateDraft({ friendlinessAdults: val })}
        />
        <Slider
          label="Friendliness to Kids"
          icon="happy-outline"
          value={currentDraft.friendlinessKids}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_FRIENDLINESS}
          onValueChange={(val) => updateDraft({ friendlinessKids: val })}
        />
        <Slider
          label="Friendliness to Dogs"
          icon="paw-outline"
          value={currentDraft.friendlinessDogs}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_FRIENDLINESS}
          onValueChange={(val) => updateDraft({ friendlinessDogs: val })}
        />
        <Slider
          label="Friendliness to Cats"
          value={currentDraft.friendlinessCats}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_FRIENDLINESS}
          onValueChange={(val) => updateDraft({ friendlinessCats: val })}
        />
        <Slider
          label="Confidence Level"
          icon="shield-outline"
          value={currentDraft.confidenceLevel}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_CONFIDENCE}
          onValueChange={(val) => updateDraft({ confidenceLevel: val })}
        />
        <Slider
          label="Touch / Handling Sensitivity"
          icon="hand-left-outline"
          value={currentDraft.touchSensitivity}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_SENSITIVITY}
          onValueChange={(val) => updateDraft({ touchSensitivity: val })}
        />
      </View>
    </IntakeStep>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
  },
});

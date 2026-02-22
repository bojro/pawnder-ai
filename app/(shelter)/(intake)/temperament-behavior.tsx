import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import IntakeStep from '../../../components/IntakeStep';
import Slider from '../../../components/ui/Slider';
import { useShelterStore } from '../../../store/useShelterStore';
import {
  TOTAL_INTAKE_STEPS,
  TEMPERAMENT_SLIDER_LABELS_RISK,
  TEMPERAMENT_SLIDER_LABELS_LEVEL,
} from '../../../utils/shelterConstants';
import { spacing } from '../../../utils/theme';

export default function IntakeTemperamentBehavior() {
  const { currentDraft, updateDraft } = useShelterStore();

  return (
    <IntakeStep
      title="Temperament — Behavior"
      subtitle="Assess behavioral patterns and risk indicators."
      currentStep={3}
      totalSteps={TOTAL_INTAKE_STEPS}
      onNext={() => router.push('/(shelter)/(intake)/daily-needs')}
    >
      <View style={styles.content}>
        <Slider
          label="Startle Response"
          icon="flash-outline"
          value={currentDraft.startleResponse}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_RISK}
          onValueChange={(val) => updateDraft({ startleResponse: val })}
        />
        <Slider
          label="Vocalization Level"
          icon="volume-high-outline"
          value={currentDraft.vocalizationLevel}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_LEVEL}
          onValueChange={(val) => updateDraft({ vocalizationLevel: val })}
        />
        <Slider
          label="Prey Drive"
          icon="locate-outline"
          value={currentDraft.preyDrive}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_LEVEL}
          onValueChange={(val) => updateDraft({ preyDrive: val })}
        />
        <Slider
          label="Resource Guarding Risk"
          icon="alert-circle-outline"
          value={currentDraft.resourceGuardingRisk}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_RISK}
          onValueChange={(val) => updateDraft({ resourceGuardingRisk: val })}
        />
        <Slider
          label="Separation Anxiety Risk"
          icon="heart-dislike-outline"
          value={currentDraft.separationAnxietyRisk}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_RISK}
          onValueChange={(val) => updateDraft({ separationAnxietyRisk: val })}
        />
        <Slider
          label="Leash Reactivity"
          icon="walk-outline"
          value={currentDraft.leashReactivity}
          min={1}
          max={5}
          labels={TEMPERAMENT_SLIDER_LABELS_LEVEL}
          onValueChange={(val) => updateDraft({ leashReactivity: val })}
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

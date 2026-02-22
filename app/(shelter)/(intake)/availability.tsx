import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import IntakeStep from '../../../components/IntakeStep';
import AvailabilityGrid from '../../../components/shelter/AvailabilityGrid';
import { useShelterStore } from '../../../store/useShelterStore';
import { TOTAL_INTAKE_STEPS } from '../../../utils/shelterConstants';
import { spacing } from '../../../utils/theme';

export default function IntakeAvailability() {
  const { currentDraft, updateDraft } = useShelterStore();

  return (
    <IntakeStep
      title="Visit Availability"
      subtitle="Mark when this pet is available for visits."
      currentStep={8}
      totalSteps={TOTAL_INTAKE_STEPS}
      scrollEnabled={false}
      onNext={() => router.push('/(shelter)/(intake)/media')}
    >
      <View style={styles.content}>
        <AvailabilityGrid
          grid={currentDraft.availabilityGrid}
          onChange={(grid) => updateDraft({ availabilityGrid: grid })}
        />
      </View>
    </IntakeStep>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
});

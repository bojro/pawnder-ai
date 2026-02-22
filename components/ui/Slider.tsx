import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../utils/theme';

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void;
  labels?: string[];
}

export default function Slider({
  label,
  value,
  min = 1,
  max = 5,
  onValueChange,
  labels,
}: SliderProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <View
            style={[
              styles.trackFill,
              { width: `${((value - min) / (max - min)) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.stepsRow}>
          {steps.map((step) => (
            <View
              key={step}
              style={[styles.stepTouchable]}
              onTouchEnd={() => onValueChange(step)}
            >
              <View
                style={[
                  styles.dot,
                  step <= value && styles.dotActive,
                  step === value && styles.dotCurrent,
                ]}
              />
              {labels && labels[step - min] ? (
                <Text style={styles.stepLabel}>{labels[step - min]}</Text>
              ) : (
                <Text style={styles.stepLabel}>{step}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyMd,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  trackContainer: {
    paddingHorizontal: 4,
  },
  track: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
    marginBottom: 8,
  },
  trackFill: {
    height: 4,
    backgroundColor: colors.plum,
    borderRadius: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepTouchable: {
    alignItems: 'center',
    paddingVertical: 4,
    minWidth: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gray200,
    marginBottom: 4,
  },
  dotActive: {
    backgroundColor: colors.plumLight,
  },
  dotCurrent: {
    backgroundColor: colors.plum,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepLabel: {
    ...typography.bodySm,
    color: colors.gray400,
    fontSize: 11,
  },
});

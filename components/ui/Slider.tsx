import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../utils/theme';

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  labels?: string[];
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function Slider({
  label,
  value,
  min = 1,
  max = 5,
  step = 1,
  onValueChange,
  labels,
  icon,
}: SliderProps) {
  const steps = Array.from(
    { length: Math.floor((max - min) / step) + 1 },
    (_, i) => min + i * step,
  );

  const fillPercent = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {icon && <Ionicons name={icon} size={18} color={colors.teal} style={styles.labelIcon} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <View
            style={[
              styles.trackFill,
              { width: `${fillPercent}%` },
            ]}
          />
        </View>
        <View style={styles.stepsRow}>
          {steps.map((stepVal, idx) => (
            <TouchableOpacity
              key={stepVal}
              activeOpacity={0.7}
              onPress={() => onValueChange(stepVal)}
              style={styles.stepTouchable}
            >
              <View
                style={[
                  styles.dot,
                  stepVal <= value && styles.dotActive,
                  stepVal === value && styles.dotCurrent,
                ]}
              />
              {labels && labels[idx] !== undefined ? (
                <Text style={styles.stepLabel}>{labels[idx]}</Text>
              ) : (
                <Text style={styles.stepLabel}>{stepVal}</Text>
              )}
            </TouchableOpacity>
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    ...typography.bodyMd,
    color: colors.charcoal,
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
    backgroundColor: colors.teal,
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
    backgroundColor: colors.tealLight,
  },
  dotCurrent: {
    backgroundColor: colors.teal,
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

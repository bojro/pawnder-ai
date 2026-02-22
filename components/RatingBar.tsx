import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../utils/theme';

interface RatingBarProps {
  label: string;
  value: number;
  max?: number;
}

export default function RatingBar({ label, value, max = 5 }: RatingBarProps) {
  const segments = Array.from({ length: max }, (_, i) => i < value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barRow}>
        {segments.map((filled, idx) => (
          <View
            key={idx}
            style={[
              styles.segment,
              filled ? styles.segmentFilled : styles.segmentEmpty,
            ]}
          />
        ))}
        <Text style={styles.valueText}>{value}/{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySm,
    color: colors.gray600,
    marginBottom: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  segmentFilled: {
    backgroundColor: colors.teal,
  },
  segmentEmpty: {
    backgroundColor: colors.gray200,
  },
  valueText: {
    ...typography.labelSm,
    color: colors.gray400,
    marginLeft: spacing.sm,
    minWidth: 28,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, sizes, spacing } from '../../utils/theme';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i === current ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  dot: {
    width: sizes.dotSize,
    height: sizes.dotSize,
    borderRadius: sizes.dotSize / 2,
  },
  active: {
    backgroundColor: colors.plum,
  },
  inactive: {
    backgroundColor: colors.gray200,
  },
});

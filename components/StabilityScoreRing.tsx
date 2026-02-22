import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../utils/theme';
import { getStabilityColor } from '../utils/formatters';

interface StabilityScoreRingProps {
  score: number;
  label?: string;
}

export default function StabilityScoreRing({
  score,
  label = 'Stability Score',
}: StabilityScoreRingProps) {
  const scoreColor = getStabilityColor(score);
  const ringSize = 140;
  const borderWidth = 8;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderWidth,
            borderColor: colors.gray200,
          },
        ]}
      >
        {/* Colored overlay arc -- simplified as a solid colored ring for MVP */}
        <View
          style={[
            styles.ringOverlay,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderWidth,
              borderColor: scoreColor,
              opacity: score / 100,
            },
          ]}
        />
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreNumber, { color: scoreColor }]}>{Math.round(score)}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringOverlay: {
    position: 'absolute',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    ...typography.displayLg,
    fontSize: 40,
  },
  scoreMax: {
    ...typography.bodySm,
    color: colors.gray400,
  },
  label: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginTop: spacing.md,
  },
});

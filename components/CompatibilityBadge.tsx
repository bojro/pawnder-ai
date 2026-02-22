import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, shadows } from '../utils/theme';

interface CompatibilityBadgeProps {
  score: number;
  size?: 'small' | 'large';
}

export default function CompatibilityBadge({
  score,
  size = 'small',
}: CompatibilityBadgeProps) {
  const isLarge = size === 'large';
  const dimension = isLarge ? 80 : 48;

  return (
    <View
      style={[
        styles.container,
        shadows.actionButton,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
      ]}
    >
      <Text style={[styles.score, isLarge && styles.scoreLarge]}>
        {Math.round(score)}
      </Text>
      <Text style={[styles.percent, isLarge && styles.percentLarge]}>%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.golden,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  score: {
    color: colors.white,
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 16,
  },
  scoreLarge: {
    fontSize: 28,
  },
  percent: {
    color: colors.white,
    fontSize: 10,
    marginTop: -4,
  },
  percentLarge: {
    fontSize: 14,
    marginTop: -8,
  },
});

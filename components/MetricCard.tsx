import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../utils/theme';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export default function MetricCard({
  label,
  value,
  subtitle,
  color = colors.teal,
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  label: {
    ...typography.labelSm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.displaySm,
    fontSize: 24,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.gray400,
    marginTop: 2,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PetStatus } from '../../types/shelter';
import { colors, typography, spacing, radii } from '../../utils/theme';

interface StatusBadgeProps {
  status: PetStatus;
}

const STATUS_CONFIG: Record<PetStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Draft', bg: colors.gray200, text: colors.gray600 },
  ready: { label: 'Ready', bg: colors.goldenLight, text: '#8B6914' },
  published: { label: 'Published', bg: '#DCFCE7', text: colors.green },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.chip,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.labelSm,
    fontSize: 12,
  },
});

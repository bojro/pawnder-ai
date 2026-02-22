import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, radii, spacing } from '../../utils/theme';

interface SelectionChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function SelectionChip({
  label,
  selected,
  onPress,
  disabled = false,
  style,
}: SelectionChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.chip,
        selected && styles.selected,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radii.chip,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  selected: {
    backgroundColor: colors.plumLight,
    borderColor: colors.plum,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...typography.bodyMd,
    textAlign: 'center',
    color: colors.charcoal,
  },
  selectedLabel: {
    color: colors.plum,
    fontFamily: typography.labelMd.fontFamily,
  },
});

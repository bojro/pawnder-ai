import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, sizes } from '../../utils/theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function Checkbox({ checked, onToggle, disabled = false }: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        checked && styles.checked,
        disabled && styles.disabled,
      ]}
    >
      {checked && <Ionicons name="checkmark" size={16} color={colors.white} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: sizes.checkboxSize,
    height: sizes.checkboxSize,
    borderRadius: radii.checkbox,
    borderWidth: 2,
    borderColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checked: {
    backgroundColor: colors.plum,
    borderColor: colors.plum,
  },
  disabled: {
    opacity: 0.4,
  },
});

import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../utils/theme';

interface ToggleSwitchProps {
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function ToggleSwitch({ value, onToggle, disabled = false }: ToggleSwitchProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.track,
        value ? styles.trackActive : styles.trackInactive,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.thumb,
          value ? styles.thumbActive : styles.thumbInactive,
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trackActive: {
    backgroundColor: colors.teal,
  },
  trackInactive: {
    backgroundColor: colors.gray200,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
  thumbInactive: {
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.4,
  },
});

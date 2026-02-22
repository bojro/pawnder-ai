import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes, shadows, spacing } from '../utils/theme';

interface SwipeActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export default function SwipeActionButtons({
  onPass,
  onLike,
  disabled = false,
}: SwipeActionButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPass}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.button, shadows.actionButton, disabled && styles.disabled]}
      >
        <Ionicons name="close" size={sizes.iconSizeAction} color={colors.charcoal} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onLike}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.button, shadows.actionButton, disabled && styles.disabled]}
      >
        <Ionicons name="heart" size={sizes.iconSizeAction} color={colors.rose} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: spacing.lg,
  },
  button: {
    width: sizes.actionButtonSize,
    height: sizes.actionButtonSize,
    borderRadius: sizes.actionButtonSize / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

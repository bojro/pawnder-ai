import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.teal} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(247, 249, 248, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

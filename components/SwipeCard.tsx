import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { PetWithCompatibility } from '../types';
import { colors, typography, radii, shadows, spacing } from '../utils/theme';
import CompatibilityBadge from './CompatibilityBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;

interface SwipeCardProps {
  pet: PetWithCompatibility;
}

export default function SwipeCard({ pet }: SwipeCardProps) {
  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: pet.imageUrls[0] }} style={styles.image} />
        <View style={styles.badgeContainer}>
          <CompatibilityBadge score={pet.compatibilityScore} size="small" />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>
          {pet.breed} · {pet.age} · {pet.size}
        </Text>
        {pet.promptLabel && pet.promptAnswer && (
          <View style={styles.promptCard}>
            <Text style={styles.promptLabel}>{pet.promptLabel}</Text>
            <Text style={styles.promptAnswer}>{pet.promptAnswer}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    backgroundColor: colors.gray100,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  body: {
    padding: spacing.cardPadding,
  },
  name: {
    ...typography.displaySm,
  },
  breed: {
    ...typography.bodySm,
    marginTop: 4,
  },
  promptCard: {
    marginTop: spacing.md,
    backgroundColor: colors.cream,
    borderRadius: radii.sm,
    padding: spacing.md,
  },
  promptLabel: {
    ...typography.bodySm,
    color: colors.gray400,
    marginBottom: 4,
  },
  promptAnswer: {
    ...typography.bodyLg,
    color: colors.charcoal,
  },
});

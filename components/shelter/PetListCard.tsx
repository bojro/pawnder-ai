import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShelterPet } from '../../types/shelter';
import StatusBadge from './StatusBadge';
import { colors, typography, spacing, radii, shadows } from '../../utils/theme';

interface PetListCardProps {
  pet: ShelterPet;
  onEdit: () => void;
  onReview: () => void;
}

export default function PetListCard({ pet, onEdit, onReview }: PetListCardProps) {
  const updatedDate = new Date(pet.lastUpdated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          <Text style={styles.petName}>{pet.name || 'Unnamed Pet'}</Text>
          <Text style={styles.petMeta}>
            {pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : 'Unknown'}{' '}
            {pet.breed ? `· ${pet.breed}` : ''}
          </Text>
        </View>
        <StatusBadge status={pet.status} />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Completion</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${pet.completionPercent}%` }]} />
          </View>
          <Text style={styles.infoValue}>{pet.completionPercent}%</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Updated</Text>
          <Text style={styles.infoValue}>{updatedDate}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={18} color={colors.teal} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onReview}>
          <Ionicons name="eye-outline" size={18} color={colors.teal} />
          <Text style={styles.actionText}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  nameSection: {
    flex: 1,
    marginRight: spacing.md,
  },
  petName: {
    ...typography.displaySm,
    marginBottom: 2,
  },
  petMeta: {
    ...typography.bodySm,
    color: colors.gray600,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    ...typography.bodySm,
    color: colors.gray400,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.labelSm,
    color: colors.charcoal,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: 3,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.teal,
    borderRadius: 3,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.chip,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  actionText: {
    ...typography.labelSm,
    color: colors.teal,
  },
});

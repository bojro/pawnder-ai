import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import PetImageCarousel from '../../../components/PetImageCarousel';
import CompatibilityBadge from '../../../components/CompatibilityBadge';
import RatingBar from '../../../components/RatingBar';
import ExplainabilityCard from '../../../components/ExplainabilityCard';
import Button from '../../../components/ui/Button';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { usePets } from '../../../hooks/usePets';
import { useAppStore } from '../../../store/useAppStore';
import { generateWhyYouMatch } from '../../../services/geminiService';
import { PetWithCompatibility } from '../../../types';
import { colors, typography, spacing, radii, shadows } from '../../../utils/theme';
import { capitalizeFirst } from '../../../utils/formatters';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchPetById } = usePets();
  const [pet, setPet] = useState<PetWithCompatibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadPet();
    }
  }, [id]);

  const loadPet = async () => {
    const data = await fetchPetById(id!);
    setPet(data);
    setLoading(false);

    // After showing the pet with rule-based data, request Gemini narrative
    if (data) {
      fetchGeminiNarrative(data);
    }
  };

  /**
   * Call Gemini directly to get a personalized "why you match" narrative.
   * Falls back silently to the rule-based data already shown if it fails.
   */
  const fetchGeminiNarrative = async (currentPet: PetWithCompatibility) => {
    const adopterId = useAppStore.getState().adopterId;
    const isMock = useAppStore.getState().mockMode;

    // Skip in mock mode or if no adopter
    if (isMock || !adopterId) return;

    setAiLoading(true);
    try {
      const result = await generateWhyYouMatch(adopterId, currentPet.id);

      setPet((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          whyMatch: result.whyMatch.length > 0 ? result.whyMatch : prev.whyMatch,
          potentialChallenges:
            result.challenges.length > 0 ? result.challenges : prev.potentialChallenges,
        };
      });
    } catch (err) {
      // Silently fall back to rule-based data — no user-facing error
      console.warn('Gemini narrative unavailable, using rule-based data:', err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <LoadingOverlay visible />;

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Pet not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <PetImageCarousel imageUrls={pet.imageUrls} />

      <View style={styles.badgeRow}>
        <CompatibilityBadge score={pet.compatibilityScore} size="large" />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petMeta}>
          {pet.breed} · {capitalizeFirst(pet.age)} · {capitalizeFirst(pet.size)}
        </Text>
      </View>

      {pet.aiSummary ? (
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardLabel}>About</Text>
          <Text style={styles.cardBody}>{pet.aiSummary}</Text>
        </View>
      ) : null}

      {pet.specialNeeds && (
        <View style={[styles.card, shadows.card, styles.specialNeedsCard]}>
          <Text style={styles.cardLabel}>Special Needs</Text>
          <Text style={styles.cardBody}>{pet.specialNeedsDescription}</Text>
        </View>
      )}

      {pet.behaviorTraits.length > 0 && (
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardLabel}>Behavior Traits</Text>
          <View style={styles.traitsRow}>
            {pet.behaviorTraits.map((trait) => (
              <View key={trait} style={styles.traitChip}>
                <Text style={styles.traitText}>{capitalizeFirst(trait)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardLabel}>Ratings</Text>
        <RatingBar label="Activeness" value={pet.energyLevel} />
        <RatingBar label="Sociability" value={pet.sociability} />
        <RatingBar label="Shedding / Messiness" value={pet.sheddingLevel} />
        <RatingBar label="Noise Level" value={pet.barkingLevel} />
        <RatingBar label="Space Requirement" value={pet.spaceRequirement} />
      </View>

      <ExplainabilityCard
        whyMatch={pet.whyMatch}
        potentialChallenges={pet.potentialChallenges}
        loading={aiLoading}
      />

      <View style={styles.ctaContainer}>
        <Button
          title="Confirm Match"
          onPress={() =>
            router.push({
              pathname: '/(main)/match/confirm',
              params: { petId: pet.id },
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.bodyMd,
    color: colors.gray600,
  },
  badgeRow: {
    alignItems: 'center',
    marginTop: -40,
    zIndex: 10,
  },
  infoSection: {
    padding: spacing.screenPadding,
    alignItems: 'center',
  },
  petName: {
    ...typography.displayMd,
  },
  petMeta: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  specialNeedsCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.red,
  },
  cardLabel: {
    ...typography.bodySm,
    color: colors.gray400,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardBody: {
    ...typography.bodyLg,
    color: colors.charcoal,
  },
  traitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  traitChip: {
    backgroundColor: colors.tealLight,
    borderRadius: radii.chip,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  traitText: {
    ...typography.labelSm,
    color: colors.teal,
  },
  ctaContainer: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
  },
});

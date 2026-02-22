import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/ui/Button';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { useActiveMatch } from '../../../hooks/useActiveMatch';
import { usePets } from '../../../hooks/usePets';
import { PetWithCompatibility } from '../../../types';
import { colors, typography, spacing, radii, shadows } from '../../../utils/theme';

export default function MatchConfirmScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { confirmMatch } = useActiveMatch();
  const { fetchPetById } = usePets();
  const [pet, setPet] = useState<PetWithCompatibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (petId) {
      loadPet();
    }
  }, [petId]);

  const loadPet = async () => {
    const data = await fetchPetById(petId!);
    setPet(data);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!petId) return;
    try {
      setConfirming(true);
      const match = await confirmMatch(petId);
      if (match) {
        router.replace({
          pathname: '/(main)/visit/schedule',
          params: { matchId: match.id, petId },
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to confirm match');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <LoadingOverlay visible />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🎉</Text>
          </View>
          <Text style={styles.title}>Confirm your match?</Text>
          {pet && (
            <Text style={styles.subtitle}>
              You and <Text style={styles.bold}>{pet.name}</Text> have a{' '}
              <Text style={styles.bold}>{pet.compatibilityScore}% compatibility</Text>{' '}
              score!
            </Text>
          )}
          <View style={[styles.infoCard, shadows.subtle]}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoItem}>
              📅 You'll schedule an in-person visit
            </Text>
            <Text style={styles.infoItem}>
              🏠 Begin a 3-month foster period
            </Text>
            <Text style={styles.infoItem}>
              📊 Track your bond with daily check-ins
            </Text>
            <Text style={styles.infoItem}>
              🔒 Browsing will be paused during fostering
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Confirm Match"
            onPress={handleConfirm}
            loading={confirming}
          />
          <Button
            title="Go Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.plumLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconEmoji: {
    fontSize: 48,
  },
  title: {
    ...typography.displayMd,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  bold: {
    fontFamily: typography.labelMd.fontFamily,
    color: colors.plum,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    width: '100%',
    gap: spacing.md,
  },
  infoTitle: {
    ...typography.labelMd,
    marginBottom: spacing.xs,
  },
  infoItem: {
    ...typography.bodyMd,
    color: colors.gray600,
  },
  footer: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
});

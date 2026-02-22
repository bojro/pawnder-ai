import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/ui/Button';
import { useActiveMatch } from '../../../hooks/useActiveMatch';
import { colors, typography, spacing, radii, shadows } from '../../../utils/theme';

export default function VisitOutcomeScreen() {
  const { activeMatch, advanceToFoster, cancelMatch } = useActiveMatch();
  const [processing, setProcessing] = useState(false);

  const petName = activeMatch?.pet?.name ?? 'your new companion';

  const handleWentWell = async () => {
    try {
      setProcessing(true);
      await advanceToFoster();
      router.replace('/(main)/foster');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleNotAFit = () => {
    Alert.alert(
      'End this match?',
      `This will cancel your match with ${petName} and return you to browsing.`,
      [
        { text: 'Keep Match', style: 'cancel' },
        {
          text: 'End Match',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessing(true);
              await cancelMatch();
              router.replace('/(main)/swipe');
            } catch {
              Alert.alert('Error', 'Failed to cancel match.');
            } finally {
              setProcessing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🤔</Text>
          </View>

          <Text style={styles.title}>How did your visit go?</Text>
          <Text style={styles.subtitle}>
            You visited <Text style={styles.bold}>{petName}</Text>. Let us know
            how it went so we can decide the next step together.
          </Text>

          <View style={[styles.infoCard, shadows.subtle]}>
            <Text style={styles.infoTitle}>Your options</Text>
            <Text style={styles.infoItem}>
              ✅{'  '}If it went well, you'll begin a 3-month foster period
              with check-ins, training plans, and stability tracking.
            </Text>
            <Text style={styles.infoItem}>
              ❌{'  '}If it wasn't the right fit, that's okay! You'll go back
              to browsing and can match with another pet.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="It went great — start fostering!"
            onPress={handleWentWell}
            loading={processing}
          />
          <Button
            title="Not the right fit"
            variant="ghost"
            onPress={handleNotAFit}
            disabled={processing}
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
    backgroundColor: colors.goldenLight,
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
    lineHeight: 22,
  },
  bold: {
    fontFamily: typography.labelMd.fontFamily,
    color: colors.teal,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    width: '100%',
    gap: spacing.lg,
  },
  infoTitle: {
    ...typography.labelMd,
    marginBottom: spacing.xs,
  },
  infoItem: {
    ...typography.bodyMd,
    color: colors.gray600,
    lineHeight: 22,
  },
  footer: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
});

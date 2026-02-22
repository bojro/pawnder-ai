import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import StabilityScoreRing from '../../../components/StabilityScoreRing';
import MetricCard from '../../../components/MetricCard';
import Button from '../../../components/ui/Button';
import { useActiveMatch } from '../../../hooks/useActiveMatch';
import { useStabilityScore } from '../../../hooks/useStabilityScore';
import { useAppStore } from '../../../store/useAppStore';
import { colors, typography, spacing, radii, shadows } from '../../../utils/theme';
import { formatDaysRemaining, formatScore, getStabilityColor } from '../../../utils/formatters';

export default function FosterDashboard() {
  const { activeMatch, fetchActiveMatch, cancelMatch } = useActiveMatch();
  const { stabilitySummary, fetchStability } = useStabilityScore();

  useEffect(() => {
    fetchActiveMatch();
  }, []);

  useEffect(() => {
    if (activeMatch) {
      fetchStability();
    }
  }, [activeMatch?.id]);

  /* ---------- No active match ---------- */
  if (!activeMatch) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle}>
            <Text style={styles.emptyEmoji}>🏠</Text>
          </View>
          <Text style={styles.emptyTitle}>No Active Foster</Text>
          <Text style={styles.emptySubtitle}>
            Once you confirm a match, your foster{'\n'}dashboard will appear here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------- Visit Pending (status === 'confirmed') ---------- */
  if (activeMatch.status === 'confirmed') {
    const handleEndMatch = () => {
      Alert.alert(
        'Cancel this match?',
        `This will end your match with ${activeMatch.pet.name} and return you to browsing.`,
        [
          { text: 'Keep Match', style: 'cancel' },
          {
            text: 'End Match',
            style: 'destructive',
            onPress: async () => {
              await cancelMatch();
              router.replace('/(main)/swipe');
            },
          },
        ],
      );
    };

    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.pendingContainer}>
          <View style={styles.pendingCircle}>
            <Text style={styles.pendingEmoji}>📅</Text>
          </View>
          <Text style={styles.pendingTitle}>Visit Scheduled</Text>
          <Text style={styles.pendingSubtitle}>
            You're matched with{' '}
            <Text style={styles.bold}>{activeMatch.pet.name}</Text>.{'\n'}
            After your visit, let us know how it went!
          </Text>

          <View style={[styles.pendingCard, shadows.subtle]}>
            <Text style={styles.pendingCardTitle}>Next steps</Text>
            <Text style={styles.pendingCardItem}>
              1. Attend your scheduled visit
            </Text>
            <Text style={styles.pendingCardItem}>
              2. Come back here and tell us how it went
            </Text>
            <Text style={styles.pendingCardItem}>
              3. If it goes well, begin the foster journey!
            </Text>
          </View>

          <View style={styles.pendingActions}>
            <Button
              title="How did it go?"
              onPress={() => router.push('/(main)/foster/visit-outcome')}
            />
            <Button
              title="Cancel Match"
              variant="ghost"
              onPress={handleEndMatch}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------- Active Foster (status === 'in_foster') ---------- */
  const score = stabilitySummary?.stabilityScore ?? activeMatch.stabilityScore;
  const daysText = formatDaysRemaining(activeMatch.stabilizationEndDate);

  const handleEndFoster = () => {
    Alert.alert(
      'End foster?',
      `Are you sure you want to end your foster with ${activeMatch.pet.name}? This will cancel the match and return you to browsing.`,
      [
        { text: 'Keep Fostering', style: 'cancel' },
        {
          text: 'End Foster',
          style: 'destructive',
          onPress: async () => {
            await cancelMatch();
            router.replace('/(main)/swipe');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.petName}>
          Your Journey with {activeMatch.pet.name}
        </Text>
        <Text style={styles.daysText}>{daysText}</Text>

        <View style={[styles.scoreCard, shadows.card]}>
          <StabilityScoreRing score={score} />
        </View>

        <View style={styles.metricsRow}>
          <MetricCard
            label="Bond"
            value={formatScore(stabilitySummary?.bondScore ?? activeMatch.bondScore)}
            color={colors.teal}
          />
          <MetricCard
            label="Incidents"
            value={stabilitySummary?.incidentCount ?? activeMatch.incidentCount}
            color={colors.red}
          />
          <MetricCard
            label="Training"
            value={formatScore(
              stabilitySummary?.trainingAdherencePercent ??
                activeMatch.trainingAdherencePercent
            )}
            color={colors.green}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Daily Check-In"
            onPress={() => router.push('/(main)/foster/daily-checkin')}
          />
          <Button
            title="Weekly Check-In"
            variant="secondary"
            onPress={() => router.push('/(main)/foster/weekly-checkin')}
          />
          <Button
            title="View Training Plan"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/(main)/training',
                params: { matchId: activeMatch.id },
              })
            }
          />
          <Button
            title="End Foster"
            variant="ghost"
            onPress={handleEndFoster}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.screenPadding,
  },
  petName: {
    ...typography.displayMd,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  daysText: {
    ...typography.bodySm,
    color: colors.gray400,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  scoreCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actions: {
    gap: spacing.md,
  },

  /* ---------- Empty state ---------- */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    ...typography.displayMd,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.bodyMd,
    color: colors.gray600,
    textAlign: 'center',
  },

  /* ---------- Visit Pending state ---------- */
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  pendingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.goldenLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pendingEmoji: {
    fontSize: 48,
  },
  pendingTitle: {
    ...typography.displayMd,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pendingSubtitle: {
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
  pendingCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  pendingCardTitle: {
    ...typography.labelMd,
    marginBottom: spacing.xs,
  },
  pendingCardItem: {
    ...typography.bodyMd,
    color: colors.gray600,
    lineHeight: 22,
  },
  pendingActions: {
    width: '100%',
    gap: spacing.md,
  },
});

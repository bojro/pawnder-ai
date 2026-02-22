import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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
  const { activeMatch, fetchActiveMatch } = useActiveMatch();
  const { stabilitySummary, fetchStability } = useStabilityScore();

  useEffect(() => {
    fetchActiveMatch();
  }, []);

  useEffect(() => {
    if (activeMatch) {
      fetchStability();
    }
  }, [activeMatch?.id]);

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

  const score = stabilitySummary?.stabilityScore ?? activeMatch.stabilityScore;
  const daysText = formatDaysRemaining(activeMatch.stabilizationEndDate);

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
            color={colors.plum}
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
    backgroundColor: colors.plumLight,
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
});

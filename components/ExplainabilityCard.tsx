import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii } from '../utils/theme';

interface ExplainabilityCardProps {
  whyMatch: string[];
  potentialChallenges: string[];
  /** When true, show a shimmer placeholder while Gemini is loading */
  loading?: boolean;
}

// ─── Shimmer placeholder ───

function ShimmerBar({ width }: { width: number | string }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.shimmerBar,
        { width: width as any, opacity },
      ]}
    />
  );
}

function ShimmerPlaceholder() {
  return (
    <View style={styles.shimmerContainer}>
      <ShimmerBar width="90%" />
      <ShimmerBar width="75%" />
      <ShimmerBar width="85%" />
    </View>
  );
}

export default function ExplainabilityCard({
  whyMatch,
  potentialChallenges,
  loading = false,
}: ExplainabilityCardProps) {
  const hasWhyMatch = whyMatch.length > 0;
  const hasChallenges = potentialChallenges.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Why you match</Text>
        {loading && (
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={12} color={colors.golden} />
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        )}
      </View>

      {loading && !hasWhyMatch ? (
        <ShimmerPlaceholder />
      ) : hasWhyMatch ? (
        whyMatch.map((item, idx) => (
          <View key={idx} style={[styles.bulletCard, styles.matchBorder]}>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Swipe data will appear here</Text>
      )}

      <Text style={[styles.sectionTitle, styles.challengeTitle]}>
        Potential challenges
      </Text>

      {loading && !hasChallenges ? (
        <ShimmerPlaceholder />
      ) : hasChallenges ? (
        potentialChallenges.map((item, idx) => (
          <View key={idx} style={[styles.bulletCard, styles.challengeBorder]}>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No challenges identified</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.screenPadding,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.displaySm,
    marginBottom: 0,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldenLight,
    borderRadius: radii.chip,
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 3,
  },
  aiBadgeText: {
    ...typography.labelSm,
    color: colors.golden,
    fontSize: 10,
  },
  challengeTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  bulletCard: {
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  matchBorder: {
    borderLeftColor: colors.tealLight,
  },
  challengeBorder: {
    borderLeftColor: colors.gray200,
  },
  bulletText: {
    ...typography.bodyMd,
    color: colors.charcoal,
  },
  emptyText: {
    ...typography.bodySm,
    color: colors.gray400,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  shimmerContainer: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  shimmerBar: {
    height: 48,
    backgroundColor: colors.gray100,
    borderRadius: radii.sm,
  },
});

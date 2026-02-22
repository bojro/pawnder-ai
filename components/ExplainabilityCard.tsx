import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../utils/theme';

interface ExplainabilityCardProps {
  whyMatch: string[];
  potentialChallenges: string[];
}

export default function ExplainabilityCard({
  whyMatch,
  potentialChallenges,
}: ExplainabilityCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Why you match</Text>
      {whyMatch.map((item, idx) => (
        <View key={idx} style={[styles.bulletCard, styles.matchBorder]}>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, styles.challengeTitle]}>
        Potential challenges
      </Text>
      {potentialChallenges.map((item, idx) => (
        <View key={idx} style={[styles.bulletCard, styles.challengeBorder]}>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.screenPadding,
  },
  sectionTitle: {
    ...typography.displaySm,
    marginBottom: spacing.md,
  },
  challengeTitle: {
    marginTop: spacing.xl,
  },
  bulletCard: {
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  matchBorder: {
    borderLeftColor: colors.plumLight,
  },
  challengeBorder: {
    borderLeftColor: colors.gray200,
  },
  bulletText: {
    ...typography.bodyMd,
    color: colors.charcoal,
  },
});

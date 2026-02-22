import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { useMockMode } from '../../hooks/useMockMode';
import { clearAll } from '../../utils/storage';
import { capitalizeFirst } from '../../utils/formatters';
import { colors, typography, spacing, radii, shadows } from '../../utils/theme';

export default function ProfileScreen() {
  const adopter = useAppStore((s) => s.adopter);
  const reset = useAppStore((s) => s.reset);
  const { mockMode, toggleMockMode } = useMockMode();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure? Your data will be cleared.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          reset();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>About You</Text>
          {adopter && (
            <>
              <InfoRow
                icon="location-outline"
                label="Location"
                value={`${adopter.zipCode} (${adopter.searchRadius}mi radius)`}
              />
              <InfoRow
                icon="home-outline"
                label="Housing"
                value={capitalizeFirst(adopter.housingType)}
              />
              <InfoRow
                icon="time-outline"
                label="Hours Away"
                value={`${adopter.hoursAwayPerDay}h/day`}
              />
              <InfoRow
                icon="fitness-outline"
                label="Activity Level"
                value={`${adopter.activityLevel}/5`}
              />
              <InfoRow
                icon="school-outline"
                label="Experience"
                value={capitalizeFirst(adopter.experienceLevel)}
              />
              <InfoRow
                icon="people-outline"
                label="Kids"
                value={adopter.hasKids ? 'Yes' : 'No'}
              />
              <InfoRow
                icon="paw-outline"
                label="Other Pets"
                value={adopter.hasExistingPets ? 'Yes' : 'No'}
              />
            </>
          )}
        </View>

        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>Developer</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Mock Mode</Text>
              <Text style={styles.settingHint}>
                Uses local data instead of API calls
              </Text>
            </View>
            <ToggleSwitch value={mockMode} onToggle={toggleMockMode} />
          </View>
        </View>

        <Button title="Log Out" variant="secondary" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={colors.gray400} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
  },
  title: {
    ...typography.displayMd,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.labelMd,
    color: colors.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  infoLabel: {
    ...typography.bodyMd,
    color: colors.gray600,
    flex: 1,
  },
  infoValue: {
    ...typography.labelMd,
    color: colors.charcoal,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.labelMd,
    color: colors.charcoal,
  },
  settingHint: {
    ...typography.bodySm,
    color: colors.gray400,
    marginTop: 2,
  },
});

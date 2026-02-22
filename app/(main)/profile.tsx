import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { useMockMode } from '../../hooks/useMockMode';
import { useAuth } from '../../hooks/useAuth';
import { clearAll } from '../../utils/storage';
import { capitalizeFirst } from '../../utils/formatters';
import { colors, typography, spacing, radii, shadows } from '../../utils/theme';

function formatHousingType(type: string): string {
  switch (type) {
    case 'unhoused': return 'Unhoused';
    case 'apartment': return 'Apartment';
    case 'house_small': return 'Small House';
    case 'house_medium': return 'Medium House';
    case 'house_large': return 'Large House';
    default: return capitalizeFirst(type);
  }
}

export default function ProfileScreen() {
  const adopter = useAppStore((s) => s.adopter);
  const updateOnboardingDraft = useAppStore((s) => s.updateOnboardingDraft);
  const { mockMode, toggleMockMode } = useMockMode();
  const { logout } = useAuth();

  const handleEditProfile = () => {
    if (!adopter) return;
    // Pre-fill onboarding draft with current adopter data
    updateOnboardingDraft({
      name: adopter.name,
      age: adopter.age,
      phone: adopter.phone,
      email: adopter.email,
      zipCode: adopter.zipCode,
      searchRadius: adopter.searchRadius,
      housingType: adopter.housingType,
      environment: adopter.environment,
      householdSize: adopter.householdSize,
      kidsCount: adopter.kidsCount,
      kidsAges: adopter.kidsAges,
      hoursAwayPerDay: adopter.hoursAwayPerDay,
      activityHoursPerWeek: adopter.activityHoursPerWeek,
      experienceLevel: adopter.experienceLevel,
      existingPetTypes: adopter.existingPetTypes,
      allergies: adopter.allergies,
      willingGroupClasses: adopter.willingGroupClasses,
      willingPrivateTrainer: adopter.willingPrivateTrainer,
      willingDailyExercises: adopter.willingDailyExercises,
      trainingHoursPerWeek: adopter.trainingHoursPerWeek,
      barkingTolerance: adopter.barkingTolerance,
      sheddingTolerance: adopter.sheddingTolerance,
      trainingCommitment: adopter.trainingCommitment,
      specialNeedsWilling: adopter.specialNeedsWilling,
      narrative1: adopter.narrative1,
      narrative2: adopter.narrative2,
    });
    router.push('/(onboarding)');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {/* Personal Info */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>Personal Info</Text>
          {adopter && (
            <>
              <InfoRow
                icon="person-outline"
                label="Name"
                value={adopter.name || '—'}
              />
              <InfoRow
                icon="calendar-outline"
                label="Age"
                value={adopter.age ? `${adopter.age} yrs` : '—'}
              />
              <InfoRow
                icon="call-outline"
                label="Phone"
                value={adopter.phone || '—'}
              />
              <InfoRow
                icon="mail-outline"
                label="Email"
                value={adopter.email || '—'}
              />
            </>
          )}
        </View>

        {/* Living Situation */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>Living Situation</Text>
          {adopter && (
            <>
              <InfoRow
                icon="location-outline"
                label="Location"
                value={`${adopter.zipCode} (${adopter.searchRadius}mi)`}
              />
              <InfoRow
                icon="home-outline"
                label="Housing"
                value={formatHousingType(adopter.housingType)}
              />
              <InfoRow
                icon="map-outline"
                label="Environment"
                value={capitalizeFirst(adopter.environment || '—')}
              />
              <InfoRow
                icon="people-outline"
                label="Household"
                value={`${adopter.householdSize} people, ${adopter.kidsCount} kids`}
              />
            </>
          )}
        </View>

        {/* Lifestyle & Experience */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>Lifestyle & Experience</Text>
          {adopter && (
            <>
              <InfoRow
                icon="time-outline"
                label="Hours Away"
                value={`${adopter.hoursAwayPerDay}h/day`}
              />
              <InfoRow
                icon="fitness-outline"
                label="Activity"
                value={`${adopter.activityHoursPerWeek}h/week`}
              />
              <InfoRow
                icon="school-outline"
                label="Experience"
                value={capitalizeFirst(adopter.experienceLevel)}
              />
              <InfoRow
                icon="paw-outline"
                label="Current Pets"
                value={
                  adopter.existingPetTypes.length > 0
                    ? adopter.existingPetTypes.map(capitalizeFirst).join(', ')
                    : 'None'
                }
              />
              <InfoRow
                icon="medkit-outline"
                label="Allergies"
                value={adopter.allergies || 'None'}
              />
            </>
          )}
        </View>

        {/* Training */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>Training Willingness</Text>
          {adopter && (
            <>
              <InfoRow
                icon="people-circle-outline"
                label="Group Classes"
                value={adopter.willingGroupClasses ? 'Yes' : 'No'}
              />
              <InfoRow
                icon="person-circle-outline"
                label="Private Trainer"
                value={adopter.willingPrivateTrainer ? 'Yes' : 'No'}
              />
              <InfoRow
                icon="barbell-outline"
                label="Daily Exercises"
                value={adopter.willingDailyExercises ? 'Yes' : 'No'}
              />
              <InfoRow
                icon="timer-outline"
                label="Training Time"
                value={`${adopter.trainingHoursPerWeek}h/week`}
              />
            </>
          )}
        </View>

        {/* Developer */}
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

        <Button title="Edit Profile" variant="ghost" onPress={handleEditProfile} />
        <View style={{ height: spacing.sm }} />
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
    maxWidth: '50%',
    textAlign: 'right',
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

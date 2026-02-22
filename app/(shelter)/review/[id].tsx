import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/shelter/StatusBadge';
import AvailabilityGrid from '../../../components/shelter/AvailabilityGrid';
import { useShelterStore, computeCompletion } from '../../../store/useShelterStore';
import { ShelterPet, PetStatus } from '../../../types/shelter';
import {
  SPECIES_OPTIONS,
  SEX_OPTIONS,
  SIZE_CATEGORY_OPTIONS,
  INTAKE_SOURCE_OPTIONS,
  ADOPTION_STATUS_OPTIONS,
  VAX_STATUS_OPTIONS,
  SPAY_NEUTER_OPTIONS,
  GROOMING_NEED_OPTIONS,
  MOBILITY_LIMIT_OPTIONS,
  TRAINING_LEVEL_OPTIONS,
  HOUSING_FIT_OPTIONS,
  YARD_REQUIREMENT_OPTIONS,
  TRAINING_FOCUS_OPTIONS,
  TRAINING_URGENCY_OPTIONS,
  TRAINING_FORMAT_OPTIONS,
  KNOWN_TRIGGER_OPTIONS,
  MANAGEMENT_TOOL_OPTIONS,
  STRENGTH_OPTIONS,
  CHALLENGE_OPTIONS,
  ASSESSOR_ROLE_OPTIONS,
  ASSESSMENT_METHOD_OPTIONS,
} from '../../../utils/shelterConstants';
import { colors, typography, spacing, radii, shadows } from '../../../utils/theme';

// Helper to look up label from option arrays
function getLabel(options: { label: string; value: string }[], value: string | null): string {
  if (!value) return '—';
  return options.find(o => o.value === value)?.label || value;
}

function getLabels(options: { label: string; value: string }[], values: string[]): string {
  if (values.length === 0) return '—';
  return values.map(v => options.find(o => o.value === v)?.label || v).join(', ');
}

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { shelterPets, updatePetStatus, editPet } = useShelterStore();
  const [pet, setPet] = useState<ShelterPet | null>(null);

  useEffect(() => {
    const found = shelterPets.find(p => p.id === id);
    if (found) setPet(found);
  }, [id, shelterPets]);

  if (!pet) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Pet not found.</Text>
          <Button title="Back to Dashboard" onPress={() => router.replace('/(shelter)/dashboard')} />
        </View>
      </SafeAreaView>
    );
  }

  const handleStatusChange = async (newStatus: PetStatus) => {
    await updatePetStatus(pet.id, newStatus);
    Alert.alert('Updated', `Pet status changed to ${newStatus}.`);
  };

  const handleEditSection = (step: number) => {
    editPet(pet.id);
    const stepRoutes = [
      '/(shelter)/(intake)/basic-profile',
      '/(shelter)/(intake)/health',
      '/(shelter)/(intake)/temperament-social',
      '/(shelter)/(intake)/temperament-behavior',
      '/(shelter)/(intake)/daily-needs',
      '/(shelter)/(intake)/environment',
      '/(shelter)/(intake)/training-plan',
      '/(shelter)/(intake)/observations',
      '/(shelter)/(intake)/availability',
      '/(shelter)/(intake)/media',
    ] as const;
    router.push(stepRoutes[step] as any);
  };

  const ratingLabel = (value: number) => `${value}/5`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Cover Photo */}
        {pet.photoUris.length > 0 && (
          <Image
            source={{ uri: pet.photoUris[pet.coverPhotoIndex] || pet.photoUris[0] }}
            style={styles.coverImage}
          />
        )}

        {/* Pet Name & Status */}
        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.petName}>{pet.name || 'Unnamed Pet'}</Text>
            <Text style={styles.petMeta}>
              {getLabel(SPECIES_OPTIONS, pet.species)} · {pet.breed || 'Unknown breed'}
            </Text>
          </View>
          <StatusBadge status={pet.status} />
        </View>

        {/* Completion */}
        <View style={styles.completionRow}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${pet.completionPercent}%` }]} />
          </View>
          <Text style={styles.completionText}>{pet.completionPercent}% complete</Text>
        </View>

        {/* Section 1: Basic Profile */}
        <SectionCard title="Basic Profile" stepIndex={0} onEdit={handleEditSection}>
          <InfoRow label="Sex" value={getLabel(SEX_OPTIONS, pet.sex)} />
          <InfoRow label="Age" value={`${pet.ageYears}y ${pet.ageMonths}m (${pet.ageConfidence})`} />
          <InfoRow label="Weight" value={pet.weightLbs > 0 ? `${pet.weightLbs} lbs` : '—'} />
          <InfoRow label="Size" value={getLabel(SIZE_CATEGORY_OPTIONS, pet.sizeCategory)} />
          <InfoRow label="Intake Date" value={pet.intakeDate || '—'} />
          <InfoRow label="Intake Source" value={getLabel(INTAKE_SOURCE_OPTIONS, pet.intakeSource)} />
          <InfoRow label="Fee" value={pet.adoptionFee > 0 ? `$${pet.adoptionFee}` : '—'} />
          <InfoRow label="Status" value={getLabel(ADOPTION_STATUS_OPTIONS, pet.adoptionStatus)} />
        </SectionCard>

        {/* Section 2: Health & Care */}
        <SectionCard title="Health & Care" stepIndex={1} onEdit={handleEditSection}>
          <InfoRow label="Vaccines" value={getLabel(VAX_STATUS_OPTIONS, pet.vaccineStatus)} />
          <InfoRow label="Microchipped" value={pet.microchipped ? 'Yes' : 'No'} />
          <InfoRow label="Spay/Neuter" value={getLabel(SPAY_NEUTER_OPTIONS, pet.spayNeuterStatus)} />
          <InfoRow label="Meds Needed" value={pet.medsNeeded ? `Yes — ${pet.medsFrequency}` : 'No'} />
          <InfoRow label="Special Diet" value={pet.specialDiet ? `Yes — ${pet.specialDietType}` : 'No'} />
          <InfoRow label="Conditions" value={pet.knownConditions.length > 0 ? pet.knownConditions.map(c => `${c.name} (${c.severity})`).join(', ') : '—'} />
          <InfoRow label="Grooming" value={getLabel(GROOMING_NEED_OPTIONS, pet.groomingNeed)} />
          <InfoRow label="Mobility" value={getLabel(MOBILITY_LIMIT_OPTIONS, pet.mobilityLimit)} />
          <InfoRow label="Allergies" value={pet.petAllergies || '—'} />
        </SectionCard>

        {/* Section 3: Temperament — Social */}
        <SectionCard title="Temperament — Social" stepIndex={2} onEdit={handleEditSection}>
          <InfoRow label="Adults" value={ratingLabel(pet.friendlinessAdults)} />
          <InfoRow label="Kids" value={ratingLabel(pet.friendlinessKids)} />
          <InfoRow label="Dogs" value={ratingLabel(pet.friendlinessDogs)} />
          <InfoRow label="Cats" value={ratingLabel(pet.friendlinessCats)} />
          <InfoRow label="Confidence" value={ratingLabel(pet.confidenceLevel)} />
          <InfoRow label="Touch Sensitivity" value={ratingLabel(pet.touchSensitivity)} />
        </SectionCard>

        {/* Section 4: Temperament — Behavior */}
        <SectionCard title="Temperament — Behavior" stepIndex={3} onEdit={handleEditSection}>
          <InfoRow label="Startle Response" value={ratingLabel(pet.startleResponse)} />
          <InfoRow label="Vocalization" value={ratingLabel(pet.vocalizationLevel)} />
          <InfoRow label="Prey Drive" value={ratingLabel(pet.preyDrive)} />
          <InfoRow label="Resource Guarding" value={ratingLabel(pet.resourceGuardingRisk)} />
          <InfoRow label="Separation Anxiety" value={ratingLabel(pet.separationAnxietyRisk)} />
          <InfoRow label="Leash Reactivity" value={ratingLabel(pet.leashReactivity)} />
        </SectionCard>

        {/* Section 5: Daily Needs */}
        <SectionCard title="Daily Needs" stepIndex={4} onEdit={handleEditSection}>
          <InfoRow label="Energy" value={ratingLabel(pet.energyLevel)} />
          <InfoRow label="Exercise" value={`${pet.exerciseMinPerDay} min/day`} />
          <InfoRow label="Enrichment" value={`${pet.enrichmentMinPerDay} min/day`} />
          <InfoRow label="Potty Breaks" value={`${pet.pottyBreaksPerDay}/day`} />
          <InfoRow label="Alone Time" value={`${pet.aloneTimeTolerance} hrs`} />
          <InfoRow label="House Training" value={getLabel(TRAINING_LEVEL_OPTIONS, pet.houseTraining)} />
          <InfoRow label="Leash Training" value={getLabel(TRAINING_LEVEL_OPTIONS, pet.leashTraining)} />
          <InfoRow label="Crate Training" value={getLabel(TRAINING_LEVEL_OPTIONS, pet.crateTraining)} />
          <InfoRow label="Destructive Risk" value={ratingLabel(pet.destructiveRisk)} />
          <InfoRow label="Escape Risk" value={ratingLabel(pet.escapeRisk)} />
          <InfoRow label="Shedding" value={ratingLabel(pet.sheddingLevel)} />
          <InfoRow label="Barking" value={ratingLabel(pet.barkingLevel)} />
        </SectionCard>

        {/* Section 6: Environment Fit */}
        <SectionCard title="Environment Fit" stepIndex={5} onEdit={handleEditSection}>
          <InfoRow label="Housing Types" value={getLabels(HOUSING_FIT_OPTIONS, pet.bestHousingTypes)} />
          <InfoRow label="Yard Req." value={getLabel(YARD_REQUIREMENT_OPTIONS, pet.yardRequirement)} />
          <InfoRow label="Stairs OK" value={pet.stairsOk ? 'Yes' : 'No'} />
          <InfoRow label="Noise Tolerance" value={ratingLabel(pet.noiseTolerance)} />
          <InfoRow label="Single Pet Only" value={pet.singlePetOnly ? 'Yes' : 'No'} />
          <InfoRow label="Kids OK" value={pet.compatibleWithKids ? `Yes (min age ${pet.minimumKidAge})` : 'No'} />
          <InfoRow label="Experienced Owner" value={pet.needsExperiencedOwner ? 'Required' : 'Not required'} />
        </SectionCard>

        {/* Section 7: Training Plan */}
        <SectionCard title="Training Plan" stepIndex={6} onEdit={handleEditSection}>
          <InfoRow label="Focus Areas" value={getLabels(TRAINING_FOCUS_OPTIONS, pet.trainingFocusAreas)} />
          <InfoRow label="Urgency" value={getLabel(TRAINING_URGENCY_OPTIONS, pet.trainingUrgency)} />
          <InfoRow label="First Month" value={`${pet.estTrainingHoursFirstMonth} hrs`} />
          <InfoRow label="Ongoing" value={`${pet.estTrainingHoursOngoingWeekly} hrs/week`} />
          <InfoRow label="Format" value={getLabels(TRAINING_FORMAT_OPTIONS, pet.recommendedFormat)} />
          <InfoRow label="Triggers" value={getLabels(KNOWN_TRIGGER_OPTIONS, pet.knownTriggers)} />
          <InfoRow label="Tools" value={getLabels(MANAGEMENT_TOOL_OPTIONS, pet.managementTools)} />
        </SectionCard>

        {/* Section 8: Observations */}
        <SectionCard title="Observations & Narrative" stepIndex={7} onEdit={handleEditSection}>
          <InfoRow label="Strengths" value={getLabels(STRENGTH_OPTIONS, pet.topStrengths)} />
          <InfoRow label="Challenges" value={getLabels(CHALLENGE_OPTIONS, pet.topChallenges)} />
          <InfoRow label="Blurb" value={pet.oneLineBlurb || '—'} />
          {pet.structuredNotes ? <LongText label="Notes" text={pet.structuredNotes} /> : null}
          {pet.idealAdopterNotes ? <LongText label="Ideal Adopter" text={pet.idealAdopterNotes} /> : null}
        </SectionCard>

        {/* Section 9: Visit Availability */}
        <SectionCard title="Visit Availability" stepIndex={8} onEdit={handleEditSection}>
          {pet.availabilityGrid && Object.keys(pet.availabilityGrid).length > 0 ? (
            <AvailabilityGrid grid={pet.availabilityGrid} onChange={() => {}} readOnly />
          ) : (
            <Text style={sectionStyles.infoLabel}>No availability set</Text>
          )}
        </SectionCard>

        {/* Section 10: Assessment */}
        <SectionCard title="Media & Assessment" stepIndex={9} onEdit={handleEditSection}>
          <InfoRow label="Photos" value={`${pet.photoUris.length} uploaded`} />
          <InfoRow label="Assessor" value={getLabel(ASSESSOR_ROLE_OPTIONS, pet.assessorRole)} />
          <InfoRow label="Method" value={getLabel(ASSESSMENT_METHOD_OPTIONS, pet.assessmentMethod)} />
          <InfoRow label="Observation Hrs" value={pet.observationHours > 0 ? `${pet.observationHours}` : '—'} />
          <InfoRow label="Confidence" value={ratingLabel(pet.overallConfidence)} />
        </SectionCard>

        {/* Status Actions */}
        <View style={styles.statusSection}>
          <Text style={styles.statusSectionTitle}>Publish Status</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[styles.statusBtn, pet.status === 'draft' && styles.statusBtnActive]}
              onPress={() => handleStatusChange('draft')}
            >
              <Text style={[styles.statusBtnText, pet.status === 'draft' && styles.statusBtnTextActive]}>
                Draft
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusBtn, pet.status === 'ready' && styles.statusBtnActiveGold]}
              onPress={() => handleStatusChange('ready')}
            >
              <Text style={[styles.statusBtnText, pet.status === 'ready' && styles.statusBtnTextActiveGold]}>
                Mark Ready
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusBtn, pet.status === 'published' && styles.statusBtnActiveGreen]}
              onPress={() => handleStatusChange('published')}
            >
              <Text style={[styles.statusBtnText, pet.status === 'published' && styles.statusBtnTextActiveGreen]}>
                Publish
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───

function SectionCard({
  title,
  stepIndex,
  onEdit,
  children,
}: {
  title: string;
  stepIndex: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <View style={[sectionStyles.card, shadows.card]}>
      <View style={sectionStyles.cardHeader}>
        <Text style={sectionStyles.cardTitle}>{title}</Text>
        <TouchableOpacity onPress={() => onEdit(stepIndex)} style={sectionStyles.editBtn}>
          <Ionicons name="create-outline" size={16} color={colors.teal} />
          <Text style={sectionStyles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={sectionStyles.infoRow}>
      <Text style={sectionStyles.infoLabel}>{label}</Text>
      <Text style={sectionStyles.infoValue}>{value}</Text>
    </View>
  );
}

function LongText({ label, text }: { label: string; text: string }) {
  return (
    <View style={sectionStyles.longTextContainer}>
      <Text style={sectionStyles.infoLabel}>{label}</Text>
      <Text style={sectionStyles.longText}>{text}</Text>
    </View>
  );
}

// ─── Styles ───

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
    gap: spacing.lg,
  },
  errorText: {
    ...typography.bodyLg,
    color: colors.gray600,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  backBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.displaySm,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: radii.card,
    marginBottom: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  petName: {
    ...typography.displayMd,
  },
  petMeta: {
    ...typography.bodySm,
    color: colors.gray600,
    marginTop: 2,
  },
  completionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.teal,
    borderRadius: 4,
  },
  completionText: {
    ...typography.labelSm,
    color: colors.teal,
  },
  statusSection: {
    marginTop: spacing.lg,
    padding: spacing.cardPadding,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    ...shadows.card,
  },
  statusSectionTitle: {
    ...typography.labelMd,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.chip,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    alignItems: 'center',
  },
  statusBtnActive: {
    backgroundColor: colors.gray200,
    borderColor: colors.gray400,
  },
  statusBtnActiveGold: {
    backgroundColor: colors.goldenLight,
    borderColor: colors.golden,
  },
  statusBtnActiveGreen: {
    backgroundColor: '#DCFCE7',
    borderColor: colors.green,
  },
  statusBtnText: {
    ...typography.labelSm,
    color: colors.gray600,
  },
  statusBtnTextActive: {
    color: colors.charcoal,
  },
  statusBtnTextActiveGold: {
    color: '#8B6914',
  },
  statusBtnTextActiveGreen: {
    color: colors.green,
  },
  bottomPadding: {
    height: spacing.xxxl,
  },
});

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  cardTitle: {
    ...typography.labelMd,
    color: colors.charcoal,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    ...typography.labelSm,
    color: colors.teal,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  infoLabel: {
    ...typography.bodySm,
    color: colors.gray600,
    flex: 1,
  },
  infoValue: {
    ...typography.bodyMd,
    color: colors.charcoal,
    flex: 1.5,
    textAlign: 'right',
  },
  longTextContainer: {
    paddingVertical: spacing.sm,
  },
  longText: {
    ...typography.bodyMd,
    color: colors.charcoal,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});

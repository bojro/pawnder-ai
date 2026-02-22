import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '../../../components/ui/Slider';
import TextInput from '../../../components/ui/TextInput';
import SelectionChip from '../../../components/ui/SelectionChip';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import { checkinService } from '../../../services/checkinService';
import { useAppStore } from '../../../store/useAppStore';
import { colors, typography, spacing } from '../../../utils/theme';

export default function WeeklyCheckInScreen() {
  const { activeMatch, adopterId } = useAppStore();
  const [incidentCount, setIncidentCount] = useState(0);
  const [ownerStress, setOwnerStress] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [trainingAdherence, setTrainingAdherence] = useState(80);
  const [exerciseAdequacy, setExerciseAdequacy] = useState<boolean | null>(null);
  const [bond, setBond] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!activeMatch?.id || !adopterId || exerciseAdequacy === null) return;
    try {
      setSubmitting(true);
      await checkinService.submitWeeklyCheckIn(activeMatch.id, adopterId, {
        incidentCount,
        ownerStress,
        trainingAdherencePercent: trainingAdherence,
        exerciseAdequacy,
        bond,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Weekly Check-In Saved', 'Great job keeping track!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to submit weekly check-in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Weekly Check-In</Text>
        <Text style={styles.subtitle}>
          Reflect on your week with {activeMatch?.pet.name || 'your pet'}.
        </Text>

        <View style={styles.section}>
          <TextInput
            label="Number of incidents this week"
            placeholder="0"
            value={incidentCount.toString()}
            onChangeText={(text) => setIncidentCount(parseInt(text) || 0)}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.section}>
          <Slider
            label="Your stress level"
            value={ownerStress}
            min={1}
            max={5}
            labels={['Low', '', 'Med', '', 'High']}
            onValueChange={(val) => setOwnerStress(val as 1 | 2 | 3 | 4 | 5)}
          />
        </View>

        <View style={styles.section}>
          <Slider
            label={`Training adherence: ${trainingAdherence}%`}
            value={Math.round(trainingAdherence / 20)}
            min={1}
            max={5}
            labels={['20%', '40%', '60%', '80%', '100%']}
            onValueChange={(val) => setTrainingAdherence(val * 20)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.questionLabel}>Was exercise adequate?</Text>
          <View style={styles.row}>
            <SelectionChip
              label="Yes"
              selected={exerciseAdequacy === true}
              onPress={() => setExerciseAdequacy(true)}
              style={styles.flex}
            />
            <SelectionChip
              label="No"
              selected={exerciseAdequacy === false}
              onPress={() => setExerciseAdequacy(false)}
              style={styles.flex}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Slider
            label="Bond strength"
            value={bond}
            min={1}
            max={5}
            labels={['Weak', '', 'Growing', '', 'Strong']}
            onValueChange={(val) => setBond(val as 1 | 2 | 3 | 4 | 5)}
          />
        </View>

        <View style={styles.section}>
          <TextArea
            label="Weekly notes (optional)"
            placeholder="Share highlights or concerns from this week..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Submit Weekly Check-In"
          onPress={handleSubmit}
          disabled={exerciseAdequacy === null}
          loading={submitting}
        />
      </View>
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
    paddingBottom: 40,
  },
  title: {
    ...typography.displayMd,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  questionLabel: {
    ...typography.labelMd,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  footer: {
    padding: spacing.screenPadding,
  },
});

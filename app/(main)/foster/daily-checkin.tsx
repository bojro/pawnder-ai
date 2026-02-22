import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckInOption from '../../../components/CheckInOption';
import SelectionChip from '../../../components/ui/SelectionChip';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import { checkinService } from '../../../services/checkinService';
import { useAppStore } from '../../../store/useAppStore';
import { DAY_RATING_OPTIONS } from '../../../utils/constants';
import { DayRating } from '../../../types';
import { colors, typography, spacing } from '../../../utils/theme';

export default function DailyCheckInScreen() {
  const { activeMatch, adopterId } = useAppStore();
  const [dayRating, setDayRating] = useState<DayRating | null>(null);
  const [stressSignals, setStressSignals] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!activeMatch?.id || !adopterId || !dayRating || stressSignals === null) return;
    try {
      setSubmitting(true);
      await checkinService.submitDailyCheckIn(activeMatch.id, adopterId, {
        dayRating,
        stressSignals,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Check-In Saved', 'Thanks for updating us!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to submit check-in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Daily Check-In</Text>
        <Text style={styles.subtitle}>How was today with {activeMatch?.pet.name || 'your pet'}?</Text>

        <View style={styles.section}>
          <Text style={styles.questionLabel}>How would you rate today?</Text>
          <CheckInOption
            options={DAY_RATING_OPTIONS}
            selectedValue={dayRating}
            onSelect={(val) => setDayRating(val as DayRating)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.questionLabel}>
            Did you notice any stress signals?
          </Text>
          <View style={styles.row}>
            <SelectionChip
              label="Yes"
              selected={stressSignals === true}
              onPress={() => setStressSignals(true)}
              style={styles.yesNo}
            />
            <SelectionChip
              label="No"
              selected={stressSignals === false}
              onPress={() => setStressSignals(false)}
              style={styles.yesNo}
            />
          </View>
        </View>

        <View style={styles.section}>
          <TextArea
            label="Any notes? (optional)"
            placeholder="Share anything notable about today..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Submit Check-In"
          onPress={handleSubmit}
          disabled={!dayRating || stressSignals === null}
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
    marginBottom: spacing.xl,
  },
  questionLabel: {
    ...typography.labelMd,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  yesNo: {
    flex: 1,
  },
  footer: {
    padding: spacing.screenPadding,
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/ui/Button';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { visitService } from '../../../services/visitService';
import { VisitSlot } from '../../../types';
import { colors, typography, spacing, radii, shadows } from '../../../utils/theme';

export default function VisitScheduleScreen() {
  const { matchId, petId } = useLocalSearchParams<{
    matchId: string;
    petId: string;
  }>();
  const [slots, setSlots] = useState<VisitSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const data = await visitService.getAvailableSlots(petId || '');
      setSlots(data);
    } catch {
      Alert.alert('Error', 'Failed to load visit slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!matchId || !selectedSlot) return;
    try {
      setBooking(true);
      await visitService.scheduleVisit(matchId, selectedSlot);
      Alert.alert(
        'Visit Scheduled!',
        "You're all set. Head to the Foster tab to track your journey.",
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(main)/foster'),
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to schedule visit');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingOverlay visible />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pick a visit time</Text>
        <Text style={styles.subtitle}>
          Meet your potential companion in person.
        </Text>

        <View style={styles.slotList}>
          {slots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              onPress={() => setSelectedSlot(slot.id)}
              activeOpacity={0.7}
              style={[
                styles.slotCard,
                shadows.subtle,
                selectedSlot === slot.id && styles.slotSelected,
              ]}
            >
              <Text style={styles.slotDate}>{slot.date}</Text>
              <Text style={styles.slotTime}>
                {slot.startTime} - {slot.endTime}
              </Text>
              {selectedSlot === slot.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Confirm Visit"
          onPress={handleBook}
          disabled={!selectedSlot}
          loading={booking}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
  },
  title: {
    ...typography.displayMd,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginBottom: spacing.xl,
  },
  slotList: {
    gap: spacing.md,
  },
  slotCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  slotSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealLight,
  },
  slotDate: {
    ...typography.labelMd,
    flex: 1,
  },
  slotTime: {
    ...typography.bodyMd,
    color: colors.gray600,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: spacing.screenPadding,
  },
});

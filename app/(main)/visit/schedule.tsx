import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/ui/Button';
import LoadingOverlay from '../../../components/LoadingOverlay';
import AvailabilityGrid, {
  parseCellKey,
  formatHour,
} from '../../../components/shelter/AvailabilityGrid';
import { visitService } from '../../../services/visitService';
import { AVAILABILITY_DAYS } from '../../../utils/shelterConstants';
import { colors, typography, spacing, radii, shadows } from '../../../utils/theme';

/** Map day abbreviation to JS day-of-week (0=Sun … 6=Sat) */
const DAY_TO_DOW: Record<string, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
};

/** Full day name for display */
const DAY_FULL_NAMES: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
};

/**
 * Given a cell key like "wed-14", compute the next concrete date
 * that falls on that weekday and build a human-readable summary.
 */
function buildSlotSummary(key: string): {
  label: string;
  slotId: string;
  scheduledDate: string;
  scheduledTime: string;
} | null {
  const parsed = parseCellKey(key);
  if (!parsed) return null;

  const { day, hour } = parsed;
  const dow = DAY_TO_DOW[day];
  if (dow === undefined) return null;

  // Find the next occurrence of this weekday
  const today = new Date();
  let offset = dow - today.getDay();
  if (offset <= 0) offset += 7; // always look forward
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + offset);

  const dateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const dateLabel = `${DAY_FULL_NAMES[day]}, ${monthNames[targetDate.getMonth()]} ${targetDate.getDate()}`;

  const startLabel = formatHour(hour);
  const endLabel = formatHour(hour + 1);

  return {
    label: `${dateLabel}  ·  ${startLabel} – ${endLabel}  (1 hr)`,
    slotId: `${dateStr}-${hour.toString().padStart(2, '0')}`,
    scheduledDate: dateStr,
    scheduledTime: `${hour.toString().padStart(2, '0')}:00`,
  };
}

export default function VisitScheduleScreen() {
  const { matchId, petId } = useLocalSearchParams<{
    matchId: string;
    petId: string;
  }>();
  const [availabilityGrid, setAvailabilityGrid] = useState<Record<string, boolean>>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadGrid();
  }, []);

  const loadGrid = async () => {
    try {
      const grid = await visitService.getAvailabilityGrid(petId || '');
      setAvailabilityGrid(grid);
    } catch {
      Alert.alert('Error', 'Failed to load pet availability');
    } finally {
      setLoading(false);
    }
  };

  const summary = selectedCell ? buildSlotSummary(selectedCell) : null;

  const handleBook = async () => {
    if (!matchId || !summary) return;
    try {
      setBooking(true);
      await visitService.scheduleVisit(matchId, summary.slotId);
      Alert.alert(
        'Visit Scheduled!',
        "You're all set. Head to the Foster tab to track your journey.",
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(main)/foster'),
          },
        ],
      );
    } catch {
      Alert.alert('Error', 'Failed to schedule visit');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingOverlay visible />;

  const hasAvailability = Object.keys(availabilityGrid).length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pick a visit time</Text>
        <Text style={styles.subtitle}>
          Select an available time slot to meet your potential companion.
        </Text>

        {hasAvailability ? (
          <AvailabilityGrid
            grid={{}}
            onChange={() => {}}
            availableSlots={availabilityGrid}
            selectedCell={selectedCell}
            onSelectCell={setSelectedCell}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No availability has been set for this pet yet. Please check back later.
            </Text>
          </View>
        )}

        {/* Selection summary */}
        {summary && (
          <View style={[styles.summaryCard, shadows.subtle]}>
            <Text style={styles.summaryLabel}>Your selected visit</Text>
            <Text style={styles.summaryTime}>{summary.label}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Confirm Visit"
          onPress={handleBook}
          disabled={!selectedCell}
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
  emptyContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.gray400,
    textAlign: 'center',
  },
  summaryCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  summaryLabel: {
    ...typography.labelSm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  summaryTime: {
    ...typography.labelMd,
    color: colors.teal,
  },
  footer: {
    padding: spacing.screenPadding,
  },
});

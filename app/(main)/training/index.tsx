import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TrainingTaskRow from '../../../components/TrainingTaskRow';
import Button from '../../../components/ui/Button';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { trainingService } from '../../../services/trainingService';
import { useAppStore } from '../../../store/useAppStore';
import { TrainingPlan, TrainingWeek } from '../../../types';
import { colors, typography, spacing, radii, shadows } from '../../../utils/theme';
import { formatScore } from '../../../utils/formatters';

export default function TrainingPlanScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const activeMatch = useAppStore((s) => s.activeMatch);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));

  const resolvedMatchId = matchId || activeMatch?.id;

  useEffect(() => {
    if (resolvedMatchId) {
      loadPlan();
    }
  }, [resolvedMatchId]);

  const loadPlan = async () => {
    try {
      const data = await trainingService.getTrainingPlan(resolvedMatchId!);
      setPlan(data);
    } catch {
      console.error('Failed to load training plan');
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNumber)) {
        next.delete(weekNumber);
      } else {
        next.add(weekNumber);
      }
      return next;
    });
  };

  const handleToggleTask = async (taskId: string, currentState: boolean) => {
    if (!plan) return;
    try {
      await trainingService.toggleTaskCompletion(taskId, !currentState);
      // Optimistic update
      setPlan((prev) => {
        if (!prev) return prev;
        const updatedWeeks = prev.weeks.map((week) => ({
          ...week,
          tasks: week.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !currentState } : task
          ),
        }));
        return { ...prev, weeks: updatedWeeks };
      });
    } catch {
      console.error('Failed to toggle task');
    }
  };

  if (loading) return <LoadingOverlay visible />;

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No training plan available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>12-Week Training Plan</Text>
          <Text style={styles.completion}>
            {formatScore(plan.completionPercent)} complete
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${plan.completionPercent}%` }]}
          />
        </View>

        {plan.weeks.map((week) => (
          <WeekSection
            key={week.weekNumber}
            week={week}
            expanded={expandedWeeks.has(week.weekNumber)}
            onToggle={() => toggleWeek(week.weekNumber)}
            onToggleTask={handleToggleTask}
          />
        ))}

        {plan.premiumUpsellAvailable && (
          <View style={[styles.upsellCard, shadows.card]}>
            <Text style={styles.upsellTitle}>Want personalized guidance?</Text>
            <Text style={styles.upsellBody}>
              Upgrade to Premium for expert trainer consultations and
              AI-generated training adjustments based on your check-ins.
            </Text>
            <Button
              title="Learn More"
              variant="secondary"
              onPress={() => {}}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function WeekSection({
  week,
  expanded,
  onToggle,
  onToggleTask,
}: {
  week: TrainingWeek;
  expanded: boolean;
  onToggle: () => void;
  onToggleTask: (taskId: string, currentState: boolean) => void;
}) {
  const completedCount = week.tasks.filter((t) => t.completed).length;

  return (
    <View style={styles.weekContainer}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={styles.weekHeader}
      >
        <View style={styles.weekTitleRow}>
          <Text style={styles.weekTitle}>
            Week {week.weekNumber}: {week.title}
          </Text>
          <Text style={styles.weekProgress}>
            {completedCount}/{week.tasks.length}
          </Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.gray400}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.tasksList}>
          {week.tasks.map((task) => (
            <TrainingTaskRow
              key={task.id}
              title={task.title}
              description={task.description}
              completed={task.completed}
              onToggle={() => onToggleTask(task.id, task.completed)}
            />
          ))}
        </View>
      )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.bodyMd,
    color: colors.gray600,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displaySm,
  },
  completion: {
    ...typography.labelSm,
    color: colors.plum,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: 3,
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.plum,
    borderRadius: 3,
  },
  weekContainer: {
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.cardPadding,
  },
  weekTitleRow: {
    flex: 1,
  },
  weekTitle: {
    ...typography.labelMd,
  },
  weekProgress: {
    ...typography.bodySm,
    color: colors.gray400,
    marginTop: 2,
  },
  tasksList: {
    paddingHorizontal: spacing.cardPadding,
    paddingBottom: spacing.md,
  },
  upsellCard: {
    backgroundColor: colors.plumLight,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  upsellTitle: {
    ...typography.displaySm,
    color: colors.plum,
  },
  upsellBody: {
    ...typography.bodyMd,
    color: colors.gray600,
  },
});

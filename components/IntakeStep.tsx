import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ProgressDots from './ui/ProgressDots';
import Button from './ui/Button';
import { colors, typography, spacing } from '../utils/theme';

interface IntakeStepProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  showBack?: boolean;
}

export default function IntakeStep({
  title,
  subtitle,
  currentStep,
  totalSteps,
  children,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  loading = false,
  showBack = true,
}: IntakeStepProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header row with back button and autosave indicator */}
        <View style={styles.headerRow}>
          {showBack && currentStep > 0 ? (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={colors.charcoal} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
          <View style={styles.autosaveIndicator}>
            <Ionicons name="cloud-done-outline" size={14} color={colors.green} />
            <Text style={styles.autosaveText}>Auto-saved</Text>
          </View>
        </View>

        <ProgressDots total={totalSteps} current={currentStep} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.headerArea}>
            <Text style={styles.stepLabel}>Step {currentStep + 1} of {totalSteps}</Text>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </TouchableWithoutFeedback>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={nextLabel}
            onPress={onNext}
            disabled={nextDisabled}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  backPlaceholder: {
    width: 32,
  },
  autosaveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  autosaveText: {
    ...typography.bodySm,
    color: colors.green,
    fontSize: 11,
  },
  headerArea: {
    paddingTop: spacing.sm,
  },
  stepLabel: {
    ...typography.bodySm,
    color: colors.gray400,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.displayMd,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footer: {
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
});

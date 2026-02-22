import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressDots from './ui/ProgressDots';
import Button from './ui/Button';
import { colors, typography, spacing } from '../utils/theme';

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
}

export default function OnboardingStep({
  title,
  subtitle,
  currentStep,
  totalSteps,
  children,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  loading = false,
}: OnboardingStepProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressDots total={totalSteps} current={currentStep} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View style={styles.childrenContainer}>{children}</View>
        </View>
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
  content: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.displayMd,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginBottom: spacing.xxxl,
  },
  childrenContainer: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});

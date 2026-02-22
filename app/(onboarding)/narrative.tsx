import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import OnboardingStep from '../../components/OnboardingStep';
import TextArea from '../../components/ui/TextArea';
import { useAppStore } from '../../store/useAppStore';
import { adopterService } from '../../services/adopterService';
import { saveAdopterId } from '../../utils/storage';
import { TOTAL_ONBOARDING_STEPS } from '../../utils/constants';
import { spacing } from '../../utils/theme';

export default function OnboardingNarrative() {
  const { onboardingDraft, updateOnboardingDraft, adopterId, setAdopter } =
    useAppStore();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!adopterId) return;
    try {
      setSubmitting(true);
      const updatedAdopter = await adopterService.updateProfile(adopterId, {
        ...onboardingDraft,
        onboardingComplete: true,
      } as any);
      setAdopter(updatedAdopter);
      await saveAdopterId(updatedAdopter.id);
      router.replace('/(main)/swipe');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingStep
      title="Share a little about yourself."
      subtitle="These prompts help our AI find your ideal match."
      currentStep={8}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onNext={handleSubmit}
      nextLabel="Finish"
      loading={submitting}
      nextDisabled={
        onboardingDraft.narrative1.trim().length < 10 ||
        onboardingDraft.narrative2.trim().length < 10
      }
    >
      <View style={styles.content}>
        <TextArea
          label="What are you looking for in a pet companion?"
          placeholder="I want a loyal companion who..."
          hint="At least 10 characters"
          value={onboardingDraft.narrative1}
          onChangeText={(text) => updateOnboardingDraft({ narrative1: text })}
        />
        <TextArea
          label="Describe your ideal day with your pet."
          placeholder="We'd start the morning with..."
          hint="At least 10 characters"
          value={onboardingDraft.narrative2}
          onChangeText={(text) => updateOnboardingDraft({ narrative2: text })}
        />
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
});

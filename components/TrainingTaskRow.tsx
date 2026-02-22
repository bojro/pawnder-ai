import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from './ui/Checkbox';
import { colors, typography, spacing } from '../utils/theme';

interface TrainingTaskRowProps {
  title: string;
  description: string;
  completed: boolean;
  onToggle: () => void;
}

export default function TrainingTaskRow({
  title,
  description,
  completed,
  onToggle,
}: TrainingTaskRowProps) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.container}>
      <Checkbox checked={completed} onToggle={onToggle} />
      <View style={styles.content}>
        <Text style={[styles.title, completed && styles.completed]}>{title}</Text>
        <Text style={[styles.description, completed && styles.completed]}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.labelMd,
    color: colors.charcoal,
  },
  description: {
    ...typography.bodySm,
    color: colors.gray600,
    marginTop: 2,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: colors.gray400,
  },
});

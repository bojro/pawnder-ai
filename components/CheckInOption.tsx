import React from 'react';
import { View, StyleSheet } from 'react-native';
import SelectionChip from './ui/SelectionChip';
import { spacing } from '../utils/theme';

interface CheckInOptionProps {
  options: { label: string; value: string }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export default function CheckInOption({
  options,
  selectedValue,
  onSelect,
}: CheckInOptionProps) {
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <SelectionChip
          key={opt.value}
          label={opt.label}
          selected={selectedValue === opt.value}
          onPress={() => onSelect(opt.value)}
          style={styles.chip}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    minWidth: 90,
  },
});

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors, typography, spacing, radii } from '../../utils/theme';

interface TextAreaProps extends TextInputProps {
  label?: string;
  hint?: string;
}

export default function TextArea({ label, hint, style, ...props }: TextAreaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.focused,
          style,
        ]}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        placeholderTextColor={colors.gray400}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySm,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.bodyMd,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    borderStyle: 'dashed',
    borderRadius: radii.sm,
    padding: spacing.md,
    minHeight: 100,
    color: colors.charcoal,
    backgroundColor: colors.white,
  },
  focused: {
    borderColor: colors.plum,
  },
  hint: {
    ...typography.bodySm,
    color: colors.gray400,
    marginTop: spacing.xs,
  },
});

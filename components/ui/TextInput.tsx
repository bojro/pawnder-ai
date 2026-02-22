import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors, typography, spacing } from '../../utils/theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
}

export default function TextInput({ label, error, style, ...props }: TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          focused && styles.focused,
          error ? styles.error : undefined,
          style,
        ]}
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
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.bodyLg,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.gray200,
    paddingVertical: 10,
    color: colors.charcoal,
  },
  focused: {
    borderBottomColor: colors.teal,
  },
  error: {
    borderBottomColor: colors.red,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.red,
    marginTop: spacing.xs,
  },
});

import { StyleSheet, Text, Pressable } from 'react-native';
import { colors, minTap, radius, shadow, spacing, type } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  hint?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export function Button({ label, onPress, hint, variant = 'primary', disabled }: Props) {
  const secondary = variant === 'secondary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        pressed && (secondary ? styles.secondaryPressed : styles.pressed),
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.text, secondary && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTap,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...shadow.card,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: 'none',
  },
  text: { ...type.label, color: colors.onPrimary, textAlign: 'center' },
  secondaryText: { color: colors.primary },
  pressed: { backgroundColor: colors.primaryDark },
  secondaryPressed: { backgroundColor: colors.primarySoft },
  disabled: { opacity: 0.4 },
});

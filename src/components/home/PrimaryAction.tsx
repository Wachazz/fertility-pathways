import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, minTap, radius, shadow, spacing, type } from '../../theme';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  hint: string;
  onPress: () => void;
};

export function PrimaryAction({ icon, label, hint, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Ionicons name={icon} size={28} color={colors.primaryDark} />
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: minTap + 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadow.raised,
  },
  pressed: { backgroundColor: colors.primaryDark },
  icon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  label: { ...type.heading, color: colors.onPrimary },
  hint: { ...type.small, color: colors.onPrimaryMuted },
});

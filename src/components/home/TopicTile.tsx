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

// Half-width tile; height grows with the text so large font sizes never clip.
export function TopicTile({ icon, label, hint, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={styles.bubble}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '45%',
    flexGrow: 1,
    minHeight: minTap * 2,
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.card,
  },
  pressed: { backgroundColor: colors.primarySoft },
  bubble: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  label: { ...type.label, color: colors.text },
  hint: { ...type.small, color: colors.textMuted },
});

import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useLang } from '../i18n/LanguageContext';
import { colors, minTap, radius, spacing, type } from '../theme';

// Shown in the header of every screen so urgent signs are always one tap away.
export function UrgentButton() {
  const { c } = useLang();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={c.ui.urgentButton}
      accessibilityHint={c.ui.urgentHint}
      hitSlop={8}
      onPress={() => router.push('/support')}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name="alert-circle" size={18} color={colors.danger} />
      <Text style={styles.text} numberOfLines={1} maxFontSizeMultiplier={1.4}>
        {c.ui.urgentButton}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTap - 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    marginHorizontal: spacing.sm,
  },
  pressed: { opacity: 0.75 },
  text: { ...type.small, fontWeight: '700', color: colors.danger },
});

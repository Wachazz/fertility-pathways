import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { useLang, type Section } from '../i18n/LanguageContext';
import { colors, radius, spacing, type } from '../theme';

// True when any part of the screen has not been approved by a clinician yet.
export const hasDraft = (items: readonly Pick<Section, 'reviewed'>[]) => items.some((s) => !s.reviewed);

// One banner at the top of a screen instead of a label on every card.
export function DraftBanner() {
  const { c } = useLang();
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Ionicons name="construct" size={18} color={colors.warning} />
      <Text style={styles.text}>{c.ui.draft}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { ...type.small, flex: 1, fontWeight: '700', color: colors.warning },
});

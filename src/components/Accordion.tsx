import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Section } from '../i18n/LanguageContext';
import { colors, minTap, radius, shadow, spacing, type } from '../theme';

// Collapsed, a section shows its heading and its own first sentence as a summary,
// so no new wording is introduced.
export function Accordion({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);
  const [first, ...rest] = section.body;

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={section.heading}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <View style={styles.headerText}>
          <Text style={styles.heading}>{section.heading}</Text>
          {!open ? (
            <Text style={styles.summary} numberOfLines={2}>
              {first}
            </Text>
          ) : null}
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={colors.primary} />
      </Pressable>
      {open ? (
        <View style={styles.body}>
          {[first, ...rest].map((para, i) => (
            <Text key={i} style={styles.para}>
              {para}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  header: {
    minHeight: minTap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  pressed: { backgroundColor: colors.primarySoft },
  headerText: { flex: 1, gap: spacing.xs },
  heading: { ...type.label, color: colors.text },
  summary: { ...type.small, color: colors.textMuted },
  body: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  para: { ...type.body, color: colors.text, marginBottom: spacing.sm },
});

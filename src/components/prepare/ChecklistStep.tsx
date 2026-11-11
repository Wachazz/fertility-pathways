import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Content } from '../../i18n/LanguageContext';
import { colors, minTap, radius, spacing, type } from '../../theme';
import { Card } from '../Card';

type Step = Content['prepare']['steps'][number];

type Props = {
  step: Step;
  isChecked: (stepId: string, itemId: string) => boolean;
  toggle: (stepId: string, itemId: string) => void;
};

export function ChecklistStep({ step, isChecked, toggle }: Props) {
  return (
    <Card>
      <Text style={styles.heading} accessibilityRole="header">
        {step.title}
      </Text>
      <Text style={styles.intro}>{step.intro}</Text>
      <View style={styles.items}>
        {step.items.map((item) => {
          const on = isChecked(step.id, item.id);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="checkbox"
              accessibilityLabel={item.text}
              accessibilityState={{ checked: on }}
              onPress={() => toggle(step.id, item.id)}
              style={({ pressed }) => [styles.item, on && styles.itemOn, pressed && styles.pressed]}
            >
              <View style={[styles.box, on && styles.boxOn]}>
                {on ? <Ionicons name="checkmark" size={20} color={colors.onPrimary} /> : null}
              </View>
              <Text style={styles.itemText}>{item.text}</Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: { ...type.heading, color: colors.text, marginBottom: spacing.sm },
  intro: { ...type.body, color: colors.text, marginBottom: spacing.md },
  items: { gap: spacing.sm },
  item: {
    minHeight: minTap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  itemOn: { backgroundColor: colors.successSoft, borderColor: colors.success },
  pressed: { opacity: 0.75 },
  box: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.success, borderColor: colors.success },
  itemText: { ...type.body, flex: 1, color: colors.text },
});

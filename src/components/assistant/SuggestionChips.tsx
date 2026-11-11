import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, minTap, radius, spacing, type } from '../../theme';

type Props = { title: string; questions: string[]; onPick: (q: string) => void };

// Tap-to-ask questions for people who find typing hard.
export function SuggestionChips({ title, questions, onPick }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        {questions.map((q) => (
          <Pressable
            key={q}
            accessibilityRole="button"
            accessibilityLabel={q}
            onPress={() => onPick(q)}
            style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
          >
            <Text style={styles.text}>{q}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  title: { ...type.small, fontWeight: '700', color: colors.textMuted },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: minTap - 4,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  pressed: { backgroundColor: colors.border },
  text: { ...type.small, fontWeight: '600', color: colors.primaryDark },
});

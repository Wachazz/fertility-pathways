import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, minTap, radius, spacing, type } from '../theme';

type Props = { label: string; selected: boolean; onPress: () => void; multiple?: boolean };

// One tick box (several can be on) or one radio style choice (only one can be on).
export function Choice({ label, selected, onPress, multiple }: Props) {
  return (
    <Pressable
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityLabel={label}
      accessibilityState={multiple ? { checked: selected } : { selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.item, selected && styles.on, pressed && styles.pressed]}
    >
      <View style={[styles.mark, multiple ? styles.square : styles.round, selected && styles.markOn]}>
        {selected ? <Ionicons name="checkmark" size={18} color={colors.onPrimary} /> : null}
      </View>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  on: { backgroundColor: colors.successSoft, borderColor: colors.success },
  pressed: { opacity: 0.75 },
  mark: { width: 28, height: 28, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  square: { borderRadius: radius.sm },
  round: { borderRadius: radius.pill },
  markOn: { backgroundColor: colors.success, borderColor: colors.success },
  text: { ...type.body, flex: 1, color: colors.text },
});

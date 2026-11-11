import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, minTap, radius, spacing, type } from '../../theme';

type Props = {
  towns: string[];
  selected: string | null;
  allLabel: string;
  // Number of checked clinics per town. A town with none is shown dimmed but can still be chosen.
  counts?: Record<string, number>;
  onSelect: (town: string | null) => void;
};

export function TownFilter({ towns, selected, allLabel, counts, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {[null, ...towns].map((t) => {
        const on = t === selected;
        const n = t && counts ? (counts[t] ?? 0) : null;
        const label = t ? (n ? `${t} (${n})` : t) : allLabel;
        return (
          <Pressable
            key={t ?? 'all'}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: on }}
            onPress={() => onSelect(t)}
            style={[styles.chip, on && styles.chipOn, !on && t && n === 0 && styles.chipDim]}
          >
            <Text style={[styles.text, on && styles.textOn]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: minTap - 4,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.primary },
  chipDim: { borderColor: colors.border },
  text: { ...type.small, fontWeight: '700', color: colors.primary },
  textOn: { color: colors.onPrimary },
});

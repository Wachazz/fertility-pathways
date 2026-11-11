import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, type } from '../../theme';

type Props = { step: number; total: number; label: string; summaryLabel: string };

// "1 2 3 Summary" markers above a progress bar. Read out as one progress bar.
export function StepProgress({ step, total, label, summaryLabel }: Props) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 1, max: total, now: step + 1, text: label }}
      style={styles.wrap}
    >
      <View style={styles.markers}>
        {Array.from({ length: total }, (_, i) => {
          const done = i < step;
          const current = i === step;
          const last = i === total - 1;
          return (
            <View key={i} style={styles.marker}>
              <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]}>
                {done ? (
                  <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
                ) : last ? (
                  <Ionicons name="document-text" size={16} color={current ? colors.primaryDark : colors.textMuted} />
                ) : (
                  <Text style={[styles.num, current && styles.numCurrent]} maxFontSizeMultiplier={1.3}>
                    {i + 1}
                  </Text>
                )}
              </View>
              {last ? <Text style={[styles.caption, current && styles.captionCurrent]}>{summaryLabel}</Text> : null}
            </View>
          );
        })}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${((step + 1) / total) * 100}%` }]} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const DOT = 32;

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  markers: { flexDirection: 'row', justifyContent: 'space-between' },
  marker: { alignItems: 'center', gap: 2, minWidth: DOT },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotCurrent: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  num: { ...type.small, fontWeight: '700', color: colors.textMuted },
  numCurrent: { color: colors.primaryDark },
  caption: { ...type.caption, color: colors.textMuted },
  captionCurrent: { color: colors.primaryDark },
  track: { height: 8, borderRadius: radius.sm, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: 8, backgroundColor: colors.success },
  label: { ...type.small, color: colors.textMuted },
});

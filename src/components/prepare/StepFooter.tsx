import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../theme';
import { Button } from '../Button';

type Props = {
  backLabel: string;
  nextLabel: string;
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function StepFooter({ backLabel, nextLabel, canGoBack, onBack, onNext }: Props) {
  return (
    <View style={styles.footer}>
      <View style={styles.half}>
        <Button variant="secondary" label={backLabel} disabled={!canGoBack} onPress={onBack} />
      </View>
      <View style={styles.half}>
        <Button label={nextLabel} onPress={onNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  half: { flex: 1 },
});

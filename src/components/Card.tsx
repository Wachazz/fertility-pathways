import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

type Props = { children: ReactNode; tone?: 'normal' | 'urgent' };

export function Card({ children, tone = 'normal' }: Props) {
  return <View style={[styles.card, tone === 'urgent' && styles.urgent]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  urgent: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
    borderLeftWidth: 6,
  },
});

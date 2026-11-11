import { StyleSheet, Text } from 'react-native';
import type { Section } from '../i18n/LanguageContext';
import { colors, spacing, type } from '../theme';
import { Card } from './Card';

type Props = { section: Section; tone?: 'normal' | 'urgent' };

export function SectionCard({ section, tone = 'normal' }: Props) {
  const urgent = tone === 'urgent';
  return (
    <Card tone={tone}>
      <Text style={[styles.heading, urgent && styles.urgentHeading]} accessibilityRole="header">
        {section.heading}
      </Text>
      {section.body.map((para, i) => (
        <Text key={i} style={styles.body}>
          {para}
        </Text>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: { ...type.heading, color: colors.text, marginBottom: spacing.sm },
  urgentHeading: { color: colors.danger },
  body: { ...type.body, color: colors.text, marginBottom: spacing.sm },
});

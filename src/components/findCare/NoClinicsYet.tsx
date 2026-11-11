import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import type { Content } from '../../i18n/LanguageContext';
import { colors, spacing, type } from '../../theme';
import { Card } from '../Card';
import { Notice } from '../Notice';

// Shown until clinics.json has checked clinics. It never invents a clinic or number.
export function NoClinicsYet({ f }: { f: Content['findCare'] }) {
  return (
    <>
      <Notice text={f.empty} />
      <Card>
        <Text style={styles.heading} accessibilityRole="header">
          {f.nowTitle}
        </Text>
        {f.now.map((line) => (
          <Text key={line} style={styles.body}>
            {line}
          </Text>
        ))}
      </Card>
      <Card>
        <Text style={styles.heading} accessibilityRole="header">
          {f.callTitle}
        </Text>
        {f.callQuestions.map((q) => (
          <View key={q} style={styles.row}>
            <Ionicons name="call-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={styles.item}>{q}</Text>
          </View>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  heading: { ...type.heading, color: colors.text, marginBottom: spacing.sm },
  body: { ...type.body, color: colors.text },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  icon: { marginTop: 4 },
  item: { ...type.body, flex: 1, color: colors.text },
});

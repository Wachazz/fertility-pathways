import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { TopicTile } from '../../components/home/TopicTile';
import { Screen } from '../../components/Screen';
import { useLang } from '../../i18n/LanguageContext';
import { colors, radius, spacing, type } from '../../theme';

const TOPICS = [
  { key: 'pathway', href: '/pathway', icon: 'trail-sign' },
  { key: 'warning', href: '/warning-signs', icon: 'warning' },
  { key: 'understand', href: '/understand', icon: 'book' },
  { key: 'costs', href: '/costs', icon: 'cash' },
  { key: 'support', href: '/support', icon: 'heart' },
  { key: 'privacy', href: '/privacy', icon: 'lock-closed' },
] as const;

export default function Home() {
  const { c } = useLang();
  const m = c.menu;
  return (
    <Screen contentKey="menu">
      <View style={styles.hero}>
        <View style={styles.blobLarge} />
        <View style={styles.blobSmall} />
        <Text style={styles.greeting}>{m.greeting}</Text>
        <Text style={styles.title} accessibilityRole="header">
          {m.title}
        </Text>
      </View>
      <View style={styles.grid}>
        {TOPICS.map(({ key, href, icon }) => (
          <TopicTile
            key={key}
            icon={icon}
            label={m[key].label}
            hint={m[key].hint}
            onPress={() => router.push(href)}
          />
        ))}
      </View>
      <Button
        variant="secondary"
        label={c.ui.changeLanguage}
        onPress={() => router.push({ pathname: '/', params: { change: '1' } })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
    overflow: 'hidden',
  },
  blobLarge: {
    position: 'absolute',
    right: -40,
    top: -50,
    width: 160,
    height: 160,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  blobSmall: {
    position: 'absolute',
    right: 60,
    bottom: -40,
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    opacity: 0.55,
  },
  greeting: { ...type.title, color: colors.onPrimary },
  title: { ...type.body, color: colors.onPrimaryMuted },
  section: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});

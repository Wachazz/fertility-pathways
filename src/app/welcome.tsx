import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLang } from '../i18n/LanguageContext';
import { colors, maxContentWidth, radius, spacing, type } from '../theme';

// Screen 2: a short, warm welcome. Shown once per launch.
export default function Welcome() {
  const { c } = useLang();
  const w = c.welcome;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.center}>
      <View style={styles.hero}>
        <View style={styles.blobLarge} />
        <View style={styles.blobSmall} />
        <View style={styles.badge}>
          <Ionicons name="heart" size={40} color={colors.onPrimary} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          {w.title}
        </Text>
        <Text style={styles.intro}>{w.intro}</Text>
      </View>
      <Button label={w.start} onPress={() => router.replace('/home')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.md,
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.xl,
    padding: spacing.xl,
    paddingVertical: spacing.xl * 1.5,
    gap: spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  blobLarge: {
    position: 'absolute',
    right: -50,
    top: -60,
    width: 190,
    height: 190,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  blobSmall: {
    position: 'absolute',
    left: -30,
    bottom: -40,
    width: 110,
    height: 110,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    opacity: 0.55,
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...type.title, color: colors.onPrimary, textAlign: 'center' },
  intro: { ...type.body, color: colors.onPrimaryMuted, textAlign: 'center' },
});

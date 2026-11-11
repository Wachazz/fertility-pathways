import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGES, useLang, type Lang } from '../i18n/LanguageContext';
import { colors, maxContentWidth, minTap, radius, spacing, type } from '../theme';

// Screen 1: language choice comes before any other content.
export default function ChooseLanguage() {
  const { c, lang, setLang } = useLang();
  const { change } = useLocalSearchParams<{ change?: string }>();

  const choose = (code: Lang) => {
    setLang(code);
    if (change && router.canGoBack()) router.back();
    else router.replace('/welcome');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.inner}>
        <View style={styles.emblem}>
          <Ionicons name="heart" size={34} color={colors.onPrimary} />
        </View>
        <Text style={styles.title}>{c.ui.appName}</Text>
        <Text style={styles.tagline}>{c.ui.tagline}</Text>
        <Text style={styles.heading} accessibilityRole="header">
          {c.ui.chooseLanguage}
        </Text>
        <Text style={styles.body}>{c.ui.chooseLanguageHint}</Text>
        {LANGUAGES.map((l) => {
          const selected = !!change && l.code === lang;
          return (
            <Pressable
              key={l.code}
              accessibilityRole="button"
              accessibilityLabel={l.local === l.name ? l.name : `${l.name}, ${l.local}`}
              accessibilityState={{ selected }}
              onPress={() => choose(l.code)}
              style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}
            >
              <Text style={[styles.optionName, selected && styles.onPrimary]}>{l.name}</Text>
              {l.local !== l.name ? (
                <Text style={[styles.local, selected && styles.onPrimary]}>{l.local}</Text>
              ) : null}
              <Ionicons
                name="chevron-forward"
                size={22}
                color={selected ? colors.onPrimary : colors.primary}
                style={styles.chevron}
              />
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  inner: { padding: spacing.lg, gap: spacing.md, width: '100%', maxWidth: maxContentWidth, alignSelf: 'center' },
  emblem: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 6px 16px rgba(9, 76, 74, 0.25)',
  },
  chevron: { position: 'absolute', right: spacing.md },
  title: { ...type.title, color: colors.primaryDark },
  tagline: { ...type.small, color: colors.textMuted, marginBottom: spacing.md },
  heading: { ...type.heading, color: colors.text },
  body: { ...type.body, color: colors.text },
  option: {
    minHeight: minTap + 12,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    paddingLeft: spacing.md,
    paddingRight: spacing.xl + spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.primary },
  pressed: { opacity: 0.75 },
  optionName: { ...type.heading, color: colors.primary },
  local: { ...type.small, color: colors.textMuted },
  onPrimary: { color: colors.onPrimary },
});

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Route } from '../../assistant/answer';
import type { Turn } from '../../hooks/useAssistant';
import { useLang, type Content } from '../../i18n/LanguageContext';
import { colors, radius, spacing, type } from '../../theme';
import { Notice } from '../Notice';
import { SectionCard } from '../SectionCard';

// Each place an answer can come from, mapped to the content holding that screen's title.
const ROUTE_CONTENT: Record<Route, 'understand' | 'costs' | 'support'> = {
  '/understand': 'understand',
  '/costs': 'costs',
  '/support': 'support',
};

const titleOf = (c: Content, route: Route) => c[ROUTE_CONTENT[route]].title;

export function ChatTurn({ turn }: { turn: Turn }) {
  const { c } = useLang();
  const { reply } = turn;

  return (
    <View style={styles.turn}>
      <View style={styles.bubble}>
        <Text style={styles.who}>{c.assistant.you}</Text>
        <Text style={styles.bubbleText}>{turn.question}</Text>
      </View>
      {turn.online?.state === 'loading' ? (
        <Notice text={c.assistant.thinking} />
      ) : turn.online?.state === 'done' ? (
        <View style={styles.reply}>
          <Text style={styles.source}>{c.assistant.smartLabel}</Text>
          <Text style={styles.body}>{turn.online.text}</Text>
        </View>
      ) : (
        <>
          {turn.online?.state === 'failed' ? <Notice text={c.assistant.smartFailed} /> : null}
          {reply.kind === 'message' ? (
            <View style={styles.reply}>
              <Text style={styles.body}>{reply.text}</Text>
            </View>
          ) : reply.kind === 'urgent' ? (
            <SectionCard section={reply.section} tone="urgent" />
          ) : (
            reply.matches.map(({ section, route }) => (
              <Pressable
                key={section.id}
                accessibilityRole="link"
                accessibilityHint={titleOf(c, route)}
                onPress={() => router.push(route)}
              >
                <SectionCard section={section} />
                <Text style={styles.source}>
                  {c.assistant.from} {titleOf(c, route)} ›
                </Text>
              </Pressable>
            ))
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  turn: { gap: spacing.sm },
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  who: { ...type.caption, color: colors.onPrimaryMuted, marginBottom: 2 },
  bubbleText: { ...type.body, color: colors.onPrimary },
  reply: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  body: { ...type.body, color: colors.text },
  source: { ...type.small, fontWeight: '700', color: colors.primary, marginTop: spacing.xs },
});

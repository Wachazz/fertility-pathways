import { useHeaderHeight } from 'expo-router/react-navigation';
import { useRef, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { Button } from '../../components/Button';
import { ChatInput } from '../../components/assistant/ChatInput';
import { ChatTurn } from '../../components/assistant/ChatTurn';
import { SuggestionChips } from '../../components/assistant/SuggestionChips';
import { hasDraft } from '../../components/DraftBanner';
import { Notice } from '../../components/Notice';
import { Screen } from '../../components/Screen';
import { useAssistant } from '../../hooks/useAssistant';
import { useLang } from '../../i18n/LanguageContext';
import { colors, type } from '../../theme';

// Offline helper: it can only return approved sections from the content folder.
export default function Assistant() {
  const { c, lang } = useLang();
  const a = c.assistant;
  const { turns, ask, smart, setSmart, canSmart } = useAssistant(c, lang);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const headerHeight = useHeaderHeight();
  const library = [...c.understand.sections, ...c.costs.sections, ...c.support.sections];

  return (
    // iOS needs padding; on Android the window pans (app.json softwareKeyboardLayoutMode).
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <Screen
        contentKey="assistant"
        draft={hasDraft(library)}
        scrollRef={scroll}
        onContentSizeChange={() => turns.length > 0 && scroll.current?.scrollToEnd({ animated: true })}
        footer={<ChatInput placeholder={a.placeholder} sendLabel={a.send} onSend={ask} />}
      >
        <Text style={styles.body}>{a.intro}</Text>
        <Text style={styles.muted}>{a.disclaimer}</Text>
        <Notice text={a.privacyReminder} />
        {canSmart ? (
          <>
            <Notice text={smart ? a.smartOn : a.smartOff} />
            <Button variant="secondary" label={smart ? a.smartTurnOff : a.smartTurnOn} onPress={() => setSmart(!smart)} />
          </>
        ) : (
          <Notice text={a.smartOff} />
        )}
        <SuggestionChips title={a.suggestionsTitle} questions={a.suggestions} onPick={ask} />
        {turns.map((t) => (
          <ChatTurn key={t.id} turn={t} />
        ))}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { ...type.body, color: colors.text },
  muted: { ...type.small, color: colors.textMuted },
});

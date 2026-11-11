import { useState } from 'react';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useLang } from '../../i18n/LanguageContext';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, minTap, radius, spacing, type } from '../../theme';

type Props = { placeholder: string; sendLabel: string; onSend: (text: string) => void };

export function ChatInput({ placeholder, sendLabel, onSend }: Props) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const { lang } = useLang();
  const LOCALE = { en: 'en-ZA', sn: 'sn-ZW', nd: 'en-ZA' } as const;
  const LABEL = {
    en: { mic: 'Speak', stop: 'Stop', listening: 'Listening... speak now', denied: 'Please allow the microphone to ask by voice.', fail: 'Could not hear you. Please try again or type.' },
    sn: { mic: 'Taura', stop: 'Mira', listening: 'Ndiri kunzwa... taura zvino', denied: 'Ngapabvumidzwe maikorofoni kuti utaure.', fail: 'Handina kukunzwa. Edza zvakare kana nyora.' },
    nd: { mic: 'Khuluma', stop: 'Yima', listening: 'Ngiyalalela... khuluma manje', denied: 'Sicela uvumele imikrofoni ukuze ukhulume.', fail: 'Angikuzwanga. Zama futhi noma ubhale.' },
  }[lang];

  useSpeechRecognitionEvent('result', (e) => {
    const t = e.results?.[0]?.transcript;
    if (t) setText(t);
  });
  useSpeechRecognitionEvent('end', () => setListening(false));
  useSpeechRecognitionEvent('error', (e) => {
    setListening(false);
    if (e.error !== 'aborted' && e.error !== 'no-speech') setVoiceError(LABEL.fail);
  });

  const toggleVoice = async () => {
    setVoiceError('');
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      setVoiceError(LABEL.denied);
      return;
    }
    setListening(true);
    ExpoSpeechRecognitionModule.start({ lang: LOCALE[lang], interimResults: true, continuous: false });
  };
  const send = () => {
    onSend(text);
    setText('');
  };

  return (
    <View>
    {listening || voiceError ? <Text style={styles.status}>{listening ? LABEL.listening : voiceError}</Text> : null}
    <View style={styles.bar}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        onSubmitEditing={send}
        returnKeyType="send"
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={listening ? LABEL.stop : LABEL.mic}
        onPress={toggleVoice}
        style={({ pressed }) => [styles.mic, listening && styles.micOn, pressed && styles.pressed]}
      >
        <Text style={styles.sendText}>{listening ? LABEL.stop : LABEL.mic}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={sendLabel}
        onPress={send}
        style={({ pressed }) => [styles.send, pressed && styles.pressed]}
      >
        <Text style={styles.sendText}>{sendLabel}</Text>
      </Pressable>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    ...type.body,
    flex: 1,
    minHeight: minTap,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  send: {
    minHeight: minTap,
    minWidth: 80,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  mic: {
    minHeight: minTap,
    minWidth: 64,
    borderRadius: radius.md,
    backgroundColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  micOn: { backgroundColor: '#B3261E' },
  status: { ...type.small, color: colors.textMuted, paddingHorizontal: spacing.md, paddingTop: spacing.xs },
  pressed: { opacity: 0.75 },
  sendText: { ...type.label, color: colors.onPrimary },
});

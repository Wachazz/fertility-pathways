import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import type { Content } from '../../i18n/LanguageContext';
import { colors, spacing, type } from '../../theme';
import { Button } from '../Button';
import { Card } from '../Card';
import { Notice } from '../Notice';

type Props = {
  p: Content['prepare'];
  isChecked: (stepId: string, itemId: string) => boolean;
  summaryText: () => string;
  about?: readonly string[];
};

export function PrepareSummary({ p, isChecked, summaryText, about = [] }: Props) {
  const [shareError, setShareError] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    setCopied(await Clipboard.setStringAsync(summaryText()));
  };

  const share = async () => {
    setShareError(false);
    try {
      await Share.share({ title: p.shareTitle, message: summaryText() });
    } catch {
      setShareError(true);
    }
  };

  return (
    <>
      <Text style={styles.title} accessibilityRole="header">
        {p.summaryTitle}
      </Text>
      <Notice text={p.summaryIntro} />
      {about.length ? (
        <Card>
          <Text style={styles.heading}>{p.aboutTitle}</Text>
          {about.map((line, i) => (
            <Text key={i} style={styles.body}>
              {'\u2022 ' + line}
            </Text>
          ))}
        </Card>
      ) : null}
      {p.steps.map((s) => (
        <Card key={s.id}>
          <Text style={styles.heading}>{s.title}</Text>
          {s.items.map((item) => {
            const done = isChecked(s.id, item.id);
            return (
              <View key={item.id} style={styles.row}>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={done ? colors.success : colors.textMuted}
                  style={styles.icon}
                />
                <Text style={[styles.body, !done && styles.notDone]}>
                  {done ? p.done : p.toDo}: {item.text}
                </Text>
              </View>
            );
          })}
        </Card>
      ))}
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button label={p.share} onPress={share} />
        </View>
        <View style={styles.action}>
          <Button variant="secondary" label={p.copy} onPress={copy} />
        </View>
      </View>
      {copied ? <Notice text={p.copied} /> : null}
      {shareError ? <Notice text={p.shareError} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  title: { ...type.title, color: colors.primaryDark },
  heading: { ...type.heading, color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
  icon: { marginTop: 3 },
  body: { ...type.body, flex: 1, color: colors.text },
  notDone: { color: colors.textMuted },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  action: { flexGrow: 1, flexBasis: 140 },
});

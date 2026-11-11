import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Choice } from '../components/Choice';
import { Screen } from '../components/Screen';
import { useLang } from '../i18n/LanguageContext';
import { triage } from '../pathway/plan';
import { colors, spacing, type } from '../theme';

// Nothing is stored. Any urgent sign gives the "go now" answer.
export default function WarningSigns() {
  const { c } = useLang();
  const w = c.warning;
  const [ticked, setTicked] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const toggle = (id: string) => setTicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const reset = () => {
    setTicked([]);
    setDone(false);
  };

  if (done) {
    const level = triage(
      w.urgent.filter((i) => ticked.includes(i.id)).length,
      w.soon.filter((i) => ticked.includes(i.id)).length,
    );
    const msg = level === 'now' ? w.goNow : level === 'soon' ? w.seeSoon : w.none;
    return (
      <Screen contentKey="warning" draft={!w.reviewed}>
        <Card tone={level === 'now' ? 'urgent' : 'normal'}>
          <Text style={[styles.heading, level === 'now' && styles.danger]} accessibilityRole="header">{msg.heading}</Text>
          <Text style={styles.body}>{msg.body}</Text>
        </Card>
        {level !== 'none' ? <Button label={c.menu.findCare.label} onPress={() => router.navigate('/find-care')} /> : null}
        <Button variant="secondary" label={w.again} onPress={reset} />
      </Screen>
    );
  }

  return (
    <Screen contentKey="warning" draft={!w.reviewed}>
      <Text style={styles.body}>{w.intro}</Text>
      <Card tone="urgent">
        <Text style={[styles.heading, styles.danger]} accessibilityRole="header">{w.urgentQ}</Text>
        <View style={styles.list}>
          {w.urgent.map((i) => (
            <Choice key={i.id} multiple label={i.text} selected={ticked.includes(i.id)} onPress={() => toggle(i.id)} />
          ))}
        </View>
      </Card>
      <Card>
        <Text style={styles.heading} accessibilityRole="header">{w.soonQ}</Text>
        <View style={styles.list}>
          {w.soon.map((i) => (
            <Choice key={i.id} multiple label={i.text} selected={ticked.includes(i.id)} onPress={() => toggle(i.id)} />
          ))}
        </View>
      </Card>
      <Button label={w.check} onPress={() => setDone(true)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { ...type.heading, color: colors.text, marginBottom: spacing.sm },
  danger: { color: colors.danger },
  body: { ...type.body, color: colors.text, marginBottom: spacing.sm },
  list: { gap: spacing.sm },
});

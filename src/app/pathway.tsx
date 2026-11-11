import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Choice } from '../components/Choice';
import { Screen } from '../components/Screen';
import { useLang } from '../i18n/LanguageContext';
import { setAnswers } from '../pathway/answers';
import { buildPlan, type Age, type Flag, type Months } from '../pathway/plan';
import { colors, spacing, type } from '../theme';

// Nothing is stored. The answers live in this screen only.
export default function Pathway() {
  const { c } = useLang();
  const p = c.pathway;
  const [age, setAge] = useState<Age | null>(null);
  const [months, setMonths] = useState<Months | null>(null);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [done, setDone] = useState(false);

  const toggle = (f: Flag) => setFlags((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
  const reset = () => {
    setAge(null);
    setMonths(null);
    setFlags([]);
    setDone(false);
    setAnswers(null);
  };

  if (done && age && months) {
    const plan = buildPlan(age, months, flags);
    const head = plan.outcome === 'see' ? p.see : p.wait;
    return (
      <Screen contentKey="pathway" draft={!p.reviewed}>
        <Card>
          <Text style={styles.heading} accessibilityRole="header">{head.heading}</Text>
          <Text style={styles.body}>{head.body}</Text>
        </Card>
        <Card>
          <Text style={styles.heading} accessibilityRole="header">{p.resultTitle}</Text>
          {plan.steps.map((id) => (
            <Text key={id} style={styles.body}>
              {'• ' + (p.steps.find((s) => s.id === id)?.text ?? '')}
            </Text>
          ))}
        </Card>
        {plan.outcome === 'see' ? (
          <Button label={c.menu.prepare.label} onPress={() => router.navigate('/prepare')} />
        ) : null}
        <Button variant="secondary" label={p.again} onPress={reset} />
      </Screen>
    );
  }

  return (
    <Screen contentKey="pathway" draft={!p.reviewed}>
      <Text style={styles.body}>{p.intro}</Text>
      <Card>
        <Text style={styles.heading} accessibilityRole="header">{p.ageQ}</Text>
        <View style={styles.list}>
          {p.ages.map((a) => (
            <Choice key={a.id} label={a.text} selected={age === a.id} onPress={() => setAge(a.id as Age)} />
          ))}
        </View>
      </Card>
      <Card>
        <Text style={styles.heading} accessibilityRole="header">{p.monthsQ}</Text>
        <View style={styles.list}>
          {p.months.map((m) => (
            <Choice key={m.id} label={m.text} selected={months === m.id} onPress={() => setMonths(m.id as Months)} />
          ))}
        </View>
      </Card>
      <Card>
        <Text style={styles.heading} accessibilityRole="header">{p.flagsQ}</Text>
        <View style={styles.list}>
          {p.flags.map((f) => (
            <Choice key={f.id} multiple label={f.text} selected={flags.includes(f.id as Flag)} onPress={() => toggle(f.id as Flag)} />
          ))}
        </View>
      </Card>
      <Button label={p.show} disabled={!age || !months} onPress={() => {
          if (age && months) setAnswers({ age, months, flags });
          setDone(true);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { ...type.heading, color: colors.text, marginBottom: spacing.sm },
  body: { ...type.body, color: colors.text, marginBottom: spacing.sm },
  list: { gap: spacing.sm },
});

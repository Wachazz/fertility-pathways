import { useSyncExternalStore } from 'react';
import type { Content } from '../i18n/LanguageContext';
import { buildPlan, type Age, type Flag, type Months } from './plan';

export type Answers = { age: Age; months: Months; flags: Flag[] };

// Held in memory only. Closing the app clears it. Nothing is saved or sent.
let current: Answers | null = null;
const listeners = new Set<() => void>();

export function setAnswers(next: Answers | null) {
  current = next;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const getAnswers = () => current;

export const usePathwayAnswers = () => useSyncExternalStore(subscribe, () => current, () => null);

// Plain lines for the appointment summary, in the language the woman chose.
export function describeAnswers(p: Content['pathway'], a: Answers | null): string[] {
  if (!a) return [];
  const plan = buildPlan(a.age, a.months, a.flags);
  const lines = [
    p.ages.find((x) => x.id === a.age)?.text,
    p.months.find((x) => x.id === a.months)?.text,
    ...a.flags.map((f) => p.flags.find((x) => x.id === f)?.text),
    (plan.outcome === 'see' ? p.see : p.wait).heading,
  ];
  return lines.filter((x): x is string => !!x);
}

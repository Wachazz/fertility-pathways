import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { Content } from '../i18n/LanguageContext';

type Prepare = Content['prepare'];

const keyOf = (stepId: string, itemId: string) => `${stepId}:${itemId}`;

// Plain text only: the checklist items, never anything the user typed.
export function buildSummaryText(p: Prepare, checked: ReadonlySet<string>, about: readonly string[] = []) {
  return [
    p.shareTitle,
    ...(about.length ? ['', p.aboutTitle, ...about.map((line) => `- ${line}`)] : []),
    ...p.steps.flatMap((s) => [
      '',
      s.title,
      ...s.items.map((item) => `${checked.has(keyOf(s.id, item.id)) ? '[x]' : '[ ]'} ${item.text}`),
    ]),
  ].join('\n');
}

// Ticks live in memory only and are gone when the screen is closed.
export function useChecklist(p: Prepare, about: readonly string[] = []) {
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = useCallback((stepId: string, itemId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      const key = keyOf(stepId, itemId);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Ticks are never saved, so closing or reloading the page would lose them.
  // On web, ask the browser to warn first. In the phone app they survive switching tabs.
  const hasTicks = checked.size > 0;
  useEffect(() => {
    if (Platform.OS !== 'web' || !hasTicks) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasTicks]);

  const reset = useCallback(() => {
    setChecked(new Set());
    setStep(0);
  }, []);

  return {
    step,
    setStep,
    total: p.steps.length + 1,
    onSummary: step === p.steps.length,
    hasTicks,
    isChecked: (stepId: string, itemId: string) => checked.has(keyOf(stepId, itemId)),
    toggle,
    reset,
    summaryText: () => buildSummaryText(p, checked, about),
  };
}

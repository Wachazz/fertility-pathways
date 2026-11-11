import { useState } from 'react';
import { answer, type Answer } from '../assistant/answer';
import { askOnline, onlineEnabled, type HistoryItem } from '../assistant/online';
import type { Content, Lang } from '../i18n/LanguageContext';
import { describeAnswers, getAnswers } from '../pathway/answers';

export type Online = { state: 'loading' | 'done' | 'failed'; text?: string };
export type Turn = { id: number; question: string; reply: Answer; online?: Online };

// The conversation is held in memory only. When smart answers are on, the question is sent
// once to our own server to write the answer. Nothing is stored.
export function useAssistant(c: Content, lang: Lang) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [smart, setSmart] = useState(onlineEnabled);

  const ask = (raw: string) => {
    const question = raw.trim();
    if (!question) return;
    const reply = answer(question, c);
    const personal = reply.kind === 'message' && reply.text === c.assistant.personalInfo;
    // A question containing personal details is not kept on screen or sent anywhere.
    const shown = personal ? '•••' : question;
    // Urgent signs and personal details are always handled instantly on the phone.
    const goOnline = smart && onlineEnabled && reply.kind !== 'urgent' && !personal;
    const id = turns.length;
    setTurns((prev) => [...prev, { id, question: shown, reply, online: goOnline ? { state: 'loading' } : undefined }]);
    if (!goOnline) return;

    const set = (online: Online) => setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, online } : t)));
    // The whole approved library, best matches first, so it can answer what the search missed.
    const first = reply.kind === 'sections' ? reply.matches.map((m) => m.section) : [];
    const library = [...c.understand.sections, ...c.costs.sections, ...c.support.sections, ...c.privacy.sections];
    const passages = [...first, ...library.filter((s) => !first.some((f) => f.id === s.id))];
    const history: HistoryItem[] = turns
      .filter((t) => t.online?.state === 'done')
      .slice(-3)
      .flatMap((t) => [
        { role: 'user' as const, text: t.question },
        { role: 'assistant' as const, text: t.online?.text ?? '' },
      ]);
    askOnline(question, passages, lang, history, describeAnswers(c.pathway, getAnswers())).then((text) =>
      set(text ? { state: 'done', text } : { state: 'failed' }),
    );
  };

  return { turns, ask, smart, setSmart, canSmart: onlineEnabled };
}

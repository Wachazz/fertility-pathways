import type { Lang, Section } from '../i18n/LanguageContext';
import { SYSTEM } from './prompt';

// Set EXPO_PUBLIC_AI_ENDPOINT to your own server (see server/ai-proxy.mjs).
// No API key is ever stored in this app. If the address is not set, the feature stays off.
const ENDPOINT = process.env.EXPO_PUBLIC_AI_ENDPOINT;
// FOR PERSONAL TESTING ONLY. A key here is baked into the app and anyone with the app can
// extract it. Before sharing the app, remove this and use EXPO_PUBLIC_AI_ENDPOINT instead.
const TEST_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const MODEL = process.env.EXPO_PUBLIC_AI_MODEL || 'claude-sonnet-5-5';

export const onlineEnabled = !!ENDPOINT || !!TEST_KEY;

const LANG_NAME: Record<Lang, string> = { en: 'English', sn: 'Shona', nd: 'Ndebele' };

// Called only after the woman taps the button. Sends her question and the approved
// passages already found on her phone. Returns null when offline or on any error.
export type HistoryItem = { role: 'user' | 'assistant'; text: string };

export async function askOnline(
  question: string,
  passages: Section[],
  lang: Lang,
  history: HistoryItem[] = [],
  about: string[] = [],
): Promise<string | null> {
  if (!ENDPOINT && !TEST_KEY) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const payload = {
      question,
      lang: LANG_NAME[lang],
      history,
      about,
      passages: passages.map((s) => ({ heading: s.heading, text: s.body.join(' ') })),
    };
    if (ENDPOINT) {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { text?: string };
      return data.text?.trim() || null;
    }
    // Direct call for personal testing (no server needed).
    const context = payload.passages
      .slice(0, 30)
      .map((p, i) => `[${i + 1}] ${p.heading.slice(0, 120)}\n${p.text.slice(0, 1500)}`)
      .join('\n\n');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': TEST_KEY as string, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: SYSTEM,
        messages: [
          ...history.slice(-6).map((m) => ({ role: m.role, content: m.text.slice(0, 800) })),
          {
            role: 'user',
            content:
              `Language: ${payload.lang}\n` +
              (about.length ? `About her (she chose to share this): ${about.slice(0, 10).join('; ')}\n` : '') +
              `\nApproved passages:\n${context}\n\nQuestion: ${question}`,
          },
        ],
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (data.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('\n').trim();
    return text || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

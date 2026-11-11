// Small server that keeps the Anthropic API key off the phone.
// Run:  ANTHROPIC_API_KEY=your-new-key node server/ai-proxy.mjs
// Then set EXPO_PUBLIC_AI_ENDPOINT in the app to this server's address, for example
// https://your-server.example/ask  (use HTTPS in production).
// The key is read from the environment only. Never write it into the app or into git.
import { createServer } from 'node:http';

// Reads server/.env if it exists (that file is ignored by git and never goes into the app).
try {
  process.loadEnvFile(new URL('./.env', import.meta.url));
} catch {
  /* no .env file, use the environment instead */
}

const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.AI_MODEL || 'claude-sonnet-5-5';
const PORT = Number(process.env.PORT || 8787);
if (!KEY || KEY.startsWith('PASTE_')) {
  console.error('Open server/.env and replace PASTE_YOUR_NEW_KEY_HERE with your new key first.');
  process.exit(1);
}

const SYSTEM = [
  'You are the friendly guide inside a phone app that helps women in Zimbabwe who are finding it hard to get pregnant, and their partners.',
  'Talk like a kind, calm nurse, in plain words at a primary school reading level, in the language asked (English, Shona or Ndebele). Answer greetings and thanks warmly and briefly, then invite her question.',
  'Stay on topic: fertility, trying to get pregnant, periods and cycles, tests, partners, costs, feelings and stigma, and finding care. If asked about something else, say kindly that you can only help with these topics.',
  'For facts, use the approved passages first and say which headings you used. If they do not cover the question, you may give short, well established general information, but say it is general information that is not from the app\'s reviewed text and suggest checking with a health worker. Never invent clinics, prices, statistics or numbers.',
  'Never diagnose, never name medicines, herbs or doses, never predict whether she will get pregnant. If she asks for these, explain kindly that only a health worker can help and offer what you can do instead.',
  'If she mentions heavy bleeding, strong belly pain, fainting, or a positive pregnancy test with pain or bleeding, tell her first to go to the nearest clinic or hospital now.',
  'Be gentle about blame and stigma: it is no one\'s fault, and a partner can be tested too.',
  'Keep answers under 150 words. When it fits, end with one short next step, for example Prepare for care, Your personal pathway, Check warning signs or Find care in the app.',
].join(' ');

const hits = new Map(); // simple limit: 20 requests per hour per address
const limited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 3_600_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 20;
};

const send = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(body));
};

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type',
      'access-control-allow-methods': 'POST',
    });
    return res.end();
  }
  if (req.method !== 'POST' || req.url !== '/ask') return send(res, 404, { error: 'not found' });
  if (limited(req.socket.remoteAddress || 'x')) return send(res, 429, { error: 'too many requests' });

  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20_000) return send(res, 413, { error: 'too large' });
  }
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return send(res, 400, { error: 'bad json' });
  }
  const { question, passages, lang, history = [], about = [] } = input;
  if (typeof question !== 'string' || !question.trim() || question.length > 500 || !Array.isArray(passages)) {
    return send(res, 400, { error: 'bad input' });
  }
  const context = passages
    .slice(0, 30)
    .map((p, i) => `[${i + 1}] ${String(p.heading).slice(0, 120)}\n${String(p.text).slice(0, 1500)}`)
    .join('\n\n');

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: SYSTEM,
        messages: [
          ...(Array.isArray(history) ? history : [])
            .slice(-6)
            .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
            .map((m) => ({ role: m.role, content: m.text.slice(0, 800) })),
          {
            role: 'user',
            content:
              `Language: ${lang}\n` +
              (Array.isArray(about) && about.length ? `About her (she chose to share this): ${about.slice(0, 10).map(String).join('; ')}\n` : '') +
              `\nApproved passages:\n${context}\n\nQuestion: ${question}`,
          },
        ],
      }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('Anthropic replied', r.status, detail.slice(0, 300)); // never contains the key
      return send(res, 502, { error: 'upstream error' });
    }
    const data = await r.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
    return send(res, 200, { text });
  } catch (e) {
    console.error('Could not reach Anthropic:', e?.cause?.code || e?.message);
    return send(res, 502, { error: 'upstream error' });
  }
}).listen(PORT, () => console.log(`AI proxy listening on ${PORT}`));

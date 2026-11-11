// Tests the key in server/.env with one tiny question. Never prints the key.
import { writeFileSync } from 'node:fs';
try { process.loadEnvFile(new URL('./.env', import.meta.url)); } catch {}
const out = (msg) => { console.log(msg); writeFileSync(new URL('./test-result.txt', import.meta.url), msg + '\n'); };
const key = process.env.ANTHROPIC_API_KEY || '';
if (!key || key.startsWith('PASTE_')) { out('RESULT: key not filled in server/.env'); process.exit(0); }
try {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.AI_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      system: 'Answer only from the passage, in plain words, under 40 words.',
      messages: [{ role: 'user', content: 'Passage: See a health worker after 12 months of trying if under 35, or 6 months if 35 or older.\n\nQuestion: When should I see a health worker?' }],
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (r.ok) out('RESULT: KEY WORKS. Answer: ' + (data.content?.[0]?.text || '').replace(/\s+/g, ' '));
  else out(`RESULT: FAILED HTTP ${r.status} ${data.error?.type || ''} ${data.error?.message || ''}`);
} catch (e) {
  out('RESULT: could not reach Anthropic: ' + (e?.cause?.code || e?.message));
}

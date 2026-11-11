import type { Content, Section } from '../i18n/LanguageContext';

export type Route = '/understand' | '/costs' | '/support';

export type Answer =
  | { kind: 'message'; text: string }
  | { kind: 'urgent'; section: Section }
  | { kind: 'sections'; matches: { section: Section; route: Route }[] };

// ---------------------------------------------------------------------------
// Safety rules. Checked first and in this order. They always win over search.
// ---------------------------------------------------------------------------
const PERSONAL = /(\+?\d[\d\s-]{6,}\d)|([\w.+-]+@[\w-]+\.[\w.]+)/;
const URGENT = new RegExp(
  [
    'heavy bleed',
    'bleeding (a lot|heavily|badly)',
    "bleeding (will not|won'?t|does not|doesn'?t) stop",
    'soaking (a |my |through )?(pad|pads|clothes)',
    'lots of blood',
    'faint',
    'passed? out|passing out|collaps',
    '(severe|strong|unbearable|terrible|sharp) (belly |stomach |abdominal |pelvic )?pain',
    '(one|single)[- ]sided pain|pain on (one|my left|my right) side',
    'emergency',
    // Shona and Ndebele: heavy bleeding, strong pain. Draft, needs a fluent reviewer.
    'ropa (jingi|rakawandisa)|kuyerera ropa',
    'igazi eliningi|ubuhlungu obukhulu',
  ].join('|'),
);
// A question about one's own future is a prediction no app can make. A general
// question ("can I get pregnant if my periods are irregular?") is not.
const DIAGNOSE = new RegExp(
  [
    'do i have',
    'have i got',
    'am i (infertile|barren|sterile)',
    'is it (pcos|endometriosis|fibroids)',
    "what('?s| is) wrong with me",
    'diagnos',
    '(can|will|could) i (ever |still |really )?(get|become|fall) pregnant( at all)?\\s*[?.!]*$',
    'will i (ever )?(get pregnant|have a baby|conceive)',
  ].join('|'),
);
const PRESCRIBE =
  /((what|which) (medicine|pill|tablet|drug|herb)|should i take|can i take|dose|dosage|clomid|clomiphene|letrozole|prescri|give me (medicine|pills))/;
const CLINIC = /((where|find|near|nearest).*(clinic|hospital|doctor))|((clinic|hospital|doctor).*(near|nearest))/;
const GREETING = /^(hi|hello|hey|hie|hesi|mhoro|salibonani|sawubona|good (morning|afternoon|evening)|thanks?|thank you|ok|okay)\b/;

// ---------------------------------------------------------------------------
// Search. Offline, no model, no network. It only ever returns approved text.
// It reads the question the way a person would: it ignores filler words,
// folds plurals and endings together, forgives small typing mistakes and knows
// that "afford", "price" and "how much" all point to costs.
// ---------------------------------------------------------------------------
const STOP = new Set(
  (
    'a an the and or but if of to in on at by for with from as is are was were be been am do does did ' +
    'i me my mine we us our you your it its this that these those there here what which who whom how ' +
    'can could should would will may might must so than then too very just also about into over under ' +
    'please tell know want need get got have has had not no yes any some more most much many any when why where'
  ).split(' '),
);

// Words that mean the same thing for our purposes. Shona and Ndebele words are
// included so those speakers still reach an answer. Draft, needs fluent review.
const CONCEPTS: Record<string, string> = {
  cost:
    'cost price fee pay paying paid afford affordable expensive cheap money charge budget dollar usd rtgs mari mutengo imali intengo',
  treatment: 'treatment treat medicine drug ivf iui therapy surgery procedure operation',
  period: 'period cycle menstruation menstrual menses',
  ovulation: 'ovulation ovulate egg',
  pregnancy:
    'pregnant pregnancy conceive conception baby child children fertility fertile infertility infertile barren mwana pamuviri ingane ukukhulelwa',
  test: 'test testing scan ultrasound blood exam examination check checkup screening hsg ropa igazi',
  partner: 'partner husband wife man male semen sperm spouse murume umyeni',
  worry:
    'stress stressed worried worry anxious anxiety sad depressed depression cry crying lonely alone upset hopeless feeling feelings kushushikana kusuruvara ukukhathazeka',
  family: 'family inlaw relative pressure blame',
  helper: 'doctor nurse clinic hospital chipatara isibhedlela dokota',
  time: 'month year long trying age old late',
  pain: 'pain painful hurt cramp kurwadziwa ubuhlungu',
};

// Phrases rewritten before words are split, so they count as one idea.
const PHRASES: [RegExp, string][] = [
  [/\bh(o)?w much\b/g, ' cost '],
  [/\bmedical aid\b/g, ' insurance '],
  [/\bhealth (worker|care|centre|center)\b/g, ' doctor '],
  [/\bin[- ]laws?\b|\bmother[- ]in[- ]law\b/g, ' inlaw '],
  [/\bfertile window\b/g, ' ovulation '],
];

function stem(w: string): string {
  if (w.length <= 3) return w;
  if (w.endsWith('ies') && w.length > 4) return `${w.slice(0, -3)}y`;
  if (/(ss|us|is)$/.test(w)) return w;
  if (/(sses|xes|zes|ches|shes)$/.test(w)) return w.slice(0, -2);
  let out = w.endsWith('s') ? w.slice(0, -1) : w;
  if (out.length > 5 && out.endsWith('ing')) out = out.slice(0, -3);
  else if (out.length > 5 && out.endsWith('ed') && !out.endsWith('eed')) out = out.slice(0, -2);
  return out;
}

function words(text: string): string[] {
  let t = text.toLowerCase().replace(/[’`]/g, "'");
  for (const [re, to] of PHRASES) t = t.replace(re, to);
  return t
    .replace(/'/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

const CONCEPT_OF = new Map<string, string[]>();
for (const [name, list] of Object.entries(CONCEPTS)) {
  for (const w of list.split(' ').map(stem)) CONCEPT_OF.set(w, [...(CONCEPT_OF.get(w) ?? []), `c:${name}`]);
}

const LEXICON = [...CONCEPT_OF.keys()].filter((w) => w.length >= 6);

// Extra ideas for one word: its group, an age that points to "when to see someone",
// and Shona or Ndebele words that carry a prefix, such as "wechipatara".
function ideas(w: string): string[] {
  const own = CONCEPT_OF.get(w);
  if (own) return own;
  if (/^(3\d|4\d|5\d)$/.test(w)) return ['c:time', 'age'];
  if (w.length < 7) return [];
  return LEXICON.filter((l) => w.includes(l)).flatMap((l) => CONCEPT_OF.get(l) ?? []);
}

// Each word brings its idea along, so "afford" and "price" meet in the middle.
const expand = (ws: string[]) => ws.flatMap((w) => [w, ...ideas(w)]);

function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

type Entry = { section: Section; route: Route; weights: Map<string, number> };
type Index = { entries: Entry[]; idf: Map<string, number>; vocab: string[] };

// Heading and search words count more than the body text.
function weigh(section: Section): Map<string, number> {
  const weights = new Map<string, number>();
  const add = (ws: string[], w: number) => {
    for (const t of expand(ws)) weights.set(t, (weights.get(t) ?? 0) + w);
  };
  add((section.keywords ?? []).flatMap(words), 3);
  add(words(section.heading), 2);
  add(section.body.flatMap(words), 1);
  return weights;
}

const cache = new WeakMap<Content, Index>();

function indexOf(c: Content): Index {
  const hit = cache.get(c);
  if (hit) return hit;
  const entries: Entry[] = [
    ...c.understand.sections.map((section) => ({ section, route: '/understand' as const })),
    ...c.costs.sections.map((section) => ({ section, route: '/costs' as const })),
    ...c.support.sections.map((section) => ({ section, route: '/support' as const })),
  ].map((e) => ({ ...e, weights: weigh(e.section) }));
  const df = new Map<string, number>();
  for (const e of entries) for (const t of e.weights.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const n = entries.length;
  const idf = new Map<string, number>();
  for (const [t, d] of df) idf.set(t, Math.log(1 + (n - d + 0.5) / (d + 0.5)));
  const vocab = [...df.keys()].filter((t) => !t.startsWith('c:'));
  const index = { entries, idf, vocab };
  cache.set(c, index);
  return index;
}

// A misspelt word ("ovulashun", "pregnat") is matched to the closest known word.
function repair(w: string, vocab: string[]): string {
  if (w.length < 6 || CONCEPT_OF.has(w) || vocab.includes(w)) return w;
  const max = w.length >= 9 ? 2 : 1;
  let best = w;
  let bestD = max + 1;
  for (const v of vocab) {
    const d = distance(w, v, max);
    if (d < bestD) {
      best = v;
      bestD = d;
    }
  }
  return best;
}

const MIN_SCORE = 0.9;
const SECOND_SHARE = 0.55;

function search(text: string, c: Content): { section: Section; route: Route }[] {
  const { entries, idf, vocab } = indexOf(c);
  const terms = new Set(expand(words(text).map((w) => repair(w, vocab))));
  if (terms.size === 0) return [];

  // The kind of question tells us which part of the app to favour.
  const prefer: Route | null = terms.has('c:cost') ? '/costs' : terms.has('c:worry') || terms.has('c:family') ? '/support' : null;

  return entries
    .map((e) => {
      let points = 0;
      for (const t of terms) {
        const w = e.weights.get(t);
        if (w) points += (idf.get(t) ?? 0) * (w / (w + 1.5)) * (t.startsWith('c:') ? 0.45 : 1.3);
      }
      if (prefer && e.route === prefer) points *= 2;
      return { e, points };
    })
    .filter((m) => m.points >= MIN_SCORE)
    .sort((a, b) => b.points - a.points)
    .filter((m, i, all) => i === 0 || (i === 1 && m.points >= all[0].points * SECOND_SHARE))
    .map((m) => ({ section: m.e.section, route: m.e.route }));
}

export function answer(question: string, c: Content): Answer {
  const text = question.toLowerCase().replace(/[’`]/g, "'").trim();

  if (PERSONAL.test(text)) return { kind: 'message', text: c.assistant.personalInfo };
  if (URGENT.test(text)) return { kind: 'urgent', section: c.support.urgent };
  if (DIAGNOSE.test(text)) return { kind: 'message', text: c.assistant.refuseDiagnose };
  if (PRESCRIBE.test(text)) return { kind: 'message', text: c.assistant.refusePrescribe };
  if (CLINIC.test(text)) return { kind: 'message', text: c.assistant.clinic };

  if (GREETING.test(text) && text.split(/\s+/).length <= 3) return { kind: 'message', text: c.assistant.intro };

  const matches = search(text, c);
  if (matches.length > 0) return { kind: 'sections', matches };
  return { kind: 'message', text: c.assistant.noMatch };
}

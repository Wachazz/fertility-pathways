import en from '../../../content/en.json';
import sn from '../../../content/sn.json';
import type { Content } from '../../i18n/LanguageContext';
import { merge } from '../../i18n/merge';
import { answer } from '../answer';

const c = en as Content;
const a = c.assistant;

const sectionIds = (q: string, content: Content = c) => {
  const r = answer(q, content);
  return r.kind === 'sections' ? r.matches.map((m) => m.section.id) : r.kind;
};

describe('safety rules', () => {
  it('blocks phone numbers and email addresses', () => {
    expect(answer('Call me on 0772 123 456', c)).toEqual({ kind: 'message', text: a.personalInfo });
    expect(answer('my email is tendai@example.com', c)).toEqual({ kind: 'message', text: a.personalInfo });
  });

  it('shows the urgent section for warning signs', () => {
    expect(answer('I have heavy bleeding', c)).toEqual({ kind: 'urgent', section: c.support.urgent });
    expect(answer('I fainted this morning', c)).toEqual({ kind: 'urgent', section: c.support.urgent });
    expect(answer('severe pain on one side', c).kind).toBe('urgent');
  });

  it('refuses to diagnose', () => {
    for (const q of ['Do I have PCOS?', 'Am I infertile?', 'What is wrong with me?', 'Will I ever get pregnant?']) {
      expect(answer(q, c)).toEqual({ kind: 'message', text: a.refuseDiagnose });
    }
  });

  it('refuses to recommend medicine', () => {
    for (const q of ['What medicine should I take?', 'Should I take clomid?', 'What dose of herbs?']) {
      expect(answer(q, c)).toEqual({ kind: 'message', text: a.refusePrescribe });
    }
  });

  it('points clinic questions to Find care', () => {
    expect(answer('Where is the nearest clinic?', c)).toEqual({ kind: 'message', text: a.clinic });
  });

  it('says so when nothing matches instead of guessing', () => {
    expect(answer('What is the capital of France?', c)).toEqual({ kind: 'message', text: a.noMatch });
  });
});

describe('safety order', () => {
  it('checks personal details before urgent signs', () => {
    expect(answer('heavy bleeding, call 0772 123 456', c)).toEqual({ kind: 'message', text: a.personalInfo });
  });

  it('checks urgent signs before diagnosis', () => {
    expect(answer('Do I have something? I have heavy bleeding', c).kind).toBe('urgent');
  });

  it('checks diagnosis before medicine', () => {
    expect(answer('Do I have PCOS and what medicine should I take?', c)).toEqual({
      kind: 'message',
      text: a.refuseDiagnose,
    });
  });

  it('checks medicine before clinics', () => {
    expect(answer('Which medicine does the nearest clinic give?', c)).toEqual({
      kind: 'message',
      text: a.refusePrescribe,
    });
  });
});

describe('search', () => {
  it('returns approved sections word for word', () => {
    const r = answer('How long should we try before seeing a doctor?', c);
    expect(r.kind).toBe('sections');
    if (r.kind === 'sections') expect(r.matches[0].section).toBe(c.understand.sections[1]);
  });

  it('returns at most two sections', () => {
    const r = answer('cost of tests, scan, blood, fee, price', c);
    expect(r.kind === 'sections' && r.matches.length).toBeLessThanOrEqual(2);
  });

  it('answers every suggested question from the content', () => {
    for (const q of a.suggestions) expect(answer(q, c).kind).toBe('sections');
  });

  it('matches the expected sections', () => {
    expect(sectionIds('Can my husband be tested?')).toContain('both-partners');
    expect(sectionIds('I feel sad and stressed')).toEqual(['feelings']);
  });

  it('keeps English search words when Shona is chosen', () => {
    const shona = merge(en, sn) as Content;
    expect(sectionIds('Can my husband be tested?', shona)).toContain('both-partners');
  });
});

describe('understands everyday wording', () => {
  it('sends money questions to the costs section', () => {
    expect(sectionIds('How much does IVF cost?')).toEqual(['treatment-cost']);
    expect(sectionIds("I can't afford treatment")).toEqual(['treatment-cost']);
    expect(sectionIds('is there medical aid for this')).toEqual(['cost-questions']);
    expect(sectionIds('how much is a scan')[0]).toBe('tests-cost');
  });

  it('forgives typing mistakes', () => {
    expect(sectionIds('I am so depressd and alone')).toEqual(['feelings']);
    expect(sectionIds('hw much is a scan')[0]).toBe('tests-cost');
  });

  it('knows family pressure and blame', () => {
    expect(sectionIds('my in-laws keep asking when I will have a baby')).toEqual(['family']);
    expect(sectionIds('my husband says it is my fault')).toEqual(['family']);
  });

  it('links an age to when to see a health worker', () => {
    expect(sectionIds('I am 38, should I wait')).toEqual(['when-help']);
  });

  it('answers general questions about getting pregnant but refuses predictions', () => {
    expect(sectionIds('can I get pregnant if my periods are irregular')).toEqual(['when-help']);
    expect(answer('Can I get pregnant?', c)).toEqual({ kind: 'message', text: a.refuseDiagnose });
  });

  it('shows urgent advice for more ways of describing danger', () => {
    for (const q of ['bleeding wont stop', 'soaking a pad every hour', 'unbearable belly pain', 'I collapsed']) {
      expect(answer(q, c).kind).toBe('urgent');
    }
  });

  it('greets back and does not guess on thanks or hello', () => {
    expect(answer('hello', c)).toEqual({ kind: 'message', text: a.intro });
    expect(answer('thanks', c)).toEqual({ kind: 'message', text: a.intro });
  });

  it('does not invent an answer for unrelated questions', () => {
    for (const q of ['tell me a joke', 'what is the weather', 'can I drink alcohol']) {
      expect(answer(q, c)).toEqual({ kind: 'message', text: a.noMatch });
    }
  });

  it('reaches costs from Shona and Ndebele words', () => {
    expect(sectionIds('mutengo wechipatara')).toContain('consultation');
    expect(sectionIds('imali yokuhlolwa')).toContain('consultation');
  });
});

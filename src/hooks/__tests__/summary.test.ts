import en from '../../../content/en.json';
import type { Content } from '../../i18n/LanguageContext';
import { buildSummaryText } from '../useChecklist';

const p = (en as Content).prepare;

describe('buildSummaryText', () => {
  it('lists every checklist item with its tick state and nothing else', () => {
    const text = buildSummaryText(p, new Set(['bring:periods']));
    const lines = text.split('\n').filter(Boolean);
    const expected = [
      p.shareTitle,
      ...p.steps.flatMap((s) => [s.title, ...s.items.map((i) => i.text)]),
    ];
    expect(lines).toHaveLength(expected.length);
    expect(text).toContain(`[x] ${p.steps[0].items[0].text}`);
    expect(text).toContain(`[ ] ${p.steps[0].items[1].text}`);
  });
});

describe('buildSummaryText with pathway answers', () => {
  it('adds an About me block before the checklist when answers exist', () => {
    const text = buildSummaryText(p, new Set(), ['Under 35', '12 months or more']);
    const lines = text.split('\n');
    expect(lines).toContain(p.aboutTitle);
    expect(lines).toContain('- Under 35');
    expect(lines.indexOf(p.aboutTitle)).toBeLessThan(lines.indexOf(p.steps[0].title));
  });
});

import { isComplete, merge } from '../merge';

const base = {
  title: 'Title',
  sections: [
    { id: 'a', heading: 'A', body: ['a1'], keywords: ['apple'] },
    { id: 'b', heading: 'B', body: ['b1'], keywords: ['banana'] },
  ],
};

describe('merge', () => {
  it('falls back to English for missing keys', () => {
    expect(merge(base, { title: 'Musoro' })).toEqual({ ...base, title: 'Musoro' });
  });

  it('matches sections by id and adds translated search words', () => {
    const out = merge(base, { sections: [{ id: 'b', keywords: ['bhanana'] }] }) as typeof base;
    expect(out.sections[0]).toEqual(base.sections[0]);
    expect(out.sections[1]).toEqual({ id: 'b', heading: 'B', body: ['b1'], keywords: ['banana', 'bhanana'] });
  });

  it('replaces plain lists of text', () => {
    expect(merge({ can: ['x', 'y'] }, { can: ['z'] })).toEqual({ can: ['z'] });
  });
});

describe('isComplete', () => {
  it('ignores search words when deciding if text is translated', () => {
    const over = {
      title: 'T',
      sections: [
        { id: 'a', heading: 'A', body: ['a'] },
        { id: 'b', heading: 'B', body: ['b'] },
      ],
    };
    expect(isComplete(base, over)).toBe(true);
  });

  it('is false when a section only has search words', () => {
    expect(isComplete(base, { title: 'T', sections: [{ id: 'a', keywords: [] }] })).toBe(false);
  });
});

import { buildPlan, triage } from '../plan';

describe('buildPlan', () => {
  it('under 35 keeps trying before 12 months with no risk sign', () => {
    expect(buildPlan('u35', '6-11', []).outcome).toBe('wait');
  });
  it('under 35 sees a health worker at 12 months', () => {
    expect(buildPlan('u35', '12', []).outcome).toBe('see');
  });
  it('35 to 39 sees a health worker from 6 months', () => {
    expect(buildPlan('35-39', 'lt6', []).outcome).toBe('wait');
    expect(buildPlan('35-39', '6-11', []).outcome).toBe('see');
  });
  it('40 or older always sees a health worker', () => {
    expect(buildPlan('40', 'lt6', []).outcome).toBe('see');
  });
  it('a risk sign brings the visit forward', () => {
    expect(buildPlan('u35', 'lt6', ['irregular']).outcome).toBe('see');
  });
  it('adds the infection and partner steps when they apply', () => {
    const p = buildPlan('u35', 'lt6', ['infection', 'partnerUntested']);
    expect(p.steps).toEqual(expect.arrayContaining(['sti', 'partner', 'lifestyle']));
  });
});

describe('triage', () => {
  it('urgent signs win', () => expect(triage(1, 2)).toBe('now'));
  it('soon signs next', () => expect(triage(0, 1)).toBe('soon'));
  it('nothing ticked', () => expect(triage(0, 0)).toBe('none'));
});

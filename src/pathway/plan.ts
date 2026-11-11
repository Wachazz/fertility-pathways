export type Age = 'u35' | '35-39' | '40';
export type Months = 'lt6' | '6-11' | '12';
export type Flag = 'irregular' | 'painful' | 'infection' | 'surgery' | 'partnerUntested';
export type StepId = 'timing' | 'lifestyle' | 'sti' | 'partner';

export type Plan = { outcome: 'see' | 'wait'; steps: StepId[] };

const SEE_FLAGS: Flag[] = ['irregular', 'painful', 'infection', 'surgery'];

// Rule based and fully offline. Thresholds follow common advice (12 months under 35,
// 6 months from 35, sooner from 40 or with a risk sign). A clinician must review them.
export function buildPlan(age: Age, months: Months, flags: readonly Flag[]): Plan {
  const riskSign = flags.some((f) => SEE_FLAGS.includes(f));
  const longEnough = age === 'u35' ? months === '12' : months !== 'lt6';
  const see = age === '40' || riskSign || longEnough;

  const steps: StepId[] = [];
  if (!see) steps.push('timing');
  steps.push('lifestyle');
  if (flags.includes('infection')) steps.push('sti');
  if (flags.includes('partnerUntested') || see) steps.push('partner');
  return { outcome: see ? 'see' : 'wait', steps };
}

export type UrgentLevel = 'now' | 'soon' | 'none';

// Any urgent sign wins over everything else.
export function triage(urgentCount: number, soonCount: number): UrgentLevel {
  if (urgentCount > 0) return 'now';
  if (soonCount > 0) return 'soon';
  return 'none';
}

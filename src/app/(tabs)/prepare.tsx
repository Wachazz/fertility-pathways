import { hasDraft } from '../../components/DraftBanner';
import { ChecklistStep } from '../../components/prepare/ChecklistStep';
import { PrepareSummary } from '../../components/prepare/PrepareSummary';
import { StepFooter } from '../../components/prepare/StepFooter';
import { StepProgress } from '../../components/prepare/StepProgress';
import { Screen } from '../../components/Screen';
import { useChecklist } from '../../hooks/useChecklist';
import { useLang } from '../../i18n/LanguageContext';
import { confirm } from '../../lib/confirm';
import { describeAnswers, usePathwayAnswers } from '../../pathway/answers';

// Guided journey: three checklist steps, then a summary to share or save.
export default function Prepare() {
  const { c } = useLang();
  const p = c.prepare;
  const about = describeAnswers(c.pathway, usePathwayAnswers());
  const list = useChecklist(p, about);
  const startAgain = async () => {
    if (!list.hasTicks || (await confirm(p.confirmReset, p.confirmYes, p.confirmNo))) list.reset();
  };
  const label = p.stepOf.replace('{n}', String(list.step + 1)).replace('{total}', String(list.total));

  const footer = (
    <StepFooter
      backLabel={p.back}
      nextLabel={list.onSummary ? p.startAgain : p.next}
      canGoBack={list.step > 0}
      onBack={() => list.setStep(list.step - 1)}
      onNext={list.onSummary ? startAgain : () => list.setStep(list.step + 1)}
    />
  );

  return (
    <Screen contentKey="prepare" draft={hasDraft(p.steps)} footer={footer}>
      <StepProgress step={list.step} total={list.total} label={label} summaryLabel={p.summaryStep} />
      {list.onSummary ? (
        <PrepareSummary p={p} isChecked={list.isChecked} summaryText={list.summaryText} about={about} />
      ) : (
        <ChecklistStep step={p.steps[list.step]} isChecked={list.isChecked} toggle={list.toggle} />
      )}
    </Screen>
  );
}

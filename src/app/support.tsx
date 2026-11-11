import { Accordion } from '../components/Accordion';
import { hasDraft } from '../components/DraftBanner';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { useLang } from '../i18n/LanguageContext';

// The urgent section is always fully open at the top; the rest can be expanded.
export default function Support() {
  const { c } = useLang();
  const { urgent, sections } = c.support;
  return (
    <Screen contentKey="support" draft={hasDraft([urgent, ...sections])}>
      <SectionCard section={urgent} tone="urgent" />
      {sections.map((s) => (
        <Accordion key={s.id} section={s} />
      ))}
    </Screen>
  );
}

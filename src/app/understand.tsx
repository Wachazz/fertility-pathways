import { Accordion } from '../components/Accordion';
import { hasDraft } from '../components/DraftBanner';
import { Screen } from '../components/Screen';
import { useLang } from '../i18n/LanguageContext';

export default function Understand() {
  const { c } = useLang();
  const { sections } = c.understand;
  return (
    <Screen contentKey="understand" draft={hasDraft(sections)}>
      {sections.map((s) => (
        <Accordion key={s.id} section={s} />
      ))}
    </Screen>
  );
}

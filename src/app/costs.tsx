import { Accordion } from '../components/Accordion';
import { hasDraft } from '../components/DraftBanner';
import { Notice } from '../components/Notice';
import { Screen } from '../components/Screen';
import { useLang } from '../i18n/LanguageContext';

export default function Costs() {
  const { c } = useLang();
  const { intro, sections } = c.costs;
  return (
    <Screen contentKey="costs" draft={hasDraft(sections)}>
      <Notice text={intro} />
      {sections.map((s) => (
        <Accordion key={s.id} section={s} />
      ))}
    </Screen>
  );
}

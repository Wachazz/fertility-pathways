import { hasDraft } from '../components/DraftBanner';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { useLang } from '../i18n/LanguageContext';

export default function Privacy() {
  const { c } = useLang();
  const { sections } = c.privacy;
  return (
    <Screen contentKey="privacy" draft={hasDraft(sections)}>
      {sections.map((s) => (
        <SectionCard key={s.id} section={s} />
      ))}
    </Screen>
  );
}

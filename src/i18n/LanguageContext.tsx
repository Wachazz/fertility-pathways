import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import en from '../../content/en.json';
import sn from '../../content/sn.json';
import nd from '../../content/nd.json';
import { isComplete, merge } from './merge';

export type Lang = 'en' | 'sn' | 'nd';
export type Content = typeof en;
export type Section = {
  id: string;
  reviewed: boolean;
  heading: string;
  body: string[];
  keywords?: string[];
};

export const LANGUAGES: { code: Lang; name: string; local: string }[] = [
  { code: 'en', name: 'English', local: 'English' },
  { code: 'sn', name: 'Shona', local: 'chiShona' },
  { code: 'nd', name: 'Ndebele', local: 'isiNdebele' },
];

const files: Record<Lang, unknown> = { en, sn, nd };

type LanguageValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  c: Content;
  // False when part of this top-level section is still showing English.
  translated: (key: keyof Content) => boolean;
};

const LanguageContext = createContext<LanguageValue | null>(null);

// The choice lives in memory only. Nothing about the user is written to the device.
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const value = useMemo<LanguageValue>(() => {
    const file = files[lang] as Record<string, unknown>;
    return {
      lang,
      setLang,
      c: merge(en, file) as Content,
      translated: (key) => lang === 'en' || isComplete(en[key], file[key]),
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLang must be used inside LanguageProvider');
  return value;
}

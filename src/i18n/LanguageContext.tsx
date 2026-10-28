'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  htmlLangMap,
  type Language,
  type RouteLanguage,
  routeToLanguage,
  languageToRoute,
} from './locales';
import { translations } from './catalog-base';
import { getTranslation } from './translation';
import { jaTranslations } from './catalog-ja';
import { esTranslations } from './catalog-es';
import { koTranslations } from './catalog-ko';

export type { Language, RouteLanguage } from './locales';
export { translations, jaTranslations, esTranslations, koTranslations };

function applyLanguageOverlay(targetLanguage: 'ES' | 'KO', entries: Record<string, string>) {
  Object.entries(entries).forEach(([key, value]) => {
    if (!translations[key]) translations[key] = { EN: value, ZH: value };
    translations[key][targetLanguage] = value;
  });
}

applyLanguageOverlay('ES', esTranslations);
applyLanguageOverlay('KO', koTranslations);

export interface LanguageContextType {
  language: Language;
  routeLang: RouteLanguage;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({
  children,
  initialRouteLanguage = 'en',
}: {
  children: ReactNode;
  initialRouteLanguage?: RouteLanguage;
}) {
  const [routeLang, setRouteLang] = useState<RouteLanguage>(initialRouteLanguage);
  const language = routeToLanguage(routeLang);

  const t = (key: string): string => {
    return getTranslation(key, routeLang);
  };

  const handleSetLanguage = (newLang: Language) => {
    const newRoute = languageToRoute(newLang);
    setRouteLang(newRoute);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const htmlLang = htmlLangMap[routeLang] || 'en';
      document.documentElement.lang = htmlLang;
    }
  }, [routeLang]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        routeLang,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

'use client';

import { useLanguage } from '@/i18n/LanguageContext';
import { NotFoundView } from '@/shared/ui/not-found-view';

export default function LocalizedNotFound() {
  const { routeLang } = useLanguage();
  return <NotFoundView lang={routeLang} standalone={false} />;
}

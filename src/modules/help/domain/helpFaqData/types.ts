import type { RouteLanguage } from '@/i18n/locales';

export type HelpFaqLinkTarget = 'rent' | 'manage' | 'locations' | 'support' | 'important';
export type LocaleText = Record<RouteLanguage, string>;

export type HelpFaqExternalLink = {
  href: string;
  label: string;
};

export type HelpFaqExternalLinkDefinition = {
  href: string;
  label: LocaleText;
};

export type HelpFaqReferenceLink = {
  href: string;
  label: string;
};

export type HelpFaqReferenceLinkDefinition = {
  href: string;
  label: LocaleText;
};

export type HelpFaqQuestion = {
  id: string;
  question: string;
  answer: string[];
  relatedLinks: HelpFaqLinkTarget[];
  externalLinks: HelpFaqExternalLink[];
  referenceLinks: HelpFaqReferenceLink[];
};

export type HelpFaqQuestionDefinition = {
  id: string;
  question: LocaleText;
  answer: LocaleText;
  relatedLinks: HelpFaqLinkTarget[];
  externalLinks?: HelpFaqExternalLinkDefinition[];
  referenceLinks?: HelpFaqReferenceLinkDefinition[];
};

export function localizeQuestions(definitions: HelpFaqQuestionDefinition[], lang: RouteLanguage): HelpFaqQuestion[] {
  return definitions.map((definition) => ({
    id: definition.id,
    question: definition.question[lang],
    answer: [definition.answer[lang]],
    relatedLinks: definition.relatedLinks,
    externalLinks: (definition.externalLinks ?? []).map((link) => ({
      href: link.href,
      label: link.label[lang],
    })),
    referenceLinks: (definition.referenceLinks ?? []).map((link) => ({
      href: link.href.replace('{lang}', lang),
      label: link.label[lang],
    })),
  }));
}

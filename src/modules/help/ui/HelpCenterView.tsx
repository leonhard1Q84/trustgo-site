'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { GuestBookingLink } from '@/modules/booking-management/public-api';
import {
  CalendarPlus,
  CarFront,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  KeyRound,
  LifeBuoy,
  Mail,
  PackageSearch,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useMediaQuery } from '@/shared/ui/use-media-query';
import { getHelpFaq, getHelpFaqTopicList } from '../domain/helpFaq';
import {
  getHelpCenterNavigation,
  type HelpCenterCategoryId,
} from '../domain/help-center-navigation';
import HelpAnswerRenderer from './HelpAnswerRenderer';

const categoryIcons: Record<HelpCenterCategoryId, LucideIcon> = {
  making: CalendarPlus,
  managing: ClipboardList,
  pickup: KeyRound,
  during: CarFront,
  return: KeyRound,
  billing: CircleDollarSign,
};
const container = 'mx-auto w-full max-w-default px-4 md:px-8 lg:px-10';
const textLink =
  'inline-flex min-h-11 items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-control [&_svg]:text-foreground-secondary';

export default function HelpCenterView({ lang }: { lang: RouteLanguage }) {
  const t = (key: string) => getTranslation(key, lang);
  const faq = getHelpFaq(lang);
  const topics = useMemo(() => getHelpFaqTopicList(lang), [lang]);
  const categories = useMemo(() => getHelpCenterNavigation(lang), [lang]);
  const [category, setCategory] = useState<string>('making');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terms = searchQuery
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase(lang)
    .split(/\s+/)
    .filter(Boolean);
  const results = terms.length
    ? topics.flatMap((topic) =>
        topic.questions
          .filter((question) => {
            const haystack = [topic.title, ...topic.keywords, question.question, ...question.answer]
              .join(' ')
              .normalize('NFKC')
              .toLocaleLowerCase(lang);
            return terms.every((term) => haystack.includes(term));
          })
          .map((question) => ({ topic, question }))
      )
    : [];
  const isSearching = terms.length > 0;
  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    inputRef.current?.focus();
  };
  const quickLinks = [
    { label: t('help_center_manage'), href: `/${lang}/manage-booking` },
    {
      label: t('help_center_cancel'),
      href: `/${lang}/help/faq/managing-a-reservation#how-to-cancel-reservation`,
    },
    {
      label: t('service_roadside'),
      href: `/${lang}/help/faq/during-your-rental#roadside-assistance-services`,
    },
    {
      label: t('help_center_receipt'),
      href: `/${lang}/help/faq/during-your-rental#post-return-payment-proof-and-invoices`,
    },
  ];

  return (
    <article className="bg-background text-body text-foreground">
      <header className="border-b border-border bg-muted pt-6 pb-12 lg:pt-8 lg:pb-16">
        <div className={`${container} text-center`}>
          <h1 className="text-h1 font-semibold lg:text-h1-desktop">{t('help_center_title')}</h1>
          <p className="mt-4 text-body-large lg:mt-6 text-foreground-secondary">
            {t('help_center_intro')}{' '}
            <Link href={`/${lang}/help/customer-service#contact`} className={textLink}>
              {t('help_center_contact')}
            </Link>
          </p>
          <form
            role="search"
            aria-label={t('help_center_search')}
            className="mx-auto mt-4 flex min-h-14 max-w-2xl items-center gap-2 rounded-card border border-border bg-background p-1.5 shadow-raised lg:mt-6 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchQuery(searchInput.trim());
              // Wait for the results region to mount before moving keyboard focus.
              requestAnimationFrame(() => resultsHeading.current?.focus());
            }}
          >
            <label htmlFor="help-search" className="sr-only">
              {t('help_center_search')}
            </label>
            <input
              ref={inputRef}
              id="help-search"
              type="search"
              autoComplete="off"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t('help_center_placeholder')}
              className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-body-large text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searchInput && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                aria-label={t('help_center_clear')}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-control"
              aria-label={t('help_center_search')}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>
          </form>
          <nav aria-label={t('help_center_quick')} className="mt-6">
            <ul className="flex flex-wrap justify-center gap-2">
              {quickLinks.map((link) => (
                <li key={link.href} className="min-w-0 max-w-full">
                  <GuestBookingLink
                    href={link.href}
                    className="inline-flex min-h-11 max-w-full items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-body font-medium text-foreground transition-colors hover:border-border-strong hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </GuestBookingLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className={`${container} py-12 lg:py-16`}>
        {isSearching ? (
          <section aria-labelledby="help-results-title" className="mx-auto max-w-4xl">
            <div className="mb-4 flex flex-wrap lg:mb-6 items-center justify-between gap-3 border-b border-border pb-4">
              <h2
                id="help-results-title"
                ref={resultsHeading}
                tabIndex={-1}
                className="rounded-control text-h2 font-semibold lg:text-h2-desktop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-live="polite"
              >
                {t('help_center_results').replace(
                  '{count}',
                  new Intl.NumberFormat(lang).format(results.length)
                )}
              </h2>
              <Button
                variant="ghost"
                onClick={clearSearch}
                className="text-body"
              >
                {t('help_center_browse')}
              </Button>
            </div>
            {results.length ? (
              <div className="divide-y divide-border">
                {results.map(({ topic, question }) => (
                  <details key={`${topic.id}-${question.id}`} className="group py-1">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-control py-4 hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0">
                        <span className="mb-1 block text-caption text-muted-foreground">
                          {topic.title}
                        </span>
                        <span className="text-title font-semibold">{question.question}</span>
                      </span>
                      <ChevronDown
                        className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="pb-6">
                      <HelpAnswerRenderer
                        answer={question.answer}
                        referenceLinks={question.referenceLinks}
                        externalLinks={question.externalLinks}
                      />
                      <Link
                        href={`/${lang}/help/faq/${topic.id}#${question.id}`}
                        className={`${textLink} mt-3`}
                      >
                        {faq.copy.viewTopic}
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Search
                  className="mx-auto mb-4 h-12 w-12 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="text-h3 font-semibold lg:text-h3-desktop">
                  {t('help_center_empty')}
                </h3>
                <p className="mx-auto mt-4 max-w-lg text-body text-foreground-secondary">
                  {t('help_center_empty_body')}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={clearSearch}
                    className="text-body"
                  >
                    {t('help_center_browse')}
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="text-body"
                  >
                    <Link href={`/${lang}/help/customer-service#contact`}>
                      {t('help_center_contact')}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section aria-labelledby="help-topics-title">
            <h2 id="help-topics-title" className="sr-only">
              {faq.copy.browseTitle}
            </h2>
            <Tabs
              value={category}
              onValueChange={setCategory}
              orientation={isDesktop ? 'vertical' : 'horizontal'}
              className="grid min-w-0 gap-6 lg:grid-cols-12 lg:gap-12"
            >
              <TabsList
                aria-label={faq.copy.browseTitle}
                className="flex min-w-0 gap-2 overflow-x-auto p-1 lg:col-span-4 lg:flex-col lg:gap-1 lg:overflow-visible"
              >
                {categories.map((item) => {
                  const Icon = categoryIcons[item.id];
                  return (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="flex min-h-12 shrink-0 cursor-pointer items-center gap-3 rounded-control border-b-2 border-transparent px-4 py-3 text-left text-body font-medium text-foreground-secondary transition-colors hover:bg-muted hover:text-foreground active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:border-foreground data-[state=active]:font-semibold data-[state=active]:text-foreground lg:w-full lg:shrink lg:rounded-control lg:border-b-0 lg:data-[state=active]:border-transparent lg:text-title lg:data-[state=active]:bg-muted lg:data-[state=active]:text-foreground"
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span className="whitespace-nowrap lg:whitespace-normal">{item.title}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {categories.map((item) => (
                <TabsContent
                  key={item.id}
                  value={item.id}
                  forceMount
                  hidden={category !== item.id}
                  className={`${category !== item.id ? 'hidden' : 'block'} min-w-0 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:col-span-8`}
                >
                  <h3 className="mb-4 text-h3 font-semibold lg:sr-only">{item.title}</h3>
                  <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
                    {item.links.map((link) => (
                      <li key={link.href} className="min-w-0">
                        <GuestBookingLink
                          href={link.href}
                          className="group flex h-full min-h-24 items-center justify-between gap-4 rounded-card border border-border bg-background p-4 text-title font-semibold transition-all duration-150 hover:border-border-strong hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:p-6"
                        >
                          <span className="min-w-0 break-words underline-offset-4 group-hover:underline">
                            {link.title}
                          </span>
                          <ChevronRight
                            className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground"
                            aria-hidden="true"
                          />
                        </GuestBookingLink>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        )}
      </div>

      <section
        aria-labelledby="help-support-title"
        className="border-t border-border bg-muted py-12 lg:py-16"
      >
        <div className={`${container} grid gap-8 lg:grid-cols-12 lg:gap-6`}>
          <div className="lg:col-span-5">
            <h2 id="help-support-title" className="text-h2 font-semibold lg:text-h2-desktop">
              {t('help_center_support_title')}
            </h2>
            <p className="mt-4 text-body lg:mt-6 text-foreground-secondary">
              {t('help_center_support_body')}
            </p>
            <Button
              asChild
              variant="secondary"
              className="mt-6 max-w-full whitespace-normal text-center text-body"
            >
              <Link href={`/${lang}/help/customer-service#contact`}>
                {t('help_center_contact')}
              </Link>
            </Button>
          </div>
          <div className="lg:col-span-3">
            <h3 className="flex items-center gap-2 text-h3 font-semibold lg:text-h3-desktop">
              <PackageSearch className="h-5 w-5 shrink-0" aria-hidden="true" />
              {t('service_lost_found')}
            </h3>
            <p className="mt-4 text-body lg:mt-6 text-foreground-secondary">
              {t('help_center_lost_body')}
            </p>
            <Link
              href={`/${lang}/help/customer-service#after-rental`}
              className={`${textLink} mt-2`}
            >
              {t('help_center_lost_link')}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="lg:col-span-4">
            <h3 className="flex items-center gap-2 text-h3 font-semibold lg:text-h3-desktop">
              <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
              {t('help_center_email')}
            </h3>
            <p className="mt-4 text-body lg:mt-6 text-foreground-secondary">
              {t('help_center_email_body')}
            </p>
            <a href="mailto:soren.yang@trustgo.tech" className={`${textLink} mt-2 break-all`}>
              {t('contact_send_email')}
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <div
        className={`${container} flex items-start gap-3 py-4 text-caption text-muted-foreground`}
      >
        <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>{t('service_terms')}</p>
      </div>
    </article>
  );
}

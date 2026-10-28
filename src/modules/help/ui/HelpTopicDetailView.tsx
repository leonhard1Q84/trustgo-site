'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  CalendarPlus,
  CarFront,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileCheck2,
  KeyRound,
  LifeBuoy,
  Route,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

import {
  getHelpFaq,
  getHelpFaqTopicList,
  type HelpFaqLinkTarget,
  type HelpFaqTopic,
  type HelpFaqTopicId,
} from '../domain/helpFaq';
import type { RouteLanguage } from '@/i18n/locales';
import HelpAnswerRenderer from './HelpAnswerRenderer';

const container = 'mx-auto w-full max-w-default px-4 md:px-8 lg:px-10';

const topicIcons: Record<HelpFaqTopicId, LucideIcon> = {
  'making-a-reservation': CalendarPlus,
  'managing-a-reservation': ClipboardList,
  'driver-requirements': FileCheck2,
  'vehicles-and-extras': CarFront,
  'pricing-payment-and-deposit': CircleDollarSign,
  'protection-and-liability': ShieldCheck,
  'pickup-and-return': KeyRound,
  'fuel-mileage-and-travel': Route,
  'during-your-rental': LifeBuoy,
};

function getTargetHref(lang: RouteLanguage, target: HelpFaqLinkTarget) {
  if (target === 'rent') return `/${lang}/rent`;
  if (target === 'manage') return `/${lang}/manage-booking`;
  if (target === 'locations') return `/${lang}/locations`;
  if (target === 'important') return `/${lang}/help/faq/managing-a-reservation`;
  return `/${lang}/help/customer-service#contact`;
}

function getRelatedTopics(allTopics: HelpFaqTopic[], currentTopic: HelpFaqTopic) {
  return allTopics.filter((topic) => topic.id !== currentTopic.id).slice(0, 3);
}

export default function HelpTopicDetailView({
  lang,
  topic,
}: {
  lang: RouteLanguage;
  topic: HelpFaqTopic;
}) {
  const faq = getHelpFaq(lang);
  const relatedTopics = getRelatedTopics(getHelpFaqTopicList(lang), topic);
  const Icon = topicIcons[topic.id] ?? FileCheck2;

  const [activeId, setActiveId] = useState<string>(topic.questions[0]?.id ?? '');

  useEffect(() => {
    if (typeof window === 'undefined' || !topic.questions.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const topEntry = visible.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 0.1, 0.5],
      }
    );

    topic.questions.forEach((q) => {
      const el = document.getElementById(q.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [topic.questions]);

  return (
    <article className="min-h-screen bg-muted/30 text-foreground pb-16">
      {/* Header */}
      <header className="border-b border-border bg-background py-6">
        <div className={container}>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <li>
                <Link
                  href={`/${lang}/help`}
                  className="hover:text-foreground transition-colors"
                >
                  {faq.copy.backToHelp}
                </Link>
              </li>
              <li aria-hidden="true" className="text-border-strong">
                /
              </li>
              <li className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
                {topic.title}
              </li>
            </ol>
          </nav>

          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-muted text-foreground border border-border">
              <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-h1 font-semibold lg:text-h1-desktop text-foreground">
                {topic.title}
              </h1>
              <p className="mt-1 text-body text-foreground-secondary">
                {topic.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main 2-Column Grid */}
      <div className={`${container} grid gap-8 py-8 lg:grid-cols-[16rem_minmax(0,1fr)]`}>
        {/* Table of Contents (Desktop Sticky) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-card border border-border bg-background p-4">
            <p className="text-caption font-semibold text-muted-foreground">
              {faq.copy.onThisPage}
            </p>
            <nav className="mt-3 space-y-1">
              {topic.questions.map((question) => {
                const isActive = activeId === question.id;
                return (
                  <a
                    key={question.id}
                    href={`#${question.id}`}
                    className={`block rounded-control px-2.5 py-1.5 text-body transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-muted font-semibold text-foreground'
                        : 'text-foreground-secondary hover:bg-muted/60 hover:text-foreground font-normal'
                    }`}
                  >
                    {question.question}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* FAQs Stream */}
        <div className="space-y-6">
          {/* Mobile Quick Jump Bar */}
          <nav
            aria-label={faq.copy.onThisPage}
            className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-none flex gap-2 pb-1"
          >
            {topic.questions.map((question, index) => {
              const isActive = activeId === question.id;
              return (
                <a
                  key={question.id}
                  href={`#${question.id}`}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-caption transition-colors ${
                    isActive
                      ? 'bg-foreground text-background font-semibold'
                      : 'bg-muted text-foreground-secondary hover:text-foreground'
                  }`}
                >
                  <span className="opacity-70">{String(index + 1).padStart(2, '0')}</span>
                  <span className="max-w-[160px] truncate">{question.question}</span>
                </a>
              );
            })}
          </nav>

          {/* Important Terms Notice */}
          <section className="rounded-card border border-border bg-muted/40 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-title font-semibold text-foreground">
                  {faq.copy.bookingTermsTitle}
                </h2>
                <p className="mt-1 text-body text-foreground-secondary">
                  {faq.copy.bookingTermsBody}
                </p>
              </div>
            </div>
          </section>

          {/* Question Cards */}
          <section className="space-y-4">
            {topic.questions.map((question, index) => (
              <article
                key={question.id}
                id={question.id}
                className="scroll-mt-24 rounded-card border border-border bg-background p-5 sm:p-6"
              >
                {/* Question Title */}
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-control bg-muted text-caption font-semibold text-foreground-secondary mt-0.5 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-title font-semibold text-foreground lg:text-h3">
                    {question.question}
                  </h2>
                </div>

                {/* Answer Content */}
                <div className="mt-3 pl-0 sm:pl-9">
                  <HelpAnswerRenderer
                    answer={question.answer}
                    referenceLinks={question.referenceLinks}
                    externalLinks={question.externalLinks}
                  />
                </div>
              </article>
            ))}
          </section>

          {/* Related Topics */}
          <section className="border-t border-border pt-8 mt-10">
            <div className="flex items-center gap-2 mb-4">
              <BookOpenText className="h-5 w-5 text-foreground-secondary" aria-hidden="true" />
              <h2 className="text-title font-semibold text-foreground lg:text-h3">
                {faq.copy.relatedTopics}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedTopics.map((relatedTopic) => {
                const RelatedIcon = topicIcons[relatedTopic.id] ?? FileCheck2;
                return (
                  <Link
                    key={relatedTopic.id}
                    href={`/${lang}/help/faq/${relatedTopic.id}`}
                    className="group rounded-card border border-border bg-background p-4 hover:border-border-strong transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <RelatedIcon
                        className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors"
                        aria-hidden="true"
                      />
                      <h3 className="mt-2.5 text-title font-semibold text-foreground group-hover:text-primary transition-colors">
                        {relatedTopic.shortTitle}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-caption text-foreground-secondary leading-relaxed">
                        {relatedTopic.description}
                      </p>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-caption font-semibold text-primary">
                      <span>{faq.copy.viewTopic}</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Support CTA */}
          <section className="rounded-card border border-border bg-muted/40 p-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-title font-semibold text-foreground lg:text-h3">
                  {faq.copy.supportTitle}
                </h2>
                <p className="mt-1 text-body text-foreground-secondary max-w-lg">
                  {faq.copy.supportIntro}
                </p>
              </div>
              <Link
                href={getTargetHref(lang, 'support')}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-control bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 text-body font-semibold transition-colors cursor-pointer"
              >
                <span>{faq.copy.linkLabels.support}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

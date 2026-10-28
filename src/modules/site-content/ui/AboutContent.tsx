import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Compass, Headphones, MapPin, ReceiptText, ShieldCheck } from 'lucide-react';
import { routeToLanguage, type RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
import { marketHeroImages, marketLandingConfigs } from '@/modules/destinations/public-api';
import { Button } from '@/shared/ui/button';
import { getAboutSections, getAboutStandards } from '../domain/about';

const standardIcons = {
  price: ReceiptText,
  pickup: MapPin,
  rules: ShieldCheck,
  support: Headphones,
};
const promiseIcons = [MapPin, ShieldCheck, Compass];
const textLink =
  'inline-flex min-h-11 items-center gap-2 text-body font-semibold text-primary underline-offset-4 hover:underline';

export default function AboutContent({ lang }: { lang: RouteLanguage }) {
  const t = (key: string) => getTranslation(key, lang);
  const language = routeToLanguage(lang);

  return (
    <article className="bg-background text-foreground">
      <header className="mx-auto max-w-default px-4 py-8 md:px-8 lg:px-10 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5">
            <h1 className="text-body font-semibold">{t('slug_about_title')}</h1>
            <p className="text-h1 font-bold tracking-tight lg:text-h1-desktop">
              {t('about_hero_title')}
            </p>
            <p className="max-w-reading text-body-large text-foreground-secondary">
              {t('about_hero_body')}
            </p>
            <p className="text-body font-semibold">{t('brand_slogan')}</p>
            <Button asChild>
              <Link href={`/${lang}/car-rental`}>
                {t('about_destinations_cta')}
                <ArrowRight className="ml-2 size-4 shrink-0" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="relative aspect-3/2 overflow-hidden rounded-card">
            <Image
              src="/images/destinations/japan-roadtrip.jpg"
              alt={t('about_hero_alt')}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-default space-y-12 px-4 pb-12 md:px-8 lg:space-y-20 lg:px-10 lg:pb-20">
        <section aria-labelledby="about-story-title" className="pt-4 lg:pt-8">
          <div className="max-w-reading space-y-4">
            <h2 id="about-story-title" className="text-h2 font-bold lg:text-h2-desktop">
              {t('about_story_title')}
            </h2>
            <p className="text-body-large text-foreground-secondary">{t('about_intro')}</p>
          </div>
          <div className="mt-8 grid gap-8 border-t border-border pt-8 lg:grid-cols-3">
            {getAboutSections(lang).map((section, index) => {
              const Icon = promiseIcons[index];
              return (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-title`}
                  className="scroll-mt-24 space-y-3"
                >
                  <Icon className="size-6" aria-hidden="true" />
                  <h3
                    id={`${section.id}-title`}
                    className="text-h3 font-semibold lg:text-h3-desktop"
                  >
                    {section.title}
                  </h3>
                  <p className="text-body text-foreground-secondary">{section.body}</p>
                </section>
              );
            })}
          </div>
        </section>

        <section
          id="service-standards"
          aria-labelledby="about-standards-title"
          className="scroll-mt-24"
        >
          <div className="max-w-reading space-y-4">
            <h2 id="about-standards-title" className="text-h2 font-bold lg:text-h2-desktop">
              {t('about_standards_title')}
            </h2>
            <p className="text-body text-foreground-secondary">{t('about_standards_body')}</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {getAboutStandards(lang).map((standard) => {
              const Icon = standardIcons[standard.id];
              return (
                <div
                  key={standard.id}
                  className="flex flex-col rounded-card border border-border p-6"
                >
                  <Icon className="mb-4 size-6" aria-hidden="true" />
                  <h3 className="text-h3 font-semibold">{standard.title}</h3>
                  <p className="mb-4 mt-3 text-body text-foreground-secondary">{standard.body}</p>
                  <Link href={standard.href} className={`${textLink} mt-auto self-start`}>
                    {standard.label}
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="network"
          aria-labelledby="about-destinations-title"
          className="scroll-mt-24 border-t border-border pt-8 lg:pt-12"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-reading space-y-3">
              <h2 id="about-destinations-title" className="text-h2 font-bold lg:text-h2-desktop">
                {t('about_destinations_title')}
              </h2>
              <p className="text-body text-foreground-secondary">{t('about_destinations_body')}</p>
            </div>
            <Link href={`/${lang}/locations`} className={`${textLink} shrink-0 self-start`}>
              {t('about_locations_cta')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {marketLandingConfigs.map((market) => (
              <Link
                key={market.marketSlug}
                href={`/${lang}/car-rental/${market.marketSlug}`}
                className="group block rounded-card"
              >
                <div className="relative aspect-3/2 overflow-hidden rounded-card">
                  <Image
                    src={marketHeroImages[market.marketSlug]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 flex min-h-11 items-center justify-between gap-3">
                  <h3 className="text-title font-semibold underline-offset-4 group-hover:underline">
                    {market.localizedNames[language]}
                  </h3>
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

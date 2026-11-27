import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileCheck2, KeyRound, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import type { Dictionary } from '@/i18n/dictionaries';

interface PopularDestinationsProps {
  lang: Locale;
  destinations: Dictionary['home']['destinations'];
}

const stepIcons = {
  book: ShieldCheck,
  verify: FileCheck2,
  pickup: KeyRound,
} as const;

/**
 * Japan-focused homepage destination grid (2 columns on mobile, 3 on tablet/desktop)
 * paired with a concise 3-step pickup flow.
 */
export function PopularDestinations({ lang, destinations }: PopularDestinationsProps) {
  return (
    <section className="w-full bg-background py-10 lg:py-14">
      <div className="mx-auto max-w-default px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-h2 lg:text-h2-desktop font-semibold tracking-tight text-foreground">
            {destinations.sectionTitle}
          </h2>

          <Link
            href={`/${lang}/car-rental/japan`}
            className="inline-flex min-h-11 sm:min-h-0 shrink-0 items-center gap-1.5 text-body font-semibold text-primary transition-colors duration-150 hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-control"
          >
            <span>{destinations.viewAll}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-5 md:grid-cols-3 md:gap-6">
          {destinations.cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${lang}/${city.hrefSuffix}`}
              className="group block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card bg-muted">
                <Image
                  src={city.image}
                  alt={city.title}
                  fill
                  sizes="(max-width: 767px) 50vw, 33vw"
                  className="object-cover transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-2.5 space-y-0.5 sm:mt-3">
                <h3 className="text-body sm:text-title font-semibold text-foreground">
                  {city.title}
                </h3>
                <p className="text-caption text-foreground-secondary">{city.hubs}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-8 lg:mt-12 lg:pt-10">
          <h3 className="text-h3 lg:text-h3-desktop font-semibold tracking-tight text-foreground">
            {destinations.pickupSteps.heading}
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {destinations.pickupSteps.items.map((step) => {
              const Icon = stepIcons[step.id];
              return (
                <div key={step.id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-caption font-semibold tabular-nums text-muted-foreground">
                        {step.stepNumber}
                      </span>
                      <Icon
                        className="h-4 w-4 shrink-0 text-foreground-secondary"
                        aria-hidden="true"
                      />
                    </div>
                    <h4 className="mt-2 text-title font-semibold text-foreground">{step.title}</h4>
                    <p className="mt-1 text-caption sm:text-body text-foreground-secondary">
                      {step.desc}
                    </p>
                  </div>

                  <Link
                    href={`/${lang}/${step.hrefSuffix}`}
                    className="mt-2.5 inline-flex min-h-11 sm:min-h-0 items-center gap-1.5 self-start text-body font-semibold text-primary transition-colors duration-150 hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-control"
                  >
                    <span>{step.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/i18n/locales';
import { Dictionary } from '@/i18n/dictionaries';
import { ArrowRight, MapPin } from 'lucide-react';

interface RoadTripInspirationsProps {
  lang: Locale;
  dict: Dictionary;
}

export function RoadTripInspirations({ lang, dict }: RoadTripInspirationsProps) {
  const t = dict.home.inspirations;

  return (
    <section className="w-full py-20 bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {t.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-foreground-secondary mt-2">
              {t.sectionSubtitle}
            </p>
          </div>

          <Link
            href={`/${lang}/locations`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors shrink-0 group"
          >
            <span>{t.exploreMore}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scenic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.items.map((item, idx) => (
            <Link
              key={idx}
              href={`/${lang}/locations`}
              className="group relative rounded-card overflow-hidden bg-foreground aspect-[4/3] sm:aspect-[3/4] block shadow-raised hover:shadow-overlay transition-all duration-300"
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

              {/* Tag Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-xs text-foreground">
                  {item.tag}
                </span>
              </div>

              {/* Card Footer Content */}
              <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                <div className="flex items-center gap-1 text-xs text-white/80 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-foreground-secondary" />
                  <span>{item.location}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

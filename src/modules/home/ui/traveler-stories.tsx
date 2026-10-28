'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Dictionary } from '@/i18n/dictionaries';
import { Star, Car, ChevronLeft, ChevronRight } from 'lucide-react';

interface TravelerStoriesProps {
  dict: Dictionary;
}

export function TravelerStories({ dict }: TravelerStoriesProps) {
  const t = dict.home.reviews;
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isHoveredRef = useRef(false);

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  // Gentle auto-play timer (5.5s interval, paused on hover/touch)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isHoveredRef.current) return;
      const el = trackRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      // Scroll by one card step: card width + 16px gap
      const firstCard = el.firstElementChild as HTMLElement | null;
      const cardStep = firstCard ? firstCard.offsetWidth + 16 : 276;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // Smoothly loop back to first review
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardStep, behavior: 'smooth' });
      }
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardStep = firstCard ? firstCard.offsetWidth + 16 : 276;
    el.scrollBy({
      left: direction === 'left' ? -cardStep : cardStep,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full border-y border-border bg-muted py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 max-w-2xl sm:mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.sectionTitle}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-foreground-secondary sm:text-sm">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Carousel Container (Hola-style: arrows strictly outside the card viewport) */}
        <div
          className="flex items-center gap-3 sm:gap-4"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onTouchStart={() => {
            isHoveredRef.current = true;
          }}
          onTouchEnd={() => {
            isHoveredRef.current = false;
          }}
        >
          {/* Left Arrow Button (Floats outside on desktop, never overlaps cards) */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous reviews"
            className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-raised transition-all duration-200 ${
              canScrollLeft
                ? 'text-foreground hover:bg-muted cursor-pointer opacity-100'
                : 'text-muted-foreground/40 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Cards Viewport & Track */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {t.items.map((item, idx) => (
                <div
                  key={idx}
                  className="w-[82vw] max-w-[280px] sm:w-[calc((100%-2rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] shrink-0 snap-start flex flex-col"
                >
                  <div className="flex h-full flex-col justify-between rounded-card border border-border bg-background p-4.5 transition-colors hover:border-foreground/20">
                    <div>
                      {/* Rating Stars & Verified Badge */}
                      <div className="mb-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-0.5 text-warm-strong">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="rounded-full bg-success-light px-2 py-0.5 text-xs font-semibold text-success">
                          Verified
                        </span>
                      </div>

                      {/* Quote */}
                      <blockquote className="mb-3.5 min-h-[4rem] line-clamp-3 text-xs sm:text-sm font-medium leading-relaxed text-foreground">
                        “{item.quote}”
                      </blockquote>
                    </div>

                    {/* Author & Vehicle Meta (Real booking entities only) */}
                    <div className="flex items-center justify-between border-t border-accent pt-2.5 text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.author}</span>
                        <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
                          <Car className="h-3.5 w-3.5 shrink-0" />
                          <span>{item.vehicleCategory}</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-muted-foreground self-start">
                        <span>{item.countryFlag}</span>
                        <span>{item.country}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button (Floats outside on desktop, never overlaps cards) */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next reviews"
            className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-raised transition-all duration-200 ${
              canScrollRight
                ? 'text-foreground hover:bg-muted cursor-pointer opacity-100'
                : 'text-muted-foreground/40 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

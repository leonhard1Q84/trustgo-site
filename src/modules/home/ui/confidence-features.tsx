import React from 'react';
import { Dictionary } from '@/i18n/dictionaries';
import { ReceiptText, ShieldCheck, MapPin } from 'lucide-react';

interface ConfidenceFeaturesProps {
  dict: Dictionary;
}

export function ConfidenceFeatures({ dict }: ConfidenceFeaturesProps) {
  const t = dict.home.promises;

  const features = [
    {
      icon: ReceiptText,
      title: t.easyBooking.title,
      desc: t.easyBooking.desc,
    },
    {
      icon: ShieldCheck,
      title: t.confidence.title,
      desc: t.confidence.desc,
    },
    {
      icon: MapPin,
      title: t.freedom.title,
      desc: t.freedom.desc,
    },
  ];

  return (
    <section className="w-full border-b border-border bg-background py-7 sm:py-8">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-1.5 pl-6 text-xs leading-relaxed text-foreground-secondary">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

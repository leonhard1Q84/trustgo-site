'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Users, Briefcase, Gauge, Fuel, HelpCircle } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { type RouteLanguage } from '@/i18n/locales';
import type { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import {
  localizeVehicleName,
  localizeVehicleCategory,
  localizeTransmission,
  localizeFuelType,
  splitVehicleName,
} from '@/modules/rental-search/domain/vehicleLocalization';
import type { RentalTripDetails } from '../domain/types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

interface VehicleSnapshotProps {
  vehicle: FleetVehicle;
  trip: RentalTripDetails;
  lang?: RouteLanguage;
}

export function VehicleSnapshot({ vehicle, lang = 'en' }: VehicleSnapshotProps) {
  const { t } = useI18n(lang);
  const [showOrSimilar, setShowOrSimilar] = useState(false);
  const name = splitVehicleName(vehicle.name, lang);
  const specs = [
    { icon: Users, text: `${vehicle.seats} ${t('common_seats')}` },
    { icon: Briefcase, text: `${vehicle.bags} ${t('common_bags')}` },
    { icon: Gauge, text: localizeTransmission(vehicle.gear, lang) },
    { icon: Fuel, text: localizeFuelType(vehicle.fuel, lang) },
  ];

  return (
    <section className="rounded-card border border-border bg-background p-4 md:p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
        <div className="relative mx-auto aspect-4/3 w-48 shrink-0 overflow-hidden rounded-control bg-muted md:mx-0 md:w-44 lg:w-48">
          <Image
            src={vehicle.image}
            alt={localizeVehicleName(vehicle.name, lang)}
            fill
            sizes="192px"
            className="object-contain p-2"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h1 className="text-h3 font-semibold tracking-tight text-foreground lg:text-h3-desktop">
              {name.model}
            </h1>
            <Dialog open={showOrSimilar} onOpenChange={setShowOrSimilar}>
              <DialogTrigger asChild>
                <Button
                  variant="text"
                  className="h-auto min-h-11 whitespace-normal px-0 py-2 text-body font-medium underline underline-offset-4"
                >
                  <span>{t('vs_or_similar')}</span>
                  <HelpCircle className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent
                variant="sheet"
                className="p-6"
                aria-describedby="or-similar-description"
              >
                <DialogTitle className="pr-8">{t('vs_or_similar_title')}</DialogTitle>
                <DialogDescription id="or-similar-description" className="my-4 text-body">
                  {t('vs_or_similar_desc')}
                </DialogDescription>
                <DialogClose asChild>
                  <Button variant="secondary">{t('common_close')}</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <p className="mt-1 text-body text-foreground-secondary">
            {localizeVehicleCategory(vehicle.category, lang)}
          </p>
          <ul
            className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-body text-foreground-secondary"
            aria-label={localizeVehicleCategory(vehicle.category, lang)}
          >
            {specs.map((spec) => (
              <li key={spec.text} className="flex items-center gap-2">
                <spec.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{spec.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Users, Plane, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { DriverDetails } from '@/modules/reservation/public-api';

interface BookedDriverCardProps {
  driver: DriverDetails;
}

export function BookedDriverCard({ driver }: BookedDriverCardProps) {
  const { t } = useI18n();

  return (
    <section className="bg-background rounded-card border border-border overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            {t('bm_driver_info_title')}
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-primary bg-brand-light px-2 py-0.5 rounded-full">
          {t('bm_main_driver')}
        </span>
      </div>

      {/* Driver Info Grid - Flat & Clean, No Box Inside Box */}
      <div className="p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          {/* Driver Name */}
          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[11px] font-medium">
              {t('bm_driver_name')}
            </span>
            <span className="font-bold text-foreground text-sm block">
              {driver.title} {driver.firstName} {driver.lastName}
            </span>
          </div>

          {/* Contact Phone */}
          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[11px] font-medium">
              {t('bm_driver_phone')}
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm tabular-nums">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span>
                {driver.phoneCountryCode} {driver.phone}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[11px] font-medium">
              {t('bm_driver_email')}
            </span>
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{driver.email}</span>
            </div>
          </div>

          {/* Flight Number */}
          {driver.flightNumber && (
            <div className="space-y-0.5">
              <span className="text-muted-foreground block text-[11px] font-medium">
                {t('bm_flight_number')}
              </span>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Plane className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>{driver.flightNumber}</span>
              </div>
            </div>
          )}

          {/* Special Notes */}
          <div className="sm:col-span-2 lg:col-span-3 border-t border-border pt-3 mt-1">
            <span className="text-muted-foreground block text-[11px] font-medium mb-0.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>{t('bm_special_notes')}</span>
            </span>
            <span className="text-foreground-secondary leading-relaxed">
              {t('bm_no_special_notes')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { Check, X, HelpCircle } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { RouteLanguage } from '@/i18n/locales';
import type { InsurancePackageId, InsuranceDetailedPackage } from '../domain/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packageDetail: InsuranceDetailedPackage | null;
  isSelected: boolean;
  onSelect: (id: InsurancePackageId) => void;
  currency?: string;
  depositAmount?: number;
  supplierName?: string;
  lang?: RouteLanguage;
  onOpenExcessExplainer?: () => void;
}

export function InsuranceDetailDialog({
  isOpen,
  onClose,
  packageDetail,
  isSelected,
  onSelect,
  currency = '$',
  depositAmount = 300,
  supplierName = 'TrustGo',
  lang = 'en',
  onOpenExcessExplainer,
}: InsuranceDetailDialogProps) {
  const { t } = useI18n(lang);
  if (!packageDetail) return null;

  const metrics = [
    {
      label: t('ic_daily_rate'),
      value:
        packageDetail.dailyRate === 0
          ? t('ic_included')
          : `${currency}${packageDetail.dailyRate} ${t('common_per_day')}`,
    },
    { label: t('ic_customer_excess'), value: packageDetail.excessSummary },
    { label: t('ic_noc_fee'), value: packageDetail.nocSummary },
    { label: t('ic_deposit_preauth'), value: `${currency}${depositAmount}` },
  ];
  const tabs = ['coverage', 'conditions', 'exclusions', 'incident'] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        variant="full"
        hideCloseButton
        className="overflow-hidden md:max-w-2xl max-md:inset-0 max-md:h-dvh max-md:max-h-none max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none max-md:animate-none"
      >
        <DialogHeader className="shrink-0 border-0 pb-2 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-h3 font-semibold">{packageDetail.name}</DialogTitle>
              <DialogDescription className="text-body">{packageDetail.tagline}</DialogDescription>
              <p className="text-caption text-foreground-secondary">
                {t('ic_provided_by').replace('{supplier}', supplierName)}
              </p>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('common_close')}
                className="shrink-0"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <Tabs
          key={`${packageDetail.id}-${isOpen}`}
          defaultValue="coverage"
          className="flex min-h-0 flex-1 flex-col"
        >
          <DialogBody className="min-h-0 py-0">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 md:grid-cols-4">
              {metrics.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-caption text-foreground-secondary">{label}</dt>
                  <dd className="mt-1 text-body font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <TabsList
              aria-label={packageDetail.name}
              className="flex gap-5 overflow-x-auto border-b border-border"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="min-h-11 shrink-0 border-b-2 border-transparent pb-3 text-body font-medium text-foreground-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[state=active]:border-foreground data-[state=active]:text-foreground"
                >
                  {t(`ic_tab_${tab}`)}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent
              value="coverage"
              className="py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <h3 className="text-body font-semibold">{t('ic_coverage')}</h3>
                {onOpenExcessExplainer && (
                  <Button
                    variant="link"
                    onClick={onOpenExcessExplainer}
                    className="h-auto min-h-11 whitespace-normal px-0 py-2 text-caption"
                  >
                    <HelpCircle className="mr-1.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {t('ic_excess_what')}
                  </Button>
                )}
              </div>
              <ul className="divide-y divide-border">
                {packageDetail.items.map((item) => (
                  <li key={item.code} className="flex items-start gap-3 py-5">
                    {item.included ? (
                      <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <X
                        className="mt-1 h-4 w-4 shrink-0 text-foreground-secondary"
                        aria-hidden="true"
                      />
                    )}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h4 className="text-body font-semibold">{item.name}</h4>
                        <span className="text-caption text-foreground-secondary">
                          <span className="sr-only">
                            {item.included ? t('ic_included') : t('rd_not_included')}:{' '}
                          </span>
                          {item.limitText}
                        </span>
                      </div>
                      <p className="text-body leading-relaxed text-foreground-secondary">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="conditions" className="space-y-5 py-6">
              <p className="text-body leading-relaxed text-foreground-secondary">
                {t('ic_conditions_intro')}
              </p>
              <ol className="list-decimal space-y-4 pl-5 text-body leading-relaxed text-foreground-secondary marker:text-foreground">
                {packageDetail.conditions.map((condition, i) => (
                  <li key={i} className="pl-2">
                    {condition}
                  </li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="exclusions" className="py-6">
              <p className="mb-2 text-body leading-relaxed text-foreground-secondary">
                {t('ic_exclusions_intro')}
              </p>
              <div className="divide-y divide-border">
                {packageDetail.exclusions.map((group, i) => (
                  <section key={i} className="space-y-3 py-5">
                    <h3 className="text-body font-semibold">{group.category}</h3>
                    <ul className="list-disc space-y-2 pl-5 text-body leading-relaxed text-foreground-secondary">
                      {group.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="incident" className="py-2">
              <ol className="divide-y divide-border">
                {packageDetail.incidentSteps.map((step) => (
                  <li key={step.step} className="flex gap-4 py-5">
                    <span className="text-body font-semibold" aria-hidden="true">
                      {step.step}.
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-body font-semibold">{step.title}</h3>
                      <p className="text-body leading-relaxed text-foreground-secondary">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </DialogBody>
        </Tabs>

        <DialogFooter className="shrink-0 flex-wrap bg-background max-md:pb-[calc(0.875rem+env(safe-area-inset-bottom))]">
          {isSelected && <p className="mr-auto text-body font-medium">{t('ic_current_plan')}</p>}
          <DialogClose asChild>
            <Button variant="secondary">{t('common_close')}</Button>
          </DialogClose>
          {!isSelected && (
            <Button
              onClick={() => {
                onSelect(packageDetail.id);
                onClose();
              }}
            >
              {t('ic_select_this_plan')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

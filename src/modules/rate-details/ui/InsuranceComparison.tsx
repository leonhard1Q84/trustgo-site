'use client';

import React, { useState, useMemo } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { RouteLanguage } from '@/i18n/locales';
import { Check, X, HelpCircle, ChevronRight } from 'lucide-react';
import { InsurancePackageId } from '../domain/types';
import { STANDARD_INSURANCE_PACKAGES } from '../application/rate-service';
import { getDetailedInsurancePackages } from '../domain/insurance-data';
import { ExcessExplainerModal } from './ExcessExplainerModal';
import { InsuranceDetailDialog } from './InsuranceDetailDialog';

interface InsuranceComparisonProps {
  selectedId: InsurancePackageId;
  onSelect: (id: InsurancePackageId) => void;
  currency?: string;
  depositAmount?: number;
  supplierName?: string;
  lang?: RouteLanguage;
}

function pkgKey(id: InsurancePackageId) {
  return id === 'zero-excess' ? 'zero' : id;
}

export function InsuranceComparison({
  selectedId,
  onSelect,
  currency = '$',
  depositAmount = 300,
  supplierName = 'TrustGo Partner',
  lang = 'en',
}: InsuranceComparisonProps) {
  const { t } = useI18n(lang);
  const [showExcessModal, setShowExcessModal] = useState(false);
  const [activeDetailId, setActiveDetailId] = useState<InsurancePackageId | null>(null);

  const detailedPackages = useMemo(
    () => getDetailedInsurancePackages(lang, currency),
    [lang, currency]
  );

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-h3 font-semibold text-foreground">{t('ic_title')}</h2>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">{t('ic_subtitle')}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowExcessModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer self-start sm:self-auto"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t('ic_excess_what')}</span>
        </button>
      </div>

      {/* 3 Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STANDARD_INSURANCE_PACKAGES.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const isZeroExcess = pkg.id === 'zero-excess';
          const prefix = `ic_pkg_${pkgKey(pkg.id)}`;

          return (
            <div
              key={pkg.id}
              onClick={() => onSelect(pkg.id)}
              className={`relative rounded-card p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-brand bg-brand-light/30'
                  : 'border-border hover:border-border-strong bg-background'
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div
                  className={`absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isZeroExcess ? 'bg-warm text-white' : 'bg-primary text-white'
                  }`}
                >
                  {t(`ic_badge_${pkg.id === 'inclusive' ? 'popular' : 'recommended'}`)}
                </div>
              )}

              <div>
                {/* Title & Radio Indicator */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-foreground">{t(`${prefix}_name`)}</h3>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-brand bg-brand' : 'border-border-strong bg-background'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                  </div>
                </div>

                <p className="text-xs text-foreground-secondary mb-4 min-h-[32px]">
                  {t(`${prefix}_tagline`)}
                </p>

                {/* Price Display */}
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">
                      {pkg.dailyRate === 0 ? t('ic_included') : `${currency}${pkg.dailyRate}`}
                    </span>
                    {pkg.dailyRate > 0 && (
                      <span className="text-xs text-muted-foreground">{t('common_per_day')}</span>
                    )}
                  </div>
                  <div className="text-xs text-foreground-secondary mt-1">
                    {t('ic_damage_excess')}:{' '}
                    <strong className={isZeroExcess ? 'text-success font-bold' : 'text-foreground'}>
                      {pkg.damageExcess === 0
                        ? t('ic_no_deductible')
                        : `${currency}${pkg.damageExcess}`}
                    </strong>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2 mb-4">
                  {pkg.features.map((feat, idx) => {
                    const labelText = feat.featureKey
                      ? t(`ic_feat_${feat.featureKey}`)
                      : feat.label;
                    const descText = feat.descriptionKey
                      ? t(feat.descriptionKey)
                      : feat.description;

                    return (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        {feat.included ? (
                          <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span
                            className={
                              feat.included
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground line-through'
                            }
                          >
                            {labelText}
                          </span>
                          {descText && (
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              {descText}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View Details + Select */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDetailId(pkg.id);
                  }}
                  className="inline-flex items-center gap-0.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer"
                >
                  <span>{t('ic_view_details')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-control font-bold text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-brand-light text-foreground'
                  }`}
                >
                  {isSelected ? t('ic_selected') : t('ic_select')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Package Details Modal */}
      <InsuranceDetailDialog
        isOpen={activeDetailId !== null}
        onClose={() => setActiveDetailId(null)}
        packageDetail={activeDetailId ? detailedPackages[activeDetailId] : null}
        isSelected={selectedId === activeDetailId}
        onSelect={onSelect}
        currency={currency}
        depositAmount={depositAmount}
        supplierName={supplierName}
        lang={lang}
        onOpenExcessExplainer={() => {
          setActiveDetailId(null);
          setShowExcessModal(true);
        }}
      />

      {/* What is Excess Explainer Modal */}
      <ExcessExplainerModal
        isOpen={showExcessModal}
        onClose={() => setShowExcessModal(false)}
        currency={currency}
        depositAmount={depositAmount}
        lang={lang}
      />
    </section>
  );
}

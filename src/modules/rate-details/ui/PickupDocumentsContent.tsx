'use client';

import { useState, type Ref } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { RouteLanguage } from '@/i18n/locales';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

function DocumentRequirement({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-title font-semibold text-foreground">{title}</h3>
      <div className="mt-3 space-y-3 text-body leading-relaxed text-foreground-secondary">
        {children}
      </div>
    </section>
  );
}

export function PickupDocumentsContent({
  lang,
  isJapan,
  licenseCountry,
  onShowSamples,
  sampleButtonRef,
}: {
  lang: RouteLanguage;
  isJapan: boolean;
  licenseCountry?: string;
  onShowSamples: () => void;
  sampleButtonRef?: Ref<HTMLButtonElement>;
}) {
  const { t } = useI18n(lang);
  const [audience, setAudience] = useState('visitor');
  const country = licenseCountry?.toUpperCase();
  const translationRoute = ['TW', 'CH', 'DE', 'FR', 'BE', 'MC'].includes(country ?? '');
  const idpRoute = ['HK', 'US', 'KR'].includes(country ?? '');
  const selectedRequirement =
    country === 'CN'
      ? t('ttk_docs_mainland_notice')
      : translationRoute
        ? t('ttk_docs_translation_desc')
        : idpRoute
          ? t('rd_docs_idp_combination')
          : undefined;

  return (
    <div>
      <Tabs value={audience} onValueChange={setAudience}>
        <TabsList
          className="flex gap-4 border-b border-border"
          aria-label={t('rd_pickup_documents')}
        >
          <TabsTrigger
            value="visitor"
            className="min-h-11 flex-1 border-b-2 border-transparent px-1 py-3 text-body font-semibold text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('ttk_docs_visitor_tab')}
          </TabsTrigger>
          <TabsTrigger
            value="local"
            className="min-h-11 flex-1 border-b-2 border-transparent px-1 py-3 text-body font-semibold text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('rd_local_resident')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="visitor" className="space-y-8 pt-6">
          {isJapan ? (
            <>
              {selectedRequirement && (
                <section className="border-l-2 border-border-strong pl-4">
                  <h3 className="text-title font-semibold">{t('rd_docs_selected_license')}</h3>
                  <p className="mt-3 text-body leading-relaxed text-foreground-secondary">
                    {selectedRequirement}
                  </p>
                </section>
              )}
              <DocumentRequirement title={t('ttk_docs_passport_title')}>
                <p>{t('ttk_docs_passport_desc')}</p>
              </DocumentRequirement>
              <DocumentRequirement title={t('ttk_docs_license_title')}>
                <p>{t('ttk_docs_license_desc')}</p>
              </DocumentRequirement>
              <DocumentRequirement title={t('rd_international_paths')}>
                <p>{t('rd_docs_choose_path')}</p>
                <ol className="list-decimal space-y-6 pl-5">
                  <li className="pl-1">
                    <h4 className="font-semibold text-foreground">{t('ttk_docs_idp_title')}</h4>
                    <p className="mt-2">{t('rd_docs_idp_combination')}</p>
                    <p className="mt-2">{t('ttk_docs_idp_desc')}</p>
                  </li>
                  <li className="pl-1">
                    <h4 className="font-semibold text-foreground">
                      {t('ttk_docs_translation_title')}
                    </h4>
                    <p className="mt-2">{t('ttk_docs_translation_desc')}</p>
                  </li>
                </ol>
              </DocumentRequirement>
              <DocumentRequirement title={t('rd_docs_validity_title')}>
                <p>{t('rd_docs_validity')}</p>
              </DocumentRequirement>
              <p className="border-l-2 border-border-strong pl-4 text-body leading-relaxed text-foreground">
                {t('ttk_docs_mainland_notice')}
              </p>
              <Button
                ref={sampleButtonRef}
                variant="secondary"
                className="h-auto min-h-12 w-full whitespace-normal text-left"
                onClick={onShowSamples}
              >
                {t('rd_japan_samples')}
              </Button>
            </>
          ) : (
            <DocumentRequirement title={t('ttk_tab_docs')}>
              <p>{t('rd_international_generic')}</p>
            </DocumentRequirement>
          )}
        </TabsContent>
        <TabsContent value="local" className="space-y-8 pt-6">
          <DocumentRequirement title={t('rd_local_license')}>
            <p>{t('rd_local_license_desc')}</p>
          </DocumentRequirement>
        </TabsContent>
      </Tabs>
      <div className="mt-8 space-y-8 border-t border-border pt-8">
        <DocumentRequirement title={t('rd_docs_booking_proof')}>
          <p>{t('rd_docs_booking_proof_desc')}</p>
        </DocumentRequirement>
        <DocumentRequirement title={t('rd_docs_before_pickup')}>
          <p>{t('rd_docs_before_pickup_desc')}</p>
        </DocumentRequirement>
      </div>
    </div>
  );
}

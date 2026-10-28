'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import {
  X,
  CheckCircle2,
  XCircle,
  ZoomIn,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import {
  idpOriginRequirements,
  type LocalizedText,
} from '../domain/idpOriginRequirements';

interface IdpSampleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
  initialOriginId?: string;
}

const copyByLang: Record<
  string,
  {
    drawerTitle: string;
    bannerNotice: string;
    quickJump: string;
    validLabel: string;
    invalidLabel: string;
    translationLabel: string;
    zoomImage: string;
    close: string;
    viewDetails: string;
    requirementsTitle: string;
    prohibitedTitle: string;
    officialNotes: string;
    issuingBodies: string;
    photoSamples: string;
  }
> = {
  zh: {
    drawerTitle: '國際駕照與證件範本',
    bannerNotice:
      '取車時必須出示符合目的地法規的合法駕照組合。如持非 1949 年日內瓦公約小冊子，門店將依法拒絕辦理取車。',
    quickJump: '簽發國/地區',
    validLabel: '官方合法有效',
    invalidLabel: '不可取車 / 無效',
    translationLabel: '需持官方指定翻譯件',
    zoomImage: '點擊查看大圖',
    close: '關閉',
    viewDetails: '查看詳情',
    requirementsTitle: '必備證件清單',
    prohibitedTitle: '嚴禁或無效方式',
    officialNotes: '官方合規備註',
    issuingBodies: '認可簽發機構',
    photoSamples: '官方實物樣張',
  },
  en: {
    drawerTitle: 'International Driving Permit (IDP) Samples',
    bannerNotice:
      'A valid document combination compliant with local laws is mandatory at pick-up. Non-1949 Geneva Convention booklets are strictly refused at the counter.',
    quickJump: 'Issuing Country / Region',
    validLabel: 'Official Valid Sample',
    invalidLabel: 'Invalid / Not Accepted',
    translationLabel: 'Official Translation Required',
    zoomImage: 'Click to enlarge',
    close: 'Close',
    viewDetails: 'View details',
    requirementsTitle: 'Required Documents',
    prohibitedTitle: 'Prohibited / Invalid Conditions',
    officialNotes: 'Compliance Notes',
    issuingBodies: 'Authorized Issuers',
    photoSamples: 'Physical Photo Samples',
  },
  ja: {
    drawerTitle: '国際運転免許証および書類見本',
    bannerNotice:
      'お受け取り時には現地の法令に準拠した有効な書類が必要です。1949年ジュネーブ条約外の書類は受付できません。',
    quickJump: '発行国・地域',
    validLabel: '公式認定見本',
    invalidLabel: '利用不可・無効',
    translationLabel: '公式指定翻訳文が必要',
    zoomImage: '拡大表示',
    close: '閉じる',
    viewDetails: '詳細を見る',
    requirementsTitle: '必要書類一覧',
    prohibitedTitle: '禁止事項・無効な例',
    officialNotes: '公式規定メモ',
    issuingBodies: '公認発行機関',
    photoSamples: '実物写真見本',
  },
  es: {
    drawerTitle: 'Muestras de Permiso Internacional (IDP)',
    bannerNotice:
      'Es obligatorio presentar documentos conformes a las leyes locales en el mostrador. No se aceptan permisos fuera de la Convención de Ginebra de 1949.',
    quickJump: 'País / Región emisor',
    validLabel: 'Muestra Oficial Válida',
    invalidLabel: 'No Válido / No Aceptado',
    translationLabel: 'Requiere Traducción Oficial',
    zoomImage: 'Clic para ampliar',
    close: 'Cerrar',
    viewDetails: 'Ver detalles',
    requirementsTitle: 'Documentos requeridos',
    prohibitedTitle: 'Condiciones no permitidas',
    officialNotes: 'Notas de cumplimiento',
    issuingBodies: 'Emisores autorizados',
    photoSamples: 'Muestras de fotos',
  },
  ko: {
    drawerTitle: '국제운전면허증 및 서류 견본',
    bannerNotice:
      '픽업 시 현지 법규를 준수하는 유효한 면허 서류가 필수입니다. 1949 제네바 협약 외 문서는 접수가 불가합니다.',
    quickJump: '발급 국가/지역',
    validLabel: '공식 인정 견본',
    invalidLabel: '사용 불가 / 무효',
    translationLabel: '공식 번역문 필요',
    zoomImage: '확대 보기',
    close: '닫기',
    viewDetails: '상세 보기',
    requirementsTitle: '필수 지참 서류',
    prohibitedTitle: '불가 및 무효 사항',
    officialNotes: '공식 준수 사항',
    issuingBodies: '공인 발급 기관',
    photoSamples: '실물 사진 견본',
  },
};

export function IdpSampleDrawer({
  isOpen,
  onClose,
  lang = 'zh',
  initialOriginId,
}: IdpSampleDrawerProps) {
  const copy = copyByLang[lang] ?? copyByLang.en;
  const [selectedId, setSelectedId] = useState<string>(
    initialOriginId || idpOriginRequirements[0]?.id || 'hong-kong'
  );
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
    caption: string;
  } | null>(null);

  const getText = (text?: LocalizedText) => {
    if (!text) return '';
    return (text as Record<string, string>)[lang] || text.zh || text.en || '';
  };

  useEffect(() => {
    if (initialOriginId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- external system sync
      setSelectedId(initialOriginId);
    }
  }, [initialOriginId, isOpen]);

  const activeReq =
    idpOriginRequirements.find((item) => item.id === selectedId) ??
    idpOriginRequirements[0];

  const isUnsupported = activeReq.route === 'unsupported';
  const isTranslation = activeReq.route === 'translation';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        variant="full"
        hideCloseButton
        className="sm:max-w-2xl p-0 overflow-hidden"
        aria-label={copy.drawerTitle}
      >
        {/* Header - Clean, balanced typography */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle className="text-body-large sm:text-h3 font-semibold text-foreground tracking-tight">
            {copy.drawerTitle}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informational Notice Banner - Calm & accessible */}
        <div className="bg-muted/60 border-b border-border px-5 py-2.5 sm:px-6 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-caption text-foreground-secondary leading-relaxed">
            {copy.bannerNotice}
          </p>
        </div>

        {/* Country / Region Selector - Focused Tab Filter */}
        <div className="border-b border-border bg-background px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {idpOriginRequirements.map((req) => {
              const isSelected = selectedId === req.id;
              return (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => setSelectedId(req.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-caption font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-foreground text-background shadow-xs'
                      : 'bg-muted text-foreground-secondary hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      req.route === 'unsupported'
                        ? 'bg-destructive'
                        : req.route === 'translation'
                          ? 'bg-warning'
                          : 'bg-success'
                    }`}
                  />
                  <span>{getText(req.name)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Country Detail Body - Airy, focused, single-view */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 space-y-6">
          {/* Status & Country Overview */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-title font-semibold text-foreground">
                {getText(activeReq.name)}
              </h3>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption font-medium ${
                  isUnsupported
                    ? 'bg-destructive-light text-destructive'
                    : isTranslation
                      ? 'bg-warning-light text-warning'
                      : 'bg-success-light text-success'
                }`}
              >
                {isUnsupported ? (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{copy.invalidLabel}</span>
                  </>
                ) : isTranslation ? (
                  <>
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{copy.translationLabel}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{copy.validLabel}</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-body text-foreground-secondary leading-relaxed">
              {getText(activeReq.summary)}
            </p>
          </div>

          {/* Rules Breakdown - Grid on desktop, stack on mobile */}
          <div
            className={`grid gap-4 ${
              isUnsupported
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {/* Required Documents / Conditions */}
            {activeReq.doList && activeReq.doList.length > 0 && (
              <div className="rounded-card border border-border bg-background p-4 space-y-3">
                <span className="text-caption font-semibold uppercase tracking-wider text-success flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  {copy.requirementsTitle}
                </span>
                <div className="space-y-2.5">
                  {activeReq.doList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-caption text-foreground-secondary leading-relaxed"
                    >
                      <span className="w-1 h-1 rounded-full bg-success shrink-0 mt-2" />
                      <span>{getText(item)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prohibited / Invalid Conditions */}
            {activeReq.dontList && activeReq.dontList.length > 0 && (
              <div
                className={`rounded-card border p-4 space-y-3 ${
                  isUnsupported
                    ? 'border-destructive/30 bg-destructive-light/30'
                    : 'border-border bg-background'
                }`}
              >
                <span className="text-caption font-semibold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-destructive shrink-0" />
                  {copy.prohibitedTitle}
                </span>
                <div className="space-y-2.5">
                  {activeReq.dontList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-caption text-foreground-secondary leading-relaxed"
                    >
                      <span className="w-1 h-1 rounded-full bg-destructive shrink-0 mt-2" />
                      <span className={isUnsupported ? 'font-medium text-destructive' : ''}>
                        {getText(item)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Physical Photo Samples - Clean cards without dark mask clutter */}
          {activeReq.images && activeReq.images.length > 0 && (
            <div className="space-y-3">
              <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground block">
                {copy.photoSamples}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeReq.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setPreviewImage({
                        src: img.src,
                        alt: getText(img.alt),
                        caption: getText(img.caption),
                      })
                    }
                    className="group relative text-left rounded-card border border-border bg-muted/40 overflow-hidden hover:border-border-strong transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative w-full aspect-16/10 bg-muted overflow-hidden">
                      <Image
                        src={img.src}
                        alt={getText(img.alt)}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute right-2.5 bottom-2.5 rounded-full bg-foreground/70 p-1.5 text-white backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="p-3 bg-background border-t border-border/80">
                      <p className="text-caption font-medium text-foreground line-clamp-1">
                        {getText(img.alt)}
                      </p>
                      <p className="text-caption text-muted-foreground line-clamp-2 mt-0.5">
                        {getText(img.caption)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Authorized Issuing Bodies - Clean text badges WITHOUT external links */}
          {activeReq.issuers && activeReq.issuers.length > 0 && (
            <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-caption font-medium text-muted-foreground">
                {copy.issuingBodies}:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {activeReq.issuers.map((issuer, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-control bg-muted px-2.5 py-1 text-caption text-foreground-secondary font-medium"
                  >
                    {issuer.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Preview Overlay Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-110 flex items-center justify-center bg-scrim p-4 sm:p-6 backdrop-blur-xs animate-overlay-in"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="relative max-w-2xl w-full bg-background rounded-card shadow-overlay overflow-hidden animate-dialog-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-body font-semibold text-foreground">
                  {previewImage.alt}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  aria-label={copy.close}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative w-full h-80 sm:h-96 bg-muted">
                <Image
                  src={previewImage.src}
                  alt={previewImage.alt}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="p-4 bg-muted/40 border-t border-border text-caption text-foreground-secondary leading-relaxed">
                {previewImage.caption}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useId, useState } from 'react';
import { Check, Copy, ExternalLink, Mail, MessageCircle, Phone, X } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { B2B_CONTACT } from '../domain/franchise-data';
import { getWeChatQrMatrix } from './qr-generator';

interface FloatingContactWidgetProps {
  lang: RouteLanguage;
  defaultOpen?: boolean;
}

export function FloatingContactWidget({ lang, defaultOpen = false }: FloatingContactWidgetProps) {
  const { t } = useI18n(lang);
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState<string | null>(null);
  const matrix = getWeChatQrMatrix();

  async function copyContact(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied((current) => (current === value ? null : current)), 2000);
    } catch {
      // Fallback
      setCopied(null);
    }
  }

  function copyButton(value: string, label: string) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => copyContact(value)}
        aria-label={`${t(copied === value ? 'franchise_copied' : 'franchise_copy')}: ${label}`}
        title={t(copied === value ? 'franchise_copied' : 'franchise_copy')}
      >
        {copied === value ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    );
  }

  return (
    <aside
      aria-label={`TrustGo ${t('franchise_consultation')}`}
      className="fixed bottom-4 right-4 z-50 pb-[env(safe-area-inset-bottom)] md:bottom-6 md:right-6"
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {/* FAB Trigger Button */}
        <PopoverTrigger asChild>
          <Button className="gap-2 rounded-full shadow-none">
            <MessageCircle className="size-5" />
            <span>{t('franchise_consultation')}</span>
          </Button>
        </PopoverTrigger>
        {/* Floating Modal / Popover Card */}
        <PopoverContent
          side="top"
          align="end"
          collisionPadding={16}
          aria-labelledby={titleId}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="w-76 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-6rem-env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain border-border/50 p-4 shadow-raised md:w-80"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2">
            <h2 id={titleId} className="text-body font-semibold text-foreground">
              TrustGo {t('franchise_consultation')}
            </h2>
            <PopoverClose asChild>
              <Button variant="ghost" size="icon" aria-label={t('franchise_modal_close')}>
                <X className="size-4" />
              </Button>
            </PopoverClose>
          </div>
          <div className="divide-y divide-border/50">
            {/* 1. WeChat with QR */}
            <div className="pb-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-caption font-semibold">
                  <MessageCircle className="size-4 text-foreground-secondary" />
                  <span>{t('franchise_wechat')}</span>
                </div>
                {copyButton(B2B_CONTACT.wechat, t('franchise_wechat'))}
              </div>
              {/* Mini QR render */}
              <div className="flex items-center gap-3">
                <div className="shrink-0 bg-white p-1.5">
                  <svg
                    viewBox="0 0 25 25"
                    width={72}
                    height={72}
                    className="block"
                    shapeRendering="crispEdges"
                    aria-hidden="true"
                  >
                    <rect width="25" height="25" fill="#ffffff" />
                    {matrix.map((row, r) =>
                      row.map((val, c) =>
                        val ? (
                          <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111827" />
                        ) : null
                      )
                    )}
                    <rect x="10" y="10" width="5" height="5" rx="1" fill="#ffffff" />
                    <rect x="10.5" y="10.5" width="4" height="4" rx="0.8" fill="#07C160" />
                  </svg>
                </div>
                <div className="min-w-0 text-caption leading-relaxed">
                  <span className="block break-all font-medium">
                    {t('franchise_wechat_id')}: {B2B_CONTACT.wechat}
                  </span>
                  <span className="mt-1 block text-muted-foreground">
                    {t('franchise_scan_qr_hint')}
                  </span>
                </div>
              </div>
            </div>
            {/* 2. WhatsApp */}
            <div className="py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-caption font-semibold">
                  <Phone className="size-4 text-foreground-secondary" />
                  <span>WhatsApp</span>
                </div>
                {copyButton(B2B_CONTACT.whatsapp, 'WhatsApp')}
              </div>
              <p className="break-words text-caption text-foreground-secondary">
                {B2B_CONTACT.whatsapp}
              </p>
              <Button
                asChild
                variant="text"
                className="mt-1 min-h-11 w-fit gap-2 whitespace-normal px-0 text-caption"
              >
                <a href={B2B_CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                  {t('franchise_direct_chat')}
                  <ExternalLink className="size-3.5 shrink-0" />
                  <span className="sr-only">{t('franchise_new_tab')}</span>
                </a>
              </Button>
            </div>
            {/* 3. Commercial Email */}
            <div className="pt-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-caption font-semibold">
                  <Mail className="size-4 shrink-0 text-foreground-secondary" />
                  <span>{t('franchise_card_email_title')}</span>
                </div>
                {copyButton(B2B_CONTACT.email, t('franchise_card_email_title'))}
              </div>
              <p className="break-all text-caption text-foreground-secondary">
                {B2B_CONTACT.email}
              </p>
              <Button
                asChild
                variant="text"
                className="mt-1 min-h-11 w-fit whitespace-normal px-0 text-caption"
              >
                <a href={`mailto:${B2B_CONTACT.email}`}>{t('franchise_send_email')}</a>
              </Button>
            </div>
          </div>
          <span role="status" className="sr-only">
            {copied ? t('franchise_copied') : ''}
          </span>
        </PopoverContent>
      </Popover>
    </aside>
  );
}

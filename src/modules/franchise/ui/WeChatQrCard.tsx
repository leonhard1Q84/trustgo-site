'use client';

import { useState } from 'react';
import { Check, Copy, Maximize2, MessageCircle, X } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { getWeChatQrMatrix } from './qr-generator';

interface WeChatQrCardProps {
  lang: RouteLanguage;
  wechatId: string;
}

export function WeChatQrCard({ lang, wechatId }: WeChatQrCardProps) {
  const { t } = useI18n(lang);
  const [copied, setCopied] = useState(false);
  const matrix = getWeChatQrMatrix();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  // Render SVG representation of the 25x25 QR code
  const renderQrSvg = (size: number) => {
    return (
      <svg
        viewBox="0 0 25 25"
        width={size}
        height={size}
        className="shape-rendering-crispEdges block"
        aria-hidden="true"
      >
        <rect width="25" height="25" fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((val, c) =>
            val ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111827" /> : null
          )
        )}
        {/* Center overlay mini shield for WeChat brand touch */}
        <rect x="10" y="10" width="5" height="5" rx="1" fill="#ffffff" />
        <rect x="10.5" y="10.5" width="4" height="4" rx="0.8" fill="#07C160" />
        <circle cx="12" cy="12" r="0.6" fill="#ffffff" />
        <circle cx="13.2" cy="12.7" r="0.45" fill="#ffffff" />
      </svg>
    );
  };

  return (
    <article className="flex h-full flex-col justify-between rounded-card border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-card">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-[#07C160]/10 text-[#07C160]">
            <MessageCircle className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-title font-semibold text-foreground">
              {t('franchise_card_wechat_title')}
            </h3>
            <p className="text-caption text-foreground-secondary">
              {t('franchise_card_wechat_desc')}
            </p>
          </div>
        </div>

        {/* QR Code container */}
        <div className="my-5 flex flex-col items-center justify-center rounded-card border border-border/80 bg-muted/40 p-4">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="group relative cursor-zoom-in rounded-control bg-white p-3 shadow-xs transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title={t('franchise_scan_qr_hint')}
              >
                {renderQrSvg(140)}
                <span className="absolute bottom-1 right-1 rounded-tag bg-foreground/75 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 className="size-3" aria-hidden="true" />
                </span>
              </button>
            </DialogTrigger>
            <DialogContent variant="center" className="sm:max-w-xs" hideCloseButton>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                  aria-label={t('franchise_modal_close')}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </DialogClose>
              <DialogHeader>
                <DialogTitle>{t('franchise_card_wechat_title')}</DialogTitle>
                <DialogDescription>{t('franchise_scan_qr_hint')}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="rounded-card border border-border bg-white p-5 shadow-sm">
                  {renderQrSvg(220)}
                </div>
                <div className="mt-4 flex items-center gap-2 font-mono text-body font-semibold text-foreground">
                  <span>
                    {t('franchise_wechat_id')}: {wechatId}
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <p className="mt-3 text-caption text-foreground-secondary">
            {t('franchise_scan_qr_hint')}
          </p>
        </div>
      </div>

      {/* Copy ID actions */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="min-w-0">
          <span className="text-caption text-muted-foreground">{t('franchise_wechat_id')}</span>
          <p className="truncate font-mono text-body font-semibold text-foreground">{wechatId}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex min-h-9 items-center gap-1.5 rounded-control px-3 text-caption font-medium transition-colors ${
            copied
              ? 'bg-success-light text-success font-semibold'
              : 'border border-border bg-background hover:bg-muted text-foreground'
          }`}
          aria-label={
            copied ? t('franchise_copied') : `${t('franchise_copy')}: ${t('franchise_wechat_id')}`
          }
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-success" aria-hidden="true" />
              <span>{t('franchise_copied')}</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span>{t('franchise_copy')}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

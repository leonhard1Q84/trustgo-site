'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, ExternalLink, Mail, Phone } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { B2B_CONTACT } from '../domain/franchise-data';
import { WeChatQrCard } from './WeChatQrCard';

interface FranchiseContactSectionProps {
  lang: RouteLanguage;
}

export function FranchiseContactSection({ lang }: { lang: RouteLanguage }) {
  const { t } = useI18n(lang);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function copyWhatsapp() {
    try {
      await navigator.clipboard.writeText(B2B_CONTACT.whatsapp);
      setCopiedWhatsapp(true);
      setTimeout(() => setCopiedWhatsapp(false), 2000);
    } catch {
      // Fallback
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(B2B_CONTACT.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <section id="contact" className="scroll-mt-28 border-t border-border py-12 lg:py-20">
      <div>
        <div className="max-w-2xl">
          <h2 className="text-h2 font-semibold lg:text-h2-desktop">
            {t('franchise_contact_heading')}
          </h2>
          <p className="mt-3 text-body-large text-foreground-secondary">
            {t('franchise_contact_body')}
          </p>
        </div>

        {/* 3-column contact cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. WeChat Card with QR */}
          <WeChatQrCard lang={lang} wechatId={B2B_CONTACT.wechat} />

          {/* 2. WhatsApp Card */}
          <article className="flex h-full flex-col justify-between rounded-card border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-card">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-[#25D366]/10 text-[#25D366]">
                  <Phone className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-title font-semibold text-foreground">
                    {t('franchise_card_whatsapp_title')}
                  </h3>
                  <p className="text-caption text-foreground-secondary">
                    {t('franchise_card_whatsapp_desc')}
                  </p>
                </div>
              </div>

              <div className="my-6 rounded-card border border-border/80 bg-muted/40 p-4">
                <span className="text-caption text-muted-foreground">Direct Number</span>
                <p className="mt-1 font-mono text-title font-semibold text-foreground">
                  {B2B_CONTACT.whatsapp}
                </p>
                <p className="mt-2 text-caption text-foreground-secondary">
                  Available Mon–Sun · Direct route
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <Button asChild className="min-h-10 w-full gap-2">
                <a
                  href={B2B_CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  <span>{t('franchise_direct_chat')}</span>
                  <ExternalLink className="size-3.5 opacity-80" aria-hidden="true" />
                  <span className="sr-only">{t('franchise_new_tab')}</span>
                </a>
              </Button>
              <button
                type="button"
                onClick={copyWhatsapp}
                className={`inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-control px-3 text-caption font-medium transition-colors ${
                  copiedWhatsapp
                    ? 'bg-success-light text-success font-semibold'
                    : 'border border-border bg-background hover:bg-muted text-foreground'
                }`}
              >
                {copiedWhatsapp ? (
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

          {/* 3. Commercial Email Card */}
          <article className="flex h-full flex-col justify-between rounded-card border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-card md:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
                  <Mail className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-title font-semibold text-foreground">
                    {t('franchise_card_email_title')}
                  </h3>
                  <p className="text-caption text-foreground-secondary">
                    {t('franchise_card_email_desc')}
                  </p>
                </div>
              </div>

              <div className="my-6 rounded-card border border-border/80 bg-muted/40 p-4">
                <span className="text-caption text-muted-foreground">Commercial Inbox</span>
                <p className="mt-1 break-all font-mono text-body font-semibold text-foreground">
                  {B2B_CONTACT.email}
                </p>
                <p className="mt-2 text-caption text-foreground-secondary">
                  Responses within 1 business day
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <Button asChild variant="secondary" className="min-h-10 w-full gap-2">
                <a href={`mailto:${B2B_CONTACT.email}`}>
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  <span>{t('franchise_send_email')}</span>
                </a>
              </Button>
              <button
                type="button"
                onClick={copyEmail}
                className={`inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-control px-3 text-caption font-medium transition-colors ${
                  copiedEmail
                    ? 'bg-success-light text-success font-semibold'
                    : 'border border-border bg-background hover:bg-muted text-foreground'
                }`}
              >
                {copiedEmail ? (
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
        </div>

        {/* Existing Partner Quick Link & Locations */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-card border border-border/70 bg-muted/30 p-5 md:flex-row md:items-center">
          <div>
            <h4 className="text-body font-semibold text-foreground">
              {t('franchise_existing_title')}
            </h4>
            <p className="mt-0.5 text-caption text-foreground-secondary">
              {t('franchise_existing_body')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="secondary" size="sm" className="min-h-9">
              <a
                href={B2B_CONTACT.merchantPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5"
              >
                <span>{t('franchise_login')}</span>
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="min-h-9">
              <Link href={`/${lang}/locations`} className="gap-1.5 text-primary">
                <span>{t('footer_locations')}</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

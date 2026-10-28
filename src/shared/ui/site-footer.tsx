'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Mail, MessageCircle, Phone, Check, Copy } from 'lucide-react';
import { Locale, getDictionary } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { BrandLogo } from './brand-logo';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from './utils';
import type { FooterLinkGroup } from '@/modules/site-content/public-api';
import { PartnershipDialog } from '@/modules/franchise/public-api';
import { openCookiePreferences } from '@/shared/analytics/consent-manager';
import { GuestBookingLink } from '@/modules/booking-management/public-api';

interface SiteFooterProps {
  lang: Locale;
}

function FooterGroup({ group, lang }: { group: FooterLinkGroup; lang: Locale }) {
  return (
    <div className="min-w-0">
      <h4 className="text-xs font-bold text-foreground mb-4">{group.title}</h4>
      <ul className="space-y-2.5 text-sm">
        {group.links.map((link) => (
          <li key={link.action ?? link.href}>
            {link.action === 'partnership' ? (
              <PartnershipDialog lang={lang}>
                <button
                  type="button"
                  className="text-left hover:text-foreground transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              </PartnershipDialog>
            ) : (
              <GuestBookingLink href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </GuestBookingLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Minimal Brand Social SVG Icons */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function SiteFooter({ lang }: SiteFooterProps) {
  // Read the active route below [lang], including during client navigation.
  const segment = useSelectedLayoutSegment();
  const isBookingFlow = ['rent', 'book', 'checkout', 'booking', 'manage-booking'].includes(
    segment ?? ''
  );
  const dict = getDictionary(lang);
  const { columns, rights } = dict.footer;
  const brand = dict.brand;

  const [copiedWeChat, setCopiedWeChat] = useState(false);

  const copyWeChatId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('yangsi3010');
      setCopiedWeChat(true);
      setTimeout(() => setCopiedWeChat(false), 2500);
    }
  };

  return (
    <footer
      className={cn(
        'bg-muted border-t border-border pt-12 pb-16 text-foreground-secondary',
        isBookingFlow && 'hidden md:block'
      )}
    >
      <div className="max-w-default mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand introduction and four independent navigation groups. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* 1. Brand Column (4 cols) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <BrandLogo lang={lang} className="mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1.5">{brand.slogan}</p>
            <p className="text-xs text-foreground-secondary leading-relaxed max-w-sm">
              {dict.footer.description}
            </p>
          </div>

          {(['rent', 'service', 'business', 'company'] as const).map((key) => (
            <div key={key} className="min-w-0 col-span-1 lg:col-span-2">
              <FooterGroup group={columns[key]} lang={lang} />
            </div>
          ))}
        </div>

        {/* Bottom Bar: Airbnb-style Copyright, Legal & Minimalist Icon Cluster */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Left: Copyright & Legal Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
            <span>{rights}</span>
            <span className="hidden sm:inline text-border" aria-hidden="true">
              ·
            </span>
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
              <Link href={`/${lang}/terms`} className="hover:text-foreground transition-colors">
                {columns.legal.terms}
              </Link>
              <Link href={`/${lang}/privacy`} className="hover:text-foreground transition-colors">
                {columns.legal.privacy}
              </Link>
              <Link href={`/${lang}/cookies`} className="hover:text-foreground transition-colors">
                {columns.legal.cookiePolicy}
              </Link>
              <Link href={`/${lang}/safety`} className="hover:text-foreground transition-colors">
                {columns.legal.safetyPolicy}
              </Link>
              <button
                type="button"
                onClick={() => openCookiePreferences()}
                className="hover:text-foreground transition-colors underline underline-offset-2 cursor-pointer"
              >
                {getTranslation('footer_cookie_settings', lang)}
              </button>
            </div>
          </div>

          {/* Right: Direct Contacts + Brand Social Icons */}
          <div className="flex items-center gap-2.5 text-foreground-secondary">
            {/* WhatsApp */}
            <a
              href="https://wa.me/8618761991085"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={getTranslation('contact_whatsapp_label', lang)}
              title="WhatsApp: +86 187 6199 1085"
              className="p-1.5 rounded-full hover:bg-background hover:text-success transition-colors duration-150"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Email */}
            <a
              href="mailto:soren.yang@trustgo.tech"
              aria-label={getTranslation('contact_email_label', lang)}
              title="Email: soren.yang@trustgo.tech"
              className="p-1.5 rounded-full hover:bg-background hover:text-foreground transition-colors duration-150"
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* WeChat Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={getTranslation('contact_wechat_label', lang)}
                  title="WeChat: yangsi3010"
                  className="p-1.5 rounded-full hover:bg-background hover:text-foreground transition-colors duration-150 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-68 p-3 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {getTranslation('contact_wechat_label', lang)}
                    </span>
                    <span className="text-xs text-muted-foreground">ID: yangsi3010</span>
                  </div>
                  <p className="text-xs text-foreground-secondary leading-normal">
                    {getTranslation('contact_wechat_hint', lang)}
                  </p>
                  <div className="pt-1.5 border-t border-border flex items-center justify-between">
                    <span className="font-mono text-xs text-foreground font-semibold">yangsi3010</span>
                    <button
                      type="button"
                      onClick={copyWeChatId}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-tag text-xs font-medium bg-warm-light text-warm-strong hover:bg-warm/20 transition-colors cursor-pointer"
                    >
                      {copiedWeChat ? (
                        <>
                          <Check className="w-3 h-3 text-success" />
                          <span className="text-success font-semibold">
                            {getTranslation('common_copied', lang)}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{getTranslation('common_copy', lang)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Subtle Divider */}
            <span className="h-3.5 w-px bg-border mx-0.5" aria-hidden="true" />

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={getTranslation('footer_social_facebook', lang)}
              title="Facebook"
              className="p-1.5 rounded-full hover:bg-background hover:text-foreground transition-colors duration-150"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={getTranslation('footer_social_x', lang)}
              title="X"
              className="p-1.5 rounded-full hover:bg-background hover:text-foreground transition-colors duration-150"
            >
              <XIcon className="w-3.5 h-3.5" />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={getTranslation('footer_social_instagram', lang)}
              title="Instagram"
              className="p-1.5 rounded-full hover:bg-background hover:text-foreground transition-colors duration-150"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

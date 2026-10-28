'use client';

import React from 'react';
import { ArrowRight, BookOpenText, ExternalLink } from 'lucide-react';
import type { HelpFaqExternalLink, HelpFaqReferenceLink } from '../domain/helpFaqData/types';

interface HelpAnswerRendererProps {
  answer: string | string[];
  searchQuery?: string;
  referenceLinks?: HelpFaqReferenceLink[];
  externalLinks?: HelpFaqExternalLink[];
}

/**
 * Helper to render search query highlight
 */
function renderSearchHighlight(text: string, query?: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const cleanQuery = query.trim();
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === cleanQuery.toLowerCase() ? (
          <mark
            key={i}
            className="rounded-tag bg-warm-light px-1 py-0.5 text-warm-strong font-semibold"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/**
 * Parses markdown bold (**text**) and markdown links ([label](url))
 */
function parseMarkdownInline(text: string, query?: string): React.ReactNode {
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={idx} className="font-bold text-foreground">
              {renderSearchHighlight(boldText, query)}
            </strong>
          );
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a
              key={idx}
              href={url}
              className="font-semibold text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 underline transition-colors inline-flex items-center gap-0.5"
            >
              {label}
            </a>
          );
        }
        return <React.Fragment key={idx}>{renderSearchHighlight(part, query)}</React.Fragment>;
      })}
    </>
  );
}

/**
 * Formats a single line of text, automatically bolding key prefixes (e.g., "Japan (JP):")
 */
function formatLineContent(line: string, query?: string): React.ReactNode {
  const colonMatch = line.match(/^([^:：\n]{2,32}[:：])\s*(.*)$/);
  if (colonMatch) {
    const prefix = colonMatch[1];
    const rest = colonMatch[2];
    return (
      <>
        <strong className="font-bold text-foreground">
          {renderSearchHighlight(prefix, query)}
        </strong>{' '}
        {parseMarkdownInline(rest, query)}
      </>
    );
  }

  return parseMarkdownInline(line, query);
}

export default function HelpAnswerRenderer({
  answer,
  searchQuery,
  referenceLinks = [],
  externalLinks = [],
}: HelpAnswerRendererProps) {
  const paragraphs = Array.isArray(answer) ? answer : [answer];

  return (
    <div className="max-w-reading space-y-3 text-body">
      {paragraphs.map((paragraph, pIdx) => {
        const rawLines = paragraph.split('\n');

        return (
          <div key={pIdx} className="space-y-1">
            {rawLines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lIdx} className="h-2" />;
              }

              // 1. Check if line is a Section Title: [Header] or 【標題】 or ### Header
              const bracketMatch = trimmed.match(/^(?:\[([^\]]+)\]|【([^】]+)】|###\s*(.+))$/);
              if (bracketMatch) {
                const title = bracketMatch[1] || bracketMatch[2] || bracketMatch[3];
                return (
                  <div key={lIdx} className="mt-4 mb-2">
                    <span className="text-title font-semibold text-foreground">
                      {renderSearchHighlight(title, searchQuery)}
                    </span>
                  </div>
                );
              }

              // 2. Check if line is a Bullet Point
              const bulletMatch = trimmed.match(/^(?:[•・*]|\d+[.)]|-)\s+(.*)$/);
              if (bulletMatch) {
                const itemContent = bulletMatch[1];
                return (
                  <div
                    key={lIdx}
                    className="flex items-start gap-2 text-body text-foreground-secondary my-1"
                  >
                    <span className="select-none text-muted-foreground text-body shrink-0">•</span>
                    <div className="flex-1 min-w-0">
                      {formatLineContent(itemContent, searchQuery)}
                    </div>
                  </div>
                );
              }

              // 3. Regular Paragraph Line
              return (
                <p key={lIdx} className="text-body text-foreground-secondary my-1">
                  {formatLineContent(trimmed, searchQuery)}
                </p>
              );
            })}
          </div>
        );
      })}

      {/* Reference Links */}
      {referenceLinks.length > 0 && (
        <div className="pt-2 flex flex-wrap gap-2">
          {referenceLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-background px-4 py-2 text-body font-semibold text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
            >
              <BookOpenText
                className="h-4 w-4 shrink-0 text-foreground-secondary"
                aria-hidden="true"
              />
              <span className="min-w-0 break-words">{link.label}</span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-foreground-secondary"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      )}

      {/* External Official Portals */}
      {externalLinks.length > 0 && (
        <div className="pt-1 flex flex-wrap gap-2">
          {externalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-background px-4 py-2 text-body font-semibold text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
            >
              <span className="min-w-0 break-words">{link.label}</span>
              <ExternalLink
                className="h-4 w-4 shrink-0 text-foreground-secondary"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';
import { VehicleCardSkeleton } from './SearchSkeleton';

export const SEARCH_RESULT_EXPIRY_MS = 3 * 60 * 1000; // 3 minutes

export function SearchLoadingProgressBar({ label }: { label?: string }) {
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(45), 100);
    const t2 = setTimeout(() => setProgress(72), 350);
    const t3 = setTimeout(() => setProgress(88), 800);
    const t4 = setTimeout(() => setProgress(96), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="w-full space-y-2.5 mb-5 select-none" role="status" aria-live="polite">
      {/* Horizontal Progress Bar Track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-brand transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Spinner & Single Main Title */}
      {label && (
        <div className="flex items-center gap-2 pt-0.5">
          <Loader2 className="h-4 w-4 animate-spin text-foreground-secondary shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-foreground">{label}</span>
        </div>
      )}
    </div>
  );
}

export function SearchRefreshSkeleton({
  variant = 'results',
  label,
}: {
  variant?: 'results' | 'booking';
  label?: string;
}) {
  if (variant === 'booking') {
    return (
      <div
        className="grid gap-5 motion-safe:animate-pulse lg:grid-cols-[minmax(0,1fr)_24rem]"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={label}
      >
        <div className="grid gap-5">
          <div className="h-52 rounded-card bg-muted" />
          <div className="h-80 rounded-card bg-muted" />
        </div>
        <div className="h-72 rounded-card bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {label && <SearchLoadingProgressBar label={label} />}
      <div
        className="space-y-6"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={label}
      >
        {[0, 1, 2].map((index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

const expiryCopy: Record<
  string,
  {
    title: string;
    description: string;
    action: string;
    loading: string;
    back?: string;
  }
> = {
  en: {
    title: 'Search results expired',
    description: 'Vehicle availability and rates may have updated. Refresh to view live options.',
    action: 'Refresh Search',
    loading: 'Refreshing live inventory...',
    back: 'Back to vehicle search',
  },
  zh: {
    title: '搜尋結果已過期',
    description: '車輛庫存與費率可能已發生變更。請重新整理以檢視即時最新報價。',
    action: '重新整理搜尋',
    loading: '正在重新檢索庫存...',
    back: '返回車輛搜尋',
  },
  ja: {
    title: '検索結果の有効期限が切れました',
    description: '最新の空き状況と料金を確認するため、再検索して更新してください。',
    action: '検索を更新',
    loading: '最新情報を取得中...',
    back: '車両検索に戻る',
  },
  es: {
    title: 'La búsqueda ha caducado',
    description:
      'La disponibilidad y tarifas de los vehículos pueden haber cambiado. Actualice para ver las opciones en vivo.',
    action: 'Actualizar búsqueda',
    loading: 'Actualizando disponibilidad...',
    back: 'Volver a la búsqueda',
  },
  ko: {
    title: '검색 결과가 만료되었습니다',
    description: '차량 재고 및 요금이 변동되었을 수 있습니다. 새로고침하여 최신 정보를 확인하세요.',
    action: '검색 새로고침',
    loading: '최신 재고 조회 중...',
    back: '차량 검색으로 돌아가기',
  },
};

const rateExpiryCopy: Record<
  string,
  {
    title: string;
    description: string;
    action: string;
    loading: string;
    back?: string;
  }
> = {
  en: {
    title: 'Rental rate expired',
    description: 'Refresh to get the latest rental price.',
    action: 'Refresh rental rate',
    loading: 'Refreshing live rates...',
  },
  zh: {
    title: '租車費率已過期',
    description: '請重新整理，取得最新租車價格。',
    action: '重新整理費率',
    loading: '正在重新檢索費率...',
  },
  ja: {
    title: '料金プランの有効期限が切れました',
    description: '更新して最新のレンタカー料金をご確認ください。',
    action: '料金を更新',
    loading: '最新料金を取得中...',
  },
  es: {
    title: 'La tarifa de alquiler ha caducado',
    description: 'Actualice para consultar el precio de alquiler más reciente.',
    action: 'Actualizar tarifa',
    loading: 'Actualizando tarifas...',
  },
  ko: {
    title: '렌트 요금이 만료되었습니다',
    description: '새로고침하여 최신 렌터카 요금을 확인하세요.',
    action: '요금 새로고침',
    loading: '최신 요금 조회 중...',
  },
};

export function SearchExpiryDialog({
  isOpen,
  isRefreshing,
  onRefresh,
  lang = 'zh',
  variant = 'search',
  backHref,
}: {
  isOpen: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  lang?: string;
  variant?: 'search' | 'rate';
  backHref?: string;
}) {
  const dictionary = variant === 'rate' ? rateExpiryCopy : expiryCopy;
  const copy = dictionary[lang] || dictionary.en;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        variant="sheet"
        hideCloseButton
        className="max-w-md p-6 sm:p-8"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex items-start gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warm-light text-warm-strong">
            <AlertCircle className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <DialogTitle id="search-expiry-title" className="text-lg font-bold text-foreground">
              {copy.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-foreground-secondary">
              {copy.description}
            </DialogDescription>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-control bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-raised transition-all hover:bg-primary-hover disabled:cursor-wait disabled:bg-accent cursor-pointer"
          >
            {isRefreshing && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isRefreshing ? copy.loading : copy.action}
          </button>
          {variant !== 'rate' && backHref && copy.back && (
            <Link
              href={backHref}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-control border border-border bg-background px-5 py-3 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {copy.back}
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useSearchExpiry({
  isActive,
  resetKey,
  expiresAt,
  onRefresh,
  lang = 'zh',
  variant = 'search',
  backHref,
}: {
  isActive: boolean;
  resetKey: unknown;
  expiresAt?: string;
  onRefresh: () => void | Promise<void>;
  lang?: string;
  variant?: 'search' | 'rate';
  backHref?: string;
}) {
  const [isExpired, setIsExpired] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshRef = useRef(onRefresh);

  useEffect(() => {
    refreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- external system sync
    setIsExpired(false);
    if (!isActive) return;

    const remaining = expiresAt ? Date.parse(expiresAt) - Date.now() : SEARCH_RESULT_EXPIRY_MS;
    const timer = window.setTimeout(() => setIsExpired(true), Number.isFinite(remaining) ? Math.max(0, remaining) : 0);
    return () => window.clearTimeout(timer);
  }, [isActive, resetKey, expiresAt]);

  const triggerExpiry = useCallback(() => {
    setIsExpired(true);
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshRef.current();
      setIsExpired(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    isExpired,
    triggerExpiry,
    searchExpiryDialog: (
      <SearchExpiryDialog
        isOpen={isExpired}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        lang={lang}
        variant={variant}
        backHref={backHref}
      />
    ),
    isSearchRefreshing: isRefreshing,
  };
}

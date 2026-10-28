import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton';

export default function RateDetailsLoading() {
  return (
    <div
      className="py-6 bg-muted min-h-dvh"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading rate details"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link Placeholder */}
        <Skeleton className="h-4 w-36" />

        {/* Stepper Skeleton */}
        <div className="bg-background rounded-card border border-border p-4 shadow-raised">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-0.5 w-12" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-0.5 w-12" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Main Grid: Left Details & Right Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Vehicle Snapshot Skeleton */}
            <div className="bg-background rounded-card border border-border overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-raised">
              <div className="md:col-span-5 h-56 bg-muted flex items-center justify-center p-6">
                <Skeleton className="w-44 h-24 rounded-card opacity-50" />
              </div>
              <div className="md:col-span-7 p-6 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-6 w-16 rounded-control" />
                  <Skeleton className="h-6 w-16 rounded-control" />
                  <Skeleton className="h-6 w-16 rounded-control" />
                </div>
                <div className="pt-3 space-y-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
              </div>
            </div>

            {/* Insurance Packages Skeleton */}
            <div className="bg-background rounded-card border border-border p-6 shadow-raised space-y-4">
              <Skeleton className="h-5 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-control border border-border space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-4/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) Sticky Sidebar Skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-background rounded-card border border-border p-6 shadow-raised space-y-5">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-3 py-3 border-y border-border">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-28" />
                </div>
                <Skeleton className="h-3 w-40 ml-auto" />
              </div>
              <Skeleton className="h-12 w-full rounded-control bg-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

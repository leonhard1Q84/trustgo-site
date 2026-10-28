'use client';

import React, { useEffect } from 'react';
import { TravelVehicleIllustration } from '@/shared/ui/illustrations/TravelVehicleIllustration';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TrustGo Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-background flex flex-col items-center justify-center p-6 font-sans antialiased text-foreground">
        <div className="max-w-md w-full text-center space-y-6 my-auto">
          <TravelVehicleIllustration variant="pit-stop" className="w-full max-w-sm mx-auto" />

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              A quick pit stop!
            </h1>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              We hit an unexpected bump. Please restart your session.
            </p>
          </div>

          <div>
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-8 py-2.5 rounded-control bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all shadow-raised cursor-pointer active:scale-[0.99]"
            >
              Restart Session
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

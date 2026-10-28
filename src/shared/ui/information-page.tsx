import type { ReactNode } from 'react';

// Reuses the existing static information-page presentation.
export function InformationPage({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="py-16 bg-muted min-h-[70vh]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <article className="bg-background rounded-card p-8 sm:p-12 border border-border shadow-raised">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          <p className="text-sm text-foreground-secondary mt-2 mb-8 leading-relaxed">{description}</p>
          <div className="prose text-xs sm:text-sm text-foreground-secondary space-y-4 border-t border-border pt-6 leading-relaxed">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
}

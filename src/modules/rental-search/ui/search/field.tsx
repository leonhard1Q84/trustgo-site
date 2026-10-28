import React from 'react';
import { cn } from '@/shared/ui/utils';

/** Shared 56px search field box (Component Library §2.1): label on top, value below. */
export function fieldBoxClass(invalid?: boolean, className?: string) {
  return cn(
    'relative flex h-14 min-w-0 items-center gap-3 rounded-control border bg-background px-3.5 text-left transition-colors',
    'hover:border-foreground focus-within:border-brand focus-within:ring-1 focus-within:ring-brand',
    invalid ? 'border-destructive' : 'border-input',
    className
  );
}

export function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  const Comp = htmlFor ? 'label' : 'span';
  return (
    <Comp htmlFor={htmlFor} className="block truncate text-xs font-semibold text-foreground">
      {children}
    </Comp>
  );
}

export function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-destructive">
      {children}
    </p>
  );
}

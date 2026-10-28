import * as React from 'react';
import { cn } from './utils';

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/**
 * Airbnb-style neutral filter chip. Selected state uses foreground fill, never brand blue
 * (Design Guidelines §3.1 color budget).
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ selected = false, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected
          ? 'border-foreground bg-foreground text-background hover:bg-foreground-secondary active:bg-foreground-secondary'
          : 'border-border-strong bg-background text-foreground hover:border-foreground hover:bg-muted active:bg-muted',
        className
      )}
      {...props}
    />
  )
);
FilterChip.displayName = 'FilterChip';

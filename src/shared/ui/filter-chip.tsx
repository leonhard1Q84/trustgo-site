import * as React from 'react';
import { cn } from './utils';

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/**
 * Filter chip. Selected state uses the brand selection outline (`Primary-Strong` border and text
 * on `Brand-Light`), never a dark fill (Component Library §1.4, Design Guidelines §3.1).
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ selected = false, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:border-border disabled:text-foreground-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected
          ? 'border-primary bg-brand-light text-primary hover:border-primary-hover active:bg-brand-light'
          : 'border-border-strong bg-background text-foreground hover:border-foreground hover:bg-muted active:bg-muted',
        className
      )}
      {...props}
    />
  )
);
FilterChip.displayName = 'FilterChip';

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from './utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-100 bg-scrim sm:backdrop-blur-xs data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

/**
 * Shared overlay surface for all C-end dialogs.
 *
 * variant:
 * - 'sheet' H5 = bottom sheet (max-h 92dvh, top radius), PC = centered modal. For confirmations & short content.
 * - 'full' H5 = full-screen sheet (inset-0, no radius), PC = centered modal. For pickers & long content.
 * - 'center' centered modal on all viewports.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    variant?: 'sheet' | 'full' | 'center';
    hideCloseButton?: boolean;
    sheetBreakpoint?: 'sm' | 'md';
  }
>(
  (
    {
      className,
      children,
      variant = 'sheet',
      hideCloseButton = false,
      sheetBreakpoint = 'sm',
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-100 flex flex-col bg-background text-foreground shadow-overlay focus:outline-none',
          variant === 'sheet' &&
            'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-sheet data-[state=open]:animate-sheet-up data-[state=closed]:animate-sheet-down',
          variant === 'sheet' &&
            (sheetBreakpoint === 'md'
              ? 'md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-sheet md:data-[state=open]:animate-dialog-in md:data-[state=closed]:animate-dialog-out'
              : 'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-sheet sm:data-[state=open]:animate-dialog-in sm:data-[state=closed]:animate-dialog-out'),
          variant === 'full' &&
            'inset-0 h-dvh data-[state=open]:animate-sheet-up data-[state=closed]:animate-sheet-down sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[92dvh] sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-sheet sm:data-[state=open]:animate-dialog-in sm:data-[state=closed]:animate-dialog-out',
          variant === 'center' &&
            'left-1/2 top-1/2 max-h-[92dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-sheet data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out',
          className
        )}
        {...props}
      >
        {children}
        {!hideCloseButton && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col gap-1 border-b border-border px-5 py-4 sm:px-6', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1 overflow-y-auto px-5 py-4 sm:px-6', className)} {...props} />
);
DialogBody.displayName = 'DialogBody';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex items-center justify-end gap-3 border-t border-border bg-muted px-5 py-3.5 sm:px-6 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:pb-3.5',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-base font-bold tracking-tight text-foreground sm:text-lg', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-xs leading-relaxed text-foreground-secondary sm:text-sm', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

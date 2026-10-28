import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-control text-sm font-semibold transition-all duration-150 ease-enter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary: 'border border-border-strong bg-background text-foreground hover:bg-muted',
        ghost: 'text-foreground-secondary hover:text-foreground hover:bg-muted',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto font-medium',
        text: 'text-foreground underline-offset-4 hover:text-primary hover:underline active:text-primary active:bg-brand-light active:scale-100',
      },
      size: {
        default: 'h-12 px-6 py-3 min-h-12',
        sm: 'h-9 px-4 text-xs rounded-tag',
        lg: 'h-14 px-8 text-base rounded-control',
        icon: 'h-11 w-11 min-h-11 min-w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

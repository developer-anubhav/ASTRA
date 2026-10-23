import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--astra-accent)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--astra-accent)] text-black hover:bg-[var(--astra-accent)]/90 font-semibold',
        secondary:
          'bg-[var(--astra-bg-elevated)] text-[var(--astra-text-primary)] border border-[var(--astra-border)] hover:bg-[var(--astra-bg-hover)]',
        outline:
          'border border-[var(--astra-border-bright)] bg-transparent text-[var(--astra-text-primary)] hover:bg-[var(--astra-bg-elevated)]',
        ghost:
          'text-[var(--astra-text-secondary)] hover:bg-[var(--astra-bg-elevated)] hover:text-[var(--astra-text-primary)]',
        destructive:
          'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30',
        cortex:
          'bg-[var(--cortex-accent)] text-black font-semibold hover:bg-[var(--cortex-accent)]/90 shadow-[0_0_15px_rgba(77,159,255,0.2)]',
        'cortex-ghost':
          'text-[var(--cortex-accent)] hover:bg-[var(--cortex-accent-muted)] border border-[var(--cortex-accent)]/30',
      },
      size: {
        default: 'h-8 px-3 py-1.5',
        sm: 'h-7 px-2.5 text-[11px]',
        lg: 'h-9 px-4 text-sm',
        icon: 'h-8 w-8 p-0',
        'icon-sm': 'h-7 w-7 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

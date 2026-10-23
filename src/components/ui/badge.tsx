import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none tracking-wide uppercase transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] text-[var(--astra-text-primary)]',
        secondary:
          'bg-[var(--astra-bg-overlay)] border border-[var(--astra-border-bright)] text-[var(--astra-text-secondary)]',
        destructive:
          'bg-red-500/15 border border-red-500/40 text-red-400',
        outline:
          'border border-[var(--astra-border-bright)] text-[var(--astra-text-secondary)] bg-transparent',
        demo:
          'bg-purple-500/15 border border-purple-500/40 text-purple-300',
        cortex:
          'bg-[var(--cortex-accent-muted)] border border-[var(--cortex-accent)]/35 text-[var(--cortex-accent)]',
        live:
          'bg-green-500/15 border border-green-500/40 text-green-400',
        cached:
          'bg-amber-500/15 border border-amber-500/40 text-amber-400',
        propagated:
          'bg-blue-500/15 border border-blue-500/40 text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-border bg-surface-card shadow-[var(--shadow-card)]',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-5',
        padding === 'lg' && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  action,
  subtitle,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Badge({
  children,
  variant = 'default',
}: {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'orange'
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        variant === 'default' && 'bg-slate-100 text-slate-700',
        variant === 'success' && 'bg-brand-50 text-brand-700',
        variant === 'warning' && 'bg-amber-50 text-amber-700',
        variant === 'orange' && 'bg-orange-50 text-orange-700',
      )}
    >
      {children}
    </span>
  )
}

export function Button({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] px-4 py-2.5 text-sm font-semibold transition',
        variant === 'primary' && 'bg-brand-500 text-white hover:bg-brand-600',
        variant === 'secondary' &&
          'border border-border bg-white text-slate-700 hover:bg-surface',
        variant === 'ghost' && 'text-slate-600 hover:bg-surface',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

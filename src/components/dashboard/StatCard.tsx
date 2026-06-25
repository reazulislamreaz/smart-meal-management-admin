import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

type StatCardProps = {
  label: string
  value: string
  target: string
  change: string
  trend: 'up' | 'down'
  accent: string
  light: string
}

export function StatCard({
  label,
  value,
  target,
  change,
  trend,
  accent,
  light,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className={cn('absolute right-0 top-0 h-1 w-full', accent)} />
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-slate-900">{value}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted">{target}</p>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
            light,
          )}
        >
          {trend === 'up' ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {change}
        </span>
      </div>
    </Card>
  )
}

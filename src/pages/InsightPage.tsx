import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { insights } from '@/data/mockData'
import { Card, CardHeader } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

const iconMap = {
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
}

const colorMap = {
  success: 'border-brand-200 bg-brand-50 text-brand-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
}

export function InsightPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight) => {
          const Icon = iconMap[insight.type as keyof typeof iconMap]
          return (
            <Card
              key={insight.title}
              className={cn('border-2', colorMap[insight.type as keyof typeof colorMap])}
            >
              <div className="flex gap-3">
                <Icon className="h-6 w-6 shrink-0" />
                <div>
                  <h4 className="font-semibold">{insight.title}</h4>
                  <p className="mt-2 text-sm opacity-90">{insight.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card padding="lg">
        <CardHeader
          title="Nutrition Insights"
          subtitle="Personalized recommendations based on your data"
        />
        <div className="space-y-4">
          {[
            {
              title: 'Best performing meal slot',
              value: 'Breakfast',
              detail: 'Most consistent macro balance at 92% accuracy',
            },
            {
              title: 'Most logged category',
              value: 'High Protein',
              detail: '38% of your recipes this month',
            },
            {
              title: 'Suggested focus',
              value: 'Hydration',
              detail: 'Increase water intake by 1.5L daily',
            },
          ].map((row) => (
            <div
              key={row.title}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border px-5 py-4"
            >
              <div>
                <p className="text-sm text-muted">{row.title}</p>
                <p className="font-display text-xl font-semibold text-slate-900">
                  {row.value}
                </p>
              </div>
              <p className="text-sm text-muted">{row.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

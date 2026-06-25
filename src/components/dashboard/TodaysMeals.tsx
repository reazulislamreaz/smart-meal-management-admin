import { Clock, Flame } from 'lucide-react'
import { todaysMeals } from '@/data/mockData'
import { Card, CardHeader } from '@/components/ui/Card'

export function TodaysMeals() {
  return (
    <Card>
      <CardHeader title="Today's Meals" subtitle="Your planned meals for today" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {todaysMeals.map((meal) => (
          <div
            key={meal.id}
            className="group overflow-hidden rounded-2xl border border-border bg-white transition hover:shadow-md"
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={meal.image}
                alt={meal.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
                {meal.type}
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-900">{meal.title}</h4>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-accent-orange" />
                  {meal.calories} kcal
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {meal.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

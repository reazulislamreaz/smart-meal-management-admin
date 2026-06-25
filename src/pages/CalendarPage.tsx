import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, Button } from '@/components/ui/Card'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const events = [
  { day: 23, title: 'Meal prep Sunday', color: 'bg-brand-500' },
  { day: 24, title: 'Nutrition check-in', color: 'bg-accent-yellow' },
  { day: 26, title: 'Grocery run', color: 'bg-accent-orange' },
  { day: 28, title: 'Weekly review', color: 'bg-sky-500' },
]

export function CalendarPage() {
  const cells = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2
    return day >= 1 && day <= 30 ? day : null
  })

  return (
    <Card padding="lg">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">June 2026</h3>
        <div className="flex gap-2">
          <Button variant="secondary" className="!px-3">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" className="!px-3">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted">
        {days.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          const event = events.find((e) => e.day === day)
          return (
            <div
              key={index}
              className={`min-h-24 rounded-xl border p-2 ${
                day ? 'border-border bg-white' : 'border-transparent'
              }`}
            >
              {day && (
                <>
                  <span className="text-sm font-semibold text-slate-700">{day}</span>
                  {event && (
                    <p
                      className={`mt-2 rounded-lg px-2 py-1 text-[10px] font-medium text-white ${event.color}`}
                    >
                      {event.title}
                    </p>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

import { Plus } from 'lucide-react'
import { mealPlanWeek } from '@/data/mockData'
import { Button, Card, CardHeader } from '@/components/ui/Card'

const mealTypes = ['Breakfast', 'Lunch', 'Dinner']

export function MealPlanPage() {
  return (
    <Card padding="lg">
      <CardHeader
        title="Weekly Meal Plan"
        subtitle="June 23 – June 29, 2026"
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Add Meal
          </Button>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="pb-4 pr-4 text-left font-medium text-muted">Meal</th>
              {mealPlanWeek.map((day) => (
                <th key={day.day} className="pb-4 px-2 text-center">
                  <p className="font-semibold text-slate-900">{day.day}</p>
                  <p className="text-xs text-muted">{day.date} Jun</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map((type, rowIndex) => (
              <tr key={type} className="border-t border-border">
                <td className="py-4 pr-4 font-medium text-slate-700">{type}</td>
                {mealPlanWeek.map((day) => (
                  <td key={`${day.day}-${type}`} className="px-2 py-4">
                    <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center text-xs font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50">
                      {day.meals[rowIndex]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

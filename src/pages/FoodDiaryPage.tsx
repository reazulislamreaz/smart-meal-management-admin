import { Plus } from 'lucide-react'
import { recentDiary } from '@/data/mockData'
import { Button, Card, CardHeader } from '@/components/ui/Card'

const allEntries = [
  ...recentDiary,
  { food: 'Grilled salmon', meal: 'Dinner', calories: 540, time: '7:15 PM' },
  { food: 'Herbal tea', meal: 'Snack', calories: 5, time: '9:00 PM' },
]

export function FoodDiaryPage() {
  const totalCalories = allEntries.reduce((sum, e) => sum + e.calories, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Total Calories</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">
            {totalCalories} kcal
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Meals Logged</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">
            {allEntries.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Remaining</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-600">
            {2200 - totalCalories} kcal
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Today's Log"
          subtitle="Wednesday, June 24, 2026"
          action={
            <Button>
              <Plus className="h-4 w-4" />
              Log Food
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-3 font-medium">Food</th>
                <th className="pb-3 font-medium">Meal Type</th>
                <th className="pb-3 font-medium">Calories</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {allEntries.map((row) => (
                <tr
                  key={`${row.food}-${row.time}`}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="py-3 font-medium text-slate-900">{row.food}</td>
                  <td className="py-3 text-muted">{row.meal}</td>
                  <td className="py-3">{row.calories} kcal</td>
                  <td className="py-3 text-muted">{row.time}</td>
                  <td className="py-3">
                    <button type="button" className="text-sm font-medium text-brand-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

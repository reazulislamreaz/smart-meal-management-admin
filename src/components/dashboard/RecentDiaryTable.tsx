import { recentDiary } from '@/data/mockData'
import { Card, CardHeader } from '@/components/ui/Card'

export function RecentDiaryTable() {
  return (
    <Card>
      <CardHeader title="Recent Food Diary" subtitle="Latest logged entries" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-3 font-medium">Food</th>
              <th className="pb-3 font-medium">Meal</th>
              <th className="pb-3 font-medium">Calories</th>
              <th className="pb-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentDiary.map((row) => (
              <tr key={`${row.food}-${row.time}`} className="border-b border-border/70 last:border-0">
                <td className="py-3 font-medium text-slate-900">{row.food}</td>
                <td className="py-3 text-muted">{row.meal}</td>
                <td className="py-3 text-slate-700">{row.calories} kcal</td>
                <td className="py-3 text-muted">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

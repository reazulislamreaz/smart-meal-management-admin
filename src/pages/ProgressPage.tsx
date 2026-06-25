import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { weeklyCalories } from '@/data/mockData'
import { Card, CardHeader } from '@/components/ui/Card'

const weightData = [
  { week: 'W1', weight: 78.2 },
  { week: 'W2', weight: 77.8 },
  { week: 'W3', weight: 77.5 },
  { week: 'W4', weight: 77.1 },
  { week: 'W5', weight: 76.8 },
  { week: 'W6', weight: 76.5 },
]

export function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Current Weight', value: '76.5 kg', change: '-1.7 kg' },
          { label: 'Avg. Daily Calories', value: '1,930', change: 'On target' },
          { label: 'Workouts This Month', value: '14', change: '+2 vs last' },
          { label: 'Streak', value: '12 days', change: 'Personal best!' },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-semibold text-brand-600">{stat.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Weight Trend" subtitle="Last 6 weeks" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Weekly Calorie Intake" subtitle="Compared to 2,200 kcal goal" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyCalories}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

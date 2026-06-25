import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { macroBreakdown, weeklyCalories } from '@/data/mockData'
import { Card, CardHeader } from '@/components/ui/Card'

export function WeeklyCaloriesChart() {
  return (
    <Card className="h-full">
      <CardHeader title="Weekly Calories" subtitle="Daily intake vs target" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyCalories} barSize={28}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
              }}
            />
            <Bar dataKey="calories" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function MacroChart() {
  return (
    <Card className="h-full">
      <CardHeader title="Macro Breakdown" subtitle="Today&apos;s nutrition split" />
      <div className="flex h-64 items-center gap-6">
        <div className="h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroBreakdown}
                dataKey="value"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={4}
              >
                {macroBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {macroBreakdown.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-700">{item.name}</span>
              <span className="ml-auto text-sm font-semibold text-slate-900">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

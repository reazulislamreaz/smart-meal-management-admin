import { dashboardStats } from '@/data/mockData'
import { StatCard } from '@/components/dashboard/StatCard'
import { WeeklyCaloriesChart, MacroChart } from '@/components/dashboard/Charts'
import { TodaysMeals } from '@/components/dashboard/TodaysMeals'
import { RecentDiaryTable } from '@/components/dashboard/RecentDiaryTable'
import { GroceryPreview } from '@/components/dashboard/GroceryPreview'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WeeklyCaloriesChart />
        </div>
        <MacroChart />
      </div>

      <TodaysMeals />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentDiaryTable />
        </div>
        <GroceryPreview />
      </div>
    </div>
  )
}

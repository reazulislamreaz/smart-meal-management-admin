import { Flame, Plus, Timer } from 'lucide-react'
import { exercises } from '@/data/mockData'
import { Badge, Button, Card, CardHeader } from '@/components/ui/Card'

export function ExercisePage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-brand-500 text-white">
          <p className="text-sm text-brand-100">Calories Burned Today</p>
          <p className="mt-1 font-display text-3xl font-bold">420 kcal</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Active Minutes</p>
          <p className="mt-1 font-display text-3xl font-bold text-slate-900">55 min</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Workouts This Week</p>
          <p className="mt-1 font-display text-3xl font-bold text-slate-900">4</p>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Activity Log"
          subtitle="Track your workouts and movement"
          action={
            <Button>
              <Plus className="h-4 w-4" />
              Log Workout
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {exercises.map((workout) => (
            <div
              key={workout.name}
              className="flex items-center gap-4 rounded-2xl border border-border p-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Flame className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{workout.name}</h4>
                  <Badge variant="success">{workout.type}</Badge>
                </div>
                <div className="mt-1 flex gap-4 text-sm text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {workout.duration}
                  </span>
                  <span>{workout.calories} kcal burned</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Clock, Flame, Star } from 'lucide-react'
import { recipes } from '@/data/mockData'
import { Badge, Card } from '@/components/ui/Card'

export function HealthyMenuPage() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {recipes.map((recipe) => (
        <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
          <Card className="group h-full overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-44 overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold backdrop-blur">
                <Star className="h-3.5 w-3.5 fill-accent-yellow text-accent-yellow" />
                {recipe.rating}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                {recipe.title}
              </h3>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted">
                <span className="inline-flex items-center gap-1">
                  <Flame className="h-4 w-4 text-accent-orange" />
                  {recipe.calories} kcal
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {recipe.time}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="success">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Flame, Users } from 'lucide-react'
import { recipes } from '@/data/mockData'
import { Badge, Button, Card } from '@/components/ui/Card'

const ingredients = [
  '2 cups quinoa, cooked',
  '1 cup cherry tomatoes',
  '1 cucumber, diced',
  '1/2 red onion, sliced',
  '200g grilled chicken breast',
  '3 tbsp olive oil',
  'Fresh parsley & lemon juice',
]

const steps = [
  'Cook quinoa according to package directions and let cool.',
  'Chop all vegetables and grill the chicken breast.',
  'Combine quinoa, vegetables, and chicken in a large bowl.',
  'Dress with olive oil, lemon juice, salt, and pepper.',
  'Garnish with fresh parsley and serve chilled or at room temperature.',
]

export function RecipeDetailsPage() {
  const { id } = useParams()
  const recipe = recipes.find((r) => r.id === id) ?? recipes[0]

  return (
    <div className="space-y-6">
      <Link
        to="/healthy-menu"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Healthy Menu
      </Link>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-[var(--radius-card)]">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full min-h-[320px] w-full object-cover"
          />
        </div>

        <Card padding="lg">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="success">
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold text-slate-900">
            {recipe.title}
          </h2>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent-orange" />
              {recipe.calories} kcal per serving
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {recipe.time}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-5 w-5" />
              2 servings
            </span>
          </div>
          <p className="mt-6 leading-relaxed text-slate-600">
            A vibrant, nutrient-dense bowl packed with lean protein, whole grains,
            and fresh Mediterranean flavors. Perfect for meal prep and balanced lunches.
          </p>
          <div className="mt-6 flex gap-3">
            <Button>Add to Meal Plan</Button>
            <Button variant="secondary">Add to Grocery</Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <h3 className="font-display text-lg font-semibold">Ingredients</h3>
          <ul className="mt-4 space-y-3">
            {ingredients.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm text-slate-700"
              >
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg">
          <h3 className="font-display text-lg font-semibold">Instructions</h3>
          <ol className="mt-4 space-y-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4 text-sm text-slate-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  )
}

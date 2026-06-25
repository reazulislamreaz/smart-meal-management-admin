import { Check } from 'lucide-react'
import { groceryItems } from '@/data/mockData'
import { Card, CardHeader, Button } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

export function GroceryPreview() {
  return (
    <Card>
      <CardHeader
        title="Grocery List"
        subtitle="Auto-generated from meal plan"
        action={<Button variant="ghost">View all</Button>}
      />
      <ul className="space-y-3">
        {groceryItems.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
          >
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-md border',
                item.checked
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-300 bg-white',
              )}
            >
              {item.checked && <Check className="h-3.5 w-3.5" />}
            </span>
            <div className="flex-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  item.checked ? 'text-muted line-through' : 'text-slate-900',
                )}
              >
                {item.name}
              </p>
              <p className="text-xs text-muted">{item.category}</p>
            </div>
            <span className="text-sm text-muted">{item.qty}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

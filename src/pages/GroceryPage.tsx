import { Plus, Trash2 } from 'lucide-react'
import { groceryItems } from '@/data/mockData'
import { Badge, Button, Card, CardHeader } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

export function GroceryPage() {
  const grouped = groceryItems.reduce<Record<string, typeof groceryItems>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Shopping List"
          subtitle="Generated from this week's meal plan"
          action={
            <div className="flex gap-2">
              <Button variant="secondary">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
              <Button>Generate from Plan</Button>
            </div>
          }
        />

        <div className="mb-4 flex gap-4 text-sm">
          <span className="text-muted">
            Total: <strong className="text-slate-900">{groceryItems.length}</strong> items
          </span>
          <span className="text-muted">
            Checked:{' '}
            <strong className="text-brand-600">
              {groceryItems.filter((i) => i.checked).length}
            </strong>
          </span>
        </div>
      </Card>

      {Object.entries(grouped).map(([category, items]) => (
        <Card key={category}>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold">{category}</h3>
            <Badge>{items.length}</Badge>
          </div>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-4 rounded-xl border border-border px-4 py-3"
              >
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                />
                <span
                  className={cn(
                    'flex-1 font-medium',
                    item.checked ? 'text-muted line-through' : 'text-slate-900',
                  )}
                >
                  {item.name}
                </span>
                <span className="text-sm text-muted">{item.qty}</span>
                <button type="button" className="text-muted hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  )
}

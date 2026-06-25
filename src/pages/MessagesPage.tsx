import { messages } from '@/data/mockData'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

export function MessagesPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="p-0">
        <div className="border-b border-border p-4">
          <input
            type="search"
            placeholder="Search messages..."
            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <ul>
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={cn(
                'flex cursor-pointer gap-3 border-b border-border px-4 py-4 transition hover:bg-surface',
                msg.unread && 'bg-brand-50/50',
              )}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                {msg.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-slate-900">{msg.name}</p>
                  <span className="shrink-0 text-xs text-muted">{msg.time}</span>
                </div>
                <p className="text-xs text-brand-600">{msg.role}</p>
                <p className="mt-1 truncate text-sm text-muted">{msg.preview}</p>
              </div>
              {msg.unread && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card padding="lg" className="flex min-h-[480px] flex-col">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
            SC
          </div>
          <div>
            <p className="font-semibold text-slate-900">Dr. Sarah Chen</p>
            <p className="text-sm text-muted">Nutritionist · Online</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-4 py-6">
          <div className="max-w-md rounded-2xl rounded-bl-md bg-surface px-4 py-3 text-sm text-slate-700">
            Your weekly meal plan looks great! Consider adding more fiber-rich vegetables
            to your lunch meals for better digestion.
          </div>
          <div className="ml-auto max-w-md rounded-2xl rounded-br-md bg-brand-500 px-4 py-3 text-sm text-white">
            Thanks! Can you suggest a high-fiber lunch I can prep ahead?
          </div>
        </div>
        <div className="flex gap-2 border-t border-border pt-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          />
          <button
            type="button"
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Send
          </button>
        </div>
      </Card>
    </div>
  )
}

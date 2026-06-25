import { Bell, ChevronDown, Search } from 'lucide-react'

type HeaderProps = {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border bg-white px-8 py-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search meals, recipes..."
            className="h-11 w-72 rounded-xl border border-border bg-surface pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-slate-600 transition hover:bg-surface"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent-orange" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl border border-border bg-white py-2 pl-2 pr-3 transition hover:bg-surface"
        >
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"
            alt="Admin user"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900">Alex Morgan</p>
            <p className="text-xs text-muted">Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted" />
        </button>
      </div>
    </header>
  )
}

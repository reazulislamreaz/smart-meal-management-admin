import { NavLink } from 'react-router-dom'
import { Leaf, LogOut, Settings } from 'lucide-react'
import { navItems } from '@/config/navigation'
import { cn } from '@/lib/cn'

export function Sidebar() {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
          <Leaf className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold leading-tight text-slate-900">
            Smart Meal
          </p>
          <p className="text-xs text-muted">Management Admin</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700',
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 space-y-1 border-t border-border pt-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Settings className="h-5 w-5" />
          Settings
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}

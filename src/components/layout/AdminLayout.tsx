import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { pageTitles } from '@/config/navigation'

const subtitles: Record<string, string> = {
  '/': 'Welcome back! Here is your nutrition overview for today.',
  '/calendar': 'Plan and review your schedule.',
  '/messages': 'Chat with nutritionists and community.',
  '/healthy-menu': 'Browse healthy recipes for every meal.',
  '/meal-plan': 'Your weekly meal schedule at a glance.',
  '/grocery': 'Smart shopping list generated from your plan.',
  '/food-diary': 'Track everything you eat today.',
  '/progress': 'Monitor your health journey over time.',
  '/exercise': 'Log workouts and stay active.',
  '/insight': 'AI-powered recommendations for you.',
}

function resolveTitle(pathname: string) {
  if (pathname.startsWith('/recipes/')) return pageTitles['/recipes/:id']
  return pageTitles[pathname] ?? 'Dashboard'
}

export function AdminLayout() {
  const { pathname } = useLocation()
  const title = resolveTitle(pathname)
  const subtitle = subtitles[pathname.startsWith('/recipes/') ? '/healthy-menu' : pathname]

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

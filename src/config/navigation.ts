import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Salad,
  CalendarRange,
  ShoppingCart,
  NotebookPen,
  TrendingUp,
  Dumbbell,
  Lightbulb,
} from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: typeof LayoutDashboard
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Calendar', path: '/calendar', icon: CalendarDays },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'Healthy Menu', path: '/healthy-menu', icon: Salad },
  { label: 'Meal Plan', path: '/meal-plan', icon: CalendarRange },
  { label: 'Grocery', path: '/grocery', icon: ShoppingCart },
  { label: 'Food Diary', path: '/food-diary', icon: NotebookPen },
  { label: 'Progress', path: '/progress', icon: TrendingUp },
  { label: 'Exercise', path: '/exercise', icon: Dumbbell },
  { label: 'Insight', path: '/insight', icon: Lightbulb },
]

export const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/calendar': 'Calendar',
  '/messages': 'Messages',
  '/healthy-menu': 'Healthy Menu',
  '/recipes/:id': 'Recipe Details',
  '/meal-plan': 'Meal Plan',
  '/grocery': 'Grocery',
  '/food-diary': 'Food Diary',
  '/progress': 'Progress',
  '/exercise': 'Exercise',
  '/insight': 'Insight',
}

export const dashboardStats = [
  {
    label: 'Daily Calories',
    value: '1,842',
    target: '2,200 kcal',
    change: '+12%',
    trend: 'up' as const,
    accent: 'bg-brand-500',
    light: 'bg-brand-50 text-brand-700',
  },
  {
    label: 'Meals Planned',
    value: '18',
    target: 'This week',
    change: '+3',
    trend: 'up' as const,
    accent: 'bg-accent-yellow',
    light: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'Pantry Items',
    value: '64',
    target: '12 expiring soon',
    change: '-2',
    trend: 'down' as const,
    accent: 'bg-accent-orange',
    light: 'bg-orange-50 text-orange-700',
  },
  {
    label: 'Water Intake',
    value: '6.2L',
    target: 'Goal: 8L',
    change: '+0.8L',
    trend: 'up' as const,
    accent: 'bg-sky-500',
    light: 'bg-sky-50 text-sky-700',
  },
]

export const weeklyCalories = [
  { day: 'Mon', calories: 1820, protein: 92 },
  { day: 'Tue', calories: 1950, protein: 88 },
  { day: 'Wed', calories: 1760, protein: 95 },
  { day: 'Thu', calories: 2100, protein: 102 },
  { day: 'Fri', calories: 1880, protein: 90 },
  { day: 'Sat', calories: 2200, protein: 98 },
  { day: 'Sun', calories: 1842, protein: 94 },
]

export const macroBreakdown = [
  { name: 'Protein', value: 28, color: '#22c55e' },
  { name: 'Carbs', value: 45, color: '#fbbf24' },
  { name: 'Fats', value: 27, color: '#f97316' },
]

export const todaysMeals = [
  {
    id: '1',
    type: 'Breakfast',
    title: 'Avocado Toast & Eggs',
    calories: 420,
    time: '8:00 AM',
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    type: 'Lunch',
    title: 'Grilled Chicken Salad',
    calories: 520,
    time: '12:30 PM',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    type: 'Dinner',
    title: 'Salmon with Quinoa',
    calories: 610,
    time: '7:00 PM',
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    type: 'Snack',
    title: 'Greek Yogurt & Berries',
    calories: 180,
    time: '3:30 PM',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  },
]

export const recentDiary = [
  { food: 'Oatmeal with banana', meal: 'Breakfast', calories: 320, time: '7:45 AM' },
  { food: 'Green smoothie', meal: 'Snack', calories: 145, time: '10:15 AM' },
  { food: 'Turkey wrap', meal: 'Lunch', calories: 480, time: '1:00 PM' },
  { food: 'Mixed nuts', meal: 'Snack', calories: 210, time: '4:20 PM' },
]

export const groceryItems = [
  { name: 'Chicken breast', qty: '500g', checked: false, category: 'Protein' },
  { name: 'Spinach', qty: '2 bunches', checked: true, category: 'Vegetables' },
  { name: 'Quinoa', qty: '1 bag', checked: false, category: 'Grains' },
  { name: 'Avocados', qty: '4 pcs', checked: false, category: 'Produce' },
  { name: 'Greek yogurt', qty: '2 tubs', checked: true, category: 'Dairy' },
]

export const recipes = [
  {
    id: '1',
    title: 'Mediterranean Bowl',
    calories: 485,
    time: '25 min',
    rating: 4.8,
    tags: ['High Protein', 'Gluten Free'],
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Veggie Stir Fry',
    calories: 320,
    time: '15 min',
    rating: 4.5,
    tags: ['Vegan', 'Quick'],
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Protein Pancakes',
    calories: 410,
    time: '20 min',
    rating: 4.9,
    tags: ['Breakfast', 'High Protein'],
    image:
      'https://images.unsplash.com/photo-1528207776548-565d66110947?w=600&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Berry Smoothie Bowl',
    calories: 290,
    time: '10 min',
    rating: 4.6,
    tags: ['Vegan', 'Low Cal'],
    image:
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Grilled Salmon Plate',
    calories: 540,
    time: '30 min',
    rating: 4.7,
    tags: ['Omega-3', 'Dinner'],
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
  },
  {
    id: '6',
    title: 'Quinoa Power Salad',
    calories: 380,
    time: '18 min',
    rating: 4.4,
    tags: ['Salad', 'Fiber Rich'],
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
  },
]

export const messages = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Nutritionist',
    preview: 'Your weekly meal plan looks great! Consider adding more fiber...',
    time: '2h ago',
    unread: true,
    avatar: 'SC',
  },
  {
    id: '2',
    name: 'Meal Prep Group',
    role: 'Community',
    preview: 'Anyone tried the new quinoa salad recipe?',
    time: '5h ago',
    unread: true,
    avatar: 'MP',
  },
  {
    id: '3',
    name: 'Smart Meal Bot',
    role: 'Assistant',
    preview: 'Reminder: 3 pantry items expire tomorrow.',
    time: 'Yesterday',
    unread: false,
    avatar: 'SM',
  },
]

export const mealPlanWeek = [
  {
    day: 'Mon',
    date: '23',
    meals: ['Oatmeal Bowl', 'Chicken Salad', 'Salmon & Veg'],
  },
  {
    day: 'Tue',
    date: '24',
    meals: ['Smoothie Bowl', 'Turkey Wrap', 'Pasta Primavera'],
  },
  {
    day: 'Wed',
    date: '25',
    meals: ['Eggs & Toast', 'Buddha Bowl', 'Stir Fry'],
  },
  {
    day: 'Thu',
    date: '26',
    meals: ['Yogurt Parfait', 'Quinoa Salad', 'Grilled Fish'],
  },
  {
    day: 'Fri',
    date: '27',
    meals: ['Protein Pancakes', 'Soup & Bread', 'Tacos'],
  },
  {
    day: 'Sat',
    date: '28',
    meals: ['French Toast', 'Burger Bowl', 'Pizza Night'],
  },
  {
    day: 'Sun',
    date: '29',
    meals: ['Avocado Toast', 'Meal Prep', 'Roast Chicken'],
  },
]

export const exercises = [
  { name: 'Morning Run', duration: '30 min', calories: 280, type: 'Cardio' },
  { name: 'Strength Training', duration: '45 min', calories: 320, type: 'Strength' },
  { name: 'Yoga Session', duration: '20 min', calories: 95, type: 'Flexibility' },
  { name: 'Cycling', duration: '40 min', calories: 350, type: 'Cardio' },
]

export const insights = [
  {
    title: 'Protein intake is on track',
    description: 'You hit your protein goal 5 of 7 days this week.',
    type: 'success',
  },
  {
    title: 'Hydration needs attention',
    description: 'Average water intake is 22% below your daily target.',
    type: 'warning',
  },
  {
    title: 'Reduce food waste',
    description: '3 items in pantry expire within 48 hours. Plan meals around them.',
    type: 'info',
  },
]

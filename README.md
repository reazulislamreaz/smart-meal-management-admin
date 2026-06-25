# Smart Meal Management — Admin UI

React + TypeScript + Tailwind CSS admin dashboard for the Smart Meal Planning & Pantry Management system.

Design reference: [Figma — Smart Meal Management](https://www.figma.com/design/VBjYEWlgyxQULZ5U1yukpc/Smart-meal-management%7C%7C--4000-%7C%7C?node-id=1-36)

## Run locally

```bash
cd admin
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Pages

| Route | Screen |
|-------|--------|
| `/` | Dashboard |
| `/calendar` | Calendar |
| `/messages` | Messages |
| `/healthy-menu` | Healthy Menu |
| `/recipes/:id` | Recipe Details |
| `/meal-plan` | Meal Plan |
| `/grocery` | Grocery |
| `/food-diary` | Food Diary |
| `/progress` | Progress |
| `/exercise` | Exercise |
| `/insight` | Insight |

All pages use mock data in `src/data/mockData.ts`. Connect to NestJS API when the backend is ready.

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4
- React Router
- Recharts
- Lucide React icons

# ASCEND

Premium frontend for an AI-powered habit tracker and daily discipline system.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn-style Radix UI components
- Framer Motion
- Recharts, TanStack Table, React Hook Form, Zod, Day.js, next-themes

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/login`, `/signup` | Auth UI (mock) |
| `/dashboard` | Overview |
| `/today` | Today's routine |
| `/month` | Monthly OMR-style tracker |
| `/analytics` | Charts and stats |
| `/ai` | AI coach chat UI (mock) |
| `/calendar` | Calendar with day panel |
| `/settings` | Preferences |

Habit data persists in `localStorage` only — no backend, auth, or AI APIs in this phase.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint

# GeoSkills Atlas

Faculty-facing Vercel app for maintaining a database of **geospatial skillsets** — competencies, learning objectives, outcomes, and exercises — to support course planning.

## Stack

- **Next.js** (App Router) on Vercel
- **Clerk** for authentication (allowlisted faculty emails)
- **Neon Postgres** + **Drizzle ORM** for the skillset database

## Features

- Browse skillsets as **cards** or a **list**
- Filter by **topic**, **competency**, **level**, **outcome** keywords, and free text
- Faculty with allowed emails can **create/edit** skillsets through a structured form
- Detail pages show competencies, objectives, outcomes (Bloom level), and exercises

## One-time setup

Vercel Marketplace provisioning must be done with an authenticated Vercel account:

```bash
npx vercel login
npx vercel link
npx vercel integration add neon
npx vercel integration add clerk
npx vercel env pull .env.local --yes
```

Then set faculty allowlist:

```bash
npx vercel env add ALLOWED_EMAILS
# example: anbumaniba7@gmail.com,colleague@university.edu
```

Also add Clerk routing vars if not present:

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`

Push schema and seed sample geospatial content:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run db:push` | Apply Drizzle schema to Neon |
| `npm run db:seed` | Seed topics, competencies, and sample skillsets |
| `npm run db:studio` | Open Drizzle Studio |

## Data model

- **Topics** — curriculum domains (Remote Sensing, GIS Analysis, …)
- **Competencies** — reusable capability tags
- **Skillsets** — titled planning units with level and hours
- **Objectives / Outcomes / Exercises** — nested course-planning content

## Auth model

Anyone can browse the catalog. Creating or editing requires Clerk sign-in **and** an email listed in `ALLOWED_EMAILS`. If `ALLOWED_EMAILS` is empty, any signed-in user may contribute (useful for early local testing).

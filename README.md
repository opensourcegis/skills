# GeoSkills Atlas

Faculty-facing Vercel app for a database of geospatial skillsets — competencies, objectives, outcomes, and exercises.

## Stack

- **Next.js** (App Router) on Vercel
- **In-code seed data** + **Vercel Edge Config** persistence (`src/lib/config.ts`)
- **No authentication** for now (open contribute/edit)

## Local

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Data

- Seed catalog lives in `src/data/seed-data.ts`
- Runtime store: `src/data/store.ts` reads/writes Edge Config key `geoskills_db`
- Edge Config ID/token are set in `src/lib/config.ts`

## Deploy

Push to `main`. Ensure the Edge Config store is connected to the Vercel project. Turn off **Deployment Protection → Vercel Authentication** so the public URL does not require a Vercel login.

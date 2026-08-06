# GeoSkills Atlas

Faculty-facing Vercel app for maintaining a database of **geospatial skillsets** — competencies, learning objectives, outcomes, and exercises — to support course planning.

## Stack

- **Next.js** (App Router) on Vercel
- **Auth.js (NextAuth)** with **Google** sign-in (allowlisted faculty emails)
- **Neon Postgres** + **Drizzle ORM** for the skillset database

## Features

- Browse skillsets as **cards** or a **list**
- Filter by **topic**, **competency**, **level**, **outcome** keywords, and free text
- Faculty with allowed Google emails can **create/edit** skillsets through a structured form
- Detail pages show competencies, objectives, outcomes (Bloom level), and exercises

## One-time setup

### 1. Database

```bash
npx vercel login
npx vercel link
npx vercel integration add neon
npx vercel env pull .env.local --yes
```

### 2. Google sign-in (no Vercel login for site users)

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an **OAuth 2.0 Client ID** (Web application).
2. Add authorized redirect URI:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://YOUR-DOMAIN/api/auth/callback/google`
3. Set env vars on Vercel / `.env.local`:

```bash
AUTH_SECRET=$(openssl rand -base64 32)
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
ALLOWED_EMAILS=you@university.edu,colleague@university.edu
```

### 3. Disable Vercel Deployment Protection for public access

If visitors see a Vercel login / SSO page or SSL errors on preview URLs, open the Vercel project → **Settings → Deployment Protection** and disable **Vercel Authentication** for Production (and Preview if those links should be public). Site login is Google-only via Auth.js — visitors should never need a Vercel account.

### 4. Schema + seed

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

## Auth model

Anyone can browse the catalog. Creating or editing requires Google sign-in with an email listed in `ALLOWED_EMAILS`. If `ALLOWED_EMAILS` is empty, any signed-in Google user may contribute (useful for early testing).

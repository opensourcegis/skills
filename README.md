# GeoSkills Atlas

Faculty app for geospatial skillsets and custom course information sheets.

## Features

- Browse skillsets (cards/list + filters)
- **Sign in with Google** (any Google account) to contribute or build courses
- Add competencies, theory / demo / exercise sessions, and assessment methods
- **Courses** tab: combine skillsets → course information sheet

## Setup

1. Create a Google OAuth Web client  
   Redirect: `https://YOUR-DOMAIN/api/auth/callback/google`
2. Set Vercel env vars: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
3. Redeploy. Turn off **Deployment Protection → Vercel Authentication** so visitors are not asked for a Vercel account.

```bash
npm install
npm run dev
```

Browse is public. Contribute / edit / build course require Google sign-in.

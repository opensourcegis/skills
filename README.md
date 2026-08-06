# GeoSkills Atlas

Faculty app for geospatial skillsets and custom course information sheets.

## Features

- Browse skillsets (cards/list + filters)
- **Google sign-in** required to contribute or build courses
- Add **new competencies**, **theory / demo / exercise sessions**, and tick **assessment methods**
- **Courses** tab: combine skillsets → course information sheet (objectives, outcomes, competencies, sessions, assessments)

## Setup

1. Create a Google OAuth Web client  
   Redirect: `https://YOUR-DOMAIN/api/auth/callback/google`
2. Set Vercel env vars: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`  
   Optional: `ALLOWED_EMAILS` (comma-separated). If empty, any Google user can contribute.
3. Redeploy. Turn off **Deployment Protection → Vercel Authentication** so visitors are not asked for a Vercel account.

```bash
npm install
npm run dev
```

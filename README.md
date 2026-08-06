# GeoSkills Atlas

Faculty app for geospatial skillsets and custom course information sheets.

**Production domain:** https://geospatialskills.in

## Features

- Browse skillsets (cards/list + filters)
- **Sign in with Google** (any Google account) to contribute or build courses
- Add competencies, theory / demo / exercise sessions, and assessment methods
- **Courses** tab: combine skillsets → course information sheet

## Add domain on Vercel

1. Vercel project → **Settings → Domains** → add:
   - `geospatialskills.in`
   - `www.geospatialskills.in` (optional, redirect to apex)
2. At your DNS provider for `geospatialskills.in`, set:

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

3. Wait for DNS + SSL (Vercel issues the certificate automatically).
4. Turn off **Deployment Protection → Vercel Authentication** so the public domain is not gated by a Vercel login.

## Google sign-in

1. [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) → OAuth client (Web)
2. Authorized JavaScript origins:
   - `https://www.geospatialskills.in`
   - `https://geospatialskills.in`
   - `http://localhost:3000` (local)
3. Authorized redirect URIs:
   - `https://www.geospatialskills.in/api/auth/callback/google`
   - `https://geospatialskills.in/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
4. Set only these Vercel env vars (Production + Preview):
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`

Do **not** set `AUTH_SECRET` — it is built into the app.

Session signing uses a built-in app secret in code — you do **not** need a personal `AUTH_SECRET`.

Signed-in users can **edit** and **delete** courses from the course sheet.

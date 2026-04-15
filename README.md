# AgliClass

AgliClass is a school-syllabus-driven platform for buying verified school book kits and reselling used school books through a hyperlocal workflow.

Live product:
- https://agliclass-startup.vercel.app

## What this repo includes

- Buyer flow for school-specific book kits
- Seller flow for single-book or full-kit resale submissions
- Parent account workspace
- Driver workspace
- Internal admin operations screens
- Supabase-backed data layer
- Vercel-ready Next.js deployment

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Local setup

1. Copy `.env.example` to `.env.local`
2. Fill in the required environment variables
3. Install dependencies
4. Run the development server

```bash
npm install
npm run dev
```

## Environment variables

Use `.env.example` as the source of truth for required configuration. Do not commit real credentials, service-role keys, admin passwords, or session secrets.

## Security note

This public repository is intentionally checked in without production credentials. All sensitive values should be managed through Vercel and Supabase environment settings.

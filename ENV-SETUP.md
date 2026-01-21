# Environment Setup Guide

## Supabase Configuration

For at få projektet til at køre, skal du konfigurere Supabase credentials:

### 1. Opret et Supabase projekt

1. Gå til [supabase.com](https://supabase.com)
2. Opret en gratis konto eller log ind
3. Klik "New Project"
4. Vælg et navn, database password og region
5. Vent på at projektet er klar (~2 minutter)

### 2. Find dine API credentials

1. I dit Supabase dashboard, gå til **Settings** → **API**
2. Find disse værdier:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### 3. Opdatér .env.local

Åbn `.env.local` filen i projekt-roden og erstát placeholder-værdierne:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dinfejlfejl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-lange-anon-key-her
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Genstart development server

```bash
npm run dev
```

Projektet skulle nu køre uden Supabase-fejl.

## Database Setup (kommer senere)

Når vi begynder at bruge databasen, skal du:

1. Oprette tables i Supabase
2. Sætte Row Level Security policies op
3. Generere TypeScript types med: `npx supabase gen types typescript --project-id DIT_PROJECT_ID > types/supabase.ts`

## Sikkerhed

⚠️ **VIGTIGT**: 
- `.env.local` er i `.gitignore` og bliver **ALDRIG** committet til git
- Gem aldrig secrets direkte i koden
- Brug kun `NEXT_PUBLIC_*` variabler til data der må være offentlig

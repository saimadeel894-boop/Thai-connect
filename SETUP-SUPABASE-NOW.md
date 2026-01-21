# 🚀 SUPABASE SETUP - STEP BY STEP

## ❌ CURRENT ISSUES
1. Env vars ikke loaded
2. Database tabeller mangler

## ✅ FIX NOW

### STEP 1: Opdater .env.local (2 min)

**Åbn filen:** `/Users/john/Desktop/Thaiconnect/.env.local`

**Erstat ALT indhold med dette:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Hent dine rigtige values:**
1. Gå til: https://app.supabase.com
2. Vælg dit projekt
3. Settings → API
4. Kopier:
   - **Project URL** → Erstat `https://your-project-id.supabase.co`
   - **anon public key** (lang string) → Erstat `your-anon-key-here`

**GEM FILEN!**

---

### STEP 2: Kør Migrations (5 min)

**Option A: Supabase Dashboard (Nemmest)**

1. Gå til dit Supabase projekt
2. Klik **SQL Editor** i venstre menu
3. Klik **New Query**
4. Kopier HELE indholdet fra: `/Users/john/Desktop/Thaiconnect/supabase/migrations/20240116000000_initial_schema.sql`
5. Paste ind og klik **Run**
6. Gentag med: `20240119000000_seed_fake_profiles.sql` (15 fake profiler)

**Option B: Supabase CLI**

```bash
cd /Users/john/Desktop/Thaiconnect
supabase db push
```

---

### STEP 3: Genstart Server

```bash
# Stop serveren (Ctrl+C hvis den kører)
# Derefter:
cd /Users/john/Desktop/Thaiconnect
npm run dev
```

---

### STEP 4: Test

Besøg: http://localhost:3000/user

**Forventet:**
- ✅ Ingen server error
- ✅ 15 profiler vises (hvis du kørte seed)
- ✅ Console logs clean

---

## 🆘 HVIS DET STADIG IKKE VIRKER

Kør dette i terminal:
```bash
cd /Users/john/Desktop/Thaiconnect
cat .env.local
```

Send mig output så fikser jeg det.

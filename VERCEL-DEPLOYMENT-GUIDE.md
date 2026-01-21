# 🚀 VERCEL DEPLOYMENT GUIDE - FRESH START

## Problem vi løser
Vercel browser-based deployment er "stuck" på gammel commit (1aaefa9) selvom den nyeste code (63da0f1) med fix'et er på GitHub. Vi skal starte helt forfra.

---

## ✅ STEP-BY-STEP GUIDE

### STEP 1: Slet eksisterende Vercel projekt

1. Gå til: https://vercel.com/johns-projects-156c8165/thaiconnect-aeh3
2. Klik på **"Settings"** tab
3. Scroll helt ned
4. Find **"Delete Project"**
5. Skriv projekt navnet for at bekræfte
6. Klik **"Delete"**

**Dette fjerner alle caches og gamle data.**

---

### STEP 2: Import projekt fra GitHub IGEN

1. Gå til: https://vercel.com/new
2. Find dit GitHub repo: **johnkorsgaaard-beep/thaiconnect**
3. Klik **"Import"**
4. **VIGTIGT: STOP HER - TRYK IKKE DEPLOY ENDNU!**

---

### STEP 3: Tilføj Environment Variables

**FØR du trykker Deploy**, klik på **"Environment Variables"** dropdown og tilføj ALLE disse:

#### Variable 1:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://wgnzbscfqqhxpfaomafx.supabase.co
Environment: Production, Preview, Development (vælg alle 3)
```

#### Variable 2:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnbnpic2NmcXFoeHBmYW9tYWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDEyMjYsImV4cCI6MjA4NDExNzIyNn0.XiHjuDQ0xp-Fw63ma2xitI-WDAdMpmDe09bsk2n4mmY
Environment: Production, Preview, Development
```

#### Variable 3:
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://thaiconnect.vercel.app
Environment: Production, Preview, Development
```
*(Opdater dette senere med din rigtige URL)*

#### Variable 4:
```
Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_your_publishable_key_here
Environment: Production, Preview, Development
```

#### Variable 5:
```
Key: STRIPE_SECRET_KEY
Value: sk_live_your_secret_key_here
Environment: Production, Preview, Development
```

#### Variable 6:
```
Key: NEXT_PUBLIC_STRIPE_MONTHLY_PAYMENT_LINK
Value: https://buy.stripe.com/aFa3cv4IndrC5o76NJ6Na02
Environment: Production, Preview, Development
```

#### Variable 7:
```
Key: NEXT_PUBLIC_STRIPE_YEARLY_PAYMENT_LINK
Value: https://buy.stripe.com/3cI28r7Uz2MY2bVegb6Na03
Environment: Production, Preview, Development
```

---

### STEP 4: Deploy

**VIGTIGT: Lad "Use existing Build Cache" være UNCHECKED (tom)**

1. Scroll ned til bunden
2. Verificer at **"Use existing Build Cache"** IKKE er valgt
3. Klik **"Deploy"**

**Vent 2-3 minutter...**

---

### STEP 5: Verificer Deployment

Når deployment er færdig:

#### ✅ Deployment vil lykkes fordi:
- Frisk projekt = ingen gammel cache
- Bruger nyeste commit (63da0f1) fra GitHub
- Fix for `selectedTransaction.user?.name` er inkluderet

#### 🧪 Test følgende:

1. **Åbn din Vercel URL**
   
2. **Test `/user` page:**
   - Skal vise profiler fra Supabase
   - Ikke mock data

3. **Test `/admin/login`:**
   - Email: din admin email
   - Password: Random001
   - Admin Code: Random001
   - Skal logge ind uden fejl

4. **Test `/admin/payments`:**
   - **KRITISK TEST**: Klik på en transaction
   - Skal vise bruger info UDEN fejl
   - Tidligere fejlede med: "selectedTransaction.user is possibly undefined"
   - NU skal det virke med fix'et

5. **Test Premium Upgrade:**
   - Gå til `/user`
   - Klik "Upgrade to Premium"
   - Skal redirecte til Stripe Checkout

---

### STEP 6: Opdater NEXT_PUBLIC_SITE_URL (valgfrit)

Hvis din Vercel URL er anderledes end forventet:

1. Copy din rigtige URL (fx: https://thaiconnect-abc123.vercel.app)
2. Gå til **Settings → Environment Variables**
3. Find `NEXT_PUBLIC_SITE_URL`
4. Klik **"Edit"**
5. Opdater til din rigtige URL
6. **Redeploy** projektet (gå til Deployments → klik "..." → Redeploy)

---

## 🎯 FORVENTET RESULTAT

- ✅ Deployment: **Success** (ingen TypeScript fejl)
- ✅ Build time: ~2-3 minutter
- ✅ All pages load korrekt
- ✅ Supabase connection virker
- ✅ Stripe payment links virker
- ✅ Admin payments page VIRKER (ingen undefined user error)

---

## 🐛 TROUBLESHOOTING

### Problem: "selectedTransaction.user is possibly undefined" fejl
**Løsning:** Dette betyder Vercel stadig bruger gammel cache.
- Gå til deployment → klik "Redeploy" → **DEAKTIVÉR "Use existing Build Cache"**

### Problem: "No members found" på /user
**Løsning:** Environment variables mangler eller er forkerte.
- Check Settings → Environment Variables
- Verificer `NEXT_PUBLIC_SUPABASE_URL` og `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Problem: Premium upgrade virker ikke
**Løsning:** Stripe env vars mangler.
- Check at alle Stripe variables er tilføjet korrekt

---

## ✨ HVORFOR DETTE VIRKER

1. **Sletning af gammelt projekt** = Fjerner ALLE caches
2. **Fresh import** = Vercel henter nyeste code fra GitHub (63da0f1)
3. **Ingen build cache** = Tvinger rebuild fra scratch
4. **Alle env vars tilføjet FØR deployment** = Ingen missing variables

**Result: Clean deployment med nyeste code og fix'et! 🎉**

---

## 📋 CHECKLIST

Brug denne før du starter:

- [ ] Gammelt Vercel projekt slettet
- [ ] GitHub repo er på nyeste commit (63da0f1)
- [ ] Alle 7 environment variables klar til copy/paste
- [ ] "Use existing Build Cache" er UNCHECKED
- [ ] Deploy startet
- [ ] Vent på success
- [ ] Test alle kritiske pages
- [ ] Verificer fix virker på /admin/payments

---

**START NU! Gå til Step 1 og slet det gamle projekt! 🚀**

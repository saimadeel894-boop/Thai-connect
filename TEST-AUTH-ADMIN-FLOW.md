# ✅ TEST GUIDE - Auth + Admin Platform

## 🎯 HVAD ER LAVET

### B) User Auth ✅
- ✅ `/signup` - Opretter user + profile i Supabase
- ✅ `/login` - Logger ind med Supabase auth
- ✅ Auto-redirect til `/user` efter login

### A) Admin Platform ✅
- ✅ `/admin/users` - Live data fra Supabase profiles
- ✅ `/admin/messages` - Live data fra Supabase messages
- ✅ `/admin/reports` - Placeholder (coming soon)

---

## 🧪 TEST FLOW - STEP BY STEP

### STEP 1: Test Signup (2 min)

1. **Gå til:** http://localhost:3002/signup

2. **Udfyld:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`

3. **Klik "Sign Up"**

4. **Forventet:**
   - ✅ Redirect til `/user`
   - ✅ Ser enten profiler (hvis DB har data) eller "No members found"
   - ✅ Ingen errors i console

---

### STEP 2: Test Login (1 min)

1. **Log ud** (refresh browser eller clear cookies)

2. **Gå til:** http://localhost:3002/login

3. **Login med:**
   - Email: `test@example.com`
   - Password: `password123`

4. **Forventet:**
   - ✅ Redirect til `/user`
   - ✅ Du er logged ind

---

### STEP 3: Opret Admin User (3 min)

**Admin account skal oprettes manuelt i Supabase:**

1. Gå til Supabase Dashboard
2. **SQL Editor** → **New Query**
3. Kør dette:

```sql
-- Opdater din test user til admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'test@example.com';
```

4. **Bekræft:**
```sql
SELECT name, email, role FROM profiles WHERE email = 'test@example.com';
```

Du skulle se: `role = 'admin'`

---

### STEP 4: Test Admin Platform (2 min)

1. **Gå til:** http://localhost:3002/admin

2. **Forventet:**
   - ✅ Admin dashboard vises
   - ✅ Ser stats (users count, messages, etc.)

3. **Klik på "Users" i sidebar**
   - ✅ Ser alle users fra Supabase
   - ✅ Kan søge, filtrere, se detaljer

4. **Klik på "Messages" i sidebar**
   - ✅ Ser messages (eller tom liste hvis ingen beskeder endnu)

---

## ✅ SUCCESS CRITERIA

**Hvis alt virker:**
- ✅ Kan lave ny bruger via signup
- ✅ Kan logge ind
- ✅ Admin kan se live user data
- ✅ Admin kan se live message data
- ✅ Ingen server errors
- ✅ Console logs clean

---

## 🆘 HVIS NOGET FEJLER

### Problem: Signup fejler
**Fix:** Check at Supabase env vars er korrekt i `.env.local`

### Problem: Profile creation error
**Fix:** Kør migrations igen (20240116000000_initial_schema.sql)

### Problem: Admin login redirect loop
**Fix:** Ensure `role = 'admin'` er sat i profiles tabel

### Problem: Admin pages viser tom liste
**Fix:** Det er OK hvis DB er tom. Lav en user via signup først.

---

## 📊 DATA FLOW

```
SIGNUP FLOW:
User fills form → Supabase auth.signUp() → Creates auth.users entry 
→ Creates profiles entry → Redirect to /user

LOGIN FLOW:
User enters credentials → Supabase auth.signInWithPassword() 
→ Session created → Redirect to /user

ADMIN FLOW:
Admin logs in → Checks profile.role = 'admin' 
→ Access granted → Loads data from Supabase tables
```

---

## 🎉 NÆSTE STEPS (Efter Test)

1. ✅ Profiler vises i /user
2. ✅ Chat system med rigtig data (STEP 2)
3. ✅ Notifications system (STEP 2)
4. ✅ Admin kan redigere/suspend users
5. ✅ Admin kan delete messages

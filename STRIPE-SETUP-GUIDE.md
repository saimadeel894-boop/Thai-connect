# 🔥 STRIPE PAYMENT SETUP GUIDE

## ✅ HVAD ER LAVET:

1. ✅ Database tabeller (subscriptions, transactions, payment_methods)
2. ✅ Stripe API routes (`/api/stripe/create-checkout-session`, `/api/stripe/webhook`)
3. ✅ PremiumModal opdateret med payment links
4. ✅ Success/Cancel pages
5. ✅ Stripe client & server helpers

---

## 🚨 DU SKAL GØRE DETTE NU:

### STEP 1: Tilføj Stripe keys til `.env.local`

Åbn `/Users/john/Desktop/Thaiconnect/.env.local` og tilføj:

```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here

# Stripe Payment Links
NEXT_PUBLIC_STRIPE_MONTHLY_PAYMENT_LINK=https://buy.stripe.com/aFa3cv4IndrC5o76NJ6Na02
NEXT_PUBLIC_STRIPE_YEARLY_PAYMENT_LINK=https://buy.stripe.com/3cI28r7Uz2MY2bVegb6Na03

# Stripe Webhook (kommer fra Stripe Dashboard senere)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### STEP 2: Genstart dev server

```bash
pkill -f "next dev" && sleep 2 && cd /Users/john/Desktop/Thaiconnect && npm run dev
```

### STEP 3: Test payment flow

1. Gå til `http://localhost:3000/user`
2. Tryk på "Upgrade to Premium" knap
3. Vælg Monthly eller Yearly plan
4. Tryk "Upgrade Now"
5. Du bliver sendt til Stripe Checkout
6. Test med Stripe test card: `4242 4242 4242 4242`
7. Efter betaling → redirect til `/user/payment/success`

---

## 🔧 STRIPE WEBHOOK SETUP (VALGFRIT - KUN TIL PRODUKTION)

Webhooks bruges til at opdatere subscription status automatisk når:
- Betaling lykkes/fejler
- Subscription fornyes
- Subscription annulleres

### Lokal test med Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks til localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Kopier webhook signing secret og tilføj til .env.local
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Produktion (Vercel/Fly.io):

1. Gå til Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Vælg events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Kopier webhook secret og tilføj til production env vars

---

## 🎯 HVAD SKER NÅR BRUGER BETALER:

1. User trykker "Upgrade Now" i PremiumModal
2. Redirect til Stripe Payment Link (299 DKK/month eller 2499 DKK/year)
3. User betaler via Stripe Checkout
4. Stripe sender webhook til `/api/stripe/webhook`
5. Webhook handler:
   - Opretter/opdaterer `subscriptions` tabel
   - Opretter `transactions` record
   - User får premium status
6. User redirects til `/user/payment/success`

---

## 🐛 TROUBLESHOOTING:

**Problem: "Payment link not configured"**
→ Check at `.env.local` har `NEXT_PUBLIC_STRIPE_MONTHLY_PAYMENT_LINK` og `NEXT_PUBLIC_STRIPE_YEARLY_PAYMENT_LINK`

**Problem: Webhook fejler**
→ Check at `STRIPE_WEBHOOK_SECRET` er sat korrekt
→ Test med Stripe CLI først

**Problem: Subscription ikke opdateret efter betaling**
→ Check Stripe Dashboard → Webhooks → Se om events er delivered
→ Check logs i `/api/stripe/webhook`

---

## ✅ DONE!

Payment system er nu klar. Test det og sig til hvis noget ikke virker! 🚀

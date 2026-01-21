-- Payment System Migration (FIXED)
-- Drop existing objects if they exist
DROP TABLE IF EXISTS public.transaction_notes CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;

DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS card_brand CASCADE;
DROP TYPE IF EXISTS plan_type CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;

-- Create enum types
CREATE TYPE subscription_status AS ENUM (
  'active', 
  'cancelled', 
  'expired', 
  'past_due', 
  'trialing'
);

CREATE TYPE plan_type AS ENUM (
  'free', 
  'premium', 
  'premium_plus'
);

CREATE TYPE card_brand AS ENUM (
  'visa', 
  'mastercard', 
  'amex', 
  'discover', 
  'unionpay'
);

CREATE TYPE transaction_status AS ENUM (
  'pending', 
  'processing', 
  'succeeded', 
  'failed', 
  'refunded', 
  'partially_refunded'
);

CREATE TYPE transaction_type AS ENUM (
  'subscription', 
  'one_time', 
  'refund'
);

-- Payment Methods Table
CREATE TABLE public.payment_methods (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  card_brand card_brand NOT NULL,
  last4 text NOT NULL CHECK (length(last4) = 4),
  exp_month integer NOT NULL CHECK (exp_month >= 1 AND exp_month <= 12),
  exp_year integer NOT NULL CHECK (exp_year >= 2024),
  
  cardholder_name text,
  is_default boolean DEFAULT false,
  stripe_payment_method_id text UNIQUE,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  plan_type plan_type DEFAULT 'free' NOT NULL,
  status subscription_status DEFAULT 'active' NOT NULL,
  
  price_per_month decimal(10,2) NOT NULL,
  currency text DEFAULT 'THB' NOT NULL,
  
  start_date timestamp with time zone DEFAULT now(),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  trial_end timestamp with time zone,
  cancel_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  ended_at timestamp with time zone,
  
  default_payment_method uuid REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create unique index for one active subscription per user (replaces constraint)
CREATE UNIQUE INDEX idx_one_active_subscription 
ON public.subscriptions (user_id) 
WHERE (status = 'active');

-- Transactions Table
CREATE TABLE public.transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  payment_method_id uuid REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'THB' NOT NULL,
  status transaction_status DEFAULT 'pending' NOT NULL,
  type transaction_type DEFAULT 'subscription' NOT NULL,
  
  description text NOT NULL,
  plan_name text,
  billing_period text,
  
  stripe_payment_intent_id text UNIQUE,
  stripe_charge_id text,
  stripe_invoice_id text,
  
  refunded_amount decimal(10,2) DEFAULT 0,
  refund_reason text,
  refunded_at timestamp with time zone,
  refunded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  failure_code text,
  failure_message text,
  
  invoice_url text,
  receipt_url text,
  
  metadata jsonb,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Transaction Notes Table
CREATE TABLE public.transaction_notes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE CASCADE NOT NULL,
  admin_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  note text NOT NULL,
  
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_payment_methods_user ON public.payment_methods(user_id);
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_subscription ON public.transactions(subscription_id);

-- Disable RLS (simplify for now)
ALTER TABLE public.payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_notes DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.payment_methods TO authenticated, anon;
GRANT ALL ON public.subscriptions TO authenticated, anon;
GRANT ALL ON public.transactions TO authenticated, anon;
GRANT ALL ON public.transaction_notes TO authenticated, anon;

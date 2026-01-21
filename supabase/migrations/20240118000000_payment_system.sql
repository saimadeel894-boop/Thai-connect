-- Payment System Migration
-- Creates tables for subscriptions, payment methods, and transactions

-- Create enum types for payment system
create type subscription_status as enum (
  'active', 
  'cancelled', 
  'expired', 
  'past_due', 
  'trialing'
);

create type plan_type as enum (
  'free', 
  'premium', 
  'premium_plus'
);

create type card_brand as enum (
  'visa', 
  'mastercard', 
  'amex', 
  'discover', 
  'unionpay'
);

create type transaction_status as enum (
  'pending', 
  'processing', 
  'succeeded', 
  'failed', 
  'refunded', 
  'partially_refunded'
);

create type transaction_type as enum (
  'subscription', 
  'one_time', 
  'refund'
);

-- Payment Methods Table
create table public.payment_methods (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Card info (last 4 digits only for security)
  card_brand card_brand not null,
  last4 text not null check (length(last4) = 4),
  exp_month integer not null check (exp_month >= 1 and exp_month <= 12),
  exp_year integer not null check (exp_year >= 2024),
  
  -- Cardholder info
  cardholder_name text,
  
  -- Status
  is_default boolean default false,
  
  -- Payment gateway reference
  stripe_payment_method_id text unique,
  
  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Subscriptions Table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Plan info
  plan_type plan_type default 'free' not null,
  status subscription_status default 'active' not null,
  
  -- Billing
  price_per_month decimal(10,2) not null,
  currency text default 'THB' not null,
  
  -- Dates
  start_date timestamp with time zone default now(),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  trial_end timestamp with time zone,
  cancel_at timestamp with time zone, -- scheduled cancellation date
  cancelled_at timestamp with time zone, -- when user cancelled
  ended_at timestamp with time zone, -- when subscription actually ended
  
  -- Payment method
  default_payment_method uuid references public.payment_methods(id) on delete set null,
  
  -- Payment gateway references
  stripe_subscription_id text unique,
  stripe_customer_id text,
  
  -- Metadata
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Ensure one active subscription per user
  constraint one_active_subscription unique (user_id, status) 
    where (status = 'active')
);

-- Transactions Table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  
  -- Transaction info
  amount decimal(10,2) not null,
  currency text default 'THB' not null,
  status transaction_status default 'pending' not null,
  type transaction_type default 'subscription' not null,
  
  -- Description
  description text not null,
  plan_name text, -- snapshot of plan name at time of transaction
  billing_period text, -- e.g., "Jan 2024", "1 month", etc.
  
  -- Payment gateway references
  stripe_payment_intent_id text unique,
  stripe_charge_id text,
  stripe_invoice_id text,
  
  -- Refund info
  refunded_amount decimal(10,2) default 0,
  refund_reason text,
  refunded_at timestamp with time zone,
  refunded_by uuid references public.profiles(id) on delete set null, -- admin who issued refund
  
  -- Failure info
  failure_code text,
  failure_message text,
  
  -- URLs
  invoice_url text,
  receipt_url text,
  
  -- Metadata (for IP, device, browser, etc.)
  metadata jsonb,
  
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Transaction Notes Table (for admin notes)
create table public.transaction_notes (
  id uuid default uuid_generate_v4() primary key,
  transaction_id uuid references public.transactions(id) on delete cascade not null,
  admin_id uuid references public.profiles(id) on delete cascade not null,
  
  note text not null,
  
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_payment_methods_user on public.payment_methods(user_id);
create index idx_payment_methods_default on public.payment_methods(user_id, is_default) where is_default = true;
create index idx_subscriptions_user on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_subscriptions_period_end on public.subscriptions(current_period_end);
create index idx_transactions_user on public.transactions(user_id);
create index idx_transactions_status on public.transactions(status);
create index idx_transactions_created on public.transactions(created_at desc);
create index idx_transactions_subscription on public.transactions(subscription_id);
create index idx_transaction_notes_transaction on public.transaction_notes(transaction_id);

-- Enable Row Level Security
alter table public.payment_methods enable row level security;
alter table public.subscriptions enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_notes enable row level security;

-- RLS Policies for payment_methods
create policy "Users can view their own payment methods"
  on public.payment_methods for select
  using (auth.uid() = user_id);

create policy "Users can insert their own payment methods"
  on public.payment_methods for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own payment methods"
  on public.payment_methods for update
  using (auth.uid() = user_id);

create policy "Users can delete their own payment methods"
  on public.payment_methods for delete
  using (auth.uid() = user_id);

create policy "Admins can view all payment methods"
  on public.payment_methods for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for subscriptions
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);

create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all subscriptions"
  on public.subscriptions for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for transactions
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Admins can view all transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert transactions"
  on public.transactions for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update transactions"
  on public.transactions for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for transaction_notes
create policy "Admins can view all transaction notes"
  on public.transaction_notes for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert transaction notes"
  on public.transaction_notes for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Triggers for updated_at
create trigger set_updated_at
  before update on public.payment_methods
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.subscriptions
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.transactions
  for each row
  execute function public.handle_updated_at();

-- Function to ensure only one default payment method per user
create or replace function public.ensure_single_default_payment_method()
returns trigger as $$
begin
  if new.is_default = true then
    -- Set all other payment methods for this user to non-default
    update public.payment_methods
    set is_default = false
    where user_id = new.user_id and id != new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger ensure_single_default
  after insert or update on public.payment_methods
  for each row
  when (new.is_default = true)
  execute function public.ensure_single_default_payment_method();

-- Function to calculate monthly recurring revenue (MRR)
create or replace function public.calculate_mrr()
returns decimal as $$
declare
  total_mrr decimal;
begin
  select coalesce(sum(price_per_month), 0)
  into total_mrr
  from public.subscriptions
  where status = 'active';
  
  return total_mrr;
end;
$$ language plpgsql security definer;

-- Function to get revenue statistics
create or replace function public.get_revenue_stats(
  start_date timestamp with time zone default now() - interval '30 days',
  end_date timestamp with time zone default now()
)
returns json as $$
declare
  stats json;
begin
  select json_build_object(
    'total_revenue', coalesce(sum(amount) filter (where status = 'succeeded'), 0),
    'total_transactions', count(*) filter (where status = 'succeeded'),
    'failed_transactions', count(*) filter (where status = 'failed'),
    'refunded_amount', coalesce(sum(refunded_amount), 0),
    'average_transaction', coalesce(avg(amount) filter (where status = 'succeeded'), 0)
  )
  into stats
  from public.transactions
  where created_at >= start_date and created_at <= end_date;
  
  return stats;
end;
$$ language plpgsql security definer;

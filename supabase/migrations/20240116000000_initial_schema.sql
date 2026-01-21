-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('user', 'admin');
create type match_status as enum ('pending', 'accepted', 'rejected');
create type body_type as enum ('Slim', 'Athletic', 'Average', 'Curvy', 'Muscular', 'Plus-size');
create type education_level as enum ('High School', 'Bachelor''s Degree', 'Master''s Degree', 'PhD', 'Other');
create type smoking_status as enum ('Non-smoker', 'Social smoker', 'Regular smoker');
create type drinking_status as enum ('Non-drinker', 'Social drinker', 'Regular drinker');

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  role user_role default 'user' not null,
  
  -- Basic info
  name text not null,
  age integer not null check (age >= 18 and age <= 100),
  gender text not null,
  bio text,
  location text not null,
  
  -- Extended profile fields
  height integer, -- in cm
  body_type body_type,
  education education_level,
  work text,
  children text,
  smoking smoking_status,
  drinking drinking_status,
  
  -- Preferences
  looking_for text,
  languages text[] default array[]::text[],
  interests text[] default array[]::text[],
  
  -- Media
  profile_image text,
  photos text[] default array[]::text[],
  
  -- Status
  online boolean default false,
  last_seen timestamp with time zone default now(),
  
  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Matches table (for mutual likes/connections)
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  user_a uuid references public.profiles(id) on delete cascade not null,
  user_b uuid references public.profiles(id) on delete cascade not null,
  status match_status default 'pending' not null,
  
  -- Track who initiated
  initiated_by uuid references public.profiles(id) on delete cascade not null,
  
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Ensure no duplicate matches
  constraint unique_match unique (user_a, user_b),
  constraint no_self_match check (user_a != user_b),
  constraint ordered_match check (user_a < user_b)
);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Message content
  content text not null,
  
  -- Status
  read boolean default false,
  read_at timestamp with time zone,
  
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_profiles_location on public.profiles(location);
create index idx_profiles_online on public.profiles(online);
create index idx_profiles_age on public.profiles(age);
create index idx_matches_user_a on public.matches(user_a);
create index idx_matches_user_b on public.matches(user_b);
create index idx_matches_status on public.matches(status);
create index idx_messages_match_id on public.messages(match_id);
create index idx_messages_sender on public.messages(sender_id);
create index idx_messages_receiver on public.messages(receiver_id);
create index idx_messages_created_at on public.messages(created_at desc);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for matches
create policy "Users can view their own matches"
  on public.matches for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users can create matches"
  on public.matches for insert
  with check (auth.uid() = initiated_by);

create policy "Users can update matches they're part of"
  on public.matches for update
  using (auth.uid() = user_a or auth.uid() = user_b);

-- RLS Policies for messages
create policy "Users can view messages in their matches"
  on public.messages for select
  using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );

create policy "Users can send messages in their matches"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.matches
      where id = match_id
      and (user_a = auth.uid() or user_b = auth.uid())
      and status = 'accepted'
    )
  );

create policy "Users can update their own received messages (mark as read)"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.matches
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.messages
  for each row
  execute function public.handle_updated_at();

-- Function to create a match (handles ordering of user_a and user_b)
create or replace function public.create_match(
  target_user_id uuid,
  initiator_user_id uuid
)
returns uuid as $$
declare
  new_match_id uuid;
  ordered_user_a uuid;
  ordered_user_b uuid;
begin
  -- Ensure user_a < user_b for consistent ordering
  if initiator_user_id < target_user_id then
    ordered_user_a := initiator_user_id;
    ordered_user_b := target_user_id;
  else
    ordered_user_a := target_user_id;
    ordered_user_b := initiator_user_id;
  end if;
  
  -- Insert or update match
  insert into public.matches (user_a, user_b, initiated_by, status)
  values (ordered_user_a, ordered_user_b, initiator_user_id, 'pending')
  on conflict (user_a, user_b) do update
  set status = 'accepted', updated_at = now()
  returning id into new_match_id;
  
  return new_match_id;
end;
$$ language plpgsql security definer;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'user',
  current_job_title text,
  target_job_title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- NOTIFICATIONS
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  title text not null,
  message text not null,
  type text check (type in ('success', 'info', 'warning', 'error')) default 'info',
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table notifications enable row level security;

create policy "Users can view own notifications." on notifications
  for select using (auth.uid() = user_id);

-- SUBSCRIPTIONS (Synced with Stripe via Webhooks in a real app)
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text check (status in ('active', 'canceled', 'past_due', 'trialing')),
  plan_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table subscriptions enable row level security;

create policy "Users can view own subscription." on subscriptions
  for select using (auth.uid() = user_id);

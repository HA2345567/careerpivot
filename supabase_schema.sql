-- Create roadmaps table
create table if not exists roadmaps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  goal text not null,
  constraints text,
  timeline text,
  hours_per_week int,
  summary text,
  phases jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table roadmaps enable row level security;

-- Create policies
create policy "Users can view their own roadmap" 
  on roadmaps for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own roadmap" 
  on roadmaps for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own roadmap" 
  on roadmaps for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own roadmap" 
  on roadmaps for delete 
  using (auth.uid() = user_id);

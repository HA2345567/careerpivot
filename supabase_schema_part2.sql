-- Salary Scenarios Table
create table if not exists salary_scenarios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  current_salary numeric not null,
  monthly_expenses numeric not null,
  transition_months numeric not null,
  target_salary numeric not null,
  financial_plan jsonb, -- Stores the AI generated plan
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table salary_scenarios enable row level security;

create policy "Users can manage their own salary scenarios" 
  on salary_scenarios for all 
  using (auth.uid() = user_id);

-- Skills Audits Table
create table if not exists skills_audits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  input_text text, -- The bio/resume text they pasted
  analysis_result jsonb, -- Stores { skills: [], roles: [] }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table skills_audits enable row level security;

create policy "Users can manage their own skills audits" 
  on skills_audits for all 
  using (auth.uid() = user_id);

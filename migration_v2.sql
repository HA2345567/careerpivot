-- Run this script in the Supabase SQL Editor to update your existing database safely.

-- 1. Add new columns to profiles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'current_salary') THEN
        ALTER TABLE profiles ADD COLUMN current_salary integer default 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'monthly_expenses') THEN
        ALTER TABLE profiles ADD COLUMN monthly_expenses integer default 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'burnout_level') THEN
        ALTER TABLE profiles ADD COLUMN burnout_level integer default 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'start_date') THEN
        ALTER TABLE profiles ADD COLUMN start_date timestamp with time zone;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'plan') THEN
        ALTER TABLE profiles ADD COLUMN plan text default 'free';
    END IF;
END $$;

-- 2. Update or Create the function (REPLACE works even if it exists)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

-- 3. Safely create trigger (Drop first to ensure clean state or check existence)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add phone, weight, and interested_in_genders fields to profiles table

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS weight integer,
  ADD COLUMN IF NOT EXISTS interested_in_genders text[] DEFAULT array[]::text[];

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.phone IS 'User phone number (optional)';
COMMENT ON COLUMN public.profiles.weight IS 'User weight in kg (optional)';
COMMENT ON COLUMN public.profiles.interested_in_genders IS 'Genders user is interested in (array: Male, Female, Other)';

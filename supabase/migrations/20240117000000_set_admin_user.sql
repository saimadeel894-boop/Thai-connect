-- Update john@kggroup.io to admin role
-- Run this in Supabase SQL Editor after creating the user account

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'john@kggroup.io';

-- Verify the update
SELECT id, email, name, role
FROM public.profiles
WHERE email = 'john@kggroup.io';

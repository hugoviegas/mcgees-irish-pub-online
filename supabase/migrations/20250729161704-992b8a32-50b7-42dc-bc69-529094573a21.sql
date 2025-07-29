
-- Fix database functions security by adding SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_events_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Create admin user with proper email and secure password
-- This will be handled through the auth system, so we just ensure the user exists
-- The actual user creation will be done through Supabase Auth signup process

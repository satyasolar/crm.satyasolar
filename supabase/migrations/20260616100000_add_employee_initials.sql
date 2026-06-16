-- Migration: Add employee_initials column to profiles
-- employee_initials: A short 2-4 letter identifier for the employee (e.g. "RS" for Rahul Sharma)
-- Auto-populated on creation from name, but can be edited by admin

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS employee_initials TEXT;

-- Auto-generate initials for existing employees who don't have one yet
-- Takes first letter of each word in name, up to 3 characters
UPDATE public.profiles
SET employee_initials = UPPER(
  SUBSTRING(
    REGEXP_REPLACE(
      ARRAY_TO_STRING(
        ARRAY(
          SELECT SUBSTRING(word FROM 1 FOR 1)
          FROM UNNEST(STRING_TO_ARRAY(TRIM(name), ' ')) AS word
          WHERE LENGTH(TRIM(word)) > 0
          LIMIT 3
        ), ''
      ),
      '[^A-Za-z]', '', 'g'
    ),
    1, 3
  )
)
WHERE employee_initials IS NULL AND name IS NOT NULL AND name != '';

-- Add a unique partial index to help find employees by initials
CREATE INDEX IF NOT EXISTS idx_profiles_employee_initials
  ON public.profiles (employee_initials)
  WHERE employee_initials IS NOT NULL;

COMMENT ON COLUMN public.profiles.employee_initials IS 'Short 2-3 letter initials for the employee, auto-generated from name. Used as a quick identifier in case history and updates.';

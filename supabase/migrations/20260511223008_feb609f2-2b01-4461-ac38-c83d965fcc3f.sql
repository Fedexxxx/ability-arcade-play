CREATE OR REPLACE FUNCTION public.get_explorer(p_id uuid)
RETURNS TABLE (
  name text,
  avatar_emoji text,
  age_band text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.name, e.avatar_emoji, e.age_band, e.created_at
  FROM public.explorers e
  WHERE e.id = p_id;
$$;
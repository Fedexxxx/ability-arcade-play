CREATE OR REPLACE FUNCTION public.create_explorer(p_name text, p_avatar text, p_age_band text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  new_id uuid;
begin
  insert into public.explorers(name, avatar_emoji, age_band)
  values (p_name, p_avatar, p_age_band)
  returning id into new_id;
  return new_id;
end;
$$;

GRANT EXECUTE ON FUNCTION public.create_explorer(text, text, text) TO anon, authenticated;
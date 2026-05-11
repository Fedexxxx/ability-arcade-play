CREATE OR REPLACE FUNCTION public.create_explorer_companions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  insert into public.explorer_progress (explorer_id) values (new.id);
  insert into public.wallet (explorer_id) values (new.id);
  return new;
end;
$$;
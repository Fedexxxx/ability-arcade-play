create or replace function public.set_config(setting_name text, new_value text, is_local boolean)
returns text
language sql
volatile
set search_path = public
as $$
  select set_config(setting_name, new_value, is_local);
$$;

revoke all on function public.set_config(text, text, boolean) from public;
grant execute on function public.set_config(text, text, boolean) to anon, authenticated;
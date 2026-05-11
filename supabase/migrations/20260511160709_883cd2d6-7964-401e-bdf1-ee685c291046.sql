alter table public.module_tiers
  add constraint module_tiers_explorer_mountain_module_key
  unique (explorer_id, mountain_id, module_id);
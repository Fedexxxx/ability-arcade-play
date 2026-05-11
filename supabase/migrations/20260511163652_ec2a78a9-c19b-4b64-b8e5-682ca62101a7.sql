GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.explorers,
  public.explorer_progress,
  public.wallet,
  public.ledger_entries,
  public.owned_items,
  public.module_tiers,
  public.module_completions,
  public.mountain_progress
TO anon, authenticated;

GRANT SELECT ON public.challenges TO anon, authenticated;
GRANT SELECT ON public.explorer_state TO anon, authenticated;
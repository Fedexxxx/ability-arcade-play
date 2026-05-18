DELETE FROM public.module_tiers WHERE pinned = false OR (recent_results = '{}'::boolean[] AND tier <> 'inicial');
-- Reset stale pinned rows for legacy test data so adaptive engine starts from age-band default
DELETE FROM public.module_tiers;
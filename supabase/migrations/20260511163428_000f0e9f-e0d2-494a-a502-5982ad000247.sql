-- Allow anonymous onboarding inserts on explorers (chicken-and-egg with RLS).
-- Keep select/update/delete restricted to current_explorer_id().
DROP POLICY IF EXISTS "explorer: own row" ON public.explorers;

CREATE POLICY "explorer: insert open"
  ON public.explorers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "explorer: select own"
  ON public.explorers FOR SELECT
  USING (id = public.current_explorer_id());

CREATE POLICY "explorer: update own"
  ON public.explorers FOR UPDATE
  USING (id = public.current_explorer_id())
  WITH CHECK (id = public.current_explorer_id());

CREATE POLICY "explorer: delete own"
  ON public.explorers FOR DELETE
  USING (id = public.current_explorer_id());
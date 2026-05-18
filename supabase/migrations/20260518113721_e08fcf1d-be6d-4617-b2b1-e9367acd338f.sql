
CREATE TABLE IF NOT EXISTS public.challenge_completions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  explorer_id uuid NOT NULL,
  mountain_id text NOT NULL,
  module_id text NOT NULL,
  challenge_id text NOT NULL,
  tier text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (explorer_id, mountain_id, module_id, challenge_id)
);

ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenge_completions: own data"
ON public.challenge_completions
FOR ALL
USING (explorer_id = current_explorer_id())
WITH CHECK (explorer_id = current_explorer_id());

CREATE INDEX IF NOT EXISTS idx_challenge_completions_explorer_module
  ON public.challenge_completions (explorer_id, mountain_id, module_id);

CREATE OR REPLACE FUNCTION public.add_explorer_xp(p_explorer_id uuid, p_amount int)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  new_total int;
begin
  INSERT INTO public.explorer_progress (explorer_id, xp_total)
  VALUES (p_explorer_id, GREATEST(p_amount, 0))
  ON CONFLICT (explorer_id) DO UPDATE
    SET xp_total = public.explorer_progress.xp_total + EXCLUDED.xp_total,
        updated_at = now()
  RETURNING xp_total INTO new_total;
  RETURN new_total;
end;
$$;

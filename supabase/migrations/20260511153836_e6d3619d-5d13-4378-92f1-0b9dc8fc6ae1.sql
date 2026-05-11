create extension if not exists "pgcrypto";

create table explorers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  avatar_emoji  text not null default '🧗',
  age_band      text not null check (age_band in ('4-6', '7-8', '9-10')),
  created_at    timestamptz not null default now()
);
comment on table explorers is 'Core explorer profile created during onboarding.';

create table explorer_progress (
  id            uuid primary key default gen_random_uuid(),
  explorer_id   uuid not null references explorers(id) on delete cascade,
  xp_total      int not null default 0 check (xp_total >= 0),
  level         int not null default 1 check (level >= 1),
  updated_at    timestamptz not null default now(),
  unique (explorer_id)
);
comment on table explorer_progress is 'XP and level per explorer. One row per explorer.';

create table wallet (
  id            uuid primary key default gen_random_uuid(),
  explorer_id   uuid not null references explorers(id) on delete cascade,
  balance       int not null default 0 check (balance >= 0),
  updated_at    timestamptz not null default now(),
  unique (explorer_id)
);
comment on table wallet is 'Alticoin balance per explorer.';

create table ledger_entries (
  id            uuid primary key default gen_random_uuid(),
  explorer_id   uuid not null references explorers(id) on delete cascade,
  dedup_key     text not null,
  amount        int not null,
  reason        text not null check (reason in (
                  'challenge', 'module', 'superpower',
                  'streak', 'achievement', 'purchase'
                )),
  label         text not null,
  created_at    timestamptz not null default now(),
  unique (explorer_id, dedup_key)
);
comment on table ledger_entries is 'Append-only Alticoin transaction log. dedup_key prevents double-credit.';

create table owned_items (
  id            uuid primary key default gen_random_uuid(),
  explorer_id   uuid not null references explorers(id) on delete cascade,
  item_id       text not null,
  slot          text not null check (slot in (
                  'skin', 'hat', 'scarf', 'backpack', 'boots', 'badge'
                )),
  equipped      boolean not null default false,
  acquired_at   timestamptz not null default now(),
  unique (explorer_id, item_id)
);
comment on table owned_items is 'Cosmetic items owned by each explorer. equipped=true means active for that slot.';

create unique index owned_items_one_equipped_per_slot
  on owned_items (explorer_id, slot)
  where equipped = true;

create table module_tiers (
  id              uuid primary key default gen_random_uuid(),
  explorer_id     uuid not null references explorers(id) on delete cascade,
  mountain_id     text not null,
  module_id       text not null,
  tier            text not null default 'inicial' check (tier in ('inicial', 'avanzado', 'experto')),
  pinned          boolean not null default false,
  recent_results  boolean[] not null default '{}',
  updated_at      timestamptz not null default now(),
  unique (explorer_id, mountain_id, module_id)
);
comment on table module_tiers is 'Adaptive tier state per module. recent_results drives auto promote/demote.';

create table mountain_progress (
  id              uuid primary key default gen_random_uuid(),
  explorer_id     uuid not null references explorers(id) on delete cascade,
  mountain_id     text not null,
  pct_complete    int not null default 0 check (pct_complete between 0 and 100),
  status          text not null default 'locked' check (status in ('locked', 'active', 'complete')),
  updated_at      timestamptz not null default now(),
  unique (explorer_id, mountain_id)
);
comment on table mountain_progress is 'Per-mountain unlock and completion state for the Ruta map.';

create table module_completions (
  id              uuid primary key default gen_random_uuid(),
  explorer_id     uuid not null references explorers(id) on delete cascade,
  mountain_id     text not null,
  module_id       text not null,
  score           int not null check (score between 0 and 100),
  tier            text not null check (tier in ('inicial', 'avanzado', 'experto')),
  completed_at    timestamptz not null default now()
);
comment on table module_completions is 'Log of module completions with score and tier. Multiple attempts allowed.';

create table challenges (
  id              uuid primary key default gen_random_uuid(),
  mountain_id     text not null,
  module_id       text not null,
  age_band        text not null check (age_band in ('4-6', '7-8', '9-10')),
  tier            text not null check (tier in ('inicial', 'avanzado', 'experto')),
  type            text not null check (type in ('quiz', 'visual', 'matching', 'drag-drop')),
  concept         text,
  payload         jsonb not null,
  sort_order      int not null default 0,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);
comment on table challenges is
  'AI-generated challenge content catalog. payload shapes:
   quiz:      { question, options: string[4], correctAnswer: 0-3 }
   visual:    { question, visualOptions: {label, imageUrl}[4], correctAnswer: 0-3 }
   matching:  { pairs: {left, right}[] }
   drag-drop: { instruction, items: string[], correctOrder: number[] }';

create index challenges_lookup
  on challenges (mountain_id, module_id, age_band, tier, active);

alter table explorers           enable row level security;
alter table explorer_progress   enable row level security;
alter table wallet              enable row level security;
alter table ledger_entries      enable row level security;
alter table owned_items         enable row level security;
alter table module_tiers        enable row level security;
alter table mountain_progress   enable row level security;
alter table module_completions  enable row level security;
alter table challenges          enable row level security;

create or replace function public.current_explorer_id() returns uuid
  language sql stable
  set search_path = public
  as $$
    select nullif(current_setting('app.explorer_id', true), '')::uuid
  $$;

create policy "explorer: own row" on explorers
  using (id = public.current_explorer_id())
  with check (id = public.current_explorer_id());

create policy "progress: own row" on explorer_progress
  using (explorer_id = public.current_explorer_id())
  with check (explorer_id = public.current_explorer_id());

create policy "wallet: own row" on wallet
  using (explorer_id = public.current_explorer_id())
  with check (explorer_id = public.current_explorer_id());

create policy "ledger: own entries" on ledger_entries
  using (explorer_id = public.current_explorer_id())
  with check (explorer_id = public.current_explorer_id());

create policy "items: own items" on owned_items
  using (explorer_id = public.current_explorer_id())
  with check (explorer_id = public.current_explorer_id());

create policy "tiers: own data" on module_tiers
  using (explorer_id = public.current_explorer_id())
  with check (explorer_id = public.current_explorer_id());

create policy "mountain: own data" on mountain_progress
  using (explorer_id = public.current_explorer_id())
  with check (explorer_id = public.current_explorer_id());

create policy "completions: own data" on module_completions
  using (explorer_id = public.current_explorer_id())
  with check (explorer_id = public.current_explorer_id());

create policy "challenges: public read" on challenges
  for select using (active = true);

create or replace function public.create_explorer_companions()
  returns trigger language plpgsql
  set search_path = public
  as $$
begin
  insert into public.explorer_progress (explorer_id) values (new.id);
  insert into public.wallet (explorer_id) values (new.id);
  return new;
end;
$$;

create trigger on_explorer_created
  after insert on explorers
  for each row execute function public.create_explorer_companions();

create view explorer_state as
  select
    e.id,
    e.name,
    e.avatar_emoji,
    e.age_band,
    e.created_at,
    p.xp_total,
    p.level,
    w.balance as alticoins
  from explorers e
  join explorer_progress p on p.explorer_id = e.id
  join wallet w on w.explorer_id = e.id;

comment on view explorer_state is 'Convenience view: full explorer state in one query for app bootstrap.';
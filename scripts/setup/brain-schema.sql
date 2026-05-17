-- Brain v2 Memory Schema (9 tables + RLS + indexes)
-- Applied via Supabase migration on 2026-05-17.
-- Reapply with:
--   supabase db push   OR
--   psql $SUPABASE_DB_URL -f brain-schema.sql

create table if not exists public.brain_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending','validated','rejected','in_progress','done','archived')),
  validation_score int check (validation_score between 0 and 10),
  recommendation text,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brain_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  idea_id uuid references public.brain_ideas(id) on delete set null,
  status text not null default 'active' check (status in ('active','paused','done','abandoned')),
  description text,
  tech_stack jsonb,
  repo_url text,
  deploy_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brain_agent_log (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.brain_projects(id) on delete set null,
  agent_name text not null,
  task_description text,
  status text not null default 'running' check (status in ('running','success','failed','timeout')),
  output text,
  tokens_used int,
  duration_seconds int,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.brain_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.brain_projects(id) on delete set null,
  decision text not null,
  reasoning text,
  alternatives_considered jsonb,
  outcome text,
  lessons_learned text,
  created_at timestamptz not null default now()
);

create table if not exists public.brain_lessons (
  id uuid primary key default gen_random_uuid(),
  category text,
  lesson text not null,
  context text,
  source_project_id uuid references public.brain_projects(id) on delete set null,
  importance int not null default 5 check (importance between 1 and 10),
  created_at timestamptz not null default now()
);

create table if not exists public.brain_knowledge (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content text not null,
  sources jsonb,
  tags text[] default array[]::text[],
  created_at timestamptz not null default now()
);

create table if not exists public.brain_skills_log (
  id uuid primary key default gen_random_uuid(),
  skill_name text not null,
  project_id uuid references public.brain_projects(id) on delete set null,
  used_at timestamptz not null default now()
);

create table if not exists public.brain_metrics (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  active_projects int,
  ideas_in_queue int,
  agents_run_today int,
  tokens_used int,
  decisions_made int,
  data jsonb
);

create table if not exists public.brain_connections (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null,
  source_type text not null,
  target_id uuid not null,
  target_type text not null,
  relationship text,
  strength int not null default 5 check (strength between 1 and 10),
  created_at timestamptz not null default now()
);

-- Touch trigger for ideas + projects
create or replace function public.brain_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists brain_ideas_touch on public.brain_ideas;
create trigger brain_ideas_touch before update on public.brain_ideas
  for each row execute function public.brain_touch_updated_at();

drop trigger if exists brain_projects_touch on public.brain_projects;
create trigger brain_projects_touch before update on public.brain_projects
  for each row execute function public.brain_touch_updated_at();

-- Indexes
create index if not exists idx_brain_ideas_status        on public.brain_ideas(status);
create index if not exists idx_brain_projects_status     on public.brain_projects(status);
create index if not exists idx_brain_agent_log_proj      on public.brain_agent_log(project_id);
create index if not exists idx_brain_agent_log_agent     on public.brain_agent_log(agent_name);
create index if not exists idx_brain_decisions_proj      on public.brain_decisions(project_id);
create index if not exists idx_brain_lessons_cat         on public.brain_lessons(category);
create index if not exists idx_brain_lessons_importance  on public.brain_lessons(importance desc);
create index if not exists idx_brain_knowledge_tags      on public.brain_knowledge using gin(tags);
create index if not exists idx_brain_connections_src     on public.brain_connections(source_id, source_type);
create index if not exists idx_brain_connections_tgt     on public.brain_connections(target_id, target_type);

-- RLS — server-only access via service role
alter table public.brain_ideas       enable row level security;
alter table public.brain_projects    enable row level security;
alter table public.brain_agent_log   enable row level security;
alter table public.brain_decisions   enable row level security;
alter table public.brain_lessons     enable row level security;
alter table public.brain_knowledge   enable row level security;
alter table public.brain_skills_log  enable row level security;
alter table public.brain_metrics     enable row level security;
alter table public.brain_connections enable row level security;

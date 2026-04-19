---
topic:
  - backend
  - sql
  - schema
  - supabase
status: draft
type: specification
created: "2026-04-18"
project: Bloque Cero
module: sql-schema-draft
---
# Bloque Cero - SQL Schema Draft

## Purpose
Convert the Bloque Cero entity model into a concrete first-pass SQL schema draft suitable for Supabase-backed implementation. This draft focuses on the MVP operational core needed to support **Blueprint de Negocio**, embedded **Radar**, CRM progression, WhatsApp-linked follow-up, and automation traceability.

## Design goals
- implement the minimum viable canonical data model first
- preserve event history instead of relying on destructive overwrites
- keep stage, task, and automation behavior enforceable at the backend layer
- make later RLS and workflow enforcement straightforward rather than heroic

## MVP schema scope
The initial schema draft includes:
- `leads`
- `diagnostic_submissions`
- `diagnostic_answers`
- `diagnostic_signals`
- `radar_analyses`
- `crm_stage_events`
- `crm_tasks`
- `crm_interactions`
- `whatsapp_conversations`
- `whatsapp_messages`
- `routing_events`
- `automation_runs`

## Deferred tables
These remain intentionally deferred for a later pass:
- `lead_contacts`
- `radar_recommendations`
- `crm_status_flags`
- `crm_assignments`
- `whatsapp_state_history`
- `whatsapp_handoffs`
- `automation_subscriptions`
- `audit_events`

## Suggested schema conventions
- use `gen_random_uuid()` for primary keys
- use `timestamptz` for all time fields
- use snake_case consistently
- prefer explicit `check` constraints for enums in the first pass
- keep JSON payloads in `jsonb`
- index all foreign keys and frequently filtered lifecycle fields

## Enum/check domains
### CRM stages
- `new_intake`
- `diagnosed`
- `radar_analyzed`
- `qualified_review`
- `active_followup`
- `proposal_path`
- `implementation_ready`
- `nurture`
- `closed_won`
- `closed_lost`
- `rejected`

### Priority levels
- `low`
- `normal`
- `high`
- `urgent`

### Task status
- `open`
- `in_progress`
- `completed`
- `canceled`

### Conversation state examples
- `idle`
- `awaiting_reply`
- `clarification_requested`
- `handoff_requested`
- `human_active`
- `closed`

## SQL draft
```sql
create extension if not exists pgcrypto;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  company_name text,
  role_title text,
  email text,
  phone text,
  preferred_contact_channel text,
  country text,
  source text,
  business_stage text,
  traction_band text,
  urgency_level text,
  implementation_readiness text,
  fit_score_band text,
  current_stage text not null default 'new_intake' check (current_stage in (
    'new_intake','diagnosed','radar_analyzed','qualified_review','active_followup',
    'proposal_path','implementation_ready','nurture','closed_won','closed_lost','rejected'
  )),
  priority_level text not null default 'normal' check (priority_level in ('low','normal','high','urgent')),
  owner_queue text,
  recommended_intervention text,
  ready_for_implementation boolean not null default false,
  next_action_type text,
  next_action_due_at timestamptz,
  last_contact_at timestamptz,
  last_stage_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists leads_email_unique_idx
  on public.leads (lower(email))
  where email is not null;

create index if not exists leads_current_stage_idx on public.leads (current_stage);
create index if not exists leads_priority_level_idx on public.leads (priority_level);
create index if not exists leads_owner_queue_idx on public.leads (owner_queue);
create index if not exists leads_next_action_due_at_idx on public.leads (next_action_due_at);

create table public.diagnostic_submissions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  submission_status text not null,
  source_channel text,
  started_at timestamptz,
  submitted_at timestamptz,
  completion_percent numeric(5,2) default 0 check (completion_percent >= 0 and completion_percent <= 100),
  freeform_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists diagnostic_submissions_lead_id_idx on public.diagnostic_submissions (lead_id);
create index if not exists diagnostic_submissions_status_idx on public.diagnostic_submissions (submission_status);
create index if not exists diagnostic_submissions_submitted_at_idx on public.diagnostic_submissions (submitted_at);

create table public.diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  diagnostic_submission_id uuid not null references public.diagnostic_submissions(id) on delete cascade,
  question_key text not null,
  question_label text,
  answer_type text not null,
  raw_answer_text text,
  raw_answer_json jsonb,
  step_key text,
  created_at timestamptz not null default now()
);

create index if not exists diagnostic_answers_submission_idx on public.diagnostic_answers (diagnostic_submission_id);
create index if not exists diagnostic_answers_question_key_idx on public.diagnostic_answers (question_key);

create table public.diagnostic_signals (
  id uuid primary key default gen_random_uuid(),
  diagnostic_submission_id uuid not null references public.diagnostic_submissions(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  signal_type text not null,
  signal_key text not null,
  signal_value_text text,
  signal_value_json jsonb,
  confidence_level text,
  created_at timestamptz not null default now()
);

create index if not exists diagnostic_signals_submission_idx on public.diagnostic_signals (diagnostic_submission_id);
create index if not exists diagnostic_signals_lead_idx on public.diagnostic_signals (lead_id);
create index if not exists diagnostic_signals_signal_key_idx on public.diagnostic_signals (signal_key);

create table public.radar_analyses (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  diagnostic_submission_id uuid references public.diagnostic_submissions(id) on delete set null,
  analysis_version text not null,
  analysis_summary text,
  maturity_assessment text,
  dominant_blocker_category text,
  execution_risk_level text,
  confidence_level text,
  recommended_intervention text,
  priority_level text check (priority_level in ('low','normal','high','urgent')),
  crm_stage_recommendation text check (crm_stage_recommendation in (
    'new_intake','diagnosed','radar_analyzed','qualified_review','active_followup',
    'proposal_path','implementation_ready','nurture','closed_won','closed_lost','rejected'
  )),
  needs_escalation boolean not null default false,
  requires_manual_review boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists radar_analyses_lead_idx on public.radar_analyses (lead_id);
create index if not exists radar_analyses_submission_idx on public.radar_analyses (diagnostic_submission_id);
create index if not exists radar_analyses_priority_idx on public.radar_analyses (priority_level);

create table public.crm_stage_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  from_stage text,
  to_stage text not null check (to_stage in (
    'new_intake','diagnosed','radar_analyzed','qualified_review','active_followup',
    'proposal_path','implementation_ready','nurture','closed_won','closed_lost','rejected'
  )),
  change_reason text not null,
  changed_by_type text not null,
  changed_by_id text,
  source_module text,
  created_at timestamptz not null default now()
);

create index if not exists crm_stage_events_lead_idx on public.crm_stage_events (lead_id);
create index if not exists crm_stage_events_to_stage_idx on public.crm_stage_events (to_stage);
create index if not exists crm_stage_events_created_at_idx on public.crm_stage_events (created_at desc);

create table public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  task_type text not null,
  title text not null,
  notes text,
  status text not null default 'open' check (status in ('open','in_progress','completed','canceled')),
  priority_level text not null default 'normal' check (priority_level in ('low','normal','high','urgent')),
  owner_id text,
  due_at timestamptz,
  completed_at timestamptz,
  source_module text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (completed_at is null or completed_at >= created_at)
);

create index if not exists crm_tasks_lead_idx on public.crm_tasks (lead_id);
create index if not exists crm_tasks_status_idx on public.crm_tasks (status);
create index if not exists crm_tasks_owner_idx on public.crm_tasks (owner_id);
create index if not exists crm_tasks_due_at_idx on public.crm_tasks (due_at);

create table public.crm_interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  channel text not null,
  interaction_type text not null,
  summary text,
  raw_reference_type text,
  raw_reference_id text,
  performed_by_type text,
  performed_by_id text,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists crm_interactions_lead_idx on public.crm_interactions (lead_id);
create index if not exists crm_interactions_occurred_at_idx on public.crm_interactions (occurred_at desc);

create table public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  conversation_status text not null,
  conversation_state text not null check (conversation_state in (
    'idle','awaiting_reply','clarification_requested','handoff_requested','human_active','closed'
  )),
  last_message_at timestamptz,
  handoff_active boolean not null default false,
  current_owner_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists whatsapp_conversations_lead_idx on public.whatsapp_conversations (lead_id);
create index if not exists whatsapp_conversations_state_idx on public.whatsapp_conversations (conversation_state);
create index if not exists whatsapp_conversations_handoff_idx on public.whatsapp_conversations (handoff_active);

create table public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  direction text not null check (direction in ('inbound','outbound')),
  message_type text not null,
  message_text text,
  message_payload_json jsonb,
  provider_message_id text,
  delivery_status text,
  sent_at timestamptz,
  received_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists whatsapp_messages_provider_unique_idx
  on public.whatsapp_messages (provider_message_id)
  where provider_message_id is not null;

create index if not exists whatsapp_messages_conversation_idx on public.whatsapp_messages (conversation_id);
create index if not exists whatsapp_messages_lead_idx on public.whatsapp_messages (lead_id);
create index if not exists whatsapp_messages_direction_idx on public.whatsapp_messages (direction);

create table public.routing_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  source_module text not null,
  event_type text not null,
  from_state text,
  to_state text,
  routing_reason text,
  target_queue text,
  payload_json jsonb,
  created_at timestamptz not null default now()
);

create index if not exists routing_events_lead_idx on public.routing_events (lead_id);
create index if not exists routing_events_event_type_idx on public.routing_events (event_type);
create index if not exists routing_events_created_at_idx on public.routing_events (created_at desc);

create table public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  workflow_key text not null,
  trigger_source text not null,
  status text not null,
  input_payload_json jsonb,
  output_payload_json jsonb,
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists automation_runs_lead_idx on public.automation_runs (lead_id);
create index if not exists automation_runs_workflow_key_idx on public.automation_runs (workflow_key);
create index if not exists automation_runs_status_idx on public.automation_runs (status);
create index if not exists automation_runs_created_at_idx on public.automation_runs (created_at desc);
```

## Backend enforcement notes
- `crm_stage_events` should be written through a controlled backend path, not directly from arbitrary clients
- `leads.current_stage` should be updated only alongside creation of a corresponding `crm_stage_events` record
- `active_followup` transitions should require owner, next action, and due date at the application/backend rule layer
- terminal-stage reopen behavior should be restricted and audited
- outbound messaging should dedupe on `provider_message_id` or workflow-specific keys

## RLS-first recommendations
- enable RLS on all MVP tables before any external/operator usage
- default-deny all public access for operational tables
- separate operator-facing read access from service-role write paths
- require backend-controlled writes for stage events, routing events, and automation runs
- treat `diagnostic_answers`, `radar_analyses`, and `whatsapp_messages` as sensitive by default

## Immediate next implementation tasks
1. Derive table-by-table RLS policy definitions from this SQL draft
2. Define backend transition functions or service-layer handlers for CRM stage changes
3. Add updated-at triggers where mutable records need automatic timestamp refresh
4. Define migration order for tables, indexes, constraints, and policies
5. Reconcile this draft with real repo conventions once the codebase is available

## Dependencies
- [[Projects/Bloque Cero]]
- [[Projects/Bloque Cero - Supabase Entity Map]]
- [[Projects/Bloque Cero - CRM Stage Transition Map]]
- [[Projects/Bloque Cero - Security Remediation Checklist]]

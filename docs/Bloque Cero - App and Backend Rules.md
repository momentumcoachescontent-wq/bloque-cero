---
topic:
  - backend
  - rules
  - crm
  - automation
status: draft
type: specification
created: "2026-04-18"
project: Bloque Cero
module: app-backend-rules
---
# Bloque Cero - App and Backend Rules

## Purpose
Define the backend-enforced rules that translate Bloque Cero CRM, Radar, and automation behavior into executable logic. This document exists to prevent critical lifecycle behavior from being enforced only in UI or operator habit.

## Rule design principles
- backend is the source of truth for lifecycle enforcement
- UI may guide, but must not be trusted for critical state transitions
- high-impact actions must leave auditable records
- automation must be schema-validated and replay-safe
- manual overrides are allowed only when reason capture and traceability exist

## Actor classes
- `operator`
- `automation_service`
- `system_admin`
- `read_only_internal`

## Canonical enforcement areas
1. CRM stage transitions
2. ownership and assignment
3. task lifecycle
4. Radar-to-CRM synchronization
5. automation event intake
6. messaging safety rules
7. terminal-stage and override controls

## CRM transition rules
### Global transition rules
- every stage change must create a `crm_stage_events` record
- `leads.current_stage` cannot change without a corresponding stage event
- invalid `from_stage` → `to_stage` transitions must be rejected server-side
- all stage changes require `change_reason`
- terminal stage reopening requires explicit override handling

### Allowed transitions
| From | To |
|---|---|
| `new_intake` | `diagnosed`, `nurture`, `rejected` |
| `diagnosed` | `radar_analyzed`, `qualified_review`, `nurture`, `rejected` |
| `radar_analyzed` | `qualified_review`, `active_followup`, `nurture`, `rejected` |
| `qualified_review` | `active_followup`, `proposal_path`, `nurture`, `closed_lost`, `rejected` |
| `active_followup` | `proposal_path`, `implementation_ready`, `nurture`, `closed_lost`, `rejected` |
| `proposal_path` | `implementation_ready`, `active_followup`, `nurture`, `closed_lost` |
| `implementation_ready` | `closed_won`, `active_followup`, `closed_lost` |
| `nurture` | `active_followup`, `qualified_review`, `closed_lost`, `rejected` |
| `closed_won` | `active_followup` only by explicit override |
| `closed_lost` | `active_followup`, `nurture` only by explicit override |
| `rejected` | `qualified_review` only by exception override |

### Destination-specific requirements
| Destination stage | Required fields / conditions |
|---|---|
| `diagnosed` | usable diagnostic submission exists |
| `radar_analyzed` | Radar analysis exists for the lead |
| `qualified_review` | operator review or explicit bypass rationale exists |
| `active_followup` | owner or queue assigned; next action exists; due date exists |
| `proposal_path` | recommended intervention or block candidate exists |
| `implementation_ready` | readiness confirmed; operator confirmation present |
| `nurture` | nurture reason exists; later revisit rule or reminder exists |
| `closed_won` | implementation handoff evidence or equivalent context exists |
| `closed_lost` | close reason exists |
| `rejected` | rejection reason exists |

## Override rules
- reopening `closed_won`, `closed_lost`, or `rejected` requires `override_reason`
- override actions must create audit trail metadata identifying actor, timestamp, and prior state
- automation cannot reopen terminal states without explicit operator-approved path
- override frequency should be reviewable to detect misuse or process weakness

## Ownership and assignment rules
- `active_followup`, `proposal_path`, and `implementation_ready` require current ownership context
- assignment changes should create a dedicated assignment history record once `crm_assignments` is implemented
- until that table exists, assignment changes must at minimum create a `routing_events` or stage event trace
- urgent/high-priority leads may trigger queue escalation, but not silent owner replacement without record

## Task lifecycle rules
- every lead in `active_followup` must have at least one open task
- overdue task escalation must be time-windowed to avoid spam
- task completion may trigger evaluation of next-action gaps
- terminal stages should close or cancel unnecessary open follow-up tasks
- tasks created by automation must include source metadata

## Radar-to-CRM synchronization rules
- Radar output may update summary qualification fields on `leads`
- Radar output may recommend stage or intervention, but should not silently force sensitive stage changes when manual review is required
- if `requires_manual_review = true`, automation may create tasks/flags but should not bypass operator review
- priority overlays derived from Radar must be traceable to the source analysis record

## Automation intake rules
- every inbound workflow event must include `trigger_key`, `occurred_at`, and source entity context
- replay-sensitive workflows must define a deduplication key before activation
- failed high-impact workflows must produce an `automation_runs` failure record
- automation cannot create unbounded duplicate tasks or outbound reminders
- workflows affecting CRM stage, assignment, or messaging must be bounded by backend validation, not just n8n logic

## Messaging safety rules
- human handoff freezes automation responses unless explicitly resumed
- no-response reminders must respect cadence caps
- inbound provider messages must dedupe by provider message id when available
- outbound messaging should be suppressed for terminal/rejected states unless a compliance/admin exception exists
- messaging behavior must respect current stage and ownership context

## Minimum service-layer functions
The first implementation pass should include backend/service handlers for:
1. `create_or_update_lead_from_diagnostic`
2. `record_radar_analysis`
3. `transition_crm_stage`
4. `create_followup_task`
5. `record_whatsapp_message`
6. `request_human_handoff`
7. `record_automation_run`

## Acceptance rules for moving from specified → schema_ready
A workstream reaches `schema_ready` only when:
- canonical entities are defined
- required enums/constraints are defined
- stage/task/workflow rules are written explicitly
- RLS orientation is defined for touched tables
- replay-sensitive side effects have dedupe strategy

## Dependencies
- [[Projects/Bloque Cero]]
- [[Projects/Bloque Cero - CRM Stage Transition Map]]
- [[Projects/Bloque Cero - CRM Operations Spec]]
- [[Projects/Bloque Cero - n8n Automation Trigger Matrix]]
- [[Projects/Bloque Cero - SQL Schema Draft]]

## Immediate implementation tasks
1. Convert these rules into actual service functions or SQL-backed handlers once repo work starts
2. Add RLS actor mapping for each protected write path
3. Add a formal override metadata schema
4. Reconcile assignment history once `crm_assignments` is moved from deferred to active
5. Bind these rules to workflow payload validation and release gating

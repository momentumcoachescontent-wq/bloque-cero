---
topic:
  - deploy
  - validation
  - release
  - operations
status: draft
type: runbook
created: "2026-04-18"
project: Bloque Cero
module: deploy-validation-runbook
---
# Bloque Cero - Deploy Validation Runbook

## Purpose
Define the validation runbook required to recover, verify, and approve Bloque Cero deploys before production use. This runbook is designed to reduce blind releases, broken build recovery chaos, and backend/app drift across Blueprint de Negocio, CRM, automation, and WhatsApp-connected workflows.

## Scope
This runbook applies to:
- application deploys for **Blueprint de Negocio**
- backend/schema changes in Supabase
- automation changes affecting n8n workflows
- release candidates intended for staging or production validation

## Preconditions
Before starting validation:
- a release candidate or deploy target must be identified
- the change set must be traceable to a repo/version/build reference
- relevant migrations, env changes, and workflow changes must be known
- blocking security items must not be ignored silently

## Validation statuses
- `not_started`
- `running`
- `failed`
- `passed`
- `passed_with_followups`

## Runbook steps

### 1. Release candidate identification
- record the build/release reference
- record date/time of validation
- record intended environment: local, staging, production
- record included changes: app, schema, workflow, docs, config

**Pass standard**
- the candidate is uniquely identifiable and reproducible

### 2. Build and deploy health check
- confirm the build completed successfully
- confirm static assets and app shell load correctly
- confirm no immediate runtime crash or blank-screen behavior
- confirm linked environment variables are present
- confirm secrets are not printed in logs

**Pass standard**
- application boots and basic navigation is available without deploy-time errors

### 3. Schema and migration verification
- verify required migrations were applied in the correct order
- verify tables, constraints, and indexes expected by the release exist
- verify RLS state matches expectations for new/modified entities
- verify no partial migration left the system in a mixed state

**Pass standard**
- schema version is coherent with app/workflow expectations

### 4. Core operational smoke tests
- create or load a test lead
- confirm diagnostic submission can be created or retrieved
- confirm Radar-related records required by this release are compatible
- confirm CRM stage history can be written/read safely
- confirm tasks and assignments are visible where expected

**Pass standard**
- the canonical lead lifecycle is not broken at the data layer

### 5. Stage-transition validation
- test at least one valid transition path
- test at least one invalid transition rejection
- confirm required side effects occur only once
- confirm manual override paths leave a reason trail where applicable

**Pass standard**
- stage rules are enforced server-side and side effects are traceable

### 6. Automation validation
- verify the workflows affected by the release are enabled/disabled intentionally
- verify trigger payloads match expected schema
- verify dedupe behavior for replay-safe flows
- verify failure logging path for a controlled failure case
- verify no workflow can send duplicate user-facing messages from a replay event

**Pass standard**
- workflows are connected, bounded, and auditable

### 7. Messaging / WhatsApp validation
- verify inbound message persistence path if included in scope
- verify no-response and handoff logic behave according to the intended release scope
- verify human handoff freezes or redirects automation where required
- verify messaging templates or content references are pointing to the right environment

**Pass standard**
- conversational behavior is safe and consistent with CRM state

### 8. Security verification checkpoint
- confirm no critical security checklist item was regressed by the release
- confirm no sensitive endpoint or internal URL was accidentally exposed in the delivered surface
- confirm credentials remain in secret storage only

**Pass standard**
- release does not reopen known critical security risks

### 9. Observability and rollback readiness
- confirm logs needed for troubleshooting are available
- confirm the rollback path is documented for this release type
- confirm the operator knows what signal would trigger rollback
- confirm release ownership is assigned, even if still functional-role based

**Pass standard**
- failure can be detected and reversed without improvisation

### 10. Final validation outcome
Record one of:
- `passed`
- `passed_with_followups`
- `failed`

If `passed_with_followups`, document:
- follow-up items
- owner
- severity
- deadline before broader rollout

If `failed`, document:
- blocking reason
- rollback or containment action
- next validation condition

## Minimum smoke scenarios
1. lead creation / retrieval
2. diagnostic submission completion path
3. Radar output persistence compatibility
4. valid CRM transition
5. invalid CRM transition rejection
6. task creation and due-date visibility
7. automation trigger reception for one critical flow
8. messaging/handoff safety check if messaging is in scope

## Validation record template
- Release candidate:
- Environment:
- Validator:
- Start time:
- End time:
- Scope:
- Build status:
- Schema status:
- Automation status:
- Messaging status:
- Security checkpoint:
- Rollback ready:
- Outcome:
- Follow-ups:

## Failure handling rules
- do not continue rollout if schema and app expectations are mismatched
- do not accept a release that breaks canonical lead lifecycle behavior
- do not mark validation as passed if critical security regression is unresolved
- do not rely on manual tribal knowledge instead of documenting the recovery path

## Dependencies
- [[Projects/Bloque Cero]]
- [[Projects/Bloque Cero - Security Remediation Checklist]]
- [[Projects/Bloque Cero - CRM Stage Transition Map]]
- [[Projects/Bloque Cero - n8n Automation Trigger Matrix]]

## Immediate implementation tasks
1. Bind this runbook to the actual deploy target and repo flow once infrastructure is active
2. Define environment-specific smoke-test credentials/data strategy
3. Add explicit rollback steps per release type
4. Add workflow-specific checks for the first critical n8n batch
5. Reuse this runbook as mandatory input to the release gate checklist

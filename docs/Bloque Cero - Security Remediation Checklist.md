---
topic:
  - security
  - remediation
  - supabase
  - release
status: draft
type: checklist
created: "2026-04-18"
project: Bloque Cero
module: security-remediation-checklist
---
# Bloque Cero - Security Remediation Checklist

## Purpose
Define the remediation checklist required to reduce current Bloque Cero security risk before implementation scale-up and production release. This checklist converts known warnings, stack exposure concerns, and release risks into concrete verification items across Supabase, documentation, automation, application access, and operational controls.

## Relationship to Blueprint de Negocio
- Security controls must protect the canonical backend that supports **Blueprint de Negocio**, embedded **Radar**, CRM operations, WhatsApp workflows, and n8n orchestration
- This checklist is a release control artifact, not just a technical note
- No module should be considered production-ready if it bypasses the controls defined here

## Known risk inputs
- Supabase warning regarding **RLS disabled in public schemas**
- Supabase reminder about **anon key / Data API root endpoint** exposure and compatibility removal
- Public documentation may expose internal infrastructure URLs
- Build/deploy instability may cause unsafe hotfix behavior or unclear release state
- Automation and messaging layers may create unsafe side effects if permissions and review boundaries are weak

## Remediation status model
- `open`
- `in_progress`
- `blocked`
- `validated`
- `accepted_risk`

## Severity model
- `critical`
- `high`
- `medium`
- `low`

## Checklist

### 1. Supabase access control and RLS
| Item | Severity | Status | Verification standard |
|---|---|---|---|
| Inventory every table in Bloque Cero schemas and classify as public, authenticated, service-only, or internal | critical | open | Full table inventory exists with intended access level |
| Verify **RLS is enabled** on every table containing lead, diagnostic, Radar, CRM, WhatsApp, routing, or audit data | critical | open | Explicit confirmation per table; no sensitive table left without RLS |
| Define and review RLS policies for `leads` and all directly related entities | critical | open | Policies documented by actor type and access rule |
| Ensure service-role-only operations are not exposed through client-side paths | critical | open | Sensitive writes restricted to secure backend/automation contexts |
| Review storage buckets and object access rules if documents/assets are stored in Supabase | high | open | No sensitive bucket publicly writable/readable unless explicitly intended |
| Confirm auth/session model aligns with operator roles and future named ownership | high | open | Operator-facing access model documented |

### 2. API exposure and key hygiene
| Item | Severity | Status | Verification standard |
|---|---|---|---|
| Remove reliance on anon key access to deprecated or unsafe root Data API patterns | critical | open | No core workflow depends on the removed/exposed pattern |
| Audit where anon key is used across UI, docs, integrations, and tests | critical | open | Usage map exists with approved vs non-approved usage |
| Confirm service role keys are never embedded in public docs or client code | critical | open | No service credential appears outside secure server/secret storage |
| Rotate credentials if any sensitive key may have been exposed in documentation or commits | high | open | Rotation completed and references updated |
| Document allowed credential ownership by environment: local, staging, production | medium | open | Environment-level secret policy exists |

### 3. Documentation and public exposure cleanup
| Item | Severity | Status | Verification standard |
|---|---|---|---|
| Audit public-facing docs for internal infrastructure URLs, hostnames, dashboard links, and admin references | high | open | Public docs scrubbed of sensitive internal references |
| Remove or redact internal n8n, EasyPanel, Hostinger, Supabase admin, or deploy target URLs from public artifacts | high | open | No public artifact exposes internal operator surfaces |
| Separate public documentation from internal runbooks/checklists where needed | medium | open | Internal-only docs clearly identified |
| Review screenshots or copied logs for leaked identifiers, keys, project refs, or endpoints | high | open | No credential-like or internal references remain |

### 4. Application and backend security rules
| Item | Severity | Status | Verification standard |
|---|---|---|---|
| Translate CRM stage transition rules into backend-enforced validation instead of trusting the UI | high | open | Invalid transitions rejected server-side |
| Enforce ownership/assignment restrictions for sensitive stage changes and handoffs | high | open | Restricted actions require valid actor path |
| Require explicit reason trails for rejection, closed-lost, reopen, and manual override actions | medium | open | Audit-ready reason capture implemented |
| Prevent direct writes that bypass canonical entities/events (`crm_stage_events`, `routing_events`, `automation_runs`) | high | open | Critical state changes produce traceable records |
| Validate inbound automation payloads before applying side effects | high | open | Workflow inputs checked for schema + actor context |

### 5. Automation and messaging controls
| Item | Severity | Status | Verification standard |
|---|---|---|---|
| Define which n8n workflows may execute automatically vs which require operator review | high | open | Approval boundary documented by trigger type |
| Prevent duplicate outbound reminders/messages through dedupe keys and replay-safe workflow logic | high | open | Duplicate workflow replay does not create repeated user-facing side effects |
| Freeze automation during active human handoff when required | high | open | Human takeover behavior enforced |
| Log workflow failures and high-impact side effects into auditable records | medium | open | Operational failures visible and reviewable |
| Limit escalation spam through SLA windowing and retry caps | medium | open | Retry/escalation policy documented and enforced |

### 6. Deploy and environment safeguards
| Item | Severity | Status | Verification standard |
|---|---|---|---|
| Separate local, staging, and production environment variables and secrets | high | open | No ambiguous or shared production secret usage |
| Confirm deploy pipeline does not expose secrets in logs or frontend bundles | critical | open | Secret leakage checks pass |
| Ensure rollback path exists for broken deploys affecting CRM or automation behavior | high | open | Rollback steps documented and tested at least once |
| Verify migration ordering for schema, policies, and automation dependencies | high | open | Releases do not break due to partial backend changes |
| Confirm production deploys use a named release candidate or version reference | medium | open | Build provenance is traceable |

### 7. Logging, audit, and incident readiness
| Item | Severity | Status | Verification standard |
|---|---|---|---|
| Ensure critical security and workflow actions create auditable records | high | open | Stage changes, handoffs, assignment changes, and failures are traceable |
| Define minimum incident triage path for suspicious access or unexpected workflow execution | medium | open | Escalation/containment path documented |
| Define who reviews security/release issues until named owners are assigned | medium | open | Functional owner mapping explicit |
| Track accepted risks explicitly instead of leaving them implicit in backlog | medium | open | Risk register entries have rationale and owner |

## Blocking criteria
The project is blocked from production release if any of the following remain true:
- RLS is not enabled on sensitive tables
- service-role or equivalent sensitive credentials are exposed or cannot be accounted for
- public artifacts still expose internal operator/infrastructure URLs
- core stage-transition logic is enforced only in the UI
- automation can send duplicate or unsafe user-facing messages without operator control
- deploy path lacks rollback or validation discipline

## Recommended implementation sequence
1. Inventory tables, credentials, public docs, and environment exposure
2. Enforce RLS and define policy model for sensitive entities
3. Eliminate deprecated/unsafe anon API usage patterns
4. Clean public/internal docs and rotate credentials if needed
5. Convert stage/security rules into backend enforcement
6. Add automation safety controls and workflow logging
7. Validate deploy safeguards and release traceability
8. Mark each critical item as `validated` before release gating

## Validation evidence to collect
- table-level RLS verification checklist
- policy definitions by entity/actor type
- credential usage map
- docs cleanup diff list
- environment/secret ownership map
- workflow safety checklist
- rollback verification note

## Dependencies
- [[Projects/Bloque Cero]]
- [[Projects/Bloque Cero - Supabase Entity Map]]
- [[Projects/Bloque Cero - CRM Stage Transition Map]]
- [[Projects/Bloque Cero - n8n Automation Trigger Matrix]]
- [[Topics/Security]]

## Immediate implementation tasks
1. Derive a table-by-table RLS verification sheet from the Supabase entity map
2. Derive backend enforcement rules from the CRM stage transition map
3. Create a public-doc exposure audit list for internal URLs and sensitive references
4. Add automation safety acceptance rules for outbound messaging and handoff logic
5. Reconcile deploy/runbook controls with release gating

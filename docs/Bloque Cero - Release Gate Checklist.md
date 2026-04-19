---
topic:
  - release
  - readiness
  - governance
status: draft
type: checklist
created: "2026-04-18"
project: Bloque Cero
module: release-gate-checklist
---
# Bloque Cero - Release Gate Checklist

## Purpose
Define the mandatory go-live gate for Bloque Cero releases affecting Blueprint de Negocio, CRM operations, Radar-backed routing, WhatsApp workflows, or shared backend behavior. This checklist determines whether a release is allowed to proceed beyond validation into broader operational use.

## Gate outcomes
- `approved`
- `approved_with_restrictions`
- `rejected`

## Gate rules
- A release cannot be approved if any critical security blocker remains open
- A release cannot be approved if canonical lead lifecycle behavior is broken
- A release cannot be approved if rollback readiness is undefined
- A release can be restricted to internal/staging use if non-critical follow-ups remain
- All approvals must reference evidence, not memory or optimism

## Release gate checklist

### 1. Security gate
| Item | Required |
|---|---|
| Security remediation checklist reviewed for this release scope | yes |
| No unresolved critical security items affecting touched modules | yes |
| RLS verified for newly introduced or modified sensitive tables | yes |
| No known credential exposure or unsafe secret handling | yes |
| No public/internal URL leakage in release-facing assets | yes |

### 2. Data and backend gate
| Item | Required |
|---|---|
| Required schema changes applied successfully | yes |
| Backend/app rules aligned with documented stage/entity logic | yes |
| Invalid CRM transitions rejected server-side | yes |
| Critical state changes produce auditable records | yes |
| Data model changes are backward-compatible or explicitly migration-gated | yes |

### 3. Automation gate
| Item | Required |
|---|---|
| Trigger payloads for affected workflows are defined and validated | yes |
| Dedupe/idempotency rules exist for replay-sensitive workflows | yes |
| Failure logging path is active for affected workflows | yes |
| Approval boundaries are defined for high-impact outbound actions | yes |
| Human handoff behavior is enforced where applicable | yes |

### 4. Product behavior gate
| Item | Required |
|---|---|
| Blueprint surface behavior matches canonical backend state | yes |
| Radar outputs are not creating contradictory surface or CRM state | yes |
| CRM operator path supports required next actions | yes |
| Messaging behavior is consistent with stage/ownership rules | yes |
| No critical happy-path flow is broken for the intended release scope | yes |

### 5. Deploy and rollback gate
| Item | Required |
|---|---|
| Deploy validation runbook completed | yes |
| Release candidate/build reference recorded | yes |
| Environment scope is explicit | yes |
| Rollback path is documented and executable | yes |
| Release owner/reviewer is named or functionally assigned | yes |

### 6. Scope gate
| Item | Required |
|---|---|
| Production-ready scope is explicitly defined | yes |
| Internal-only or deferred items are explicitly excluded | yes |
| Known follow-ups are recorded with severity and owner | yes |
| Acceptance criteria for this release are met | yes |

## Approval decision record
- Release candidate:
- Environment:
- Decision:
- Reviewer:
- Date:
- Restricted scope if any:
- Blocking issues if rejected:
- Evidence links/artifacts:
- Follow-up commitments:

## Approval guidance
### Approve
Use only when:
- all critical gates pass
- no unresolved blocker threatens data safety, workflow safety, or deploy stability
- validation evidence is complete

### Approve with restrictions
Use when:
- release is acceptable for limited/internal/staged use
- remaining issues are non-critical and bounded
- restrictions are explicit and enforceable

### Reject
Use when:
- critical security, data, automation, or rollback conditions are not met
- validation evidence is incomplete for the touched scope
- production behavior would be unsafe or operationally opaque

## Dependencies
- [[Projects/Bloque Cero]]
- [[Projects/Bloque Cero - Security Remediation Checklist]]
- [[Projects/Bloque Cero - Deploy Validation Runbook]]
- [[Projects/Bloque Cero - CRM Stage Transition Map]]
- [[Projects/Bloque Cero - n8n Automation Trigger Matrix]]

## Immediate implementation tasks
1. Use this checklist as the final control after the deploy validation runbook
2. Add links to actual evidence artifacts once repo/infrastructure execution begins
3. Bind release decisions to named owners when staffing becomes explicit
4. Split approval criteria by environment if staging and production diverge
5. Keep this checklist aligned with any future change in RLS, automation, or deploy architecture

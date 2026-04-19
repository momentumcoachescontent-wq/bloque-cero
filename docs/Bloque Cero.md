---
topic:
  - infrastructure
  - security
status: planning
type: product
started: "2026-03-19"
last_update: "2026-04-07"
---
# Bloque Cero

## Info
**Type:** product
**Status:** planning
**Started:** 2026-03-19
**Last update:** 2026-04-07

## Summary
Bloque Cero is a product studio / agency-product initiative for entrepreneurs in Latin America. Its unified visible product experience is **Blueprint de Negocio**, which absorbs **Radar** as part of the same surface rather than a separate experience. It is being documented and set up with a stack centered on Lovable, GitHub, Supabase, and n8n, with security feedback focused on avoiding exposure of internal infrastructure URLs.

## Unified product model
### Blueprint de Negocio
- **Blueprint de Negocio** is the main visible experience for Bloque Cero
- **Radar** is absorbed as an internal capability/module inside Blueprint, not as a separate surface product
- The ecosystem should be implemented as a modular operating system for diagnosis, lead handling, CRM progression, follow-up, and delivery orchestration

### Core modules to implement
- **Diagnostic / discovery module**
  - Function: capture business context, maturity, blockers, and opportunity signals
  - Surface: forms, guided inputs, structured discovery flows

- **Radar intelligence module**
  - Function: transform diagnostic inputs into structured signals, priorities, and opportunity mapping
  - Surface: embedded analysis inside Blueprint de Negocio

- **CRM and pipeline operations module**
  - Function: manage leads, stages, qualification, next actions, and internal follow-up state
  - Surface: operational CRM layer connected to automations

- **WhatsApp conversational module**
  - Function: handle inbound/outbound conversational flows, lead engagement, reminders, and agentic interactions
  - Surface: messaging layer connected to CRM and automations

- **Automation and orchestration module**
  - Function: execute onboarding, notifications, state transitions, enrichment, and internal ops workflows
  - Surface: n8n-driven backend orchestration layer

- **Design system and documentation module**
  - Function: standardize interfaces, product language, UX patterns, and implementation documentation
  - Surface: design/documentation layer for consistency across all incorporated apps

## People

## Organizations
- [[Organizations/Bloque Cero]] — parent organization / operating brand

## Related
- [[Topics/Security]] — security review and internal URL exposure concerns
- [[Projects/Bloque Cero - Diagnostic Discovery Spec]] — implementation spec for the first intake module in Blueprint de Negocio
- [[Projects/Bloque Cero - Radar Intelligence Spec]] — implementation spec for the embedded Radar analysis layer inside Blueprint de Negocio
- [[Projects/Bloque Cero - CRM Operations Spec]] — implementation spec for CRM data model, pipeline stages, and operational follow-up
- [[Projects/Bloque Cero - WhatsApp Conversational Spec]] — implementation spec for WhatsApp follow-up, conversational states, and human handoff logic
- [[Projects/Bloque Cero - Design Documentation Conventions Spec]] — implementation spec for naming, UI structure, and documentation consistency across Bloque Cero surfaces
- [[Projects/Bloque Cero - Execution Workstreams Matrix]] — execution mapping for workstreams, owners, milestones, dependencies, and delivery artifacts
- [[Projects/Bloque Cero - Supabase Entity Map]] — cross-module backend entity map for Blueprint, Radar, CRM, WhatsApp, and automation flows
- [[Projects/Bloque Cero - CRM Stage Transition Map]] — allowed CRM stage movements, validations, and automation side effects
- [[Projects/Bloque Cero - n8n Automation Trigger Matrix]] — event-to-workflow automation contract for Blueprint, Radar, CRM, WhatsApp, and release support

## Memory checkpoint
### Generated artifacts recovered in this thread
- [[Projects/Bloque Cero - Diagnostic Discovery Spec]]
- [[Projects/Bloque Cero - Radar Intelligence Spec]]
- [[Projects/Bloque Cero - CRM Operations Spec]]
- [[Projects/Bloque Cero - WhatsApp Conversational Spec]]
- [[Projects/Bloque Cero - Design Documentation Conventions Spec]]
- [[Projects/Bloque Cero - Execution Workstreams Matrix]]
- [[Projects/Bloque Cero - Supabase Entity Map]]
- [[Projects/Bloque Cero - CRM Stage Transition Map]]
- [[Projects/Bloque Cero - n8n Automation Trigger Matrix]]

### Current implementation-definition status
- Strategic definition for **Blueprint de Negocio**: complete
- Radar absorption into Blueprint: complete
- Diagnostic module specification: complete
- Radar intelligence specification: complete
- CRM operations specification: complete
- WhatsApp conversational specification: complete
- Design/documentation conventions specification: complete
- Workstream/owner/milestone mapping: complete
- Supabase cross-module entity map: complete
- CRM stage transition rules: complete
- n8n automation trigger matrix: complete

### Technical memory snapshot
- **Visible product surface**: Blueprint de Negocio
- **Embedded capability**: Radar as internal intelligence layer, not separate product
- **Primary stack**:
  - Lovable for UI/editor/hosting
  - GitHub as source of truth
  - Supabase as backend/system of record
  - n8n as orchestration layer
- **Implementation base mapping**:
  - `auto-crm` → CRM / pipeline operations
  - `whatsapp-agentkit` → WhatsApp conversational flows and handoff patterns
  - `awesome-design-md` → design/documentation conventions
- **Backend memory state**:
  - canonical root entity: `leads`
  - major entity families defined for diagnostic, Radar, CRM, WhatsApp, routing, automation, and audit
  - CRM stage machine defined from `new_intake` through terminal states
  - n8n trigger contracts defined for intake, Radar, CRM, WhatsApp, SLA, and release-support events
- **Execution readiness state**:
  - specification layer complete for the core product/ops modules
  - backend modeling layer complete at entity/state/trigger-map level
  - next technical conversion step is SQL schema + app/backend rules once a codebase exists

### Remaining planning artifacts before code execution
- Security remediation checklist
- Deploy validation runbook
- Release gate checklist
- Named owner assignment replacing functional owner roles when team is explicit

## Timeline
**2026-03-19** (email)
PR review comments summarized the Bloque Cero documentation, stack, risks, and ADRs.

**2026-03-24** (email)
Supabase sent a final reminder that anon key access to the Data API root endpoint would be removed on 2026-04-08 for affected projects, including this one.

**2026-03-25** (email)
Supabase reported a critical security vulnerability (RLS disabled in public schemas) for this project.

**2026-04-07** (email)
Build notifications reported a failed deploy after the docs/knowledge-base merge.

## Master plan

### Phase 1 — Strategic definition
- Consolidate the visible experience under **Blueprint de Negocio**
- Absorb **Radar** as an embedded intelligence capability inside Blueprint
- Define how existing and future apps are incorporated into the Bloque Cero ecosystem
- Establish the functional role of each app inside the unified product vision
- Define the core modules: diagnostic, radar intelligence, CRM, WhatsApp, automation, and documentation/design

### Phase 2 — Functional architecture
- Define the architecture of the incorporated apps and their relationship with **Blueprint de Negocio**
- Map channels, workflows, CRM logic, automation layers, and design/documentation standards
- Define what lives in Lovable, Supabase, and n8n
- Assign implementation capabilities and external skill bases to each app/workstream
- Establish the data flow from diagnostic intake → radar analysis → CRM progression → follow-up → delivery orchestration

### Phase 3 — Development of incorporated apps
- Build and integrate the apps prioritized for the Bloque Cero roadmap
- Prioritize implementation in this order:
  1. Diagnostic / discovery module
  2. Radar intelligence module inside Blueprint
  3. CRM and pipeline operations module
  4. WhatsApp conversational module
  5. Automation and orchestration layer hardening
  6. Design system and documentation standardization
- Reuse the following skills/repositories as implementation bases during development:
  - **whatsapp-agentkit** — for WhatsApp agent flows, conversational orchestration, and agent execution patterns
  - **auto-crm** — as the direct implementation base for CRM automation, pipeline logic, lead handling, and follow-up workflows
  - **awesome-design-md** — as the documentation/design standard base for design system references, UI documentation, and product/design communication structure

### Phase 4 — Integration and operations
- Connect incorporated apps with Bloque Cero core flows, backend, and automations
- Standardize operational logic across messaging, CRM, and product interfaces
- Validate production readiness, internal documentation, and maintainability
- Resolve security and deployment blockers before production scale-up
- Complete the Automation Trigger Matrix for **n8n** and convert stage/entity rules into orchestration contracts
- Produce the security remediation checklist and deploy validation runbook
- Define release gates for production-readiness review

### Phase 5 — Pre-implementation technical foundation
- Convert the completed specification layer into an executable technical base
- Produce the **Security Remediation Checklist**, **Deploy Validation Runbook**, and **Release Gate Checklist** as mandatory control artifacts
- Translate the documented entity/state model into concrete SQL schema definitions, relationships, constraints, and RLS policy design
- Convert application logic into explicit backend/app rules for CRM stage movement, task generation, ownership, and Radar-to-CRM synchronization
- Define normalized payload schemas, event contracts, deduplication keys, and retry/failure logging rules for automation
- Establish minimum acceptance criteria for moving each workstream from `specified` to `schema_ready` or `build_ready`

### Phase 6 — Core operational implementation
- Implement the canonical operational backend centered on `leads`, CRM stages, tasks, assignments, routing events, and automation runs
- Build the first executable version of the CRM / pipeline layer using **auto-crm** as the primary implementation base
- Implement the validated stage-transition rules and associated side effects across intake, review, proposal, nurture, and terminal states
- Materialize the Supabase entity model for diagnostic submissions, Radar outputs, CRM objects, and operational audit trails
- Ensure all high-impact state changes are traceable, constrained, and compatible with security policies

### Phase 7 — Automation and conversational execution
- Convert the `n8n` trigger matrix into a real workflow inventory with concrete payload schemas, node mappings, and idempotent execution behavior
- Prioritize implementation of intake, Radar, CRM stage, task-overdue, and assignment-change workflows before secondary flows
- Implement the WhatsApp conversational layer using **whatsapp-agentkit** patterns for reminders, clarification flows, no-response handling, and human handoff
- Connect conversational state to CRM ownership, queue logic, and review flags so messaging operates as part of the same operational system
- Define SLA windows, escalation rules, and operator override controls for automation safety

### Phase 8 — Blueprint de Negocio surface implementation
- Build the visible **Blueprint de Negocio** surface on top of the implemented backend and orchestration contracts
- Implement the diagnostic/discovery experience as the main intake layer for business context and qualification signals
- Embed **Radar** outputs directly inside Blueprint as an intelligence capability rather than a separate product surface
- Implement Blueprint shell views, operator summaries, and external-facing result layers using the established design/documentation conventions
- Ensure front-end surfaces consume canonical backend objects rather than inventing parallel state models

### Phase 9 — End-to-end integration and operational validation
- Validate the full system chain from diagnostic intake → Radar interpretation → CRM progression → WhatsApp follow-up → operational handoff
- Execute happy-path and failure-path validation for incomplete intake, ambiguous Radar outputs, overdue tasks, no-response windows, handoff events, and terminal CRM states
- Verify idempotency, replay safety, audit logging, and operator visibility across all cross-module automations
- Confirm that no downstream workstream introduces terms, states, or objects that conflict with upstream specs
- Validate production-like behavior before release gating

### Phase 10 — Release readiness and production control
- Complete security hardening, deploy stabilization, and release governance before production launch
- Run the deploy validation runbook against the actual release candidate and document pass/fail outcomes
- Apply the release gate checklist as the final approval control for go-live readiness
- Confirm RLS enforcement, sensitive-doc cleanup, external exposure review, rollback preparedness, and minimum observability
- Distinguish clearly between what is production-ready in v1 and what remains internal, test-only, or deferred

### Immediate next plan
1. Create the **Security Remediation Checklist** covering RLS, public docs cleanup, anon API exposure, and sensitive data access
2. Create the **Deploy Validation Runbook** for build/deploy recovery and production checks
3. Create the **Release Gate Checklist** for go-live readiness
4. Translate the documented entity/state model into concrete SQL schema and app/backend rules
5. Convert the `n8n` trigger matrix into real workflows, payload schemas, and idempotent execution rules
6. Implement the CRM/data core using **auto-crm** as the operational base
7. Implement the WhatsApp orchestration layer using **whatsapp-agentkit** patterns
8. Build the visible Blueprint surface on top of the validated backend/orchestration layer
9. Replace functional owners with named owners when delivery staffing is explicit

### Critical path
1. Security remediation checklist
2. Deploy validation runbook
3. Release gate checklist
4. SQL schema + RLS policy design
5. App/backend rules for CRM, Radar, assignments, and stage transitions
6. Payload schemas, deduplication keys, and retry/failure rules
7. n8n workflow inventory and first workflow batch
8. WhatsApp conversational integration
9. Blueprint de Negocio surface implementation
10. End-to-end operational validation
11. Production release gate

### Publish signal
- Last GitHub publish: 2026-04-18
- Publish intent: force Lovable sync detection after documentation implementation update
- Commit strategy: dedicated docs commit on `main`

## Roadmap matrix
| Module | Role inside Blueprint de Negocio | Primary stack layer | Base skill/repo | Phase | Status |
|---|---|---|---|---|---|
| Diagnostic / discovery | Capture business inputs and qualification context | Lovable + Supabase | Custom implementation | Phase 3 | defined |
| Radar intelligence | Analyze inputs and generate structured opportunity signals | Supabase + app logic | Custom implementation | Phase 3 | defined |
| CRM / pipeline operations | Manage leads, stages, next actions, and follow-up | Supabase + n8n | auto-crm | Phase 3 | defined |
| WhatsApp conversational | Messaging, reminders, lead engagement, agentic interactions | n8n + messaging integrations | whatsapp-agentkit | Phase 3 | defined |
| Automation / orchestration | Execute onboarding, notifications, transitions, enrichment | n8n | Custom implementation | Phase 3-4 | defined |
| Design system / documentation | Standardize UI language, UX patterns, and implementation artifacts | Design/docs layer | awesome-design-md | Phase 2-4 | defined |
| Security hardening | Remove exposure risks and enforce secure backend usage | Supabase + docs + infra | Custom implementation | Phase 4 | open |
| Deploy stabilization | Restore healthy builds and release path | Lovable + GitHub + deploy target | Custom implementation | Phase 4 | open |

## Implementation workstreams
- **Workstream A — Product surface / Blueprint de Negocio**
  - Scope: diagnostic UX, Blueprint shell, embedded Radar outputs
  - Stack: Lovable + Supabase
  - Target modules: Diagnostic / discovery, Radar intelligence

- **Workstream B — CRM operations**
  - Scope: lead records, stages, tasks, qualification, operational states
  - Stack: Supabase + n8n
  - Base: **auto-crm**

- **Workstream C — Conversational automation**
  - Scope: WhatsApp flows, reminders, conversational capture, agent handoff
  - Stack: n8n + messaging integrations
  - Base: **whatsapp-agentkit**

- **Workstream D — Design and documentation system**
  - Scope: UI consistency, naming system, component language, implementation docs
  - Stack: documentation/design layer
  - Base: **awesome-design-md**

- **Workstream E — Security and deployment hardening**
  - Scope: RLS/security fixes, public docs cleanup, deploy stability, API access review
  - Stack: Supabase + GitHub/Lovable + docs
  - Target: production readiness

## Suggested milestone sequence
1. Freeze unified product definition for **Blueprint de Negocio**
2. Implement diagnostic data model and intake flow
3. Implement embedded Radar analysis outputs inside Blueprint
4. Stand up CRM operational model using **auto-crm** as base
5. Connect WhatsApp conversational layer using **whatsapp-agentkit** patterns
6. Standardize UI/docs using **awesome-design-md**
7. Complete security hardening and deploy stabilization
8. Validate end-to-end operational flow in production-like conditions

## Incorporated apps and skill association
- **WhatsApp / conversational app layer**
  - Associated skill: **whatsapp-agentkit**
  - Planned use: future development phases for messaging, conversational workflows, and agentic interactions

- **CRM / lead operations layer**
  - Associated skill: **auto-crm**
  - Planned use: future development phases for CRM structure, automation, lead tracking, and operational workflows

- **Design system / documentation layer**
  - Associated skill: **awesome-design-md**
  - Planned use: future development phases for design references, interface documentation, and design-to-implementation consistency

## Decisions
- **2026-03-19**: Use n8n for onboarding, notifications, CRM basics, and WhatsApp integration.
- **2026-04-08**: Future incorporated apps in Bloque Cero must be located in the master plan by development phase and associated with implementation skills/repositories when applicable.
- **2026-04-08**: The following implementation skill bases are adopted for future phases:
  - **whatsapp-agentkit**
  - **auto-crm**
  - **awesome-design-md**
- **2026-04-08**: The unified visible experience for Bloque Cero is **Blueprint de Negocio**.
- **2026-04-08**: **Radar** is no longer treated as a separate visible product and must be implemented as an embedded capability within **Blueprint de Negocio**.
- **2026-04-08**: **auto-crm** is the default implementation base for CRM / pipeline operations.
- **2026-04-08**: **awesome-design-md** is the default standard base for design/documentation consistency.

## Open items
- [ ] Remove or replace exposed internal service URLs in public documentation
- [ ] Resolve the Render build failure
- [ ] Review and fix the reported security vulnerabilities
- [ ] Remove reliance on anon key access to the Data API root endpoint where applicable
- [x] Create the implementation specification for the Diagnostic / discovery module
- [x] Create the implementation specification for the embedded Radar intelligence module
- [x] Define the CRM data model and operational stages using **auto-crm** as base
- [x] Define the WhatsApp conversational flows and handoff logic using **whatsapp-agentkit** patterns
- [x] Translate **awesome-design-md** into Bloque Cero UI/documentation conventions
- [x] Map each workstream to owner, milestone, and delivery artifact

## Key facts
- Lovable is the UI editor and hosting platform.
- GitHub is the source of truth and syncs with Lovable.
- Supabase is the backend.
- The stack documentation explicitly mentioned n8n being hosted on EasyPanel/Hostinger.

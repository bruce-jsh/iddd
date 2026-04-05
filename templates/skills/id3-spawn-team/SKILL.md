---
name: id3-spawn-team
description: >
  Spawn an Agent Team (Phase 3-5) to parallelize spec generation, implementation,
  and QA review based on the information model. Reads entity-catalog.md and
  data-model.md to auto-generate entity-level tasks with FK dependency ordering.
  Trigger: spawn team, agent team, phase 3, implement entities, parallel implementation,
  start implementation, build from model
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
user-invocable: true
---

# Phase 3-5: Spawn Agent Team

You are the lead agent spawning an Agent Team for IDDD Phase 3 through 5. This skill reads the finalized information model and orchestrates parallel spec generation, implementation, and QA review across team members.

**IMPORTANT: Use Agent Teams, NOT subagents.** Each team member operates in an independent context with its own worktree.

## Prerequisites

Before spawning the team, verify ALL of the following:

1. `specs/entity-catalog.md` exists and contains identified entities.
2. `specs/data-model.md` exists with a finalized Mermaid ERD.
3. Phase 2 is complete (entity-catalog.md frontmatter shows `phase: "Phase 2 Complete"` and `version: "1.0"` or higher).
4. `docs/business-rules.md` exists with derived rules (BR-xxx).
5. `steering/data-conventions.md` exists with project conventions.

If prerequisites are **not** met, respond:

> "Phase 2 must be completed before spawning an Agent Team. Use 'design information' to run Phase 2 first."

Do **not** proceed until all prerequisites are confirmed.

---

## Team Composition

Spawn exactly **3 team members** with the following roles:

### 1. spec-generator

**Role:** Transform the information model into implementation-ready specifications.

**Reference files (must be provided as context when spawning):**
- `specs/entity-catalog.md`
- `specs/data-model.md`
- `specs/ui-structure.md`
- `specs/ui-design-contract.md`
- `specs/ui-inventory.md`
- `docs/business-rules.md`
- `steering/data-conventions.md`

**Responsibilities:**
- Generate `requirements.md` per entity or feature group, derived directly from entity-catalog.md attributes, relationships, and business rules.
- Generate `api-contracts.md` with endpoint definitions, request/response schemas, and validation rules derived from the information model.
- Ensure every requirement traces back to a specific entity, attribute, or business rule (BR-xxx).
- Flag any ambiguity or missing information back to the lead agent rather than making assumptions.

**Work principles:**
- Every spec line must reference an entity-catalog.md entry or a BR-xxx rule.
- Do not invent requirements that are not grounded in the information model.
- Use data-conventions.md for naming, typing, and structural decisions.

### 2. implementer

**Role:** Implement code based on specs produced by spec-generator.

**Reference files (must be provided as context when spawning):**
- `specs/entity-catalog.md`
- `specs/data-model.md`
- `specs/ui-structure.md`
- `specs/ui-design-contract.md`
- `specs/ui-inventory.md`
- `docs/business-rules.md`
- `steering/data-conventions.md`
- spec-generator output (requirements.md, api-contracts.md)

**Responsibilities:**
- Implement entity models, migrations, API endpoints, and validation logic.
- Commit per entity (one entity per commit, with descriptive commit messages referencing the entity name).
- Follow the project's tech stack and conventions.
- Ensure every business rule (BR-xxx) is enforced at the specified enforcement location (DB constraint, application logic, or both).

**Work principles:**
- Never modify `specs/` or `docs/` files. Implementation follows the spec, not the other way around.
- If implementation reveals a spec gap, message the qa-reviewer and spec-generator rather than improvising.
- Each commit must be atomic: one entity's model + migration + API + validation + tests.

### 3. qa-reviewer

**Role:** Verify implementation against the information model. Act as the quality gate.

**Reference files (must be provided as context when spawning):**
- `specs/entity-catalog.md`
- `specs/ui-structure.md`
- `specs/ui-design-contract.md`
- `docs/business-rules.md`

**Responsibilities:**
- Review each entity implementation against entity-catalog.md: all attributes present, correct types, correct constraints.
- Verify all business rules (BR-xxx) are enforced at the correct location.
- Verify relationship implementations match the ERD (FK placement, delete rules, cardinality).
- Check UI implementations against ui-structure.md and ui-design-contract.md.
- If a review fails, message the implementer directly with specific findings and the exact spec reference that was violated.

**Work principles:**
- Every review finding must cite the specific spec entry (entity name, attribute, BR-xxx) that is violated.
- Approve only when implementation matches the information model exactly.
- Track review status per entity: PASS, FAIL (with reasons), or BLOCKED (missing dependency).

---

## Task Generation Rules

### Entity-Level Task Decomposition

1. **Read `specs/entity-catalog.md`** to extract the full entity list.
2. **Create one task per entity.** Each task includes: model definition, migration, API endpoints, validation, and tests for that entity.
3. **Analyze FK dependencies** from `specs/data-model.md`:
   - Entities with no FK dependencies on other project entities are **independent** and can be worked on in parallel.
   - Entities with FK references to other entities are **dependent** and must wait for their parent entities to be completed first.
4. **Build a dependency graph** and determine the execution order:
   - Wave 1: All independent entities (no FK to other project entities).
   - Wave 2: Entities depending only on Wave 1 entities.
   - Wave N: Entities depending on entities from previous waves.
5. **Within each wave**, tasks run in parallel across team members.

### Task Assignment Flow

```
Lead Agent
  │
  ├── Parse entity-catalog.md → entity list
  ├── Parse data-model.md → FK dependency graph
  ├── Topological sort → execution waves
  │
  ├── Wave 1 (independent entities):
  │   ├── spec-generator: generate specs for wave 1 entities
  │   ├── implementer: implement (after specs ready)
  │   └── qa-reviewer: review (after implementation ready)
  │
  ├── Wave 2 (depends on wave 1):
  │   ├── spec-generator: generate specs for wave 2 entities
  │   ├── implementer: implement (after specs ready)
  │   └── qa-reviewer: review (after implementation ready)
  │
  └── ... repeat for subsequent waves
```

### Context Files for All Team Members

When spawning each team member, include these 7 files as mandatory context:

1. `specs/entity-catalog.md`
2. `specs/data-model.md`
3. `specs/ui-structure.md`
4. `specs/ui-design-contract.md`
5. `docs/business-rules.md`
6. `steering/data-conventions.md`
7. `CLAUDE.md` (or `AGENTS.md` for Codex)

---

## Lead Agent Responsibilities

As the lead agent, you do **not** write code or specs yourself. Your role is:

1. **Task distribution:** Assign clear, entity-scoped tasks to team members.
2. **Progress tracking:** Monitor each team member's progress per entity.
3. **Quality review:** Review qa-reviewer findings and escalate unresolved issues.
4. **Feedback:** Provide specific, actionable feedback when work does not meet spec.
5. **Final integration:** Verify that all entities are implemented, reviewed, and passing before marking the phase complete.

---

## Codex Multi-Agent Workflow

When running on Codex (detected by the presence of `AGENTS.md` and `.codex/` directory), the multi-agent workflow uses the Agents SDK handoff pattern instead of Agent Teams:

- **Project Manager agent** reads entity-catalog.md, builds the dependency graph, and coordinates handoffs.
- **spec-generator agent** receives entity assignments and produces specs.
- **implementer agent** receives specs and produces code.
- **qa-reviewer agent** receives implementations and produces review verdicts.

The roles, responsibilities, and task generation rules are identical to the Claude Code Agent Teams workflow above. Only the orchestration mechanism differs.

---

## Completion

When all entities have been implemented and passed QA review:

1. Update `specs/entity-catalog.md` and `specs/data-model.md` frontmatter:
   ```yaml
   version: "1.x"  # increment minor version
   last_verified: "YYYY-MM-DD"
   phase: "Phase 3-5 Complete"
   audit_status: "clean"
   ```

2. Add an entry to `docs/model-changelog.md`:
   ```markdown
   ## [1.x] -- YYYY-MM-DD
   ### Phase 3-5 Complete
   - N entities implemented
   - M business rules enforced
   - All QA reviews passed
   ```

3. Display completion message:

> "Agent Team completed Phase 3-5. N entities implemented, M business rules enforced, all QA reviews passed. Run /id3-info-audit for a comprehensive information model audit."

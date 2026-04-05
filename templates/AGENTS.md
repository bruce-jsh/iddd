# IDDD - Information Design-Driven Development

You are working in a project that follows **IDDD (Information Design-Driven Development)**. The information model is the generative center of all development. Every artifact - requirements, API contracts, screen designs, business rules, tests - is derived from and traceable to `specs/entity-catalog.md`.

**Core principle:** Start from "what information exists?" rather than "what features should we build?"

---

## Core Principles

1. **Information model is the single source of truth.** All code, APIs, UI, and tests are derived from entity-catalog.md and data-model.md. If code disagrees with the spec, the spec wins - update the code, not the spec (unless there is a deliberate model change).

2. **Entity-first identification.** Before writing any code, entities must be identified and documented. New features start with "what entities are involved?" not "what endpoints do we need?"

3. **Data model traceability.** Every column, constraint, and relationship in the codebase must trace back to an entry in entity-catalog.md and data-model.md. Untracked schema elements are considered drift.

4. **Output-first design.** Design what users see (dashboards, reports, lists) before designing inputs (forms, APIs). The output image drives the information model.

5. **Business rules are explicit.** Every validation, constraint, and derivation rule is registered in `docs/business-rules.md` with a BR-xxx identifier. Code-only rules are considered debt.

---

## Required Reference Files

Before starting any task, read these files to understand the current state:

| File | Purpose |
|------|---------|
| `specs/entity-catalog.md` | Entity definitions, attributes, relationships, business rule references |
| `specs/data-model.md` | Mermaid ERD, design decisions, index strategy |
| `specs/ui-structure.md` | Screen inventory and navigation structure (Phase 2.5) |
| `specs/ui-design-contract.md` | Visual design contract -- tokens, components, copywriting (Phase 2.5) |
| `specs/ui-inventory.md` | Current UI structure (brownfield projects) |
| `docs/business-rules.md` | All business rules (BR-xxx) with enforcement locations |
| `steering/data-conventions.md` | Naming, typing, PK strategy, and structural conventions |
| `steering/product.md` | Product vision, scope, and priorities |
| `docs/domain-glossary.md` | Domain terms and definitions |
| `docs/info-debt.md` | Known discrepancies and technical debt items |
| `docs/model-changelog.md` | History of model changes (Keep a Changelog format) |

---

## New Feature Workflow

When adding a new feature, follow this procedure:

1. **Identify entities involved.** Read `specs/entity-catalog.md`. If new entities are needed, run entity identification first.
2. **Check business rules.** Read `docs/business-rules.md` for relevant BR-xxx rules that govern the feature's behavior.
3. **Check UI structure.** Read `specs/ui-structure.md` for screen inventory and `specs/ui-design-contract.md` for design tokens.
4. **Implement following the spec.** Every line of code should trace to a spec entry (entity attribute, relationship, or BR-xxx rule).
5. **Register new rules.** If new validation logic is added, register it as BR-xxx in `docs/business-rules.md`.
6. **Update the changelog.** Record what changed in `docs/model-changelog.md`.

---

## Security Rules

1. **Never commit secrets.** Do not add `.env`, credentials, API keys, or tokens to version control.
2. **Never skip hooks without logging.** Hook bypasses must be recorded and resolved.
3. **Never modify spec files during implementation.** If implementation reveals a spec gap, escalate - do not silently change the spec.
4. **Never delete entities from entity-catalog.md without a changelog entry.** Removals must be documented.

---

## Harness Constraints

The project uses automated hooks that enforce information model consistency:

### Schema Drift Detection (severity: BLOCK)

When modifying schema-related files (migrations, ORM definitions, model files), the harness checks whether `specs/entity-catalog.md` has been updated accordingly. If not, the change is **blocked**.

**Required workflow:** Update `specs/entity-catalog.md` first, then modify the schema.

### Rule Check (severity: WARN)

When adding validation logic (Zod, Yup, Joi, Pydantic, @Valid, etc.), the harness checks for a corresponding BR-xxx entry in `docs/business-rules.md`. If missing, you receive a warning.

**Required workflow:** Register the business rule in `docs/business-rules.md` before or alongside the validation code.

### Auto-Audit (severity: INFO)

After every N commits (configurable), the harness runs an automatic audit comparing the codebase against the information model. Review findings at the start of the next session.

### Hook Bypass

- Set `IDDD_SKIP_HOOKS=1` to skip all hooks temporarily.
- Bypasses are logged to `.iddd/skip-history.log` and reviewed during audits.
- Avoid bypassing hooks unless absolutely necessary.

---

## Entropy Management

### Version Headers

`specs/entity-catalog.md` and `specs/data-model.md` contain YAML frontmatter:

```yaml
---
version: "1.0"
last_verified: "YYYY-MM-DD"
phase: "Phase 2 Complete"
entity_count: N
rule_count: N
audit_status: "clean"
---
```

- Update `last_verified` whenever the model is audited or verified.
- If `last_verified` is more than 7 days old, run an audit before proceeding with new work.

### Change Log

Record all model changes in `docs/model-changelog.md` using Keep a Changelog format.

---

## Multi-Agent Workflow

When multiple agents collaborate on this project, use the following role assignments and coordination rules. This workflow applies to both Codex multi-agent orchestration and any platform that supports parallel agent execution.

### Agent Roles

#### spec-generator

**Responsibility:** Transform the information model into implementation-ready specifications.

**Input files:**
- `specs/entity-catalog.md`
- `specs/data-model.md`
- `specs/ui-structure.md`
- `specs/ui-design-contract.md`
- `specs/ui-inventory.md`
- `docs/business-rules.md`
- `steering/data-conventions.md`

**Output:** Per-entity or per-feature-group `requirements.md` and `api-contracts.md`.

**Rules:**
- Every requirement must reference an entity-catalog.md entry or BR-xxx rule.
- Do not invent requirements not grounded in the information model.
- Follow `steering/data-conventions.md` for naming and typing.
- Flag ambiguities rather than assuming.

#### implementer

**Responsibility:** Implement code based on specs from spec-generator.

**Input files:** All spec-generator inputs plus spec-generator output.

**Rules:**
- Commit per entity (one entity per commit with a descriptive message).
- Follow the project's tech stack and conventions.
- Enforce every BR-xxx rule at the specified location (DB constraint, application logic, or both).
- Never modify `specs/` or `docs/` files directly. If a spec gap is discovered, notify spec-generator and qa-reviewer.
- Each commit is atomic: model + migration + API + validation + tests for one entity.

#### qa-reviewer

**Responsibility:** Verify implementation against the information model.

**Input files:**
- `specs/entity-catalog.md`
- `specs/ui-structure.md`
- `specs/ui-design-contract.md`
- `docs/business-rules.md`

**Rules:**
- Check every entity implementation against entity-catalog.md (attributes, types, constraints).
- Verify all BR-xxx rules are enforced at the correct location.
- Verify relationships match the ERD (FK placement, delete rules, cardinality).
- Every finding must cite the specific spec entry that was violated.
- Approve only when implementation matches the information model.

### Task Generation

1. Read `specs/entity-catalog.md` to extract the entity list.
2. Create one task per entity.
3. Analyze FK dependencies from `specs/data-model.md`.
4. Independent entities run in parallel; dependent entities wait for parents.
5. Within each wave, assign tasks across agents.

### Coordination Protocol

- spec-generator completes specs before implementer begins work on an entity.
- implementer completes implementation before qa-reviewer begins review.
- qa-reviewer rejects with specific findings referencing spec entries; implementer fixes and resubmits.
- When all entities pass review, the phase is complete.

---

## IDDD Skills

The following skills are available in the `skills/` directory:

| Skill | Phase | Purpose |
|-------|-------|---------|
| id3-identify-entities | 0/1 | Discover entities from existing code or structured interview |
| id3-design-information | 2 | Refine conceptual model into logical model with rules and UI proposals |
| id3-design-ui | 2.5 | UI structure derivation, visual design contract, mockup generation |
| id3-spawn-team | 3-5 | Spawn parallel agents for spec generation, implementation, and QA |
| id3-info-audit | Audit | Comprehensive information model audit against codebase |
| id3-preview | Utility | Start preview server for ERD, UI mockups, and audit reports |

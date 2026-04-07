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

Before starting any task, read these files to understand the current state of the information model:

| File | Purpose |
|------|---------|
| `specs/entity-catalog.md` | Entity definitions, attributes, relationships, business rule references |
| `specs/data-model.md` | Mermaid ERD, design decisions, index strategy |
| `specs/ui-structure.md` | Screen inventory and navigation structure (Phase 2.5) |
| `specs/ui-design-contract.md` | Visual design contract: tokens, components, copywriting (Phase 2.5) |
| `specs/ui-inventory.md` | Current UI structure (brownfield projects) |
| `docs/business-rules.md` | All business rules (BR-xxx) with enforcement locations |
| `steering/data-conventions.md` | Naming, typing, PK strategy, and structural conventions |
| `steering/product.md` | Product vision, scope, and priorities |
| `docs/domain-glossary.md` | Domain terms and definitions |
| `docs/info-debt.md` | Known discrepancies and technical debt items |
| `docs/model-changelog.md` | History of model changes (Keep a Changelog format) |

---

## Agent Teams Rules

This project uses **Agent Teams** for parallel work. Subagents are NOT used. The rules below govern how you operate as a lead agent and how you spawn team members.

### Lead Agent Role

As the lead agent, you do NOT write code or modify files directly. Your responsibilities are:

1. **Task distribution:** Assign clear, scoped tasks to team members.
2. **Progress tracking:** Monitor each team member's work.
3. **Quality review:** Review team output against the information model.
4. **Feedback:** Provide specific, actionable feedback referencing spec entries.
5. **Final integration:** Verify that all work aligns with the information model.

If implementation is needed, delegate it to a team member. Never do it yourself.

### Spawning Team Members

When spawning a team member, ALWAYS include these 7 files as context:

1. `specs/entity-catalog.md`
2. `specs/data-model.md`
3. `specs/ui-structure.md`
4. `specs/ui-design-contract.md`
5. `docs/business-rules.md`
6. `steering/data-conventions.md`
7. `CLAUDE.md` (this file)

Each team member operates in an **independent context** with its own worktree. Team members communicate via peer-to-peer messaging, not through the lead agent.

### Standard Team Roles

| Role | Responsibility |
|------|---------------|
| spec-generator | Transform information model into implementation-ready specs (requirements.md, api-contracts.md) |
| implementer | Build code from specs, one entity per commit |
| qa-reviewer | Verify implementation against information model, reject on mismatch |

### Task Generation Rules

1. Read `specs/entity-catalog.md` to extract the entity list.
2. Create one task per entity (model + migration + API + validation + tests).
3. Analyze FK dependencies from `specs/data-model.md` to build a dependency graph.
4. Independent entities (no FK to other project entities) run in parallel.
5. Dependent entities wait for their parent entities to complete.
6. Within each dependency wave, assign tasks to team members in parallel.

---

## Hook System

This project uses an automated harness that monitors development:

### Schema Drift Detection (PreToolUse - severity: BLOCK)

When you modify schema-related files (migrations, ORM definitions, model files), the harness checks whether `specs/entity-catalog.md` has been updated accordingly. If not, the change is **blocked**. Always update entity-catalog.md first, then modify the schema.

### Rule Check (PostToolUse - severity: WARN)

When you add validation logic (Zod, Yup, Joi, Pydantic, etc.), the harness checks for a corresponding BR-xxx entry in `docs/business-rules.md`. If missing, you receive a warning. Register the rule before or alongside the validation code.

### Auto-Audit (Stop - severity: INFO)

After every N commits (configured in `.claude/hooks/hook-config.json`), the harness runs an automatic audit comparing the codebase against the information model. Review findings at the start of the next session.

### Hook Bypass

- Set `IDDD_SKIP_HOOKS=1` to skip all hooks temporarily.
- Bypasses are logged to `.iddd/skip-history.log` and reviewed during audits.
- Avoid bypassing hooks. If you must, address the underlying issue promptly.

---

## Entropy Management

### Version Headers

`specs/entity-catalog.md` and `specs/data-model.md` contain YAML frontmatter with version tracking:

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

**Rules:**
- Update `last_verified` whenever you audit or verify the model.
- Increment `version` on each phase completion (Phase 1: 0.1, Phase 2: 1.0, subsequent: 1.1, 1.2, ...).
- If `last_verified` is more than 7 days ago, run `/id3-info-audit` before proceeding with new work. Stale models lead to drift.

### Change Log

Record all model changes in `docs/model-changelog.md` using Keep a Changelog format. Every entity addition, modification, or removal should have an entry.

---

## Preview System

This project includes a visual preview system for reviewing the information model in a browser.

### Generated Previews

- **ERD Preview:** Mermaid ERD rendered as interactive HTML in `.iddd/preview/`.
- **UI Mockup:** Wireframe layouts of proposed screens in `.iddd/preview/`.
- **Audit Dashboard:** Visual audit report with per-entity status cards in `.iddd/preview/`.

### When to Generate Previews

- After completing Phase 0/1 (entity identification): Generate ERD preview.
- After completing Phase 2 (information design): Generate ERD + UI mockup previews.
- After completing Phase 2.5 (UI design): Generate mockup index + per-entity mockup previews.
- After running `/id3-info-audit`: Generate audit dashboard.
- Manual preview: Use `/id3-preview` to start the server with current specs.

### Preview Files

All preview HTML files are stored in `.iddd/preview/` and persist between sessions. They can be opened directly in a browser without the preview server.

---

## Security Rules

1. **Never commit secrets.** Do not add `.env`, credentials, API keys, or tokens to version control.
2. **Never skip hooks without logging.** Hook bypasses must be recorded and resolved.
3. **Never modify spec files during implementation.** If implementation reveals a spec gap, escalate to the lead agent or run an audit - do not silently change the spec.
4. **Never delete entities from entity-catalog.md without a changelog entry.** Removals must be documented.

---

## Global Commands

These commands are available after a global install (`npm i -g id3-cli`) and work in any project.

| Command | Description |
|---------|-------------|
| `/id3-start` | Entry point — auto-detects IDDD status, shows a progress dashboard, and guides you to the next command. Run once to get started, then use individual phase commands directly. |
| `/id3-clear` | Removes all IDDD-generated files from the project. Lists files first, warns about user-authored files, and requires explicit `y` confirmation before deleting anything. |

---

## New Feature Workflow

When adding a new feature:

1. **Identify entities involved.** Read entity-catalog.md. If new entities are needed, run `/id3-identify-entities` first.
2. **Check business rules.** Read business-rules.md for relevant BR-xxx rules.
3. **Check UI structure.** Read ui-structure.md for screen inventory and ui-design-contract.md for design tokens.
4. **Implement following the spec.** Every line of code should trace to a spec entry.
5. **Register new rules.** If new validation logic is added, register it as BR-xxx in business-rules.md.
6. **Update the changelog.** Record what changed in model-changelog.md.

---

## Technology Stack

> _Fill in the project's tech stack below._

- **Language:**
- **Framework:**
- **Database:**
- **ORM:**
- **Validation:**
- **Testing:**
- **Build:**

## Build and Test

> _Fill in the project's build and test commands below._

```bash
# Build
# npm run build

# Test
# npm test

# Lint
# npm run lint
```

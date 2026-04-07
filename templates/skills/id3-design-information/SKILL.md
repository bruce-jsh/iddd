---
name: id3-design-information
description: >
  Refine conceptual model into logical model. Auto-derive business rules,
  validity constraints, and derivation rules from the information model.
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
user-invocable: true
---

# Phase 2: Information Design

You are the lead agent performing IDDD Phase 2. This phase refines the conceptual model produced by Phase 0/1 into a logical model. Business rules, validity constraints, and derivation rules are systematically derived from the information model.

## Prerequisites

Before starting, verify the following conditions:

1. `specs/entity-catalog.md` exists and contains at least 2 identified entities.
2. `specs/data-model.md` exists with a Mermaid ERD (even if preliminary).
3. `docs/business-rules.md` exists (may be empty or partially populated from Phase 0).
4. `steering/data-conventions.md` exists with project naming and typing conventions.

If prerequisites are **not** met, respond:

> "Please complete Phase 0/1 (entity identification) first. Use 'identify entities' to start."

Do **not** proceed until all prerequisites are confirmed.

## Procedure Overview

Phase 2 consists of five sequential steps. Steps 1-3 refine the model and derive rules. Step 4 resolves ambiguities with the user. Step 5 updates all artifacts.

### Step 1: Attribute Refinement

For each entity in `specs/entity-catalog.md`:

- Assign concrete data types (UUID, TEXT, INTEGER, TIMESTAMP, JSONB, BOOLEAN, ENUM, etc.)
- Add constraints: NOT NULL, DEFAULT, UNIQUE, CHECK
- Evaluate index needs (search targets, FKs, frequently filtered attributes)
- Follow conventions defined in `steering/data-conventions.md`

Key conventions to enforce:
- PK strategy: UUID v7 by default (time-sortable)
- All entities get `created_at` and `updated_at` timestamps
- FK columns get automatic indexes
- ENUM vs reference table: 3 or fewer fixed values use ENUM; more use a reference table
- JSON columns: allowed only for frequently changing metadata; normalize if searchable

### Step 2: Relationship Concretization

For each relationship in the entity catalog:

- Determine FK placement (which table holds the FK)
  - 1:N relationships: FK goes on the "many" side
  - 1:1 relationships: FK goes on the dependent/optional side
  - N:M relationships: create a junction table with two FKs
- Specify delete/update rules for every FK:
  - CASCADE: child has no meaning without parent
  - SET NULL: child can exist independently
  - RESTRICT: prevent deletion when children exist
- Identify junction tables for many-to-many relationships and name them using either alphabetical convention (`entity_a_entity_b`) or a domain-specific name if one exists
- Define junction table attributes (if any beyond the two FKs, e.g., `role`, `quantity`, `start_date`)
- Update the Mermaid ERD in `specs/data-model.md` to reflect all FK placements and junction tables

### Step 3: Business Rule Auto-Derivation

Systematically scan the refined model and derive rules. Number each rule as BR-001, BR-002, etc.

**Derivation patterns:**

| Model Element | Rule Type | Example |
|---|---|---|
| NOT NULL constraint | Required field | "BR-001: User.email is required" |
| UNIQUE constraint | Uniqueness | "BR-002: User.email must be unique" |
| FK + CASCADE | Cascade delete | "BR-003: Deleting a Project deletes all Tasks" |
| FK + RESTRICT | Referential guard | "BR-004: Cannot delete Category with existing Products" |
| ENUM values | Validity domain | "BR-005: Order.status must be one of: draft, confirmed, shipped, delivered" |
| State transitions | Transition paths | "BR-006: Order can only transition draft->confirmed->shipped->delivered" |
| Derived attributes | Computation | "BR-007: Order.total = SUM(LineItem.subtotal)" |
| CHECK constraints | Range/format | "BR-008: Product.price must be >= 0" |

For each rule, record: entity, type (constraint / derivation / transition / validity), description, enforcement location (DB constraint / application logic / both), and implementation approach.

**Rule numbering:** Continue from the last BR-xxx number if Phase 0/1 already defined rules. Do not renumber existing rules.

**Cross-entity rules:** Some rules span multiple entities (cascade constraints, aggregate rules, cross-reference rules). These require explicit documentation since they cannot be enforced by a single column constraint.

**Conflict resolution:** If an auto-derived rule conflicts with an existing rule from Phase 0/1, flag the conflict to the user, present both versions, and let the user decide. Record unresolved conflicts in `docs/info-debt.md`.

**For detailed step-by-step procedures, see:** `references/phase2-procedure.md`

### Step 4: Design Decision Questions

Present questions to the user for decisions that cannot be auto-derived:

1. **Large data storage** -- inline vs external storage (S3, etc.) for binary/large text fields
2. **Soft delete scope** -- which entities use `deleted_at` pattern vs hard delete
3. **Multi-tenancy** -- tenant isolation strategy (row-level, schema-level, or none)
4. **Audit trail** -- which entities need history tracking (who changed what, when)
5. **Project-specific decisions** -- any domain-specific architectural choices

Record each decision in `specs/data-model.md` under "Design Decisions" with an ID (D-01, D-02, etc.), topic, choice, rationale, and date. Apply decisions immediately by updating the entity catalog: add `deleted_at` columns where soft delete applies, add `tenant_id` where multi-tenancy applies, add audit columns where history tracking is needed.

Skip question categories that are clearly not applicable to the project. For example, skip multi-tenancy for single-tenant applications, skip audit trail for prototype projects.

### Step 5: Artifact Updates

Update artifacts in this specific order to maintain consistency:

1. **`specs/entity-catalog.md`** -- Add all refined attributes with concrete data types, constraints, indexes. Verify every entity has: all attributes typed, NOT NULL/DEFAULT/UNIQUE specified, `created_at`/`updated_at` present, soft delete and tenant columns added per design decisions, all relationships listing FK column, cardinality, and delete rule.

2. **`specs/data-model.md`** -- Update the Mermaid ERD to reflect all entities, attributes, relationships, and junction tables. Populate the "Index Strategy" section. Populate the "Design Decisions" table with all D-xx entries.

3. **`docs/business-rules.md`** -- Add all derived rules (BR-001+) with full metadata: entity, type, description, enforcement location, and implementation approach. Ensure no duplicate or conflicting rules exist.

## Artifacts Produced

Upon completion, the following files will be created or updated:

| File | Status | Content |
|---|---|---|
| `specs/entity-catalog.md` | Updated | Data types, constraints, indexes added |
| `specs/data-model.md` | Updated | ERD, FK details, junction tables, design decisions |
| `docs/business-rules.md` | Updated | All derived business rules (BR-xxx) |
| `.iddd/preview/erd-phase2.html` | Created | ERD preview |

## Preview Integration

After completing all five steps, generate visual previews for user review:

1. **Generate ERD preview:** Render the finalized Mermaid ERD from `specs/data-model.md` into `.iddd/preview/erd-phase2.html`. The HTML file should embed the Mermaid library and render the ERD diagram with full entity details, relationships, and cardinality notation.

2. **Start preview server** with the ERD file available so the user can review in the browser. The server serves files from the `.iddd/preview/` directory.

Use `/id3-preview` to manually start or restart the preview server at any time.

## Version Header and Changelog

Upon Phase 2 completion, update YAML frontmatter in `specs/entity-catalog.md` and `specs/data-model.md`:

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

Add an entry to `docs/model-changelog.md` following Keep a Changelog format:

```markdown
## [1.0] -- YYYY-MM-DD
### Phase 2 Complete
- N entities: logical model finalized
- M business rules derived
- Design decisions: D-01 (...), D-02 (...), ...
```

## Completion Message

When all steps are finished, display:

> "Logical model finalized. Phase 2 derived N business rules. Proceed to Phase 2.5 (/id3-design-ui) for UI design and implementation."

Replace N with actual count from the session.

# Phase 2: Detailed Step-by-Step Procedure

This document provides the full procedural detail for Phase 2 (Information Design). The parent `SKILL.md` contains the overview; refer here for implementation-level instructions.

---

## Step 1: Attribute Refinement (Detailed)

### 1.1 Read Current State

1. Read `specs/entity-catalog.md` to load all entities and their current attribute definitions.
2. Read `steering/data-conventions.md` to load project-specific naming and typing conventions.
3. Note which attributes already have concrete types (from Phase 0 brownfield extraction) vs. those that are still abstract.

### 1.2 Assign Data Types

For each entity, for each attribute:

| Abstract Type | Concrete Type (default) | Notes |
|---|---|---|
| identifier / ID | UUID (v7) | Time-sortable; override with BIGINT if convention says auto-increment |
| short text | VARCHAR(N) | Determine max length from domain context |
| long text | TEXT | No length limit |
| number (integer) | INTEGER or BIGINT | Use BIGINT for counters that may exceed 2^31 |
| number (decimal) | DECIMAL(p,s) | Use for money, measurements; never FLOAT for money |
| boolean | BOOLEAN | |
| date | DATE | Date only, no time |
| datetime | TIMESTAMP WITH TIME ZONE | Always store in UTC |
| enumeration | ENUM or reference table | 3 or fewer fixed values -> ENUM; otherwise reference table |
| JSON / flexible | JSONB | Only for frequently changing metadata; normalize if searchable |
| binary / file | TEXT (URL/key) | Store reference, not binary data |

### 1.3 Add Constraints

For each attribute, determine:

- **NOT NULL**: Is this field required? If yes, add NOT NULL.
- **DEFAULT**: Does this field have a sensible default? (e.g., `status` defaults to `'draft'`, `created_at` defaults to `NOW()`)
- **UNIQUE**: Must values be unique? (e.g., email, slug, code)
- **CHECK**: Are there value range or format constraints? (e.g., `price >= 0`, `rating BETWEEN 1 AND 5`)

### 1.4 Evaluate Index Needs

Apply these rules:

1. **Primary key**: Automatically indexed (no action needed).
2. **Foreign keys**: Add index on every FK column.
3. **UNIQUE constraints**: Automatically create unique index.
4. **Search targets**: If the attribute is used for search (e.g., `name`, `title`), add a regular index; consider GIN index for full-text search on TEXT columns.
5. **Frequently filtered**: If the attribute appears in WHERE clauses regularly (e.g., `status`, `type`, `tenant_id`), add an index.
6. **Composite indexes**: If queries frequently filter on multiple columns together, consider composite indexes.

Document index decisions in `specs/data-model.md` under "Index Strategy".

### 1.5 Apply Timestamp Conventions

Ensure every entity has:

- `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`
- `updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`

If soft delete applies to this entity (determined in Step 4):
- `deleted_at TIMESTAMP WITH TIME ZONE` (nullable)

---

## Step 2: Relationship Concretization (Detailed)

### 2.1 FK Placement Rules

| Relationship | FK Location | Rationale |
|---|---|---|
| 1:1 mandatory | Either side (prefer the dependent entity) | The entity that cannot exist without the other holds the FK |
| 1:1 optional | The optional side | Avoids NULL FK on the mandatory side |
| 1:N | The "many" side | Standard normalization |
| N:M | Junction table | Both FKs in the junction table |

### 2.2 Delete and Update Rules

For each FK, specify:

| Rule | When to Use |
|---|---|
| CASCADE | Child has no meaning without parent (e.g., OrderLineItem when Order is deleted) |
| SET NULL | Child can exist independently but loses its association (e.g., Task.assignee when User is deleted) |
| RESTRICT | Deletion should be prevented if children exist (e.g., Category with Products) |
| SET DEFAULT | Rare; child reverts to a default parent |

### 2.3 Junction Table Design

For each N:M relationship:

1. Name the junction table: `{entity_a}_{entity_b}` (alphabetical order) or a domain-specific name if one exists (e.g., `enrollment` for Student-Course).
2. Columns:
   - `{entity_a}_id` FK NOT NULL
   - `{entity_b}_id` FK NOT NULL
   - Composite unique index on both FK columns
   - `created_at` timestamp
   - Any additional attributes specific to the relationship (e.g., `role`, `quantity`, `start_date`)
3. Delete rule: Usually CASCADE on both FKs (removing either entity removes the association).

### 2.4 Update the ERD

After all FK decisions are made, update the Mermaid ERD in `specs/data-model.md` to reflect:

- FK columns shown on the correct side
- Junction tables included
- Cardinality notation (||--o{, }o--o{, etc.)

---

## Step 3: Business Rule Auto-Derivation (Detailed)

### 3.1 Systematic Scan Process

Process entities in alphabetical order. For each entity:

1. **Scan constraints**: NOT NULL -> required rule, UNIQUE -> uniqueness rule, CHECK -> range/format rule
2. **Scan FKs**: For each FK, derive a referential integrity rule based on the delete/update rule
3. **Scan ENUMs**: For each ENUM attribute, derive a validity domain rule
4. **Scan state transitions**: If the entity has a `status` or `state` attribute with ENUM values, derive allowed transition paths. Ask the user to confirm the state machine if not already defined.
5. **Scan derived attributes**: If any attribute is computed from others (e.g., `total`, `full_name`, `age`), derive a computation rule.

### 3.2 Rule Numbering

- Use sequential numbering: BR-001, BR-002, BR-003, ...
- If Phase 0/1 already defined some rules, continue from the last number.
- Do not renumber existing rules.

### 3.3 Rule Documentation Format

For each rule, write to `docs/business-rules.md`:

```markdown
### BR-NNN: [Rule Name]
- **Entity**: [Related entity or entities]
- **Type**: constraint | derivation | transition | validity
- **Description**: [Clear, unambiguous rule statement]
- **Enforcement**: DB constraint | application logic | both
- **Implementation**: [Specific implementation approach, e.g., "NOT NULL on users.email column" or "Zod schema validation in create-user handler"]
```

### 3.4 Cross-Entity Rules

Some rules span multiple entities:

- **Cascading constraints**: "Deleting a Project cascades to all its Tasks and Comments"
- **Aggregate rules**: "Order.total must equal the sum of all LineItem.subtotal values"
- **Cross-reference rules**: "A User cannot be both the author and reviewer of the same Document"

These require explicit documentation since they cannot be enforced by a single column constraint.

### 3.5 Conflict Resolution

If an auto-derived rule conflicts with an existing rule from Phase 0/1:

1. Flag the conflict to the user.
2. Present both versions.
3. Let the user decide which to keep.
4. Update `docs/info-debt.md` if the conflict reveals a design issue.

---

## Step 4: Design Decision Questions (Detailed)

### 4.1 Question Categories

Present these categories to the user. Skip categories that are clearly not applicable.

**Category A -- Storage Strategy:**
- Are there attributes that store large binary data (images, files, PDFs)?
- Should these be stored inline (JSONB/BYTEA) or in external storage (S3, GCS)?
- What is the expected size range?

**Category B -- Soft Delete:**
- Which entities should support soft delete (`deleted_at` pattern)?
- General rule: entities with audit requirements or user-facing data should use soft delete; internal/transient entities can use hard delete.
- Soft delete implications: all queries must filter `WHERE deleted_at IS NULL`.

**Category C -- Multi-Tenancy:**
- Does the application serve multiple tenants?
- If yes: row-level isolation (`tenant_id` column on every table) or schema-level isolation?
- Which entities are tenant-scoped vs. global?

**Category D -- Audit Trail:**
- Which entities need change history (who changed what field, when)?
- Implementation options: audit log table, event sourcing, temporal tables.
- Minimum: `updated_by` column. Maximum: full audit log with before/after snapshots.

**Category E -- Project-Specific:**
- Any domain-specific architectural choices not covered above?
- Examples: versioning strategy, approval workflows, notification triggers.

### 4.2 Recording Decisions

For each decision, add to `specs/data-model.md`:

```markdown
| D-NN | [Topic] | [Choice] | [Rationale] | YYYY-MM-DD |
```

Apply decisions immediately: add `deleted_at` columns, `tenant_id` columns, audit columns, etc., to the entity catalog and ERD.

---

## Step 5: Artifact Updates (Detailed)

### 5.1 Update Order

Update artifacts in this specific order to maintain consistency:

1. `specs/entity-catalog.md` -- Add all refined attributes, types, constraints
2. `specs/data-model.md` -- Update ERD, add junction tables, index strategy, design decisions
3. `docs/business-rules.md` -- Add all derived rules

### 5.2 Entity Catalog Update Checklist

For each entity, verify:

- [ ] All attributes have concrete data types
- [ ] NOT NULL / DEFAULT / UNIQUE constraints are specified
- [ ] Index needs are documented
- [ ] `created_at` and `updated_at` are present
- [ ] Soft delete column added (if applicable per D-xx decision)
- [ ] Tenant column added (if applicable per D-xx decision)
- [ ] Audit columns added (if applicable per D-xx decision)
- [ ] All relationships list FK column, cardinality, and delete rule

### 5.3 Data Model Update Checklist

- [ ] Mermaid ERD reflects all entities, attributes, and relationships
- [ ] Junction tables are included in ERD
- [ ] Index strategy section is populated
- [ ] Design decisions table is populated

### 5.4 Business Rules Update Checklist

- [ ] All auto-derived rules are numbered sequentially
- [ ] Each rule has entity, type, description, enforcement, and implementation fields
- [ ] Cross-entity rules are documented
- [ ] No duplicate or conflicting rules exist

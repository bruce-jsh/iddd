# Phase 0: Brownfield Reverse-Extraction -- Detailed Procedures

This document provides the detailed investigation procedures for Phase 0 (brownfield reverse-extraction). The lead agent follows these steps to extract the implicit information model from an existing codebase.

---

## Overview

Phase 0 systematically investigates 4 information layers in order of confidence, from highest (DB schema) to lowest (frontend). Each layer reveals a different facet of the information model. After investigating all layers, discoveries are classified and consolidated into IDDD artifacts.

---

## Layer 1: DB Schema (Highest Confidence)

### What to Investigate
- Tables, columns, data types
- Primary keys and foreign keys
- Indexes (unique, composite, partial)
- Constraints (NOT NULL, DEFAULT, CHECK, UNIQUE)

### How to Investigate

1. **Locate schema files:**
   - Prisma: `prisma/schema.prisma`
   - Drizzle: `drizzle/**/*.ts`
   - SQL migrations: `migrations/**/*.sql`, `schema.sql`
   - Django: `**/models.py`
   - TypeORM: `**/entities/*.ts`
   - JPA: `**/entities/*.java`
   - Sequelize: `sequelize/` configuration

2. **For each table/model found, extract:**
   - Table name and purpose (infer from name and comments)
   - Column list with data types and constraints
   - Primary key strategy (UUID, auto-increment, composite)
   - Foreign key relationships (which table, which column, what rule)
   - Indexes (what they cover, uniqueness)

3. **Build initial entity list:**
   - Each table becomes a candidate entity
   - Junction/pivot tables indicate many-to-many relationships
   - Identify tables that are purely technical (migrations, sessions) vs. domain entities

### Recording Format

For each entity discovered at L1:

```
Entity: [TableName]
Source: L1 (DB Schema)
Columns: [list with types and constraints]
PKs: [primary key columns]
FKs: [foreign key references]
Indexes: [index definitions]
```

---

## Layer 2: ORM/Model Definitions (High Confidence)

### What to Investigate
- Virtual/computed fields not in DB schema
- Derived attributes (getters, computed properties)
- Soft delete patterns (`deleted_at`, `is_active`)
- State machine definitions and transitions
- Model hooks/lifecycle callbacks (beforeCreate, afterUpdate, etc.)
- Scopes/query helpers that imply business rules

### How to Investigate

1. **Locate model files:**
   - Same files as L1, but focus on code-level annotations and logic
   - Prisma: `@default`, `@updatedAt`, virtual relations
   - Django: `Meta` class, `@property`, managers, querysets
   - TypeORM: `@BeforeInsert`, `@AfterUpdate`, subscribers
   - Sequelize: hooks, scopes, virtual fields

2. **For each model, extract:**
   - Virtual fields and their computation logic
   - Lifecycle hooks and what they enforce
   - Soft delete configuration
   - State transition definitions (enum fields + transition methods)
   - Custom validation methods

3. **Compare with L1 findings:**
   - Note any fields that exist in ORM but not in DB (virtual/computed)
   - Note any constraints enforced in ORM but not in DB
   - Record discrepancies as potential info-debt items

### Recording Format

For each entity augmented at L2:

```
Entity: [ModelName]
L2 Additions:
  Virtual fields: [list]
  Computed properties: [list with formulas]
  Lifecycle hooks: [hook -> action]
  Soft delete: [yes/no, pattern]
  State transitions: [from -> to transitions]
  L1-L2 discrepancies: [list]
```

---

## Layer 3: API Contracts (Medium Confidence)

### What to Investigate
- Endpoints (REST routes, GraphQL resolvers)
- DTOs (Data Transfer Objects) / request/response schemas
- Validation logic at API boundaries
- Authorization rules tied to entities
- Aggregation/transformation logic

### How to Investigate

1. **Locate API definition files:**
   - Express/Fastify: route files, controller files
   - NestJS: `*.controller.ts`, `*.dto.ts`
   - Django REST: `views.py`, `serializers.py`, `urls.py`
   - GraphQL: schema definitions, resolvers
   - OpenAPI/Swagger: `openapi.yaml`, `swagger.json`

2. **For each endpoint, extract:**
   - HTTP method + path pattern
   - Which entity/entities it operates on
   - Request body schema (create/update fields)
   - Response schema (what attributes are exposed)
   - Validation rules (required fields, format checks, range limits)
   - Authorization requirements (who can access)

3. **Compare with L1/L2 findings:**
   - Fields in API response but not in entity -> possible derived field
   - Fields in entity but not exposed in API -> intentionally hidden or oversight
   - Validation in API but not in DB -> missing constraint
   - Entities with no API endpoints -> potentially unused or internal-only

### Recording Format

For each entity augmented at L3:

```
Entity: [EntityName]
L3 API Coverage:
  Endpoints: [method + path -> operation]
  Exposed attributes: [list]
  Hidden attributes: [list]
  API-only validations: [list]
  L1/L2-L3 discrepancies: [list]
```

---

## Layer 4: Frontend (Reference Confidence)

### What to Investigate
- Route/page structure
- Screen-entity mapping
- UI pattern classification
- Component-entity relationships
- Form field-attribute mapping

### How to Investigate

1. **Locate frontend structure:**
   - Next.js: `app/` or `pages/` directory
   - React Router: route configuration files
   - Vue Router: `router/index.ts`
   - Angular: routing modules
   - Other: scan for route/page patterns

2. **For each page/screen, extract:**
   - URL pattern
   - Related entities (infer from API calls, data fetching, imports)
   - UI pattern classification:
     - **List view**: table, grid, card list
     - **Detail view**: single entity display
     - **Create/Edit form**: entity creation or modification
     - **Dashboard/Aggregate view**: charts, summaries, KPIs
     - **Relationship navigation**: parent-to-child drill-down

3. **Build UI inventory:**
   - Screen inventory table (screen name, URL, related entity, UI pattern, notes)
   - Screen-entity mapping matrix (entity vs. list/detail/create/edit availability)
   - Unmapped entities (in DB but no UI)
   - Unmapped screens (UI exists but no clear entity mapping)

4. **Map form fields to entity attributes:**
   - For each create/edit form, list input fields
   - Match each field to entity attributes from L1/L2
   - Note any fields that don't correspond to known attributes

### Recording Format

```
Screen: [PageName]
URL: [pattern]
Related Entities: [list]
UI Pattern: [classification]
Form Fields: [field -> entity.attribute mapping]
L1-L4 discrepancies: [list]
```

---

## Discovery Classification

After investigating all 4 layers, classify every discovered element:

### Match (Consistent)

Elements represented consistently across all relevant layers. These form the confirmed information model skeleton.

**Action:** Record directly in `specs/entity-catalog.md` with high confidence.

### Mismatch (Inconsistent)

Elements represented differently across layers. Common examples:
- Column exists in DB but is never used in API or UI
- API validates a field that has no DB constraint
- UI shows a field that doesn't exist in the model
- Different naming across layers (e.g., `user_id` in DB, `userId` in API, `author` in UI)
- Soft delete in ORM but not enforced in DB

**Action:** Record each mismatch in `docs/info-debt.md` with:
- Layers involved
- What each layer says
- Recommended resolution
- Severity (high/medium/low)

### Missing (Implicit)

Rules or constraints that exist only in code logic (if statements, comments, error messages) but are not formalized anywhere.

**Action:** Extract and formalize as explicit business rules in `docs/business-rules.md`.

---

## Verification Interview

After completing the investigation and classification, present the consolidated results to the user:

1. **Entity summary:** List all discovered entities with their source layer and confidence level
2. **Relationship map:** Show the ERD (Mermaid diagram)
3. **Info debt items:** Present mismatches and ask for resolution guidance
4. **Missing rules:** Present extracted implicit rules for confirmation
5. **Questions:** Ask about anything ambiguous or contradictory

**Key question:** "Does this information model accurately reflect your current codebase? Are there any entities, relationships, or rules that are missing or incorrect?"

Incorporate user corrections and additions before finalizing artifacts.

---

## Artifact Generation

### specs/entity-catalog.md

For each entity:

```markdown
## Entity: [Name]
- **Description**: [one sentence]
- **Source**: [L1: DB Schema | L2: ORM only | L3: API only | L4: UI only | Multiple]
- **Attributes**:
  | Name | Type | Required | Constraints | Source | Notes |
  |------|------|----------|-------------|--------|-------|
  | id | UUID | Yes | PK | L1 | |
  | ... | ... | ... | ... | ... | ... |
- **Relationships**:
  | Target | Type | Cardinality | Delete Rule | Source |
  |--------|------|-------------|-------------|--------|
  | ... | ... | ... | ... | ... |
- **State Transitions**: [if applicable, from L2]
- **Business Rules**: [rule numbers, e.g., BR-001, BR-002]
```

### specs/data-model.md

```markdown
---
version: "0.1"
last_verified: "YYYY-MM-DD"
phase: "Phase 0 Complete"
entity_count: N
rule_count: N
audit_status: "clean"
---

# Data Model

## ER Diagram

\`\`\`mermaid
erDiagram
  ENTITY_A ||--o{ ENTITY_B : "relationship description"
  ...
\`\`\`

## Index Strategy

[Entity-by-entity index design extracted from L1]

## Design Decision Log

| Decision ID | Subject | Choice | Reason | Date |
|-------------|---------|--------|--------|------|
| (To be filled in Phase 2) | | | | |
```

### specs/ui-inventory.md

```markdown
## Screen Inventory

| Screen | URL Pattern | Related Entities | UI Pattern | Notes |
|--------|-------------|-----------------|------------|-------|
| ... | ... | ... | ... | ... |

## Screen-Entity Mapping Matrix

| Entity | List View | Detail View | Create Form | Edit Form | Notes |
|--------|-----------|-------------|-------------|-----------|-------|
| ... | ... | ... | ... | ... | ... |

## Unmapped Entities (No UI)
- [Entities that exist in DB but have no corresponding UI]

## Unmapped Screens (No Entity)
- [Screens that don't clearly map to any entity in the catalog]
```

### docs/business-rules.md

```markdown
### BR-001: [Rule Name]
- **Entity**: [related entity]
- **Type**: Constraint | Derivation | Transition | Validity
- **Description**: [rule description]
- **Enforcement Location**: DB constraint | Application logic | Both
- **Implementation**: [specific implementation approach]
- **Source**: [L1/L2/L3/L4, or implicit from code logic]
```

### docs/info-debt.md

```markdown
## Info Debt Item: [ID]
- **Layers Involved**: [e.g., L1 vs. L3]
- **Description**: [what the mismatch is]
- **L1 says**: [...]
- **L3 says**: [...]
- **Severity**: High | Medium | Low
- **Recommended Resolution**: [suggestion]
- **Status**: Open | Resolved
```

---

## Preview Integration

After artifact generation:

1. Generate an ERD preview from `specs/data-model.md` Mermaid content
2. Write it to `.iddd/preview/erd-phase0.html`
3. Start the preview server and display the URL

---

## Completion

Update version headers in `specs/entity-catalog.md` and `specs/data-model.md` (version: "0.1", phase: "Phase 0 Complete").

Add an entry to `docs/model-changelog.md`.

Output the completion message with entity count, relationship count, and business rule count.

# Step 1: UI Structure Derivation

This reference details how to derive screen structure from the information model. The lead agent executes this step conversationally with the user.

---

## Inputs

| File | Purpose |
|------|---------|
| `specs/entity-catalog.md` | Entity definitions, attributes, relationships, state transitions |
| `specs/data-model.md` | ERD with FK relationships and cardinalities |
| `docs/business-rules.md` | BR-xxx rules for validation and behavior |
| `specs/ui-inventory.md` | Current UI structure (brownfield only) |

---

## Entity-to-Screen Derivation Rules (9 Rules)

Apply these rules to every entity in entity-catalog.md. Each rule produces a screen when its condition is met.

| # | Entity Characteristic | Derived Screen | URL Pattern | Derivation Rationale |
|---|----------------------|----------------|-------------|---------------------|
| 1 | Entity exists | List View | `/{plural}` | Every entity needs a listing |
| 2 | PK exists | Detail View | `/{plural}/:id` | PK enables individual retrieval |
| 3 | NOT NULL attributes (non-PK, non-timestamp) | Create Form | `/{plural}/new` | Required fields imply a creation form |
| 4 | Mutable attributes (non-PK, non-timestamp) | Edit Form | `/{plural}/:id/edit` | Editable fields imply an update form |
| 5 | State Transitions defined | Status Dashboard | `/{plural}/dashboard` | Status flow needs a status-oriented view |
| 6 | 1:N FK (parent side) | Child Tab in Detail | `/{plural}/:id/{child-plural}` | Parent detail shows child listing as tab |
| 7 | N:M relationship | Association Manager | `/{plural}/:id/{related-plural}/manage` | Many-to-many needs a linking UI |
| 8 | Derived/computed attribute | Dashboard Widget | _(embedded in dashboard)_ | Aggregated values are visualization candidates |
| 9 | File/Blob attribute | Upload Widget | _(embedded in create/edit form)_ | File-type attributes need upload UI |

### Pluralization

Convert entity name to URL-safe plural form:
- `User` -> `users`
- `Category` -> `categories`
- `Address` -> `addresses`

### Priority Assignment

| Priority | Criteria |
|----------|----------|
| P1 | List + Detail + Create (core CRUD) |
| P2 | Edit + Dashboard + Child Tab |
| P3 | Association Manager + specialized widgets |

---

## Attribute-to-Widget Mapping (12 Rules)

For each entity attribute, determine the appropriate UI widget based on data type, constraints, and metadata.

| # | Data Type | Widget | Additional Condition |
|---|-----------|--------|---------------------|
| 1 | VARCHAR/TEXT (short) | Text Input | max_length <= 200 |
| 2 | TEXT (long) | Textarea | max_length > 200 or unlimited |
| 3 | ENUM | Select Dropdown | Options generated from enum values |
| 4 | BOOLEAN | Toggle/Checkbox | -- |
| 5 | INTEGER | Number Input | min/max constraints derive validation |
| 6 | DECIMAL | Number Input | min/max + step from precision |
| 7 | DATE | Date Picker | -- |
| 8 | TIMESTAMP | DateTime Picker | -- |
| 9 | FK (reference) | Autocomplete/Select | Search against referenced entity |
| 10 | UUID (PK) | Hidden/Read-only | Never shown as editable input |
| 11 | File Reference | File Upload | -- |
| 12 | Email/URL/Phone | Specialized Input | Type-specific validation + format mask |

### Constraint-to-Validation Mapping

| Constraint | Validation Rule |
|------------|----------------|
| NOT NULL | Required field |
| UNIQUE | Uniqueness check (async) |
| CHECK (min/max) | Range validation |
| DEFAULT | Pre-filled value |
| FK | Referential integrity (select from valid options) |

---

## "Output First" Principle

Phase 1 captures the "output image" -- what users ultimately want to see. Use this to drive screen ordering:

1. **Dashboards and reports first.** Place summary views, aggregate displays, and status overviews at the top of the navigation hierarchy.
2. **Reverse-trace inputs.** For each dashboard element, identify which entities and attributes feed it. Ensure the input forms that populate those attributes are accessible.
3. **Navigation order:** Dashboard -> List -> Detail -> Create/Edit Form. This reflects the user's mental model: overview first, then drill down, then act.

---

## Brownfield Change Analysis

When `specs/ui-inventory.md` exists (brownfield project), compare the derived screen inventory against the current UI:

| Classification | Condition | Action |
|---------------|-----------|--------|
| **New** | Entity has screens derived but no matching current UI | Propose new screens |
| **Modified** | Entity attributes changed since last UI build | Propose screen modifications (added/removed fields, changed widgets) |
| **Deleted** | Entity removed from entity-catalog.md | Propose screen removal with redirect |
| **Restructured** | Relationships changed (FK added/removed) | Propose navigation structure changes |

Present the change analysis to the user as a table before finalizing.

---

## User Conversation Procedure

After completing automatic derivation:

1. **Show summary:** "Derived N screens from M entities. Here is the screen inventory:"
2. **Present the screen inventory table** (Screen, URL, Entity, Pattern, Priority, Source).
3. **Ask for confirmation:** "Please review and confirm. Should any screens be added, removed, or re-prioritized?"
4. **Collect additions:** Users may request screens not derivable from entities (e.g., Settings, About, Help pages). Record these with Source = "User-requested".
5. **Prioritize:** Confirm the final priority ordering with the user.
6. **Generate preview** of the navigation structure (Mermaid graph) and display via preview server.

---

## Output: `specs/ui-structure.md`

Write the finalized screen inventory to `specs/ui-structure.md` using this format:

```markdown
---
version: "1.0"
derived_from: "entity-catalog.md v1.0"
screen_count: N
entity_coverage: "X/X (100%)"
---

# UI Structure

## Screen Inventory

| Screen | URL | Primary Entity | Pattern | Priority | Source |
|--------|-----|----------------|---------|----------|--------|
| User List | /users | User | List | P1 | Auto-derived |
| User Detail | /users/:id | User | Detail | P1 | Auto-derived |
| Create User | /users/new | User | Create | P1 | Auto-derived |
| ...

## Entity-Screen Traceability Matrix

| Entity | List | Detail | Create | Edit | Dashboard | Notes |
|--------|------|--------|--------|------|-----------|-------|
| User | /users | /users/:id | /users/new | /users/:id/edit | - | |
| ...

## Navigation Structure

​```mermaid
graph TD
    Dashboard --> UserList["/users"]
    UserList --> UserDetail["/users/:id"]
    UserDetail --> UserEdit["/users/:id/edit"]
    UserDetail --> UserPosts["/users/:id/posts"]
    Dashboard --> PostList["/posts"]
​```

## Change Summary (Brownfield)

| Type | Entity | Current | Proposed | Reason |
|------|--------|---------|----------|--------|
| New | Payment | - | /payments, /payments/:id | New entity added in Phase 2 |
| Modified | User | /users (3 cols) | /users (5 cols) | 2 attributes added |
| ...
```

### Completeness Check

Before writing the file, verify:
- [ ] Every entity in entity-catalog.md has at least one screen
- [ ] Entity coverage is 100%
- [ ] All relationships are reflected in navigation (child tabs, association managers)
- [ ] Traceability matrix has no empty rows
- [ ] Brownfield changes are classified (if applicable)

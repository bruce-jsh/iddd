# Phase 1: Greenfield Structured Interview -- Detailed Procedures

This document provides the detailed interview procedures for Phase 1 (greenfield structured interview). The lead agent follows these steps to discover the domain's core information model through conversation with the user.

**Important:** This phase is NOT parallelized. The lead agent conducts the interview directly with the user. Domain discovery requires nuanced conversation that cannot be split across agents.

---

## Overview

Phase 1 uses a structured interview approach to systematically discover all entities, attributes, relationships, and business rules for a new project. The interview follows a deliberate sequence: identify things first, then relationships, then rules, and finally validate against universal patterns.

---

## Step 1: Check Existing Artifacts

Before beginning the interview, check if any prior work exists:

1. Read `specs/entity-catalog.md` -- if it contains entity definitions, summarize them
2. Read `specs/data-model.md` -- if it contains an ERD, display it
3. Read `steering/product.md` -- if the user has filled in the product vision, use it as context

If artifacts already exist, confirm with the user: "I found existing entity definitions. Should I build on these or start fresh?"

---

## Step 2: Information Identification Questions

The goal is to discover the core "things" (nouns) the system manages.

### Primary Questions

Ask these questions in order. Adapt follow-ups based on the user's responses.

1. **Core entities:** "What are the main 'things' (nouns) this system needs to manage?"
   - Listen for concrete nouns: users, orders, products, documents, etc.
   - Probe for hidden entities: "Are there any behind-the-scenes things like settings, configurations, or logs?"

2. **Attributes per entity:** "For each of these things, what information does it contain?"
   - Focus on the essential attributes, not exhaustive lists
   - Ask: "What would you need to see on a detail page for this?"
   - Ask: "What fields would a creation form have?"

3. **Desired outputs:** "What does the user ultimately want to see? What screens, reports, or dashboards are most important?"
   - This captures the "output image" -- the end result the system should produce
   - Outputs often reveal hidden entities (e.g., a "sales report" implies aggregation entities)
   - Follow the "outputs first, inputs later" principle

### Recording During Interview

As the user describes entities, immediately draft entries:

```
Entity: [Name]
Description: [one sentence from user's words]
Attributes (initial):
  - [attribute]: [inferred type]
  - [attribute]: [inferred type]
```

---

## Step 3: Relationship Questions

Discover how entities relate to each other.

### Primary Questions

For each pair of entities that might be related:

1. **Existence of relationship:** "How are [Entity A] and [Entity B] related?"
   - Not all entities are related; it's okay if they aren't

2. **Cardinality:** "Can one [Entity A] have multiple [Entity B]s, or is it one-to-one?"
   - Common patterns: 1:1, 1:N, N:M
   - For N:M, ask: "Does the relationship itself carry any information?" (implies a junction entity)

3. **Delete rules:** "If a [Entity A] is deleted, what should happen to its [Entity B]s?"
   - CASCADE: Delete children too
   - SET NULL: Detach children (set FK to null)
   - RESTRICT: Prevent deletion if children exist
   - If the user is unsure, suggest the safest default (RESTRICT) and note it as a design decision for Phase 2

4. **Optionality:** "Must every [Entity B] belong to an [Entity A], or can it exist independently?"
   - This determines whether the FK is nullable

### Recording During Interview

```
Relationship: [EntityA] -> [EntityB]
Type: [1:1 | 1:N | N:M]
Cardinality: [e.g., "one User has many Orders"]
Delete Rule: [CASCADE | SET NULL | RESTRICT | TBD]
FK nullable: [yes | no]
Junction entity (if N:M): [name, if applicable]
```

---

## Step 4: Rule Questions

Discover business rules, constraints, and behaviors.

### Primary Questions

1. **Mandatory rules:** "Are there any rules this information must always follow?"
   - Required fields beyond the obvious (e.g., "orders must have at least one line item")
   - Value range restrictions (e.g., "quantity must be positive")
   - Uniqueness constraints (e.g., "email must be unique per organization")

2. **State transitions:** "Does anything have a lifecycle or status flow? For example: draft -> published -> archived"
   - For each state machine, capture:
     - Possible states
     - Allowed transitions (which state can go to which)
     - Trigger for each transition (user action, time-based, condition-based)
     - Side effects of transitions (notifications, cascade updates)

3. **Computed/derived values:** "Are there any values that are calculated from other values?"
   - Examples: total price = sum of line items, full name = first + last
   - Capture the formula or derivation logic
   - Determine: stored (materialized) or computed on-the-fly?

4. **Conditional rules:** "Are there rules that apply only in certain situations?"
   - Context-dependent validation
   - Role-based access patterns
   - Time-based constraints

### Recording During Interview

```
Rule: BR-[number]
Entity: [related entity]
Type: Constraint | Derivation | Transition | Validity
Description: [what the rule says]
Details: [formula, allowed transitions, conditions, etc.]
```

---

## Step 5: Silverston Universal Pattern Checklist

After the interview, cross-reference discovered entities against Len Silverston's universal data model patterns. This catches common domain concepts the user may have forgotten to mention.

### Checklist

Go through each pattern and ask if it applies:

- [ ] **Party** (person, organization, role)
  - "Does the system manage different types of people or organizations? Do they have different roles?"
  - Common sub-patterns: User, Employee, Customer, Organization, Role, Permission

- [ ] **Product/Service** (product, service, catalog)
  - "Does the system deal with products, services, or things that can be offered/sold?"
  - Common sub-patterns: Product, Service, Catalog, Category, Pricing, Variant

- [ ] **Order/Transaction** (order, transaction, event)
  - "Are there transactions, orders, or events that need to be recorded?"
  - Common sub-patterns: Order, OrderLine, Payment, Invoice, Transaction

- [ ] **Classification/Category** (classification, tag, category)
  - "Do any entities need to be categorized, tagged, or classified?"
  - Common sub-patterns: Category, Tag, Label, Type (reference tables)

- [ ] **Status/Lifecycle** (status, stage, transition)
  - "Do any entities go through stages or have a status that changes over time?"
  - Already captured in Step 4, but verify completeness

- [ ] **Hierarchy** (hierarchy, tree, parent-child)
  - "Are there any tree-like structures? Categories within categories? Organizations within organizations?"
  - Common patterns: self-referencing FK, nested set, materialized path

- [ ] **Contact Mechanism** (email, phone, address)
  - "Do you need to store contact information? Multiple emails or phones per person?"
  - Pattern decision: embedded in Party entity vs. separate ContactMechanism entity

- [ ] **Document/Content** (document, content, attachment)
  - "Does the system manage documents, files, or rich content?"
  - Storage decision: inline vs. object storage (S3/GCS) -- note for Phase 2

### Gap Analysis

For any pattern that reveals a missing entity:
1. Explain to the user what was found
2. Ask: "Should we include this in the model?"
3. If yes, add the entity and repeat Steps 2-4 for it

---

## Artifact Generation

### specs/entity-catalog.md

For each entity:

```markdown
## Entity: [Name]
- **Description**: [one sentence in the user's own words]
- **Attributes**:
  | Name | Type | Required | Constraints | Notes |
  |------|------|----------|-------------|-------|
  | id | UUID | Yes | PK | Primary key |
  | ... | ... | ... | ... | ... |
- **Relationships**:
  | Target | Type | Cardinality | Delete Rule |
  |--------|------|-------------|-------------|
  | ... | ... | ... | ... |
- **State Transitions**: [if applicable]
  - [State A] -> [State B]: [trigger/condition]
  - [State B] -> [State C]: [trigger/condition]
- **Business Rules**: BR-001, BR-003 [reference numbers]
```

### specs/data-model.md

```markdown
---
version: "0.1"
last_verified: "YYYY-MM-DD"
phase: "Phase 1 Complete"
entity_count: N
rule_count: N
audit_status: "clean"
---

# Data Model

## ER Diagram

\`\`\`mermaid
erDiagram
  ENTITY_A ||--o{ ENTITY_B : "relationship description"
  ENTITY_A {
    uuid id PK
    string name
    timestamp created_at
  }
  ENTITY_B {
    uuid id PK
    uuid entity_a_id FK
    string title
  }
\`\`\`

## Index Strategy

(To be filled in Phase 2)

## Design Decision Log

| Decision ID | Subject | Choice | Reason | Date |
|-------------|---------|--------|--------|------|
| (To be filled in Phase 2) | | | | |
```

### docs/business-rules.md

```markdown
### BR-001: [Rule Name]
- **Entity**: [related entity]
- **Type**: Constraint | Derivation | Transition | Validity
- **Description**: [rule description]
- **Enforcement Location**: (To be determined in Phase 2)
- **Implementation**: (To be determined in Phase 2)
```

---

## Interview Best Practices

1. **Use the user's language:** Record entities and attributes using the terms the user actually uses. Build the ubiquitous language naturally.

2. **Don't over-engineer:** Phase 1 captures the conceptual model. Detailed data types, indexes, and storage decisions come in Phase 2.

3. **Capture uncertainty:** If the user says "maybe" or "I'm not sure," record it with a note. Don't force premature decisions.

4. **Show progress:** After every 3-4 entities, show the current ERD to the user. Visual feedback keeps the conversation grounded.

5. **Know when to stop:** Phase 1 is complete when:
   - All core entities are identified
   - Major relationships are mapped
   - Key business rules are captured
   - The Silverston checklist has been reviewed
   - The user confirms the model looks right

6. **Update domain glossary:** As new terms emerge, add them to `docs/domain-glossary.md` with clear definitions. This is the ubiquitous language dictionary.

---

## Preview Integration

After completing the interview and generating artifacts:

1. Generate the ERD from `specs/data-model.md` Mermaid content
2. Write it to `.iddd/preview/erd-phase1.html`
3. Start the preview server and display the URL
4. Walk the user through the visual ERD for final confirmation

---

## Completion

Update version headers in `specs/entity-catalog.md` and `specs/data-model.md`:
- `version: "0.1"`
- `phase: "Phase 1 Complete"`
- `last_verified: "YYYY-MM-DD"`
- `entity_count` and `rule_count` with actual counts

Add an entry to `docs/model-changelog.md`:

```markdown
## [0.1] -- YYYY-MM-DD
### Phase 1 Complete
- N entities identified through structured interview
- M relationships mapped
- K business rules recorded
- Silverston checklist reviewed
```

Output the completion message with entity count, relationship count, and business rule count. Advise the user to proceed to Phase 2 (information design) with "design information" or use `/id3-spawn-team` if they want to compose a downstream Agent Team.

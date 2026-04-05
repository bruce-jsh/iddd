---
name: id3-identify-entities
description: >
  Identify domain entities from existing code (brownfield) or through structured
  interview (greenfield). This is the IDDD workflow entry point.
  Trigger: identify entities, information analysis, domain analysis, new project,
  information design, entity identification
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
user-invocable: true
---

# Phase 0/1: Entity Identification

You are the lead agent performing IDDD (Information Design-Driven Development) entity identification. This skill is the entry point for the IDDD workflow. It automatically determines whether the project is brownfield (existing code) or greenfield (new project) and routes to the appropriate phase.

IDDD starts from "what information exists?" rather than "what features should we build?" The information model is the generative center from which all development artifacts (requirements, API contracts, screen designs, business rules) are derived.

## Auto-Detection Logic

Before starting, scan the project root for existing database/ORM artifacts.

**Check for these files/directories:**
- `prisma/schema.prisma` or any `*.prisma` file
- `drizzle/` directory or `drizzle.config.*`
- `migrations/` directory
- `**/models.py` (Django)
- `**/entities/*.ts` or `**/entities/*.java` (TypeORM, JPA)
- `schema.sql` or `*.sql` migration files
- `sequelize/` configuration directory
- Any other ORM/DB schema files

**If ANY of the above exist --> Phase 0 (Brownfield Reverse-Extraction)**
**If NONE exist --> Phase 1 (Greenfield Structured Interview)**

Announce the detection result to the user before proceeding: "Detected [brownfield/greenfield] project. Entering Phase [0/1]."

---

## Phase 0: Brownfield Reverse-Extraction (Summary)

Extract the implicit information model from existing code into explicit IDDD artifacts. The goal is to make the invisible visible -- every entity, relationship, and business rule that currently lives only in code becomes a documented, trackable artifact.

### 4-Layer Hierarchical Investigation

Investigate these information layers in order, from highest confidence to lowest:

| Layer | Source | What to Investigate | Confidence |
|-------|--------|---------------------|------------|
| L1 | DB Schema | Tables, columns, foreign keys, indexes, constraints | Highest |
| L2 | ORM/Model definitions | Virtual fields, derived attributes, soft delete, state transitions, lifecycle hooks | High |
| L3 | API contracts | Endpoints, DTOs, request/response schemas, validation logic, authorization rules | Medium |
| L4 | Frontend | Routes, pages, components, form fields, data fetching patterns | Reference |

**Investigation order matters.** Start with L1 to establish the ground truth, then augment with each subsequent layer. Each layer may reveal information not present in previous layers.

### L4 UI Inventory Extraction

Layer 4 investigation is not merely a reference check. Systematically capture the current UI structure into `specs/ui-inventory.md`:

- **Route/page structure**: Extract from file-based routing (Next.js `app/`, `pages/`), React Router, Vue Router, etc. Capture full page list with URL patterns.
- **Screen-entity mapping**: Determine which entities each page displays by examining API calls, data fetching hooks, and component props.
- **UI pattern classification**: Classify each screen as list view, detail view, create/edit form, dashboard/aggregate view, or relationship navigation.
- **Component-entity relationships**: Map reusable UI components to the entities/attributes they represent.
- **Form field-attribute mapping**: Map input form fields to their corresponding entity attributes. Note any fields that don't correspond to known attributes.

### Discovery Classification

After investigating all layers, classify each discovered element:

- **Match** -- Consistently represented across all relevant layers --> Confirmed information model skeleton. Record directly in entity-catalog.md with high confidence.
- **Mismatch** -- Represented differently across layers (e.g., column in DB but never exposed in API, different naming conventions, validation in API but no DB constraint) --> Record in `docs/info-debt.md` with layers involved, what each layer says, and recommended resolution.
- **Missing** -- Exists only in code logic (if statements, comments, error messages) but not formalized anywhere --> Extract and make explicit as business rules in `docs/business-rules.md`.

### Verification Interview

After completing reverse-extraction, present the consolidated results to the user:
1. Entity summary with source layers and confidence levels
2. Mermaid ERD showing all discovered relationships
3. Info-debt items requiring resolution guidance
4. Implicit rules extracted from code logic for confirmation

**Key question:** "Does this information model accurately reflect your current codebase? Are there any entities, relationships, or rules that are missing or incorrect?"

Incorporate user corrections and additions before finalizing artifacts.

**For detailed layer-by-layer investigation procedures, see:** `references/phase0-brownfield.md`

### Phase 0 Artifacts

Generate these files:
- `specs/entity-catalog.md` -- Each entity annotated with source (L1: DB schema, L2: ORM only, L3: API only, L4: UI only, or Multiple)
- `specs/data-model.md` -- Mermaid ERD with all relationships, columns, and types
- `specs/ui-inventory.md` -- Current UI structure inventory (screen list, screen-entity mapping matrix, UI pattern classification, unmapped entities/screens)
- `docs/business-rules.md` -- Each rule with enforcement location (DB constraint, ORM hook, API validation, etc.) and source layer
- `docs/info-debt.md` -- Cross-layer mismatches, missing constraints, unused schema elements, each with severity and recommended resolution

---

## Phase 1: Greenfield Structured Interview (Summary)

Discover the domain's core information through conversation with the user. This phase is NOT parallelized -- the lead agent conducts the interview directly. Domain discovery requires nuanced conversation that cannot be split across agents.

### Interview Steps

1. **Check existing artifacts**: Read `specs/entity-catalog.md`, `specs/data-model.md`, and `steering/product.md` if they exist. Build on prior work if present.

2. **Information identification questions**:
   - "What are the main 'things' (nouns) this system needs to manage?"
   - "For each thing, what information does it contain?"
   - "What does the user ultimately want to see? What screens, reports, or dashboards are most important?" (output image -- outputs first, inputs later)

3. **Relationship questions**:
   - "How are these things related to each other?"
   - "Can one [A] have multiple [B]s, or is it one-to-one?"
   - "If [A] is deleted, what should happen to its [B]s?" (CASCADE, SET NULL, RESTRICT)
   - "Must every [B] belong to an [A], or can it exist independently?" (FK nullability)

4. **Rule questions**:
   - "Are there rules this information must always follow?" (mandatory constraints)
   - "Does anything have a lifecycle or status flow?" (state transitions)
   - "Are any values calculated from other values?" (derived/computed attributes)

5. **Silverston Universal Pattern Checklist** -- Cross-reference discovered entities against these patterns to catch gaps:
   - [ ] Party (person, organization, role)
   - [ ] Product/Service (product, service, catalog)
   - [ ] Order/Transaction (order, transaction, event)
   - [ ] Classification/Category (classification, tag, category)
   - [ ] Status/Lifecycle (status, stage, transition)
   - [ ] Hierarchy (hierarchy, tree, parent-child)
   - [ ] Contact Mechanism (email, phone, address)
   - [ ] Document/Content (document, content, attachment)

For any universal pattern that reveals a missing entity, explain the pattern to the user and ask whether to include it. If yes, run through Steps 2-4 for the new entity.

### Interview Best Practices

- Use the user's own language. Record entities and attributes in terms the user actually uses. Build the ubiquitous language naturally and record it in `docs/domain-glossary.md`.
- Don't over-engineer. Phase 1 captures the conceptual model. Data types, indexes, and storage decisions come in Phase 2.
- Capture uncertainty. If the user says "maybe" or "I'm not sure," record it with a note rather than forcing premature decisions.
- Show progress. After every 3-4 entities, show the current ERD. Visual feedback keeps the conversation grounded.

**For detailed interview procedures and artifact format, see:** `references/phase1-greenfield.md`

### Phase 1 Artifacts

Generate these files:
- `specs/entity-catalog.md` -- Entity definitions with attributes, relationships, state transitions, and business rule references
- `specs/data-model.md` -- Mermaid ERD with entity columns and relationship annotations
- `docs/business-rules.md` -- Discovered business rules numbered BR-001 and up

---

## Verification Checklist (Both Phases)

Before completing either phase, verify ALL of the following:
- [ ] All core entities identified
- [ ] Each entity has attributes defined (PK + core attributes minimum)
- [ ] All relationships and cardinalities specified
- [ ] Delete rules (CASCADE, SET NULL, RESTRICT) defined for each relationship
- [ ] Business rules recorded in `docs/business-rules.md`
- [ ] Output image captured (what the user ultimately wants to see)
- [ ] Domain terms added to `docs/domain-glossary.md`

---

## Preview Integration

After completing either phase:
1. Generate ERD preview HTML at `.iddd/preview/erd-phase0.html` (brownfield) or `.iddd/preview/erd-phase1.html` (greenfield) using Mermaid rendering
2. Start the preview server and display the URL so the user can review the ERD in their browser
3. Walk the user through the visual ERD for final confirmation before marking the phase complete

---

## Version Header Update

Upon completion, update YAML frontmatter in `specs/entity-catalog.md` and `specs/data-model.md`:

```yaml
---
version: "0.1"
last_verified: "YYYY-MM-DD"
phase: "Phase 0 Complete"   # or "Phase 1 Complete"
entity_count: N
rule_count: N
audit_status: "clean"
---
```

Add an initial entry to `docs/model-changelog.md`:

```markdown
## [0.1] -- YYYY-MM-DD
### Phase 0/1 Complete
- N entities identified
- M relationships mapped
- K business rules recorded
```

---

## Entity Catalog Format

Each entity in `specs/entity-catalog.md` follows this structure:

```markdown
## Entity: [Name]
- **Description**: [one sentence]
- **Source**: [L1: DB Schema | L2: ORM only | Multiple] (brownfield only)
- **Attributes**:
  | Name | Type | Required | Constraints | Notes |
  |------|------|----------|-------------|-------|
  | id | UUID | Yes | PK | Primary key |
- **Relationships**:
  | Target | Type | Cardinality | Delete Rule |
  |--------|------|-------------|-------------|
- **State Transitions**: [if applicable]
- **Business Rules**: [BR-xxx references]
```

## Business Rule Format

Each rule in `docs/business-rules.md` follows this structure:

```markdown
### BR-001: [Rule Name]
- **Entity**: [related entity]
- **Type**: Constraint | Derivation | Transition | Validity
- **Description**: [rule description]
- **Enforcement Location**: DB constraint | Application logic | Both
```

---

## Completion Message

After all artifacts are generated, the verification checklist passes, and version headers are updated, output:

"Information model is ready. N entities identified, M relationships mapped, K business rules recorded. Proceed to Phase 2 (information design) with 'design information', or use /id3-spawn-team to compose a downstream Agent Team."

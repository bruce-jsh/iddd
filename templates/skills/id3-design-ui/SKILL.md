---
name: id3-design-ui
description: >
  Design and implement UI from the information model. Derives screen structure
  from entities, establishes visual design contracts, generates HTML mockups
  for review, and implements screens via Agent Teams.
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
user-invocable: true
---

# Phase 2.5: UI Design and Implementation

You are the lead agent performing IDDD Phase 2.5 -- Information Representation. This phase derives UI structure from the information model, establishes a visual design contract, validates through a 7-Pillar quality gate with mockup preview, and implements screens via Agent Teams.

**Core principle:** Every UI element traces back to an Entity, Attribute, or Business Rule. There is no guessing -- screens and widgets are derived from the information model.

## Prerequisites

Before starting, verify all of the following:

1. `specs/entity-catalog.md` exists with version >= `"1.0"` (Phase 2 complete).
2. `specs/data-model.md` exists with a finalized Mermaid ERD.
3. `docs/business-rules.md` exists with confirmed BR-xxx rules.
4. `steering/data-conventions.md` exists with naming/typing conventions.

If prerequisites are **not** met, respond:

> "Please complete Phase 2 (information design) first. Use 'design information' to start."

Do **not** proceed until all prerequisites are confirmed.

---

## 4-Step Pipeline

```
Step 1: UI Structure Derivation        [Lead, conversational]
Step 2: Visual Design Contract          [Lead, conversational]
Step 3: Pre-Implementation Gate         [Automated + user approval]
Step 4: Implementation + Post-Audit     [Agent Teams]
```

Execute each step sequentially. Steps 1-3 are performed by the lead agent with user interaction. Step 4 spawns Agent Teams for parallel implementation.

---

## Step 1: UI Structure Derivation

Automatically derive screen structure from the information model, then refine with the user.

### Procedure

1. **Read inputs:** Load `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`, and `specs/ui-inventory.md` (if brownfield).
2. **Apply 9 Entity-to-Screen derivation rules** to generate the screen inventory. Every entity produces at least a List View. Additional screens (Detail, Create, Edit, Dashboard, Child Tab, Association Manager) are derived from entity characteristics.
3. **Apply 12 Attribute-to-Widget mapping rules** to determine the widget type for each attribute based on its data type, constraints, and metadata.
4. **Apply "Output First" principle:** Arrange dashboards and reports before input forms. Design navigation from dashboard to list to detail to form.
5. **Brownfield change analysis** (if `ui-inventory.md` exists): Compare current UI inventory against derived screens. Classify differences as New, Modified, Deleted, or Restructured.
6. **Present derivation results to user:** Show the derived screen inventory and ask the user to confirm, remove, or add screens.
7. **Write `specs/ui-structure.md`** with the finalized screen inventory, entity-screen traceability matrix, navigation structure (Mermaid graph), and brownfield change summary.

**For detailed derivation rules and output format, see:** `references/step1-structure-derivation.md`

---

## Step 2: Visual Design Contract

Detect the existing frontend stack and establish design tokens with the user.

### Procedure

1. **Scan the project** for frontend framework indicators (package.json, config files, file extensions). Detect React, Vue, Svelte, Next.js, Nuxt, Tailwind, shadcn/ui, Radix, MUI, or greenfield.
2. **Confirm with user:** Present the detected stack and ask for confirmation. If greenfield, present options.
3. **Establish 5 design token areas:**
   - Spacing Scale (8-point grid default)
   - Typography Scale (4 levels: Display, Heading, Body, Caption)
   - Color System (60/30/10 ratio: Surface, Secondary, Accent + Semantic)
   - Copywriting Standards (CTA patterns, empty states, error messages, danger actions)
   - Component Registry (map widgets to actual framework components)
4. **Connect Entity Attributes to design tokens:** For each attribute, trace the full path from Entity -> Widget -> Component -> Design Tokens -> Validation Message.
5. **Write `specs/ui-design-contract.md`** with tech stack, all design tokens, component mapping, and per-screen design specifications.

**For detailed token definitions and output format, see:** `references/step2-visual-contract.md`

---

## Step 3: Pre-Implementation Gate + Visual Mockup Review

Validate the design artifacts and generate HTML mockups for user approval before implementation.

### Procedure

1. **Run 7-Pillar verification** against `specs/ui-structure.md` and `specs/ui-design-contract.md`:

   | # | Pillar | PASS condition |
   |---|--------|----------------|
   | 1 | Structure Completeness | Every entity has at least 1 screen mapped |
   | 2 | Spacing | All values are multiples of the spacing scale |
   | 3 | Typography | 4 or fewer sizes, 2 or fewer weights |
   | 4 | Color | Accent defined with usage, semantic 4 colors present |
   | 5 | Copywriting | CTA/empty/error/danger patterns defined, no generic text |
   | 6 | Component Registry | Every widget mapped to a component with import path |
   | 7 | Traceability | Every screen has entity source, every widget has attribute source |

   If any pillar is BLOCKED, fix the issue before proceeding.

2. **Generate mockup HTML files** at 3 fidelity levels (Wireframe, Styled, Interactive) with auto-generated sample data. Write to `.iddd/preview/mockup-index.html` and `.iddd/preview/mockup-{entity}.html`.
3. **Start preview server** and display the URL for the user to review.
4. **Wait for user approval:**
   - `approve` -> proceed to Step 4
   - `reject` + feedback -> incorporate changes, regenerate mockups, request approval again

**For detailed gate rules and mockup generation, see:** `references/step3-gate-and-mockup.md`

---

## Step 4: Implementation + Post-Audit

Spawn Agent Teams for parallel screen implementation, then perform a visual audit.

### Procedure

1. **Divide tasks by entity:** Each team member implements 1-3 entity screen groups. Common layout (header, sidebar, navigation) is assigned to the first team member.
2. **Spawn Agent Teams:**
   - `ui-implementer-N` (1 per entity group): Implements screens following ui-structure.md and ui-design-contract.md
   - `ui-reviewer` (1): Verifies design token consistency and traceability across all screens
3. **Implementation principles:**
   - Follow component mapping from ui-design-contract.md exactly
   - Apply design tokens via Tailwind classes or CSS variables
   - Add traceability comments linking each UI element to Entity/Attribute/BR-xxx
   - Reflect BR-xxx rules in validation code
   - Atomic commits: one commit per entity screen group
4. **Post-implementation visual audit:** After all screens are implemented, start the dev server and compare actual rendering against mockup HTML. Score each pillar 1-4 and identify the top 3 fixes.
   - Average >= 3.0 -> "UI implementation complete"
   - Average < 3.0 -> Apply top 3 fixes, then re-audit

**For detailed team composition and audit criteria, see:** `references/step4-implementation.md`

---

## Artifacts Produced

| File | Status | Content |
|------|--------|---------|
| `specs/ui-structure.md` | Created | Screen inventory, traceability matrix, navigation graph |
| `specs/ui-design-contract.md` | Created | Tech stack, design tokens, component mapping |
| `.iddd/ui-gate-result.md` | Created | 7-Pillar verification results |
| `.iddd/preview/mockup-index.html` | Created | Mockup index page with navigation |
| `.iddd/preview/mockup-{entity}.html` | Created | Per-entity mockups (3 fidelity levels) |
| `.iddd/preview/ui-audit.html` | Created | Post-implementation visual audit dashboard |

---

## Preview Integration

After completing Steps 1-3 and generating mockup HTML files:

1. **Start preview server** with mockup files in `.iddd/preview/`. The server serves all files from the `.iddd/preview/` directory.
2. **Display the URL** so the user can review mockups in their browser. The mockup index page provides navigation across all entity mockups with fidelity level tabs.
3. **Traceability panel** at the bottom of each mockup shows Entity/Attribute/BR-xxx source and design token values applied. This is the IDDD differentiator -- every visual element has a traceable origin.

Use `/id3-preview` to manually start or restart the preview server at any time.

---

## Version Header Update

Upon completion of all 4 steps, update YAML frontmatter in `specs/ui-structure.md`:

```yaml
---
version: "1.0"
derived_from: "entity-catalog.md v1.0"
screen_count: N
entity_coverage: "X/X (100%)"
audit_status: "clean"
---
```

Add an entry to `docs/model-changelog.md`:

```markdown
## [1.1] -- YYYY-MM-DD
### Phase 2.5 Complete
- N screens derived from M entities
- Visual design contract established
- 7-Pillar gate passed
- K screens implemented
```

---

## Completion Message

When all four steps are finished, display:

> "UI design and implementation complete. N screens derived from M entities, 7-Pillar gate passed, K screens implemented with audit score X.X. Proceed to Phase 3-5 (/id3-spawn-team) for backend implementation."

Replace N, M, K, X.X with actual values from the session.

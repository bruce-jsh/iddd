# Step 3: Pre-Implementation Gate + Visual Mockup Review

This reference details the 7-Pillar quality gate, HTML mockup generation, and user approval process. The lead agent executes the gate automatically, then presents mockups for user review.

---

## Inputs

| File | Purpose |
|------|---------|
| `specs/ui-structure.md` | Screen inventory and traceability matrix |
| `specs/ui-design-contract.md` | Design tokens, component mapping, copywriting |
| `specs/entity-catalog.md` | Entity list for coverage verification |

---

## 7-Pillar Verification

Run each pillar check against the design artifacts. ALL pillars must PASS before mockup generation proceeds.

| # | Pillar | Source Document | PASS Condition | BLOCKED Condition |
|---|--------|----------------|----------------|-------------------|
| 1 | Structure Completeness | ui-structure.md | Every entity in entity-catalog.md has at least 1 screen mapped. Entity coverage = 100%. | Entity coverage < 100% |
| 2 | Spacing | ui-design-contract.md | All spacing values are multiples of the base unit (default: 4px in an 8-point grid). | Any arbitrary value not in the spacing scale |
| 3 | Typography | ui-design-contract.md | 4 or fewer font sizes defined. 2 or fewer font weights defined. | More than 4 sizes or more than 2 weights |
| 4 | Color | ui-design-contract.md | Exactly 1 accent color with usage documented. All 4 semantic colors (success, warning, error, info) defined. | Accent undefined, or more than 1 accent, or missing semantic colors |
| 5 | Copywriting | ui-design-contract.md | CTA, empty state, error, and danger patterns defined. No generic text ("Submit", "Click here", "OK"). | Missing patterns or generic text found |
| 6 | Component Registry | ui-design-contract.md | Every widget type from ui-structure.md has a mapped component with import path or CSS classes. | Any widget without a component mapping |
| 7 | Traceability | Both documents | Every screen in ui-structure.md has an entity source. Every widget in the per-screen spec has an attribute source. | Any screen or widget without traceable origin |

### Gate Result Format

Write the gate result to `.iddd/ui-gate-result.md`:

```markdown
---
timestamp: "YYYY-MM-DDTHH:MM:SS"
verdict: "PASS"  # or "BLOCKED"
---

# UI Gate Result

| # | Pillar | Status | Details |
|---|--------|--------|---------|
| 1 | Structure Completeness | PASS | 12/12 entities covered (100%) |
| 2 | Spacing | PASS | All values on 8-point grid |
| 3 | Typography | PASS | 4 sizes, 2 weights |
| 4 | Color | PASS | 1 accent (#3b82f6), 4 semantic colors |
| 5 | Copywriting | PASS | 4 patterns defined, no generic text |
| 6 | Component Registry | PASS | 12/12 widgets mapped |
| 7 | Traceability | PASS | 15/15 screens traced, 48/48 widgets traced |

**Verdict: PASS** -- Proceed to mockup generation.
```

If BLOCKED, list the specific violations under each failing pillar and fix them before re-running the gate.

---

## Mockup Generation

After the 7-Pillar gate passes, generate HTML mockup files from `ui-structure.md` and `ui-design-contract.md`.

### Generation Principle

```
Entity: User
  ui-structure.md -> List View, Detail View, Create Form, Edit Form
  ui-design-contract.md -> shadcn Table, Card, Input + spacing 8pt + accent blue

  -> mockup-users.html:
    - List View: styled Table with actual column headers from entity attributes
    - Detail View: Card layout with attribute grouping + relationship tabs
    - Create Form: Input/Select/Toggle with validation message placeholders
    - All views apply design tokens (colors, spacing, typography)
```

### 3 Fidelity Levels

Each entity mockup file contains 3 switchable tabs:

| Level | Content | Purpose |
|-------|---------|---------|
| **Wireframe** | Layout structure only -- gray boxes, monospace labels, no color | Verify screen structure and field ordering |
| **Styled** | Design tokens applied -- accent colors, typography scale, spacing grid | Verify visual design contract compliance |
| **Interactive** | Sample data populated + state transitions simulated | Verify data presentation and user flow |

Users switch between levels using tabs at the top of each mockup page.

### Sample Data Auto-Generation

Populate the Interactive tab with realistic sample data based on attribute types:

| Attribute Type | Sample Data Examples |
|---------------|---------------------|
| VARCHAR (name) | "Alice Johnson", "Bob Smith", "Carol Williams" |
| Email | "alice@example.com", "bob@example.com" |
| ENUM (status) | "Active", "Inactive", "Pending" (from enum values) |
| TIMESTAMP | "2026-04-05 14:30", "2026-03-28 09:15" |
| INTEGER (count) | 42, 128, 7 |
| DECIMAL (price) | 19.99, 149.50, 9.95 |
| FK (organization_id) | "Acme Corp", "Globex Inc", "Initech" |
| BOOLEAN | Toggle ON/OFF states |
| DATE | "2026-04-05", "2026-03-28" |
| UUID (PK) | Hidden from display |

Generate at least 3 sample rows for list views and 1 complete record for detail/form views.

### Mockup File Structure

| File | Content |
|------|---------|
| `.iddd/preview/mockup-index.html` | Index page with left navigation listing all screens grouped by entity. Links to per-entity mockups. |
| `.iddd/preview/mockup-{entity}.html` | Per-entity mockup with 3 fidelity tabs. Includes all screen patterns for that entity (list, detail, create, edit, dashboard, etc.). |

### Preview Server UI Layout

The mockup preview provides a specific layout optimized for design review:

- **Left panel:** Screen navigation grouped by entity. Click to navigate between entity mockups.
- **Center panel:** Active mockup with 3 fidelity tabs (Wireframe / Styled / Interactive).
- **Bottom panel:** Traceability information showing:
  - Entity and Attribute source for each UI element
  - Design token values applied (spacing, typography, color)
  - BR-xxx rule references for validation logic
  - Widget-to-Component mapping used

This bottom traceability panel is the IDDD differentiator. It makes visible why each UI element exists and how it is styled -- all traceable to the information model.

---

## User Approval Process

### Presenting for Review

1. Start the preview server: files are served from `.iddd/preview/`.
2. Display the preview URL in the terminal.
3. Announce: "Mockup preview is ready at [URL]. Please review all screens across 3 fidelity levels. The traceability panel shows the Entity/Attribute source for each element."

### Collecting Feedback

The user responds with one of:

- **`approve`** -- All mockups are acceptable. Proceed to Step 4 (Implementation).
- **`reject`** + specific feedback -- The user describes what needs to change. Examples:
  - "Move the status filter above the table in User List"
  - "Add a confirmation dialog before delete"
  - "Change the dashboard layout to 2-column grid"
  - "The Create Form should group personal info and contact info separately"

### Handling Rejection

When the user rejects with feedback:

1. **Analyze the feedback** against ui-structure.md and ui-design-contract.md.
2. **Update the relevant spec file:**
   - Screen structure changes -> update ui-structure.md
   - Design token changes -> update ui-design-contract.md
   - New screens -> add to ui-structure.md with Source = "User-requested"
3. **Re-run the 7-Pillar gate** to verify changes maintain compliance.
4. **Regenerate mockups** for affected entities.
5. **Present again** for approval.

Repeat until the user approves.

### Approval Record

When approved, update `.iddd/ui-gate-result.md`:

```markdown
## User Approval

- **Status:** Approved
- **Timestamp:** YYYY-MM-DDTHH:MM:SS
- **Review rounds:** N
- **Changes from review:** [summary of changes made during rejection cycles]
```

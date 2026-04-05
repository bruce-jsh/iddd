# Step 4: Implementation + Post-Audit

This reference details the Agent Teams implementation strategy and post-implementation visual audit. The lead agent orchestrates team members and performs the final audit.

---

## Inputs

| File | Purpose |
|------|---------|
| `specs/ui-structure.md` | Screen inventory and navigation structure |
| `specs/ui-design-contract.md` | Design tokens, component mapping, per-screen specs |
| `specs/entity-catalog.md` | Entity definitions and relationships |
| `specs/data-model.md` | ERD for FK dependency ordering |
| `docs/business-rules.md` | BR-xxx rules for validation implementation |
| `.iddd/ui-gate-result.md` | Approved gate result with user sign-off |

---

## Agent Teams Composition

The lead agent spawns a team with these roles after the user approves mockups in Step 3:

| Role | Count | Responsibility | Reference Files |
|------|-------|---------------|----------------|
| ui-implementer-N | 1 per entity group (1-3 entities) | Implement screen code for assigned entities | ui-structure.md, ui-design-contract.md, entity-catalog.md, data-model.md, business-rules.md |
| ui-reviewer | 1 | Verify design token consistency and traceability across ALL screens | ui-design-contract.md, ui-gate-result.md |

### Team Member Context Files

When spawning each team member, provide these files:

1. `specs/entity-catalog.md`
2. `specs/data-model.md`
3. `specs/ui-structure.md`
4. `specs/ui-design-contract.md`
5. `docs/business-rules.md`
6. `steering/data-conventions.md`
7. `CLAUDE.md`

---

## Task Division Rules

### Entity-Based Splitting

Each ui-implementer handles all screens for 1-3 entities. An entity's screens (List, Detail, Create, Edit, Dashboard, Child Tab) are never split across team members.

### FK Dependency Ordering

1. Read the ERD from `specs/data-model.md` to build a dependency graph.
2. **Independent entities** (no FK to other project entities) can be implemented in parallel.
3. **Dependent entities** wait for their parent entity's screens to be complete.
4. Within each dependency wave, assign entity groups to team members for parallel execution.

### Common Layout First

The **first ui-implementer** (assigned the most-connected or root entity) is responsible for creating shared layout components before their entity screens:

1. Root layout (HTML shell, global CSS, font loading)
2. Navigation component (sidebar/header matching the navigation structure from ui-structure.md)
3. Shared UI primitives (if not using a component library)

Other implementers wait for the common layout to be committed before starting.

### Example Task Assignment

```
Entity dependency graph:
  Organization (root, no FK)
  User (FK -> Organization)
  Post (FK -> User)
  Comment (FK -> Post, FK -> User)
  Tag (no FK)
  PostTag (FK -> Post, FK -> Tag)

Wave 1 (parallel):
  ui-implementer-1: Organization (+ common layout) + Tag
  ui-implementer-2: (waits for layout from implementer-1)

Wave 2 (parallel, after Organization + Tag):
  ui-implementer-2: User
  ui-implementer-3: Post

Wave 3 (parallel, after User + Post):
  ui-implementer-2: Comment
  ui-implementer-3: PostTag
```

---

## Implementation Principles (5 Rules)

Every ui-implementer MUST follow these rules:

### 1. Follow the Component Mapping Exactly

Use the exact component and import path specified in ui-design-contract.md's Component Mapping table. Do not substitute alternative components without lead agent approval.

### 2. Apply Design Tokens Directly

Translate design tokens to code:
- **Tailwind:** Use utility classes that map to token values (e.g., `mb-4` for space-4 = 16px)
- **CSS Variables:** Define tokens as CSS custom properties and reference them
- **Inline styles:** Only as a last resort, and only using token values

Never use arbitrary pixel values. Every spacing, font size, and color MUST come from the design token table.

### 3. Add Traceability Comments

For each major UI section, add a comment linking to the information model:

```tsx
{/* Entity: User | Attribute: email | Widget: Specialized Input | BR-003 */}
<Input type="email" placeholder="Email" required />
```

These comments enable post-audit traceability verification.

### 4. Implement BR-xxx Validation

For each business rule referenced in the per-screen design spec:
- Add client-side validation matching the rule description
- Use the copywriting templates from the design contract for error messages
- Reference the BR-xxx identifier in a code comment

```tsx
// BR-003: Email must be unique
const validateEmail = async (email: string) => {
  if (!email) return "Email is required."; // Copywriting: Error Required
  const exists = await checkEmailExists(email);
  if (exists) return "Email already exists."; // Copywriting: Error Unique
  return null;
};
```

### 5. Atomic Commits Per Entity

Each entity's screen group is committed as a single atomic unit:
- Commit message: `feat(ui): implement {Entity} screens (list/detail/create/edit)`
- Include all files for that entity: components, routes, validation, styles
- Do NOT commit partial screen implementations

---

## Implementation Order (Within Each Entity)

Each ui-implementer follows this sequence for their assigned entity:

1. **Layout + Routing:** Set up the route/page structure for all screens of this entity.
2. **Data Fetching:** Connect to API endpoints or create mock data providers.
3. **UI Component Placement:** Build the screen layout using components from the registry, applying design tokens.
4. **Validation:** Implement BR-xxx rules with copywriting-compliant error messages.
5. **State Transitions:** If the entity has state transitions, implement status change UI (buttons, confirmations, status badges).
6. **Responsive Handling:** Ensure screens work on mobile (stack layout) and desktop (side-by-side).

---

## Post-Implementation Audit

After ALL ui-implementers have committed their work and the ui-reviewer has verified consistency, the lead agent performs a visual audit.

### Audit Procedure

1. **Start the development server** (e.g., `npm run dev`).
2. **Navigate to each implemented screen** in the browser.
3. **Compare actual rendering against the mockup HTML** from Step 3.
4. **Score each pillar on a 1-4 scale** per the criteria below.

### Audit Scoring Criteria

| Pillar | 4 (Excellent) | 3 (Good) | 2 (Fair) | 1 (Poor) |
|--------|---------------|----------|----------|----------|
| Structure | 100% of screens implemented | >90% implemented | >70% implemented | <70% implemented |
| Spacing | All values match design tokens | 1-2 violations | 3-5 violations | >5 violations |
| Typography | Exact match with contract | 1 deviation | 2 deviations | >2 deviations |
| Color | All colors correct | 1 misuse | 2-3 misuses | >3 misuses |
| Copywriting | All text matches templates | 1-2 generic labels | 3-5 generic labels | >5 generic labels |
| Component Registry | All specified components used | 1-2 substitutions | 3-5 substitutions | >5 substitutions |
| Traceability | All elements have source comments | >80% traced | >50% traced | <50% traced |

### Audit Result: Top 3 Priority Fixes

After scoring, identify the **3 most impactful fixes** based on:
1. **User visibility:** Issues on frequently visited screens rank higher
2. **Severity:** Structural issues > visual issues > comment issues
3. **Fix effort:** Quick fixes are prioritized for immediate resolution

Format each fix as:

```markdown
### Fix 1: [Description]
- **Pillar:** [affected pillar]
- **Screen:** [affected screen URL]
- **Current:** [what is wrong]
- **Expected:** [what the contract specifies]
- **Action:** [specific steps to fix]
```

### Audit Verdict

| Average Score | Verdict | Action |
|--------------|---------|--------|
| >= 3.0 | **PASS** | "UI implementation complete. Proceed to Phase 3-5." |
| < 3.0 | **NEEDS FIXES** | Apply Top 3 fixes, then re-audit. |

### Re-Audit Process

If the average score is below 3.0:

1. The lead agent assigns the Top 3 fixes to the appropriate ui-implementer(s).
2. Implementers apply fixes and commit.
3. The lead agent re-audits only the affected screens.
4. Repeat until average >= 3.0.

---

## Audit Report Output

Write the audit report to `.iddd/preview/ui-audit.html` as an interactive dashboard:

- **Header:** Overall score (average across all pillars) with pass/fail badge
- **Pillar Cards:** One card per pillar showing score (1-4), status indicator, and specific findings
- **Screen-by-Screen Breakdown:** Each implemented screen with its individual pillar scores
- **Top 3 Fixes:** Highlighted section with the priority fixes described above
- **Comparison View:** Side-by-side panels showing mockup screenshot vs actual rendering (if available)

Also update `specs/ui-structure.md` YAML frontmatter:

```yaml
audit_status: "clean"  # or "needs-fixes"
audit_score: "3.5"
audit_date: "YYYY-MM-DD"
```

---

## Completion

When the audit passes (average >= 3.0):

1. Update `specs/ui-structure.md` frontmatter with `audit_status: "clean"`.
2. Add entry to `docs/model-changelog.md`.
3. The lead agent announces: "UI implementation complete. N screens implemented, audit score X.X/4.0. Proceed to Phase 3-5 (/id3-spawn-team) for backend implementation."

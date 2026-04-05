---
name: id3-info-audit
description: >
  Run a comprehensive information model audit. Compares entity-catalog.md against
  the actual codebase, checks business rule enforcement, UI consistency, version
  headers, and hook bypass history. Produces a visual audit report.
  Trigger: info audit, information audit, model audit, audit entities,
  check consistency, verify model, run audit
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
user-invocable: true
---

# Information Model Audit

You are the lead agent performing an IDDD information model audit. This skill systematically compares the declared information model (`specs/entity-catalog.md`) against the actual codebase, business rule enforcement, UI consistency, and operational hygiene. The output is a structured audit report with per-entity verdicts.

## Prerequisites

Before starting, verify:
1. `specs/entity-catalog.md` exists and contains at least one entity.
2. `specs/data-model.md` exists.

If prerequisites are not met, respond:

> "No information model found. Run 'identify entities' (Phase 0/1) first to create the entity catalog."

---

## Audit Procedure

Execute the following 6 steps in order. Do not skip any step.

### Step 1: Entity List Extraction

1. Read `specs/entity-catalog.md` and extract the full list of declared entities.
2. For each entity, record: name, attribute count, relationship count, associated business rules (BR-xxx references).
3. Read `specs/data-model.md` and cross-reference: every entity in the catalog must appear in the ERD, and vice versa.
4. Flag any discrepancies between entity-catalog.md and data-model.md.

**Output:** Entity checklist with catalog-ERD consistency status.

### Step 2: Codebase Scan

For each declared entity, scan the codebase for its implementation:

1. **Model/schema files:** Search for entity name in ORM definitions, migration files, and schema declarations. Verify:
   - All declared attributes exist in the implementation.
   - Data types match the spec (entity-catalog.md types vs actual implementation types).
   - Constraints match (NOT NULL, UNIQUE, DEFAULT, CHECK).
   - Indexes declared in data-model.md are present.

2. **Unimplemented entities:** Entities in entity-catalog.md with no corresponding code implementation.

3. **Undeclared models:** Code-level models/tables not present in entity-catalog.md (schema drift).

4. **Business rule enforcement:** For each BR-xxx in `docs/business-rules.md`:
   - Check if the rule is enforced at the declared location (DB constraint, application logic, or both).
   - Search for validation patterns (Zod, Yup, Joi, Pydantic, @Valid, etc.) and match against declared rules.
   - Flag rules with no detectable enforcement.

**Verdict per entity:**
- `PASS` -- All attributes, types, constraints, and rules match.
- `WARN` -- Minor discrepancies (naming convention differences, missing non-critical indexes).
- `FAIL` -- Missing attributes, wrong types, missing constraints, or unenforced rules.

### Step 3: UI Consistency Check

If `specs/output-designs.md` exists, check UI implementations:

1. **Unimplemented screens:** Screen proposals in output-designs.md with no corresponding UI code.
2. **Undeclared screens:** UI routes/pages not referenced in output-designs.md.
3. **Form field mapping:** For each form in the UI, verify fields correspond to entity attributes. Flag fields that do not map to any declared attribute.
4. **Navigation paths:** Verify relationship navigation links match the declared entity relationships.

If `specs/output-designs.md` does not exist, skip this step and note it in the report.

**Verdict per screen:**
- `PASS` -- Screen matches output-designs.md proposal.
- `WARN` -- Minor deviations (styling, layout differences).
- `FAIL` -- Missing fields, wrong entity mapping, broken navigation.

### Step 4: Version Header Verification

Read YAML frontmatter from `specs/entity-catalog.md` and `specs/data-model.md`:

1. Check `last_verified` date. If more than 7 days ago (or empty), flag as stale.
2. Check `version` consistency between entity-catalog.md and data-model.md.
3. Check `entity_count` matches the actual number of entities in the file.
4. Check `rule_count` matches the actual number of rules in business-rules.md.

Update frontmatter:
```yaml
last_verified: "YYYY-MM-DD"  # today's date
audit_status: "clean" | "warnings" | "failures"
entity_count: N  # actual count
rule_count: N  # actual count
```

### Step 5: Hook Bypass History

Check `.iddd/skip-history.log` for hook bypass events:

1. If the file exists, read all entries.
2. Count bypasses since the last audit (based on `last_verified` date).
3. For each bypass, check if the bypassed check has been subsequently resolved:
   - Schema drift bypasses: was entity-catalog.md updated afterward?
   - Rule check bypasses: was business-rules.md updated afterward?
4. Flag unresolved bypasses.

If `.iddd/skip-history.log` does not exist or is empty, record "No hook bypasses detected."

### Step 6: Audit Report Generation

Compile findings into a structured report.

**Console output format:**

```
┌─ Information Model Audit Report ─────────────┐
│                                               │
│  Date: YYYY-MM-DD                             │
│  Entities: N declared, M implemented          │
│  Rules: K declared, J enforced                │
│                                               │
│  Entity Results:                              │
│  ✅ User           - all checks passed        │
│  ⚠️ Order          - missing index on status  │
│  ❌ Notification   - not implemented          │
│                                               │
│  UI Results:                                  │
│  ✅ User List      - matches spec             │
│  ❌ Order Detail   - missing 3 fields         │
│                                               │
│  Rule Enforcement:                            │
│  ✅ BR-001 through BR-008 - enforced          │
│  ❌ BR-009 - no enforcement found             │
│                                               │
│  Hook Bypasses: 2 unresolved                  │
│  Version Headers: updated                     │
│                                               │
│  Overall: ⚠️ WARNINGS (3 warn, 2 fail)       │
│                                               │
└───────────────────────────────────────────────┘
```

**Verdict symbols:**
- `✅` -- Passed. Entity/screen/rule fully consistent.
- `⚠️` -- Warning. Minor issues that should be addressed.
- `❌` -- Failed. Significant discrepancy requiring immediate attention.

**Overall verdict:**
- `CLEAN` -- All checks passed.
- `WARNINGS` -- Only warnings, no failures.
- `FAILURES` -- One or more failures detected.

---

## Preview Integration

After generating the console report, create a visual audit dashboard:

1. Generate `.iddd/preview/audit-{date}.html` (where `{date}` is today in YYYY-MM-DD format).
2. The HTML should include:
   - Summary statistics (entity count, rule count, pass/warn/fail counts).
   - Per-entity card layout with status badge (green/yellow/red).
   - Expandable details for each entity showing specific findings.
   - Business rule coverage visualization.
   - Hook bypass timeline (if any).
3. Start the preview server and display the URL:

```
┌─ 📊 Audit Report Ready ─────────────────────┐
│                                               │
│  Dashboard: http://localhost:PORT/audit       │
│  File: .iddd/preview/audit-YYYY-MM-DD.html   │
│                                               │
└───────────────────────────────────────────────┘
```

---

## Completion

After the audit is complete:

1. Version headers in entity-catalog.md and data-model.md have been updated (Step 4).
2. The audit report is displayed in the console.
3. The preview HTML is generated and the server URL is displayed.
4. Display a summary message:

> "Audit complete. N entities checked: X passed, Y warnings, Z failures. See the dashboard at http://localhost:PORT/audit or open .iddd/preview/audit-{date}.html directly."

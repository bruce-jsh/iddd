<div align="center">

**English** · [한국어](README.ko-KR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja-JP.md) · [Türkçe](README.tr-TR.md)

</div>

```
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                        ║
║    ██╗██████╗ ██████╗ ██████╗                                                          ║
║    ██║██╔══██╗██╔══██╗██╔══██╗     Information Design-Driven Development               ║
║    ██║██║  ██║██║  ██║██║  ██║                                                         ║
║    ██║██║  ██║██║  ██║██║  ██║     "What information exists?"                          ║
║    ██║██████╔╝██████╔╝██████╔╝      -- always the first question.                      ║
║    ╚═╝╚═════╝ ╚═════╝ ╚═════╝                                    v0.9.1                ║
║                                                                                        ║
║  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -               ║
║                                                                                        ║
║       ┌─────────────────────────┐           ┌─────────────────────────┐                ║
║       │                         │           │                         │                ║
║       │    INFORMATION          │           │    AGENT                │                ║
║       │    MODEL                │──────────>│    HARNESS              │                ║
║       │                         │           │                         │                ║
║       │  - Entity Catalog       │           │  - Hook Enforcement     │                ║
║       │  - Data Model           │           │  - Drift Detection      │                ║
║       │  - Business Rules       │           │  - Auto Audit           │                ║
║       │  - Domain Glossary      │           │  - Version Tracking     │                ║
║       │                         │           │                         │                ║
║       └─────────────────────────┘           └────────────┬────────────┘                ║
║                                                          │                             ║
║                                                          v                             ║
║                                              ┌─────────────────────────┐               ║
║                                              │                         │               ║
║                                              │    AI AGENT             │               ║
║                                              │    (Constrained)        │               ║
║                                              │                         │               ║
║                                              │  Agent = Model          │               ║
║                                              │         + Harness       │               ║
║                                              │                         │               ║
║                                              └─────────────────────────┘               ║
║                                                                                        ║
╚════════════════════════════════════════════════════════════════════════════════════════╝
```

**Start from "What information exists?" -- not "What features should we build?"**

IDDD is a development methodology and AI agent skill package that places the **information model** at the center of all software development. By building a rigorous entity catalog, data model, business rules, and domain glossary *before* any technology choice is made, IDDD ensures that 80% of application behavior is already defined at the logical model stage. The information model then becomes the generative center from which requirements, API contracts, screen designs, and validation rules are systematically derived.

This package installs IDDD as a set of AI agent skills, harness hooks, and document templates so that your coding agent enforces information-first discipline throughout the entire development lifecycle.

---

## What is IDDD?

Most software projects begin by asking *"What features should we build?"* and jump straight into implementation. IDDD inverts this. It starts from **"What information exists in this domain?"** and treats the information model not as a section of the spec, but as the **single source of truth** from which every other development artifact is derived.

### Core Principles

1. **Information model is the generative center.** All code, APIs, UI, and tests are derived from the entity catalog and data model. If code disagrees with the spec, the spec wins.
2. **Entity-first identification.** Before writing any code, entities must be identified and documented. New features start with "what entities are involved?" not "what endpoints do we need?"
3. **Data model traceability.** Every column, constraint, and relationship in the codebase must trace back to an entry in the entity catalog. Untracked schema elements are considered drift.
4. **Output-first design.** Design what users *see* (dashboards, reports, lists) before designing inputs (forms, APIs). The output image drives the information model.
5. **Business rules are explicit.** Every validation, constraint, and derivation rule is registered with a BR-xxx identifier. Code-only rules are considered debt.

### Three-Stage Data Modeling Mapped to Software Development

IDDD maps the classic three-stage data modeling process directly to software development phases:

```
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Conceptual Model                         │         │  Requirements / Scope Definition          │
│  "What information exists?"               │────────>│  Entity identification, user stories      │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
                    │
                    v
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Logical Model                            │         │  API Contracts / Validation / Biz Logic   │
│  "How is it structured?"                  │────────>│  80% of behavior defined here             │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
                    │
                    v
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Physical Model                           │         │  Implementation Decisions                 │
│  "How is it stored/executed?"             │────────>│  Technology choices, storage, deployment  │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
```

Each element of the information model automatically implies development artifacts:

| Information Model Element  | Derived Artifact                                    |
|----------------------------|-----------------------------------------------------|
| Entity identification      | Requirements scope, user stories                    |
| Relationships & cardinality| API endpoint structure, navigation                  |
| Attributes & data types    | Form fields, validation rules, DTOs                 |
| Constraints                | Input validation, type definitions                  |
| Derived attributes         | Business logic, computation rules                   |
| State transitions          | Workflows, state management                         |
| Aggregation / relation rules| Transaction boundaries, consistency rules           |

**When the logical model is complete, 80% of application behavior is already defined -- before any technology choice is made.**

---

## Supported Platforms

| Platform     | Agent System          | Multi-Agent Strategy                         |
|--------------|-----------------------|----------------------------------------------|
| Claude Code  | Claude Agent Teams    | Peer messaging, independent worktrees        |
| OpenAI Codex | Codex Agents SDK      | Handoff pattern via MCP Server               |

---

## Prerequisites

| Requirement    | Details                                              |
|----------------|------------------------------------------------------|
| Node.js        | **18+** (with npm or a compatible package manager)   |
| Claude Code    | **Claude Max** membership + Agent Teams enabled      |
| OpenAI Codex   | **ChatGPT Plus** or higher (Pro/Business/Enterprise) |

You need Node.js for the `npx` installer. The AI platform subscription is required for whichever platform you use.

---

## Installation

```bash
npx id3@latest
```

No sub-command is needed -- `id3` runs the init process directly. It will:

1. Copy all IDDD templates (specs, docs, steering, skills, hooks) into your project.
2. Create platform-specific symlinks (`.claude/skills/` or `.agents/skills/`) pointing to the canonical `skills/` originals.
3. Register harness hooks in your platform's configuration file.
4. Initialize the `.iddd/` state directory (commit counter, preview output).

### Options

| Option          | Description                                              |
|-----------------|----------------------------------------------------------|
| `[target-dir]`  | Target directory (defaults to current directory `.`)     |
| `--no-symlink`  | Copy skill files instead of symlinking (useful on Windows) |
| `--platform`    | Force platform: `claude`, `codex`, or `all`              |

### Overwrite Detection

If `CLAUDE.md` already exists in the target directory, `id3` will prompt:

```
"IDDD appears to be already installed. Overwrite? (y/N)"
```

### Post-Install Output

```
┌── IDDD installed ─────────────────────────────────────────┐
│                                                           │
│  Next steps:                                              │
│                                                           │
│    1. Fill in steering/product.md                         │
│    2. Run /id3-identify-entities to start                  │
│    3. Customize steering/data-conventions.md              │
│                                                           │
│  Skills:                                                  │
│    ├── id3-identify-entities   (Phase 0/1)                │
│    ├── id3-design-information  (Phase 2)                  │
│    ├── id3-design-ui           (Phase 2.5)                │
│    ├── id3-spawn-team          (Phase 3-5)                │
│    ├── id3-info-audit          (Audit)                    │
│    └── id3-preview             (Visual Preview)           │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## Directory Structure After Installation

After running `npx id3@latest`, your project gains the following structure:

```
your-project/
│
│   ===== Shared (all platforms) =====
│
├── skills/                          Skill originals (single source of truth)
│   ├── id3-identify-entities/       Phase 0/1: Entity identification
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   Reverse-extract from existing code
│   │       └── phase1-greenfield.md   Structured interview for new projects
│   ├── id3-design-information/      Phase 2: Information structuring
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── phase2-procedure.md    Refinement procedure
│   ├── id3-design-ui/               Phase 2.5: UI design & implementation
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── step1-structure-derivation.md
│   │       ├── step2-visual-contract.md
│   │       ├── step3-gate-and-mockup.md
│   │       └── step4-implementation.md
│   ├── id3-spawn-team/              Dispatch multi-agent implementation
│   ├── id3-info-audit/              Entropy audit (drift detection)
│   └── id3-preview/                 Visual preview of information model
│
├── specs/                           Information model artifacts
│   ├── entity-catalog.md              Entity inventory + summary table
│   ├── data-model.md                  Mermaid ERD + design decisions
│   ├── ui-inventory.md                Screen inventory + mapping matrix
│   ├── ui-structure.md                Screen inventory + navigation (Phase 2.5)
│   └── ui-design-contract.md          Design tokens + component mapping (Phase 2.5)
│
├── docs/                            Supporting documentation
│   ├── business-rules.md              BR-xxx indexed business rules
│   ├── domain-glossary.md             Term / English / definition / notes
│   ├── info-debt.md                   Inconsistency tracker
│   └── model-changelog.md            Keep-a-Changelog format
│
├── steering/                        Project-level conventions
│   ├── product.md                     Product vision & scope (user-authored)
│   └── data-conventions.md            PK strategy, naming, timestamps, etc.
│
├── hooks/                           Harness hook scripts (built JS bundles)
│   ├── iddd-schema-drift.js           Schema drift detection
│   ├── iddd-rule-check.js             Business rule tracking
│   ├── iddd-auto-audit.js             Automatic entropy audit
│   ├── pre-commit                     Git hook (schema-drift + rule-check)
│   └── post-commit                    Git hook (auto-audit)
│
├── .iddd/                           IDDD internal state
│   ├── commit-count                   Auto-audit interval counter
│   └── preview/                       Generated preview HTML
│
│   ===== Platform: Claude Code =====
│
├── CLAUDE.md                        Lead agent context document
├── .claude/
│   ├── settings.local.json            Hook registration (injected by init)
│   ├── skills/ -> skills/             Symlinks to skills/ originals
│   └── hooks/
│       └── hook-config.json           IDDD hook settings
│
│   ===== Platform: OpenAI Codex =====
│
├── AGENTS.md                        Cross-platform agent instructions
├── .agents/
│   └── skills/ -> skills/             Symlinks to skills/ originals
└── .codex/
    └── hooks.json                     Codex hook configuration
```

### Skill File Sharing Strategy

Skill content is maintained in a single canonical location (`skills/`). Platform-specific paths (`.claude/skills/`, `.agents/skills/`) are symlinks created dynamically by the `init` CLI. This ensures a single point of maintenance across all platforms. On Windows, use `--no-symlink` to create copies instead.

---

## Workflow

```
╔══════════════════════════════════════════════════════════════════════════╗
║                          IDDD WORKFLOW OVERVIEW                          ║
╚══════════════════════════════════════════════════════════════════════════╝

  ┌──────────────┐                  ┌──────────────┐
  │              │<--- dialog ----->│              │
  │     User     │                  │  Lead Agent  │
  │              │                  │              │
  └──────────────┘                  └──────┬───────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        │                                     │
                        v                                     v
             ┌────────────────────┐          ┌────────────────────┐
             │  Existing code?    │          │  No existing code? │
             └─────────┬──────────┘          └─────────┬──────────┘
                       │                               │
                       v                               v
  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
  │  Phase 0: Reverse-Extract        │  │  Phase 1: Structured Interview   │
  │                                  │  │                                  │
  │  - Scan ORM / schema files       │  │  "What information does          │
  │  - Extract entities              │  │   your domain manage?"           │
  │  - Extract relationships         │  │  - Identify core entities        │
  │  - Verification Interview        │  │  - Discover relationships        │
  └────────────────┬─────────────────┘  └────────────────┬─────────────────┘
                   │                                     │
                   v                                     v
          ┌─────────────────────────────────────────────────────┐
          │              Entity Catalog Produced                │
          └─────────────────────────┬───────────────────────────┘
                                    │
                                    v
  ┌────────────────────────────────────────────────────────────────────┐
  │  Phase 2: Information Design                                       │
  │                                                                    │
  │  - Conceptual --> Logical model                                    │
  │  - Derive business rules (BR-xxx)                                  │
  │  - Register hooks + version headers                                │
  └─────────────────────────────────┬──────────────────────────────────┘
                                    │
                                    v
  ┌────────────────────────────────────────────────────────────────────┐
  │  Phase 2.5: UI Design (id3-design-ui)                              │
  │                                                                    │
  │  - Entity --> Screen auto-derivation                               │
  │  - Visual design contract (tokens, components)                     │
  │  - 7-Pillar gate + 3-level mockup preview                         │
  │  - Agent Teams implementation + post-audit                        │
  └─────────────────────────────────┬──────────────────────────────────┘
                                    │
                                    v
          ┌─────────────────────────────────────────────────────┐
          │              /id3-spawn-team                        │
          └─────────────────────────┬───────────────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     v                             v
  ┌────────────────────────────────┐  ┌────────────────────────────────┐
  │  Claude Code: Agent Teams      │  │  Codex: Agents SDK             │
  │                                │  │                                │
  │  ┌────────┐ ┌──────┐ ┌────┐    │  │  ┌──────────────────────────┐  │
  │  │  spec  │ │ impl │ │ qa │    │  │  │  Handoff Pattern         │  │
  │  └───┬────┘ └──┬───┘ └─┬──┘    │  │  │  via MCP Server          │  │
  │      │         │       │       │  │  └──────────────────────────┘  │
  │      └── messaging ────┘       │  │                                │
  │         (peer-to-peer)         │  │  spec -> impl -> qa            │
  │                                │  │  (sequential handoff)          │
  └────────────────────────────────┘  └────────────────────────────────┘
```

### Phase Walkthrough

**Phase 0/1 -- Entity Identification:**
Open your AI coding agent and run `/id3-identify-entities`. The agent automatically detects whether you have an existing codebase (brownfield) or are starting fresh (greenfield), then runs the appropriate identification flow.

**Phase 2 -- Information Design:**
Run `/id3-design-information`. The agent refines the conceptual model into a logical model, derives business rules, and sets up version headers and hook configurations.

**Phase 2.5 -- UI Design:**
Run `/id3-design-ui`. The agent derives screen structure from the entity catalog, establishes a visual design contract with design tokens, runs a 7-pillar quality gate with interactive mockup preview, and then spawns Agent Teams for parallel screen implementation with post-audit.

**Phase 3-5 -- Implementation via Agent Teams:**
Run `/id3-spawn-team`. The agent reads the finalized information model and spawns a team of specialized agents (spec-generator, implementer, qa-reviewer) to implement the system in parallel.

---

## Skills

### id3-identify-entities (Phase 0/1)

The entry point of the IDDD workflow. This skill **automatically branches** between brownfield and greenfield paths.

**Trigger keywords:** `identify entities`, `information analysis`, `domain analysis`, `new project`, `entity identification`

**Auto-detection logic:** The skill scans the project root for ORM/schema files (Prisma, Drizzle, Django models, TypeORM entities, SQL migrations, Sequelize configs). If found, it enters Phase 0; otherwise, Phase 1.

#### Phase 0: Brownfield -- Reverse-Extract Information Model

For existing codebases, the agent systematically extracts the implicit information model from four layers:

| Layer | Source           | What is examined                                       | Reliability |
|-------|------------------|--------------------------------------------------------|-------------|
| L1    | DB Schema        | Tables, columns, FK, indexes, constraints              | Highest     |
| L2    | ORM / Models     | Virtual fields, derived attributes, soft delete, state | High        |
| L3    | API Contracts    | Endpoints, DTOs, validation logic                      | Medium      |
| L4    | Frontend         | Routes, components, form fields                        | Reference   |

The L4 investigation is thorough: it scans file-based routing (Next.js `app/`, `pages/`), React Router, Vue Router, etc. to build a complete UI inventory (`specs/ui-inventory.md`) with screen-entity mapping matrices.

Findings are classified as **match** (consistent across layers), **mismatch** (logged in `docs/info-debt.md`), or **implicit** (hidden in code logic, surfaced as explicit business rules).

After extraction, a **verification interview** confirms accuracy with the user.

**Artifacts produced:** `specs/entity-catalog.md`, `specs/data-model.md`, `specs/ui-inventory.md`, `docs/business-rules.md`, `docs/info-debt.md`

#### Phase 1: Greenfield -- Structured Interview

For new projects, the agent conducts a structured interview to discover domain information:

1. **Information identification** -- "What core 'things' (nouns) does this system manage?"
2. **Relationship discovery** -- "How are these things related? One-to-many or many-to-many?"
3. **Rule discovery** -- "What rules must be enforced? Any state transitions?"
4. **Silverston universal pattern checklist** -- The agent cross-references discovered entities against proven patterns: Party, Product/Service, Order/Transaction, Classification, Status/Lifecycle, Hierarchy, Contact Mechanism, Document/Content.

**Artifacts produced:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-information (Phase 2)

Refines the conceptual model into a **logical model**. Business rules, validity constraints, and derivation rules are automatically derived from the information model.

**Trigger keywords:** `design information`, `refine model`, `logical model`, `schema design`, `information structuring`

**Prerequisite:** `specs/entity-catalog.md` must exist with at least 2 identified entities.

**Procedure:**

1. **Attribute refinement** -- Assign concrete data types (UUID, TEXT, INTEGER, TIMESTAMP, JSONB, etc.), NOT NULL / DEFAULT / UNIQUE constraints, and index requirements.
2. **Relationship concretization** -- Determine FK placement, delete/update rules (CASCADE, SET NULL, RESTRICT), and identify junction tables for many-to-many relationships.
3. **Automatic business rule derivation:**
   - NOT NULL constraint --> "This field is required" (BR-xxx)
   - UNIQUE constraint --> "No duplicates allowed" (BR-xxx)
   - FK + CASCADE --> "Deleting parent also deletes children" (BR-xxx)
   - State transitions --> "Allowed transition paths" (BR-xxx)
   - Derived attributes --> "Computation rule" (BR-xxx)
4. **Design decision questions** -- The agent asks the user about large-data storage strategy, soft delete scope, multi-tenancy, audit trail needs, etc.
5. **Artifact finalization** -- Update all spec files with version headers and hook configurations.

**Artifacts updated:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-ui (Phase 2.5)

Derives UI structure and visual design from the information model, then implements screens using Agent Teams.

**Trigger keywords:** `design ui`, `ui design`, `screen design`, `phase 2.5`, `ui structure`

**Prerequisite:** Phase 2 complete (`entity-catalog.md` version >= `"1.0"`).

**4-Step Pipeline:**

1. **UI Structure Derivation** -- Automatically maps entities to screens using 9 derivation rules (entity -> list/detail/form/dashboard). Maps attributes to widgets using 12 type-based rules. Applies "output first, input second" principle.
2. **Visual Design Contract** -- Detects existing frontend framework (React, Vue, Svelte, etc.) and UI library. Establishes 5 design token areas: spacing, typography, color, copywriting, component registry.
3. **Pre-Implementation Gate** -- Runs 7-Pillar verification (structure completeness, spacing, typography, color, copywriting, component registry, traceability). Generates 3-level HTML mockups (wireframe, styled, interactive) with sample data.
4. **Implementation + Post-Audit** -- Spawns Agent Teams for parallel screen implementation. Post-implementation visual audit scores each pillar 1-4 and derives top 3 fixes.

**Artifacts:** `specs/ui-structure.md`, `specs/ui-design-contract.md`, `.iddd/preview/mockup-*.html`, `.iddd/preview/ui-audit.html`

---

### id3-spawn-team (Phase 3-5)

Spawns a team of specialized agents to implement the system based on the finalized information model.

**Prerequisite:** `specs/entity-catalog.md` and `specs/data-model.md` must exist with Phase 2 complete.

#### Claude Code: Agent Teams

Three team members are spawned, each with independent context windows and independent Git worktrees:

| Team Member      | Role                                                          |
|------------------|---------------------------------------------------------------|
| spec-generator   | Transforms the information model into requirements.md and api-contracts.md |
| implementer      | Builds code from specs, one entity per atomic commit          |
| qa-reviewer      | Verifies implementation against the information model; sends direct messages to implementer on failure |

**Task generation rules:**
- Entity catalog is read to create one task per entity (model + migration + API + validation + tests).
- FK dependencies from the data model determine the dependency graph.
- Independent entities run in parallel; dependent entities wait for their parents.

#### OpenAI Codex: Agents SDK + Handoff Pattern

On Codex, multi-agent work uses the Agents SDK handoff pattern. Codex is started as an MCP Server (`codex --mcp-server`), and a Project Manager agent reads the entity catalog to distribute tasks across the same three roles (spec-generator, implementer, qa-reviewer) via handoffs.

---

### id3-info-audit

Audits the codebase against the information model to detect drift and entropy.

**Trigger keywords:** `info audit`, `information audit`, `model audit`, `drift check`

**Procedure:**

1. Read the entity list from `specs/entity-catalog.md`.
2. Scan the codebase for:
   - Unimplemented entities / undefined models
   - Business rules in `docs/business-rules.md` not reflected in code
   - Data type / constraint mismatches
3. Check UI consistency against `specs/ui-structure.md` and `specs/ui-design-contract.md`:
   - Unimplemented screens / undefined screens
   - Form field vs. attribute mapping mismatches
   - Missing navigation paths
4. Update version headers (`last_verified`, `audit_status`).
5. Check hook bypass history (`.iddd/skip-history.log`).
6. Output a per-entity status report with visual indicators.

**Visual output:** The audit results are rendered as an interactive HTML dashboard in `.iddd/preview/audit-{date}.html`.

---

### id3-preview

Starts a lightweight local HTTP server to view the information model and audit results in a browser.

**Trigger keywords:** `preview`, `show erd`, `show model`, `visual preview`

The server uses `listen(0)` (OS-assigned port) and serves:
- **ERD Preview** -- Interactive Mermaid ERD with entity click-through to catalog details
- **UI Mockup** -- Wireframe layouts derived from `specs/ui-structure.md` and `specs/ui-design-contract.md`
- **Audit Dashboard** -- Per-entity status cards with business rule coverage

All HTML files persist in `.iddd/preview/` and can be opened directly in a browser even without the server.

---

## Harness Hook System

IDDD enforces information-first discipline through automated hooks. The philosophy is not "please follow the process" but **"the commit is blocked if you don't."**

### Hook Overview

| Hook           | Trigger          | Action                                              | Severity   |
|----------------|------------------|-----------------------------------------------------|------------|
| schema-drift   | pre-commit       | Verifies schema changes match entity-catalog.md     | **BLOCK** (commit rejected) |
| rule-check     | pre-commit       | Checks new validation logic against business-rules.md | **WARN** (commit allowed, message shown) |
| auto-audit     | post-commit      | Runs info-audit every N commits                     | **INFO** (report generated) |

### schema-drift (BLOCK)

When you modify schema-related files (Prisma, Drizzle, Django models, TypeORM entities, SQL migrations, etc.), the hook checks whether `specs/entity-catalog.md` has been updated accordingly. If not, the commit is **rejected**. The information model must always be updated *before* the code.

**Monitored file patterns** (configurable):
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check (WARN)

When you add or modify validation logic (Zod, Yup, Joi, Pydantic, etc.), the hook checks for a corresponding `BR-xxx` entry in `docs/business-rules.md`. If missing, a warning is emitted. The commit proceeds, but the missing rule is flagged.

**Monitored file patterns** (configurable):
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit (INFO)

After every N commits (default: 10, configurable), the harness automatically runs an info-audit comparing the codebase against the information model. The commit counter is stored in `.iddd/commit-count`. Results are written to `.iddd/preview/audit-{date}.html`.

### Hook Configuration

All hook settings live in `.claude/hooks/hook-config.json` (Claude Code) or `.codex/hooks.json` (Codex).

```json
{
  "enabled": true,
  "hooks": {
    "pre-commit": {
      "schema-drift": {
        "enabled": true,
        "severity": "block",
        "monitored_patterns": [
          "prisma/schema.prisma",
          "drizzle/**/*.ts",
          "**/migrations/*.sql",
          "**/models.py",
          "**/entities/*.ts",
          "**/entities/*.java"
        ]
      },
      "rule-check": {
        "enabled": true,
        "severity": "warn",
        "validation_patterns": [
          "*.schema.ts",
          "*.validator.*",
          "**/validators/**"
        ]
      }
    },
    "post-commit": {
      "auto-audit": {
        "enabled": true,
        "interval_commits": 10
      }
    }
  }
}
```

To disable all IDDD hooks, set `"enabled": false` at the top level. To disable a single hook, set its `"enabled"` to `false`. To change the auto-audit frequency, adjust `"interval_commits"`.

### Hook Bypass

Set `IDDD_SKIP_HOOKS=1` to temporarily skip all hooks. Bypasses are logged to `.iddd/skip-history.log` and reviewed during audits.

---

## Entropy Management

Over time, information models drift from code. IDDD fights entropy through three mechanisms:

### Version Headers

`specs/entity-catalog.md` and `specs/data-model.md` contain YAML frontmatter that tracks model state:

```yaml
---
version: "1.0"
last_verified: "2026-04-05"
phase: "Phase 2 Complete"
entity_count: 12
rule_count: 19
audit_status: "clean"
---
```

**Rules:**
- `version` is incremented on each phase completion (Phase 1: `"0.1"`, Phase 2: `"1.0"`, subsequent: `"1.1"`, `"1.2"`, ...).
- `last_verified` is updated whenever the model is audited or verified.
- If `last_verified` is **more than 7 days old**, the agent will prompt you to run `/id3-info-audit` before proceeding with new work. Stale models lead to drift.

### Change Log

All model changes are recorded in `docs/model-changelog.md` using [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [1.0] -- 2026-04-05
### Phase 2 Complete
- 12 entities finalized in logical model
- 19 business rules derived
- Design decisions: D-01 (S3 separation), D-02 (multi-tenant reservation), D-03 (soft delete scope)
- UI proposals: 6 screens generated
```

### Automatic Audit

The `auto-audit` hook (post-commit) runs a full information audit every N commits, catching drift before it accumulates.

---

## Customization Guide

IDDD is designed to be adapted to your project's conventions. Here is what to customize and where:

| What to customize                              | File to edit                       |
|------------------------------------------------|------------------------------------|
| Product vision & scope                         | `steering/product.md`              |
| Naming conventions, PK strategy, timestamps, soft-delete policy, ENUM vs reference tables | `steering/data-conventions.md` |
| Entity definitions                             | `specs/entity-catalog.md`          |
| Data model (ERD)                               | `specs/data-model.md`              |
| Business rules                                 | `docs/business-rules.md`           |
| Domain glossary                                | `docs/domain-glossary.md`          |
| UI screen inventory                            | `specs/ui-inventory.md`            |
| UI structure (screen derivation)               | `specs/ui-structure.md`            |
| UI design contract (tokens, components)        | `specs/ui-design-contract.md`      |
| Hook behavior (enable/disable, severity)       | `.claude/hooks/hook-config.json`   |
| Monitored file patterns for hooks              | `.claude/hooks/hook-config.json`   |
| Auto-audit commit interval                     | `.claude/hooks/hook-config.json`   |
| Codex hook configuration                       | `.codex/hooks.json`                |

**Tip:** All `specs/` and `docs/` files use YAML frontmatter with version headers. The IDDD harness tracks these versions to detect entropy drift. Always update the version header when you modify a spec file.

---

## Usage Examples

### Example 1: Starting a New Project (Greenfield)

```
$ mkdir my-saas && cd my-saas && git init
$ npx id3@latest

  IDDD installed. Next: fill in steering/product.md

$ claude
> /id3-identify-entities

  Agent: "What core 'things' does your system manage?"
  You: "Users, Organizations, Subscriptions, Invoices, and Features."
  Agent: "How are Users related to Organizations?"
  You: "Many-to-many through a Membership entity with a role attribute."
  ...

  Entity catalog produced: specs/entity-catalog.md (5 entities, 7 relationships)

> /id3-design-information

  Agent refines attributes, derives 14 business rules.
  specs/entity-catalog.md updated (version: 1.0)
  docs/business-rules.md updated (BR-001 through BR-014)

> /id3-design-ui

  Step 1: Deriving UI structure from 5 entities... 8 screens mapped
  Step 2: Design contract established (React + Tailwind detected)
  Step 3: 7-Pillar gate passed. Mockup preview: http://localhost:52341
  Step 4: Spawning Agent Teams for screen implementation...
  Post-audit: all 7 pillars scored 3+/4

  specs/ui-structure.md generated
  specs/ui-design-contract.md generated

> /id3-spawn-team

  Spawning Agent Teams:
  - spec-generator: generating requirements.md, api-contracts.md
  - implementer: building User -> Organization -> Membership -> ...
  - qa-reviewer: verifying against information model
```

### Example 2: Applying to an Existing Project (Brownfield)

```
$ cd existing-django-project
$ npx id3@latest

  Detected: Django models (models.py), PostgreSQL migrations
  IDDD installed.

$ claude
> /id3-identify-entities

  Phase 0 (Brownfield) activated.
  Scanning L1 (DB schema)... 23 tables found
  Scanning L2 (Django models)... 19 models found
  Scanning L3 (API contracts)... DRF serializers analyzed
  Scanning L4 (Frontend)... React routes mapped

  Discrepancies found:
  - 4 tables have no corresponding Django model (logged in info-debt.md)
  - 3 implicit business rules surfaced from view logic

  Agent: "Does this information model accurately reflect your codebase?"
  You: "Yes, but the legacy_audit table is deprecated -- remove it."

  Entity catalog produced: 19 entities, 11 info-debt items

> /id3-design-information

  Refining existing model...
  New business rules derived from Django validators: BR-015 through BR-023

> /id3-design-ui

  Step 1: Deriving UI structure... comparing with existing ui-inventory.md
  Change summary: 2 new screens proposed, 3 existing screens updated
  Step 2-4: Design contract, gate, and implementation...
```

---

## Intellectual Lineage

IDDD synthesizes ideas from several intellectual traditions:

- **Peter Chen's ER Model (1976)** -- "The real world consists of entities and relationships." The foundational insight that information structure precedes application logic.
- **Len Silverston's Universal Data Models** -- Reusable information patterns (Party, Product, Order, Hierarchy) that serve as a checklist against which discovered entities are validated.
- **Eric Evans' Domain-Driven Design (2003)** -- Bounded Context, Ubiquitous Language, and Aggregate patterns. IDDD inherits the emphasis on domain language and explicit boundaries.
- **Sophia Prater's OOUX (Object-Oriented UX)** -- "Design objects before interactions." The ORCA framework (Objects, Relationships, CTAs, Attributes) directly informs IDDD's output-first UI derivation.
- **Jamie Lord's "Data First, Code Second" (2024)** -- "Fold knowledge into data." Applying the Unix Rule of Representation to modern software development.
- **Mitchell Hashimoto's Harness Engineering (2026)** -- `Agent = Model + Harness`. The insight that AI agents need architectural constraints, context engineering, and entropy management to remain effective over time. IDDD's hook system, version headers, and auto-audit are direct applications of harness engineering principles.

**Core insight:** *When the logical model is complete, 80% of application behavior is already defined -- before any technology choice is made. And that information model itself is the best harness for AI agents.*

---

## License

MIT

---

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│    "What information exists?" -- always the first question.      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

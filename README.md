<div align="center">

[![npm version](https://img.shields.io/npm/v/id3-cli.svg)](https://www.npmjs.com/package/id3-cli)
[![license](https://img.shields.io/npm/l/id3-cli.svg)](https://github.com/bruce-jsh/iddd/blob/master/LICENSE)

[한국어](https://github.com/bruce-jsh/iddd/blob/master/README.ko-KR.md) · **English** · [简体中文](https://github.com/bruce-jsh/iddd/blob/master/README.zh-CN.md) · [日本語](https://github.com/bruce-jsh/iddd/blob/master/README.ja-JP.md) · [Türkçe](https://github.com/bruce-jsh/iddd/blob/master/README.tr-TR.md)

</div>

```
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                        ║
║    ██╗██████╗ ██████╗ ██████╗                                                          ║
║    ██║██╔══██╗██╔══██╗██╔══██╗     Information Design-Driven Development               ║
║    ██║██║  ██║██║  ██║██║  ██║                                                         ║
║    ██║██║  ██║██║  ██║██║  ██║     "What information exists?"                          ║
║    ██║██████╔╝██████╔╝██████╔╝      -- always the first question.                      ║
║    ╚═╝╚═════╝ ╚═════╝ ╚═════╝                                    v1.0.1                ║
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

## Quick Start

```bash
npm i -g id3-cli
```

Run `/id3-start` in your project. It automatically detects the IDDD installation status and guides you to the next command along with a progress dashboard.

---

**Start with "What information exists?", not "What features should we build?"**

IDDD is a development methodology and AI agent skill package that places the **information model** at the center of all software development. By building a rigorous Entity catalog, data model, business rules, and domain glossary *before* any technology choices are made, IDDD ensures that 80% of application behavior is already defined at the logical model stage. The information model then becomes the generative center from which requirements, API contracts, screen designs, and validation rules are systematically derived.

This package installs IDDD as a set of AI agent skills, Harness Hooks, and document templates, enabling coding agents to enforce information-first principles throughout the entire development lifecycle.

---

## What Is IDDD?

Most software projects start with the question *"What features should we build?"* and jump straight into implementation. IDDD reverses this. It starts with **"What information exists in this domain?"** and treats the information model not as one section of a specification, but as the **single source of truth** from which all other development artifacts are derived.

### Core Principles

1. **The information model is the generative center.** All code, APIs, UIs, and tests are derived from the Entity catalog and data model. If code diverges from the specification, the specification takes precedence.
2. **Entity-first identification.** Entities must be identified and documented before writing code. New features start with "What Entities are involved?" rather than "What endpoints do we need?"
3. **Data model traceability.** Every column, constraint, and Relationship in the codebase must be traceable to an entry in the Entity catalog. Untracked schema elements are considered drift.
4. **Output-first design.** Before designing inputs (forms, APIs), design what the user *sees* first (dashboards, reports, lists). The output image drives the information model.
5. **Business rules are explicit.** All validations, constraints, and derivation rules are registered with BR-xxx identifiers. Rules that exist only in code are considered debt.

### Mapping Three-Level Data Modeling to Software Development

IDDD directly maps the traditional three-level data modeling process to software development phases:

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

| Information Model Element       | Derived Artifacts                                        |
|---------------------------------|----------------------------------------------------------|
| Entity Identification           | Requirements scope, user stories                         |
| Relationship & Cardinality      | API endpoint structure, navigation                       |
| Attribute & Data Type           | Form fields, validation rules, DTOs                      |
| Constraints                     | Input validation, type definitions                       |
| Derived Attributes              | Business logic, calculation rules                        |
| State Transitions               | Workflows, state management                              |
| Aggregation / Relationship Rules| Transaction boundaries, consistency rules                |

**Once the logical model is complete, 80% of application behavior is already defined before any technology choices are made.**

---

## Supported Platforms

| Platform     | Agent System             | Multi-Agent Strategy                                 |
|--------------|--------------------------|------------------------------------------------------|
| Claude Code  | Claude Agent Teams       | Peer messaging, independent worktrees                |
| OpenAI Codex | Codex Agents SDK         | Handoff pattern via MCP Server                       |

---

## Prerequisites

| Requirement    | Details                                              |
|----------------|------------------------------------------------------|
| Node.js        | **18+** (with npm or a compatible package manager)   |
| Claude Code    | **Claude Max** membership + Agent Teams enabled      |
| OpenAI Codex   | **ChatGPT Plus** or higher (Pro/Business/Enterprise) |

Node.js 18+ and npm are required. AI platform subscriptions are required depending on which platform you use.

---

## Installation

```bash
npm i -g id3-cli
```

Global installation registers two global skills (`/id3-start`, `/id3-clear`) that are available across all projects. When you run `/id3-start` for the first time in a project, it automatically detects whether IDDD is installed and guides you through the next steps.

### Options

| Option          | Description                                              |
|-----------------|----------------------------------------------------------|
| `[target-dir]`  | Target directory (default: current directory `.`)        |
| `--no-symlink`  | Copy skill files instead of symlinking (useful on Windows) |
| `--platform`    | Force platform: `claude`, `codex`, or `all`              |

### Overwrite Detection

If `CLAUDE.md` already exists in the target directory, `id3-cli` will prompt:

```
"IDDD appears to be already installed. Overwrite? (y/N)"
```

### Post-Installation Output

```
┌── IDDD installed ─────────────────────────────────────────┐
│                                                           │
│  Next steps:                                              │
│                                                           │
│    1. Fill in steering/product.md                         │
│    2. Run /id3-start to begin                             │
│    3. Customize steering/data-conventions.md              │
│                                                           │
│  Global Skills (via npm i -g):                            │
│    ├── id3-start               (Entry Point)              │
│    └── id3-clear               (Project Reset)            │
│                                                           │
│  Project Skills (per-project):                            │
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

## Post-Installation Directory Structure

After running `npm i -g id3-cli`, the following global skills are installed system-wide:

```
~/.claude/skills-global/              Global skills (installed via npm i -g)
  ├── id3-start/                      IDDD entry point
  │   ├── SKILL.md
  │   └── references/
  │       ├── phase-guide.md            Phase routing taxonomy
  │       └── dashboard-template.md     Progress dashboard format
  └── id3-clear/                      Project reset
      └── SKILL.md
```

After running `/id3-start` (or `id3-cli init .`), the project will have the following structure:

```
your-project/
│
│   ===== Common (all platforms) =====
│
├── skills/                          Skill source (single source of truth)
│   ├── id3-identify-entities/       Phase 0/1: Entity identification
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   Reverse-extraction from existing code
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
│   ├── id3-spawn-team/              Multi-agent implementation dispatch
│   ├── id3-info-audit/              Entropy audit (drift detection)
│   └── id3-preview/                 Information model visual preview
│
├── specs/                           Information model artifacts
│   ├── entity-catalog.md              Entity list + summary table
│   ├── data-model.md                  Mermaid ERD + design decisions
│   ├── ui-inventory.md                Screen list + mapping matrix
│   ├── ui-structure.md                Screen list + navigation (Phase 2.5)
│   └── ui-design-contract.md          Design tokens + component mapping (Phase 2.5)
│
├── docs/                            Supporting documents
│   ├── business-rules.md              BR-xxx indexed business rules
│   ├── domain-glossary.md             Term / English name / definition / notes
│   ├── info-debt.md                   Discrepancy tracker
│   └── model-changelog.md            Keep a Changelog format
│
├── steering/                        Project-level conventions
│   ├── product.md                     Product vision & scope (user-authored)
│   └── data-conventions.md            PK strategy, naming, timestamps, etc.
│
├── hooks/                           Harness Hook scripts (built JS bundles)
│   ├── iddd-schema-drift.js           Schema drift detection
│   ├── iddd-rule-check.js             Business rule tracking
│   ├── iddd-auto-audit.js             Automatic entropy audit
│   ├── pre-commit                     Git Hook (schema-drift + rule-check)
│   └── post-commit                    Git Hook (auto-audit)
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
│   ├── skills/ -> skills/             Symlink to skills/ source
│   └── hooks/
│       └── hook-config.json           IDDD Hook configuration
│
│   ===== Platform: OpenAI Codex =====
│
├── AGENTS.md                        Cross-platform agent directives
├── .agents/
│   └── skills/ -> skills/             Symlink to skills/ source
└── .codex/
    └── hooks.json                     Codex Hook configuration
```

### Skill File Sharing Strategy

Skill content is maintained in a single canonical location (`skills/`). Platform-specific paths (`.claude/skills/`, `.agents/skills/`) are symlinks dynamically created by the `init` CLI. This ensures a single maintenance point across all platforms. On Windows, use `--no-symlink` to create copies instead.

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

### Phase-by-Phase Guide

> **Tip:** Run `/id3-start` first to see the current progress status and next steps. After that, use the individual commands below directly.

**Phase 0/1: Entity Identification:**
Run `/id3-identify-entities`. The agent automatically detects whether an existing codebase is present (brownfield) or you are starting from scratch (greenfield), then executes the appropriate identification flow.

**Phase 2: Information Design:**
Run `/id3-design-information`. The agent refines the conceptual model into a logical model, derives business rules, and configures version headers and Hook settings.

**Phase 2.5: UI Design:**
Run `/id3-design-ui`. The agent derives screen structures from the Entity catalog, establishes a visual design contract with design tokens, runs the 7-Pillar quality gate with interactive mockup previews, then spawns Agent Teams to implement screens in parallel and performs a post-audit.

**Phase 3-5: Implementation via Agent Teams:**
Run `/id3-spawn-team`. The agent reads the finalized information model and spawns specialized agent teams (spec-generator, implementer, qa-reviewer) to implement the system in parallel.

---

## Skills

### id3-start (Global - Entry Point)

The entry point for IDDD. Run it once to get project setup, a progress dashboard, and next-step guidance. Pass a request along with it to be routed to the correct Phase skill. After that, use the individual commands you are guided to directly.

**Features:**

1. **Auto-setup:** Detects whether IDDD is installed in the current project (`specs/entity-catalog.md` + `CLAUDE.md`). If not installed, automatically runs `id3-cli init .` to set up IDDD.
2. **Progress dashboard:** Displays a Phase pipeline showing the completion status of each Phase (Phase 0/1, Phase 2, Phase 2.5, Phase 3-5) with visual symbols (completed checkmark, in-progress diamond, not-started circle) and a progress bar.
3. **Intent routing:** When a request is passed along, routes it to the correct Phase skill (`/id3-identify-entities`, `/id3-design-information`, `/id3-design-ui`, `/id3-spawn-team`, `/id3-info-audit`, or `/id3-preview`).
4. **Ambiguous request handling:** When a request could match multiple Phases (e.g., "add a filter to the list": is it only a UI change or does it require a new data Entity?), asks clarifying questions before routing.
5. **UI fast path:** When the request contains only explicit UI keywords and the data model already exists (version >= 1.0), routes directly to `/id3-design-ui` without Entity questions.
6. **Prerequisite check:** If the prerequisites for the target Phase are not met, warns and suggests the correct starting Phase.

**Usage:**

```
/id3-start                             Display dashboard + next command guidance
```

**Installation:** Installed globally to `~/.claude/skills-global/id3-start/` via `npm i -g id3-cli`.

---

### id3-identify-entities (Phase 0/1)

The entry point for the IDDD workflow. This skill **automatically branches** between brownfield and greenfield paths.

**Auto-detection logic:** The skill scans the project root for ORM/schema files (Prisma, Drizzle, Django models, TypeORM entities, SQL migrations, Sequelize configs). If found, it enters Phase 0; otherwise, it enters Phase 1.

#### Phase 0: Brownfield - Information Model Reverse-Extraction

For existing codebases, the agent systematically extracts the implicit information model from four layers:

| Layer | Source           | What Is Examined                                       | Confidence |
|-------|------------------|--------------------------------------------------------|------------|
| L1    | DB Schema        | Tables, columns, FKs, indexes, constraints             | Highest    |
| L2    | ORM / Models     | Virtual fields, derived Attributes, soft deletes, state| High       |
| L3    | API Contracts    | Endpoints, DTOs, validation logic                      | Medium     |
| L4    | Frontend         | Routes, components, form fields                        | Reference  |

L4 examination is thorough: it scans file-based routing (Next.js `app/`, `pages/`), React Router, Vue Router, etc. to build a complete UI inventory (`specs/ui-inventory.md`) including a screen-Entity mapping matrix.

Findings are classified as **consistent** (coherent across layers), **discrepant** (logged in `docs/info-debt.md`), or **implicit** (hidden in code logic, surfaced as explicit business rules).

After extraction, a **verification interview** confirms accuracy with the user.

**Generated artifacts:** `specs/entity-catalog.md`, `specs/data-model.md`, `specs/ui-inventory.md`, `docs/business-rules.md`, `docs/info-debt.md`

#### Phase 1: Greenfield - Structured Interview

For new projects, the agent conducts a structured interview to discover domain information:

1. **Information identification:** "What are the core 'things' (nouns) that this system manages?"
2. **Relationship discovery:** "How are they related? One-to-many or many-to-many?"
3. **Rule discovery:** "What rules must be enforced? Are there state transitions?"
4. **Silverston universal pattern checklist:** The agent cross-references discovered Entities against proven patterns: Party, Product/Service, Order/Transaction, Classification, Status/Lifecycle, Hierarchy, Contact Mechanism, Document/Content.

**Generated artifacts:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-information (Phase 2)

Refines the conceptual model into a **logical model**. Business rules, validation constraints, and derivation rules are automatically derived from the information model.

**Prerequisites:** At least 2 identified Entities must exist in `specs/entity-catalog.md`.

**Procedure:**

1. **Attribute refinement:** Assigns specific data types (UUID, TEXT, INTEGER, TIMESTAMP, JSONB, etc.), NOT NULL / DEFAULT / UNIQUE constraints, and index requirements.
2. **Relationship specification:** Determines FK placement, delete/update rules (CASCADE, SET NULL, RESTRICT), and identifies junction tables for many-to-many Relationships.
3. **Automatic business rule derivation:**
   - NOT NULL constraint --> "This field is required" (BR-xxx)
   - UNIQUE constraint --> "Duplicates are not allowed" (BR-xxx)
   - FK + CASCADE --> "Deleting the parent also deletes children" (BR-xxx)
   - State transitions --> "Allowed transition paths" (BR-xxx)
   - Derived Attributes --> "Calculation rules" (BR-xxx)
4. **Design decision questions:** The agent asks the user about bulk data storage strategies, soft delete scope, multi-tenancy, audit trail requirements, etc.
5. **Artifact finalization:** Updates all specification files with version headers and Hook configuration.

**Updated artifacts:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-ui (Phase 2.5)

Derives UI structure and visual design from the information model, then implements screens using Agent Teams.

**Prerequisites:** Phase 2 complete (`entity-catalog.md` version >= `"1.0"`).

**4-Step Pipeline:**

1. **UI structure derivation:** Automatically maps Entities to screens using 9 derivation rules (entity -> list/detail/form/dashboard). Maps Attributes to Widgets using 12 type-based rules. Applies the "output first, input second" principle.
2. **Visual design contract:** Detects existing frontend frameworks (React, Vue, Svelte, etc.) and UI libraries. Establishes 5 design token domains (spacing, typography, color, copywriting, component registry).
3. **Pre-implementation gate:** Runs 7-Pillar validation (structural completeness, spacing, typography, color, copywriting, component registry, traceability). Generates 3-level HTML mockups (wireframe, styled, interactive) with sample data.
4. **Implementation + post-audit:** Spawns Agent Teams to implement screens in parallel. After implementation, a visual audit scores each Pillar from 1-4 and identifies the top 3 fixes.

**Artifacts:** `specs/ui-structure.md`, `specs/ui-design-contract.md`, `.iddd/preview/mockup-*.html`, `.iddd/preview/ui-audit.html`

---

### id3-spawn-team (Phase 3-5)

Spawns specialized agent teams to implement the system based on the finalized information model.

**Prerequisites:** `specs/entity-catalog.md` and `specs/data-model.md` must exist and Phase 2 must be complete.

#### Claude Code: Agent Teams

Three team members are spawned, each with an independent context window and independent Git worktree:

| Team Member      | Role                                                          |
|------------------|---------------------------------------------------------------|
| spec-generator   | Converts information model into requirements.md and api-contracts.md |
| implementer      | Builds code from specifications, one atomic commit per Entity |
| qa-reviewer      | Verifies implementation against information model; sends direct messages to implementer on failure |

**Task creation rules:**
- Reads the Entity catalog and creates one task per Entity (model + migration + API + validation + tests).
- FK dependencies in the data model determine the dependency graph.
- Independent Entities run in parallel; dependent Entities wait for their parent.

#### OpenAI Codex: Agents SDK + Handoff Pattern

On Codex, multi-agent work uses the Agents SDK handoff pattern. Codex starts as an MCP Server (`codex --mcp-server`), and a project manager agent reads the Entity catalog to distribute work to the same three roles (spec-generator, implementer, qa-reviewer) via handoffs.

---

### id3-info-audit

Audits the codebase against the information model to detect drift and entropy.

**Procedure:**

1. Reads the Entity list from `specs/entity-catalog.md`.
2. Scans the codebase for:
   - Unimplemented Entities / undefined models
   - Business rules in `docs/business-rules.md` not reflected in code
   - Data type / constraint mismatches
3. Checks UI consistency against `specs/ui-structure.md` and `specs/ui-design-contract.md`:
   - Unimplemented screens / undefined screens
   - Form field vs. Attribute mapping mismatches
   - Missing navigation paths
4. Updates version headers (`last_verified`, `audit_status`).
5. Checks Hook bypass history (`.iddd/skip-history.log`).
6. Outputs a per-Entity status report with visual indicators.

**Visual output:** Audit results are rendered as an interactive HTML dashboard at `.iddd/preview/audit-{date}.html`.

---

### id3-preview

Starts a lightweight local HTTP server so the information model and audit results can be viewed in a browser.

The server uses `listen(0)` (OS-assigned port) and serves:
- **ERD preview:** An interactive Mermaid ERD where clicking an Entity navigates to catalog details
- **UI mockups:** Wireframe layouts derived from `specs/ui-structure.md` and `specs/ui-design-contract.md`
- **Audit dashboard:** Per-Entity status cards with business rule coverage

All HTML files are maintained in `.iddd/preview/` and can be opened directly in a browser without the server.

---

### id3-clear (Global - Project Reset)

Safely removes all files generated by IDDD from the current project, restoring it to the state before IDDD installation.

**Procedure:**

1. **Installation check:** Verifies whether IDDD files exist in the project. If not, reports "No IDDD files found" and aborts.
2. **Deletion target scan:** Identifies which IDDD directories (`specs/`, `docs/`, `steering/`, `hooks/`, `skills/`, `.claude/skills/`, `.claude/hooks/`, `.codex/skills/`, `.agents/skills/`, `.iddd/`) and files (`CLAUDE.md`, `AGENTS.md`) actually exist.
3. **Warning display:** Shows a detailed list of all files and directories to be deleted. Adds special annotations for user-authored files (`steering/product.md`, `steering/data-conventions.md`).
4. **Confirmation required:** Prompts with `[y/N]` (default N). Proceeds only if the user explicitly enters "y" or "yes".
5. **Deletion execution:** Removes only the identified targets. Displays a completion summary with deletion counts.

**Safety rules:**
- Never deletes files outside the known IDDD file list
- Never uses glob patterns like `rm -rf *`
- Never skips the confirmation step
- For selective deletion, use manual file operations

**Installation:** Installed globally to `~/.claude/skills-global/id3-clear/` via `npm i -g id3-cli`.

---

## Harness Hook System

IDDD enforces information-first principles through automated Hooks. The philosophy is not "please follow the process" but rather **"if you don't follow it, the commit is blocked."**

### Hook Overview

| Hook           | Trigger          | Behavior                                            | Severity   |
|----------------|------------------|-----------------------------------------------------|------------|
| schema-drift   | pre-commit       | Verifies schema changes match entity-catalog.md     | **BLOCK** (commit rejected) |
| rule-check     | pre-commit       | Checks new validation logic exists in business-rules.md | **WARN** (commit allowed, message shown) |
| auto-audit     | post-commit      | Runs info-audit every N commits                     | **INFO** (report generated) |

### schema-drift (BLOCK)

When schema-related files (Prisma, Drizzle, Django models, TypeORM entities, SQL migrations, etc.) are modified, the Hook verifies that `specs/entity-catalog.md` has also been updated. If not, the commit is **rejected**. The information model must always be updated *before* the code.

**Monitored file patterns** (configurable):
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check (WARN)

When validation logic (Zod, Yup, Joi, Pydantic, etc.) is added or modified, the Hook checks whether a corresponding `BR-xxx` entry exists in `docs/business-rules.md`. If not, a warning is issued. The commit proceeds, but missing rules are flagged.

**Monitored file patterns** (configurable):
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit (INFO)

Every N commits (default: 10, configurable), the Harness automatically runs an info-audit comparing the codebase against the information model. The commit counter is stored in `.iddd/commit-count`. Results are written to `.iddd/preview/audit-{date}.html`.

### Hook Configuration

All Hook settings are in `.claude/hooks/hook-config.json` (Claude Code) or `.codex/hooks.json` (Codex).

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

To disable all IDDD Hooks, set the top-level `"enabled"` to `false`. To disable an individual Hook, set that Hook's `"enabled"` to `false`. To change the auto-audit frequency, adjust `"interval_commits"`.

### Hook Bypass

Setting `IDDD_SKIP_HOOKS=1` temporarily skips all Hooks. Bypass records are logged in `.iddd/skip-history.log` and reviewed during audits.

---

## Entropy Management

Over time, the information model and code diverge. IDDD combats entropy with three mechanisms:

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
- `version` increments at each Phase completion (Phase 1: `"0.1"`, Phase 2: `"1.0"`, thereafter: `"1.1"`, `"1.2"`, ...).
- `last_verified` is updated whenever the model is audited or verified.
- If `last_verified` is **more than 7 days old**, the agent recommends running `/id3-info-audit` before proceeding with new work. Stale models lead to drift.

### Changelog

All model changes are recorded in `docs/model-changelog.md` using [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [1.0] -- 2026-04-05
### Phase 2 Complete
- 12 entities finalized in logical model
- 19 business rules derived
- Design decisions: D-01 (S3 separation), D-02 (multi-tenant reservation), D-03 (soft delete scope)
- UI proposals: 6 screens generated
```

### Auto-Audit

The `auto-audit` Hook (post-commit) runs a full information audit every N commits, catching drift before it accumulates.

---

## Customization Guide

IDDD is designed to adapt to your project's conventions. Here are the customization options and the files to edit:

| Customization Item                                           | File to Edit                         |
|--------------------------------------------------------------|--------------------------------------|
| Product vision & scope                                       | `steering/product.md`                |
| Naming conventions, PK strategy, timestamps, soft delete policy, ENUM vs reference tables | `steering/data-conventions.md` |
| Entity definitions                                           | `specs/entity-catalog.md`            |
| Data model (ERD)                                             | `specs/data-model.md`                |
| Business rules                                               | `docs/business-rules.md`             |
| Domain glossary                                              | `docs/domain-glossary.md`            |
| UI screen inventory                                          | `specs/ui-inventory.md`              |
| UI structure (screen derivation)                             | `specs/ui-structure.md`              |
| UI design contract (tokens, components)                      | `specs/ui-design-contract.md`        |
| Hook behavior (enable/disable, severity)                     | `.claude/hooks/hook-config.json`     |
| Hook monitored file patterns                                 | `.claude/hooks/hook-config.json`     |
| Auto-audit commit interval                                   | `.claude/hooks/hook-config.json`     |
| Codex Hook configuration                                     | `.codex/hooks.json`                  |

**Tip:** All `specs/` and `docs/` files use YAML frontmatter with version headers. The IDDD Harness tracks these versions to detect entropy drift. Always update the version header when modifying specification files.

---

## Usage Examples

### Example 1: Starting a New Project (Greenfield)

```
$ npm i -g id3-cli
$ mkdir my-saas && cd my-saas && git init
$ claude
> /id3-start Identify the Entities for a SaaS domain

  ╔════════════════════════════════════════════════════════════════╗
  ║  Welcome to IDDD -- Information Design-Driven Development.     ║
  ║  Your information model is your harness.                       ║
  ╚════════════════════════════════════════════════════════════════╝

  IDDD is not set up in this project. Setting up now...
  IDDD initialized. Here is your project dashboard:

  (Dashboard shows all Phases as ○ -- not started)

  Routing to /id3-identify-entities -- identifying domain Entities through a structured interview.
  Artifacts generated by this Phase: specs/entity-catalog.md, specs/data-model.md, docs/business-rules.md

  Agent: "What are the core 'things' that this system manages?"
  You: "Users, Organizations, Subscriptions, Invoices, Features"
  Agent: "How are Users and Organizations related?"
  You: "Many-to-many through a Membership Entity with a role Attribute."
  ...

  Entity catalog produced: specs/entity-catalog.md (5 entities, 7 relationships)

> /id3-design-information

  Refining the conceptual model into a logical model.

  Agent refines attributes, derives 14 business rules.
  specs/entity-catalog.md updated (version: 1.0)
  docs/business-rules.md updated (BR-001 through BR-014)

> /id3-design-ui

  Deriving UI from the information model and implementing it.

  Step 1: Deriving UI structure from 5 entities... 8 screens mapped
  Step 2: Design contract established (React + Tailwind detected)
  Step 3: 7-Pillar gate passed. Mockup preview: http://localhost:52341
  Step 4: Spawning Agent Teams for screen implementation...
  Post-audit: all 7 pillars scored 3+/4

  specs/ui-structure.md generated
  specs/ui-design-contract.md generated

> /id3-spawn-team

  Spawning Agent Teams for parallel implementation.

  Spawning Agent Teams:
  - spec-generator: generating requirements.md, api-contracts.md
  - implementer: building User -> Organization -> Membership -> ...
  - qa-reviewer: verifying against information model
```

### Example 2: Applying to an Existing Project (Brownfield)

```
$ cd existing-django-project
$ id3-cli init .

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

IDDD synthesizes ideas from multiple intellectual traditions:

- **Peter Chen's ER Model (1976):** "The real world consists of Entities and Relationships." The fundamental insight that information structure precedes application logic.
- **Len Silverston's Universal Data Models:** Reusable information patterns (Party, Product, Order, Hierarchy) that serve as a checklist for validating discovered Entities.
- **Eric Evans' Domain-Driven Design (2003):** Bounded Context, Ubiquitous Language, Aggregate patterns. IDDD inherits the emphasis on domain language and explicit boundaries.
- **Sophia Prater's OOUX (Object-Oriented UX):** "Design objects before interactions." The ORCA framework (Objects, Relationships, CTAs, Attributes) directly influences IDDD's output-first UI derivation.
- **Jamie Lord's "Data First, Code Second" (2024):** "Fold knowledge into data." Applying the Unix Rule of Representation to modern software development.
- **Mitchell Hashimoto's Harness Engineering (2026):** `Agent = Model + Harness`. The insight that for AI agents to remain effective over time, they need architectural constraints, context engineering, and entropy management. IDDD's Hook system, version headers, and auto-audit are direct applications of Harness Engineering principles.

**Key Insight:** *Once the logical model is complete, 80% of application behavior is already defined before any technology choices are made. And the information model itself is the best Harness for AI agents.*

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

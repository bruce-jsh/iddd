# IDDD -- Information Design-Driven Development

```
  ___  ____  ____  ____
 |_ _||  _ \|  _ \|  _ \
  | | | | | | | | | | | |
  | | | |_| | |_| | |_| |
 |___||____/|____/|____/

 Information Design-Driven Development
 "What information exists?" before "What features should we build?"
```

Most software projects start by asking *"What features should we build?"* and jump
straight into implementation. IDDD inverts this: it starts from **"What information
exists in this domain?"** By building a rigorous information model first -- entity
catalog, data model, business rules, and domain glossary -- IDDD ensures that 80% of
application behavior is already defined before any technology choice is made. The
information model then becomes the generative center from which requirements, API
contracts, screen designs, and validation rules are systematically derived. This
package installs IDDD as a set of AI agent skills, harness hooks, and document
templates so that your coding agent enforces information-first discipline throughout
the entire development lifecycle.

---

## Supported Platforms

| Platform    | Agent System         | Multi-Agent Strategy             |
|-------------|----------------------|----------------------------------|
| Claude Code | Claude Agent Teams   | Peer messaging, independent worktrees |
| OpenAI Codex| Codex Agents SDK     | Handoff pattern via MCP Server   |

---

## Prerequisites

| Platform    | Requirement                                          |
|-------------|------------------------------------------------------|
| Claude Code | **Claude Max** membership + Agent Teams enabled      |
| OpenAI Codex| **ChatGPT Plus** or higher (Pro/Business/Enterprise) |

You also need **Node.js 18+** and **npm** (or a compatible package manager) installed
on your machine.

---

## Installation

### Recommended: Global Install

```bash
npm i -g id3-cli
```

This registers `/id3-start` and `/id3-clear` as global slash commands. Then use `/id3-start` in any project as your entry point.

### Alternative: Project-Level Setup

```bash
npx id3-cli@latest
```

The `init` command will:
1. Copy all IDDD templates (specs, docs, steering, skills, hooks) into your project.
2. Create platform-specific symlinks (`.claude/skills/` or `.agents/skills/`).
3. Register harness hooks in your platform's configuration file.
4. Initialize the `.iddd/` state directory (commit counter, preview output).

---

## Directory Structure

After installation, your project gains the following directories:

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
│   │       ├── phase2-procedure.md    Refinement procedure
│   │       └── ui-proposal-guide.md   UI derivation from info model
│   ├── id3-design-ui/              Phase 2.5: UI design and implementation
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
│   ├── ui-structure.md                Screen inventory + navigation structure (Phase 2.5)
│   └── ui-design-contract.md          Visual design contract -- tokens, components (Phase 2.5)
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
│       └── hook-config.json           IDDD hook settings (enable/disable, patterns)
│
│   ===== Platform: OpenAI Codex =====
│
├── AGENTS.md                        Cross-platform agent instructions (<32 KiB)
├── .agents/
│   └── skills/ -> skills/             Symlinks to skills/ originals
└── .codex/
    └── hooks.json                     Codex hook configuration
```

---

## Workflow

```
 ┌────────────────────────────────────────────────────────────────────┐
 │                      IDDD WORKFLOW OVERVIEW                       │
 └────────────────────────────────────────────────────────────────────┘

 [User] <---dialog---> [Lead Agent]
                          |
                          |--- Existing code?
                          |      |
                          |      v
                          |    Phase 0 (Reverse-Extract)
                          |      |  Scan ORM/schema files
                          |      |  Extract entities & relationships
                          |      v
                          |    Verification Interview --------+
                          |                                   |
                          |--- No existing code?              |
                          |      |                            |
                          |      v                            |
                          |    Phase 1 (Structured Interview) |
                          |      |  "What information does    |
                          |      |   your domain manage?"     |
                          |      v                            |
                          |    Entity Catalog produced -------+
                          |                                   |
                          |                                   v
                          |--- Phase 2: Information Design <--+
                          |      |
                          |      |  Conceptual -> Logical model
                          |      |  Derive business rules
                          |      |  Register hooks + version headers
                          |      v
                          |
                          +--- Phase 2.5: UI Design
                          |      |
                          |      |  Entity -> Screen derivation
                          |      |  Visual design contract
                          |      |  7-Pillar gate + mockup preview
                          |      |  Agent Teams implementation
                          |      v
                          |
                          +--- /id3-spawn-team
                                 |
                    +------------+------------------+
                    |                               |
              [Claude Code]                    [Codex]
              Agent Teams                      Agents SDK
                    |                               |
              +-----+-------+                       |
              |     |       |                       |
              v     v       v                       v
           [spec] [impl] [qa]                  [handoff]
              |     |       |
              +-- messaging-+


 ┌────────────────────────────────────────────────────────────────────┐
 │                        HARNESS HOOKS                              │
 ├────────────────────────────────────────────────────────────────────┤
 │                                                                    │
 │  PreToolUse / pre-commit:                                         │
 │    +-- Schema drift BLOCK                                         │
 │    |   "Entity added to code but missing from entity-catalog.md"  │
 │    +-- Rule tracking WARN                                         │
 │        "Validation logic changed; check business-rules.md"        │
 │                                                                    │
 │  Stop / post-commit:                                              │
 │    +-- Auto info-audit (every N commits)                          │
 │        Compare specs/ against actual code for entropy drift       │
 │                                                                    │
 └────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

> **Tip:** If you installed globally (`npm i -g id3-cli`), just run `/id3-start [your request]` — it auto-detects IDDD status and routes to the correct phase. The steps below describe the full manual flow; `/id3-start` is the recommended shortcut for all of them.

### Step 1: Initialize IDDD in your project

```bash
cd your-project
npx id3-cli@latest
```

This scaffolds all IDDD directories, registers hooks, and links skills to your
platform.

### Step 2: Identify entities

Open your AI coding agent and say:

```
identify entities
```

- **Brownfield** (existing code detected): The agent runs Phase 0 -- it scans your
  ORM schemas, migration files, and model definitions, then extracts entities and
  relationships into `specs/entity-catalog.md` and `specs/data-model.md`. You will
  be asked verification questions to confirm or correct the extraction.
- **Greenfield** (no existing code): The agent runs Phase 1 -- a structured
  interview asking "What information does your domain manage?" to collaboratively
  build the initial entity catalog.

### Step 3: Design information model

Once entities are identified, say:

```
design information
```

The agent runs Phase 2: it refines your conceptual model into a logical model,
derives business rules (`docs/business-rules.md`), and sets up version headers
and hook configurations.

### Step 3.5: Design UI (Phase 2.5)

After Phase 2 completes, say:

```
design ui
```

The agent runs Phase 2.5: it derives screen structure from the entity catalog
(`specs/ui-structure.md`), establishes a visual design contract with design tokens
(`specs/ui-design-contract.md`), runs a 7-pillar quality gate with interactive
mockup previews, and spawns Agent Teams for parallel screen implementation with
post-audit. After Phase 2.5 completes, use `/id3-spawn-team` to dispatch
implementation agents.

---

## Global Commands

### id3-start (Global — Smart Router)

The recommended entry point for all IDDD work. Available globally after `npm i -g id3-cli`.

**What it does:**
1. Checks if IDDD is set up in the current project (auto-runs `npx id3-cli .` if not)
2. Shows a progress dashboard with phase completion status
3. Analyzes your request and routes to the correct phase skill
4. Handles ambiguous requests with clarification questions

**Usage:**
```
/id3-start                     Show dashboard + suggest next action
/id3-start identify entities   Route to Phase 0/1
/id3-start design the UI       Route to Phase 2.5 (fast-path)
/id3-start audit the model     Route to info-audit
```

### id3-clear (Global — Project Reset)

Removes all IDDD-generated files from the project, restoring it to pre-IDDD state.

**Safety features:**
- Lists all files to be deleted before any action
- Warns about user-authored files (steering/product.md, steering/data-conventions.md)
- Requires explicit `y` confirmation (default: N = no deletion)
- Only deletes known IDDD paths — never uses glob patterns

**Usage:**
```
/id3-clear
```

---

## Customization Guide

IDDD is designed to be adapted to your project's conventions. Here is what to
customize and where:

| What to customize              | File to edit                      |
|--------------------------------|-----------------------------------|
| Product vision & scope         | `steering/product.md`             |
| Naming conventions, PK strategy, timestamps, soft-delete policy, ENUM vs reference tables | `steering/data-conventions.md` |
| Business rules                 | `docs/business-rules.md`          |
| Domain glossary                | `docs/domain-glossary.md`         |
| Entity definitions             | `specs/entity-catalog.md`         |
| Data model (ERD)               | `specs/data-model.md`             |
| UI screen inventory            | `specs/ui-inventory.md`           |
| UI structure                   | `specs/ui-structure.md`           |
| UI design contract             | `specs/ui-design-contract.md`     |
| Hook behavior (enable/disable) | `.claude/hooks/hook-config.json`  |
| Monitored file patterns        | `.claude/hooks/hook-config.json`  |
| Auto-audit interval            | `.claude/hooks/hook-config.json`  |
| Codex hook configuration       | `.codex/hooks.json`               |

**Tip:** All `specs/` and `docs/` files use YAML frontmatter with version headers.
The IDDD harness tracks these versions to detect entropy drift. Always update the
version header when you modify a spec file.

---

## Harness Configuration Guide

The IDDD harness enforces information-first discipline through automated hooks. All
hook settings live in `.claude/hooks/hook-config.json` (Claude Code) or
`.codex/hooks.json` (Codex).

### Hook Overview

```
 Hook Config (.claude/hooks/hook-config.json)
 +--------------------------------------------+
 |  enabled: true | false                     |   Master switch
 +--------------------------------------------+
 |                                            |
 |  pre-commit:                               |
 |  +-- schema-drift                          |
 |  |   enabled: true                         |
 |  |   severity: "block" | "warn"            |   Block or warn on drift
 |  |   monitored_patterns:                   |
 |  |     - prisma/schema.prisma              |
 |  |     - drizzle/**/*.ts                   |
 |  |     - **/migrations/*.sql               |   Add your ORM patterns
 |  |     - **/models.py                      |
 |  |     - **/entities/*.ts                  |
 |  |     - **/entities/*.java                |
 |  |                                         |
 |  +-- rule-check                            |
 |      enabled: true                         |
 |      severity: "warn"                      |
 |      validation_patterns:                  |
 |        - *.schema.ts                       |
 |        - *.validator.*                     |   Add your validator patterns
 |        - **/validators/**                  |
 |                                            |
 |  post-commit:                              |
 |  +-- auto-audit                            |
 |      enabled: true                         |
 |      interval_commits: 10                  |   Run audit every N commits
 |                                            |
 +--------------------------------------------+
```

### Enabling / Disabling Hooks

To disable all IDDD hooks at once, set the top-level `enabled` flag to `false`:

```json
{
  "enabled": false,
  ...
}
```

To disable a specific hook while keeping others active:

```json
{
  "enabled": true,
  "hooks": {
    "pre-commit": {
      "schema-drift": {
        "enabled": false
      }
    }
  }
}
```

### Adjusting Auto-Audit Interval

The auto-audit runs every N commits. To change the interval:

```json
{
  "hooks": {
    "post-commit": {
      "auto-audit": {
        "enabled": true,
        "interval_commits": 5
      }
    }
  }
}
```

Set `interval_commits` to a lower number for stricter entropy control, or higher for
less frequent audits. The commit counter is stored in `.iddd/commit-count`.

### Adding Schema Monitoring Patterns

If your project uses an ORM or schema tool not covered by the defaults, add its file
patterns to `monitored_patterns`:

```json
{
  "hooks": {
    "pre-commit": {
      "schema-drift": {
        "monitored_patterns": [
          "prisma/schema.prisma",
          "drizzle/**/*.ts",
          "**/migrations/*.sql",
          "**/models.py",
          "**/entities/*.ts",
          "**/entities/*.java",
          "src/database/**/*.entity.ts",
          "sequelize/models/**/*.js"
        ]
      }
    }
  }
}
```

### Schema Drift Severity

- `"block"` -- The hook will **reject** the commit / tool use if schema drift is
  detected. The agent must update `specs/entity-catalog.md` and `specs/data-model.md`
  before proceeding.
- `"warn"` -- The hook emits a warning but allows the operation to continue.

---

## Codex Configuration

For OpenAI Codex, hooks are configured in `.codex/hooks.json`. This file is
automatically generated by `npx id3-cli@latest`.

**Important:** If your project uses a `config.toml` for Codex agent settings, ensure
that hooks are enabled:

```toml
# config.toml
codex_hooks = true
```

Without this flag, Codex will not execute the IDDD hook scripts during the agent
loop. The hooks.json file defines three event bindings:

| Event         | Hook Script               | Purpose                      |
|---------------|---------------------------|------------------------------|
| PreToolUse    | `hooks/iddd-schema-drift.js`| Schema drift detection      |
| PostToolUse   | `hooks/iddd-rule-check.js`  | Business rule tracking      |
| SessionStart  | `hooks/iddd-auto-audit.js`  | Entropy audit on session start |

To disable a specific Codex hook, remove or comment out its entry in `.codex/hooks.json`.

---

## Intellectual Lineage

IDDD synthesizes ideas from several intellectual traditions:

- **Peter Chen's ER Model (1976)** -- "The real world consists of entities and relationships."
- **Len Silverston's Universal Data Models** -- Reusable information patterns (Party, Product, Order, Hierarchy).
- **Eric Evans' DDD (2003)** -- Bounded Context, Ubiquitous Language, Aggregate.
- **Sophia Prater's OOUX** -- "Design objects before interactions" (ORCA: Objects, Relationships, CTAs, Attributes).
- **Jamie Lord's "Data First, Code Second" (2024)** -- "Fold knowledge into data" (Unix Rule of Representation).
- **Mitchell Hashimoto's Harness Engineering (2026)** -- Agent = Model + Harness. Context engineering + architecture constraints + entropy management.

**Core insight:** *When the logical model is complete, 80% of application behavior is
already defined -- before any technology choice is made. And that information model
itself is the best harness for AI agents.*

---

## License

MIT

---

```
  "What information exists?" -- always the first question.
```

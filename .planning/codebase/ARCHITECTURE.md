# Architecture

**Analysis Date:** 2026-04-06

## Pattern Overview

**Overall:** CLI scaffolding tool + hook runtime + template system

The codebase is an npm package (`id3-cli`) that scaffolds IDDD (Information Design-Driven Development) methodology into a target project. It is NOT a framework or library that runs alongside user code. Instead, it installs markdown templates (skills, specs, docs), git hooks, and platform-specific hook configurations into the user's project. After installation, the hook scripts run independently at commit time and during AI agent tool invocations.

**Key Characteristics:**
- Single CLI entry point (`npx id3-cli`) that copies templates and configures hooks
- Two runtime contexts: (1) installation-time via `bin/cli.ts` and (2) hook-execution-time via bundled JS scripts in the target project
- No server, no daemon -- hooks are standalone Node.js scripts bundled by esbuild
- Template-driven architecture: markdown files define AI agent skills, not code
- Multi-platform support: Claude Code hooks (PreToolUse/Stop), OpenAI Codex hooks, and git hooks (pre-commit/post-commit) all share the same core logic

## Layers

**CLI Layer:**
- Purpose: Parse arguments, call init logic, display results
- Location: `bin/cli.ts`
- Contains: Argument parsing, interactive prompts, top-level orchestration
- Depends on: `src/init.ts`, `src/utils/ascii.ts`
- Used by: End users via `npx id3-cli`

**Init Layer:**
- Purpose: Core installation logic -- copy templates, create symlinks, detect platforms, inject hooks
- Location: `src/init.ts`
- Contains: `initProject()`, `injectClaudeHooks()`, `installGitHooks()`, `detectPlatforms()`, skill symlink creation
- Depends on: `src/utils/fs.ts`, `src/utils/ascii.ts`, Node.js `fs`, `child_process`
- Used by: `bin/cli.ts`

**Hook Logic Layer:**
- Purpose: Runtime hook behavior executed in user's project context
- Location: `src/hooks/`
- Contains: Schema drift detection, business rule checking, auto-audit counter
- Key files:
  - `src/hooks/shared.ts` -- Git diff parsing, config loading, glob matching, skip/log helpers
  - `src/hooks/schema-drift.ts` -- Detects schema changes without entity-catalog.md updates
  - `src/hooks/rule-check.ts` -- Detects new validation patterns without business-rules.md entries
  - `src/hooks/auto-audit.ts` -- Commit counter that triggers audit reminders
- Depends on: `src/utils/ascii.ts`, Node.js `fs`, `child_process` (git commands)
- Used by: Hook entry points

**Hook Entry Points:**
- Purpose: Thin wrappers that bridge platform APIs to hook logic
- Location: `src/hooks/*-entry.ts`
- Contains: stdin parsing (Claude Code), process exit codes (git hooks)
- Files:
  - `src/hooks/pre-commit-entry.ts` -- Git pre-commit: runs schema-drift (blocking) + rule-check (warning)
  - `src/hooks/post-commit-entry.ts` -- Git post-commit: runs auto-audit
  - `src/hooks/claude-pretool-entry.ts` -- Claude Code PreToolUse: reads JSON from stdin, runs schema-drift + rule-check
  - `src/hooks/claude-stop-entry.ts` -- Claude Code Stop: runs auto-audit
- Depends on: `src/hooks/shared.ts`, `src/hooks/schema-drift.ts`, `src/hooks/rule-check.ts`, `src/hooks/auto-audit.ts`
- Used by: esbuild-bundled scripts placed in `templates/hooks/`

**Preview Layer:**
- Purpose: Generate HTML visualizations of the information model and serve them locally
- Location: `src/preview/`
- Contains:
  - `src/preview/server.ts` -- HTTP server for `.iddd/preview/` directory
  - `src/preview/renderer.ts` -- HTML generators for ERD (Mermaid), mockup cards, audit dashboard
  - `src/preview/ui-gate.ts` -- 7-pillar UI quality gate + markdown table parsers for spec files
  - `src/preview/ui-auditor.ts` -- Pillar scoring, audit report generation, HTML audit dashboard
  - `src/preview/mockup-generator.ts` -- Entity-to-screen derivation (9 rules), attribute-to-widget mapping (12 rules), sample data, mockup HTML with wireframe/styled/interactive tabs
- Depends on: `src/preview/renderer.ts` (shared `escapeHtml`)
- Used by: AI agent skills (`id3-preview`, `id3-design-ui`) at runtime in the user's project

**Utility Layer:**
- Purpose: Shared filesystem operations and terminal output formatting
- Location: `src/utils/`
- Contains:
  - `src/utils/fs.ts` -- `fileExists()`, `copyDir()`, `createSymlink()`
  - `src/utils/ascii.ts` -- `box()` for bordered terminal output, `banner()` for ASCII art version display
- Depends on: Node.js `fs`
- Used by: All other layers

**Template Layer:**
- Purpose: Files copied into the user's project during `initProject()`
- Location: `templates/`
- Contains: Markdown skill definitions, spec templates, steering docs, hook configs, bundled hook scripts
- Not TypeScript -- these are the scaffolded artifacts
- Used by: `src/init.ts` (copies to target)

**Build Scripts:**
- Purpose: Build tooling for hook bundling and version management
- Location: `scripts/`
- Contains:
  - `scripts/build-hooks.ts` -- Uses esbuild to bundle 4 hook entry points into self-contained JS files in `templates/hooks/`
  - `scripts/update-version.ts` -- Updates version references across README files during `npm version`
- Depends on: esbuild, Node.js `fs`
- Used by: `npm run build`

## Data Flow

**Installation Flow:**

1. User runs `npx id3-cli [target-dir]`
2. `bin/cli.ts` parses args, calls `initProject()` from `src/init.ts`
3. `initProject()` resolves absolute path, checks for existing `CLAUDE.md`
4. `copyDir()` recursively copies all `templates/` files to target
5. Skill symlinks created: `skills/<name>/SKILL.md` -> `.claude/skills/<name>/SKILL.md` and `.agents/skills/<name>/SKILL.md`
6. `detectPlatforms()` runs `which claude` and `which codex` to find available AI platforms
7. If Claude detected: `injectClaudeHooks()` writes hook entries into `.claude/settings.local.json`
8. If `.git/` exists: `installGitHooks()` symlinks `hooks/pre-commit` and `hooks/post-commit` into `.git/hooks/`
9. `printSuccess()` displays result summary with platform and hook status

**Git Pre-Commit Hook Flow:**

1. Git triggers `hooks/pre-commit` (symlink to bundled JS script)
2. `pre-commit-entry.ts` resolves project root, calls `runSchemaDrift()`
3. `runSchemaDrift()` checks `IDDD_SKIP_HOOKS` env var, loads `hook-config.json`
4. Gets cached git diff via `git diff --cached --name-status`
5. Filters files matching `monitored_patterns` from config
6. If schema files found: checks if `specs/entity-catalog.md` is also in the diff
7. Analyzes schema changes (SQL, Prisma, Django patterns) via regex
8. Structural changes without entity-catalog.md update -> blocks commit (exit 1)
9. Then `runRuleCheck()` runs: detects validation patterns (Zod, Yup, Joi, etc.) and warns if no BR-xxx entry exists

**Claude Code PreToolUse Hook Flow:**

1. Claude Code invokes hook when agent uses Write or Edit tool
2. `claude-pretool-entry.ts` reads JSON from stdin: `{ tool_name, tool_input: { file_path } }`
3. Calls `runSchemaDriftFromHookInput()` with parsed input
4. If the file being written matches a monitored schema pattern: warns (non-blocking in Claude mode)
5. Outputs JSON `{ decision: "block", reason: "..." }` if blocking needed

**Auto-Audit Flow:**

1. Triggered on post-commit (git) or Stop event (Claude Code)
2. Reads commit counter from `.iddd/commit-count`
3. Increments counter; if >= threshold (default: 10): prints audit reminder
4. Resets counter after triggering

**Preview Server Flow:**

1. AI agent skill (`id3-preview`) calls preview functions
2. `startPreviewServer()` creates HTTP server on random port
3. Serves `.html` files from `.iddd/preview/` directory
4. ERD rendered via Mermaid.js CDN, mockups via static HTML with CSS

**State Management:**
- No runtime state between hooks -- each execution is stateless
- Persistent state: `.iddd/commit-count` (auto-audit counter), `.iddd/skip-history.log` (hook bypass log)
- Configuration: `.claude/hooks/hook-config.json` (hook settings)
- Information model state lives in user-maintained markdown files under `specs/` and `docs/`

## Key Abstractions

**HookConfig:**
- Purpose: Typed configuration for all hooks (schema-drift, rule-check, auto-audit)
- Defined in: `src/hooks/shared.ts`
- Loaded from: `.claude/hooks/hook-config.json`
- Pattern: JSON config parsed into typed interface at each hook invocation

**HookInput:**
- Purpose: Parsed Claude Code Hook API input (tool name + file path)
- Defined in: `src/hooks/shared.ts`
- Pattern: Stdin JSON parsing with null return on invalid input

**SchemaChange:**
- Purpose: Represents a detected schema modification (add/modify/drop table/column)
- Defined in: `src/hooks/schema-drift.ts`
- Pattern: Regex-based analysis of git diff content

**EntityDef / AttributeDef / RelationshipDef:**
- Purpose: Typed representations of entities from the information model
- Defined in: `src/preview/mockup-generator.ts`
- Pattern: Used by preview layer to derive screens and widgets from entity definitions

**UiStructureData / UiDesignContractData:**
- Purpose: Parsed representations of `specs/ui-structure.md` and `specs/ui-design-contract.md`
- Defined in: `src/preview/ui-gate.ts`
- Pattern: Markdown table parsing via regex into typed structures

**InitResult:**
- Purpose: Installation outcome report (platforms detected, hooks installed)
- Defined in: `src/init.ts`
- Pattern: Return value struct passed to `printSuccess()` for formatted output

## Entry Points

**CLI (`bin/cli.ts`):**
- Location: `bin/cli.ts`
- Triggers: `npx id3-cli`, `npx id3-cli init [dir]`, `npx id3-cli [dir] --no-symlink`
- Responsibilities: Parse args/flags, call `initProject()`, handle overwrite prompt, display banner and success

**Pre-Commit Entry (`src/hooks/pre-commit-entry.ts`):**
- Location: `src/hooks/pre-commit-entry.ts`
- Triggers: Git pre-commit hook via symlinked bundled script
- Responsibilities: Run schema-drift (blocking) + rule-check (warning), exit 1 on block

**Post-Commit Entry (`src/hooks/post-commit-entry.ts`):**
- Location: `src/hooks/post-commit-entry.ts`
- Triggers: Git post-commit hook via symlinked bundled script
- Responsibilities: Run auto-audit commit counter

**Claude PreToolUse Entry (`src/hooks/claude-pretool-entry.ts`):**
- Location: `src/hooks/claude-pretool-entry.ts`
- Triggers: Claude Code PreToolUse hook on Write|Edit tool invocations
- Responsibilities: Parse stdin JSON, run schema-drift + rule-check, output decision JSON

**Claude Stop Entry (`src/hooks/claude-stop-entry.ts`):**
- Location: `src/hooks/claude-stop-entry.ts`
- Triggers: Claude Code Stop hook
- Responsibilities: Run auto-audit

## Error Handling

**Strategy:** Fail-open for hooks, fail-closed for installation

**Patterns:**
- All hook entry points wrap `main()` in `.catch()` and `process.exit(0)` on error -- hooks never crash the user's workflow
- `pre-commit-entry.ts` is the exception: exits with code 1 on schema drift block (intentional blocking)
- `parseHookInput()` returns `null` on invalid JSON rather than throwing
- `loadHookConfig()` returns `null` on missing/invalid config (hooks become no-ops)
- `fileExists()` uses try/catch on `access()` -- never throws
- `copyDir()` skips existing files unless `overwrite: true`
- `detectPlatforms()` uses try/catch on `execSync('which ...')` -- gracefully returns false
- `banner()` falls back to plain text if `assets/banner.txt` is unreadable

## Cross-Cutting Concerns

**Logging:** All hook output goes to `stderr` via `console.error()` wrapped in `box()` formatting. This avoids interfering with stdout-based protocols (Claude Code Hook API expects JSON on stdout).

**Validation:** Schema drift analysis uses regex pattern matching for SQL (CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE INDEX), Prisma (model), and Django (class Model). Rule check uses regex patterns for Zod, Yup, Joi, Pydantic, Java annotations, and express-validator.

**Configuration:** Single config file at `.claude/hooks/hook-config.json` controls all hook behavior. Loaded at each hook invocation. No caching.

**Platform Abstraction:** Same hook logic serves three platforms (git, Claude Code, Codex) through thin entry-point adapters. Git hooks use process exit codes. Claude Code hooks use stdin/stdout JSON. Codex hooks use `hooks.json` configuration.

**Build Pipeline:** Two-phase build: (1) `tsc` compiles TypeScript to `dist/`, (2) `esbuild` bundles hook entry points into self-contained scripts in `templates/hooks/`. The bundled hooks are committed/published as part of the npm package.

---

*Architecture analysis: 2026-04-06*

# Codebase Structure

**Analysis Date:** 2026-04-06

## Directory Layout

```
iddd/
├── assets/                  # Static assets shipped with the npm package
│   └── banner.txt           # ASCII art banner template with {{version}} placeholder
├── bin/                     # CLI entry point (TypeScript source)
│   └── cli.ts               # Main CLI: parses args, calls initProject()
├── dist/                    # TypeScript compilation output (generated, gitignored)
│   ├── bin/
│   ├── scripts/
│   ├── src/
│   └── templates/
├── docs/                    # Internal development docs (gitignored from published package)
│   └── superpowers/         # Design exploration docs
├── node_modules/            # Dependencies
├── prd/                     # Product requirement documents (gitignored from package)
│   ├── IDDD-SKILL-SPEC-v0.1.md
│   ├── IDDD-SKILL-SPEC-v0.2.md
│   └── IDDD-SKILL-SPEC-v0.3.md
├── scripts/                 # Build scripts (gitignored from package)
│   ├── build-hooks.ts       # esbuild bundler for hook entry points
│   └── update-version.ts    # README version updater for npm version lifecycle
├── src/                     # Core TypeScript source
│   ├── hooks/               # Hook logic (schema-drift, rule-check, auto-audit)
│   ├── preview/             # HTML preview generation and server
│   ├── utils/               # Shared utilities (fs, ascii)
│   └── init.ts              # Core init logic: copy templates, configure hooks
├── templates/               # Files scaffolded into user's project
│   ├── .agents/             # OpenAI Codex / generic agent platform config
│   │   └── skills/          # Skill symlink targets (populated at init)
│   ├── .claude/             # Claude Code platform config
│   │   ├── hooks/           # Hook config JSON
│   │   └── skills/          # Skill symlink targets (populated at init)
│   ├── .codex/              # OpenAI Codex hook config
│   │   └── hooks.json       # Codex-specific hook definitions
│   ├── .iddd/               # IDDD runtime state directory
│   │   ├── commit-count     # Auto-audit commit counter
│   │   └── preview/         # Generated HTML previews (ERD, mockups, audit)
│   ├── docs/                # Documentation templates
│   │   ├── business-rules.md
│   │   ├── domain-glossary.md
│   │   ├── info-debt.md
│   │   └── model-changelog.md
│   ├── hooks/               # Bundled hook scripts (esbuild output)
│   │   ├── pre-commit       # Git pre-commit hook (bundled JS with shebang)
│   │   ├── post-commit      # Git post-commit hook (bundled JS with shebang)
│   │   ├── iddd-schema-drift.js  # Claude Code PreToolUse hook
│   │   └── iddd-auto-audit.js    # Claude Code Stop hook
│   ├── skills/              # AI agent skill definitions (SKILL.md files)
│   │   ├── id3-identify-entities/   # Phase 0/1: entity discovery
│   │   ├── id3-design-information/  # Phase 2: logical model refinement
│   │   ├── id3-design-ui/           # Phase 2.5: UI structure and mockups
│   │   ├── id3-spawn-team/          # Phase 3-5: agent team orchestration
│   │   ├── id3-info-audit/          # Audit: model-vs-code consistency
│   │   └── id3-preview/             # Utility: preview server
│   ├── specs/               # Specification templates
│   │   ├── entity-catalog.md    # Single source of truth (entity definitions)
│   │   ├── data-model.md        # Mermaid ERD and design decisions
│   │   ├── ui-structure.md      # Screen inventory (Phase 2.5)
│   │   ├── ui-design-contract.md # Visual design tokens (Phase 2.5)
│   │   └── ui-inventory.md      # Current UI inventory (brownfield)
│   ├── src/                 # Source directory placeholder (.gitkeep)
│   ├── steering/            # Project steering documents
│   │   ├── product.md       # Product vision and scope
│   │   └── data-conventions.md  # Naming, PK, typing conventions
│   ├── CLAUDE.md            # Claude Code system prompt (installed to project root)
│   ├── AGENTS.md            # Codex/generic agent system prompt
│   └── README.md            # IDDD methodology overview (installed to project)
├── tests/                   # Test files (gitignored from package)
│   ├── hooks/               # Hook logic tests
│   ├── preview/             # Preview layer tests
│   ├── utils/               # Utility tests
│   └── init.test.ts         # Init logic tests
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── vitest.config.ts
├── README.md                # Public npm package README (English)
├── README.ko-KR.md          # Korean README
├── README.zh-CN.md          # Chinese README
├── README.ja-JP.md          # Japanese README
└── README.tr-TR.md          # Turkish README
```

## Directory Purposes

**`bin/`:**
- Purpose: CLI entry point
- Contains: Single file `cli.ts` -- the `id3-cli` binary
- Key files: `bin/cli.ts`

**`src/`:**
- Purpose: All TypeScript source code for the package
- Contains: Init logic, hook implementations, preview generators, utilities
- Key files: `src/init.ts` (core orchestrator)

**`src/hooks/`:**
- Purpose: Hook behavior implementations shared across git and Claude Code/Codex platforms
- Contains: Schema drift detection, business rule checking, auto-audit logic, shared helpers
- Key files: `src/hooks/shared.ts` (config loading, git helpers, glob matching), `src/hooks/schema-drift.ts` (main schema drift logic)

**`src/hooks/*-entry.ts`:**
- Purpose: Platform-specific thin wrappers (4 files) that bridge hook logic to platform APIs
- Contains: `pre-commit-entry.ts`, `post-commit-entry.ts`, `claude-pretool-entry.ts`, `claude-stop-entry.ts`
- These are the esbuild entry points that get bundled into `templates/hooks/`

**`src/preview/`:**
- Purpose: HTML generation for visual previews of the information model
- Contains: HTTP server, Mermaid ERD renderer, mockup generator, UI quality gate, audit dashboard
- Key files: `src/preview/mockup-generator.ts` (478 lines, largest source file), `src/preview/ui-gate.ts` (319 lines)

**`src/utils/`:**
- Purpose: Shared utilities used across all layers
- Contains: Filesystem helpers, ASCII terminal art
- Key files: `src/utils/fs.ts` (copyDir, createSymlink, fileExists), `src/utils/ascii.ts` (box, banner)

**`templates/`:**
- Purpose: All files scaffolded into the user's project at `npx id3-cli` time
- Contains: Markdown templates, hook scripts, platform configs, skill definitions
- Generated: Partially (hook scripts in `templates/hooks/` are esbuild output)
- Committed: Yes -- bundled hooks are committed and published

**`templates/skills/`:**
- Purpose: AI agent skill definitions in SKILL.md format
- Contains: 6 skill directories, each with a `SKILL.md` and optional `references/` subdirectory
- Pattern: Skills are symlinked into `.claude/skills/` and `.agents/skills/` at init time

**`templates/hooks/`:**
- Purpose: Pre-bundled hook scripts placed into user's project
- Contains: 4 bundled JS files (git pre-commit, git post-commit, Claude schema-drift, Claude auto-audit)
- Generated: Yes, by `scripts/build-hooks.ts` via esbuild
- Committed: Yes

**`scripts/`:**
- Purpose: Build-time scripts
- Contains: Hook bundler and version updater
- Key files: `scripts/build-hooks.ts`, `scripts/update-version.ts`
- Committed: Yes (in git), but gitignored from npm package

**`tests/`:**
- Purpose: Test files mirroring `src/` structure
- Contains: Unit tests for hooks, preview, utils, and init
- Key files: 14 test files
- Committed: Yes (in git), but gitignored from npm package

**`prd/`:**
- Purpose: Product requirement/specification documents (internal design history)
- Contains: Versioned IDDD skill specs (v0.1, v0.2, v0.3)
- Committed: Yes (in git), but gitignored from npm package

**`assets/`:**
- Purpose: Static assets shipped with npm package
- Contains: `banner.txt` (ASCII art with `{{version}}` placeholder)
- Committed: Yes, shipped in npm package

**`dist/`:**
- Purpose: TypeScript compilation output
- Generated: Yes, by `tsc`
- Committed: No (gitignored)

## Key File Locations

**Entry Points:**
- `bin/cli.ts`: CLI binary (compiled to `dist/bin/cli.js`, referenced by `package.json` `bin` field)
- `src/init.ts`: Core init logic called by CLI

**Configuration:**
- `package.json`: Package manifest, scripts, dependencies
- `tsconfig.json`: TypeScript config (target ES2022, module Node16, strict, rootDir `.`, outDir `dist`)
- `vitest.config.ts`: Test runner config (include `tests/**/*.test.ts`, 10s timeout)
- `.gitignore`: Excludes `dist/`, `node_modules/`, and dev-only files from npm package

**Core Logic:**
- `src/hooks/shared.ts`: Hook config interface, git diff helpers, glob matching, skip logic
- `src/hooks/schema-drift.ts`: Schema change analysis (SQL, Prisma, Django regex patterns)
- `src/hooks/rule-check.ts`: Validation pattern detection (Zod, Yup, Joi, Pydantic, Java, etc.)
- `src/hooks/auto-audit.ts`: Commit counter and audit trigger
- `src/preview/mockup-generator.ts`: Entity-to-screen derivation rules, widget mapping, HTML generation
- `src/preview/ui-gate.ts`: 7-pillar quality gate, markdown table parsing for spec files
- `src/preview/renderer.ts`: ERD HTML, mockup cards HTML, audit dashboard HTML
- `src/preview/ui-auditor.ts`: Pillar scoring logic, audit report data structures
- `src/preview/server.ts`: HTTP server for `.iddd/preview/` directory

**Testing:**
- `tests/init.test.ts`: Init logic tests
- `tests/hooks/shared.test.ts`: Shared hook utilities tests
- `tests/hooks/schema-drift.test.ts`: Schema drift detection tests
- `tests/hooks/rule-check.test.ts`: Rule check tests
- `tests/hooks/auto-audit.test.ts`: Auto-audit tests
- `tests/hooks/claude-pretool-entry.test.ts`: Claude PreToolUse entry tests
- `tests/hooks/claude-stop-entry.test.ts`: Claude Stop entry tests
- `tests/preview/server.test.ts`: Preview server tests
- `tests/preview/renderer.test.ts`: HTML renderer tests
- `tests/preview/mockup-generator.test.ts`: Mockup generation tests
- `tests/preview/ui-gate.test.ts`: UI gate tests
- `tests/preview/ui-auditor.test.ts`: UI auditor tests
- `tests/utils/fs.test.ts`: Filesystem utility tests
- `tests/utils/ascii.test.ts`: ASCII art utility tests

**Skill Definitions (templates):**
- `templates/skills/id3-identify-entities/SKILL.md`: Phase 0/1 entity discovery
- `templates/skills/id3-design-information/SKILL.md`: Phase 2 logical model refinement
- `templates/skills/id3-design-ui/SKILL.md`: Phase 2.5 UI design pipeline
- `templates/skills/id3-spawn-team/SKILL.md`: Phase 3-5 agent team orchestration
- `templates/skills/id3-info-audit/SKILL.md`: Information model audit
- `templates/skills/id3-preview/SKILL.md`: Preview server skill

**Platform Configs (templates):**
- `templates/CLAUDE.md`: Claude Code system prompt installed to project root
- `templates/AGENTS.md`: Codex/generic agent system prompt installed to project root
- `templates/.claude/hooks/hook-config.json`: Hook configuration with monitored patterns
- `templates/.codex/hooks.json`: Codex-specific hook definitions

## Naming Conventions

**Files:**
- Source files: `kebab-case.ts` (e.g., `schema-drift.ts`, `auto-audit.ts`, `ui-gate.ts`)
- Entry point files: `kebab-case-entry.ts` suffix for hook entry points
- Test files: `kebab-case.test.ts` mirroring source file name (e.g., `schema-drift.test.ts`)
- Template markdown: `kebab-case.md` (e.g., `entity-catalog.md`, `business-rules.md`)
- Skill definitions: Always named `SKILL.md` (uppercase)
- Platform system prompts: `CLAUDE.md`, `AGENTS.md` (uppercase)

**Directories:**
- Source directories: `kebab-case` (e.g., `src/hooks/`, `src/preview/`, `src/utils/`)
- Skill directories: `id3-` prefix with `kebab-case` (e.g., `id3-identify-entities`, `id3-design-ui`)
- Platform directories: Dot-prefixed lowercase (e.g., `.claude/`, `.agents/`, `.codex/`, `.iddd/`)

**Functions and Variables:**
- Functions: `camelCase` (e.g., `initProject`, `runSchemaDrift`, `parseHookInput`)
- Interfaces: `PascalCase` (e.g., `HookConfig`, `SchemaChange`, `InitResult`)
- Constants: `UPPER_SNAKE_CASE` for pattern arrays (e.g., `VALIDATION_PATTERNS`, `SAMPLE_NAMES`)

**Exports:**
- Named exports only (no default exports anywhere in the codebase)
- Functions exported individually, not via barrel files

## Where to Add New Code

**New Hook:**
1. Create hook logic in `src/hooks/<hook-name>.ts` with a `run<HookName>(projectRoot: string)` function
2. Create entry point(s) in `src/hooks/<platform>-<event>-entry.ts` (one per platform)
3. Add entry point(s) to `scripts/build-hooks.ts` esbuild configuration
4. Add tests in `tests/hooks/<hook-name>.test.ts`
5. Update `templates/.claude/hooks/hook-config.json` with new hook configuration
6. If applicable, update `templates/.codex/hooks.json`

**New Preview Renderer:**
1. Add rendering function in `src/preview/renderer.ts` (HTML generation)
2. Or create a new file `src/preview/<renderer-name>.ts` for complex renderers
3. Add tests in `tests/preview/<renderer-name>.test.ts`
4. Update `src/preview/server.ts` if new file types need serving

**New Skill:**
1. Create `templates/skills/<skill-name>/SKILL.md` with YAML frontmatter
2. Optionally add `templates/skills/<skill-name>/references/` for detailed procedure docs
3. Add skill name to the `skills` array in `src/init.ts` `createSkillSymlinks()` and `copySkillFiles()`
4. Update skill tables in `templates/CLAUDE.md` and `templates/AGENTS.md`

**New Utility:**
1. Add to existing `src/utils/fs.ts` or `src/utils/ascii.ts` if it fits
2. Or create `src/utils/<utility-name>.ts` for a new utility category
3. Add tests in `tests/utils/<utility-name>.test.ts`

**New Template File:**
1. Add to the appropriate `templates/` subdirectory:
   - Spec templates: `templates/specs/`
   - Doc templates: `templates/docs/`
   - Steering docs: `templates/steering/`
2. No code changes needed -- `copyDir()` recursively copies all of `templates/`

**New Build Script:**
1. Add `scripts/<script-name>.ts`
2. Add to `tsconfig.json` `include` array (already includes `scripts/**/*.ts`)
3. Add npm script in `package.json` if needed

## Special Directories

**`templates/hooks/`:**
- Purpose: Contains esbuild-bundled hook scripts
- Generated: Yes, by `npm run build:hooks` (via `scripts/build-hooks.ts`)
- Committed: Yes -- these are the published hook scripts that run in user projects
- Note: Do NOT edit these files directly. Edit `src/hooks/*-entry.ts` and rebuild.

**`dist/`:**
- Purpose: TypeScript compilation output
- Generated: Yes, by `tsc`
- Committed: No (gitignored)

**`.planning/`:**
- Purpose: GSD planning documents
- Generated: By analysis tools
- Committed: No (typically gitignored)

**`prd/`:**
- Purpose: Internal product requirement documents (design history)
- Generated: No (manually authored)
- Committed: Yes in git, but gitignored from npm package via `.gitignore` + `package.json` `files` field

**`docs/superpowers/`:**
- Purpose: Internal design exploration documents
- Generated: No
- Committed: Yes in git, but gitignored from npm package

## npm Package Contents

The published npm package includes only these directories (per `package.json` `files` field):
- `dist/` -- Compiled TypeScript
- `templates/` -- All scaffolding templates including bundled hooks
- `assets/` -- Static assets (banner.txt)

Everything else (tests, scripts, prd, docs, vitest.config.ts, tsconfig.json) is excluded from the published package.

## Build Pipeline

```
npm run build
  ├── tsc                           # Compile TypeScript -> dist/
  └── node dist/scripts/build-hooks.js  # Bundle hooks -> templates/hooks/

npm run build:cli     # tsc only
npm run build:hooks   # esbuild only

npm version [patch|minor|major]
  └── tsc + node dist/scripts/update-version.js  # Update README versions + git add

npm run prepublishOnly
  └── npm run build   # Full build before publish
```

---

*Structure analysis: 2026-04-06*

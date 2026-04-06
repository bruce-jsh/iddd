# External Integrations

**Analysis Date:** 2026-04-06

## APIs & External Services

**None.** This project has zero external API dependencies. It is a pure CLI scaffolding tool that operates entirely on the local filesystem and git.

## CDN Dependencies (Runtime in Generated HTML)

**Mermaid.js (CDN):**
- Used in: Generated ERD preview HTML output by `src/preview/renderer.ts`
- URL: `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs`
- Purpose: Renders Mermaid ERD diagrams in browser-based preview
- Note: Loaded at runtime in the browser, not bundled. Requires internet access when viewing previews.

## AI Coding Agent Platforms

The tool integrates with AI coding agent platforms by scaffolding configuration files and hooks into the target project. It does not call any AI APIs directly.

**Claude Code (Anthropic):**
- Detection: `which claude` in `src/init.ts` (`detectPlatforms()`)
- Hook Integration: Injects entries into `.claude/settings.local.json` via `injectClaudeHooks()` in `src/init.ts`
  - `PreToolUse` hook (matcher: `Write|Edit`): Runs `hooks/iddd-schema-drift.js`
  - `Stop` hook: Runs `hooks/iddd-auto-audit.js`
- Hook Protocol: Claude Code passes JSON via stdin (`{ tool_name, tool_input: { file_path } }`), hooks respond with `{ decision: "block", reason: "..." }` via stdout
- Skills: Installed to `.claude/skills/` as symlinks (or copies with `--no-symlink`)
- Config: `.claude/hooks/hook-config.json` (template-provided)

**OpenAI Codex:**
- Detection: `which codex` in `src/init.ts` (`detectPlatforms()`)
- Hook Integration: `hooks.json` provided in templates (expected at `.codex/hooks.json`)
- Skills: Installed to `.agents/skills/` as symlinks
- Agent roles defined in `templates/AGENTS.md`: spec-generator, implementer, qa-reviewer

**Google Antigravity:**
- Mentioned in project description as a supported platform
- No specific detection or hook integration code found in current source

## Git Integration

**Git CLI (via `child_process`):**
- Used in: `src/hooks/shared.ts`, `src/init.ts`
- Commands executed:
  - `git diff --cached --name-status` - Detect staged schema changes (`getCachedDiff()`)
  - `git show :<filepath>` - Read staged file content (`getCachedFileContent()`)
  - `git rev-parse HEAD` - Get current commit hash (for skip-history logging)
  - `which <command>` - Platform detection
- Purpose: Schema drift detection, rule checking, auto-audit triggering

**Git Hooks (symlinked):**
- `pre-commit`: Runs schema-drift check + rule-check (blocks commit on structural schema changes without entity-catalog update)
- `post-commit`: Runs auto-audit counter (triggers audit reminder after N commits)
- Installation: `src/init.ts` (`installGitHooks()`) creates symlinks from `.git/hooks/` to `hooks/` directory
- Hook source: Bundled by esbuild from `src/hooks/*-entry.ts` into `templates/hooks/`

## Data Storage

**Databases:**
- None. This tool does not use or connect to any database.

**File Storage:**
- Local filesystem only
- Reads/writes to target project directory structure
- Generated preview HTML stored in `.iddd/preview/`
- Commit counter stored in `.iddd/commit-count` (plain text integer)
- Skip history log stored in `.iddd/skip-history.log` (TSV format: timestamp, commit hash, message)

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- None. No authentication required. CLI tool runs with local filesystem permissions.

## Monitoring & Observability

**Error Tracking:**
- None. Errors are caught silently in hooks to avoid blocking development (hooks use `process.exit(0)` on errors).

**Logs:**
- Console output via `console.log` and `console.error`
- ASCII box formatting via `src/utils/ascii.ts` (`box()` function)
- Hook skip logging to `.iddd/skip-history.log` via `logSkip()` in `src/hooks/shared.ts`

## CI/CD & Deployment

**Hosting:**
- npm registry (`id3-cli` package)

**CI Pipeline:**
- Not detected. No `.github/`, `.gitlab-ci.yml`, or other CI config files present.

**Publishing:**
- `npm run prepublishOnly` triggers `npm run build` (tsc + hook bundling)
- Manual `npm publish` (no automated release pipeline detected)

## Environment Configuration

**Required env vars:**
- None required for the tool itself

**Optional env vars:**
- `IDDD_SKIP_HOOKS=1` - Bypass all hook checks (logged, not recommended)

**Secrets location:**
- No secrets used or stored by this project

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Local HTTP Server

**Preview Server:**
- Implementation: `src/preview/server.ts`
- Protocol: `node:http` (no framework)
- Port: Dynamic (uses port 0, OS-assigned)
- Purpose: Serves generated HTML preview files from `.iddd/preview/` directory
- Lifetime: Ephemeral - starts on `id3-preview` skill invocation, closes on Enter key
- Routes: Filename-based (`/<name>` maps to `<name>.html`), index page lists all available previews

## Schema/Pattern Detection

The hook system detects patterns across multiple ecosystems (not dependencies of this tool, but patterns it recognizes in target projects):

**Schema Patterns (detected by `src/hooks/schema-drift.ts`):**
- SQL: `CREATE TABLE`, `ALTER TABLE ... ADD COLUMN`, `DROP TABLE`, `CREATE INDEX`
- Prisma: `model <Name> {`
- Django: `class <Name>(models.Model)`

**Validation Patterns (detected by `src/hooks/rule-check.ts`):**
- Zod: `z.object()`, `z.string()`, etc.
- Yup: `yup.object()`, `yup.string()`, etc.
- Joi: `Joi.object()`, `Joi.string()`, etc.
- Pydantic: `@validator()`, `@field_validator()`
- Java: `@Valid`, `@NotNull`
- ORM: `@Column(nullable: false)`
- class-validator: `@IsNotEmpty()`
- express-validator: `body('...').not`
- SQL: `CHECK()`, `NOT NULL`, `UNIQUE`

---

*Integration audit: 2026-04-06*

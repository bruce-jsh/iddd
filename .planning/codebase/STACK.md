# Technology Stack

**Analysis Date:** 2026-04-06

## Languages

**Primary:**
- TypeScript 5.8+ - All source code (`src/`, `bin/`, `scripts/`, `tests/`)

**Secondary:**
- JavaScript (ESM) - Generated/bundled hook outputs in `templates/hooks/`
- HTML - Generated preview files (rendered by `src/preview/renderer.ts`)
- Mermaid - ERD diagram syntax parsed from markdown specs

## Runtime

**Environment:**
- Node.js >= 18 (esbuild target: `node18`, runtime: v22.20.0 on dev machine)
- ESM-only (`"type": "module"` in `package.json`)

**Package Manager:**
- npm 11.7.0
- Lockfile: `package-lock.json` (present, gitignored)

## Frameworks

**Core:**
- None - Pure Node.js standard library. No Express, Fastify, or other frameworks. The HTTP server in `src/preview/server.ts` uses `node:http` directly.

**Testing:**
- Vitest 3.1+ - Test runner and assertion library
- Config: `vitest.config.ts`

**Build/Dev:**
- TypeScript 5.8+ - Primary compiler (`tsc`), outputs to `dist/`
- esbuild 0.25+ - Bundles hook entry points into self-contained ESM scripts for `templates/hooks/`

## Key Dependencies

**Critical:**
- Zero runtime dependencies. `package.json` has no `dependencies` field. The published package ships only compiled JS and templates.

**Dev Dependencies (all 4):**
- `@types/node` ^25.5.2 - Node.js type definitions
- `esbuild` ^0.25.0 - Hook bundler (used by `scripts/build-hooks.ts`)
- `typescript` ^5.8.0 - Compiler
- `vitest` ^3.1.0 - Test framework

## Build System

**TypeScript Compilation:**
- Config: `tsconfig.json`
- Target: ES2022
- Module: Node16
- Module Resolution: Node16
- Output: `dist/`
- Root: `.` (includes `bin/`, `src/`, `scripts/`)
- Strict mode: enabled
- Source maps: enabled
- Declaration files: enabled

**Hook Bundling:**
- Script: `scripts/build-hooks.ts` (run as `node dist/scripts/build-hooks.js` after tsc)
- Uses esbuild to bundle 4 entry points into standalone ESM executables:
  - `src/hooks/pre-commit-entry.ts` -> `templates/hooks/pre-commit`
  - `src/hooks/post-commit-entry.ts` -> `templates/hooks/post-commit`
  - `src/hooks/claude-pretool-entry.ts` -> `templates/hooks/iddd-schema-drift.js`
  - `src/hooks/claude-stop-entry.ts` -> `templates/hooks/iddd-auto-audit.js`
- All bundles get `#!/usr/bin/env node` banner and chmod 755

**Build Commands:**
```bash
npm run build              # tsc && node dist/scripts/build-hooks.js
npm run build:cli          # tsc only
npm run build:hooks        # node dist/scripts/build-hooks.js only
npm run test               # vitest run
npm run test:watch         # vitest (watch mode)
```

**Version Automation:**
- Script: `scripts/update-version.ts`
- Triggered by `npm version` via package.json `"version"` script
- Replaces semver patterns (`vX.Y.Z`) across 5 README files:
  - `README.md`, `README.ko-KR.md`, `README.zh-CN.md`, `README.ja-JP.md`, `README.tr-TR.md`
- Auto-stages modified READMEs for the version commit

## Configuration

**Environment:**
- Single env var: `IDDD_SKIP_HOOKS=1` - Disables all hook enforcement (logged to `.iddd/skip-history.log`)
- No `.env` file exists or is expected
- No API keys, database connections, or external service credentials required

**Build:**
- `tsconfig.json` - TypeScript compiler config
- `vitest.config.ts` - Test config (test timeout: 10000ms, pattern: `tests/**/*.test.ts`)

**Runtime Config (deployed to target projects):**
- `.claude/hooks/hook-config.json` - Hook behavior config (schema-drift patterns, rule-check patterns, auto-audit interval)
- `.claude/settings.local.json` - Claude Code hook registration (injected by `src/init.ts`)

## Published Package

**Name:** `id3-cli`
**Version:** 0.9.3
**License:** MIT
**Binary:** `id3-cli` (maps to `dist/bin/cli.js`)
**Published Files:**
- `dist/` - Compiled JS, declarations, source maps
- `templates/` - IDDD project scaffolding (skills, hooks, specs, steering, docs)
- `assets/` - ASCII banner art (`banner.txt`)

**Install and Run:**
```bash
npx id3-cli@latest           # Run in target project directory
npx id3-cli@latest init .    # Explicit init with target dir
npx id3-cli@latest --no-symlink  # Windows fallback (copy instead of symlink)
```

## Platform Requirements

**Development:**
- Node.js >= 18
- npm (any recent version)
- Git (for hook installation and schema drift detection)
- Unix-like OS recommended (symlinks used; `--no-symlink` flag available for Windows)

**Production/Target Projects:**
- Node.js >= 18 (hooks are standalone ESM bundles)
- Git repository (required for git hooks and diff analysis)
- One of: Claude Code CLI (`claude`), OpenAI Codex CLI (`codex`), or Google Antigravity
- Platform detection: `src/init.ts` runs `which claude` and `which codex` to auto-detect

---

*Stack analysis: 2026-04-06*

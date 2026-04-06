# Coding Conventions

**Analysis Date:** 2026-04-06

## Naming Patterns

**Files:**
- Use `kebab-case.ts` for all source files: `schema-drift.ts`, `auto-audit.ts`, `ui-gate.ts`
- Entry point files use the `-entry` suffix: `claude-pretool-entry.ts`, `pre-commit-entry.ts`
- Test files mirror source path with `.test.ts` suffix: `src/hooks/shared.ts` -> `tests/hooks/shared.test.ts`

**Functions:**
- Use `camelCase` for all functions: `parseGitDiff()`, `isSchemaFile()`, `runSchemaDrift()`
- Prefix boolean-returning functions with `is`, `has`, `should`: `isSkipHooks()`, `shouldRunAudit()`
- Prefix runner/action functions with `run`: `runSchemaDrift()`, `runAutoAudit()`, `runRuleCheck()`, `runSevenPillarGate()`
- Prefix rendering functions with `render`: `renderErdHtml()`, `renderMockupHtml()`, `renderUiAuditHtml()`
- Prefix parsing functions with `parse`: `parseGitDiff()`, `parseHookInput()`, `parseUiStructure()`
- Helper functions that are not exported use plain `camelCase`: `wireframe()`, `auditCard()`, `pluralize()`

**Variables:**
- Use `camelCase` for all variables and parameters: `projectRoot`, `hookInput`, `filePath`
- Use `UPPER_SNAKE_CASE` for module-level constants/arrays: `VALIDATION_PATTERNS`, `SAMPLE_NAMES`, `GENERIC_TERMS`, `SPACING_SCALE`

**Types/Interfaces:**
- Use `PascalCase` for all interfaces and types: `HookConfig`, `SchemaChange`, `InitResult`
- Prefix interfaces with descriptive nouns, not `I`: `DiffEntry` not `IDiffEntry`
- Use `interface` (not `type`) for object shapes: `export interface InitOptions { ... }`
- Suffix result/output types with `Result` or `Data`: `InitResult`, `GateResult`, `UiStructureData`
- Suffix definition types with `Def`: `EntityDef`, `AttributeDef`, `ScreenDef`
- Suffix entry types with `Entry`: `DiffEntry`, `ScreenEntry`, `TraceabilityEntry`

## Code Style

**Formatting:**
- No dedicated formatter tool (no Prettier, no ESLint, no Biome configured)
- 2-space indentation throughout all TypeScript files
- Single quotes for strings: `'utf-8'`, `'node:path'`
- Trailing commas in multi-line arrays and object literals
- Semicolons required at end of statements
- Max line length is approximately 120 characters (soft limit, no enforcement)

**Linting:**
- No linting tool is configured
- TypeScript `strict: true` in `tsconfig.json` provides type-level strictness
- Rely on `tsc` for compile-time correctness

**TypeScript Strictness:**
- `strict: true` enabled in `tsconfig.json`
- Target: `ES2022`, Module: `Node16`, ModuleResolution: `Node16`
- `declaration: true` and `sourceMap: true` for published package output
- Empty `catch` blocks are acceptable when errors are expected: `catch {}` or `catch { return false; }`

## Import Organization

**Order:**
1. Node.js built-in modules using `node:` prefix: `import { join } from 'node:path';`
2. Internal modules with explicit `.js` extension: `import { box } from '../utils/ascii.js';`

**Key Rules:**
- Always use the `node:` prefix for Node built-ins: `'node:fs/promises'`, `'node:path'`, `'node:http'`
- Always use the `.js` extension on internal imports (required by Node16 module resolution): `'./shared.js'`, `'../utils/fs.js'`
- Use named imports exclusively; no default imports exist in the codebase
- Import types inline with the `type` keyword when importing only types: `import { type HookInput } from './shared.js';`

**Path Aliases:**
- No path aliases configured. All imports use relative paths.

## Error Handling

**Patterns:**
- Use `try/catch` with empty catch blocks for expected failures (file not found, invalid JSON, command not found). The catch block returns a sensible default:
  ```typescript
  // Pattern: return default on failure
  try {
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content) as HookConfig;
  } catch {
    return null;
  }
  ```
- Never throw errors from public API functions. Functions return `null`, `false`, empty arrays, or default strings on failure.
- Entry point files (`*-entry.ts`) catch top-level errors and log to `console.error` with a prefix, then `process.exit(0)` to avoid blocking:
  ```typescript
  main().catch((err) => {
    console.error('IDDD claude-pretool hook error:', err);
    process.exit(0); // don't block on errors
  });
  ```
- Git hook entry points (`pre-commit-entry.ts`) exit with code 1 on failure to block the commit:
  ```typescript
  main().catch((err) => {
    console.error('IDDD pre-commit hook error:', err);
    process.exit(1);
  });
  ```
- Claude Code hook entry points exit with code 0 even on error to avoid blocking the AI agent.

**Error communication:**
- Use `printBlock()` for blocking errors (commit will be rejected)
- Use `printWarn()` for warnings (commit proceeds, but user is notified)
- Both output to `console.error`, not `console.log`

## Logging

**Framework:** `console` (no logging library)

**Patterns:**
- Use `console.log()` for success messages and banners in the CLI: `console.log(banner(version))`, `console.log(box(content, ...))`
- Use `console.error()` for hook output (warnings and blocks) via `printBlock()` and `printWarn()` in `src/hooks/shared.ts`
- Build scripts use `console.log()` for success and `console.error()` for failures
- No structured logging, log levels, or log file output

## Comments

**When to Comment:**
- Use section divider comments with Unicode box-drawing for visual separation of logical groups within a file:
  ```typescript
  // -- Types --------------------------------------------------
  // -- Scoring logic ------------------------------------------
  // -- Report generation --------------------------------------
  ```
- Use JSDoc-style `/** */` comments sparingly, only for entry point context:
  ```typescript
  /**
   * Git Hook mode: extract file list from git diff --cached
   */
  export async function runSchemaDrift(...) { ... }
  ```
- Inline comments explain non-obvious logic: `// Only trivial changes (indexes, etc.)`
- No JSDoc on interfaces, types, or utility functions

**Section Dividers:**
- Used in larger files (`ui-gate.ts`, `ui-auditor.ts`, `mockup-generator.ts`, `shared.ts`) to separate logical blocks
- Format: `// -- Section Name --` with em-dashes extending to approximately column 55

## Function Design

**Size:**
- Functions are generally short (10-40 lines)
- Larger functions exist for HTML rendering (`renderEntityMockupHtml` at ~150 lines, `runSevenPillarGate` at ~100 lines) but these are template generators
- Pure logic functions are kept concise

**Parameters:**
- Use an `options` object pattern for functions with optional parameters:
  ```typescript
  export async function initProject(
    targetDir: string,
    options: InitOptions = {}
  ): Promise<InitResult> { ... }
  ```
- Destructure options with defaults at the top of the function:
  ```typescript
  const { templatesDir: tplDir, overwrite = false, skipGitHooks = false } = options;
  ```
- Required parameters come first, options object comes last

**Return Values:**
- Async functions return `Promise<T>` with explicit return types
- Boolean-returning functions indicate success/failure or match/no-match
- Functions that might fail return `T | null` (e.g., `parseHookInput` returns `HookInput | null`)
- Void functions handle side effects (writing files, printing output)

## Module Design

**Exports:**
- Use named exports exclusively: `export async function initProject(...)`, `export interface InitResult`
- Export both functions and their associated interfaces/types from the same file
- No default exports anywhere in the codebase
- Private helper functions are not exported (e.g., `commandExists`, `wireframe`, `pluralize`)

**Barrel Files:**
- No barrel files (`index.ts`) exist. Each module is imported directly by path.

**Module Organization:**
- One module per logical concern: `schema-drift.ts` handles schema drift detection, `rule-check.ts` handles validation rule detection
- Entry point files (`*-entry.ts`) are thin wrappers that import from logic modules and handle stdin/process lifecycle
- Shared utilities live in `src/hooks/shared.ts` (for hook-related code) and `src/utils/` (for general utilities)

## Async Patterns

- Use `async/await` throughout; no callback-style or raw Promise chains
- Use `import('node:fs/promises')` for dynamic imports when a module is needed conditionally
- Use `for await...of` for streaming stdin: `for await (const chunk of process.stdin) { ... }`

## Project-Specific Conventions

**ESM-first:**
- Package type is `"module"` in `package.json`
- All files use ESM imports/exports
- `import.meta.dirname` and `import.meta.url` used for path resolution relative to current file

**Hook architecture:**
- Logic modules export pure/testable functions (e.g., `analyzeSchemaChanges`, `detectValidationPatterns`)
- Entry modules handle process lifecycle (stdin reading, exit codes)
- This separation enables testing logic without process-level side effects

---

*Convention analysis: 2026-04-06*

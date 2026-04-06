# Testing Patterns

**Analysis Date:** 2026-04-06

## Test Framework

**Runner:**
- Vitest 3.x (currently 3.2.4 installed, `^3.1.0` in devDependencies)
- Config: `vitest.config.ts`

**Assertion Library:**
- Vitest built-in `expect` (Chai-compatible API)

**Run Commands:**
```bash
npm test                # Run all tests once (vitest run)
npm run test:watch      # Watch mode (vitest)
```

## Test File Organization

**Location:**
- Separate `tests/` directory that mirrors `src/` structure

**Naming:**
- `{source-name}.test.ts` pattern matching the source file name

**Structure:**
```
tests/
├── hooks/
│   ├── shared.test.ts                 # mirrors src/hooks/shared.ts
│   ├── schema-drift.test.ts           # mirrors src/hooks/schema-drift.ts
│   ├── rule-check.test.ts             # mirrors src/hooks/rule-check.ts
│   ├── auto-audit.test.ts             # mirrors src/hooks/auto-audit.ts
│   ├── claude-pretool-entry.test.ts   # mirrors src/hooks/claude-pretool-entry.ts
│   └── claude-stop-entry.test.ts      # mirrors src/hooks/claude-stop-entry.ts
├── preview/
│   ├── server.test.ts                 # mirrors src/preview/server.ts
│   ├── renderer.test.ts               # mirrors src/preview/renderer.ts
│   ├── mockup-generator.test.ts       # mirrors src/preview/mockup-generator.ts
│   ├── ui-gate.test.ts                # mirrors src/preview/ui-gate.ts
│   └── ui-auditor.test.ts             # mirrors src/preview/ui-auditor.ts
├── utils/
│   ├── fs.test.ts                     # mirrors src/utils/fs.ts
│   └── ascii.test.ts                  # mirrors src/utils/ascii.ts
└── init.test.ts                       # mirrors src/init.ts
```

**Coverage:**
- 14 test files covering 16 source files
- 98 tests total, all passing
- Not tested: `src/hooks/pre-commit-entry.ts`, `src/hooks/post-commit-entry.ts` (thin wrappers with process lifecycle)
- Not tested: `scripts/build-hooks.ts`, `scripts/update-version.ts` (build tooling)

## Test Configuration

**Vitest Config (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 10000,
  },
});
```

**Key Settings:**
- Tests excluded from TypeScript compilation (`tsconfig.json` excludes `tests`)
- Vitest handles TypeScript transformation internally
- 10-second timeout per test (default would be 5s; raised for filesystem operations)

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('functionName', () => {
  // Optional setup/teardown for filesystem tests
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'iddd-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true });
  });

  it('describes expected behavior in plain English', () => {
    const result = functionUnderTest(input);
    expect(result).toBe(expected);
  });
});
```

**Patterns:**
- One `describe` block per exported function or logical group
- `it()` descriptions use present tense: `'returns true for existing file'`, `'detects table/column additions in prisma'`
- Setup/teardown only when filesystem is involved; pure function tests have no setup
- Group related assertions within a single `it()` block when testing one behavior

**Test Naming Convention:**
- Describe blocks use the function name: `describe('parseGitDiff', ...)`
- Integration tests use a descriptive group name: `describe('claude-pretool-entry integration', ...)`
- `it()` blocks describe outcome, not implementation: `'copies files preserving directory structure'`

## Mocking

**Framework:** No mocking framework used

**Approach:**
- Tests exercise real code paths with real filesystem operations
- No `vi.mock()`, `vi.fn()`, or `vi.spyOn()` used anywhere in the test suite
- External dependencies (git commands via `execSync`) are avoided in tests by testing the pure logic functions instead of the runner functions
- The architecture separates logic from process lifecycle, making mocking unnecessary

**What to Mock:**
- Nothing is mocked. The codebase design avoids the need for mocks.

**What NOT to Mock:**
- File system operations: use real temp directories instead
- Function behavior: test real implementations

## Fixtures and Factories

**Test Data:**
- Inline test data within each test, no shared fixture files
- Use string literals for diff content, JSON, and markdown:
  ```typescript
  it('detects ALTER TABLE in SQL', () => {
    const diff = `
  +ALTER TABLE users ADD COLUMN phone TEXT;
  `;
    const changes = analyzeSchemaChanges(diff, 'migrations/002.sql');
    expect(changes.length).toBe(1);
  });
  ```

- Use typed inline objects for complex data structures:
  ```typescript
  const entities: EntityDef[] = [
    {
      name: 'User',
      attributes: [
        { name: 'id', type: 'UUID', constraints: ['PK'] },
        { name: 'email', type: 'VARCHAR', constraints: ['NOT NULL', 'UNIQUE'], maxLength: 200 },
      ],
      relationships: [{ target: 'Post', type: '1:N', fk: 'user_id' }],
      stateTransitions: [{ from: 'pending', to: 'active' }],
    },
  ];
  ```

- Use spread operator for variations on a base fixture:
  ```typescript
  const incompleteStructure: UiStructureData = {
    ...validStructure,
    entityCoverage: '1/2 (50%)',
    traceabilityMatrix: [{ entity: 'User', screens: { List: '/users' } }],
  };
  ```

**Location:**
- All test data is defined inline within test files. No `__fixtures__/` or `factories/` directories exist.

## Temporary File Handling

**Pattern:**
- Use `mkdtemp` from `node:fs/promises` with a descriptive prefix for each test suite:
  ```typescript
  tempDir = await mkdtemp(join(tmpdir(), 'iddd-test-'));
  ```
- Clean up in `afterEach` with `rm(tempDir, { recursive: true })`
- Create necessary subdirectories with `mkdir(..., { recursive: true })` in `beforeEach`
- Temp directory prefixes indicate the module: `iddd-test-`, `iddd-src-`, `iddd-init-`, `iddd-srv-`, `iddd-audit-`, `iddd-pretool-`, `iddd-stop-`, `iddd-sym-`

## Coverage

**Requirements:** No coverage threshold enforced

**No coverage configuration** in `vitest.config.ts` or `package.json`. No `--coverage` script defined.

## Test Types

**Unit Tests:**
- Majority of tests (12 of 14 files) are unit tests
- Test pure functions with inline inputs and expected outputs
- Examples: `parseGitDiff()`, `analyzeSchemaChanges()`, `detectValidationPatterns()`, `mapAttributeToWidget()`, `scorePillar()`, `runSevenPillarGate()`

**Integration Tests:**
- `tests/init.test.ts`: Tests `initProject()` end-to-end with real filesystem (temp dirs, template copying, overwrite detection)
- `tests/preview/server.test.ts`: Starts a real HTTP server, sends a `fetch` request, asserts response content
- `tests/hooks/claude-pretool-entry.test.ts`: Tests the hook input parsing + schema drift detection pipeline with real config files
- `tests/hooks/claude-stop-entry.test.ts`: Tests the auto-audit pipeline with real counter files

**E2E Tests:**
- Not used. The CLI entry point (`bin/cli.ts`) is not tested.

## Common Patterns

**Async Testing:**
```typescript
it('copies templates to target directory', async () => {
  await initProject(tempDir, { templatesDir, skipGitHooks: true });
  expect(await readFile(join(tempDir, 'CLAUDE.md'), 'utf-8')).toBe('# IDDD');
});
```

**Error/Edge Case Testing:**
```typescript
it('returns empty array for empty diff', () => {
  expect(parseGitDiff('')).toEqual([]);
});

it('returns null for invalid JSON', () => {
  expect(parseHookInput('not-json')).toBeNull();
});

it('returns empty string if no mermaid block', () => {
  expect(extractMermaidBlock('# No diagram here')).toBe('');
});
```

**HTML Output Testing:**
```typescript
it('generates valid HTML with mermaid', () => {
  const html = renderErdHtml('erDiagram\n  A ||--o{ B : rel', 'Test ERD');
  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('mermaid');
  expect(html).toContain('erDiagram');
  expect(html).toContain('Test ERD');
});
```
- HTML tests use `toContain()` to verify key elements are present
- No DOM parsing or snapshot testing

**Boolean Result Testing:**
```typescript
it('matches prisma schema', () => {
  expect(isSchemaFile('prisma/schema.prisma', patterns)).toBe(true);
});

it('does not match unrelated files', () => {
  expect(isSchemaFile('src/utils/helper.ts', patterns)).toBe(false);
});
```

**Collection Testing:**
```typescript
it('derives List View for every entity', () => {
  const screens = deriveScreensFromEntities(entities);
  const listScreen = screens.find(s => s.entity === 'User' && s.pattern === 'list');
  expect(listScreen).toBeDefined();
  expect(listScreen!.url).toBe('/users');
});
```
- Use `.find()` to locate specific items in arrays, then assert properties
- Use non-null assertion `!` after `toBeDefined()` check

**Filesystem Testing:**
```typescript
it('creates a relative symlink', async () => {
  const target = join(tempDir, 'original.txt');
  const link = join(tempDir, 'sub', 'link.txt');
  await writeFile(target, 'content');
  await mkdir(join(tempDir, 'sub'));

  await createSymlink(target, link);

  const linkTarget = await readlink(link);
  expect(linkTarget).toBe('../original.txt');
  expect(await readFile(link, 'utf-8')).toBe('content');
});
```

**Network Testing:**
```typescript
it('serves HTML files from preview directory', async () => {
  // ... setup temp dir with HTML file ...
  const { port, close } = await startPreviewServer(previewDir);
  closeServer = close;

  const res = await fetch(`http://localhost:${port}/test`);
  expect(res.status).toBe(200);
  const body = await res.text();
  expect(body).toContain('Hello');
});
```
- Server tests use port 0 (auto-assign) to avoid conflicts
- Store `close` function for cleanup in `afterEach`

## Writing New Tests

**When adding a new source file:**
1. Create a corresponding test file at `tests/{path}/{name}.test.ts`
2. Import functions directly from the source module using `../../src/` relative path with `.js` extension
3. Write one `describe` block per exported function
4. Use inline test data; avoid shared fixtures
5. For filesystem operations, use `mkdtemp` with `iddd-{context}-` prefix
6. Clean up temp directories in `afterEach`
7. Test pure logic functions directly; test integration functions with real (but temporary) file structures

**When adding a new hook:**
- Test the pure logic function (e.g., `analyzeSchemaChanges`) in a unit test
- Test the runner function (e.g., `runSchemaDrift`) with a real config file in a temp directory
- Do not test the entry point file (`*-entry.ts`) directly; it handles process stdin/exit

---

*Testing analysis: 2026-04-06*

# Phase 1: Global Install & Skill Registration - Research

**Researched:** 2026-04-06
**Domain:** npm global CLI packaging + Claude Code skill registration
**Confidence:** HIGH

## Summary

Phase 1 transforms id3-cli from an npx-only template copier into a globally installable npm package that automatically registers two Claude Code skills (`/id3-start` and `/id3-clear`) at `~/.claude/skills/`. The core technical challenges are: (1) choosing the right skill registration mechanism (postinstall vs explicit CLI subcommand), (2) handling template path resolution correctly under global install symlinks, (3) cross-platform `~/.claude/skills/` path resolution, and (4) cleanup on uninstall given npm's lack of uninstall lifecycle scripts since v7.

The research points to a hybrid approach: provide both `postinstall` auto-registration and explicit `id3-cli install-skills` / `id3-cli uninstall-skills` subcommands. The postinstall handles the happy path (most users), while the explicit commands serve as fallback for `--ignore-scripts` users and as the only cleanup path since npm v7+ does not support preuninstall scripts. The `id3-cli uninstall-skills` command must be documented as a required manual step before `npm uninstall -g id3-cli`.

The existing codebase already handles most of the global install mechanics correctly. `import.meta.dirname` resolves symlinks in Node.js 22, so the bin symlink from global install resolves to the actual package location. The main code changes are: adding subcommand parsing to `bin/cli.ts`, creating a `skills-global/` directory for the two global skills, writing the registration/unregistration logic, and updating `package.json` (files, scripts).

**Primary recommendation:** Use a dual strategy -- postinstall for automatic registration on `npm i -g`, plus explicit `id3-cli install-skills` / `id3-cli uninstall-skills` commands for manual control and cleanup. Keep the single `id3-cli` bin entry with subcommands rather than multiple bin entries.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INST-01 | `npm i -g id3-cli` installs CLI and skill files together | bin field unchanged, files array updated to include `skills-global/`, postinstall copies to `~/.claude/skills/` |
| INST-02 | Global install auto-registers `~/.claude/skills/id3-start/SKILL.md` | postinstall script copies from `skills-global/id3-start/` to `~/.claude/skills/id3-start/` |
| INST-03 | Global install auto-registers `~/.claude/skills/id3-clear/SKILL.md` | postinstall script copies from `skills-global/id3-clear/` to `~/.claude/skills/id3-clear/` |
| INST-04 | `npx id3-cli` backward compatibility maintained | bin field unchanged, npx does not trigger postinstall, existing init flow preserved |
| INST-05 | Cross-platform path handling (macOS, Linux, Windows) | `os.homedir()` + `path.join()` for `~/.claude/skills/`, auto-detect Windows for copy-instead-of-symlink |
| INST-06 | `npm uninstall -g id3-cli` cleans up skill files | npm v7+ does NOT support preuninstall -- must use `id3-cli uninstall-skills` explicit command, documented as required pre-uninstall step |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | >= 22.x | Runtime | Already in use, `import.meta.dirname` stable since 20.11 |
| TypeScript | ^5.8.x | Language | Already in use, no changes needed |
| tsc | (bundled with TS) | Build tool | Already in use, produces clean ESM for `dist/` |
| Vitest | ^3.1.x | Test framework | Already in use, ESM-native, fast |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `node:os` | built-in | `os.homedir()` for cross-platform home dir | Skill registration path resolution |
| `node:path` | built-in | `path.join()` for cross-platform paths | All path construction |
| `node:fs/promises` | built-in | File copy, mkdir, access, rm | Skill file registration and cleanup |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual subcommand parsing | commander/yargs | Only 3-4 subcommands; hand-parsing is simpler and avoids adding a runtime dependency to a zero-dependency package |
| postinstall auto-registration | Plugin system (plugin.json) | Plugins force namespaced commands (`/id3-cli:id3-start`); global skills give clean `/id3-start` names |
| postinstall auto-registration | Explicit-only `install-skills` | Misses the "just works" experience; most users expect `npm i -g` to set everything up |

**Installation:**
```bash
# No new dependencies needed. Zero runtime deps maintained.
```

**Version verification:** All dependencies are already in the project and verified current via `npm view`. Node.js 22.20.0 is running. TypeScript 5.8.x and Vitest 3.1.x are already in devDependencies.

## Architecture Patterns

### Recommended Project Structure (Changes Only)
```
iddd/
  bin/
    cli.ts                          # MODIFIED - add subcommand routing
  src/
    init.ts                         # UNCHANGED
    register-skills.ts              # NEW - skill registration/unregistration logic
    utils/
      fs.ts                         # UNCHANGED (reuse copyDir, fileExists)
      ascii.ts                      # MINOR - add help text
  scripts/
    postinstall.ts                  # NEW - auto-register on npm i -g
  skills-global/                    # NEW - source for global-scope skills
    id3-start/
      SKILL.md                      # Placeholder (Phase 2 populates content)
    id3-clear/
      SKILL.md                      # Placeholder (Phase 2 populates content)
```

### Pattern 1: Subcommand Routing in bin/cli.ts
**What:** Parse `process.argv` for subcommands (init, install-skills, uninstall-skills, --help, --version) before dispatching to the appropriate handler.
**When to use:** CLI entry point for all user interactions.
**Example:**
```typescript
// bin/cli.ts
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'install-skills':
    await registerSkills();
    break;
  case 'uninstall-skills':
    await unregisterSkills();
    break;
  case '--help':
  case '-h':
    printHelp();
    break;
  case '--version':
  case '-v':
    printVersion();
    break;
  case 'init':
  default:
    // Existing init flow (backward compat)
    await runInit(args);
    break;
}
```

### Pattern 2: Skill Registration via File Copy
**What:** Copy skill directories from `skills-global/` (inside the npm package) to `~/.claude/skills/` (user's personal skills directory).
**When to use:** During postinstall and `id3-cli install-skills`.
**Example:**
```typescript
// src/register-skills.ts
import { homedir } from 'node:os';
import { join } from 'node:path';
import { copyDir, fileExists } from './utils/fs.js';
import { rm } from 'node:fs/promises';

const GLOBAL_SKILLS = ['id3-start', 'id3-clear'];

export function getSkillsTargetDir(): string {
  return join(homedir(), '.claude', 'skills');
}

export function getSkillsSourceDir(): string {
  // When compiled: dist/src/register-skills.js
  // Package root: ../../ from dist/src/
  return join(import.meta.dirname, '..', '..', 'skills-global');
}

export async function registerSkills(): Promise<void> {
  const source = getSkillsSourceDir();
  const target = getSkillsTargetDir();

  for (const skill of GLOBAL_SKILLS) {
    const src = join(source, skill);
    const dest = join(target, skill);
    await copyDir(src, dest, { overwrite: true });
  }
}

export async function unregisterSkills(): Promise<void> {
  const target = getSkillsTargetDir();

  for (const skill of GLOBAL_SKILLS) {
    const dest = join(target, skill);
    if (await fileExists(dest)) {
      await rm(dest, { recursive: true });
    }
  }
}
```

### Pattern 3: Postinstall Script (Thin Wrapper)
**What:** The postinstall script calls `registerSkills()` and handles errors gracefully (non-blocking).
**When to use:** Automatically on `npm i -g id3-cli`.
**Example:**
```typescript
// scripts/postinstall.ts
import { registerSkills } from '../src/register-skills.js';

try {
  await registerSkills();
  console.log('id3-cli: Skills registered at ~/.claude/skills/');
} catch (err) {
  // Non-fatal: user can run `id3-cli install-skills` manually
  console.warn('id3-cli: Could not auto-register skills.');
  console.warn('  Run `id3-cli install-skills` manually.');
}
```

### Pattern 4: Graceful Postinstall Failure
**What:** The postinstall script must NEVER cause `npm i -g` to fail. If skill registration fails (permissions, missing dir), log a warning and suggest manual registration.
**When to use:** Always in postinstall scripts.
**Why:** A failing postinstall blocks the entire npm install. The CLI itself is still usable without global skills.

### Anti-Patterns to Avoid
- **Multiple bin entries for subcommands:** Adding `"id3-init": "dist/bin/init.js"` etc. breaks npx resolution and adds confusion. Use a single bin entry with subcommand parsing.
- **Symlinks for global skill registration:** Symlinks from `~/.claude/skills/` to the npm package directory are fragile -- they break if npm relocates or removes the package directory. Use file copies.
- **Blocking postinstall on failure:** Never `process.exit(1)` in postinstall for non-critical operations like skill registration.
- **Writing absolute paths in skill files:** SKILL.md content should use `${CLAUDE_SKILL_DIR}` to reference supporting files, not absolute paths.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Home directory resolution | Custom `~` expansion logic | `os.homedir()` from `node:os` | Handles Windows `USERPROFILE`, macOS/Linux `$HOME`, edge cases |
| Recursive directory copy | Custom traversal | Existing `copyDir()` in `src/utils/fs.ts` | Already tested, handles overwrite flag |
| CLI argument parsing (if > 5 commands) | Manual switch statement | `commander` or `yargs` | Only applicable if commands grow beyond current scope |
| Cross-platform path joining | String concatenation with `/` | `path.join()` | Handles Windows `\` separator automatically |

**Key insight:** The project already has well-tested utilities (`copyDir`, `fileExists`, `createSymlink`) that should be reused for skill registration. No new utilities are needed.

## Common Pitfalls

### Pitfall 1: npm v7+ Has No Uninstall Lifecycle Scripts
**What goes wrong:** INST-06 requires cleanup on `npm uninstall -g id3-cli`. But npm v7+ (current: v11.7.0) explicitly does NOT support `preuninstall` or `postuninstall` scripts. They are documented as "not implemented and will not function."
**Why it happens:** npm removed uninstall scripts due to ambiguous execution context (direct uninstall vs dependency removal vs version dedup).
**How to avoid:** Implement `id3-cli uninstall-skills` as an explicit command. Document it as a required step before `npm uninstall -g id3-cli`. Optionally, add a cleanup reminder in the README and in the `--help` output.
**Warning signs:** Users finding orphaned `~/.claude/skills/id3-start/` and `~/.claude/skills/id3-clear/` directories after global uninstall.

### Pitfall 2: postinstall Skipped by --ignore-scripts Users
**What goes wrong:** Security-conscious users and corporate environments run `npm install --ignore-scripts`. pnpm v10 disables lifecycle scripts by default. These users get the CLI binary but no skill registration.
**Why it happens:** postinstall is a known attack vector; many users disable it.
**How to avoid:** After global install, `id3-cli --help` should mention `install-skills` subcommand. The postinstall should be non-critical (the CLI works without it).
**Warning signs:** Users reporting "id3-start slash command not found" after global install.

### Pitfall 3: Template Path Resolution Under Global Install
**What goes wrong:** `import.meta.dirname` resolves to the actual file location (symlinks resolved), which is correct for global installs. But the relative path `../../templates` from `dist/src/init.js` assumes the `templates/` directory exists at the package root. If `files` field in `package.json` is misconfigured, `templates/` may not be included in the published package.
**Why it happens:** `files` is a whitelist. Missing entries silently exclude directories.
**How to avoid:** Add `skills-global/` to the `files` array. Run `npm pack --dry-run` to verify all required files are included. Add this check to CI.
**Warning signs:** "Works locally, fails after npm install" pattern.

### Pitfall 4: Skill Naming Collision Between Scopes
**What goes wrong:** If `id3-start` exists in both `~/.claude/skills/` (global/personal) and `.claude/skills/` (project), personal scope wins and project customizations are ignored. Priority: enterprise > personal > project.
**Why it happens:** Claude Code's name-based skill resolution with fixed priority order.
**How to avoid:** Only `id3-start` and `id3-clear` go global. The existing 6 phase skills stay project-scoped only. No overlap in names.
**Warning signs:** This is not a problem for Phase 1 since the global skills (`id3-start`, `id3-clear`) are distinct from the project skills (`id3-identify-entities`, etc.).

### Pitfall 5: Hook Absolute Paths (Pre-existing Bug)
**What goes wrong:** `injectClaudeHooks()` writes absolute paths (`node "/Users/bruce/project/hooks/iddd-schema-drift.js"`) into `.claude/settings.local.json`. These break on machine transfer, directory rename, or container use.
**Why it happens:** `join(targetDir, ...)` resolves to absolute path.
**How to avoid:** Switch to relative paths: `node ./hooks/iddd-schema-drift.js`. Claude Code hook commands execute with project root as cwd, so relative paths work.
**Warning signs:** Hook errors on different machines. This is a pre-existing bug that should be fixed as part of Phase 1 cleanup.

### Pitfall 6: Windows Symlink Auto-Detection
**What goes wrong:** The current `--no-symlink` flag is opt-in. Windows users who forget the flag get permission errors when creating symlinks (requires admin/Developer Mode).
**Why it happens:** Symlinks are a Unix concept with incomplete Windows support.
**How to avoid:** Auto-detect Windows (`process.platform === 'win32'`) and default to copy mode. The `--no-symlink` flag becomes unnecessary for most users.

## Code Examples

Verified patterns from official sources:

### Cross-Platform Home Directory Resolution
```typescript
// Source: Node.js os module docs
import { homedir } from 'node:os';
import { join } from 'node:path';

const skillsDir = join(homedir(), '.claude', 'skills');
// macOS:   /Users/bruce/.claude/skills
// Linux:   /home/bruce/.claude/skills
// Windows: C:\Users\bruce\.claude\skills
```

### SKILL.md Frontmatter Format
```yaml
# Source: https://code.claude.com/docs/en/skills
---
name: id3-start
description: >
  Smart entry point for IDDD workflow. Analyzes your request and routes to
  the right IDDD phase. Use for starting work, guided IDDD workflow, or
  when unsure which phase to use.
  Trigger: start project, begin development, what should I do next
user-invocable: true
allowed-tools: Read Glob Grep Bash Write Edit
---

# Skill content here...
Use $ARGUMENTS to access user input.
Use ${CLAUDE_SKILL_DIR} to reference files in the skill directory.
```

### Skill Directory Structure
```
# Source: https://code.claude.com/docs/en/skills
~/.claude/skills/
  id3-start/
    SKILL.md                    # Required entry point
    references/                 # Optional supporting files
      phase-guide.md            # Referenced from SKILL.md
  id3-clear/
    SKILL.md                    # Required entry point
```

### package.json Changes Required
```json
{
  "scripts": {
    "postinstall": "node dist/scripts/postinstall.js"
  },
  "files": [
    "dist/",
    "templates/",
    "assets/",
    "skills-global/"
  ]
}
```

### import.meta.dirname Behavior with Global Install Symlinks
```typescript
// Source: Node.js ESM docs
// When bin/cli.js is symlinked from /usr/local/bin/id3-cli
// to /usr/local/lib/node_modules/id3-cli/dist/bin/cli.js,
// import.meta.dirname resolves to the REAL path (symlink resolved):
// /usr/local/lib/node_modules/id3-cli/dist/bin/
//
// So relative paths like '../../templates' from dist/src/init.js
// correctly resolve to /usr/local/lib/node_modules/id3-cli/templates/
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `__dirname` (CommonJS) | `import.meta.dirname` (ESM) | Node.js 20.11 (Jan 2024) | Safe to use -- project requires Node 22+ |
| npm v6 preuninstall scripts | No uninstall lifecycle scripts | npm v7 (Feb 2021) | Must use explicit CLI command for cleanup |
| postinstall as default | pnpm v10 disables scripts by default | 2025 | Must provide manual `install-skills` fallback |
| Custom home dir logic | `os.homedir()` built-in | Node.js 6+ | Standard, reliable, cross-platform |

**Deprecated/outdated:**
- `__dirname` / `__filename`: Not available in ESM modules. Use `import.meta.dirname` / `import.meta.filename`.
- `process.env.HOME || process.env.USERPROFILE`: Use `os.homedir()` instead -- it handles all platforms correctly.
- npm `preuninstall` / `postuninstall`: Do not function in npm v7+. Must use explicit cleanup commands.

## Open Questions

1. **Postinstall vs explicit-only registration**
   - What we know: postinstall works for most users but fails silently for `--ignore-scripts` users and pnpm v10 users. Explicit `install-skills` always works.
   - What's unclear: What percentage of id3-cli's target audience uses `--ignore-scripts`? Likely small (developers using Claude Code are not enterprise security hardened).
   - Recommendation: Use BOTH. Postinstall for auto-registration, `install-skills` as documented fallback. The postinstall must be non-fatal.

2. **SKILL.md content for Phase 1**
   - What we know: Phase 2 will implement the actual skill logic (smart routing for id3-start, project reset for id3-clear).
   - What's unclear: Should Phase 1 create placeholder SKILL.md files or final content?
   - Recommendation: Create minimal placeholder SKILL.md files with correct frontmatter. Phase 2 replaces the content. This lets us test the registration pipeline end-to-end without building skill logic.

3. **Uninstall UX for INST-06**
   - What we know: npm v7+ does not support preuninstall. Cleanup requires explicit `id3-cli uninstall-skills` command.
   - What's unclear: Will users actually run `id3-cli uninstall-skills` before `npm uninstall -g`? Probably not.
   - Recommendation: Accept that orphaned files are a minor UX issue. `~/.claude/skills/id3-start/` is harmless if the CLI is uninstalled -- the skill just won't function correctly. Document the cleanup step prominently. The `id3-cli uninstall-skills` command is the best available solution.

4. **Hook absolute paths fix scope**
   - What we know: `injectClaudeHooks()` writes absolute paths (Pitfall 5). This is a pre-existing bug.
   - What's unclear: Should it be fixed in Phase 1 or deferred?
   - Recommendation: Fix it in Phase 1 since we're already modifying `init.ts` area. Relative paths (`./hooks/iddd-schema-drift.js`) are the correct approach.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^3.1.x |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INST-01 | Global install produces working CLI | integration | `npm pack && npm i -g ./id3-cli-*.tgz && id3-cli --version` | No -- Wave 0 |
| INST-02 | Skill registration creates id3-start | unit | `npx vitest run tests/register-skills.test.ts -t "registers id3-start"` | No -- Wave 0 |
| INST-03 | Skill registration creates id3-clear | unit | `npx vitest run tests/register-skills.test.ts -t "registers id3-clear"` | No -- Wave 0 |
| INST-04 | npx backward compatibility | integration | `npx vitest run tests/init.test.ts` | Yes (existing) |
| INST-05 | Cross-platform path resolution | unit | `npx vitest run tests/register-skills.test.ts -t "cross-platform"` | No -- Wave 0 |
| INST-06 | Skill unregistration cleans files | unit | `npx vitest run tests/register-skills.test.ts -t "unregisters"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green + manual `npm pack` integration test

### Wave 0 Gaps
- [ ] `tests/register-skills.test.ts` -- covers INST-02, INST-03, INST-05, INST-06 (registerSkills, unregisterSkills, path resolution)
- [ ] `tests/cli.test.ts` -- covers subcommand routing (--help, --version, install-skills, uninstall-skills)
- [ ] Manual integration test script for INST-01: `npm pack && npm i -g ./id3-cli-*.tgz && id3-cli --version && ls ~/.claude/skills/id3-start/SKILL.md`

## Sources

### Primary (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- SKILL.md format, frontmatter fields, skill discovery, scope resolution, `${CLAUDE_SKILL_DIR}`, `$ARGUMENTS`, supporting files
- [npm Scripts Documentation (local `npm help scripts`)](https://docs.npmjs.com/cli/v11/using-npm/scripts/) -- Confirmed: uninstall lifecycle scripts NOT implemented in npm v7+
- [npm CLI Issue #3042](https://github.com/npm/cli/issues/3042) -- preuninstall bug in npm v7, closed as resolved but uninstall scripts remain unimplemented by design
- [Node.js ESM Documentation](https://nodejs.org/api/esm.html) -- `import.meta.dirname` resolves symlinks, available since Node.js 20.11.0

### Secondary (MEDIUM confidence)
- [Cross-platform Node.js guide](https://github.com/ehmicky/cross-platform-node-guide) -- `os.homedir()` behavior on Windows, Linux, macOS
- [npm postinstall security risks](https://www.nodejs-security.com/blog/npm-ignore-scripts-best-practices-as-security-mitigation-for-malicious-packages) -- Trend toward disabling lifecycle scripts
- [pnpm 2025 blog](https://pnpm.io/blog/2025/12/29/pnpm-in-2025) -- pnpm v10 disables lifecycle scripts by default

### Tertiary (LOW confidence)
- None -- all findings supported by at least two independent sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero changes to existing stack, all already verified
- Architecture: HIGH -- skill registration is straightforward file copy to documented location
- Pitfalls: HIGH -- all pitfalls directly observable in codebase or confirmed by official docs (especially npm uninstall limitation)
- Skill format: HIGH -- verified against official Claude Code docs, matches existing project skills

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable domain, npm and Claude Code skill format unlikely to change)

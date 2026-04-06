# Domain Pitfalls

**Domain:** npm global CLI + Claude Code skill registration + smart routing
**Project:** id3-cli (IDDD Skill Package v2)
**Researched:** 2026-04-06

---

## Critical Pitfalls

Mistakes that cause rewrites, broken installs, or major user-facing failures.

---

### Pitfall 1: Template Path Resolution Breaks on Global Install

**What goes wrong:** The current `init.ts` resolves templates relative to the compiled file location using `import.meta.dirname`:

```typescript
const templatesDir = tplDir ?? join(import.meta.dirname, '..', '..', 'templates');
```

When running via `npx id3-cli`, the compiled code sits inside `node_modules/id3-cli/dist/src/`, and navigating up two levels reaches the package root where `templates/` lives. When installed globally via `npm i -g id3-cli`, the binary entry point (`dist/bin/cli.js`) is symlinked from the global bin directory (e.g., `/usr/local/bin/id3-cli` -> `/usr/local/lib/node_modules/id3-cli/dist/bin/cli.js`). The code in `init.ts` runs from `dist/src/init.js`, which is **not** the symlink -- Node.js resolves `import.meta.dirname` to the actual file location, not the symlink. So the path `../../templates` from `dist/src/` should still reach the package root.

However, the real danger is that `import.meta.dirname` is only available in Node.js >= 20.11.0 (released January 2024). If any user has an older Node.js version, this silently fails. More critically, if the project ever bundles with esbuild (which is already a devDependency) into a single file, `import.meta.dirname` will resolve to the bundle output directory, not the original source, and the relative path to `templates/` breaks completely.

**Why it happens:** The path relationship between compiled JS and template assets is fragile and depends on exact directory structure being preserved after `tsc` compilation.

**Consequences:**
- `id3-cli init` copies zero files or crashes with ENOENT
- Users get a blank project with no skills, specs, or hooks
- Error is silent if the code catches and ignores the missing directory

**Warning signs:**
- Template files missing after `npm i -g id3-cli && id3-cli init`
- ENOENT errors mentioning paths like `/usr/local/lib/node_modules/...`
- Works with `npx` but fails with global install

**Prevention:**
1. Add a runtime check that validates the resolved `templatesDir` actually exists before proceeding
2. Use `import.meta.url` with `fileURLToPath()` as the canonical path resolution strategy (works across all Node.js ESM versions >= 14.18)
3. If ever bundling with esbuild, use `__dirname` injection or resolve paths from `package.json` location instead
4. Add an integration test that simulates global install path resolution

**Phase:** Must be addressed in the global install conversion phase (Phase 1). This is the single most likely breakage point.

**Confidence:** HIGH -- this is directly observable in the current codebase.

---

### Pitfall 2: `postinstall` Script for Skill Registration is an Anti-Pattern

**What goes wrong:** The natural instinct for registering skills after `npm i -g id3-cli` is to use a `postinstall` script that copies SKILL.md files into `~/.claude/skills/`. This approach is dangerous for multiple reasons:

1. **Security stigma:** npm postinstall scripts are the primary vector for supply chain attacks. pnpm v10 disables them by default. Many security-conscious users run `npm install --ignore-scripts`. If skill registration depends on postinstall, these users get a broken install with no feedback.

2. **Permission failures:** postinstall runs in the package context, not the user's home directory context. Writing to `~/.claude/skills/` may fail due to permission mismatches, especially when global install uses sudo or a custom prefix.

3. **Uninstall orphans:** npm has no `postuninstall` lifecycle. Skills copied to `~/.claude/skills/` during install are never cleaned up on `npm uninstall -g id3-cli`, leaving orphaned files.

4. **Version conflicts:** If the user installs a new version, postinstall overwrites skill files without checking for user modifications. If a user customized a SKILL.md, their changes are silently destroyed.

**Why it happens:** postinstall feels like the obvious hook for "do setup after install." But npm lifecycle scripts are designed for build steps, not user-directory configuration.

**Consequences:**
- Silent installation failures for security-conscious users
- Orphaned skill files after uninstall
- User trust erosion (unexpected file writes to home directory)
- Broken installs when permissions mismatch

**Warning signs:**
- Users reporting "skills not found" despite successful npm install
- `~/.claude/skills/id3-*` directories persisting after uninstall
- Permission errors in CI/CD environments

**Prevention:**
- Use a **separate `id3-cli init` command** (the current approach) that explicitly registers skills, rather than postinstall
- After global install, the user runs `id3-cli` in their project directory, which copies skills to the project's `.claude/skills/` (project-scoped, not global)
- Alternatively, provide `id3-cli install-global-skills` as an opt-in command that writes to `~/.claude/skills/` with clear user consent
- Document the two-step process: `npm i -g id3-cli` then `id3-cli` in target project

**Phase:** Must be resolved during global install conversion design (Phase 1). The decision between project-local vs global skill registration is architectural.

**Confidence:** HIGH -- based on npm ecosystem security trends and official Claude Code skill scoping documentation.

---

### Pitfall 3: Skill Naming Collision Between Project and Global Scope

**What goes wrong:** Claude Code resolves skills by name with a priority order: enterprise > personal (~/.claude/skills) > project (.claude/skills). If `id3-cli` registers skills globally (in `~/.claude/skills/`) AND the user also runs `id3-cli init` in a project (writing to `.claude/skills/`), the same skill name exists in two scopes. The project-scope version is lower priority and will be shadowed by the global one.

This means:
- A user who customized project-level skills will see their customizations ignored
- Different projects cannot have different versions of IDDD skills
- Updating the global package changes behavior in all projects simultaneously, with no per-project version pinning

**Why it happens:** Claude Code's skill resolution is name-based with scope precedence. The documentation states "higher-priority locations win: enterprise > personal > project."

**Consequences:**
- User edits to project-level SKILL.md are silently ignored
- No version isolation between projects
- Confusing behavior: "I changed the skill but nothing happened"

**Warning signs:**
- Users reporting that skill edits in `.claude/skills/` have no effect
- Different projects behaving identically despite different skill configurations
- "Which version of the skill is running?" confusion

**Prevention:**
1. **Choose one scope and stick with it.** For id3-cli, project-local (`.claude/skills/`) is the right choice because:
   - IDDD skills reference project-specific files (`specs/entity-catalog.md`, `steering/product.md`)
   - Different projects may be at different IDDD phases
   - Skills should be version-controlled with the project
2. **Do NOT install skills globally** unless the user explicitly requests it
3. If providing both options, use different skill names for global vs project (e.g., `id3-global-init` vs `id3-identify-entities`)
4. Document scope precedence clearly so users understand resolution order

**Phase:** Architecture decision required in Phase 1. Must be settled before implementing skill registration.

**Confidence:** HIGH -- directly from Claude Code official documentation on skill resolution.

---

### Pitfall 4: Smart Router Intent Misclassification Cascade

**What goes wrong:** The `/id3-start` smart router must analyze a user's natural language request and route to the correct IDDD phase. Intent classification in prompt-based systems has well-documented failure modes:

1. **Ambiguous requests:** "Help me design the user profile" could route to Phase 0/1 (entity identification), Phase 2 (information design), or Phase 2.5 (UI design). The router picks one, potentially wasting significant agent time on the wrong phase.

2. **Over-routing:** The router adds a mandatory intermediate step to every IDDD interaction. Users who know exactly which skill they want (e.g., `/id3-identify-entities`) now have to go through the router, adding latency and token cost for zero benefit.

3. **Follow-up context loss:** After routing to a phase, the user might say "actually, let's do the UI first." The router has no memory of the previous routing decision, so it cannot gracefully redirect.

4. **Under-specified requests:** "Start the IDDD process" gives no routing signal. The router either picks a default (potentially wrong) or asks a clarifying question (adding friction).

**Why it happens:** LLM-based intent classification works well for distinct categories but poorly for overlapping domains. IDDD phases are sequential and overlapping in concept -- the distinction between "identify entities" and "design information" is subtle and context-dependent.

**Consequences:**
- Users routed to wrong phase, wasting time
- Extra latency on every invocation
- Reduced trust: "the tool doesn't understand what I want"
- Power users bypass the router entirely, making it dead code

**Warning signs:**
- Users consistently using direct skill invocation instead of `/id3-start`
- Frequent "wrong phase" feedback
- Router defaulting to the same phase for most inputs

**Prevention:**
1. **Make routing transparent:** Show the user which phase was selected and why, with an option to redirect before execution begins
2. **Provide escape hatches:** The router should suggest the route and let the user confirm, not auto-execute
3. **Use structured signals, not free-text classification:** Check for entity-catalog.md existence (brownfield vs greenfield), check current phase markers, use file presence as routing signals rather than parsing natural language
4. **Keep direct skill invocation as the primary path:** `/id3-start` should be a convenience helper, not the required entry point
5. **Define clear routing rules in the SKILL.md:** "If specs/entity-catalog.md does not exist, always start with id3-identify-entities" is deterministic and reliable

**Phase:** Smart router implementation (Phase 2). But the architectural decision (helper vs gateway) must be made in Phase 1.

**Confidence:** HIGH -- based on well-documented intent classification literature and the specific characteristics of IDDD's phase taxonomy.

---

## Moderate Pitfalls

Mistakes that cause significant debugging time or user confusion but are recoverable.

---

### Pitfall 5: `bin` Field Name Mismatch Breaks npx Backward Compatibility

**What goes wrong:** The current package.json has:
```json
"bin": {
  "id3-cli": "dist/bin/cli.js"
}
```

This works correctly for `npx id3-cli` because the bin name matches the package name. However, when adding new commands for the global install (e.g., a separate `id3-init` or `id3-start` entry point), there is a risk of breaking the npx path.

If additional bin entries are added (e.g., `"id3-init": "dist/bin/init.js"`), npx still resolves by package name (`id3-cli`), not by bin entry name. Users who try `npx id3-init` will get "command not found" because `id3-init` is not a published package name.

More subtly, if the bin field is changed to a string (shorthand for a single entry), the binary name becomes the package name. But if later reverting to an object for multiple entries, the default npx resolution changes.

**Why it happens:** npm's bin resolution rules differ between `npm i -g` (creates symlinks for ALL bin entries) and `npx` (resolves by package name first, then falls back to bin entries).

**Prevention:**
- Keep the existing `"id3-cli": "dist/bin/cli.js"` bin entry unchanged
- Add subcommands (`init`, `install-skills`, `start`) as arguments to the single `id3-cli` binary rather than separate bin entries
- Test both `npx id3-cli` and `id3-cli` (global) paths in CI
- Document: `npx id3-cli@latest` for one-time use, `npm i -g id3-cli && id3-cli init` for persistent use

**Phase:** Phase 1 (global install conversion). The CLI argument structure must be designed upfront.

**Confidence:** HIGH -- directly from npm CLI documentation and observed behavior.

---

### Pitfall 6: Hook Path Injection Creates Absolute Paths That Break on Machine Transfer

**What goes wrong:** The current `injectClaudeHooks()` function writes absolute paths into `.claude/settings.local.json`:

```typescript
hooks['PreToolUse'] = [
  {
    matcher: 'Write|Edit',
    command: `node "${join(targetDir, 'hooks', 'iddd-schema-drift.js')}"`,
  },
];
```

This produces something like:
```json
"command": "node \"/Users/bruce/myproject/hooks/iddd-schema-drift.js\""
```

This absolute path breaks when:
- The project is cloned on a different machine (different username/path)
- The project directory is moved or renamed
- The project is opened in a container or CI environment

Since `settings.local.json` is likely gitignored, this mostly affects the local developer. But if `settings.json` (non-local) is used instead, these paths break for every collaborator.

**Why it happens:** `join(targetDir, ...)` resolves to an absolute path, and this is serialized directly into the JSON config.

**Prevention:**
- Use relative paths from the project root: `"node ./hooks/iddd-schema-drift.js"` instead of absolute paths
- Claude Code hook commands execute with the project root as cwd, so relative paths work correctly
- Add a validation step that checks if hook script files exist at the referenced paths during init

**Phase:** Phase 1. This is a pre-existing bug that should be fixed as part of the global install conversion.

**Confidence:** HIGH -- directly observable in `src/init.ts` line 156.

---

### Pitfall 7: `files` Field Excludes Assets That Global Install Needs

**What goes wrong:** The current `package.json` includes:
```json
"files": [
  "dist/",
  "templates/",
  "assets/"
]
```

This is correct for the current template-copy approach. However, when adding new functionality for the global install (e.g., a `skills/` directory at the package root for Claude Code skill registration, or new bin scripts), forgetting to add these to the `files` array means they are excluded from the published npm package.

The `files` field acts as a whitelist. Everything not listed (and not in a few default includes like `package.json`, `README`, `LICENSE`) is excluded from the tarball. This is a common source of "works locally, fails after publish" bugs.

**Why it happens:** Developers test with the local file system where all files exist, not with the published package where only `files`-listed directories are included.

**Prevention:**
- After any structural change, run `npm pack` and inspect the tarball contents: `npm pack --dry-run` lists included files
- Add `npm pack --dry-run` to the CI pipeline
- When adding new directories or bin scripts, immediately update the `files` array
- Consider using `.npmignore` as a complementary mechanism (blocklist) for extra safety, though `files` whitelist is the primary control

**Phase:** Phase 1. Must be verified every time the package structure changes.

**Confidence:** HIGH -- standard npm packaging concern, directly applicable.

---

### Pitfall 8: Symlink Strategy Fails on Windows and in npm Pack

**What goes wrong:** The current init logic creates symlinks from `.claude/skills/id3-xxx/SKILL.md` to `skills/id3-xxx/SKILL.md` (the canonical location). This has two failure modes:

1. **Windows:** Symlinks require administrator privileges or Developer Mode enabled. The code has a fallback (`copySkillFiles`), but it is only triggered by the `--no-symlink` flag. Windows users who forget this flag get a permission error.

2. **npm pack/publish:** npm does not follow symlinks when creating the tarball. If any published file is a symlink, it is either included as the symlink (broken on install) or excluded entirely. This does not affect the current flow (symlinks are created at init time, not in the package), but if the skill registration strategy changes to include pre-built symlinks in the package, they will break.

3. **Git:** Git has limited symlink support. Committing symlinks works on Unix but may cause issues when cloning on Windows. If users commit `.claude/skills/` (with symlinks) to their repo, Windows collaborators get broken files.

**Why it happens:** Symlinks are a Unix concept with incomplete cross-platform support. The current code accounts for this with a fallback, but the fallback is opt-in rather than automatic.

**Prevention:**
- Auto-detect Windows and default to copy instead of symlink (don't require `--no-symlink` flag)
- For globally-installed skills, use copy instead of symlink universally -- the indirection adds complexity for no benefit when skills are managed by the CLI
- If symlinks are used, make them relative (the current `createSymlink` does this correctly) to survive directory moves
- Add `.gitattributes` guidance to the README for Windows users

**Phase:** Phase 1. The symlink strategy decision affects the entire skill registration architecture.

**Confidence:** HIGH -- Windows symlink issues are well-documented, and the current code's fallback mechanism is insufficient (requires manual flag).

---

## Minor Pitfalls

Issues that cause friction but are quickly resolved.

---

### Pitfall 9: `getVersion()` Uses `import.meta.url` Inconsistently with `import.meta.dirname`

**What goes wrong:** The `getVersion()` function in `init.ts` uses:
```typescript
const pkgPath = new URL('../../package.json', import.meta.url);
```

While the `templatesDir` resolution uses `import.meta.dirname`. These are semantically equivalent but use different APIs. If one breaks due to a bundling or environment change, the other might still work, creating confusing partial failures (e.g., version displays "0.0.0" but init works fine, or vice versa).

**Prevention:**
- Standardize on one approach: either `import.meta.dirname` + `join()` or `import.meta.url` + `new URL()` throughout
- `import.meta.dirname` with `join()` is more readable and idiomatic for file system operations
- Both are available since Node.js 20.11.0; for older versions, use `fileURLToPath(import.meta.url)` + `dirname()`

**Phase:** Phase 1 (cleanup during conversion).

**Confidence:** HIGH -- directly observable code inconsistency.

---

### Pitfall 10: Missing `--help` and `--version` Flags in CLI

**What goes wrong:** The current CLI (`bin/cli.ts`) has no `--help` or `--version` flag handling. When users run `id3-cli --help` after global install, they get the init flow instead of usage information. This is a poor UX for a globally installed tool where users expect standard CLI conventions.

**Prevention:**
- Add `--help` / `-h` flag that prints usage
- Add `--version` / `-v` flag that prints the version
- Parse flags before executing the init flow
- Consider using a lightweight CLI framework (commander, yargs) if subcommands grow beyond 2-3

**Phase:** Phase 1 (global install UX).

**Confidence:** HIGH -- standard CLI convention, no research needed.

---

### Pitfall 11: Existing `npx` Users Get Different Behavior After Global Install

**What goes wrong:** A user who previously used `npx id3-cli@latest .` now installs globally with `npm i -g id3-cli`. The behavior subtly changes:

- `npx id3-cli@latest` always fetches the latest version from npm. Global install uses whatever version was installed. User may unknowingly run a stale version for months.
- `npx` runs in a temporary context. Global install persists. If the user later runs `npx id3-cli`, it may conflict with the global install (npm may use the global version instead of fetching latest).
- Error messages and paths differ between npx and global contexts.

**Prevention:**
- Add a version check command or auto-update notification: "You are running id3-cli v0.9.3, latest is v1.0.0. Run `npm i -g id3-cli@latest` to update."
- Document the migration path clearly: "If you previously used npx, you can switch to global install. Both methods continue to work."
- Test both paths in CI: `npx id3-cli` and `id3-cli` (global) should produce identical results for the same version

**Phase:** Phase 1 (documentation and UX).

**Confidence:** HIGH -- standard npm version resolution behavior.

---

### Pitfall 12: Smart Router SKILL.md Becomes a Maintenance Bottleneck

**What goes wrong:** The `/id3-start` router skill must know about all other skills to route correctly. Its SKILL.md must describe each phase and its trigger conditions. When existing skills are updated, renamed, or new ones are added, the router skill must be updated in sync. If it falls out of date:

- New skills are never routed to
- Renamed skills cause routing errors
- Changed phase descriptions cause misclassification

**Prevention:**
- Keep the router's skill knowledge minimal and structural: reference skill names and file-existence checks, not detailed phase descriptions
- Use `${CLAUDE_SKILL_DIR}` or filesystem checks in the router to dynamically discover available skills rather than hardcoding them
- Define routing rules as data (e.g., a JSON mapping) that can be validated, rather than prose in the SKILL.md
- Add a test that verifies the router's skill list matches the actual available skills

**Phase:** Phase 2 (smart router implementation).

**Confidence:** MEDIUM -- depends on how the router is designed. This is avoidable with good architecture.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Severity |
|-------------|---------------|------------|----------|
| Global install conversion | Template path resolution (Pitfall 1) | Validate resolved path exists; add integration test | Critical |
| Global install conversion | Skill registration scope (Pitfall 3) | Choose project-local as default; document alternatives | Critical |
| Global install conversion | postinstall temptation (Pitfall 2) | Use explicit init command, not lifecycle scripts | Critical |
| Global install conversion | bin field / npx compat (Pitfall 5) | Keep single bin entry with subcommands | Moderate |
| Global install conversion | files field (Pitfall 7) | Run `npm pack --dry-run` in CI | Moderate |
| Global install conversion | Hook absolute paths (Pitfall 6) | Switch to relative paths from project root | Moderate |
| Global install conversion | Symlink strategy (Pitfall 8) | Auto-detect OS; default to copy on Windows | Moderate |
| Smart router design | Intent misclassification (Pitfall 4) | Use file-existence signals, not NL classification alone | Critical |
| Smart router design | Maintenance bottleneck (Pitfall 12) | Data-driven routing rules, not hardcoded prose | Moderate |
| Backward compatibility | Version divergence (Pitfall 11) | Version check + update notification | Minor |

---

## Sources

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) - HIGH confidence
- [npm package.json bin field documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) - HIGH confidence
- [Node.js ESM modules documentation](https://nodejs.org/api/esm.html) - HIGH confidence
- [npm postinstall security risks](https://www.nodejs-security.com/blog/npm-ignore-scripts-best-practices-as-security-mitigation-for-malicious-packages) - HIGH confidence
- [Intent Recognition in Multi-Agent Systems](https://gist.github.com/mkbctrl/a35764e99fe0c8e8c00b2358f55cd7fa) - MEDIUM confidence
- [AI Agent Routing Best Practices](https://www.patronus.ai/ai-agent-development/ai-agent-routing) - MEDIUM confidence
- [OpenSkills npm package](https://github.com/numman-ali/openskills) - MEDIUM confidence (prior art for skill registration)
- [npm global install EACCES permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally/) - HIGH confidence
- [Node.js import.meta.dirname availability](https://www.sonarsource.com/blog/dirname-node-js-es-modules/) - HIGH confidence
- [npm bin script handling for global installs](https://2ality.com/2022/08/installing-nodejs-bin-scripts.html) - HIGH confidence

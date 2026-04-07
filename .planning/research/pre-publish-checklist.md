# Pre-Publish Checklist & npx Backward Compatibility Removal

**Project:** id3-cli v1.0.0 Release
**Researched:** 2026-04-07
**Overall confidence:** HIGH (based on npm official docs, codebase inspection, and ecosystem research)

---

## 1. npx Removal: What Code Changes Are Needed

**Confidence:** HIGH (based on direct codebase inspection)

### Key Finding: npx is not a "feature" — it is a side effect of the `bin` field

`npx id3-cli` works because npm's `npx` command resolves packages by name from the registry and executes the binary defined in the `bin` field. There is **no special npx support code** in id3-cli. The `bin` field `{ "id3-cli": "dist/bin/cli.js" }` serves both `npx` and global install.

**Removing npx support means: removing documentation/references, not removing code.**

The `bin` field must NOT be changed — it is required for `npm i -g id3-cli` to work. Removing it would break the global install path.

### Files Requiring npx Reference Removal

#### Production Code (1 file)
| File | Line | Current | Change To |
|------|------|---------|-----------|
| `skills-global/id3-start/SKILL.md` | 69 | `npx id3-cli .` | `id3-cli init .` |
| `skills-global/id3-start/SKILL.md` | 188 | "installed by `npx id3-cli .`" | "installed by `id3-cli init .`" |

**Critical:** The `id3-start` SKILL.md auto-setup (line 69) currently runs `npx id3-cli .` via Bash tool. Since we are requiring global install, this should become `id3-cli init .` (the global binary). This is faster (no npm registry fetch) and consistent with the global-install-only model.

#### README Files (6 files)
| File | npx Occurrences | Action |
|------|-----------------|--------|
| `README.md` | 5 | Replace all `npx id3-cli@latest` with `id3-cli init` |
| `README.ko-KR.md` | 5 | Same |
| `README.zh-CN.md` | 5 | Same |
| `README.ja-JP.md` | 5 | Same |
| `README.tr-TR.md` | 5 | Same |
| `templates/README.md` | 4 | Same |

#### Quick Start Section Rewrite Needed
The "Prerequisites" sections in all READMEs mention "You need Node.js for the `npx` installer." This should become: "You need Node.js (v18+). Install globally: `npm i -g id3-cli`."

The Installation section should change from:
```bash
npx id3-cli@latest
```
To:
```bash
npm i -g id3-cli
id3-cli init
```

#### Planning/Internal Docs (not user-facing, lower priority)
Over 80 references to `npx` exist in `.planning/` files. These are historical artifacts. They do NOT need to be updated for the v1.0.0 release since they are not published to npm (excluded by `files` field). Update only if time permits.

### No CLI Code Changes Needed

The `bin/cli.ts` entry point already handles both `id3-cli init [dir]` and `id3-cli [dir]` (default to init). No code changes required to the CLI itself.

---

## 2. Version Bump Strategy: `npm version major`

**Confidence:** HIGH (verified against npm documentation)

### How `npm version major` Works (0.9.3 -> 1.0.0)

The lifecycle is:

1. **preversion** — Runs BEFORE bump. Your package.json has none. No action.
2. **Bump** — npm modifies `package.json` version from `0.9.3` to `1.0.0`.
3. **version** — Runs AFTER bump, BEFORE git commit. Your script:
   - Runs `tsc` (builds the project)
   - Runs `node dist/scripts/update-version.js` (updates README version strings)
   - Runs `git add README.md README.ko-KR.md README.zh-CN.md README.ja-JP.md README.tr-TR.md`
4. **Git commit + tag** — npm creates commit `v1.0.0` and tag `v1.0.0`
5. **postversion** — Runs AFTER commit. Your package.json has none. No action.

### Potential Issue with the `version` Script

The `update-version.ts` script uses a regex `/v\d+\.\d+\.\d+/g` to find and replace version strings. This regex matches ANY semver-like pattern (e.g., `v1.2.3` in URLs, other version references). 

**Risk:** If READMEs contain version strings for other tools (Node.js version requirements like `v18.0.0`), they will be incorrectly replaced with `v1.0.0`.

**Verification needed:** Review all READMEs for non-IDDD version strings before running `npm version major`.

**Recommendation:** After running `npm version major`, inspect the git diff of all README files to confirm only IDDD version references were updated. If the regex is too broad, narrow it to match only version strings in specific contexts (e.g., near "IDDD" or in the banner).

### Command Sequence

```bash
# 1. Ensure clean working tree
git status  # Must be clean

# 2. Bump version (triggers version script automatically)
npm version major -m "release: v%s"

# 3. Verify the commit
git log --oneline -1   # Should show "release: v1.0.0"
git diff HEAD~1 --stat  # Should show package.json + README files changed
```

---

## 3. Pre-Publish Verification Checklist

**Confidence:** HIGH (npm best practices, verified against official docs)

### Phase A: Pre-Bump Verification

```bash
# A1. All tests pass
npm test

# A2. TypeScript compiles clean
npx tsc --noEmit

# A3. Build succeeds (triggers tsc + build-hooks)
npm run build

# A4. Verify the CLI works from built output
node dist/bin/cli.js --version    # Should print 0.9.3
node dist/bin/cli.js --help       # Should show help text

# A5. Check for uncommitted changes
git status                         # Must be clean
```

### Phase B: Version Bump

```bash
# B1. Bump to 1.0.0
npm version major -m "release: v%s"

# B2. Verify README version strings
git diff HEAD~1 -- README.md | head -40    # Confirm only IDDD versions changed

# B3. Verify package.json version
node -e "console.log(require('./package.json').version)"    # Should print 1.0.0
```

### Phase C: Package Content Verification

```bash
# C1. Dry-run pack to see what gets included
npm pack --dry-run

# Expected contents based on "files" field:
#   dist/         - compiled JS, source maps, declarations
#   templates/    - IDDD template files for project init
#   assets/       - banner.txt etc.
#   skills-global/ - id3-start and id3-clear SKILL.md files
#   package.json  - always included
#   README.md     - always included
#   LICENSE        - always included (if exists)

# C2. Verify NO unwanted files are included
# Watch for: src/ (TypeScript source), tests/, .planning/, node_modules/,
#            .git/, .env, credentials, etc.

# C3. Actually create the tarball and inspect
npm pack
tar tzf id3-cli-1.0.0.tgz | head -50

# C4. Test install from tarball in a temp directory
mkdir /tmp/id3-test && cd /tmp/id3-test
npm i -g /path/to/id3-cli-1.0.0.tgz
id3-cli --version    # Should print 1.0.0
id3-cli --help       # Should show help
id3-cli init .       # Should scaffold IDDD files (test in a temp project dir)
id3-cli uninstall-skills  # Clean up
npm uninstall -g id3-cli
rm -rf /tmp/id3-test
```

### Phase D: Publish

```bash
# D1. Ensure npm credentials are set
npm whoami    # Should show your npm username

# D2. Dry-run publish
npm publish --dry-run

# D3. Publish for real
npm publish

# D4. Verify on npm registry
npm view id3-cli version    # Should show 1.0.0
npm view id3-cli dist-tags  # "latest" should point to 1.0.0
```

### Phase E: Post-Publish Verification

```bash
# E1. Install from npm in a clean environment
npm i -g id3-cli
id3-cli --version    # Should print 1.0.0

# E2. Verify skill registration worked (postinstall hook)
ls ~/.claude/skills/id3-start/SKILL.md     # Should exist
ls ~/.claude/skills/id3-clear/SKILL.md     # Should exist

# E3. Test init in a fresh project
mkdir /tmp/test-project && cd /tmp/test-project
git init
id3-cli init .
ls specs/entity-catalog.md    # Should exist
ls CLAUDE.md                   # Should exist

# E4. Clean up
npm uninstall -g id3-cli
rm -rf /tmp/test-project
```

---

## 4. Breaking Change Communication

**Confidence:** HIGH (npm official documentation on deprecation)

### Recommended Strategy: npm deprecate + README notice

#### Step 1: Deprecate Pre-1.0 Versions (After Publishing v1.0.0)

```bash
# Deprecate all 0.x versions with migration message
npm deprecate "id3-cli@<1.0.0" "This version is deprecated. Please install globally: npm i -g id3-cli (npx usage is no longer supported)"
```

This shows a warning to anyone running `npx id3-cli@0.9.3` or installing an old version. The warning is displayed in the terminal during install.

#### Step 2: README Migration Notice

Add a prominent migration notice at the top of README.md (and all language variants):

```markdown
> **Migrating from npx?** Starting with v1.0.0, `npx id3-cli` is no longer supported.
> Install globally instead: `npm i -g id3-cli`
```

#### Step 3: CHANGELOG.md

Create or update CHANGELOG.md with a `## 1.0.0 (2026-04-XX)` section documenting:
- BREAKING: `npx id3-cli` usage removed. Use `npm i -g id3-cli` instead.
- `/id3-start` auto-setup now uses the global `id3-cli init .` command.

#### What NOT to Do

- Do NOT unpublish old versions. npm policy discourages unpublishing, and it breaks existing lockfiles.
- Do NOT change the package name. Users searching for `id3-cli` should still find it.
- Do NOT add runtime `npx` detection/warning code. The CLI works the same regardless of how it was invoked. The deprecation notice on npm handles the communication.

---

## 5. Security Considerations

**Confidence:** HIGH (based on codebase inspection and npm security research)

### 5.1 postinstall Script Review

The `scripts/postinstall.ts` runs `registerSkills()` which:
1. Detects installed AI platforms (Claude Code, Codex) via `which` command
2. Copies SKILL.md files from `skills-global/` to `~/.claude/skills/` and `~/.codex/skills/`

**Security assessment:**
- **File operations are scoped:** Only writes to `~/.claude/skills/` and `~/.codex/skills/`. No system-wide file writes.
- **No network access:** Does not fetch anything from the internet.
- **No shell command execution** beyond `which claude` and `which codex` for platform detection.
- **Graceful failure:** Wrapped in try/catch, does not block install on failure.

**Risk level: LOW.** The postinstall script is well-scoped and benign.

**Concern:** Users who run `npm install --ignore-scripts` (a growing security practice -- recommended by OWASP and Node.js security teams) will not get skills registered. The CLI already handles this with the fallback message: "Run `id3-cli install-skills` manually." This is adequate.

### 5.2 File Permissions

The `build-hooks.ts` script sets `chmod 0o755` on bundled hook files. This is correct for executable scripts. No security issue.

### 5.3 Template Files

Template files copied to user projects include CLAUDE.md, specs templates, and hook scripts. These are static text files. No executable code is injected beyond the pre-built hook bundles (which are esbuild bundles with `#!/usr/bin/env node` shebangs).

### 5.4 Supply Chain Considerations

- **No runtime dependencies:** package.json has zero `dependencies` (only `devDependencies`). This eliminates the most common npm supply chain attack vector.
- **esbuild is dev-only:** Used only during build, not shipped to users.
- **Recommendation:** Enable 2FA on the npm account before publishing v1.0.0. Use `npm profile set auth-and-writes` to require 2FA for publish.

---

## 6. npm Provenance / Signing

**Confidence:** HIGH (verified against npm docs and recent security incidents)

### Recommendation: YES, Use Provenance for v1.0.0

npm provenance (powered by Sigstore) provides cryptographic proof that a package was built from a specific git commit in a specific CI/CD pipeline. Given the 2025-2026 npm supply chain attacks (Shai-Hulud, Axios), provenance is now a baseline expectation for security-conscious users.

### Requirements

Provenance requires publishing from a supported CI/CD environment:
- **GitHub Actions** (fully supported, GA since July 2025)
- **GitLab CI/CD** (supported)

**Provenance CANNOT be generated from a local machine.** It requires OIDC token generation from the CI/CD provider.

### Implementation Options

#### Option A: GitHub Actions Workflow (Recommended)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write  # Required for provenance
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm publish --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Pros:**
- Automated, reproducible, provenance badge on npm
- Prevents compromised-laptop attacks (the #1 attack vector in 2025-2026)
- Users see a "Published via GitHub Actions" badge on npmjs.com

**Cons:**
- Requires NPM_TOKEN secret in GitHub repo
- Cannot publish locally (by design -- this is a security feature)

#### Option B: Trusted Publishing with OIDC (Best Security)

npm Trusted Publishing (GA since July 2025) eliminates the need for npm tokens entirely. Publishing is authenticated via OIDC between GitHub Actions and npm.

**Setup:**
1. On npmjs.com, go to package settings, add a "Trusted Publisher" (link GitHub repo + workflow file)
2. In GitHub Actions, use `--provenance` flag (no NPM_TOKEN needed)

**Pros:**
- No long-lived npm tokens to steal (eliminates the Axios-style attack vector)
- Strongest supply chain security available on npm

**Cons:**
- Slightly more setup
- Must publish only through CI

#### Option C: Local Publish Without Provenance (Simplest, for v1.0.0 only)

```bash
npm publish
```

**Pros:** Simple, immediate
**Cons:** No provenance badge, no supply chain guarantees, less trust

### Recommendation

For v1.0.0 initial release, **Option A (GitHub Actions with provenance) is the recommended path.** It provides strong security guarantees with reasonable setup effort. Upgrade to Option B (Trusted Publishing) in a subsequent release.

If time constraints prevent CI setup for v1.0.0, use Option C for the initial release and add provenance in v1.0.1.

---

## Summary: Ordered Action Plan for v1.0.0 Release

### Pre-Release (Code Changes)

1. **Update `skills-global/id3-start/SKILL.md`**: Replace `npx id3-cli .` with `id3-cli init .` (2 locations)
2. **Update all 6 README files**: Replace npx instructions with global install instructions
3. **Update `templates/README.md`**: Same npx -> global install changes
4. **Review `update-version.ts` regex**: Verify it won't corrupt non-IDDD version strings
5. **Enable npm 2FA**: `npm profile set auth-and-writes`

### Release

6. **Run full test suite**: `npm test`
7. **Bump version**: `npm version major -m "release: v%s"`
8. **Verify pack contents**: `npm pack --dry-run`
9. **Test from tarball**: `npm i -g ./id3-cli-1.0.0.tgz` and run through scenarios
10. **Publish**: `npm publish` (or `npm publish --provenance` if GitHub Actions is set up)
11. **Verify on npm**: `npm view id3-cli version`

### Post-Release

12. **Deprecate old versions**: `npm deprecate "id3-cli@<1.0.0" "...migration message..."`
13. **Push git tag**: `git push origin v1.0.0`
14. **Create GitHub Release**: with CHANGELOG notes
15. **Test global install from npm**: `npm i -g id3-cli` in a clean environment

---

## Open Questions

1. **CHANGELOG.md**: Does the project want a formal CHANGELOG? Currently there is none. Consider adding one for the v1.0.0 milestone.
2. **Node.js minimum version**: The build targets Node 18 (`target: 'node18'` in esbuild config). Should `engines` field be added to `package.json` to enforce this?
3. **`templates/README.md` vs root `README.md`**: The templates README is what gets copied into user projects. Should the v1.0.0 install instructions differ between the npm package README (how to install id3-cli) and the project README (how to use IDDD after init)?
4. **GitHub Actions setup**: Is the bruce-jsh/iddd repo ready for GitHub Actions? Are secrets configured?

## Sources

- [npm Scripts Documentation](https://docs.npmjs.com/cli/v11/using-npm/scripts/)
- [npm Version Documentation](https://docs.npmjs.com/cli/v11/commands/npm-version/)
- [npm Deprecation Documentation](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions/)
- [npm Provenance Documentation](https://docs.npmjs.com/generating-provenance-statements/)
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm Trusted Publishing GA Announcement](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/)
- [OWASP npm Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html)
- [Understanding npx - How It Really Works](https://dev.to/luckychauhan/understanding-npx-how-it-really-works-5g3j)
- [npm Provenance and SLSA Baseline 2026](https://earezki.com/ai-news/2026-04-04-npm-provenance-and-slsa-the-supply-chain-hygiene-baseline-every-team-needs-in-2026/)
- [npm Pack for Package Verification](https://stevefenton.co.uk/blog/2024/01/testing-npm-publish/)
- [Bootstrapping npm Provenance with GitHub Actions](https://www.thecandidstartup.org/2026/01/26/bootstrapping-npm-provenance-github-actions.html)

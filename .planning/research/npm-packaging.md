# npm Packaging Best Practices for id3-cli v1.0.0 Release

**Researched:** 2026-04-07
**Package:** id3-cli (global CLI tool, TypeScript, ESM)
**Current version:** 0.9.3
**Overall confidence:** HIGH (verified against npm docs, npm-packlist source, and community best practices)

---

## 1. `files` Field vs `.npmignore`

### Recommendation: Keep `files` field (whitelist approach). Do NOT add `.npmignore`.

**Rationale:** The `files` field is the modern best practice. It acts as a whitelist -- only what you list gets shipped. The `.npmignore` approach is a blacklist that becomes a game of whack-a-mole as the project grows. Since id3-cli already uses `files`, stay with it.

**Confidence:** HIGH (npm official docs, community consensus, npm blog)

### Current `files` field analysis

```json
"files": ["dist/", "templates/", "assets/", "skills-global/"]
```

### Problems found

#### Problem 1: Duplicate hook files in package (CRITICAL)

The build step (`build-hooks.js`) writes bundled hooks into `templates/hooks/`. But `dist/templates/hooks/` also exists from a previous build. Both directories are shipped:

| File | Location 1 | Location 2 |
|------|-----------|-----------|
| iddd-auto-audit.js | templates/hooks/ (3.7kB) | dist/templates/hooks/ (3.7kB) |
| iddd-schema-drift.js | templates/hooks/ (8.3kB) | dist/templates/hooks/ (8.3kB) |
| post-commit | templates/hooks/ (3.7kB) | dist/templates/hooks/ (3.7kB) |
| pre-commit | templates/hooks/ (10.4kB) | dist/templates/hooks/ (10.4kB) |

**Waste:** ~26kB of duplicate files in the tarball.

**Fix:** Either:
- (A) Delete `dist/templates/` before build, or
- (B) Refine `files` to use `"dist/bin/", "dist/src/", "dist/scripts/postinstall.*"` instead of the broad `"dist/"` glob

Option (B) is better because it also fixes Problem 2.

#### Problem 2: Dev-only scripts shipped in package

`dist/scripts/build-hooks.js` and `dist/scripts/update-version.js` are build-time tools. They should NOT be in the published package. `build-hooks.js` even imports `esbuild`, which is a devDependency not available to end users.

| File | Size | Needed at runtime? |
|------|------|--------------------|
| dist/scripts/build-hooks.js (+.d.ts, +.map) | 4.7kB | NO -- build tool |
| dist/scripts/update-version.js (+.d.ts, +.map) | 3.3kB | NO -- version script |
| dist/scripts/postinstall.js (+.d.ts, +.map) | 1.1kB | YES -- postinstall |

**Fix:** Refine the `files` field to only include runtime-needed dist files (see recommended config below).

#### Problem 3: Source maps and declaration files shipped unnecessarily

For a CLI tool (not a library), `.d.ts` and `.js.map` files serve no purpose to end users. They add ~65kB of dead weight.

**Fix:** Either:
- (A) Exclude via refined `files` patterns, or
- (B) Disable `sourceMap` and `declaration` in tsconfig for production builds

Option (A) is simpler. Alternatively, for debugging post-install issues, keeping source maps is low-cost. The `.d.ts` files should definitely be excluded since nobody imports from a CLI tool.

#### Problem 4: Root README variants always included (~275kB)

npm always includes root-level `README*` files (confirmed in npm-packlist source: pattern `!/readme{,.*[^~$]}`). The 5 README files total ~275kB uncompressed:

| File | Size |
|------|------|
| README.md | 52.2kB |
| README.ko-KR.md | 56.2kB |
| README.ja-JP.md | 61.2kB |
| README.zh-CN.md | 49.6kB |
| README.tr-TR.md | 55.6kB |

**This cannot be fixed with `files` or `.npmignore`.** Root READMEs are force-included.

**Fix options:**
- (A) Move translated READMEs to `docs/i18n/` directory (they would NOT be auto-included from subdirectories)
- (B) Accept the size -- 275kB compresses well in gzip, and multilingual documentation benefits the global user base
- (C) Trim README content (e.g., keep essentials, link to full docs online)

**Recommendation:** Option (A). Move translated READMEs to `docs/i18n/README.ko-KR.md` etc. Keep only `README.md` at root. Add links in README.md pointing to the translated versions on GitHub. This saves ~220kB from the package.

### Recommended `files` field

```json
"files": [
  "dist/bin/",
  "dist/src/",
  "dist/scripts/postinstall.js",
  "dist/scripts/postinstall.js.map",
  "templates/",
  "assets/",
  "skills-global/"
]
```

This explicitly:
- Includes only runtime JavaScript from `dist/`
- Includes only the postinstall script (the one script needed at install-time)
- Excludes build-hooks.js, update-version.js, and all their artifacts
- Excludes `dist/templates/hooks/` (stale duplicates)
- Excludes `.d.ts` files (nobody imports from a CLI)
- Keeps source maps for postinstall debugging

**To also exclude all source maps and .d.ts files more aggressively:**

```json
"files": [
  "dist/bin/**/*.js",
  "dist/src/**/*.js",
  "dist/scripts/postinstall.js",
  "templates/",
  "assets/",
  "skills-global/",
  "!**/*.d.ts",
  "!**/*.js.map"
]
```

Note: Negation patterns in `files` are supported (npm docs confirm this).

---

## 2. Missing package.json Fields for Production Release

### Fields to add

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/bruce-jsh/iddd.git"
  },
  "homepage": "https://github.com/bruce-jsh/iddd#readme",
  "bugs": {
    "url": "https://github.com/bruce-jsh/iddd/issues"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "os": ["!win32"],
  "funding": {
    "url": "https://github.com/sponsors/bruce-jsh"
  }
}
```

### Field-by-field analysis

| Field | Status | Priority | Notes |
|-------|--------|----------|-------|
| `name` | Present | -- | Good |
| `version` | Present (0.9.3) | CRITICAL | Bump to 1.0.0 for release |
| `description` | Present | -- | Good |
| `type` | Present ("module") | -- | Good, ESM is correct |
| `bin` | Present | -- | Good, shebang verified in cli.js |
| `files` | Present but needs refinement | HIGH | See Section 1 |
| `repository` | **MISSING** | HIGH | Required for npm page sidebar link |
| `homepage` | **MISSING** | HIGH | Required for npm page sidebar link |
| `bugs` | **MISSING** | MEDIUM | Required for npm page sidebar link |
| `engines` | **MISSING** | HIGH | The code uses ESM, import.meta.dirname (Node 21.2+), and top-level await. Minimum should be Node 18+ |
| `license` | Present ("MIT") | -- | But LICENSE file is MISSING from repo |
| `keywords` | Present | -- | Good selection |
| `author` | Present | -- | Good |
| `os` | **MISSING** | LOW | Consider if Windows support is intended (uses `which` command in register-skills.js) |

### Critical missing item: LICENSE file

The package declares `"license": "MIT"` but there is no `LICENSE` or `LICENSE.md` file in the repo. npm auto-includes LICENSE files, but there is nothing to include. A proper MIT license file should be created.

### Node.js engine version analysis

The codebase uses:
- `import.meta.dirname` -- available since Node 21.2.0, backported to Node 20.11.0
- Top-level `await` -- available since Node 14.8.0 (with "type": "module")
- ESM (`"type": "module"`) -- stable since Node 12

**Recommendation:** Set `"engines": { "node": ">=20.11.0" }` because `import.meta.dirname` is the most restrictive feature used. Node 18 does NOT support `import.meta.dirname`.

**Confidence:** HIGH -- verified from Node.js changelog.

**Alternative:** If Node 18 support is desired, replace `import.meta.dirname` with `path.dirname(fileURLToPath(import.meta.url))` throughout the codebase.

---

## 3. prepublishOnly / prepare Scripts

### Current setup

```json
"prepublishOnly": "npm run build"
```

### Analysis: This is the CORRECT pattern

| Script | When it runs | Use case |
|--------|-------------|----------|
| `prepare` | Before publish AND on `npm install` (from git) | Build steps needed when installing from git |
| `prepublishOnly` | ONLY before `npm publish` | Build + validation before publishing |
| `postinstall` | After install for end users | Runtime setup |

Using `prepublishOnly` for the build is correct because:
1. End users install from the registry (pre-built `dist/` is in the tarball)
2. The build requires devDependencies (`typescript`, `esbuild`) not available to end users
3. `prepare` would fail for git-clone installs if devDependencies aren't installed

### Recommendation: Add test/lint to prepublishOnly

```json
"prepublishOnly": "npm run build && npm test"
```

This ensures tests pass before every publish. If a linter is added later, include it too.

### Pitfall: `prepare` + git installs

If someone installs via `npm install github:bruce-jsh/iddd`, the `prepare` script runs. Since `dist/` is gitignored, the build would need to run. But devDependencies might not be present. Current setup avoids this by NOT using `prepare`, which is correct.

If git-based installation support is ever needed, use:
```json
"prepare": "npm run build || true"
```

But for a CLI tool distributed via npm registry, this is unnecessary.

---

## 4. npm pack Verification

### Pre-publish verification checklist

Run these commands before every publish:

```bash
# 1. See what will be included (dry run)
npm pack --dry-run

# 2. Check total file count and sizes
npm pack --dry-run 2>&1 | tail -5

# 3. Look for files that should NOT be in the package
npm pack --dry-run 2>&1 | grep -E "\.(ts|test|spec|env)" | grep -v "\.d\.ts"

# 4. Check for sensitive files
npm pack --dry-run 2>&1 | grep -iE "(secret|credential|\.env|\.key|token)"

# 5. Create actual tarball and inspect
npm pack
tar tzf id3-cli-*.tgz | head -50

# 6. Test install from tarball
npm install -g ./id3-cli-1.0.0.tgz
id3-cli --version
id3-cli init --help
npm uninstall -g id3-cli

# 7. Verify publish would succeed (no actual upload)
npm publish --dry-run
```

### Automate as a script

Add to package.json:
```json
"scripts": {
  "prerelease": "npm run build && npm test && npm pack --dry-run",
  "release": "npm publish"
}
```

### Current tarball stats (v0.9.3)

| Metric | Value |
|--------|-------|
| Total files | 132 |
| Package size (compressed) | 175.1 kB |
| Unpacked size | 689.2 kB |

### Expected stats after fixes

| Metric | Before | After (estimated) |
|--------|--------|-------------------|
| Total files | 132 | ~95 |
| Unpacked size | 689.2 kB | ~450 kB (with translated READMEs moved) |
| Package size | 175.1 kB | ~120 kB |

---

## 5. postinstall Script Concerns

### Current postinstall behavior

```javascript
// dist/scripts/postinstall.js
import { registerSkills } from '../src/register-skills.js';
try {
    const result = await registerSkills();
    for (const p of result.platforms) {
        console.log(`id3-cli: Skills registered in ${p.name} (${p.skillsDir})`);
    }
} catch {
    console.log('id3-cli: Could not auto-register skills. Run `id3-cli install-skills` manually.');
}
```

### Risk assessment

| Risk | Severity | Status |
|------|----------|--------|
| Script crashes blocking install | LOW | Mitigated -- wrapped in try/catch |
| `--ignore-scripts` users skip registration | HIGH | Needs manual fallback (exists: `id3-cli install-skills`) |
| Permission errors on global install | MEDIUM | Needs investigation |
| Windows compatibility (`which` command) | HIGH | `which` does not exist on Windows CMD |
| Slow postinstall blocking install | LOW | Script is fast (file copy only) |
| Security perception | MEDIUM | postinstall scripts are increasingly distrusted |

### Known issues with postinstall in global installs

1. **`--ignore-scripts` is increasingly common.** Security-conscious users and some CI environments run `npm config set ignore-scripts true` globally. The postinstall will simply not run. The existing fallback message is good, but it never displays because the script never executes.

2. **Permission issues.** Global installs may run as root or with sudo. The postinstall writes to `~/.claude/skills/` and `~/.codex/skills/`. If installed with sudo, `~` resolves to root's home, not the user's home. This is a common pitfall.

3. **Windows compatibility.** The `commandExists()` function uses `which`, which is a Unix command. On Windows, the equivalent is `where`. This will silently fail and fall through to the Claude Code default, which happens to be the right behavior, but it's fragile.

### Recommendations

#### A. Make postinstall more resilient

```javascript
// Handle sudo/root installations
function getActualHome() {
  return process.env.SUDO_USER
    ? `/home/${process.env.SUDO_USER}`  // Linux
    : homedir();
}

// Cross-platform command detection
function commandExists(cmd) {
  try {
    const check = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${check} ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
```

#### B. Add first-run detection to CLI

For users who installed with `--ignore-scripts`, the CLI should detect that skills are not registered and offer to register them on first use:

```javascript
// In cli.js, at startup:
if (!skillsRegistered() && command !== 'install-skills') {
  console.log('id3-cli: Skills not yet registered. Running setup...');
  await registerSkills();
}
```

This makes the postinstall non-critical -- it's a convenience, not a requirement.

#### C. Document the manual workaround

In README:
```
If you installed with --ignore-scripts:
  id3-cli install-skills
```

#### D. Consider removing postinstall entirely

The trend in the npm ecosystem is moving away from postinstall scripts due to security concerns. An alternative approach:

1. Remove `postinstall` from package.json
2. Add first-run auto-detection (option B above)
3. Skills get registered on first `id3-cli init` or `id3-cli install-skills`

**Recommendation:** Keep postinstall for convenience BUT add first-run detection as a safety net. This covers both paths.

---

## 6. Comprehensive Recommended package.json

```json
{
  "name": "id3-cli",
  "version": "1.0.0",
  "description": "IDDD: Information Design-Driven Development - your information model is the harness for AI coding agents",
  "type": "module",
  "bin": {
    "id3-cli": "dist/bin/cli.js"
  },
  "files": [
    "dist/bin/**/*.js",
    "dist/src/**/*.js",
    "dist/scripts/postinstall.js",
    "templates/",
    "assets/",
    "skills-global/"
  ],
  "scripts": {
    "build": "tsc && node dist/scripts/build-hooks.js",
    "build:cli": "tsc",
    "build:hooks": "node dist/scripts/build-hooks.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "version": "tsc && node dist/scripts/update-version.js && git add README.md docs/i18n/",
    "postinstall": "node dist/scripts/postinstall.js",
    "prepublishOnly": "npm run build && npm test",
    "prerelease": "npm pack --dry-run"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/bruce-jsh/iddd.git"
  },
  "homepage": "https://github.com/bruce-jsh/iddd#readme",
  "bugs": {
    "url": "https://github.com/bruce-jsh/iddd/issues"
  },
  "engines": {
    "node": ">=20.11.0"
  },
  "author": "Bruce Jung <sunghunet@gmail.com>",
  "license": "MIT",
  "keywords": [
    "iddd",
    "claude-code",
    "codex",
    "information-design",
    "data-modeling",
    "agent-skills",
    "ai-coding",
    "cli"
  ],
  "devDependencies": {
    "@types/node": "^25.5.2",
    "esbuild": "^0.25.0",
    "typescript": "^5.8.0",
    "vitest": "^3.1.0"
  }
}
```

---

## 7. Pre-Release Checklist

| Step | Action | Status |
|------|--------|--------|
| 1 | Create LICENSE file (MIT) | TODO |
| 2 | Move translated READMEs to `docs/i18n/` | TODO |
| 3 | Update `files` field in package.json | TODO |
| 4 | Add `repository`, `homepage`, `bugs` fields | TODO |
| 5 | Add `engines` field (>=20.11.0) | TODO |
| 6 | Verify `import.meta.dirname` usage vs engine target | TODO |
| 7 | Add `npm test` to `prepublishOnly` | TODO |
| 8 | Fix `which` -> cross-platform in register-skills.js | TODO |
| 9 | Add sudo/root home detection to postinstall | TODO |
| 10 | Add first-run skill detection fallback to CLI | TODO |
| 11 | Clean stale `dist/templates/hooks/` from git | TODO |
| 12 | Run `npm pack --dry-run` and verify contents | TODO |
| 13 | Test global install from tarball | TODO |
| 14 | Add `CHANGELOG.md` for v1.0.0 | TODO |
| 15 | Bump version to 1.0.0 | TODO |
| 16 | Run `npm publish --dry-run` | TODO |
| 17 | Publish: `npm publish` | TODO |

---

## Sources

- [npm package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) -- `files` field, `engines`, `repository` field behavior
- [npm scripts docs](https://docs.npmjs.com/cli/v11/using-npm/scripts/) -- lifecycle script ordering
- [npm-packlist source (GitHub)](https://github.com/npm/npm-packlist/blob/main/lib/index.js) -- README always-include regex confirmed
- [npm CLI wiki: Files & Ignores](https://github.com/npm/cli/wiki/Files-&-Ignores) -- inclusion/exclusion rules
- [npm blog: Publishing what you mean to publish](https://blog.npmjs.org/post/165769683050/publishing-what-you-mean-to-publish.html) -- `files` whitelist best practice
- [Jeff D.: For the love of god, don't use .npmignore](https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d) -- community consensus against .npmignore
- [npm RFC: opt-in install scripts](https://github.com/npm/rfcs/discussions/80) -- postinstall security discussion
- [npm CLI issue #619](https://github.com/npm/cli/issues/619) -- postinstall script opt-in proposals
- [Ivan Akulov: npm 4 prepublish split](https://iamakulov.com/notes/npm-4-prepublish/) -- prepare vs prepublishOnly history
- [Steve Fenton: Testing npm publish with dry run](https://stevefenton.co.uk/blog/2024/01/testing-npm-publish/) -- npm pack verification
- [Local npm package testing guide](https://blog.rnsloan.com/2025/01/11/local-npm-package-testing-made-simple-a-guide-to-npm-pack/) -- tarball testing workflow
- [npm security: ignore-scripts best practices](https://www.nodejs-security.com/blog/npm-ignore-scripts-best-practices-as-security-mitigation-for-malicious-packages/) -- --ignore-scripts adoption trend

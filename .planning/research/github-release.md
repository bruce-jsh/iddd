# GitHub Repository Cleanup & Release Practices

**Project:** id3-cli (IDDD)
**Researched:** 2026-04-07
**Overall confidence:** HIGH

---

## 1. .gitignore Review & Tracked File Cleanup

### Current State

The `.gitignore` currently excludes:

```
node_modules/
dist/
*.tgz
.DS_Store
package-lock.json
docs/superpowers/
prd/
tests/
scripts/
vitest.config.ts
tsconfig.json
```

### Problem: Tracked Files Not Respecting .gitignore

`.gitignore` only prevents **new** files from being tracked. Files added to git **before** the `.gitignore` entry was created remain tracked. Currently affected:

| Path | Status | Action Needed |
|------|--------|---------------|
| `tests/utils/ascii.test.ts` | Tracked despite `tests/` in .gitignore | `git rm --cached` |
| `scripts/postinstall.ts` | Tracked despite `scripts/` in .gitignore | `git rm --cached` |
| `.planning/` (28 files) | Tracked, NOT in .gitignore | Add to .gitignore + `git rm --cached -r` |

### Recommended .gitignore (Final)

```gitignore
# Dependencies
node_modules/

# Build output
dist/
*.tgz

# OS files
.DS_Store
Thumbs.db

# Lock files (project uses npm, but locks not committed for CLI tools)
package-lock.json

# Development artifacts - not for end users
docs/superpowers/
prd/
tests/
scripts/
vitest.config.ts
tsconfig.json

# AI agent / planning artifacts
.planning/
CLAUDE.md

# Editor artifacts
*.swp
*.swo
*~
.vscode/
.idea/
```

### Files to Add to .gitignore

| File/Dir | Reason |
|----------|--------|
| `.planning/` | Internal GSD planning files, 28 files currently polluting the repo |
| `CLAUDE.md` | AI agent instructions, not relevant to end users (currently untracked, keep it that way) |
| `.vscode/`, `.idea/` | Editor config, standard exclusion |
| `Thumbs.db` | Windows OS artifact |
| `*.swp`, `*.swo`, `*~` | Vim/editor swap files |

### Cleanup Commands (Execute in Order)

```bash
# 1. Update .gitignore first (add entries above)

# 2. Remove .planning/ from tracking (keeps files on disk)
git rm --cached -r .planning/

# 3. Remove stale tracked files that .gitignore should have caught
git rm --cached tests/utils/ascii.test.ts
git rm --cached scripts/postinstall.ts

# 4. Commit the cleanup
git commit -m "chore: remove dev artifacts from git tracking

Remove .planning/, tests/, and scripts/ from git index.
These files remain on disk but are no longer visible on GitHub."
```

**Confidence: HIGH** -- This is standard git practice, well-documented.

### npm Package Impact: NONE

The `"files"` field in `package.json` already uses a whitelist approach (`dist/`, `templates/`, `assets/`, `skills-global/`), so `.gitignore` changes have zero impact on what gets published to npm. This is the correct pattern -- the `"files"` field is the authoritative source for npm packaging.

---

## 2. GitHub Release Tags & Releases

### Current State

- One existing tag: `v0.9.3` (lightweight tag, created 2026-04-05)
- Commit messages follow conventional commits format (`feat:`, `fix:`, `docs:`, `chore:`)

### Tag Format: Use `vX.Y.Z`

Use the `v` prefix for git tags. Rationale:

1. **npm convention** -- `npm version` creates `vX.Y.Z` tags by default
2. **GitHub Actions compatibility** -- CI triggers use `v*` pattern matching
3. **Disambiguation** -- Prevents conflicts between branch names and tag names
4. **Already established** -- The existing `v0.9.3` tag already uses this format

### Annotated Tags Over Lightweight Tags

Use annotated tags (`git tag -a`) instead of lightweight tags:

```bash
# Annotated tag (recommended)
git tag -a v1.0.0 -m "v1.0.0: First stable release"

# Push the tag
git push origin v1.0.0
```

Annotated tags store metadata (tagger, date, message) and are the standard for releases.

### Creating a GitHub Release

Use `gh release create` for creating the release with auto-generated notes:

```bash
# Option A: Auto-generated notes from commit history
gh release create v1.0.0 --title "v1.0.0" --generate-notes

# Option B: Manual notes (more control)
gh release create v1.0.0 --title "v1.0.0 - First Stable Release" --notes "$(cat <<'EOF'
## What is IDDD?

Information Design-Driven Development: your information model is the harness for AI coding agents.

## Highlights

- 6 AI agent skills for information-first development
- Hook enforcement for Claude Code and Codex
- Multi-language README (EN, KR, ZH, JA, TR)

## Install

```bash
npm install -g id3-cli
```

## Full Documentation

See [README](https://github.com/bruce-jsh/iddd#readme)
EOF
)"
```

### Release Workflow for v1.0.0

```bash
# 1. Ensure all changes are committed
# 2. Bump version in package.json
npm version major  # 0.9.3 -> 1.0.0 (creates tag automatically)

# 3. Push commit and tag
git push origin master --tags

# 4. Create GitHub Release
gh release create v1.0.0 --title "v1.0.0 - First Stable Release" --generate-notes

# 5. Publish to npm
npm publish
```

Note: `npm version major` automatically:
- Updates `package.json` version to `1.0.0`
- Runs the `version` script (which builds and updates READMEs)
- Creates a git commit with message `1.0.0`
- Creates a git tag `v1.0.0`

### Changelog

For v1.0.0, a manually written changelog in the GitHub Release notes is sufficient. Automated changelog tools (release-please, conventional-changelog) are overkill for a project at this stage. Revisit after v1.0.0 if the release cadence increases.

**Confidence: HIGH** -- Standard npm/GitHub workflow.

---

## 3. LICENSE File

### Current State

- `package.json` declares `"license": "MIT"`
- **No LICENSE file exists in the repository**

### This is a Problem

Without a LICENSE file:
- GitHub does not display a license badge on the repository
- npm shows "MIT" but users cannot verify the actual license text
- Legally, the license claim is weaker without the full text

### Required Action: Add LICENSE File

Create `LICENSE` in the repository root with the standard MIT text:

```
MIT License

Copyright (c) 2026 Bruce Jung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

File should be named `LICENSE` (no extension), placed at repository root, and committed.

**Confidence: HIGH** -- This is a standard requirement for open-source projects.

---

## 4. GitHub-Specific Files (.github/, CONTRIBUTING.md, etc.)

### Recommendation: Minimal Set for v1.0.0

For a v1.0.0 release of a developer tool maintained primarily by one person, a full `.github/` setup with issue templates, PR templates, and CONTRIBUTING.md is premature. Add these files only:

#### Must Have for v1.0.0

| File | Why |
|------|-----|
| `LICENSE` | Legal requirement, GitHub badge |

#### Nice to Have (Add If Time Permits)

| File | Why |
|------|-----|
| `.github/FUNDING.yml` | If you want to accept sponsorship |
| `CONTRIBUTING.md` | Brief "how to contribute" if you want community PRs |

#### Skip for Now

| File | Why Skip |
|------|----------|
| `.github/ISSUE_TEMPLATE/` | Overkill for early-stage project with small user base |
| `.github/PULL_REQUEST_TEMPLATE.md` | Not needed until there are regular external contributors |
| `.github/workflows/` | CI/CD can be added in a later milestone |
| `CODE_OF_CONDUCT.md` | Standard practice but not blocking for v1.0.0 |
| `SECURITY.md` | Add when the project has meaningful attack surface |

### Rationale

Issue templates and contribution guides become valuable when a project has regular external contributors. For a v1.0.0 launch, focus on the product and documentation. Community infrastructure can be added in v1.1 or v1.2 as the user base grows.

**Confidence: HIGH** -- Based on common patterns for single-maintainer open-source projects.

---

## 5. Repository Metadata

### Current GitHub Repository Settings

Based on the remote URL `https://github.com/bruce-jsh/iddd.git`, the following metadata should be configured.

### Recommended Settings

```bash
# Description (concise, under 160 characters)
gh repo edit bruce-jsh/iddd \
  --description "IDDD: Information Design-Driven Development - AI agent skills that make your information model the harness" \
  --homepage "https://www.npmjs.com/package/id3-cli"

# Topics (3-7 relevant tags for discoverability)
gh repo edit bruce-jsh/iddd \
  --add-topic "iddd" \
  --add-topic "claude-code" \
  --add-topic "ai-agents" \
  --add-topic "information-design" \
  --add-topic "data-modeling" \
  --add-topic "developer-tools" \
  --add-topic "npm-package"
```

### Topic Selection Rationale

| Topic | Why |
|-------|-----|
| `iddd` | Brand/methodology name |
| `claude-code` | Primary target platform |
| `ai-agents` | Broader category |
| `information-design` | Core methodology concept |
| `data-modeling` | Related discipline |
| `developer-tools` | Category for discoverability |
| `npm-package` | Installation method |

### Homepage URL

Use `https://www.npmjs.com/package/id3-cli` as the homepage until a dedicated documentation site exists. The npm page provides install instructions and package metadata.

**Confidence: HIGH** -- Standard GitHub repository settings.

---

## 6. Complete Pre-Release Checklist

### Priority Order (Do These Before Tagging v1.0.0)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Add `LICENSE` file | Legal compliance, GitHub badge | 5 min |
| 2 | Update `.gitignore` | Clean repository for users | 5 min |
| 3 | Run `git rm --cached` cleanup | Remove .planning/ and stale tracked files from GitHub | 5 min |
| 4 | Set repository description and topics | Discoverability | 5 min |
| 5 | Set homepage URL | User navigation | 2 min |
| 6 | Create annotated tag `v1.0.0` | Release identification | 2 min |
| 7 | Create GitHub Release with notes | User-facing changelog | 10 min |
| 8 | Publish to npm | Distribution | 5 min |

### Post-Release (v1.1+)

- Add `.github/workflows/` for CI (lint, test, auto-publish)
- Add issue templates when community grows
- Add CONTRIBUTING.md when accepting PRs
- Consider automated changelog generation if release frequency increases

---

## Sources

- [Removing Tracked Files With .gitignore](https://www.baeldung.com/ops/git-remove-tracked-files-gitignore) -- git rm --cached workflow
- [npm Files & Ignores](https://github.com/npm/cli/wiki/Files-&-Ignores) -- npm packaging rules
- [How to ignore files from npm package](https://zellwk.com/blog/ignoring-files-from-npm-package/) -- files field vs .npmignore
- [Semantic Versioning 2.0.0](https://semver.org/) -- version format specification
- [v prefix discussion](https://github.com/semver/semver/issues/204) -- tag naming convention
- [GitHub auto-generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes)
- [gh release create](https://cli.github.com/manual/gh_release_create) -- CLI usage
- [Adding a license to a repository](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)
- [MIT License template](https://choosealicense.com/licenses/mit/)
- [GitHub Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- [GitHub Repository Best Practices](https://dev.to/pwd9000/github-repository-best-practices-23ck)
- [Best practices for npm packages](https://snyk.io/blog/best-practices-create-modern-npm-package/)

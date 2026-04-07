---
phase: 03-repo-package-cleanup
plan: 02
subsystem: packaging
tags: [npm, package.json, files-field, metadata, engines]

# Dependency graph
requires:
  - phase: 03-repo-package-cleanup/01
    provides: clean git tracking (.gitignore, LICENSE, dev artifacts removed)
provides:
  - Production-ready package.json with complete npm metadata
  - Refined files field excluding dev artifacts from tarball
  - prepublishOnly script running build + test
  - SKILL.md with global install references (no npx)
affects: [npm-publish, release-workflow]

# Tech tracking
tech-stack:
  added: []
  patterns: [whitelist-only npm files field, prepublishOnly build+test gate]

key-files:
  created: []
  modified: [package.json, skills-global/id3-start/SKILL.md]

key-decisions:
  - "Glob patterns dist/bin/**/*.js and dist/src/**/*.js instead of broad dist/ to exclude dev scripts, .d.ts, .js.map"
  - "Explicitly include dist/scripts/postinstall.js (needed for npm lifecycle) while excluding build-hooks.js and update-version.js"
  - "Replace npx id3-cli . with id3-cli init . for global install consistency"

patterns-established:
  - "Files whitelist: only runtime JS included in npm tarball"
  - "Publish gate: prepublishOnly always runs build + test"

requirements-completed: [PKG-01, PKG-02, PKG-03, PKG-04, PKG-05]

# Metrics
duration: 2min
completed: 2026-04-07
---

# Phase 03 Plan 02: Package Metadata & Files Refinement Summary

**Production-ready package.json with repository/homepage/bugs/engines metadata, whitelist-only files field excluding dev scripts and .d.ts, and npx-to-global-install references in SKILL.md**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-07T02:36:57Z
- **Completed:** 2026-04-07T02:39:17Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added repository, homepage, bugs, and engines fields to package.json for complete npmjs.com metadata
- Refined files field from broad `dist/` to targeted globs, reducing tarball to runtime-only JS (83 files, 157.2 kB)
- Updated prepublishOnly from `npm run build` to `npm run build && npm test` as publish safety gate
- Replaced all npx references in id3-start/SKILL.md with global install `id3-cli init .` syntax

## Task Commits

Each task was committed atomically:

1. **Task 1: Update package.json metadata and files field** - `5fb7ef5` (chore)
2. **Task 2: Fix npx references in SKILL.md and verify npm pack** - SKILL.md changes were already committed in `44cdd40` (03-01 plan execution); no additional commit needed

## Files Created/Modified
- `package.json` - Added repository/homepage/bugs/engines fields, refined files whitelist, updated prepublishOnly
- `skills-global/id3-start/SKILL.md` - Replaced `npx id3-cli .` with `id3-cli init .` in auto-setup command and end-of-file note

## Decisions Made
- Used glob patterns (`dist/bin/**/*.js`, `dist/src/**/*.js`) instead of directory-level include to precisely control tarball contents
- Explicitly listed `dist/scripts/postinstall.js` as the only scripts file needed at runtime
- Node engine requirement set to `>=20.11.0` matching project's minimum supported version

## Deviations from Plan

### Task 2 SKILL.md changes already committed

The SKILL.md npx-to-id3-cli-init replacements were found to be already committed in `44cdd40` during the 03-01 plan execution. The edits in this plan were effectively no-ops. The file content is verified correct with zero npx references and two `id3-cli init .` references.

**Total deviations:** 1 (SKILL.md changes pre-committed in prior plan)
**Impact on plan:** No impact. All acceptance criteria met. The changes exist in git history and the file is in correct state.

## Issues Encountered
None

## Verified Exclusions (npm pack --dry-run)

| Excluded Item | Status |
|---|---|
| dist/scripts/build-hooks.js | NOT in tarball |
| dist/scripts/update-version.js | NOT in tarball |
| .d.ts files | NOT in tarball |
| dist/templates/ | NOT in tarball |

## Verified Inclusions (npm pack --dry-run)

| Included Item | Status |
|---|---|
| dist/bin/cli.js | In tarball (3.6 kB) |
| dist/src/**/*.js | In tarball (12 files) |
| dist/scripts/postinstall.js | In tarball (578 B) |
| templates/ | In tarball (33 files) |
| assets/ | In tarball (1 file) |
| skills-global/ | In tarball (4 files) |

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Package is production-ready for npm publish
- All metadata present for npmjs.com listing
- Files field prevents dev artifact leakage
- prepublishOnly gate ensures tests pass before every publish

## Self-Check: PASSED

- [x] package.json exists with all required fields
- [x] skills-global/id3-start/SKILL.md exists with correct content
- [x] 03-02-SUMMARY.md exists
- [x] Commit 5fb7ef5 exists (Task 1)
- [x] Commit 4f630a9 exists (docs)

---
*Phase: 03-repo-package-cleanup*
*Completed: 2026-04-07*

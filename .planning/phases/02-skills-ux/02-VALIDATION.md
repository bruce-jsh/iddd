---
phase: 2
slug: skills-ux
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-06
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual invocation testing (SKILL.md prompt artifacts) |
| **Config file** | none — no automated tests applicable |
| **Quick run command** | `npx vitest run` (existing tests only — no new tests for SKILL.md content) |
| **Full suite command** | `npx vitest run` (verify no regressions) |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Visual inspection of SKILL.md content for completeness and correctness
- **After every plan wave:** Manual invocation test of `/id3-start` and `/id3-clear` in a test project
- **Before `/gsd:verify-work`:** Full manual test of all 5 success criteria from ROADMAP.md
- **Max feedback latency:** ~30 seconds (manual invocation)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | ROUT-01 | manual | Invoke `/id3-start` in fresh project, verify npx runs | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | ROUT-02 | manual | `/id3-start design a CRM` → verify Phase 0/1 route | N/A | ⬜ pending |
| 02-01-03 | 01 | 1 | ROUT-03 | manual | Verify dashboard shows correct Phase status from YAML | N/A | ⬜ pending |
| 02-01-04 | 01 | 1 | ROUT-04 | manual | Verify message format after routing decision | N/A | ⬜ pending |
| 02-01-05 | 01 | 1 | ROUT-05 | manual | `/id3-start design login screen` routes to design-ui | N/A | ⬜ pending |
| 02-01-06 | 01 | 1 | ROUT-06 | manual | `/id3-start add filter` triggers clarification | N/A | ⬜ pending |
| 02-01-07 | 01 | 1 | ROUT-07 | manual | Verify router invokes target skill | N/A | ⬜ pending |
| 02-01-08 | 01 | 1 | ROUT-08 | manual | Route to Phase 2 without Phase 1 done | N/A | ⬜ pending |
| 02-01-09 | 01 | 1 | ROUT-09 | manual | Verify user request reaches target skill | N/A | ⬜ pending |
| 02-01-10 | 01 | 1 | ROUT-10 | manual | Run `/id3-start` twice, verify no double-init | N/A | ⬜ pending |
| 02-02-01 | 02 | 1 | CLR-01 | manual | Run `/id3-clear`, verify all IDDD files removed | N/A | ⬜ pending |
| 02-02-02 | 02 | 1 | CLR-02 | manual | Verify warning shows before deletion | N/A | ⬜ pending |
| 02-02-03 | 02 | 1 | CLR-03 | manual | Verify summary after clear | N/A | ⬜ pending |
| 02-01-11 | 01 | 1 | UX-01 | manual | Run `/id3-start`, verify dashboard renders | N/A | ⬜ pending |
| 02-01-12 | 01 | 1 | UX-02 | manual | Run `/id3-start` with no args, verify suggestion | N/A | ⬜ pending |
| 02-01-13 | 01 | 1 | UX-03 | manual | Verify routing announcement includes phase info | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. This phase produces SKILL.md files (prompt content), not TypeScript code. No new test infrastructure needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Auto-setup detection | ROUT-01 | SKILL.md is a prompt artifact — no unit testable code | Run `/id3-start` in fresh project directory, verify `npx id3-cli .` executes |
| Intent routing | ROUT-02, ROUT-05, ROUT-06 | Claude's LLM classification is non-deterministic | Invoke with various intent strings, verify correct phase routing |
| Dashboard rendering | UX-01, ROUT-03 | ASCII output rendered by Claude at runtime | Visually inspect dashboard format matches CONTEXT.md mockup |
| File deletion | CLR-01 | File system side effects from prompt execution | Run `/id3-clear` and verify all IDDD paths are removed |
| Confirmation UX | CLR-02 | Interactive confirmation flow | Verify warning text, user-authored file callouts, y/N prompt |
| Status display | UX-02 | No-args behavior depends on project state | Run `/id3-start` without arguments in project with partial progress |
| Prerequisite enforcement | ROUT-08 | Relies on target skill's built-in checks | Attempt out-of-order routing, verify guidance message |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: manual verification after each commit
- [x] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

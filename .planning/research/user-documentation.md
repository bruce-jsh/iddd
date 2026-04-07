# Research: User Documentation Standards for CLI Tool

**Project:** id3-cli (IDDD skill package for Claude Code)
**Researched:** 2026-04-07
**Mode:** Ecosystem
**Overall Confidence:** HIGH

---

## 1. README Structure for a Global npm CLI Tool

### The Problem with the Current README

The current README (872 lines) leads with methodology explanation: ASCII art banner (42 lines), IDDD philosophy paragraph, Core Principles (5 items), Three-Stage Data Modeling diagram, and a derived artifacts table -- all before the user encounters their first install command at line 127.

This violates the universal pattern observed across successful CLI tools. Commander.js (37K stars), oclif, Turborepo, and the standard-readme specification all follow the same structural principle: **install first, philosophy later**.

A user visiting the npm page or GitHub repo has one immediate question: "How do I use this?" The current README answers "What is IDDD?" instead.

### Recommended README Structure

Based on the standard-readme specification (RichardLitt/standard-readme), npm official documentation guidelines, Node.js CLI Apps Best Practices (lirantal/nodejs-cli-apps-best-practices), and analysis of successful CLI tool READMEs:

```
1. Language selector (1 line)
2. Title + one-line description (2-3 lines)
3. Badges (npm version, license, platform)
4. Quick Start (install + first command, 10-15 lines)
5. What is IDDD? (2-paragraph summary -- NOT the full methodology)
6. Supported Platforms table
7. Prerequisites table
8. Installation (detailed: global vs npx, options, overwrite detection)
9. Skills overview (table: skill name, phase, one-liner)
10. Workflow diagram (the ASCII workflow overview)
11. Phase Walkthrough (condensed)
12. Harness Hook System (condensed)
13. Customization Guide
14. Usage Examples
15. Methodology Deep Dive (link to separate doc OR collapsed <details>)
16. Intellectual Lineage
17. License
```

### Key Structural Changes

**Move Quick Start to the top.** The user should see this within 10 lines of scrolling:

```markdown
## Quick Start

```bash
npm i -g id3-cli
```

Then in Claude Code:

```
/id3-start
```

That is it. The agent handles setup, shows your project dashboard, and guides you to the next step.
```

**Compress the methodology section.** The current 80+ lines of IDDD philosophy (Core Principles, Three-Stage Data Modeling, derived artifacts table) should be condensed to a 2-paragraph "What is IDDD?" summary at the top, with the full methodology moved to either:
- A separate `docs/METHODOLOGY.md` file (linked from README), or
- A collapsible `<details><summary>` section further down

**Promote the Skills table.** Users need a quick reference of what commands are available. A compact table near the top (after Quick Start and What is IDDD?) is more useful than the current approach of documenting each skill in 20+ lines inline.

**Confidence:** HIGH -- Based on standard-readme spec, npm docs, and pattern analysis of Commander.js, Turborepo, and oclif READMEs.

---

## 2. Installation Instructions Clarity

### Current State

The installation section (lines 125-188) is competent but buried 125 lines deep. It covers global install, npx alternative, options table, overwrite detection, and post-install output. This is good content in the wrong location.

### Recommendations

**A. Separate "Quick Start" from "Detailed Installation"**

Quick Start (top of README):
- 3 lines: `npm i -g id3-cli`, then `/id3-start` in Claude Code
- Targets the 80% case: global install + start using immediately

Detailed Installation (later section):
- Global install with explanation of what it does
- npx alternative for one-off use
- Options table (`--no-symlink`, `--platform`)
- Overwrite detection behavior
- Post-install output (what to expect)
- Troubleshooting common issues

**B. Document the skill registration mechanism clearly**

The postinstall hook registers skills to `~/.claude/skills-global/`. This is non-obvious and critical. Users need to understand:
1. What happens during `npm i -g`: CLI binary installed + skills copied to `~/.claude/skills-global/`
2. What happens when they type `/id3-start` in Claude Code: Claude reads the SKILL.md, agent takes over
3. What happens on `npm uninstall -g`: skills cleaned up

**C. Add a troubleshooting subsection**

Common failure modes to document:
- Claude Code cannot find `/id3-start` after install -> Check `~/.claude/skills-global/` exists
- Permission errors on global install -> Use `sudo` or configure npm prefix
- Windows symlink issues -> Use `--no-symlink` flag

**Confidence:** HIGH -- Based on npm docs, standard-readme spec, and CLI best practices literature.

---

## 3. Quick Start Guide: Separate vs. Integrated

### Recommendation: Integrated into README, NOT a separate file

**Rationale:**

1. **npm renders README.md on the package page.** A separate QUICKSTART.md file would not appear on npmjs.com. The Quick Start must be in README to reach users where they discover the package.

2. **GitHub renders README.md on the repo landing page.** Same principle -- the first thing users see must contain actionable steps.

3. **One file to maintain across 5 languages.** Each additional documentation file multiplies translation burden by 5. A separate QUICKSTART.md means 5 more files to keep in sync.

4. **CLI best practice consensus.** Commander.js, yargs, and oclif all keep their Quick Start inline in README. The standard-readme spec has "Install" and "Usage" as required sections, not separate files.

5. **The current README is long (872 lines) primarily because of methodology content, not because of installation/usage content.** The fix is to move methodology deeper (or to a separate doc), not to extract Quick Start.

### What the Quick Start Section Should Cover

For someone who just ran `npm i -g id3-cli`:

```markdown
## Quick Start

### 1. Install globally

```bash
npm i -g id3-cli
```

### 2. Open Claude Code in any project

```bash
cd your-project
claude
```

### 3. Start IDDD

```
/id3-start
```

The agent will:
- Auto-detect if IDDD is set up in this project
- Run setup if needed (copies templates, registers hooks)
- Show your progress dashboard
- Suggest the next action based on project state

### 4. Follow the agent's guidance

```
/id3-start identify the entities in my domain
/id3-start refine the model
/id3-start design the UI
/id3-start build the system
```

Each command routes to the appropriate IDDD phase automatically.
```

This takes roughly 30 lines and gives a complete "zero to working" path.

**Confidence:** HIGH -- npm docs explicitly state README is the primary documentation surface. All examined CLI tools confirm this pattern.

---

## 4. Multi-Language README Management

### Current State

The project maintains 5 README files:
- `README.md` (English, canonical)
- `README.ko-KR.md` (Korean)
- `README.zh-CN.md` (Chinese Simplified)
- `README.ja-JP.md` (Japanese)
- `README.tr-TR.md` (Turkish)

All are 872 lines -- identical length, suggesting they were generated simultaneously. The `package.json` version script already handles updating version strings across all 5 files.

### Naming Convention

The current naming (`README.ko-KR.md`) follows BCP 47 language tags, which is the community standard for GitHub multilingual READMEs. This is correct. Keep it.

GitHub only renders `README.md` on the repo landing page. The language selector at line 1 of README.md links to the translated versions. This is the standard approach.

### Sync Strategy Recommendations

**A. Designate English as the canonical source**

All content changes should be made to `README.md` first, then propagated to translations. Never edit a translated README directly for content changes.

**B. Use a translation automation workflow**

Three viable approaches, ranked by recommendation:

1. **Manual translation with diff tracking (recommended for v1.0.0)**
   - After editing `README.md`, run `git diff README.md` to identify changed sections
   - Manually update corresponding sections in translated files
   - Use the existing `version` script pattern as a model for automation
   - Why: 5 languages with a stable document is manageable. Automation introduces complexity and quality risk for a v1.0.0 launch.

2. **GitHub Action for auto-translation (defer to post-v1.0.0)**
   - `Lin-jun-xiang/action-translate-readme` or similar
   - Triggers on push to main, auto-translates changed sections
   - Creates PR with translated content for human review
   - Why defer: Translation quality varies. For a v1.0.0 launch, human-reviewed translations are more trustworthy.

3. **Crowdin / Transifex integration (defer to significant community growth)**
   - Platform-managed translations with contributor workflow
   - Only justified when external translators contribute regularly

**C. Reduce translated surface area**

The current 872-line README is fully translated. If the README is restructured (recommendation #1 above), the translated versions should follow. However, consider:

- The methodology deep dive (if moved to `docs/METHODOLOGY.md`) could initially be English-only, reducing translation burden
- Code examples, directory structures, and command snippets are language-neutral and should remain identical across all versions
- Only prose sections need actual translation

**D. Add a "Translation Status" notice to each translated file**

```markdown
> This translation is based on README.md as of [commit hash or date].
> If you find outdated content, please refer to the [English version](README.md).
```

This sets expectations and helps users identify stale translations.

**Confidence:** HIGH -- Based on GitHub community discussions, standard practices from popular multi-language repositories, and practical assessment of the project's current state.

---

## 5. CHANGELOG.md for v1.0.0

### Recommendation: Yes, create a CHANGELOG.md

**Rationale:**
- Keep a Changelog is the de facto standard for open-source projects
- npm package health metrics check for its existence
- Users evaluating the package want to see release history
- It provides a structured history that git log cannot replace (git log is for developers, changelog is for users)

### Format: Keep a Changelog (keepachangelog.com)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-04-XX

### Added
- Global installation via `npm i -g id3-cli` with automatic skill registration
- `/id3-start` smart router: auto-setup, progress dashboard, intent-based phase routing
- `/id3-clear` project reset with confirmation and safety checks
- 6 project-level skills: identify-entities, design-information, design-ui, spawn-team, info-audit, preview
- Harness hook system: schema-drift (block), rule-check (warn), auto-audit (info)
- Cross-platform support: Claude Code (Agent Teams) and OpenAI Codex (Agents SDK)
- IDDD template system: specs/, docs/, steering/, hooks/ directories
- Version headers and entropy management for information model tracking
- Multi-language README: English, Korean, Chinese, Japanese, Turkish

[Unreleased]: https://github.com/bruce-jsh/iddd/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/bruce-jsh/iddd/releases/tag/v1.0.0
```

### Key Decisions

1. **English only.** CHANGELOG.md does not need translation. It is a developer-facing artifact, and the technical terms (skill names, hook names) are in English regardless.

2. **One section for v1.0.0.** Since this is the initial public release, everything goes under "Added." No "Changed" or "Fixed" sections are needed -- there is no prior public version to change from.

3. **Link references at the bottom.** Keep a Changelog recommends linkable version headers. The `[Unreleased]` and `[1.0.0]` links at the bottom enable GitHub diff comparison.

4. **Do NOT auto-generate from git log.** The changelog should be human-curated, describing user-visible changes in user-understandable terms. "feat: add postinstall hook for auto skill registration" is a git commit message, not a changelog entry.

**Confidence:** HIGH -- Keep a Changelog is a well-established, widely-adopted standard with clear specification.

---

## 6. Additional Documentation Recommendations

### A. Add npm Badges to README

```markdown
[![npm version](https://img.shields.io/npm/v/id3-cli.svg)](https://www.npmjs.com/package/id3-cli)
[![license](https://img.shields.io/npm/l/id3-cli.svg)](https://github.com/bruce-jsh/iddd/blob/master/LICENSE)
```

Badges signal package health and provide at-a-glance information. npm version badge is the most important for a CLI tool (users need to know the current version).

### B. Add a LICENSE File

The `package.json` declares `"license": "MIT"` but there is no `LICENSE` file in the repository root. GitHub and npm both look for this file. Create a standard MIT LICENSE file.

### C. Ensure the package description is optimized

The current `package.json` description: "IDDD: Information Design-Driven Development - your information model is the harness for AI coding agents"

This is good but slightly long. npm truncates descriptions on search results. The first ~60 characters matter most. Consider: "Information Design-Driven Development skills for AI coding agents" (65 chars) -- leads with the methodology name rather than the acronym.

### D. Add "keywords" for discoverability

Current keywords are reasonable but could be expanded:
```json
"keywords": [
  "iddd",
  "claude-code",
  "codex",
  "information-design",
  "data-modeling",
  "agent-skills",
  "ai-agent",
  "claude",
  "slash-commands",
  "development-methodology"
]
```

---

## Summary of Actionable Recommendations

### Must Do for v1.0.0

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Restructure README: Quick Start at top, methodology deeper | HIGH -- First impression determines adoption | Medium |
| 2 | Create CHANGELOG.md | MEDIUM -- Package health signal, user expectation | Low |
| 3 | Create LICENSE file | HIGH -- Legal requirement, npm/GitHub health | Low |
| 4 | Add npm badges to README | LOW -- Polish and professionalism | Low |
| 5 | Add troubleshooting section to README | MEDIUM -- Reduces support burden | Low |

### Should Do for v1.0.0

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 6 | Update all 5 translated READMEs to match new structure | HIGH -- Consistency across languages | High |
| 7 | Add translation status notice to translated READMEs | LOW -- Sets expectations | Low |
| 8 | Expand npm keywords | LOW -- Discoverability | Low |

### Defer to Post-v1.0.0

| # | Action | Rationale |
|---|--------|-----------|
| 9 | GitHub Action for auto-translation | Quality risk at launch |
| 10 | Separate docs/METHODOLOGY.md | Can be done later without breaking anything |
| 11 | Crowdin/Transifex integration | Only needed with external translators |

---

## Sources

### Official Documentation
- [npm: About package README files](https://docs.npmjs.com/about-package-readme-files/)
- [Keep a Changelog 1.0.0](https://keepachangelog.com/en/1.0.0/)
- [Standard Readme Specification](https://github.com/RichardLitt/standard-readme/blob/main/spec.md)

### Best Practice Guides
- [Node.js CLI Apps Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)
- [How I Organize README - Gleb Bahmutov](https://glebbahmutov.com/blog/how-i-organize-readme/)

### Reference READMEs Analyzed
- [Commander.js](https://github.com/tj/commander.js) -- Tutorial-style, install-first, progressive complexity
- [Turborepo](https://github.com/vercel/turbo) -- Gateway README, delegates to external docs
- [oclif](https://github.com/oclif/oclif) -- Auto-generated command docs in README

### Multi-Language README
- [GitHub Discussion: Multi-language README](https://github.com/orgs/community/discussions/31132)
- [GitHub Discussion: i18n for readme files](https://github.com/orgs/community/discussions/50719)
- [Auto Translate Readme GitHub Action](https://github.com/Lin-jun-xiang/action-translate-readme)
- [How to Localize a README for GitHub](https://blog.laratranslate.com/how-to-localize-a-readme-file-github/)

### CLI Documentation
- [WebbyLab: Best Practices for Building CLI and Publishing to npm](https://webbylab.com/blog/best-practices-for-building-cli-and-publishing-it-to-npm/)
- [npm Hygiene: READMEs, Versioning, and Badges](https://guypursey.com/blog/201610101930-hygiene-node-package-readmes-versioning-badges)

# Project Research Summary

**Project:** id3-cli (IDDD Skill Package v2) -- Deployment & Smart Routing
**Domain:** npm CLI tool + Claude Code skill registration + LLM-native smart routing
**Researched:** 2026-04-06
**Confidence:** HIGH

## Executive Summary

id3-cli needs to evolve from an `npx`-only template copier into a tool that also supports `npm i -g` installation and registers two new Claude Code skills: `/id3-init` (project scaffolding from within Claude Code) and `/id3-start` (smart router that analyzes user intent and dispatches to the correct IDDD phase). The existing 6 skills and the `npx id3-cli .` workflow remain unchanged. The core technical challenge is choosing the right skill distribution mechanism, and the research points clearly to one answer: **project-scoped skills via the existing init flow, with an explicit CLI subcommand for optional global skill registration**. The Claude Code plugin system (namespaced commands, marketplace dependency) is over-engineered for two global skills. A `postinstall` script that writes to `~/.claude/skills/` is an anti-pattern that breaks for security-conscious users and creates orphaned files. The right path is an explicit `id3-cli install-skills` command that users opt into.

The smart router (`/id3-start`) should be a pure prompt-based skill -- Claude itself is the intent classifier. The SKILL.md contains a decision tree that checks project state (file existence) and analyzes user intent to route to the correct phase. No external classifier, no keyword matching, no runtime dependencies. This is the established "LLM-native routing" pattern and is strictly superior to any code-based alternative for this use case. The router must be a convenience helper, not a required gateway -- users should always be able to invoke phase skills directly.

The main risks are: (1) template path resolution breaking under global install due to `import.meta.dirname` fragility, (2) skill naming collisions between global and project scope if both are populated, and (3) smart router misclassification cascading into wasted effort. All three are mitigable with straightforward engineering: validate resolved paths at runtime, choose one scope per skill category, and use file-existence checks as deterministic routing signals alongside natural language classification.

## Key Findings

### Recommended Stack

The stack requires zero changes. The project has zero runtime dependencies and should keep it that way. Node.js >= 22.x, TypeScript 5.8.x, tsc for builds, Vitest for testing. No new libraries, frameworks, or build tools are justified.

**Core technologies:**
- **Node.js >= 22.x**: Runtime -- already in use, ES2022 target stable
- **TypeScript ^5.8.x**: Language -- already in use, no reason to change
- **tsc (no bundler)**: Build -- produces clean ESM output, bundler adds complexity with no payoff for a CLI tool
- **Vitest ^3.1.x**: Testing -- already in use, fast, ESM-native

**Explicitly rejected:** tsup/tsdown (unmaintained/unnecessary), commander/yargs (only 2-3 commands), any NLP/ML routing library (Claude itself is the classifier).

### Expected Features

**Must have (table stakes):**

Init flow:
- I-1: `npm i -g id3-cli` works and exposes the CLI globally
- I-2: `npx id3-cli` backward compatibility preserved
- I-3: Idempotent execution (safe re-run in initialized projects)
- I-7: `--help` / `--version` flags (missing today, required for global CLI)
- I-9: Skill registration mechanism for `/id3-init` and `/id3-start`

Smart router:
- R-1: Natural language intent analysis (Claude-native, not keyword matching)
- R-2: Project state-aware routing (read spec files to determine phase)
- R-3: Transparent routing announcements (tell user where and why)
- R-4: Direct-to-UI fast path (skip entity work for pure UI requests)
- R-5: Fallback for ambiguous requests (ask, don't guess)
- R-6: Skill invocation (actually call the target skill)
- R-7: Phase prerequisite awareness
- R-8: `$ARGUMENTS` pass-through

**Should have (differentiators):**
- D-5: Contextual help in routing announcements (low effort, good polish)
- D-1: Progress dashboard showing IDDD phase completion status

**Defer (v2+):**
- D-2: Suggested next action with completeness heuristics
- D-3: `--dry-run` flag
- D-4: Update mechanism (`--update` that preserves customizations)
- D-6: Multi-request decomposition (high risk of over-engineering)

**Anti-features (explicitly never build):**
- Interactive CLI wizard (breaks skill execution model)
- Confidence scoring for routing (theater)
- Custom routing rules (undermines methodology)
- Telemetry (developer backlash)
- Self-updating CLI (anti-pattern)

### Architecture Approach

The architecture adds three components to the existing codebase: (1) a `skills-global/` directory containing `id3-init` and `id3-start` SKILL.md files for global-scope registration, (2) a registration mechanism (explicit CLI subcommand, NOT postinstall) that copies these to `~/.claude/skills/`, and (3) the smart router as a pure-prompt SKILL.md with a references/ subdirectory. The existing `bin/cli.ts` entry point gains subcommand parsing (`init`, `install-skills`, `--help`, `--version`). The existing 6 phase skills remain project-scoped (copied during init to `.claude/skills/`). This creates a clean separation: global skills for entry points (`id3-init`, `id3-start`), project skills for phase execution.

**Major components:**
1. **bin/cli.ts** -- CLI entry point, gains subcommand routing (init, install-skills)
2. **src/init.ts** -- Existing init logic, unchanged
3. **skills-global/id3-init/SKILL.md** -- Thin wrapper that invokes `npx id3-cli@latest .`
4. **skills-global/id3-start/SKILL.md** -- LLM-native routing decision tree with file-existence checks
5. **Registration mechanism** -- Explicit `id3-cli install-skills` command that copies global skills to `~/.claude/skills/`

### Critical Pitfalls

1. **Template path resolution breaks on global install** -- `import.meta.dirname` resolves correctly for `npx` but may break under bundling or older Node.js. Fix: validate resolved path exists at runtime; standardize on `import.meta.url` + `fileURLToPath()`.

2. **postinstall for skill registration is an anti-pattern** -- pnpm v10 disables postinstall by default; security-conscious users use `--ignore-scripts`; no cleanup on uninstall. Fix: use an explicit `id3-cli install-skills` subcommand instead.

3. **Skill naming collisions between scopes** -- If `id3-identify-entities` exists in both `~/.claude/skills/` (global) and `.claude/skills/` (project), global wins and project customizations are silently ignored. Fix: only `id3-init` and `id3-start` go global; phase skills stay project-scoped exclusively.

4. **Smart router misclassification cascade** -- Ambiguous requests like "design user profile" could match 3 phases. Fix: use deterministic file-existence checks as primary routing signals; make routing transparent with confirmation; keep direct skill invocation as the primary path.

5. **Hook absolute paths break on machine transfer** -- `injectClaudeHooks()` writes absolute paths into settings JSON. Fix: switch to relative paths from project root (`./hooks/iddd-schema-drift.js`).

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Global Install Foundation

**Rationale:** Everything else depends on the CLI working correctly under `npm i -g`. Path resolution, CLI argument handling, and package structure must be solid before building skills on top.
**Delivers:** A globally installable `id3-cli` with subcommand routing, `--help`/`--version`, and verified backward compatibility with `npx id3-cli`.
**Addresses:** I-1 (global install), I-2 (backward compat), I-7 (help/version), I-8 (exit codes), I-4 (cross-platform paths)
**Avoids:** Pitfall 1 (path resolution), Pitfall 5 (bin field), Pitfall 6 (absolute hook paths), Pitfall 7 (files field), Pitfall 8 (symlink strategy)

### Phase 2: Skill Registration Infrastructure

**Rationale:** Before writing skill content, the registration mechanism must exist and be tested. This phase builds the `skills-global/` directory structure and the `id3-cli install-skills` subcommand.
**Delivers:** `id3-cli install-skills` command that copies `id3-init` and `id3-start` SKILL.md files to `~/.claude/skills/`. Verified with `npm pack` and test install.
**Addresses:** I-9 (skill registration), I-5 (platform detection), I-6 (success output)
**Avoids:** Pitfall 2 (postinstall anti-pattern), Pitfall 3 (scope collision)

### Phase 3: id3-init Skill

**Rationale:** Simpler of the two new skills. Validates that the global skill registration works end-to-end. Is a thin wrapper around existing `initProject()` logic.
**Delivers:** `/id3-init` slash command in Claude Code that scaffolds IDDD into the current project by invoking `npx id3-cli@latest .`.
**Addresses:** I-3 (idempotent execution verification in global path)

### Phase 4: id3-start Smart Router

**Rationale:** Most complex new component. Depends on all previous phases. Requires careful prompt engineering with the routing decision tree.
**Delivers:** `/id3-start [request]` slash command that analyzes intent, checks project state, and routes to the correct IDDD phase skill with transparent announcements.
**Addresses:** R-1 through R-8 (all routing features), D-5 (contextual help if time permits)
**Avoids:** Pitfall 4 (misclassification), Pitfall 12 (maintenance bottleneck)

### Phase 5: Polish and Distribution

**Rationale:** After core functionality works, handle edge cases, documentation, version-check notifications, and marketplace/distribution setup.
**Delivers:** Version update notifications, uninstall cleanup (`id3-cli uninstall-skills`), updated README, marketplace.json for optional Claude Code plugin distribution.
**Addresses:** D-1 (progress dashboard), D-5 (contextual help), Pitfall 11 (version divergence)

### Phase Ordering Rationale

- Phases 1-2 are infrastructure. They produce no user-visible features but are required foundations. Path resolution (Phase 1) and skill registration (Phase 2) are the two highest-risk areas identified in pitfalls research.
- Phase 3 before Phase 4 because `id3-init` validates the skill registration pipeline with a simple skill before attempting the complex router.
- Phase 4 is the creative/prompt-engineering phase. By this point, all infrastructure is proven and the focus is purely on routing logic quality.
- Phase 5 is polish. It should not block a v1.0.0 release -- Phases 1-4 are sufficient for launch.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Skill Registration):** The exact behavior of `~/.claude/skills/` for personal skills needs validation -- confirm that un-namespaced slash commands work, test scope resolution priority with project-scoped skills of different names.
- **Phase 4 (Smart Router):** Prompt engineering for the routing decision tree needs iterative testing. The classification taxonomy in SKILL.md will need multiple revisions based on real user inputs.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Global Install):** Well-documented npm CLI patterns. The codebase already has most of the logic; this is primarily bug fixes and CLI argument handling.
- **Phase 3 (id3-init Skill):** Straightforward SKILL.md that wraps an existing CLI command. No research needed.
- **Phase 5 (Polish):** Standard distribution and documentation tasks.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | No changes needed. All technologies already in use and proven. |
| Features | HIGH | Clear table stakes from CLI best practices and Claude Code skill docs. Feature boundaries well-defined by existing codebase. |
| Architecture | HIGH | Two clear architecture decisions emerged with strong consensus: project-scoped phase skills + explicit global registration for entry-point skills. Claude Code docs are authoritative. |
| Pitfalls | HIGH | All critical pitfalls are directly observable in the current codebase or well-documented in npm/Claude Code ecosystem. No speculative risks. |

**Overall confidence:** HIGH

### Gaps to Address

- **Skill scope resolution behavior:** The exact runtime behavior when the same skill name exists in `~/.claude/skills/` and `.claude/skills/` needs empirical testing. Research says "higher-priority wins" but edge cases (e.g., skill with references/) need verification.
- **Cross-skill invocation from router:** The mechanism by which the `id3-start` SKILL.md instructs Claude to invoke another skill (e.g., `/id3-identify-entities`) needs testing. Docs say skills compose naturally, but the exact syntax in the SKILL.md body is not fully documented.
- **Plugin system as future path:** STACK.md recommends the full Claude Code plugin system (plugin.json, marketplace) while ARCHITECTURE.md and PITFALLS.md recommend against it for v1. The resolution is clear: start with direct `~/.claude/skills/` registration, migrate to plugin system if/when the skill count grows beyond 3-4 global skills.
- **Windows behavior:** Symlink fallback is opt-in (requires `--no-symlink` flag) rather than auto-detected. This needs fixing but is not blocking for v1 if the primary user base is macOS/Linux.

## Sources

### Primary (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- skill structure, frontmatter, scope resolution, description budget
- [Claude Code Plugins Documentation](https://code.claude.com/docs/en/plugins) -- plugin manifest, distribution, namespacing behavior
- [Claude Code Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) -- npm source distribution, marketplace.json schema
- [npm package.json documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) -- bin field, files field, lifecycle scripts
- [npm Scripts Documentation](https://docs.npmjs.com/cli/v11/using-npm/scripts/) -- postinstall behavior, lifecycle ordering
- [Node.js ESM documentation](https://nodejs.org/api/esm.html) -- import.meta.dirname, import.meta.url
- [Node.js CLI Apps Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices) -- CLI feature checklist

### Secondary (MEDIUM confidence)
- [AI Agent Routing Best Practices](https://www.patronus.ai/ai-agent-development/ai-agent-routing) -- routing patterns, fallback strategies
- [Google Multi-Agent Design Patterns](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/) -- coordinator/dispatcher pattern
- [AWS Routing Dynamic Dispatch Patterns](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/routing-dynamic-dispatch-patterns.html) -- enterprise routing architecture
- [npm postinstall security risks](https://www.nodejs-security.com/blog/npm-ignore-scripts-best-practices-as-security-mitigation-for-malicious-packages) -- security landscape

### Tertiary (LOW confidence)
- None -- all findings are supported by at least two independent sources.

---
*Research completed: 2026-04-06*
*Ready for roadmap: yes*

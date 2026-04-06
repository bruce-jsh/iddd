# Feature Landscape

**Domain:** npm global CLI scaffolding + AI agent smart routing skill for IDDD methodology
**Project:** id3-cli v2 (deployment transition + `/id3-start` smart router)
**Researched:** 2026-04-06

---

## Scope Boundaries

This document covers features for two distinct components shipping in the same milestone:

1. **`/id3-init`** -- CLI scaffolding via `npm i -g id3-cli`, then `/id3-init` as a Claude Code skill
2. **`/id3-start`** -- Smart routing skill that analyzes user intent and dispatches to the correct IDDD phase skill

The existing 6 skills (`id3-identify-entities`, `id3-design-information`, `id3-design-ui`, `id3-spawn-team`, `id3-info-audit`, `id3-preview`) are **out of scope** for changes. This milestone wraps them with a better entry point and a routing layer.

---

## Table Stakes: `/id3-init` (Scaffolding CLI)

Features users expect from a global CLI that sets up project scaffolding. Missing any of these makes the tool feel broken or amateurish.

| # | Feature | Why Expected | Complexity | Notes |
|---|---------|--------------|------------|-------|
| I-1 | `npm i -g id3-cli` installs globally and registers `/id3-init` skill | The entire point of the deployment change. Without this, users have no entry point. | Med | Must register skill in `~/.claude/skills/id3-init/SKILL.md` during postinstall. `bin` field already exists in package.json. |
| I-2 | Backward compatibility with `npx id3-cli` | Existing users must not break. PRD explicitly requires this. | Low | Keep existing `bin/cli.ts` entry point. The global install adds a new code path, not replaces. |
| I-3 | Idempotent execution (safe re-run) | Users will accidentally run `/id3-init` in already-initialized projects. Current code already checks for `CLAUDE.md` and prompts. | Low | Already implemented. Verify it works in the global-install code path too. |
| I-4 | Cross-platform path handling | npm global installs go to different locations on macOS/Linux/Windows. Skill registration paths differ. | Med | Use `path.join` consistently (already done). Test that `~/.claude/skills/` resolution works on all platforms. |
| I-5 | Platform detection (Claude Code, Codex) | Users expect the tool to auto-detect their AI platform and configure accordingly. | Low | Already implemented via `detectPlatforms()`. |
| I-6 | Clear success/failure output | CLI must display what was installed, what was detected, what to do next. | Low | Already implemented via `printSuccess()`. Verify output includes skill registration confirmation. |
| I-7 | `--help` / `--version` flags | Universal CLI expectation. Users will try these first. | Low | `--version` can pull from package.json (already done for banner). `--help` needs explicit handler. |
| I-8 | Non-zero exit codes on failure | Scripts and CI depend on exit codes. 0 = success, non-zero = failure. | Low | Standard Node.js practice. Verify all error paths call `process.exit(1)`. |
| I-9 | Skill file registration in `~/.claude/skills/` | After `npm i -g`, the `/id3-init` skill must be discoverable by Claude Code. This is the entire mechanism that connects CLI install to slash command availability. | High | Core integration point. Must write `SKILL.md` to `~/.claude/skills/id3-init/SKILL.md` (personal scope) during global install. The skill invokes the CLI's `initProject()` under the hood. |

---

## Table Stakes: `/id3-start` (Smart Routing Skill)

Features that a routing/dispatcher skill must have to be useful. Without these, users get confused or routed incorrectly, which is worse than no router at all.

| # | Feature | Why Expected | Complexity | Notes |
|---|---------|--------------|------------|-------|
| R-1 | Natural language intent analysis | User says "I want to build a task manager" or "design the UI for my app" and the router determines the right IDDD phase. LLM-based classification is SOTA for this. | Med | The LLM (Claude itself) IS the classifier. The skill prompt defines the classification taxonomy. No external model needed. |
| R-2 | Correct phase routing based on project state | Route depends on both user intent AND current project state. A user saying "let's start" in an empty project -> Phase 1. Same words in a project with entity-catalog.md -> Phase 3-5. | High | Must read project state: check for `specs/entity-catalog.md`, `specs/data-model.md`, `specs/ui-structure.md` existence and version headers. This is the hardest part. |
| R-3 | Explicit routing announcement | When routing to a phase, tell the user where they're going and why. "I'll route you to Phase 2 (Design Information) because your entity catalog exists but lacks data types." | Low | Pure prompt engineering. Include instruction to always announce the routing decision with rationale. |
| R-4 | Direct-to-UI fast path | PRD requirement: "UI requests that don't need information design should go directly to `id3-design-ui`." If user says "design the login screen" and entity-catalog exists, skip to Phase 2.5. | Med | Special-case routing rule in the classification taxonomy. Must detect UI-specific intent keywords. |
| R-5 | Fallback for ambiguous requests | If intent is unclear, ask for clarification instead of guessing wrong. Misrouting is worse than asking. | Low | Prompt instruction: "If you cannot determine the appropriate phase with confidence, ask the user to clarify their goal." |
| R-6 | Skill invocation (call the target skill) | After classifying intent, the router must actually invoke the target skill (e.g., `/id3-identify-entities`). This is the execution step. | Med | Claude Code allows skills to invoke other skills. The router skill prompt instructs Claude to use the Skill tool to call the appropriate phase skill. |
| R-7 | Phase prerequisite awareness | Router must know that Phase 2 requires Phase 1 output, Phase 2.5 requires Phase 2, Phase 3-5 requires Phase 2. If prerequisites are missing, guide user to the right starting point. | Med | Each target skill already checks its own prerequisites. But the router should pre-check to avoid the jarring experience of routing to Phase 2 only to get "please complete Phase 1 first." |
| R-8 | Support for `$ARGUMENTS` pass-through | `/id3-start design a CRM system` -- the arguments ("design a CRM system") must be passed through to the classification logic. | Low | Claude Code skills natively support `$ARGUMENTS` substitution. Standard frontmatter feature. |

---

## Differentiators

Features that go beyond table stakes and create competitive advantage. These are "nice to have" for v1 but would distinguish IDDD from other methodology toolkits.

| # | Feature | Value Proposition | Complexity | Notes |
|---|---------|-------------------|------------|-------|
| D-1 | Progress dashboard in routing announcement | When `/id3-start` runs, show a visual summary of project progress: "Phase 0/1: done, Phase 2: done, Phase 2.5: not started, Phase 3-5: not started." Users instantly see where they are in IDDD. | Med | Read version headers from spec files. Map to completion status. Display as ASCII table or structured output. |
| D-2 | Suggested next action when no arguments given | `/id3-start` with no arguments analyzes project state and suggests what to do next, not just "what phase are you in?" but "Your entity catalog has 8 entities but no data types. Run Phase 2 to refine them." | Med | Requires reading spec files and assessing completeness heuristics (version headers, entity counts, rule counts). |
| D-3 | `id3-init --dry-run` for previewing changes | Show what files would be created/modified without actually doing it. Builds trust with users who are cautious about project modifications. | Low | Add a dry-run flag that logs actions instead of executing them. |
| D-4 | Update mechanism (`/id3-init --update`) | When id3-cli is updated via npm, re-run init to get new templates/skills without losing customizations (steering files, product.md). | Med | Diff existing vs new templates. Only update skills and hooks, preserve steering/ and specs/ content. |
| D-5 | Contextual help in routing announcements | When routing to a phase, include a one-liner about what that phase produces and how long it typically takes. "Phase 2 refines your entity catalog into a logical model. Typical: 15-30 min conversation." | Low | Static text embedded in the routing prompt. No computation needed. |
| D-6 | Multi-request decomposition | User says "I need entities identified and then the UI designed." Router recognizes this as a multi-phase request and sequences them: "I'll start with Phase 1 (entity identification). After that completes, I'll proceed to Phase 2.5 (UI design)." | High | Complex prompt engineering. Risk of over-engineering. Consider deferring to v2. |

---

## Anti-Features

Features to explicitly NOT build. These are tempting but harmful to the project's goals, simplicity, or maintenance burden.

| # | Anti-Feature | Why Avoid | What to Do Instead |
|---|--------------|-----------|-------------------|
| A-1 | Interactive CLI wizard (inquirer-style prompts) for `/id3-init` | The CLI runs as a Claude Code skill slash command, not a standalone terminal. Interactive prompts (select menus, checkboxes) break the skill execution model where Claude is the user. | Use sensible defaults + flags for customization. Auto-detect platform. Let Claude (the LLM) make decisions based on project context when invoked as a skill. |
| A-2 | Confidence scoring / numerical thresholds for routing | Adding explicit confidence scores and threshold logic adds complexity without benefit. Claude (the LLM) already has implicit confidence -- it either classifies clearly or asks for clarification. Bolt-on scoring is theater. | Use prompt instructions: "If the user's request is ambiguous, ask for clarification. Do not guess." |
| A-3 | Custom routing rules or user-defined phase ordering | IDDD has a fixed methodology flow (0/1 -> 2 -> 2.5 -> 3-5). Letting users customize the order undermines the methodology and creates edge cases. | The methodology defines the order. The router follows it. If users want to skip phases, they invoke specific skills directly. |
| A-4 | Telemetry / usage analytics | npm global CLIs with telemetry face backlash. IDDD is a developer tool -- developers distrust telemetry. Also adds GDPR complexity. | No telemetry. If usage data is needed later, make it opt-in with clear disclosure. |
| A-5 | Auto-update mechanism (self-updating CLI) | Self-updating npm packages are an anti-pattern. They break reproducibility and surprise users. | Users update via `npm update -g id3-cli`. Standard npm workflow. Print a message if a newer version exists (check npm registry), but never auto-update. |
| A-6 | Plugin/extension system for the router | Adding a plugin architecture for custom routing targets adds enormous complexity for near-zero demand at this stage. | The 6 existing skills are the routing targets. If new phases are added to IDDD, update the router skill. The router is a single SKILL.md file -- easy to update. |
| A-7 | Persistent routing history / session memory | Tracking which phases were invoked in previous sessions adds state management complexity. Claude Code sessions are ephemeral by design. | Project state lives in spec files (entity-catalog.md, data-model.md). The router reads these to determine progress. No separate state needed. |
| A-8 | GUI / web dashboard for IDDD progress | A web-based dashboard would be a separate product. IDDD lives inside the coding agent. | The `/id3-preview` skill already provides HTML-based visual output. Progress tracking belongs in the routing announcement (D-1), not a separate app. |

---

## Feature Dependencies

```
I-9 (Skill registration) -> R-* (All routing features depend on skills being discoverable)
I-1 (Global install) -> I-9 (Must install before skills can be registered)
I-2 (Backward compat) must be verified alongside I-1

R-2 (Project state routing) -> R-3 (Announcement depends on knowing the state)
R-2 (Project state routing) -> R-7 (Prerequisite awareness uses same state data)
R-2 (Project state routing) -> R-4 (UI fast path is a special case of state routing)
R-1 (Intent analysis) -> R-6 (Must classify before invoking)
R-5 (Fallback) -> R-1 (Fallback triggers when classification fails)

D-1 (Progress dashboard) -> R-2 (Uses same project state detection)
D-2 (Suggested next action) -> D-1 (Extends dashboard with recommendations)
D-4 (Update mechanism) -> I-1 (Extends the init flow)
```

### Dependency Summary

The critical path is:

1. **I-1 (Global install)** -- the foundation
2. **I-9 (Skill registration)** -- connects CLI to Claude Code
3. **R-2 (Project state routing)** -- the core intelligence of the router
4. **R-1 (Intent analysis) + R-6 (Skill invocation)** -- the routing execution

Everything else builds on top of these four.

---

## MVP Recommendation

### Must Ship (Phase 1 of the milestone)

1. **I-1** Global install mechanism
2. **I-2** Backward compatibility verification
3. **I-5** Platform detection (existing, verify)
4. **I-6** Success output (existing, extend)
5. **I-7** `--help` / `--version` flags
6. **I-8** Exit codes
7. **I-9** Skill file registration in `~/.claude/skills/`

### Must Ship (Phase 2 of the milestone)

8. **R-1** Natural language intent analysis
9. **R-2** Project state-based routing
10. **R-3** Routing announcement with rationale
11. **R-4** Direct-to-UI fast path
12. **R-5** Fallback for ambiguous requests
13. **R-6** Target skill invocation
14. **R-7** Prerequisite awareness
15. **R-8** `$ARGUMENTS` pass-through

### Defer to v2

- **D-1** Progress dashboard (nice UX, not blocking)
- **D-2** Suggested next action (requires completeness heuristics)
- **D-3** `--dry-run` (low effort but low priority)
- **D-4** Update mechanism (important but complex)
- **D-6** Multi-request decomposition (high risk of over-engineering)

### Consider for v1 if time permits

- **D-5** Contextual help in routing (very low effort, good UX polish)

---

## Implementation Notes

### `/id3-init` as a Claude Code Skill

The key architectural insight: `/id3-init` is a **skill that wraps a CLI command**. The SKILL.md file tells Claude to run the globally-installed `id3-cli init` command, which does the actual file copying. This is the same pattern as the bundled `/batch` skill in Claude Code, which orchestrates shell commands.

```
User types: /id3-init
  -> Claude loads SKILL.md from ~/.claude/skills/id3-init/
  -> SKILL.md instructs Claude to run: id3-cli init .
  -> id3-cli copies templates, creates symlinks, registers hooks
  -> Claude reports results to user
```

### `/id3-start` as a Pure-Prompt Skill

The router is purely prompt-driven. No code, no external classifier. Claude IS the classifier. The SKILL.md file contains:

1. The classification taxonomy (6 phases + their triggers)
2. Project state detection instructions (read spec files)
3. Routing decision rules (if state X and intent Y, route to Z)
4. Execution instruction (invoke the target skill)

This is the correct approach because:
- Claude Code skills can invoke other skills natively
- The LLM handles intent classification better than keyword matching
- No runtime dependencies, no external services, no state to manage
- The routing logic updates by editing a single markdown file

### Skill Description Budget

Claude Code allocates 1% of context window (fallback: 8,000 chars) for all skill descriptions. With 8 skills (6 existing + init + start), each gets roughly 1,000 chars for description. Descriptions are capped at 250 chars each. This is plenty for 8 skills.

The router skill description must front-load trigger keywords: "Start IDDD workflow, analyze request, route to phase, smart routing, begin project, what should I do next."

---

## Sources

- [Node.js CLI Apps Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices) -- comprehensive CLI feature checklist (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- official skill file format, frontmatter, invocation control, description budget (HIGH confidence)
- [AI Agent Routing: Tutorial & Best Practices](https://www.patronus.ai/ai-agent-development/ai-agent-routing) -- routing patterns, fallback strategies, anti-patterns (MEDIUM confidence)
- [AI Agent Routing: Intent Classification and Routing Implementation](https://docs.bswen.com/blog/2026-03-06-agent-routing/) -- structured routing, Pydantic models, confidence handling (MEDIUM confidence)
- [Google's Eight Essential Multi-Agent Design Patterns](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/) -- coordinator/dispatcher pattern (MEDIUM confidence)
- [AWS Routing Dynamic Dispatch Patterns](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/routing-dynamic-dispatch-patterns.html) -- enterprise routing architecture (MEDIUM confidence)
- IDDD PRD `prd/IDDD-SKILL-SPEC-v0.3.md` -- project requirements (HIGH confidence)
- Existing codebase `src/init.ts`, `bin/cli.ts` -- current implementation (HIGH confidence)

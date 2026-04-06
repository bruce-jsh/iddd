# Phase 2: Skills & UX - Research

**Researched:** 2026-04-06
**Domain:** Claude Code SKILL.md authoring (smart router + project clear) + ASCII dashboard UX
**Confidence:** HIGH

## Summary

Phase 2 replaces the placeholder SKILL.md files for `/id3-start` and `/id3-clear` (created in Phase 1) with full implementations. The `/id3-start` skill is a prompt-engineered smart router that: (1) auto-detects whether IDDD is installed, (2) runs `npx id3-cli .` if not, (3) renders a progress dashboard by reading specs file YAML headers, (4) analyzes user intent via Claude's native LLM classification, and (5) routes to the appropriate phase skill. The `/id3-clear` skill lists IDDD-generated files, shows a confirmation warning (with special emphasis on user-authored files like `steering/product.md`), and deletes them on confirmation.

The critical architectural insight is that **both skills are pure SKILL.md files -- no TypeScript code is needed**. Claude itself is the classifier, the file reader, and the executor. The SKILL.md provides structured instructions that Claude follows. The existing `ascii.ts` utilities (`banner()`, `box()`) are NOT directly usable from SKILL.md since skills cannot import TypeScript modules; instead, the dashboard ASCII art must be inline instructions for Claude to render. The `initProject()` function IS reusable via `npx id3-cli .` shell invocation.

The project state detection relies on reading YAML frontmatter from `specs/entity-catalog.md` and `specs/data-model.md` (version, phase, entity_count, rule_count fields). Phase completion status maps to: version "0.0" = not started, version "0.1" = Phase 0/1 done, version "1.0" = Phase 2 done, presence of `specs/ui-structure.md` with version = Phase 2.5 done. This is a well-defined, deterministic state model.

**Primary recommendation:** Write two SKILL.md files with supporting reference files. No TypeScript changes needed. The `skills-global/id3-start/SKILL.md` should be ~300 lines with a `references/` directory containing phase-guide.md and dashboard-template.md. The `skills-global/id3-clear/SKILL.md` should be ~150 lines, self-contained.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Routing Rules:**
- Show current project state (specs file existence, YAML headers) to user and let user choose which Phase to proceed to
- For ambiguous requests ("add filter to list", etc.), ask user "UI-only change or new data needed?"
- For prerequisite failures during routing, rely on existing skill built-in prerequisite checks (no separate implementation needed)
- Phase system: 0/1(Entities) -> 2(Info Model) -> 2.5(UI Design) -> 3-5(Build), Audit, Preview

**Auto-Setup UX:**
- When `/id3-start` runs on non-IDDD project:
  1. ASCII Art welcome message
  2. Auto-run `npx id3-cli .` (no user confirmation)
  3. Continue to dashboard + routing

**Dashboard Format:**
- Box-style Phase pipeline + progress bar + guidance message combination (exact mockup in CONTEXT.md)
- Guidance messages in user's language (Korean for Korean users, English for English users)
- Extract metadata from specs file YAML headers (version, entity_count, rule_count) and display in each Phase box

**Clear Behavior:**
- Delete all IDDD-generated files/folders: specs/, docs/, steering/, hooks/, skills/, .claude/skills/, .codex/skills/, .claude/hooks/, CLAUDE.md, AGENTS.md, .iddd/
- Pre-deletion warning must include:
  - Full list of deletion targets
  - Separate warning for user-authored files (steering/product.md, steering/data-conventions.md)
  - "This action cannot be undone" notice
  - y/N confirmation

### Claude's Discretion
- Specific ASCII Art welcome message design
- Routing guidance message tone
- Progress bar calculation logic (per-Phase weighting)
- Clear completion message format

### Deferred Ideas (OUT OF SCOPE)
None - discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ROUT-01 | Auto-setup on non-IDDD project | SKILL.md checks for CLAUDE.md/specs/ existence, then runs `npx id3-cli .` via Bash tool |
| ROUT-02 | Natural language analysis routes to correct Phase | Claude's own LLM classification with routing taxonomy in SKILL.md prompt |
| ROUT-03 | Project state (specs files, YAML headers) informs routing | Read specs/entity-catalog.md and specs/data-model.md frontmatter for version/phase fields |
| ROUT-04 | Routing announcement message | Prompt instruction: "Announce: routing to [skill] because [reason]" |
| ROUT-05 | UI-only requests fast-path to id3-design-ui | Special routing rule: explicit UI keywords skip entity identification |
| ROUT-06 | Ambiguous requests trigger clarification question | Prompt instruction: "If unclear whether UI-only or new data needed, ask the user" |
| ROUT-07 | Actually invoke the target skill after routing decision | Claude invokes via Skill tool -- instruct "use /id3-[skill-name] to proceed" |
| ROUT-08 | Missing prerequisites -> guide to correct starting point | Each target skill has built-in prereq checks; router pre-checks specs files to suggest correct entry |
| ROUT-09 | Pass $ARGUMENTS to target skill | $ARGUMENTS variable substitution is native SKILL.md feature; pass via Skill invocation |
| ROUT-10 | Idempotent -- no duplicate auto-setup | Check CLAUDE.md existence before running npx; if exists, skip setup |
| CLR-01 | Delete all IDDD-generated files/folders | SKILL.md instructs Claude to use Bash(rm -rf) and Edit/Write tools on known file list |
| CLR-02 | Confirmation message before deletion | SKILL.md instructs Claude to list targets, warn about user files, require y/N |
| CLR-03 | Completion summary after clear | SKILL.md instructs Claude to summarize what was deleted |
| UX-01 | Progress dashboard on /id3-start | SKILL.md contains dashboard template; Claude reads specs YAML headers and fills in status |
| UX-02 | No-args /id3-start shows status + suggested next action | SKILL.md branch: if $ARGUMENTS is empty, show dashboard and suggest next phase |
| UX-03 | Routing announcement includes Phase description and artifacts | Routing rules include per-phase one-liner and output list |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| SKILL.md (Claude Code) | current | Prompt-based skill definition | Both skills are pure SKILL.md files -- the standard mechanism for Claude Code skill authoring |
| $ARGUMENTS | built-in | User input variable substitution | Native SKILL.md feature for passing user input |
| ${CLAUDE_SKILL_DIR} | built-in | Reference supporting files | Native SKILL.md feature for referencing files in skill directory |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `npx id3-cli` | 0.9.3+ | Auto-setup invocation | Called from id3-start SKILL.md via Bash tool when IDDD not detected |
| YAML frontmatter | N/A | Project state detection | Read version/phase/entity_count from specs files |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure SKILL.md routing | TypeScript router in src/ | Over-engineering; Claude's LLM classification is superior to keyword matching; no runtime code needed |
| Inline dashboard template | External HTML generation | SKILL.md renders ASCII art directly in terminal -- no preview server needed for the dashboard |
| Manual file deletion list | Dynamic glob scanning | Known file list is deterministic and safer; glob risks deleting non-IDDD files |

## Architecture Patterns

### Recommended Skill Structure

```
skills-global/
  id3-start/
    SKILL.md                          # Router logic (~300 lines)
    references/
      phase-guide.md                  # Detailed phase descriptions, trigger keywords, artifacts
      dashboard-template.md           # Dashboard ASCII art template + rendering instructions
  id3-clear/
    SKILL.md                          # Clear logic (~150 lines, self-contained)
```

### Pattern 1: LLM-Native Intent Classification
**What:** The SKILL.md prompt contains a routing taxonomy with signal keywords and conditions per phase. Claude evaluates the user's natural language against this taxonomy using its own understanding -- no external classifier.
**When to use:** Any skill that needs to dispatch based on user intent.
**Why:** Claude's semantic understanding handles paraphrases, context, and ambiguity better than keyword matching. Zero training data needed. Updates by editing a markdown file.
**Example:**
```markdown
# Source: Claude Code Skills docs + existing project ARCHITECTURE.md research
## Route: id3-identify-entities (Phase 0/1)
**Signals:** new project, domain analysis, entity identification, information analysis
**Condition:** No entity catalog exists, OR user explicitly requests entity work
**Action:** Invoke /id3-identify-entities with user's request
```

### Pattern 2: Context-Gated Routing (Project State Detection)
**What:** Read specs file YAML frontmatter before routing to determine where the user is in the IDDD workflow. Present the state to the user and let them choose.
**When to use:** When routing decisions depend on project state, not just intent.
**Example:**
```markdown
# Source: Existing specs file structure (templates/specs/entity-catalog.md)
## Step 1: Detect Project State

Read these files and extract YAML frontmatter:
1. `specs/entity-catalog.md` -> version, entity_count, phase
2. `specs/data-model.md` -> version, rule_count, phase
3. `specs/ui-structure.md` -> version, screen_count (if exists)

Map to completion:
- version "0.0" or file missing = Phase not started
- entity-catalog version "0.1" = Phase 0/1 complete
- entity-catalog version "1.0"+ = Phase 2 complete
- ui-structure exists with version = Phase 2.5 complete
```

### Pattern 3: Skill Composition via Skill Tool
**What:** The router skill instructs Claude to invoke another skill by name. Claude's built-in Skill tool loads and executes the target skill. No programmatic dispatch needed.
**When to use:** Any skill that needs to delegate to another skill.
**Source:** [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- "Claude can use multiple Skills together automatically. This composability is one of the most powerful parts of the Skills feature."
**Example:**
```markdown
## Step 4: Execute Route

After the user confirms, invoke the target skill:
- Entity work: use /id3-identify-entities
- Information design: use /id3-design-information  
- UI design: use /id3-design-ui
- Build: use /id3-spawn-team
- Audit: use /id3-info-audit
- Preview: use /id3-preview

Pass the user's original request as context when invoking.
```

### Pattern 4: Dynamic Context Injection for Dashboard
**What:** Use the `` !`command` `` syntax in SKILL.md to run shell commands before the skill content reaches Claude. This pre-populates project state data.
**When to use:** When the skill needs live project data at invocation time.
**Caveat:** This runs shell commands at skill load time, NOT at Claude's discretion. It is preprocessing. However, for the dashboard use case, reading YAML headers at Claude's instruction (via Read tool) is more appropriate since it allows conditional logic (check if files exist first).
**Recommendation:** Do NOT use `` !`command` `` for state detection. Instead, instruct Claude to use the Read tool to check file existence and parse frontmatter. This allows graceful handling of missing files.

### Anti-Patterns to Avoid
- **TypeScript router module:** Do not create `src/router.ts`. The routing is done by Claude interpreting the SKILL.md prompt. Adding TypeScript adds complexity with no benefit.
- **Hardcoded keyword matching:** Do not use if/else keyword matching for routing. Claude's semantic understanding handles this natively.
- **Global scope for phase skills:** Do not put id3-identify-entities, id3-design-information, etc. in global scope. They remain project-scoped. Only id3-start and id3-clear are global.
- **Importing ascii.ts from SKILL.md:** SKILL.md cannot import TypeScript modules. The dashboard ASCII art must be defined as inline instructions/templates within the skill content.
- **Dynamic glob for clear targets:** Do not dynamically scan for IDDD files. Use a known, hardcoded list of directories/files that IDDD generates. This is safer and deterministic.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Intent classification | Keyword-matching router | Claude's native LLM classification via SKILL.md prompt | Claude handles paraphrases, context, ambiguity natively |
| Project initialization | Duplicate init logic in SKILL.md | `npx id3-cli .` shell command | Reuses existing tested initProject() function |
| Skill invocation | Custom skill-calling mechanism | Claude's built-in Skill tool | Native composability -- skills invoke skills automatically |
| YAML frontmatter parsing | Custom YAML parser | Claude reads file via Read tool and extracts frontmatter | Claude understands YAML natively |
| User language detection | Language detection library | Claude naturally responds in user's language | Claude auto-detects language from conversation context |

**Key insight:** Phase 2 is almost entirely prompt engineering. Both skills are SKILL.md files with no new TypeScript code. The "implementation" is writing well-structured prompts with clear routing rules, state detection logic, and UX templates.

## Common Pitfalls

### Pitfall 1: SKILL.md Too Long (Over 500 Lines)
**What goes wrong:** Claude Code recommends keeping SKILL.md under 500 lines. Overlong skills degrade Claude's ability to follow instructions consistently.
**Why it happens:** Temptation to put all routing rules, dashboard templates, and phase descriptions in one file.
**How to avoid:** Use supporting reference files. Keep SKILL.md as the orchestration layer (~300 lines for id3-start). Move detailed phase descriptions and dashboard template to `references/phase-guide.md` and `references/dashboard-template.md`. Reference them from SKILL.md: "For phase details, see [references/phase-guide.md](references/phase-guide.md)."
**Warning signs:** SKILL.md exceeding 400 lines.

### Pitfall 2: Skill Scope Shadowing
**What goes wrong:** id3-start and id3-clear exist globally in `~/.claude/skills/`. If a project also has skills with the same name in `.claude/skills/`, the personal (global) scope wins and project-scope versions are ignored.
**Why it happens:** Claude Code skill resolution priority: enterprise > personal > project.
**How to avoid:** This is actually the desired behavior. The global id3-start/id3-clear are the canonical versions. No project-scope versions should exist for these two skills. The 6 phase skills (id3-identify-entities, etc.) remain project-scope only -- no naming collision.
**Warning signs:** Not a problem for this phase since the names are distinct.

### Pitfall 3: Auto-Setup Running in Non-Project Directory
**What goes wrong:** User runs `/id3-start` in a directory that should NOT have IDDD initialized (e.g., home directory, system directory). Auto-setup runs `npx id3-cli .` and creates specs/, docs/, etc. in an unexpected location.
**How to avoid:** Before auto-setup, check for indicators that the directory is a project root: presence of `package.json`, `.git/`, `Cargo.toml`, `go.mod`, or similar project markers. If none found, ask the user to confirm before proceeding.
**Warning signs:** IDDD files appearing in unexpected directories.

### Pitfall 4: Dashboard Rendering Inconsistency
**What goes wrong:** The ASCII art dashboard renders differently depending on terminal width, Claude's interpretation, or the model's tendency to "improve" the layout.
**Why it happens:** Claude may paraphrase or reformat ASCII art instead of reproducing it exactly.
**How to avoid:** Provide the exact ASCII template in the reference file with clear instructions: "Reproduce this template EXACTLY, only replacing the placeholder values." Use fenced code blocks to prevent interpretation. Include a concrete example with filled-in values.
**Warning signs:** Dashboard looking different across invocations.

### Pitfall 5: Clear Deleting Non-IDDD Files
**What goes wrong:** The clear skill deletes files that the user created independently in directories that overlap with IDDD's output (e.g., user has their own `docs/` directory unrelated to IDDD).
**Why it happens:** IDDD creates `docs/` at the project root, which is a common directory name.
**How to avoid:** The clear skill should ONLY delete files/directories that IDDD explicitly creates. For `docs/`, only delete IDDD-specific files within it (business-rules.md, domain-glossary.md, info-debt.md, model-changelog.md) rather than the entire directory. Check for IDDD markers (e.g., the presence of `specs/entity-catalog.md` with IDDD YAML frontmatter) before proceeding.
**Warning signs:** Users losing non-IDDD files after running `/id3-clear`.

### Pitfall 6: $ARGUMENTS Empty vs Missing
**What goes wrong:** When user types `/id3-start` with no arguments, `$ARGUMENTS` is empty but still present. The skill must distinguish between "no arguments" (show dashboard + suggest) and "has arguments" (analyze and route).
**Why it happens:** $ARGUMENTS substitution replaces the placeholder with an empty string, not a distinguishing marker.
**How to avoid:** Check for empty arguments explicitly in the prompt: "If $ARGUMENTS is empty or contains only whitespace, proceed to the status dashboard flow. Otherwise, proceed to the routing flow."
**Warning signs:** Dashboard appearing when user provided arguments, or routing attempting on empty input.

## Code Examples

### id3-start SKILL.md Structure
```yaml
# Source: Claude Code Skills Documentation + project conventions
---
name: id3-start
description: >
  IDDD smart entry point. Analyzes your request and routes to the right
  IDDD phase. Auto-sets up IDDD if not initialized. Shows progress dashboard.
  Trigger: start IDDD, begin project, what should I do next, identify entities,
  design information, design ui, build, audit, preview
user-invocable: true
allowed-tools: Read Glob Grep Bash Write Edit
---

# IDDD Smart Router

You are the IDDD workflow entry point. Your job is to:
1. Ensure IDDD is set up in this project
2. Show the project progress dashboard
3. Analyze the user's request and route to the correct skill

User request: $ARGUMENTS

## Step 1: Check IDDD Installation
[instructions to check for CLAUDE.md and specs/ existence]
[if missing: show welcome message, run npx id3-cli ., continue]
[if present: skip to Step 2]

## Step 2: Read Project State
[instructions to read YAML frontmatter from specs files]

## Step 3: Show Dashboard
[reference to dashboard-template.md]

## Step 4: Route or Suggest
[if $ARGUMENTS empty: suggest next action based on state]
[if $ARGUMENTS present: classify and route]

## Routing Rules
[reference to phase-guide.md for detailed rules]
```

### Dashboard Template (references/dashboard-template.md)
```markdown
# Source: CONTEXT.md user decision
## Dashboard Template

Reproduce this template EXACTLY, replacing only the placeholder values
with actual data from the project state:

[Template with Phase boxes, progress bar, status message as defined in CONTEXT.md]

### Phase Status Symbols
- completed checkmark with count/version
- in-progress diamond
- not-started circle

### Progress Calculation
Weight each phase: Entities=25%, Info Model=25%, UI Design=25%, Build=25%
Fill the progress bar proportionally.
```

### id3-clear SKILL.md Structure
```yaml
# Source: CONTEXT.md user decision
---
name: id3-clear
description: >
  Reset IDDD project. Removes all IDDD-generated files and folders,
  restoring the project to pre-IDDD state. Shows confirmation before deletion.
  Trigger: clear iddd, reset iddd, remove iddd, clean project
user-invocable: true
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash Write Edit
---

# IDDD Project Clear

Remove all IDDD-generated files from this project.

## Step 1: Verify IDDD Installation
Check if this project has IDDD installed (CLAUDE.md or specs/ exist).
If not, inform the user and exit.

## Step 2: Scan Deletion Targets
[known file/directory list]

## Step 3: Show Warning
[format: list all targets, highlight user-authored files, y/N confirmation]

## Step 4: Execute Deletion
[delete confirmed targets]

## Step 5: Show Summary
[format: what was deleted, what remains]
```

### YAML Frontmatter State Detection Pattern
```markdown
# Source: templates/specs/entity-catalog.md default structure
## How to Read Project State

Read `specs/entity-catalog.md` and look for YAML frontmatter between --- markers:

---
version: "0.0"        # "0.0"=not started, "0.1"=Phase 0/1 done, "1.0"+=Phase 2 done
last_verified: ""     # Date of last audit
phase: "Initialized"  # Human-readable phase status
entity_count: 0       # Number of identified entities
rule_count: 0         # Number of business rules
audit_status: "unverified"
---

Similarly read `specs/data-model.md` and `specs/ui-structure.md` (if they exist).
```

### Known IDDD File List for Clear
```markdown
# Source: templates/ directory structure + init.ts createSkillSymlinks()
## IDDD-Generated Files and Directories

Always delete (if they exist):
- specs/                      # All spec files
- docs/                       # All docs files  
- steering/                   # Steering files (WARNING: contains user content)
- hooks/                      # Hook scripts
- skills/                     # Project-local skill source files
- .claude/skills/             # Claude Code skill symlinks
- .claude/hooks/              # Claude hooks config
- .codex/skills/              # Codex skill symlinks
- .agents/skills/             # Agents skill directory
- .iddd/                      # IDDD working directory
- CLAUDE.md                   # Claude Code agent instructions
- AGENTS.md                   # Codex/Agents instructions

User-authored files requiring special warning:
- steering/product.md         # User fills in product vision
- steering/data-conventions.md # User customizes conventions
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| External intent classifier (NLP) | LLM-native classification via prompt | 2024-2025 | No training data needed; better semantic understanding |
| Programmatic skill dispatch | Skill tool composability | Claude Code skills GA | Skills invoke skills natively |
| Interactive CLI wizards | SKILL.md with Claude as the interactive agent | Claude Code skills | No inquirer/prompts -- Claude handles conversation |
| Static progress tracking | YAML frontmatter in specs files | IDDD v0.9+ | State is in the artifact files themselves, no separate DB |

**Deprecated/outdated:**
- `disable-model-invocation: true` is NOT needed for id3-start (we want Claude to suggest it). It IS needed for id3-clear (destructive action).
- Custom `src/router.ts` is unnecessary -- pure SKILL.md approach is standard for Claude Code.

## Open Questions

1. **Cross-skill argument passing mechanics**
   - What we know: When the router invokes `/id3-identify-entities`, it needs to pass the user's original request. Claude Code supports $ARGUMENTS natively for direct invocation. When Claude uses the Skill tool programmatically, it can include the arguments in the invocation context.
   - What's unclear: The exact mechanics of how Claude passes arguments when invoking a skill mid-conversation (via Skill tool, not user slash command). In practice, Claude can simply include the user's request as conversational context when delegating to the next skill.
   - Recommendation: Instruct the router to include the user's original request in its delegation message. Claude will carry it as conversational context to the target skill.

2. **Dashboard rendering fidelity**
   - What we know: Claude can reproduce ASCII art from templates, but may occasionally reformat.
   - What's unclear: How reliably Claude reproduces the exact box-drawing characters across different models/contexts.
   - Recommendation: Use a fenced code block template with explicit "reproduce exactly" instructions. Test across a few invocations during verification.

3. **Skill scope priority: global id3-start vs hypothetical project override**
   - What we know: Personal (global) scope wins over project scope for same-named skills.
   - What's unclear: Whether users might want project-specific id3-start behavior.
   - Recommendation: Accept global-wins behavior for now. If project customization is needed later, users can create a project-scoped skill with a different name.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^3.1.x |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ROUT-01 | Auto-setup detection logic | manual | Invoke `/id3-start` in fresh project, verify npx runs | N/A (SKILL.md content -- no unit test) |
| ROUT-02 | Intent routing correctness | manual | Invoke `/id3-start design a CRM` and verify Phase 0/1 route | N/A (SKILL.md content) |
| ROUT-03 | Project state reading | manual | Verify dashboard shows correct Phase status from YAML | N/A (SKILL.md content) |
| ROUT-04 | Routing announcement | manual | Verify message format after routing decision | N/A (SKILL.md content) |
| ROUT-05 | UI fast-path | manual | `/id3-start design login screen` routes to design-ui | N/A (SKILL.md content) |
| ROUT-06 | Ambiguous request clarification | manual | `/id3-start add filter` triggers question | N/A (SKILL.md content) |
| ROUT-07 | Target skill invocation | manual | Verify router actually invokes target skill | N/A (SKILL.md content) |
| ROUT-08 | Prerequisite guidance | manual | Try routing to Phase 2 without Phase 1 done | N/A (SKILL.md content) |
| ROUT-09 | $ARGUMENTS pass-through | manual | Verify user request reaches target skill | N/A (SKILL.md content) |
| ROUT-10 | Idempotent auto-setup | manual | Run `/id3-start` twice, verify no double-init | N/A (SKILL.md content) |
| CLR-01 | File deletion completeness | manual | Run `/id3-clear`, verify all IDDD files removed | N/A (SKILL.md content) |
| CLR-02 | Confirmation warning | manual | Verify warning shows before deletion | N/A (SKILL.md content) |
| CLR-03 | Completion summary | manual | Verify summary after clear | N/A (SKILL.md content) |
| UX-01 | Progress dashboard display | manual | Run `/id3-start`, verify dashboard renders | N/A (SKILL.md content) |
| UX-02 | No-args status + suggestion | manual | Run `/id3-start` with no args, verify suggestion | N/A (SKILL.md content) |
| UX-03 | Phase description in routing | manual | Verify routing announcement includes phase info | N/A (SKILL.md content) |

### Sampling Rate
- **Per task commit:** Visual inspection of SKILL.md content for completeness and correctness
- **Per wave merge:** Manual invocation test of `/id3-start` and `/id3-clear` in a test project
- **Phase gate:** Full manual test of all 5 success criteria from ROADMAP.md

### Wave 0 Gaps
None -- this phase produces SKILL.md files (prompt content), not TypeScript code. Validation is manual invocation testing, not automated unit tests. The existing test infrastructure (Vitest) is not applicable to SKILL.md content verification.

**Note on testability:** SKILL.md files are prompt engineering artifacts. Their correctness is validated by invoking them in Claude Code and observing behavior. There is no meaningful way to unit-test a SKILL.md file -- the "test" is running the skill and checking Claude's behavior matches requirements. The verification step for this phase should be a structured manual test plan covering all 16 requirements.

## Sources

### Primary (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- SKILL.md format, frontmatter fields, $ARGUMENTS, skill composability, scope resolution, supporting files, disable-model-invocation, allowed-tools, context injection
- Existing codebase `skills-global/id3-start/SKILL.md` and `skills-global/id3-clear/SKILL.md` -- current placeholder files to replace
- Existing codebase `templates/skills/id3-*/SKILL.md` -- routing targets, prerequisite check patterns, YAML frontmatter conventions
- Existing codebase `templates/specs/entity-catalog.md` and `templates/specs/data-model.md` -- YAML frontmatter schema for state detection
- Existing codebase `src/init.ts` -- initProject() function for auto-setup invocation
- `.planning/phases/02-skills-ux/02-CONTEXT.md` -- user decisions on routing, dashboard, clear behavior
- `.planning/research/ARCHITECTURE.md` -- prior research on routing patterns and skill composition

### Secondary (MEDIUM confidence)
- `.planning/research/FEATURES.md` -- feature landscape and dependency analysis
- `.planning/research/STACK.md` -- stack research (plugin vs global skills decision -- global skills was chosen per Phase 1 implementation)

### Tertiary (LOW confidence)
- None -- all findings supported by official docs or existing codebase analysis.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries; pure SKILL.md authoring with existing Claude Code features
- Architecture: HIGH -- patterns directly verified from Claude Code official docs and existing codebase
- Pitfalls: HIGH -- identified from prior project research, official docs, and codebase analysis
- Validation: MEDIUM -- manual testing only (inherent limitation of SKILL.md-based deliverables)

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable -- Claude Code skills API is mature, IDDD file structure is fixed)

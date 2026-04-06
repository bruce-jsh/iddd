# Architecture Patterns

**Domain:** npm global CLI + Claude Code skill registration + smart routing
**Researched:** 2026-04-06

## Executive Summary

id3-cli needs to evolve from a `npx`-based template copier into a **Claude Code plugin** that registers IDDD skills globally. The architecture has three new components: (1) a postinstall registration mechanism that copies skills to `~/.claude/skills/`, (2) an `/id3-init` skill that replaces the current CLI entry point for project setup inside Claude Code, and (3) an `/id3-start` smart router skill that uses LLM-native intent analysis to dispatch users to the correct IDDD phase. The existing 6 skills and template structure remain unchanged.

**Overall confidence:** HIGH -- Claude Code's skill and plugin systems are well-documented, and the integration path is straightforward.

---

## Recommended Architecture

### System Overview

```
npm i -g id3-cli
       |
       v
postinstall script
       |
       +-- copies skills/ to ~/.claude/skills/
       |     id3-init/SKILL.md          (project setup)
       |     id3-start/SKILL.md         (smart router)
       |
       +-- existing bin/cli.ts stays    (npx backward compat)

User in Claude Code session:
  /id3-init           --> scaffolds IDDD into current project
  /id3-start [request] --> analyzes intent, routes to phase skill

User via npx (backward compat):
  npx id3-cli@latest . --> same as before
```

### Component Boundaries

| Component | Responsibility | Location | Communicates With |
|-----------|---------------|----------|-------------------|
| **bin/cli.ts** | CLI entry point for `npx id3-cli` backward compat | `bin/cli.ts` | `src/init.ts` |
| **src/init.ts** | Core init logic: template copy, symlink, hook injection | `src/init.ts` | filesystem, `src/utils/` |
| **postinstall script** | On `npm i -g`, copies skill files to `~/.claude/skills/` | `scripts/postinstall.ts` | filesystem, `~/.claude/skills/` |
| **id3-init skill** | Claude Code slash command for project setup | `skills-global/id3-init/SKILL.md` | Invokes shell: `npx id3-cli .` |
| **id3-start skill** | Smart router: analyzes user request, dispatches to phase skill | `skills-global/id3-start/SKILL.md` + `skills-global/id3-start/references/routing-guide.md` | Other id3-* skills (via Claude's Skill tool) |
| **Existing 6 skills** | Phase-specific IDDD skills (unchanged) | `templates/skills/id3-*/SKILL.md` | specs/, docs/, steering/ |

---

## Architecture Decision: Plugin vs Global Skills

### Decision: Use global skills (`~/.claude/skills/`), not a Claude Code plugin

**Rationale:**

1. **Plugin namespacing breaks UX.** Plugins force namespaced commands like `/id3-cli:id3-init`. id3-cli wants clean `/id3-init` and `/id3-start` names. Global skills at `~/.claude/skills/` produce `/id3-init` directly.

2. **Existing project skills are already standalone.** The 6 phase skills are copied into the project's `.claude/skills/` by `initProject()`. These are project-scoped. Only `id3-init` and `id3-start` need global scope.

3. **Simpler distribution.** An npm postinstall that copies 2 skill directories to `~/.claude/skills/` is simpler than requiring users to run `/plugin install` after `npm i -g`.

4. **Plugin system is still maturing.** The plugin marketplace system works but adds complexity (marketplace.json, plugin.json, reload-plugins). For 2 global skills, direct file placement is appropriate.

**Tradeoff:** No automatic updates via plugin marketplace. Users run `npm update -g id3-cli` which re-runs postinstall. This is acceptable because updates are infrequent and the npm workflow is already established.

**Confidence:** HIGH -- based on official Claude Code docs confirming `~/.claude/skills/` is the personal skills location and produces un-namespaced slash commands.

---

## Component Design

### 1. Postinstall Script (`scripts/postinstall.ts`)

**Purpose:** After `npm i -g id3-cli`, copy `id3-init` and `id3-start` skill directories to `~/.claude/skills/`.

**Design:**

```typescript
// scripts/postinstall.ts
import { homedir } from 'node:os';
import { join } from 'node:path';
import { copyDir } from '../src/utils/fs.js';

const GLOBAL_SKILLS = ['id3-init', 'id3-start'];
const target = join(homedir(), '.claude', 'skills');
const source = join(import.meta.dirname, '..', 'skills-global');

for (const skill of GLOBAL_SKILLS) {
  await copyDir(join(source, skill), join(target, skill), { overwrite: true });
}
```

**Key decisions:**

- **Overwrite on install/update.** Always overwrite so `npm update -g id3-cli` refreshes skill content. Skills are authored templates, not user-editable config.
- **No postinstall for local `npx`.** The postinstall only runs on `npm install`. `npx` runs the CLI directly without triggering lifecycle scripts, so backward compat is inherently preserved.
- **Source from `skills-global/` directory.** Separate from `templates/skills/` to clearly distinguish global-scope skills (id3-init, id3-start) from project-scope skills (the existing 6).

**package.json changes:**

```json
{
  "scripts": {
    "postinstall": "node dist/scripts/postinstall.js"
  },
  "files": [
    "dist/",
    "templates/",
    "skills-global/",
    "assets/"
  ]
}
```

**Pitfall:** postinstall runs in the npm package's installed directory, not the user's project. `import.meta.dirname` resolves correctly from `dist/scripts/postinstall.js`. Verify with `npm pack && npm i -g ./id3-cli-*.tgz` during development.

### 2. id3-init Skill (`skills-global/id3-init/SKILL.md`)

**Purpose:** Replace the need to run `npx id3-cli .` manually. Users type `/id3-init` in Claude Code.

**Design approach:** The skill is a thin wrapper that invokes the existing CLI.

```yaml
---
name: id3-init
description: >
  Initialize IDDD (Information Design-Driven Development) in the current project.
  Sets up entity catalog, data model specs, steering files, hooks, and 6 IDDD skills.
  Trigger: start iddd, initialize iddd, setup information design, new iddd project
allowed-tools: Bash Read Write Edit Glob
disable-model-invocation: true
user-invocable: true
---

# IDDD Project Initialization

Run the id3-cli installer to scaffold IDDD into the current project directory.

## Steps

1. Execute: `npx id3-cli@latest .`
2. Verify the output shows successful installation
3. Read `steering/product.md` and prompt user to fill it in
4. Summarize installed skills and next steps
```

**Why `disable-model-invocation: true`:** Initialization has side effects (creates files, modifies git hooks). The user should explicitly trigger this.

**Why invoke via `npx`:** Reuses the existing, tested `initProject()` logic. No need to duplicate template-copy logic in a skill. The globally installed `id3-cli` binary would also work, but `npx id3-cli@latest` ensures the latest version.

**Alternative considered:** Having the skill call the global binary directly (`id3-cli .`). This is slightly faster than npx but ties to the installed version. Either works; `npx` is safer for freshness.

### 3. id3-start Smart Router Skill (`skills-global/id3-start/SKILL.md`)

**Purpose:** Analyze user's natural language request and route to the appropriate IDDD phase skill.

**Design approach:** LLM-native routing. The skill prompt contains a routing decision tree that Claude evaluates against the user's input. No external classifier needed -- Claude itself is the intent classifier.

```yaml
---
name: id3-start
description: >
  Smart entry point for IDDD workflow. Analyzes your request and routes to
  the right IDDD phase. Use when starting work, unsure which phase to use,
  or want guided IDDD workflow.
  Trigger: start project, begin development, what should I do next, 
  help me build, design my app, create a feature
allowed-tools: Read Glob Grep Bash Write Edit
user-invocable: true
---
```

**Routing logic (in SKILL.md body):**

```markdown
# IDDD Smart Router

You are the IDDD workflow entry point. Analyze the user's request
and route to the correct IDDD phase.

## Step 1: Gather Context

Before routing, quickly assess:
1. Does `specs/entity-catalog.md` exist? (IDDD already initialized?)
2. If yes, read it to understand current project state.
3. If no, suggest `/id3-init` first.

## Step 2: Classify Intent

Analyze $ARGUMENTS against these categories:

### Route: id3-identify-entities (Phase 0/1)
**Signals:** new project, analyze domain, what entities exist, 
reverse-engineer existing code, identify information, domain analysis
**Condition:** No entity catalog, OR user explicitly asks for entity work

### Route: id3-design-information (Phase 2)
**Signals:** design data model, define relationships, create ERD,
data structure, schema design, information architecture
**Condition:** Entity catalog exists but no data-model.md

### Route: id3-design-ui (Phase 2.5)
**Signals:** design screens, UI layout, user interface, mockup,
wireframe, page design, dashboard, create form
**Condition:** Direct UI request regardless of phase state.
NOTE: UI-only requests skip directly here, no entity work needed.

### Route: id3-spawn-team (Phase 3-5)
**Signals:** implement, build, code, develop, create API, 
start coding, spawn agents
**Condition:** Data model exists (Phase 2 complete)

### Route: id3-info-audit
**Signals:** audit, check consistency, verify model, drift check,
review information model
**Condition:** Any time user asks for verification

### Route: id3-preview
**Signals:** preview, visualize, show ERD, view model, dashboard
**Condition:** Any time user asks for visual output

## Step 3: Execute Route

1. Announce: "Routing to [skill name] - [reason]"
2. Explain what this phase does (1-2 sentences)
3. Invoke the target skill via `/id3-[skill-name]`

## Step 4: Ambiguous Requests

If the request doesn't clearly map to a single phase:
1. Present top 2-3 candidates with rationale
2. Ask user to confirm
3. Route after confirmation
```

**Key design decisions:**

- **No ML classifier.** Claude's own language understanding handles intent classification. The routing rules are embedded in the prompt as a decision tree. This is the "LLM-based routing" pattern -- zero training data needed, works out of the box.

- **Context-aware routing.** The skill reads `specs/entity-catalog.md` and `specs/data-model.md` to understand project state before routing. This prevents sending users to Phase 2 when Phase 1 isn't done.

- **UI fast-path.** Per the project requirements, UI-only requests bypass entity identification and route directly to `id3-design-ui`. This is encoded as a routing rule exception.

- **Skill invocation via Claude's Skill tool.** When the router decides to invoke `id3-identify-entities`, Claude uses its built-in Skill tool to load and execute that skill. Skills compose naturally in Claude Code -- the router skill invokes target skills by referencing them. No programmatic dispatch needed.

### 4. Supporting Reference File

For the router to stay lean (under 500 lines), move the detailed phase descriptions to a reference file:

```
skills-global/
  id3-start/
    SKILL.md                          # Router logic (~200 lines)
    references/
      phase-guide.md                  # Detailed phase descriptions (~300 lines)
```

The `SKILL.md` references it: "For detailed phase descriptions, see [references/phase-guide.md](references/phase-guide.md)."

---

## Data Flow

### Flow 1: Global Install + Skill Registration

```
User runs: npm i -g id3-cli
  |
  v
npm lifecycle: postinstall
  |
  v
scripts/postinstall.ts executes
  |
  +-- mkdir -p ~/.claude/skills/id3-init/
  +-- copy skills-global/id3-init/SKILL.md -> ~/.claude/skills/id3-init/SKILL.md
  |
  +-- mkdir -p ~/.claude/skills/id3-start/
  +-- copy skills-global/id3-start/ -> ~/.claude/skills/id3-start/
  |       (SKILL.md + references/)
  v
Done. /id3-init and /id3-start now available in all Claude Code sessions.
```

### Flow 2: /id3-init Project Setup

```
User in Claude Code: /id3-init
  |
  v
Claude loads ~/.claude/skills/id3-init/SKILL.md
  |
  v
Skill instructs: run `npx id3-cli@latest .`
  |
  v
bin/cli.ts -> initProject()
  |
  +-- copies templates/ to project root
  +-- creates symlinks: skills/ -> .claude/skills/ and .agents/skills/
  +-- injects hooks into .claude/settings.local.json
  +-- installs git hooks
  v
Project now has:
  .claude/skills/id3-identify-entities/SKILL.md  (project-scope)
  .claude/skills/id3-design-information/SKILL.md
  .claude/skills/id3-design-ui/SKILL.md
  .claude/skills/id3-spawn-team/SKILL.md
  .claude/skills/id3-info-audit/SKILL.md
  .claude/skills/id3-preview/SKILL.md
  specs/, docs/, steering/, hooks/
```

### Flow 3: /id3-start Smart Routing

```
User in Claude Code: /id3-start I want to build a task management app

  |
  v
Claude loads ~/.claude/skills/id3-start/SKILL.md
  |
  v
Step 1: Check project state
  +-- Read specs/entity-catalog.md  --> not found
  |
  v
Step 2: Classify intent
  +-- "build a task management app" = new project
  +-- No entity catalog exists
  +-- Route: id3-identify-entities (Phase 1 Greenfield)
  |
  v
Step 3: Execute
  +-- Announce: "Routing to Entity Identification (Phase 1) - 
  |    new project, starting with information discovery"
  +-- Invoke /id3-identify-entities
  |
  v
id3-identify-entities skill takes over (loaded from project .claude/skills/)
```

### Flow 4: /id3-start UI Fast-Path

```
User: /id3-start design a dashboard for our sales data

  |
  v
Step 1: Check project state
  +-- Read specs/entity-catalog.md --> exists, has entities
  |
  v
Step 2: Classify intent
  +-- "design a dashboard" = explicit UI request
  +-- Fast-path rule: UI requests -> id3-design-ui directly
  |
  v
Step 3: Execute
  +-- Announce: "Routing to UI Design (Phase 2.5) - 
  |    direct UI design request"
  +-- Invoke /id3-design-ui
```

---

## Directory Structure (After Changes)

```
iddd/
  bin/
    cli.ts                          # Unchanged - backward compat entry point
  src/
    init.ts                         # Unchanged - core init logic
    utils/
      fs.ts                         # Unchanged - file utilities
      ascii.ts                      # Unchanged - banner/box rendering
    hooks/                          # Unchanged
    preview/                        # Unchanged
  scripts/
    postinstall.ts                  # NEW - copies global skills on npm i -g
    build-hooks.js                  # Existing
    update-version.js               # Existing
  skills-global/                    # NEW - source for global-scope skills
    id3-init/
      SKILL.md                      # Project initialization skill
    id3-start/
      SKILL.md                      # Smart router skill
      references/
        phase-guide.md              # Detailed phase routing reference
  templates/                        # Unchanged - project-scope templates
    skills/
      id3-identify-entities/
      id3-design-information/
      id3-design-ui/
      id3-spawn-team/
      id3-info-audit/
      id3-preview/
    specs/
    docs/
    steering/
    hooks/
    .claude/
    .agents/
  package.json                      # Updated: postinstall script, files array
  tsconfig.json                     # Updated: include scripts/
```

---

## Patterns to Follow

### Pattern 1: Skill Composition via Claude's Skill Tool

**What:** The id3-start router does not programmatically call other skills. It instructs Claude to invoke the target skill, and Claude's built-in Skill tool handles loading and execution.

**When:** Any skill needs to delegate to another skill.

**Why:** Claude Code's skill system is designed for compositional use. The official docs state: "Claude can use multiple Skills together automatically. This composability is one of the most powerful parts of the Skills feature."

**Example in SKILL.md:**
```markdown
## Step 3: Execute Route

After classifying, invoke the target skill. Example:
- If routing to entity identification, invoke /id3-identify-entities
- Pass along the user's original request as context
```

### Pattern 2: Context-Gated Routing

**What:** Read project state files before making routing decisions. The router checks what artifacts exist to determine where the user is in the IDDD workflow.

**When:** The smart router needs to suggest the right phase.

**Why:** Without state awareness, the router would always suggest Phase 1. By reading `entity-catalog.md`, `data-model.md`, etc., it can suggest the next logical phase.

**Example:**
```markdown
## Pre-routing checks

1. Does `specs/entity-catalog.md` exist?
   - NO -> Suggest id3-identify-entities or id3-init
2. Does `specs/data-model.md` exist?
   - YES -> Phases 0-2 done, suggest id3-spawn-team
   - NO -> Suggest id3-design-information
```

### Pattern 3: Overwrite-Safe Global Skill Registration

**What:** Postinstall always overwrites `~/.claude/skills/id3-*` directories. Skills are treated as package-owned artifacts, not user-editable config.

**When:** Every `npm install` or `npm update` of id3-cli.

**Why:** Ensures skill definitions stay in sync with the package version. Users don't customize global skill content -- they customize project-level skills (in `.claude/skills/` within the project).

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Duplicating init logic in the skill

**What:** Writing template-copy logic directly in the id3-init SKILL.md instead of invoking the existing CLI.

**Why bad:** Two implementations to maintain. Bugs in one not fixed in the other. The skill markdown cannot do complex filesystem operations reliably.

**Instead:** The id3-init skill invokes `npx id3-cli@latest .` which runs the existing, tested `initProject()` function.

### Anti-Pattern 2: Hardcoded intent keywords for routing

**What:** Building a rigid keyword-matching router (if input contains "entity" -> Phase 1).

**Why bad:** Brittle. Misses paraphrases, natural language variation, context.

**Instead:** Use Claude's language understanding. The SKILL.md provides routing criteria as natural language descriptions with signal words as hints, not as exact-match rules. Claude evaluates the full context.

### Anti-Pattern 3: Using Claude Code plugin system for 2 skills

**What:** Creating a `.claude-plugin/plugin.json` manifest, marketplace registration, etc.

**Why bad:** Over-engineered for 2 global skills. Adds namespace prefix (`/id3-cli:id3-init`), requires `/plugin install` step, adds marketplace dependency.

**Instead:** Direct file copy to `~/.claude/skills/` via npm postinstall. Clean command names, no extra install step.

### Anti-Pattern 4: Running postinstall with root/sudo

**What:** Using `sudo npm i -g id3-cli` which runs postinstall as root.

**Why bad:** Writes to root's home directory (`/root/.claude/skills/`) instead of the actual user's. Permission issues.

**Instead:** Document that users should use nvm or configure npm prefix. The postinstall script uses `os.homedir()` which resolves to the effective user's home.

---

## Backward Compatibility Strategy

| Use Case | Before (v0.9.x) | After (v1.0) | Impact |
|----------|-----------------|--------------|--------|
| Quick project init | `npx id3-cli@latest .` | `npx id3-cli@latest .` | None -- still works |
| Claude Code project init | Manual `npx` | `/id3-init` | New -- easier |
| Phase navigation | User reads docs, picks skill | `/id3-start [request]` | New -- guided |
| Phase skills in project | Symlinked during init | Symlinked during init | None -- unchanged |
| CI/CD scaffolding | `npx id3-cli@latest .` | `npx id3-cli@latest .` | None -- still works |

The `bin` field in package.json stays unchanged. The `postinstall` script is additive. The `files` array adds `skills-global/` without removing anything.

---

## Scalability Considerations

| Concern | Current (2 global skills) | Future (5-10 global skills) | Future (ecosystem) |
|---------|--------------------------|----------------------------|-------------------|
| Skill registration | Postinstall copies 2 dirs | Same mechanism, scales linearly | Consider plugin system |
| Routing complexity | 6 target skills, simple tree | Add more branches to router | Consider reference file per category |
| Version sync | npm update refreshes all | Same | Marketplace might be needed |
| Discovery | User knows `/id3-init` | `/id3-start` handles discovery | `/id3-help` or auto-suggest |

---

## Build Order Implications

The recommended implementation order based on dependency analysis:

### Phase A: Postinstall + Global Skill Infrastructure (Foundation)

Build first because everything else depends on skills being registered globally.

1. Create `skills-global/` directory structure
2. Write `scripts/postinstall.ts`
3. Update `package.json` (postinstall script, files array)
4. Update `tsconfig.json` to include `scripts/`
5. Test: `npm pack && npm i -g ./id3-cli-*.tgz` and verify `~/.claude/skills/id3-init/` exists

### Phase B: id3-init Skill (Simple, validates infrastructure)

Build second because it validates the global skill registration works end-to-end.

1. Write `skills-global/id3-init/SKILL.md`
2. Test in Claude Code: `/id3-init` should scaffold IDDD into a test project
3. Verify backward compat: `npx id3-cli .` still works

### Phase C: id3-start Smart Router (Complex, requires Phase B)

Build last because it depends on project-scope skills being installed (which id3-init does).

1. Write `skills-global/id3-start/SKILL.md` with routing logic
2. Write `skills-global/id3-start/references/phase-guide.md`
3. Test routing scenarios:
   - New project (no entity catalog) -> routes to id3-identify-entities
   - Existing project with entities -> routes to id3-design-information
   - UI request -> fast-paths to id3-design-ui
   - Ambiguous request -> presents options
4. Test the UI fast-path rule specifically

### Phase D: Polish + Uninstall (Optional, post-launch)

1. Add `preuninstall` script to clean up `~/.claude/skills/id3-*` on `npm uninstall -g id3-cli`
2. Add `--no-global-skills` flag to skip postinstall registration
3. Update README with new usage patterns

---

## Sources

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- Official docs, HIGH confidence
- [Claude Code Plugins Documentation](https://code.claude.com/docs/en/plugins) -- Official docs, HIGH confidence
- [Anthropic Skills Repository](https://github.com/anthropics/skills) -- Official repo, HIGH confidence
- [npm Scripts Documentation](https://docs.npmjs.com/cli/v11/using-npm/scripts/) -- Official docs, HIGH confidence
- [AI Agent Routing Best Practices](https://www.patronus.ai/ai-agent-development/ai-agent-routing) -- Community, MEDIUM confidence
- [Intent Recognition in Multi-Agent Systems](https://gist.github.com/mkbctrl/a35764e99fe0c8e8c00b2358f55cd7fa) -- Community, MEDIUM confidence
- [Claude Code --add-dir Issue #23404](https://github.com/anthropics/claude-code/issues/23404) -- GitHub issue, MEDIUM confidence

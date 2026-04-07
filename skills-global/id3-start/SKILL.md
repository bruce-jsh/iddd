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

Communicate with the user in their language. If the user writes in Korean, respond in Korean. If English, respond in English. Match the language of the user's input naturally.

---

## Step 1: Check IDDD Installation

Use the Glob tool to check if the following files exist in the project root:
- `specs/entity-catalog.md`
- `CLAUDE.md`

**If BOTH exist:** IDDD is already installed. Skip to Step 2.

**If EITHER is missing:**

1. **Check for project root indicators.** Use the Glob tool to look for any of these files in the current directory:
   - `package.json`
   - `.git/`
   - `Cargo.toml`
   - `go.mod`
   - `pyproject.toml`
   - `Makefile`
   - `pom.xml`
   - `build.gradle`

   If NONE of these exist, show a warning to the user:

   > "This directory does not appear to be a project root (no package.json, .git, etc.). Are you sure you want to set up IDDD here? [y/N]"

   Wait for the user's response. If they decline (N or no response), stop here. If they confirm (y), proceed.

2. **Show welcome banner.** Render a welcome banner using double-line box characters:

   ```
   ╔════════════════════════════════════════════════════════════════╗
   ║                                                                ║
   ║  Welcome to IDDD -- Information Design-Driven Development.     ║
   ║  Your information model is your harness.                       ║
   ║                                                                ║
   ╚════════════════════════════════════════════════════════════════╝
   ```

3. **Show auto-setup notice:**

   > "IDDD is not set up in this project. Setting up now..."

4. **Run auto-setup.** Use the Bash tool to execute:

   ```bash
   id3-cli init .
   ```

   Do NOT ask the user for confirmation before running this command. Auto-setup runs automatically per design decision.

5. **Show completion message:**

   > "IDDD initialized. Here is your project dashboard:"

6. Continue to Step 2.

---

## Step 2: Read Project State

Read YAML frontmatter from the specs files to determine the current project phase.

1. **Read `specs/entity-catalog.md`** using the Read tool. Extract from the YAML frontmatter (between `---` markers):
   - `version` (string)
   - `entity_count` (number)
   - `rule_count` (number)
   - `phase` (string)

2. **Read `specs/data-model.md`** using the Read tool. Extract from the YAML frontmatter:
   - `version` (string)
   - `rule_count` (number)

3. **Check if `specs/ui-structure.md` exists** using the Glob tool. If it exists, read it and extract:
   - `version` (string)
   - `screen_count` (number)

4. **Map to phase completion status:**
   - entity-catalog version "0.0" or file missing = Phase 0/1 NOT STARTED
   - entity-catalog version "0.1" = Phase 0/1 COMPLETE
   - entity-catalog version "1.0" or higher = Phase 2 COMPLETE
   - ui-structure exists with version > "0.0" = Phase 2.5 COMPLETE
   - Build status: if Phase 2.5 is complete, Build is IN-PROGRESS; otherwise NOT STARTED

5. **Determine the current phase** = the first incomplete phase in this order:
   Phase 0/1 -> Phase 2 -> Phase 2.5 -> Phase 3-5

---

## Step 3: Show Dashboard

Render the progress dashboard following the template in [references/dashboard-template.md](references/dashboard-template.md) EXACTLY. Fill in the status symbols and values from the project state detected in Step 2. Do not reformat or improve the layout.

The dashboard consists of 4 sections rendered in order:
1. Header (double-line box with IDDD title)
2. Phase Pipeline (4 boxes with status symbols)
3. Progress Bar (filled + empty blocks with percentage)
4. Status Message (current status + request or suggestion)

---

## Step 4: Route or Suggest

**If $ARGUMENTS is empty or contains only whitespace:**

Show the suggested next action based on the current phase state. Format:

> Suggested next action: {phase name}. Use `/id3-start [your request]` to begin.

Use these phase name mappings:
- Phase 0/1 not started: "Entity Identification (Phase 0/1)"
- Phase 0/1 complete: "Information Design (Phase 2)"
- Phase 2 complete: "UI Design (Phase 2.5)"
- Phase 2.5 complete: "Implementation (Phase 3-5)"
- All complete: suggest running /id3-info-audit

Stop here. Do not attempt routing.

**If $ARGUMENTS contains a request:**

Analyze the user's request against the routing taxonomy in [references/phase-guide.md](references/phase-guide.md).

1. Present the current project state to the user and which Phase you recommend.
2. Show routing announcement:

   > Routing to {skill name} -- {phase one-liner description}.

3. Show artifacts:

   > This phase produces: {artifact list from phase-guide}.

4. Invoke the target skill. Include the user's original request as context when delegating.

### Routing Decision Rules

Apply these rules in order:

1. **Clear match:** If the request matches a single phase clearly, route there.

2. **UI fast-path (ROUT-05):** If the request is UI-only (contains only explicit UI keywords like "design login screen", "create dashboard layout", "wireframe") AND `specs/data-model.md` exists with version >= "1.0", route directly to /id3-design-ui. Skip the entity identification question.

3. **Ambiguous request (ROUT-06):** If the request could be BOTH a UI-only change AND a data/entity change (e.g., "add filter to list", "add search", "update user profile"), ask the user:

   > "Should this be a UI-only change, or does it need new data/entities? Please clarify."

   Wait for the user's response, then route based on their clarification.

4. **Prerequisite check (ROUT-08):** If the target phase has prerequisites not met (e.g., routing to Phase 2 but Phase 0/1 is not done), inform the user:

   > "Phase {N} requires {prerequisite}. Please complete {earlier phase} first."

   Then suggest the correct starting phase. Note: each target skill also has its own built-in prerequisite checks, so the router's check is a courtesy -- the target skill will enforce regardless.

5. **Invoke target skill (ROUT-07, ROUT-09):** After routing decision is confirmed, invoke the target skill using its slash command name:
   - Entity work: use /id3-identify-entities
   - Information design: use /id3-design-information
   - UI design: use /id3-design-ui
   - Build: use /id3-spawn-team
   - Audit: use /id3-info-audit
   - Preview: use /id3-preview

   Pass the user's original request as conversational context when invoking the target skill.

---

Note: This skill is the global entry point installed at `~/.claude/skills/id3-start/`. The 6 phase skills (id3-identify-entities, id3-design-information, id3-design-ui, id3-spawn-team, id3-info-audit, id3-preview) are project-scoped and installed by `id3-cli init .` into the project's `.claude/skills/` directory.

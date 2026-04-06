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

Remove all IDDD-generated files from this project, restoring it to pre-IDDD state. This is a destructive action that requires explicit confirmation.

Communicate with the user in their language.

## Step 1: Verify IDDD Installation

Check if this project has IDDD installed:

1. Use the Bash tool to check: `test -f specs/entity-catalog.md && echo "EXISTS" || echo "MISSING"` and `test -f CLAUDE.md && echo "EXISTS" || echo "MISSING"`
2. If **neither** `specs/entity-catalog.md` nor `CLAUDE.md` exists:
   - Respond: "No IDDD files found in this project. Nothing to clear."
   - **Stop here.** Do not proceed to Step 2.
3. If at least one exists: continue to Step 2.

## Step 2: Scan Deletion Targets

Check the existence of each known IDDD directory and file. Use the Bash tool to run these checks:

```bash
for d in specs docs steering hooks skills .claude/skills .claude/hooks .codex/skills .agents/skills .iddd; do
  test -d "$d" && echo "DIR_EXISTS: $d" || echo "DIR_MISSING: $d"
done
for f in CLAUDE.md AGENTS.md; do
  test -f "$f" && echo "FILE_EXISTS: $f" || echo "FILE_MISSING: $f"
done
```

Build two lists from the results:
- **Directories that exist** (only those with `DIR_EXISTS`)
- **Files that exist** (only those with `FILE_EXISTS`)

Additionally, check for user-authored content:
```bash
test -f steering/product.md && echo "USER_FILE: steering/product.md" || true
test -f steering/data-conventions.md && echo "USER_FILE: steering/data-conventions.md" || true
```

Only include items that actually exist in the deletion lists.

## Step 3: Show Warning and Confirm

Render the warning block to the user. Only list directories and files that actually exist (from Step 2).

Format:

```
⚠️ WARNING: This action cannot be undone.

The following IDDD files and directories will be deleted:

Directories:
  - specs/
  - docs/
  - steering/                  (warning: contains user-authored content)
  - hooks/
  - skills/
  - .claude/skills/
  - .claude/hooks/
  - .codex/skills/
  - .agents/skills/
  - .iddd/

Files:
  - CLAUDE.md
  - AGENTS.md

⚠️ Files with user-authored content:
  - steering/product.md        (your product vision)
  - steering/data-conventions.md (your data conventions)

Proceed? [y/N]
```

Rules for rendering:
- Only list directories and files that actually exist (from Step 2 scan results)
- If `steering/` exists, add `(warning: contains user-authored content)` annotation to it
- The "Files with user-authored content" section only appears if `steering/product.md` or `steering/data-conventions.md` actually exists
- Default is **N** (deny). Only proceed on explicit "y" or "yes" response
- **Wait for user response. Do NOT proceed without confirmation.**

## Step 4: Execute Deletion

**On user confirmation ("y" or "yes"):**

1. Delete all identified directories using Bash (only the ones that exist from Step 2):
   ```bash
   rm -rf specs/ docs/ steering/ hooks/ skills/ .claude/skills/ .claude/hooks/ .codex/skills/ .agents/skills/ .iddd/
   ```
   (Include only the directories that were found in Step 2.)

2. Delete individual files using Bash (only the ones that exist from Step 2):
   ```bash
   rm -f CLAUDE.md AGENTS.md
   ```
   (Include only the files that were found in Step 2.)

3. Count how many directories and files were deleted.

4. Show completion summary:
   ```
   IDDD files removed. {N} directories and {M} files deleted. Project restored to pre-IDDD state.
   ```

**On user denial ("n", "N", empty, or any other response):**

- Show: "Clear cancelled. No files were removed."
- Stop.

## Safety Rules

- NEVER delete files outside the known IDDD file list above
- NEVER use glob patterns like `rm -rf *` -- only delete specific known paths
- NEVER skip the confirmation step
- If the user asks to delete specific files only, inform them that /id3-clear removes all IDDD files. For selective deletion, they should use manual file operations.

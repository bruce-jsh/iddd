# Dashboard Template

Reproduce this template EXACTLY, replacing only the placeholder values
with actual data from the project state. Do NOT reformat, reword,
or "improve" the layout. Use the exact box-drawing characters shown.

## Header

The header is a double-line box, 60 characters inner width.
Use the exact Unicode box-drawing characters shown below:

```
╔════════════════════════════════════════════════════════════════╗
║  IDDD - Information Design-Driven Development                 ║
║  Your information model is your harness.                      ║
╚════════════════════════════════════════════════════════════════╝
```

## Phase Pipeline

Four boxes connected by arrows. Each box is 16 characters wide (14 inner + 2 single-line borders).
Boxes are connected by `───>` (4-char gutter: 3 horizontal-line chars + arrow).

```
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │  Phase 0/1   │───>│   Phase 2    │───>│  Phase 2.5   │───>│  Phase 3-5   │
  │  Entities    │    │  Info Model  │    │  UI Design   │    │    Build     │
  │    ✓  12     │    │   ✓  v1.0    │    │      ◆       │    │      ○       │
  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

Between each pair of boxes on lines 2-4, show `───>` connector on line 2 (the phase label line).
Lines 3-4 use 4 spaces between boxes (same width as the connector, but blank).

### Status Symbols and Values

For each phase box, determine status from project state:

| Phase | Check | Complete (symbol + value) | In-Progress | Not Started |
|-------|-------|--------------------------|-------------|-------------|
| Phase 0/1 | entity-catalog version | ✓ + entity_count (e.g., "✓  12") | ◆ | ○ |
| Phase 2 | entity-catalog version >= "1.0" | ✓ + "v" + version (e.g., "✓  v1.0") | ◆ | ○ |
| Phase 2.5 | ui-structure exists with version > "0.0" | ✓ + screen_count (e.g., "✓  8") | ◆ | ○ |
| Phase 3-5 | (manual check -- no automated indicator) | ✓ | ◆ | ○ |

### Phase Completion Mapping

- entity-catalog version "0.0" or missing = Phase 0/1 not started
- entity-catalog version "0.1" = Phase 0/1 complete, Phase 2 in-progress
- entity-catalog version "1.0" or higher = Phase 2 complete
- ui-structure exists with version > "0.0" = Phase 2.5 complete
- Build status: mark as ◆ (diamond) if Phase 2.5 is complete, ○ (circle) otherwise

Only ONE phase may show ◆ (the currently actionable phase). All phases after it show ○.

### Status Line Formatting

Center the symbol and value within the 14-character inner width of each box.
Examples of line 4 content (14 chars inner):
- Complete with count: `    ✓  12     ` (symbol + 2 spaces + value, centered)
- Complete with version: `   ✓  v1.0    ` (symbol + 2 spaces + value, centered)
- In-progress: `      ◆       ` (diamond centered)
- Not started: `      ○       ` (circle centered)

## Progress Bar

Total width: 66 characters for the bar + 4 for the percentage label.
Top rule: 70 repeated single-horizontal characters (─).
Bar: filled-blocks (█ for completed %) + light-shade blocks (░ for remaining %) + "  NN%"
Bottom rule: 70 repeated single-horizontal characters (─).

```
  ──────────────────────────────────────────────────────────────────────────
  ████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  50%
  ──────────────────────────────────────────────────────────────────────────
```

### Progress Calculation

Equal weight per phase:
- Entities (Phase 0/1): 25%
- Info Model (Phase 2): 25%
- UI Design (Phase 2.5): 25%
- Build (Phase 3-5): 25%

Each completed phase adds its weight. In-progress phase adds 0%.
The bar is 66 characters wide. Scale the filled portion: `filled_chars = round(66 * percentage / 100)`.

## Status Message

Two lines prefixed with "> ":

Line 1: "> " + status description based on current state
Line 2 (if $ARGUMENTS provided): "> Request: \"{user's request}\""
Line 2 (if no $ARGUMENTS): "> Suggested next action: {next phase name}. Use `/id3-start [your request]` to begin."

### Status Descriptions by State

- No phases complete: "Current status: Ready to begin entity identification"
- Phase 0/1 complete: "Current status: Entity identification complete. Ready for information design"
- Phase 2 complete: "Current status: Information model complete. Ready for UI design"
- Phase 2.5 complete: "Current status: UI design complete. Ready for implementation"
- All complete: "Current status: All phases complete. Use /id3-info-audit for model verification"

### Example Output (50% complete)

```
  > Current status: Information model complete. Ready for UI design
  > Request: "CRM 시스템 만들고 싶어요"
```

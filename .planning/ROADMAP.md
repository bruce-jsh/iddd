# Roadmap: IDDD Skill Package v2

## Overview

Transform id3-cli from an npx-only template copier into a globally installable package with two Claude Code slash commands: `/id3-start` (auto-setup + smart routing + progress dashboard) and `/id3-clear` (project reset). Phase 1 builds the global install and skill registration infrastructure. Phase 2 delivers both skills with UX enhancements.

## Phases

**Phase Numbering:**
- Integer phases (1, 2): Planned milestone work
- Decimal phases (1.1, 1.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Global Install & Skill Registration** - CLI installs globally via npm, registers id3-start and id3-clear skills, maintains npx backward compatibility
- [ ] **Phase 2: Skills & UX** - /id3-start with auto-setup, smart routing, progress dashboard; /id3-clear for project reset

## Phase Details

### Phase 1: Global Install & Skill Registration
**Goal**: Users can install id3-cli globally and have `/id3-start` and `/id3-clear` slash commands automatically available in Claude Code
**Depends on**: Nothing (first phase)
**Requirements**: INST-01, INST-02, INST-03, INST-04, INST-05, INST-06
**Success Criteria** (what must be TRUE):
  1. User runs `npm i -g id3-cli` and the CLI is available as a global command
  2. After global install, `/id3-start` and `/id3-clear` appear as available slash commands in Claude Code
  3. User runs `npx id3-cli .` and it works exactly as before (backward compatibility)
  4. Skill registration and CLI paths work correctly on macOS, Linux, and Windows
  5. User runs `npm uninstall -g id3-cli` and registered skill files are cleaned up
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD

### Phase 2: Skills & UX
**Goal**: Users can run `/id3-start [request]` for auto-setup + smart routing with progress dashboard, and `/id3-clear` for project reset
**Depends on**: Phase 1
**Requirements**: ROUT-01 through ROUT-10, CLR-01, CLR-02, CLR-03, UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):
  1. User runs `/id3-start [request]` in a fresh project and IDDD files are auto-setup before routing
  2. User sees progress dashboard and gets routed to the appropriate IDDD phase based on intent analysis and project state
  3. User requests a pure UI task and gets routed directly to id3-design-ui, skipping entity identification
  4. User runs `/id3-start` without arguments and sees project status with suggested next action
  5. User runs `/id3-clear`, confirms, and all IDDD-generated files are removed
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Global Install & Skill Registration | 0/0 | Not started | - |
| 2. Skills & UX | 0/0 | Not started | - |

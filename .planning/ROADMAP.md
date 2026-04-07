# Roadmap: IDDD Skill Package v2

## Overview

Transform id3-cli from an npx-only template copier into a globally installable package with two Claude Code slash commands: `/id3-start` (auto-setup + smart routing + progress dashboard) and `/id3-clear` (project reset). Then prepare and publish v1.0.0 to npm and GitHub.

## Milestones

### v1.0 (Complete)
- Phase 1: Global Install & Skill Registration
- Phase 2: Skills & UX

### v1.1: Release & Deploy (Current)
- Phase 3: Repository & Package Cleanup
- Phase 4: Documentation
- Phase 5: Release & Verify

## Phases

**Phase Numbering:**
- Integer phases (1, 2, ...): Planned milestone work
- Decimal phases (1.1, 1.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Global Install & Skill Registration** - CLI installs globally via npm, registers skills
- [x] **Phase 2: Skills & UX** - /id3-start smart router, /id3-clear project reset
- [ ] **Phase 3: Repository & Package Cleanup** - LICENSE, .gitignore, git tracking cleanup, package.json metadata, files field refinement, SKILL.md npx fix
- [ ] **Phase 4: Documentation** - README restructure (Quick Start first), npx→global install references, CHANGELOG.md, translated README updates
- [ ] **Phase 5: Release & Verify** - Version bump to 1.0.0, pack verification, tarball test, npm publish, GitHub Release, post-publish verification

## Phase Details

### Phase 3: Repository & Package Cleanup
**Goal**: GitHub 레포와 npm 패키지에서 불필요한 파일을 제거하고, 배포에 필요한 메타데이터를 완비한다
**Depends on**: Phase 2 (complete)
**Requirements**: REP-01, REP-02, REP-03, REP-04, PKG-01, PKG-02, PKG-03, PKG-04, PKG-05
**Success Criteria** (what must be TRUE):
  1. LICENSE 파일이 레포 루트에 존재한다
  2. `.planning/`, stale test/script 파일이 GitHub에서 보이지 않는다
  3. `npm pack --dry-run`에서 dev scripts, 중복 hooks, .d.ts 파일이 나타나지 않는다
  4. package.json에 repository, homepage, bugs, engines 필드가 존재한다
  5. `id3-start/SKILL.md`에서 npx 참조가 제거되었다
**Plans:** 2 plans
Plans:
- [ ] 03-01-PLAN.md -- Repository cleanup: LICENSE, .gitignore, git tracking removal
- [ ] 03-02-PLAN.md -- Package quality: metadata, files field, prepublishOnly, SKILL.md npx fix

### Phase 4: Documentation
**Goal**: 사용자가 README를 보고 10초 안에 설치/시작 방법을 파악할 수 있게 한다
**Depends on**: Phase 3
**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04, DOC-05
**Success Criteria** (what must be TRUE):
  1. README.md 상단 15줄 이내에 `npm i -g id3-cli` 설치 명령이 있다
  2. 6개 README 전체에서 npx 참조가 0건이다
  3. CHANGELOG.md가 존재하며 v1.0.0 Added 섹션이 있다
  4. 4개 번역 README가 새로운 구조를 따른다
  5. README에 npm version, license 배지가 표시된다
**Plans:** TBD

### Phase 5: Release & Verify
**Goal**: v1.0.0을 npm에 배포하고, 새 사용자가 `npm i -g id3-cli` → `/id3-start`까지 문제없이 사용 가능함을 검증한다
**Depends on**: Phase 4
**Requirements**: REL-01, REL-02, REL-03, REL-04, REL-05, REL-06, REL-07
**Success Criteria** (what must be TRUE):
  1. `npm view id3-cli version`이 `1.0.0`을 반환한다
  2. `npm i -g id3-cli` 후 `id3-cli --version`이 `1.0.0`을 출력한다
  3. 설치 후 `~/.claude/skills/id3-start/SKILL.md`가 존재한다
  4. `id3-cli init .`로 IDDD 프로젝트가 정상 생성된다
  5. 0.x 버전에 deprecation 경고가 표시된다
  6. GitHub Release `v1.0.0`이 릴리스 노트와 함께 존재한다
**Plans:** TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Global Install & Skill Registration | 2/2 | Complete | 2026-04-06 |
| 2. Skills & UX | 2/2 | Complete | 2026-04-06 |
| 3. Repository & Package Cleanup | 0/2 | Not started | - |
| 4. Documentation | 0/? | Not started | - |
| 5. Release & Verify | 0/? | Not started | - |

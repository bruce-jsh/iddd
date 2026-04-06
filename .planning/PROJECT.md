# IDDD Skill Package v2 - Deployment & Smart Routing

## What This Is

id3-cli(IDDD 스킬 패키지)의 배포 방식을 npm 글로벌 설치로 전환하고, Claude Code 슬래시 커맨드 `/id3-init`으로 프로젝트 셋업을 지원한다. 또한 `/id3-start` 스마트 라우터 스킬을 추가하여 사용자 요청을 분석하고 적절한 IDDD Phase로 자동 라우팅한다.

## Core Value

사용자가 IDDD를 Claude Code 안에서 슬래시 커맨드만으로 자연스럽게 사용할 수 있어야 한다.

## Requirements

### Validated

- v0.9.3 기존 6개 스킬 구현 완료 (identify-entities, design-information, design-ui, spawn-team, info-audit, preview)
- 템플릿 파일 체계 구현 완료 (specs/, docs/, steering/, hooks/)
- Hook 시스템 구현 완료 (schema-drift, rule-check, auto-audit)
- 크로스 플랫폼 지원 (Claude Code, Codex)
- 버전 자동화 (npm version -> README 업데이트)

### Active

- [x] npm 글로벌 설치 방식으로 전환 (`npm i -g id3-cli`) — Validated in Phase 1: npm-global
- [x] 글로벌 설치 후 `/id3-init` 슬래시 커맨드로 프로젝트 셋업 — Validated in Phase 1: npm-global
- [x] `/id3-start` 스마트 라우터 스킬 추가 — Validated in Phase 2: skills-ux
- [x] `/id3-start [요청]` 입력 시 요청 내용 분석 후 적절한 Phase로 자동 라우팅 — Validated in Phase 2: skills-ux
- [x] 라우팅 시 사용자에게 어떤 단계로 진행하는지 가이드 메시지 제공 — Validated in Phase 2: skills-ux
- [x] 정보정의가 불필요한 UI 요청은 id3-design-ui로 직행 — Validated in Phase 2: skills-ux

### Out of Scope

- 기존 6개 스킬의 내부 로직 변경
- 새로운 플랫폼(Antigravity 등) 추가 지원
- 패키지명 변경 (id3-cli 유지)

## Context

- 현재 배포: `npx id3-cli@latest [target-dir]`로 CLI 실행, 템플릿 파일을 대상 디렉터리에 복사
- 현재 진입점: `bin/cli.ts` -> `src/init.ts`의 `initProject()` 함수
- 스킬 6개: `templates/skills/` 아래 각 SKILL.md로 정의
- 기존 CLI는 `npx` 방식이라 Claude Code 슬래시 커맨드와 별개. 글로벌 설치 + 스킬 자동 등록으로 통합 필요
- PRD: `prd/IDDD-SKILL-SPEC-v0.3.md` 참조

## Constraints

- **Tech stack**: TypeScript, Node.js (기존 유지)
- **Compatibility**: 기존 `npx id3-cli` 방식도 하위 호환 유지
- **Platform**: Claude Code 슬래시 커맨드 체계 준수 (.claude/commands/ 또는 .claude/skills/)
- **Naming**: 모든 스킬명에 "id3-" prefix 유지

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| npm 글로벌 설치 방식 채택 | 슬래시 커맨드 등록을 위해 글로벌 패키지가 필요 | Done (Phase 1) |
| /id3-start를 별도 스킬로 추가 | 기존 스킬 로직은 변경하지 않고 라우터 역할만 담당 | Done (Phase 2) |
| 기존 npx 방식 하위 호환 유지 | 기존 사용자 영향 최소화 | Done (Phase 1) |

---
*Last updated: 2026-04-06 after Phase 2 completion — all milestone requirements validated*

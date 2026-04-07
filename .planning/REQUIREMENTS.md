# Requirements: IDDD Skill Package v2

**Defined:** 2026-04-06
**Core Value:** Claude Code 안에서 슬래시 커맨드만으로 IDDD를 자연스럽게 사용할 수 있어야 한다.

## v1.0 Requirements (Complete)

All v1.0 requirements have been implemented and validated.

### Global Install

- [x] **INST-01**: `npm i -g id3-cli`로 글로벌 설치 시 CLI와 스킬 파일이 함께 설치된다
- [x] **INST-02**: 글로벌 설치 시 `~/.claude/skills/id3-start/SKILL.md`가 자동 등록된다
- [x] **INST-03**: 글로벌 설치 시 `~/.claude/skills/id3-clear/SKILL.md`가 자동 등록된다
- [x] **INST-04**: ~~`npx id3-cli` 기존 방식이 하위 호환으로 동작한다~~ (v1.1에서 제거됨)
- [x] **INST-05**: 크로스 플랫폼(macOS, Linux, Windows) 경로 처리가 정상 동작한다
- [x] **INST-06**: `npm uninstall -g id3-cli` 시 등록된 스킬 파일이 정리된다

### Smart Router

- [x] **ROUT-01**: `/id3-start [요청]` 입력 시 IDDD 미설치면 자동으로 프로젝트 셋업을 먼저 실행한다
- [x] **ROUT-02**: 자동 셋업 후 또는 IDDD 설치 상태에서 자연어를 분석하여 적절한 Phase로 라우팅한다
- [x] **ROUT-03**: 프로젝트 상태(specs 파일 존재 여부, YAML 헤더)를 읽어 라우팅 결정에 반영한다
- [x] **ROUT-04**: 라우팅 시 "이 요청은 Phase X로 진행합니다" 안내 메시지를 표시한다
- [x] **ROUT-05**: 정보정의가 불필요한 UI 요청은 id3-design-ui로 직행한다
- [x] **ROUT-06**: 의도가 불명확한 요청에 대해 명확화 질문을 한다
- [x] **ROUT-07**: 라우팅 결정 후 대상 스킬을 실제로 호출한다
- [x] **ROUT-08**: Phase 전제조건이 충족되지 않으면 올바른 시작점으로 안내한다
- [x] **ROUT-09**: `$ARGUMENTS`를 통해 사용자 입력을 대상 스킬에 전달한다
- [x] **ROUT-10**: 이미 초기화된 프로젝트에서 자동 셋업이 중복 실행되지 않는다 (멱등)

### Clear

- [x] **CLR-01**: `/id3-clear` 실행 시 IDDD가 생성한 모든 파일/폴더를 삭제한다
- [x] **CLR-02**: 삭제 전 확인 메시지를 표시한다 (파괴적 작업)
- [x] **CLR-03**: 초기화 완료 후 결과 요약을 표시한다

### UX Enhancements

- [x] **UX-01**: `/id3-start` 실행 시 프로젝트 진행 대시보드를 표시한다 (Phase별 완료 상태)
- [x] **UX-02**: 인수 없이 `/id3-start`만 입력 시 현재 상태를 분석하여 다음 액션을 제안한다
- [x] **UX-03**: 라우팅 안내에 해당 Phase의 설명과 산출물 정보를 포함한다

---

## v1.1 Requirements

Requirements for the Release & Deploy milestone. Goal: v1.0.0으로 npm 정식 배포.

### Repository Cleanup

- [ ] **REP-01**: MIT LICENSE 파일이 레포 루트에 존재한다
- [ ] **REP-02**: `.planning/` 디렉토리가 git 추적에서 제거된다 (로컬은 유지)
- [ ] **REP-03**: .gitignore에 이미 선언되었으나 git에 남아있는 스테일 파일이 정리된다 (tests/, scripts/)
- [ ] **REP-04**: .gitignore가 개발 산출물, 에디터 파일, AI 계획 파일을 완전히 커버한다

### Package Quality

- [ ] **PKG-01**: package.json에 `repository`, `homepage`, `bugs` 필드가 존재한다
- [ ] **PKG-02**: `engines` 필드가 `>=20.11.0`으로 설정된다 (`import.meta.dirname` 최소 요구)
- [ ] **PKG-03**: `files` 필드가 런타임 필수 파일만 포함한다 (dev scripts, 중복 hooks, .d.ts 제외)
- [ ] **PKG-04**: `prepublishOnly`가 build와 test를 모두 실행한다
- [ ] **PKG-05**: `id3-start/SKILL.md`에서 `npx id3-cli .`가 `id3-cli init .`로 변경된다

### Documentation

- [ ] **DOC-01**: README.md에서 Quick Start(설치+첫 사용)가 상단 15줄 이내에 위치한다
- [ ] **DOC-02**: 모든 README(6개)에서 npx 참조가 글로벌 설치 안내로 교체된다
- [ ] **DOC-03**: CHANGELOG.md가 Keep a Changelog 형식으로 존재한다
- [ ] **DOC-04**: 번역 README(4개)가 새로운 구조에 맞게 업데이트된다
- [ ] **DOC-05**: README에 npm version, license 배지가 추가된다

### Release & Verify

- [ ] **REL-01**: 패키지 버전이 1.0.0으로 업그레이드된다
- [ ] **REL-02**: `npm pack --dry-run`으로 불필요 파일이 포함되지 않음을 확인한다
- [ ] **REL-03**: tarball에서 글로벌 설치 후 `/id3-start`까지 end-to-end 동작한다
- [ ] **REL-04**: `npm publish` 성공한다
- [ ] **REL-05**: 0.x 버전에 `npm deprecate` 적용한다
- [ ] **REL-06**: GitHub Release가 릴리스 노트와 함께 생성된다
- [ ] **REL-07**: GitHub 레포 메타데이터(description, topics, homepage)가 설정된다

## Future Requirements

Deferred to future release. Tracked but not in current roadmap.

### CLI Enhancements

- **CLI-01**: `id3-cli init --dry-run`으로 변경 사항 미리보기
- **CLI-02**: `id3-cli init --update`로 기존 프로젝트 템플릿 업데이트 (커스터마이징 보존)
- **CLI-03**: 새 버전 사용 가능 시 알림 표시

### Router Enhancements

- **ROUT-11**: 멀티 Phase 요청 분해 ("엔티티 식별하고 UI도 설계해줘" -> Phase 1 + Phase 2.5 순차 실행)

## Out of Scope

| Feature | Reason |
|---------|--------|
| npx 하위 호환 | v1.1에서 명시적으로 제거. 글로벌 설치만 지원 |
| /id3-init 별도 스킬 | /id3-start에 자동 셋업 통합으로 불필요 |
| npm provenance / CI 자동 배포 | v1.0.0은 로컬 배포, CI는 이후 마일스톤 |
| GitHub Actions 워크플로우 | 이후 마일스톤에서 추가 |
| CONTRIBUTING.md / issue templates | 커뮤니티 성장 후 추가 |
| 번역 자동화 (GitHub Actions) | v1.0.0에서는 수동 번역 |
| Interactive CLI wizard | Claude Code 스킬 실행 모델과 충돌 |
| Telemetry / 사용 분석 | 개발자 도구에서 텔레메트리는 반감을 초래 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INST-01~06 | Phase 1 (v1.0) | Complete |
| ROUT-01~10 | Phase 2 (v1.0) | Complete |
| CLR-01~03 | Phase 2 (v1.0) | Complete |
| UX-01~03 | Phase 2 (v1.0) | Complete |
| REP-01~04 | Phase 3 (v1.1) | Pending |
| PKG-01~05 | Phase 3 (v1.1) | Pending |
| DOC-01~05 | Phase 4 (v1.1) | Pending |
| REL-01~07 | Phase 5 (v1.1) | Pending |

**Coverage:**
- v1.0 requirements: 22 total, 22 complete
- v1.1 requirements: 21 total, 0 complete
- Unmapped: 0

---
*Requirements defined: 2026-04-06*
*Last updated: 2026-04-07 — v1.1 Release & Deploy requirements added*

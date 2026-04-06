# Requirements: IDDD Skill Package v2

**Defined:** 2026-04-06
**Core Value:** Claude Code 안에서 슬래시 커맨드만으로 IDDD를 자연스럽게 사용할 수 있어야 한다.

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Global Install

- [ ] **INST-01**: `npm i -g id3-cli`로 글로벌 설치 시 CLI와 스킬 파일이 함께 설치된다
- [ ] **INST-02**: 글로벌 설치 시 `~/.claude/skills/id3-start/SKILL.md`가 자동 등록된다
- [ ] **INST-03**: 글로벌 설치 시 `~/.claude/skills/id3-clear/SKILL.md`가 자동 등록된다
- [ ] **INST-04**: `npx id3-cli` 기존 방식이 하위 호환으로 동작한다
- [ ] **INST-05**: 크로스 플랫폼(macOS, Linux, Windows) 경로 처리가 정상 동작한다
- [ ] **INST-06**: `npm uninstall -g id3-cli` 시 등록된 스킬 파일이 정리된다

### Smart Router

- [ ] **ROUT-01**: `/id3-start [요청]` 입력 시 IDDD 미설치면 자동으로 프로젝트 셋업을 먼저 실행한다
- [ ] **ROUT-02**: 자동 셋업 후 또는 IDDD 설치 상태에서 자연어를 분석하여 적절한 Phase로 라우팅한다
- [ ] **ROUT-03**: 프로젝트 상태(specs 파일 존재 여부, YAML 헤더)를 읽어 라우팅 결정에 반영한다
- [ ] **ROUT-04**: 라우팅 시 "이 요청은 Phase X로 진행합니다" 안내 메시지를 표시한다
- [ ] **ROUT-05**: 정보정의가 불필요한 UI 요청은 id3-design-ui로 직행한다
- [ ] **ROUT-06**: 의도가 불명확한 요청에 대해 명확화 질문을 한다
- [ ] **ROUT-07**: 라우팅 결정 후 대상 스킬을 실제로 호출한다
- [ ] **ROUT-08**: Phase 전제조건이 충족되지 않으면 올바른 시작점으로 안내한다
- [ ] **ROUT-09**: `$ARGUMENTS`를 통해 사용자 입력을 대상 스킬에 전달한다
- [ ] **ROUT-10**: 이미 초기화된 프로젝트에서 자동 셋업이 중복 실행되지 않는다 (멱등)

### Clear

- [ ] **CLR-01**: `/id3-clear` 실행 시 IDDD가 생성한 모든 파일/폴더를 삭제한다
- [ ] **CLR-02**: 삭제 전 확인 메시지를 표시한다 (파괴적 작업)
- [ ] **CLR-03**: 초기화 완료 후 결과 요약을 표시한다

### UX Enhancements

- [ ] **UX-01**: `/id3-start` 실행 시 프로젝트 진행 대시보드를 표시한다 (Phase별 완료 상태)
- [ ] **UX-02**: 인수 없이 `/id3-start`만 입력 시 현재 상태를 분석하여 다음 액션을 제안한다
- [ ] **UX-03**: 라우팅 안내에 해당 Phase의 설명과 산출물 정보를 포함한다

## v2 Requirements

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
| /id3-init 별도 스킬 | /id3-start에 자동 셋업 통합으로 불필요 |
| Interactive CLI wizard (inquirer 스타일) | Claude Code 스킬 실행 모델과 충돌 |
| Confidence scoring / 수치 임계값 | LLM이 이미 암묵적 확신도를 가짐, 별도 스코어링은 불필요한 복잡도 |
| 사용자 정의 라우팅 규칙 | IDDD 방법론 고정 흐름을 훼손 |
| Telemetry / 사용 분석 | 개발자 도구에서 텔레메트리는 반감을 초래 |
| Auto-update 메커니즘 | npm 표준 업데이트 워크플로우(`npm update -g`) 사용 |
| Plugin/확장 시스템 | 현 시점 수요 없음, 불필요한 복잡도 |
| 라우팅 이력 / 세션 메모리 | 프로젝트 상태는 specs 파일에 이미 존재 |
| GUI / 웹 대시보드 | 별도 제품 영역 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INST-01 | Phase 1 | Pending |
| INST-02 | Phase 1 | Pending |
| INST-03 | Phase 1 | Pending |
| INST-04 | Phase 1 | Pending |
| INST-05 | Phase 1 | Pending |
| INST-06 | Phase 1 | Pending |
| ROUT-01 | Phase 2 | Pending |
| ROUT-02 | Phase 2 | Pending |
| ROUT-03 | Phase 2 | Pending |
| ROUT-04 | Phase 2 | Pending |
| ROUT-05 | Phase 2 | Pending |
| ROUT-06 | Phase 2 | Pending |
| ROUT-07 | Phase 2 | Pending |
| ROUT-08 | Phase 2 | Pending |
| ROUT-09 | Phase 2 | Pending |
| ROUT-10 | Phase 2 | Pending |
| CLR-01 | Phase 2 | Pending |
| CLR-02 | Phase 2 | Pending |
| CLR-03 | Phase 2 | Pending |
| UX-01 | Phase 2 | Pending |
| UX-02 | Phase 2 | Pending |
| UX-03 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-04-06*
*Last updated: 2026-04-06 after /id3-init removal, /id3-clear addition, auto-setup integration*

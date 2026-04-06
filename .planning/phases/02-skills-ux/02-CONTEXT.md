# Phase 2: Skills & UX - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

`/id3-start` 스마트 라우터(자동 셋업 + 의도 분석 + 라우팅 + 진행 대시보드)와 `/id3-clear` 프로젝트 초기화를 SKILL.md로 구현한다. 기존 6개 스킬의 내부 로직은 변경하지 않는다.

</domain>

<decisions>
## Implementation Decisions

### Routing Rules
- 현재 프로젝트 상태(specs 파일 존재, YAML 헤더)를 사용자에게 보여주고, 어떤 Phase로 진행할지 사용자가 선택
- 애매한 요청("목록에 필터 추가" 등)은 "UI만 수정인지, 새 데이터가 필요한지" 사용자에게 질문
- 진행 중 전제조건 미충족 발견 시 기존 스킬의 내장 전제조건 체크가 자동으로 안내 (별도 구현 불필요)
- Phase 체계: 0/1(Entities) -> 2(Info Model) -> 2.5(UI Design) -> 3-5(Build), Audit, Preview

### Auto-Setup UX
- IDDD 미설치 프로젝트에서 `/id3-start` 실행 시:
  1. ASCII Art 환영 메시지 출력
  2. `npx id3-cli .` 자동 실행 (사용자 확인 없이)
  3. 대시보드 + 라우팅 안내로 이어짐

### Dashboard Format
- 박스형 Phase 파이프라인 + 프로그레스바 + 안내 메시지 조합:

```
╔═══════════════════════════════════════════════════════════╗
║  IDDD - Information Design-Driven Development            ║
║  Your information model is your harness.                 ║
╚═══════════════════════════════════════════════════════════╝

  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │  Phase 0/1   │───>│   Phase 2    │───>│  Phase 2.5   │───>│  Phase 3-5   │
  │  Entities    │    │  Info Model  │    │  UI Design   │    │    Build     │
  │    ✓  12     │    │   ✓  v1.0    │    │      ◆       │    │      ○       │
  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘

  ──────────────────────────────────────────────────────────────────────────
  ████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  50%
  ──────────────────────────────────────────────────────────────────────────

  > 현재 상태: UI Design 단계 진행 가능
  > 요청: "CRM 시스템 만들고 싶어요"
```

- 안내 메시지는 사용자가 사용하는 언어로 소통
- specs 파일의 YAML 헤더(version, entity_count, rule_count)에서 메타데이터 추출하여 각 Phase 박스에 표시

### Clear Behavior
- IDDD가 생성한 모든 파일/폴더 전부 삭제: specs/, docs/, steering/, hooks/, skills/, .claude/skills/, .codex/skills/, .claude/hooks/, CLAUDE.md, AGENTS.md, .iddd/
- 삭제 전 경고 표시:
  - 전체 삭제 대상 목록
  - 사용자 작성 내용 포함 파일(steering/product.md, steering/data-conventions.md) 별도 경고
  - "이 작업은 되돌릴 수 없습니다" 안내
  - y/N 확인

### Claude's Discretion
- ASCII Art 환영 메시지의 구체적 디자인
- 라우팅 안내 문구의 톤
- 프로그레스바 계산 로직 (Phase별 가중치)
- Clear 후 완료 메시지 형태

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Skill Structure
- `skills-global/id3-start/SKILL.md` - 현재 placeholder, Phase 2에서 full 구현으로 교체
- `skills-global/id3-clear/SKILL.md` - 현재 placeholder, Phase 2에서 full 구현으로 교체

### Existing Skills (routing targets)
- `templates/skills/id3-identify-entities/SKILL.md` - Phase 0/1 라우팅 대상
- `templates/skills/id3-design-information/SKILL.md` - Phase 2 라우팅 대상
- `templates/skills/id3-design-ui/SKILL.md` - Phase 2.5 라우팅 대상, 전제조건 체크 패턴 참조
- `templates/skills/id3-spawn-team/SKILL.md` - Phase 3-5 라우팅 대상
- `templates/skills/id3-info-audit/SKILL.md` - Audit 라우팅 대상
- `templates/skills/id3-preview/SKILL.md` - Preview 라우팅 대상

### Init Logic
- `src/init.ts` - initProject() 함수, 자동 셋업 시 호출 대상
- `src/utils/ascii.ts` - banner(), box() 함수, ASCII Art 활용 가능

### PRD
- `prd/IDDD-SKILL-SPEC-v0.3.md` - 전체 스펙 참조 (Phase 체계, 스킬 트리거 키워드, 전제조건)

### Project Template
- `templates/CLAUDE.md` - IDDD 프로젝트에 복사되는 에이전트 지시 파일

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/utils/ascii.ts`: `banner(version)`, `box(content, options)` - 대시보드 ASCII Art에 활용 가능
- `src/init.ts`: `initProject()`, `printBanner()`, `printSuccess()` - 자동 셋업 시 재사용
- `src/register-skills.ts`: `detectPlatforms()` - 플랫폼 감지 재사용 가능

### Established Patterns
- SKILL.md frontmatter: name, description, user-invocable, allowed-tools
- 기존 스킬들의 전제조건 체크 패턴: specs 파일 존재 + version 헤더 확인
- `$ARGUMENTS` 변수로 사용자 입력 수신

### Integration Points
- `skills-global/id3-start/SKILL.md` - placeholder를 full 구현으로 교체
- `skills-global/id3-clear/SKILL.md` - placeholder를 full 구현으로 교체
- `templates/skills/` 하위 6개 스킬 - 라우팅 대상 (수정하지 않음)

</code_context>

<specifics>
## Specific Ideas

- 대시보드는 박스형 파이프라인 + 프로그레스바 조합 (시안 A+B 합본)
- Clear 경고에서 사용자 작성 파일(steering/product.md 등)을 별도 강조
- 사용자 언어로 소통 (한국어 사용자에겐 한국어, 영어 사용자에겐 영어)

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 02-skills-ux*
*Context gathered: 2026-04-06*

<div align="center">

[English](https://github.com/bruce-jsh/iddd/blob/master/README.md) · **한국어** · [简体中文](https://github.com/bruce-jsh/iddd/blob/master/README.zh-CN.md) · [日本語](https://github.com/bruce-jsh/iddd/blob/master/README.ja-JP.md) · [Türkçe](https://github.com/bruce-jsh/iddd/blob/master/README.tr-TR.md)

</div>

```
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                        ║
║    ██╗██████╗ ██████╗ ██████╗                                                          ║
║    ██║██╔══██╗██╔══██╗██╔══██╗     Information Design-Driven Development               ║
║    ██║██║  ██║██║  ██║██║  ██║                                                         ║
║    ██║██║  ██║██║  ██║██║  ██║     "What information exists?"                          ║
║    ██║██████╔╝██████╔╝██████╔╝      -- always the first question.                      ║
║    ╚═╝╚═════╝ ╚═════╝ ╚═════╝                                    v0.9.2                ║
║                                                                                        ║
║  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -               ║
║                                                                                        ║
║       ┌─────────────────────────┐           ┌─────────────────────────┐                ║
║       │                         │           │                         │                ║
║       │    INFORMATION          │           │    AGENT                │                ║
║       │    MODEL                │──────────>│    HARNESS              │                ║
║       │                         │           │                         │                ║
║       │  - Entity Catalog       │           │  - Hook Enforcement     │                ║
║       │  - Data Model           │           │  - Drift Detection      │                ║
║       │  - Business Rules       │           │  - Auto Audit           │                ║
║       │  - Domain Glossary      │           │  - Version Tracking     │                ║
║       │                         │           │                         │                ║
║       └─────────────────────────┘           └────────────┬────────────┘                ║
║                                                          │                             ║
║                                                          v                             ║
║                                              ┌─────────────────────────┐               ║
║                                              │                         │               ║
║                                              │    AI AGENT             │               ║
║                                              │    (Constrained)        │               ║
║                                              │                         │               ║
║                                              │  Agent = Model          │               ║
║                                              │         + Harness       │               ║
║                                              │                         │               ║
║                                              └─────────────────────────┘               ║
║                                                                                        ║
╚════════════════════════════════════════════════════════════════════════════════════════╝
```

**"어떤 정보가 존재하는가?"에서 시작하세요 -- "어떤 기능을 만들어야 하는가?"가 아닙니다.**

IDDD는 **정보 모델**을 모든 소프트웨어 개발의 중심에 두는 개발 방법론이자 AI 에이전트 스킬 패키지입니다. 기술 선택이 이루어지기 *전에* 엄밀한 Entity 카탈로그, 데이터 모델, 비즈니스 규칙, 도메인 용어집을 먼저 구축함으로써, IDDD는 논리 모델 단계에서 애플리케이션 동작의 80%가 이미 정의되도록 보장합니다. 이후 정보 모델은 요구사항, API 계약, 화면 설계, 유효성 검사 규칙이 체계적으로 도출되는 생성 중심(generative center)이 됩니다.

이 패키지는 IDDD를 AI 에이전트 스킬, Harness Hook, 문서 템플릿 세트로 설치하여, 코딩 에이전트가 전체 개발 생명주기에 걸쳐 정보 우선(information-first) 원칙을 강제하도록 합니다.

---

## IDDD란 무엇인가?

대부분의 소프트웨어 프로젝트는 *"어떤 기능을 만들어야 하는가?"*라는 질문으로 시작하여 곧바로 구현에 착수합니다. IDDD는 이를 뒤집습니다. **"이 도메인에 어떤 정보가 존재하는가?"**에서 시작하며, 정보 모델을 명세의 한 섹션이 아니라 다른 모든 개발 산출물이 도출되는 **단일 진실 공급원(single source of truth)**으로 취급합니다.

### 핵심 원칙

1. **정보 모델이 생성 중심이다.** 모든 코드, API, UI, 테스트는 Entity 카탈로그와 데이터 모델에서 도출됩니다. 코드가 명세와 불일치하면, 명세가 우선합니다.
2. **Entity 우선 식별.** 코드를 작성하기 전에 Entity를 식별하고 문서화해야 합니다. 새로운 기능은 "어떤 엔드포인트가 필요한가?"가 아닌 "어떤 Entity가 관련되는가?"에서 시작합니다.
3. **데이터 모델 추적성.** 코드베이스의 모든 컬럼, 제약 조건, Relationship은 Entity 카탈로그의 항목으로 추적 가능해야 합니다. 추적되지 않는 스키마 요소는 드리프트(drift)로 간주됩니다.
4. **출력 우선 설계.** 입력(폼, API)을 설계하기 전에 사용자가 *보는 것*(대시보드, 보고서, 목록)을 먼저 설계합니다. 출력 이미지가 정보 모델을 주도합니다.
5. **비즈니스 규칙은 명시적이다.** 모든 유효성 검사, 제약 조건, 도출 규칙은 BR-xxx 식별자로 등록됩니다. 코드에만 존재하는 규칙은 부채(debt)로 간주됩니다.

### 3단계 데이터 모델링과 소프트웨어 개발의 매핑

IDDD는 전통적인 3단계 데이터 모델링 프로세스를 소프트웨어 개발 단계에 직접 매핑합니다:

```
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Conceptual Model                         │         │  Requirements / Scope Definition          │
│  "What information exists?"               │────────>│  Entity identification, user stories      │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
                    │
                    v
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Logical Model                            │         │  API Contracts / Validation / Biz Logic   │
│  "How is it structured?"                  │────────>│  80% of behavior defined here             │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
                    │
                    v
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Physical Model                           │         │  Implementation Decisions                 │
│  "How is it stored/executed?"             │────────>│  Technology choices, storage, deployment  │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
```

정보 모델의 각 요소는 자동으로 개발 산출물을 함의합니다:

| 정보 모델 요소               | 도출되는 산출물                                       |
|------------------------------|-------------------------------------------------------|
| Entity 식별                  | 요구사항 범위, 사용자 스토리                          |
| Relationship & Cardinality   | API 엔드포인트 구조, 네비게이션                       |
| Attribute & 데이터 타입      | 폼 필드, 유효성 검사 규칙, DTO                        |
| 제약 조건                    | 입력 유효성 검사, 타입 정의                           |
| 파생 Attribute               | 비즈니스 로직, 계산 규칙                              |
| 상태 전이                    | 워크플로우, 상태 관리                                 |
| 집계 / 관계 규칙             | 트랜잭션 경계, 일관성 규칙                            |

**논리 모델이 완성되면, 기술 선택이 이루어지기 전에 애플리케이션 동작의 80%가 이미 정의됩니다.**

---

## 지원 플랫폼

| 플랫폼       | 에이전트 시스템        | 멀티 에이전트 전략                                   |
|--------------|------------------------|------------------------------------------------------|
| Claude Code  | Claude Agent Teams     | 피어 메시징, 독립 워크트리                           |
| OpenAI Codex | Codex Agents SDK       | MCP Server를 통한 핸드오프 패턴                       |

---

## 사전 요구사항

| 요구사항       | 상세                                                 |
|----------------|------------------------------------------------------|
| Node.js        | **18+** (npm 또는 호환 패키지 매니저 포함)           |
| Claude Code    | **Claude Max** 멤버십 + Agent Teams 활성화           |
| OpenAI Codex   | **ChatGPT Plus** 이상 (Pro/Business/Enterprise)      |

`npx` 설치 프로그램을 위해 Node.js가 필요합니다. 사용하는 플랫폼에 따라 해당 AI 플랫폼 구독이 필요합니다.

---

## 설치

```bash
npx id3-cli@latest
```

별도의 하위 명령어가 필요 없습니다 -- `id3-cli`가 초기화 프로세스를 직접 실행합니다. 다음을 수행합니다:

1. 모든 IDDD 템플릿(명세, 문서, 스티어링, 스킬, Hook)을 프로젝트에 복사합니다.
2. 플랫폼별 심볼릭 링크(`.claude/skills/` 또는 `.agents/skills/`)를 정규 `skills/` 원본을 가리키도록 생성합니다.
3. 플랫폼의 설정 파일에 Harness Hook을 등록합니다.
4. `.iddd/` 상태 디렉터리(커밋 카운터, 프리뷰 출력)를 초기화합니다.

### 옵션

| 옵션            | 설명                                                     |
|-----------------|----------------------------------------------------------|
| `[target-dir]`  | 대상 디렉터리 (기본값: 현재 디렉터리 `.`)                |
| `--no-symlink`  | 심볼릭 링크 대신 스킬 파일 복사 (Windows에서 유용)       |
| `--platform`    | 플랫폼 강제 지정: `claude`, `codex`, 또는 `all`          |

### 덮어쓰기 감지

대상 디렉터리에 `CLAUDE.md`가 이미 존재하면, `id3-cli`가 다음과 같이 묻습니다:

```
"IDDD appears to be already installed. Overwrite? (y/N)"
```

### 설치 후 출력

```
┌── IDDD installed ─────────────────────────────────────────┐
│                                                           │
│  Next steps:                                              │
│                                                           │
│    1. Fill in steering/product.md                         │
│    2. Run /id3-identify-entities to start                  │
│    3. Customize steering/data-conventions.md              │
│                                                           │
│  Skills:                                                  │
│    ├── id3-identify-entities   (Phase 0/1)                │
│    ├── id3-design-information  (Phase 2)                  │
│    ├── id3-design-ui           (Phase 2.5)                │
│    ├── id3-spawn-team          (Phase 3-5)                │
│    ├── id3-info-audit          (Audit)                    │
│    └── id3-preview             (Visual Preview)           │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## 설치 후 디렉터리 구조

`npx id3-cli@latest` 실행 후, 프로젝트에 다음 구조가 추가됩니다:

```
your-project/
│
│   ===== 공통 (모든 플랫폼) =====
│
├── skills/                          스킬 원본 (단일 진실 공급원)
│   ├── id3-identify-entities/       Phase 0/1: Entity 식별
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   기존 코드에서 역추출
│   │       └── phase1-greenfield.md   새 프로젝트를 위한 구조화 인터뷰
│   ├── id3-design-information/      Phase 2: 정보 구조화
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── phase2-procedure.md    정제 절차
│   ├── id3-design-ui/               Phase 2.5: UI 설계 & 구현
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── step1-structure-derivation.md
│   │       ├── step2-visual-contract.md
│   │       ├── step3-gate-and-mockup.md
│   │       └── step4-implementation.md
│   ├── id3-spawn-team/              멀티 에이전트 구현 디스패치
│   ├── id3-info-audit/              엔트로피 감사 (드리프트 감지)
│   └── id3-preview/                 정보 모델 시각적 프리뷰
│
├── specs/                           정보 모델 산출물
│   ├── entity-catalog.md              Entity 목록 + 요약 테이블
│   ├── data-model.md                  Mermaid ERD + 설계 결정사항
│   ├── ui-inventory.md                화면 목록 + 매핑 매트릭스
│   ├── ui-structure.md                화면 목록 + 네비게이션 (Phase 2.5)
│   └── ui-design-contract.md          디자인 토큰 + 컴포넌트 매핑 (Phase 2.5)
│
├── docs/                            지원 문서
│   ├── business-rules.md              BR-xxx 색인된 비즈니스 규칙
│   ├── domain-glossary.md             용어 / 영문명 / 정의 / 비고
│   ├── info-debt.md                   불일치 추적기
│   └── model-changelog.md            Keep a Changelog 형식
│
├── steering/                        프로젝트 수준 규약
│   ├── product.md                     제품 비전 & 범위 (사용자 작성)
│   └── data-conventions.md            PK 전략, 네이밍, 타임스탬프 등
│
├── hooks/                           Harness Hook 스크립트 (빌드된 JS 번들)
│   ├── iddd-schema-drift.js           스키마 드리프트 감지
│   ├── iddd-rule-check.js             비즈니스 규칙 추적
│   ├── iddd-auto-audit.js             자동 엔트로피 감사
│   ├── pre-commit                     Git Hook (schema-drift + rule-check)
│   └── post-commit                    Git Hook (auto-audit)
│
├── .iddd/                           IDDD 내부 상태
│   ├── commit-count                   auto-audit 간격 카운터
│   └── preview/                       생성된 프리뷰 HTML
│
│   ===== 플랫폼: Claude Code =====
│
├── CLAUDE.md                        리드 에이전트 컨텍스트 문서
├── .claude/
│   ├── settings.local.json            Hook 등록 (init에 의해 주입)
│   ├── skills/ -> skills/             skills/ 원본에 대한 심볼릭 링크
│   └── hooks/
│       └── hook-config.json           IDDD Hook 설정
│
│   ===== 플랫폼: OpenAI Codex =====
│
├── AGENTS.md                        크로스 플랫폼 에이전트 지침
├── .agents/
│   └── skills/ -> skills/             skills/ 원본에 대한 심볼릭 링크
└── .codex/
    └── hooks.json                     Codex Hook 설정
```

### 스킬 파일 공유 전략

스킬 콘텐츠는 단일 정규 위치(`skills/`)에서 유지됩니다. 플랫폼별 경로(`.claude/skills/`, `.agents/skills/`)는 `init` CLI가 동적으로 생성하는 심볼릭 링크입니다. 이를 통해 모든 플랫폼에 걸쳐 단일 유지보수 지점을 확보합니다. Windows에서는 `--no-symlink`를 사용하여 복사본을 생성하세요.

---

## 워크플로우

```
╔══════════════════════════════════════════════════════════════════════════╗
║                          IDDD WORKFLOW OVERVIEW                          ║
╚══════════════════════════════════════════════════════════════════════════╝

  ┌──────────────┐                  ┌──────────────┐
  │              │<--- dialog ----->│              │
  │     User     │                  │  Lead Agent  │
  │              │                  │              │
  └──────────────┘                  └──────┬───────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        │                                     │
                        v                                     v
             ┌────────────────────┐          ┌────────────────────┐
             │  Existing code?    │          │  No existing code? │
             └─────────┬──────────┘          └─────────┬──────────┘
                       │                               │
                       v                               v
  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
  │  Phase 0: Reverse-Extract        │  │  Phase 1: Structured Interview   │
  │                                  │  │                                  │
  │  - Scan ORM / schema files       │  │  "What information does          │
  │  - Extract entities              │  │   your domain manage?"           │
  │  - Extract relationships         │  │  - Identify core entities        │
  │  - Verification Interview        │  │  - Discover relationships        │
  └────────────────┬─────────────────┘  └────────────────┬─────────────────┘
                   │                                     │
                   v                                     v
          ┌─────────────────────────────────────────────────────┐
          │              Entity Catalog Produced                │
          └─────────────────────────┬───────────────────────────┘
                                    │
                                    v
  ┌────────────────────────────────────────────────────────────────────┐
  │  Phase 2: Information Design                                       │
  │                                                                    │
  │  - Conceptual --> Logical model                                    │
  │  - Derive business rules (BR-xxx)                                  │
  │  - Register hooks + version headers                                │
  └─────────────────────────────────┬──────────────────────────────────┘
                                    │
                                    v
  ┌────────────────────────────────────────────────────────────────────┐
  │  Phase 2.5: UI Design (id3-design-ui)                              │
  │                                                                    │
  │  - Entity --> Screen auto-derivation                               │
  │  - Visual design contract (tokens, components)                     │
  │  - 7-Pillar gate + 3-level mockup preview                         │
  │  - Agent Teams implementation + post-audit                        │
  └─────────────────────────────────┬──────────────────────────────────┘
                                    │
                                    v
          ┌─────────────────────────────────────────────────────┐
          │              /id3-spawn-team                        │
          └─────────────────────────┬───────────────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     v                             v
  ┌────────────────────────────────┐  ┌────────────────────────────────┐
  │  Claude Code: Agent Teams      │  │  Codex: Agents SDK             │
  │                                │  │                                │
  │  ┌────────┐ ┌──────┐ ┌────┐    │  │  ┌──────────────────────────┐  │
  │  │  spec  │ │ impl │ │ qa │    │  │  │  Handoff Pattern         │  │
  │  └───┬────┘ └──┬───┘ └─┬──┘    │  │  │  via MCP Server          │  │
  │      │         │       │       │  │  └──────────────────────────┘  │
  │      └── messaging ────┘       │  │                                │
  │         (peer-to-peer)         │  │  spec -> impl -> qa            │
  │                                │  │  (sequential handoff)          │
  └────────────────────────────────┘  └────────────────────────────────┘
```

### Phase별 안내

**Phase 0/1 -- Entity 식별:**
AI 코딩 에이전트를 열고 `/id3-identify-entities`를 실행하세요. 에이전트가 기존 코드베이스가 있는지(브라운필드) 새로 시작하는지(그린필드)를 자동으로 감지한 후, 적절한 식별 플로우를 실행합니다.

**Phase 2 -- 정보 설계:**
`/id3-design-information`을 실행하세요. 에이전트가 개념 모델을 논리 모델로 정제하고, 비즈니스 규칙을 도출하며, 버전 헤더와 Hook 설정을 구성합니다.

**Phase 2.5 -- UI 설계:**
`/id3-design-ui`를 실행하세요. 에이전트가 Entity 카탈로그에서 화면 구조를 도출하고, 디자인 토큰으로 시각적 디자인 계약을 수립하며, 인터랙티브 목업 프리뷰와 함께 7-Pillar 품질 게이트를 실행한 후, Agent Teams를 생성하여 화면을 병렬 구현하고 사후 감사를 수행합니다.

**Phase 3-5 -- Agent Teams를 통한 구현:**
`/id3-spawn-team`을 실행하세요. 에이전트가 확정된 정보 모델을 읽고 전문 에이전트 팀(spec-generator, implementer, qa-reviewer)을 생성하여 시스템을 병렬로 구현합니다.

---

## 스킬

### id3-identify-entities (Phase 0/1)

IDDD 워크플로우의 진입점입니다. 이 스킬은 브라운필드와 그린필드 경로를 **자동으로 분기**합니다.

**트리거 키워드:** `identify entities`, `information analysis`, `domain analysis`, `new project`, `entity identification`

**자동 감지 로직:** 스킬은 프로젝트 루트에서 ORM/스키마 파일(Prisma, Drizzle, Django models, TypeORM entities, SQL migrations, Sequelize configs)을 스캔합니다. 발견되면 Phase 0으로 진입하고, 그렇지 않으면 Phase 1로 진입합니다.

#### Phase 0: 브라운필드 -- 정보 모델 역추출

기존 코드베이스의 경우, 에이전트가 4개 레이어에서 암묵적 정보 모델을 체계적으로 추출합니다:

| 레이어 | 소스             | 조사 대상                                              | 신뢰도    |
|--------|------------------|--------------------------------------------------------|-----------|
| L1     | DB 스키마        | 테이블, 컬럼, FK, 인덱스, 제약 조건                    | 최고      |
| L2     | ORM / 모델       | 가상 필드, 파생 Attribute, 소프트 삭제, 상태            | 높음      |
| L3     | API 계약         | 엔드포인트, DTO, 유효성 검사 로직                      | 중간      |
| L4     | 프론트엔드       | 라우트, 컴포넌트, 폼 필드                              | 참고      |

L4 조사는 철저합니다: 파일 기반 라우팅(Next.js `app/`, `pages/`), React Router, Vue Router 등을 스캔하여 화면-Entity 매핑 매트릭스가 포함된 완전한 UI 인벤토리(`specs/ui-inventory.md`)를 구축합니다.

발견 사항은 **일치**(레이어 간 일관성 있음), **불일치**(`docs/info-debt.md`에 기록), **암묵적**(코드 로직에 숨겨져 있던 것을 명시적 비즈니스 규칙으로 도출)으로 분류됩니다.

추출 후, **검증 인터뷰**를 통해 사용자와 정확성을 확인합니다.

**생성되는 산출물:** `specs/entity-catalog.md`, `specs/data-model.md`, `specs/ui-inventory.md`, `docs/business-rules.md`, `docs/info-debt.md`

#### Phase 1: 그린필드 -- 구조화 인터뷰

새 프로젝트의 경우, 에이전트가 도메인 정보를 발견하기 위한 구조화 인터뷰를 수행합니다:

1. **정보 식별** -- "이 시스템이 관리하는 핵심 '사물'(명사)은 무엇입니까?"
2. **Relationship 발견** -- "이것들은 어떻게 관련됩니까? 일대다입니까, 다대다입니까?"
3. **규칙 발견** -- "어떤 규칙이 강제되어야 합니까? 상태 전이가 있습니까?"
4. **Silverston 범용 패턴 체크리스트** -- 에이전트가 발견된 Entity를 검증된 패턴과 대조합니다: Party, Product/Service, Order/Transaction, Classification, Status/Lifecycle, Hierarchy, Contact Mechanism, Document/Content.

**생성되는 산출물:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-information (Phase 2)

개념 모델을 **논리 모델**로 정제합니다. 비즈니스 규칙, 유효성 제약 조건, 도출 규칙이 정보 모델에서 자동으로 도출됩니다.

**트리거 키워드:** `design information`, `refine model`, `logical model`, `schema design`, `information structuring`

**전제 조건:** `specs/entity-catalog.md`에 최소 2개의 식별된 Entity가 존재해야 합니다.

**절차:**

1. **Attribute 정제** -- 구체적인 데이터 타입(UUID, TEXT, INTEGER, TIMESTAMP, JSONB 등), NOT NULL / DEFAULT / UNIQUE 제약 조건, 인덱스 요구사항을 할당합니다.
2. **Relationship 구체화** -- FK 배치, 삭제/갱신 규칙(CASCADE, SET NULL, RESTRICT)을 결정하고, 다대다 Relationship을 위한 연결 테이블을 식별합니다.
3. **자동 비즈니스 규칙 도출:**
   - NOT NULL 제약 조건 --> "이 필드는 필수입니다" (BR-xxx)
   - UNIQUE 제약 조건 --> "중복이 허용되지 않습니다" (BR-xxx)
   - FK + CASCADE --> "부모를 삭제하면 자식도 삭제됩니다" (BR-xxx)
   - 상태 전이 --> "허용되는 전이 경로" (BR-xxx)
   - 파생 Attribute --> "계산 규칙" (BR-xxx)
4. **설계 결정 질문** -- 에이전트가 대용량 데이터 저장 전략, 소프트 삭제 범위, 멀티 테넌시, 감사 추적 필요성 등에 대해 사용자에게 질문합니다.
5. **산출물 확정** -- 모든 명세 파일을 버전 헤더와 Hook 설정으로 업데이트합니다.

**갱신되는 산출물:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-ui (Phase 2.5)

정보 모델에서 UI 구조와 시각적 디자인을 도출한 후, Agent Teams를 사용하여 화면을 구현합니다.

**트리거 키워드:** `design ui`, `ui design`, `screen design`, `phase 2.5`, `ui structure`

**전제 조건:** Phase 2 완료 (`entity-catalog.md` version >= `"1.0"`).

**4단계 파이프라인:**

1. **UI 구조 도출** -- 9개의 도출 규칙(entity -> list/detail/form/dashboard)을 사용하여 Entity를 화면에 자동 매핑합니다. 12개의 타입 기반 규칙으로 Attribute를 Widget에 매핑합니다. "출력 우선, 입력 후순위" 원칙을 적용합니다.
2. **시각적 디자인 계약** -- 기존 프론트엔드 프레임워크(React, Vue, Svelte 등)와 UI 라이브러리를 감지합니다. 5개 디자인 토큰 영역(spacing, typography, color, copywriting, component registry)을 수립합니다.
3. **구현 전 게이트** -- 7-Pillar 검증(구조 완전성, spacing, typography, color, copywriting, component registry, traceability)을 실행합니다. 샘플 데이터로 3단계 HTML 목업(wireframe, styled, interactive)을 생성합니다.
4. **구현 + 사후 감사** -- Agent Teams를 생성하여 화면을 병렬 구현합니다. 구현 후 시각적 감사가 각 Pillar를 1-4로 점수화하고 상위 3개 수정 사항을 도출합니다.

**산출물:** `specs/ui-structure.md`, `specs/ui-design-contract.md`, `.iddd/preview/mockup-*.html`, `.iddd/preview/ui-audit.html`

---

### id3-spawn-team (Phase 3-5)

확정된 정보 모델을 기반으로 시스템을 구현할 전문 에이전트 팀을 생성합니다.

**전제 조건:** `specs/entity-catalog.md`와 `specs/data-model.md`가 존재하고 Phase 2가 완료되어야 합니다.

#### Claude Code: Agent Teams

세 명의 팀원이 생성되며, 각각 독립적인 컨텍스트 윈도우와 독립적인 Git 워크트리를 갖습니다:

| 팀원             | 역할                                                          |
|------------------|---------------------------------------------------------------|
| spec-generator   | 정보 모델을 requirements.md와 api-contracts.md로 변환         |
| implementer      | 명세로부터 코드를 빌드, Entity당 하나의 원자적 커밋           |
| qa-reviewer      | 정보 모델 대비 구현을 검증; 실패 시 implementer에게 직접 메시지 전송 |

**작업 생성 규칙:**
- Entity 카탈로그를 읽어 Entity별로 하나의 작업을 생성합니다 (모델 + 마이그레이션 + API + 유효성 검사 + 테스트).
- 데이터 모델의 FK 의존성이 의존성 그래프를 결정합니다.
- 독립적인 Entity는 병렬로 실행되고, 의존적인 Entity는 부모를 기다립니다.

#### OpenAI Codex: Agents SDK + 핸드오프 패턴

Codex에서는 멀티 에이전트 작업이 Agents SDK 핸드오프 패턴을 사용합니다. Codex는 MCP Server(`codex --mcp-server`)로 시작되며, 프로젝트 매니저 에이전트가 Entity 카탈로그를 읽어 동일한 세 역할(spec-generator, implementer, qa-reviewer)에 핸드오프를 통해 작업을 분배합니다.

---

### id3-info-audit

정보 모델 대비 코드베이스를 감사하여 드리프트와 엔트로피를 감지합니다.

**트리거 키워드:** `info audit`, `information audit`, `model audit`, `drift check`

**절차:**

1. `specs/entity-catalog.md`에서 Entity 목록을 읽습니다.
2. 코드베이스에서 다음을 스캔합니다:
   - 미구현 Entity / 미정의 모델
   - `docs/business-rules.md`의 비즈니스 규칙이 코드에 반영되지 않은 경우
   - 데이터 타입 / 제약 조건 불일치
3. `specs/ui-structure.md`와 `specs/ui-design-contract.md` 대비 UI 일관성을 확인합니다:
   - 미구현 화면 / 미정의 화면
   - 폼 필드 대 Attribute 매핑 불일치
   - 누락된 네비게이션 경로
4. 버전 헤더(`last_verified`, `audit_status`)를 갱신합니다.
5. Hook 우회 이력(`.iddd/skip-history.log`)을 확인합니다.
6. Entity별 상태 보고서를 시각적 지표와 함께 출력합니다.

**시각적 출력:** 감사 결과는 `.iddd/preview/audit-{date}.html`에 인터랙티브 HTML 대시보드로 렌더링됩니다.

---

### id3-preview

정보 모델과 감사 결과를 브라우저에서 볼 수 있도록 경량 로컬 HTTP 서버를 시작합니다.

**트리거 키워드:** `preview`, `show erd`, `show model`, `visual preview`

서버는 `listen(0)` (OS 할당 포트)을 사용하며 다음을 제공합니다:
- **ERD 프리뷰** -- Entity 클릭 시 카탈로그 상세로 이동하는 인터랙티브 Mermaid ERD
- **UI 목업** -- `specs/ui-structure.md`와 `specs/ui-design-contract.md`에서 도출된 와이어프레임 레이아웃
- **감사 대시보드** -- 비즈니스 규칙 커버리지가 포함된 Entity별 상태 카드

모든 HTML 파일은 `.iddd/preview/`에 유지되며, 서버 없이도 브라우저에서 직접 열 수 있습니다.

---

## Harness Hook 시스템

IDDD는 자동화된 Hook을 통해 정보 우선 원칙을 강제합니다. 철학은 "프로세스를 따라주세요"가 아니라 **"따르지 않으면 커밋이 차단됩니다."**입니다.

### Hook 개요

| Hook           | 트리거           | 동작                                                | 심각도     |
|----------------|------------------|-----------------------------------------------------|------------|
| schema-drift   | pre-commit       | 스키마 변경이 entity-catalog.md와 일치하는지 검증    | **BLOCK** (커밋 거부) |
| rule-check     | pre-commit       | 새 유효성 검사 로직이 business-rules.md에 있는지 확인 | **WARN** (커밋 허용, 메시지 표시) |
| auto-audit     | post-commit      | N번 커밋마다 info-audit 실행                         | **INFO** (보고서 생성) |

### schema-drift (BLOCK)

스키마 관련 파일(Prisma, Drizzle, Django models, TypeORM entities, SQL migrations 등)을 수정할 때, Hook이 `specs/entity-catalog.md`도 함께 업데이트되었는지 확인합니다. 업데이트되지 않았으면 커밋이 **거부**됩니다. 정보 모델은 항상 코드*보다 먼저* 업데이트되어야 합니다.

**모니터링 파일 패턴** (설정 가능):
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check (WARN)

유효성 검사 로직(Zod, Yup, Joi, Pydantic 등)을 추가하거나 수정할 때, Hook이 `docs/business-rules.md`에 대응하는 `BR-xxx` 항목이 있는지 확인합니다. 없으면 경고가 발생합니다. 커밋은 진행되지만, 누락된 규칙이 표시됩니다.

**모니터링 파일 패턴** (설정 가능):
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit (INFO)

N번 커밋마다 (기본값: 10, 설정 가능), Harness가 코드베이스를 정보 모델과 비교하는 info-audit을 자동으로 실행합니다. 커밋 카운터는 `.iddd/commit-count`에 저장됩니다. 결과는 `.iddd/preview/audit-{date}.html`에 기록됩니다.

### Hook 설정

모든 Hook 설정은 `.claude/hooks/hook-config.json` (Claude Code) 또는 `.codex/hooks.json` (Codex)에 있습니다.

```json
{
  "enabled": true,
  "hooks": {
    "pre-commit": {
      "schema-drift": {
        "enabled": true,
        "severity": "block",
        "monitored_patterns": [
          "prisma/schema.prisma",
          "drizzle/**/*.ts",
          "**/migrations/*.sql",
          "**/models.py",
          "**/entities/*.ts",
          "**/entities/*.java"
        ]
      },
      "rule-check": {
        "enabled": true,
        "severity": "warn",
        "validation_patterns": [
          "*.schema.ts",
          "*.validator.*",
          "**/validators/**"
        ]
      }
    },
    "post-commit": {
      "auto-audit": {
        "enabled": true,
        "interval_commits": 10
      }
    }
  }
}
```

모든 IDDD Hook을 비활성화하려면 최상위의 `"enabled"`를 `false`로 설정하세요. 개별 Hook을 비활성화하려면 해당 Hook의 `"enabled"`를 `false`로 설정하세요. auto-audit 빈도를 변경하려면 `"interval_commits"`를 조정하세요.

### Hook 우회

`IDDD_SKIP_HOOKS=1`을 설정하면 모든 Hook을 일시적으로 건너뜁니다. 우회 기록은 `.iddd/skip-history.log`에 남으며, 감사 시 검토됩니다.

---

## 엔트로피 관리

시간이 지나면 정보 모델과 코드가 괴리됩니다. IDDD는 세 가지 메커니즘으로 엔트로피에 대응합니다:

### 버전 헤더

`specs/entity-catalog.md`와 `specs/data-model.md`에는 모델 상태를 추적하는 YAML 프론트매터가 포함되어 있습니다:

```yaml
---
version: "1.0"
last_verified: "2026-04-05"
phase: "Phase 2 Complete"
entity_count: 12
rule_count: 19
audit_status: "clean"
---
```

**규칙:**
- `version`은 각 Phase 완료 시 증가합니다 (Phase 1: `"0.1"`, Phase 2: `"1.0"`, 이후: `"1.1"`, `"1.2"`, ...).
- `last_verified`는 모델이 감사되거나 검증될 때마다 갱신됩니다.
- `last_verified`가 **7일 이상 경과**하면, 에이전트가 새 작업을 진행하기 전에 `/id3-info-audit` 실행을 권유합니다. 오래된 모델은 드리프트를 유발합니다.

### 변경 로그

모든 모델 변경은 [Keep a Changelog](https://keepachangelog.com/) 형식으로 `docs/model-changelog.md`에 기록됩니다:

```markdown
## [1.0] -- 2026-04-05
### Phase 2 Complete
- 12 entities finalized in logical model
- 19 business rules derived
- Design decisions: D-01 (S3 separation), D-02 (multi-tenant reservation), D-03 (soft delete scope)
- UI proposals: 6 screens generated
```

### 자동 감사

`auto-audit` Hook(post-commit)은 N번 커밋마다 전체 정보 감사를 실행하여, 드리프트가 누적되기 전에 포착합니다.

---

## 커스터마이징 가이드

IDDD는 프로젝트의 규약에 맞게 적응할 수 있도록 설계되었습니다. 커스터마이징 항목과 편집할 파일은 다음과 같습니다:

| 커스터마이징 항목                                    | 편집할 파일                          |
|------------------------------------------------------|--------------------------------------|
| 제품 비전 & 범위                                     | `steering/product.md`                |
| 네이밍 규약, PK 전략, 타임스탬프, 소프트 삭제 정책, ENUM vs 참조 테이블 | `steering/data-conventions.md` |
| Entity 정의                                          | `specs/entity-catalog.md`            |
| 데이터 모델 (ERD)                                    | `specs/data-model.md`                |
| 비즈니스 규칙                                        | `docs/business-rules.md`             |
| 도메인 용어집                                        | `docs/domain-glossary.md`            |
| UI 화면 인벤토리                                     | `specs/ui-inventory.md`              |
| UI 구조 (화면 도출)                                  | `specs/ui-structure.md`              |
| UI 디자인 계약 (토큰, 컴포넌트)                      | `specs/ui-design-contract.md`        |
| Hook 동작 (활성화/비활성화, 심각도)                  | `.claude/hooks/hook-config.json`     |
| Hook 모니터링 파일 패턴                              | `.claude/hooks/hook-config.json`     |
| auto-audit 커밋 간격                                 | `.claude/hooks/hook-config.json`     |
| Codex Hook 설정                                      | `.codex/hooks.json`                  |

**팁:** 모든 `specs/`와 `docs/` 파일은 버전 헤더가 포함된 YAML 프론트매터를 사용합니다. IDDD Harness는 이 버전을 추적하여 엔트로피 드리프트를 감지합니다. 명세 파일을 수정할 때는 항상 버전 헤더를 업데이트하세요.

---

## 사용 예시

### 예시 1: 새 프로젝트 시작 (그린필드)

```
$ mkdir my-saas && cd my-saas && git init
$ npx id3-cli@latest

  IDDD installed. Next: fill in steering/product.md

$ claude
> /id3-identify-entities

  Agent: "What core 'things' does your system manage?"
  You: "Users, Organizations, Subscriptions, Invoices, and Features."
  Agent: "How are Users related to Organizations?"
  You: "Many-to-many through a Membership entity with a role attribute."
  ...

  Entity catalog produced: specs/entity-catalog.md (5 entities, 7 relationships)

> /id3-design-information

  Agent refines attributes, derives 14 business rules.
  specs/entity-catalog.md updated (version: 1.0)
  docs/business-rules.md updated (BR-001 through BR-014)

> /id3-design-ui

  Step 1: Deriving UI structure from 5 entities... 8 screens mapped
  Step 2: Design contract established (React + Tailwind detected)
  Step 3: 7-Pillar gate passed. Mockup preview: http://localhost:52341
  Step 4: Spawning Agent Teams for screen implementation...
  Post-audit: all 7 pillars scored 3+/4

  specs/ui-structure.md generated
  specs/ui-design-contract.md generated

> /id3-spawn-team

  Spawning Agent Teams:
  - spec-generator: generating requirements.md, api-contracts.md
  - implementer: building User -> Organization -> Membership -> ...
  - qa-reviewer: verifying against information model
```

### 예시 2: 기존 프로젝트에 적용 (브라운필드)

```
$ cd existing-django-project
$ npx id3-cli@latest

  Detected: Django models (models.py), PostgreSQL migrations
  IDDD installed.

$ claude
> /id3-identify-entities

  Phase 0 (Brownfield) activated.
  Scanning L1 (DB schema)... 23 tables found
  Scanning L2 (Django models)... 19 models found
  Scanning L3 (API contracts)... DRF serializers analyzed
  Scanning L4 (Frontend)... React routes mapped

  Discrepancies found:
  - 4 tables have no corresponding Django model (logged in info-debt.md)
  - 3 implicit business rules surfaced from view logic

  Agent: "Does this information model accurately reflect your codebase?"
  You: "Yes, but the legacy_audit table is deprecated -- remove it."

  Entity catalog produced: 19 entities, 11 info-debt items

> /id3-design-information

  Refining existing model...
  New business rules derived from Django validators: BR-015 through BR-023

> /id3-design-ui

  Step 1: Deriving UI structure... comparing with existing ui-inventory.md
  Change summary: 2 new screens proposed, 3 existing screens updated
  Step 2-4: Design contract, gate, and implementation...
```

---

## 지적 계보

IDDD는 여러 지적 전통의 아이디어를 종합합니다:

- **Peter Chen의 ER Model (1976)** -- "현실 세계는 Entity와 Relationship으로 구성된다." 정보 구조가 애플리케이션 로직에 선행한다는 근본적 통찰.
- **Len Silverston의 Universal Data Models** -- 발견된 Entity를 검증하는 체크리스트 역할을 하는 재사용 가능한 정보 패턴(Party, Product, Order, Hierarchy).
- **Eric Evans의 Domain-Driven Design (2003)** -- Bounded Context, Ubiquitous Language, Aggregate 패턴. IDDD는 도메인 언어와 명시적 경계에 대한 강조를 계승합니다.
- **Sophia Prater의 OOUX (Object-Oriented UX)** -- "인터랙션보다 객체를 먼저 설계하라." ORCA 프레임워크(Objects, Relationships, CTAs, Attributes)가 IDDD의 출력 우선 UI 도출에 직접 영향을 미칩니다.
- **Jamie Lord의 "Data First, Code Second" (2024)** -- "지식을 데이터에 접어 넣어라." Unix 표현 규칙을 현대 소프트웨어 개발에 적용.
- **Mitchell Hashimoto의 Harness Engineering (2026)** -- `Agent = Model + Harness`. AI 에이전트가 시간이 지나도 효과적으로 유지되려면 아키텍처적 제약, 컨텍스트 엔지니어링, 엔트로피 관리가 필요하다는 통찰. IDDD의 Hook 시스템, 버전 헤더, auto-audit은 Harness Engineering 원칙의 직접적 적용입니다.

**핵심 통찰:** *논리 모델이 완성되면, 기술 선택이 이루어지기 전에 애플리케이션 동작의 80%가 이미 정의됩니다. 그리고 그 정보 모델 자체가 AI 에이전트를 위한 최고의 Harness입니다.*

---

## 라이선스

MIT

---

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│    "What information exists?" -- always the first question.      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

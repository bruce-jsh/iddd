<div align="center">

[English](https://github.com/bruce-jsh/iddd/blob/master/README.md) · [한국어](https://github.com/bruce-jsh/iddd/blob/master/README.ko-KR.md) · **简体中文** · [日本語](https://github.com/bruce-jsh/iddd/blob/master/README.ja-JP.md) · [Türkçe](https://github.com/bruce-jsh/iddd/blob/master/README.tr-TR.md)

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

**从"存在哪些信息？"开始——而不是"我们应该构建哪些功能？"**

IDDD 是一种开发方法论和 AI 代理技能包，将**信息模型**置于所有软件开发的核心。通过在做出任何技术选择*之前*构建严谨的 Entity 目录、数据模型、业务规则和领域术语表，IDDD 确保在逻辑模型阶段就已经定义了 80% 的应用行为。信息模型随后成为生成中心，需求、API 契约、界面设计和验证规则都从中系统性地派生出来。

本包将 IDDD 安装为一组 AI 代理技能、Harness Hook 和文档模板，使你的编码代理在整个开发生命周期中贯彻信息优先的原则。

---

## 什么是 IDDD？

大多数软件项目从*"我们应该构建哪些功能？"*开始，直接跳入实现阶段。IDDD 反转了这一过程。它从**"这个领域中存在哪些信息？"**出发，将信息模型不是当作规格说明的一个章节，而是当作**唯一事实来源**，所有其他开发产物都从中派生。

### 核心原则

1. **信息模型是生成中心。** 所有代码、API、UI 和测试都派生自 Entity 目录和数据模型。如果代码与规格说明不一致，以规格说明为准。
2. **Entity 优先识别。** 在编写任何代码之前，必须识别并记录 Entity。新功能的起点是"涉及哪些 Entity？"而不是"我们需要哪些端点？"
3. **数据模型可追溯性。** 代码库中的每一列、约束和 Relationship 都必须追溯到 Entity 目录中的条目。未跟踪的 schema 元素被视为漂移。
4. **输出优先设计。** 在设计输入（表单、API）之前，先设计用户*看到*的内容（仪表板、报表、列表）。输出界面驱动信息模型。
5. **业务规则是显式的。** 每一条验证、约束和派生规则都以 BR-xxx 标识符注册。仅存在于代码中的规则被视为技术债务。

### 三阶段数据建模映射到软件开发

IDDD 将经典的三阶段数据建模过程直接映射到软件开发阶段：

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

信息模型中的每个元素都自动意味着对应的开发产物：

| 信息模型元素 | 派生产物 |
|----------------------------|-----------------------------------------------------|
| Entity 识别 | 需求范围、用户故事 |
| Relationship 与 Cardinality | API 端点结构、导航 |
| Attribute 与数据类型 | 表单字段、验证规则、DTO |
| 约束 | 输入验证、类型定义 |
| 派生 Attribute | 业务逻辑、计算规则 |
| 状态转换 | 工作流、状态管理 |
| 聚合/关联规则 | 事务边界、一致性规则 |

**当逻辑模型完成时，80% 的应用行为就已经定义——在做出任何技术选择之前。**

---

## 支持的平台

| 平台 | 代理系统 | 多代理策略 |
|--------------|-----------------------|----------------------------------------------|
| Claude Code  | Claude Agent Teams    | 对等消息传递、独立工作树 |
| OpenAI Codex | Codex Agents SDK      | 通过 MCP Server 实现的 Handoff 模式 |

---

## 前提条件

| 要求 | 详情 |
|----------------|------------------------------------------------------|
| Node.js        | **18+**（包含 npm 或兼容的包管理器） |
| Claude Code    | **Claude Max** 会员 + 启用 Agent Teams |
| OpenAI Codex   | **ChatGPT Plus** 或更高（Pro/Business/Enterprise） |

你需要 Node.js 来运行 `npx` 安装程序。你使用哪个平台就需要订阅对应的 AI 平台。

---

## 安装

```bash
npx id3-cli@latest
```

无需子命令——`id3-cli` 直接运行初始化流程。它将：

1. 将所有 IDDD 模板（规格、文档、引导、技能、Hook）复制到你的项目中。
2. 创建平台特定的符号链接（`.claude/skills/` 或 `.agents/skills/`）指向规范的 `skills/` 原始文件。
3. 在你的平台配置文件中注册 Harness Hook。
4. 初始化 `.iddd/` 状态目录（提交计数器、预览输出）。

### 选项

| 选项 | 描述 |
|-----------------|----------------------------------------------------------|
| `[target-dir]`  | 目标目录（默认为当前目录 `.`） |
| `--no-symlink`  | 复制技能文件而非创建符号链接（适用于 Windows） |
| `--platform`    | 强制指定平台：`claude`、`codex` 或 `all` |

### 覆盖检测

如果目标目录中已存在 `CLAUDE.md`，`id3-cli` 将提示：

```
"IDDD appears to be already installed. Overwrite? (y/N)"
```

### 安装后输出

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

## 安装后的目录结构

运行 `npx id3-cli@latest` 后，你的项目将获得以下结构：

```
your-project/
│
│   ===== Shared (all platforms) =====
│
├── skills/                          Skill 原始文件（唯一事实来源）
│   ├── id3-identify-entities/       Phase 0/1: Entity 识别
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   从现有代码逆向提取
│   │       └── phase1-greenfield.md   新项目的结构化访谈
│   ├── id3-design-information/      Phase 2: 信息结构化
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── phase2-procedure.md    精化流程
│   ├── id3-design-ui/               Phase 2.5: UI 设计与实现
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── step1-structure-derivation.md
│   │       ├── step2-visual-contract.md
│   │       ├── step3-gate-and-mockup.md
│   │       └── step4-implementation.md
│   ├── id3-spawn-team/              分派多代理实现
│   ├── id3-info-audit/              熵审计（漂移检测）
│   └── id3-preview/                 信息模型可视化预览
│
├── specs/                           信息模型产物
│   ├── entity-catalog.md              Entity 清单 + 汇总表
│   ├── data-model.md                  Mermaid ERD + 设计决策
│   ├── ui-inventory.md                界面清单 + 映射矩阵
│   ├── ui-structure.md                界面清单 + 导航结构 (Phase 2.5)
│   └── ui-design-contract.md          设计令牌 + 组件映射 (Phase 2.5)
│
├── docs/                            辅助文档
│   ├── business-rules.md              BR-xxx 索引的业务规则
│   ├── domain-glossary.md             术语 / 英文 / 定义 / 备注
│   ├── info-debt.md                   不一致追踪器
│   └── model-changelog.md            Keep a Changelog 格式
│
├── steering/                        项目级约定
│   ├── product.md                     产品愿景与范围（用户编写）
│   └── data-conventions.md            PK 策略、命名、时间戳等
│
├── hooks/                           Harness Hook 脚本（构建后的 JS 包）
│   ├── iddd-schema-drift.js           schema-drift 检测
│   ├── iddd-rule-check.js             业务规则追踪
│   ├── iddd-auto-audit.js             自动熵审计
│   ├── pre-commit                     Git Hook（schema-drift + rule-check）
│   └── post-commit                    Git Hook（auto-audit）
│
├── .iddd/                           IDDD 内部状态
│   ├── commit-count                   auto-audit 间隔计数器
│   └── preview/                       生成的预览 HTML
│
│   ===== Platform: Claude Code =====
│
├── CLAUDE.md                        Lead Agent 上下文文档
├── .claude/
│   ├── settings.local.json            Hook 注册（由 init 注入）
│   ├── skills/ -> skills/             指向 skills/ 原始文件的符号链接
│   └── hooks/
│       └── hook-config.json           IDDD Hook 设置
│
│   ===== Platform: OpenAI Codex =====
│
├── AGENTS.md                        跨平台代理指令
├── .agents/
│   └── skills/ -> skills/             指向 skills/ 原始文件的符号链接
└── .codex/
    └── hooks.json                     Codex Hook 配置
```

### Skill 文件共享策略

Skill 内容维护在单一规范位置（`skills/`）。平台特定路径（`.claude/skills/`、`.agents/skills/`）是由 `init` CLI 动态创建的符号链接。这确保了跨所有平台的单一维护点。在 Windows 上，使用 `--no-symlink` 创建副本替代。

---

## 工作流

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

### Phase 逐步说明

**Phase 0/1 -- Entity 识别：**
打开你的 AI 编码代理，运行 `/id3-identify-entities`。代理会自动检测你是否有现有代码库（brownfield）或从零开始（greenfield），然后运行相应的识别流程。

**Phase 2 -- 信息设计：**
运行 `/id3-design-information`。代理将概念模型精化为逻辑模型，派生业务规则，并设置版本头和 Hook 配置。

**Phase 2.5 -- UI 设计：**
运行 `/id3-design-ui`。代理从 Entity 目录中派生界面结构，使用设计令牌建立视觉设计契约，运行包含交互式 mockup 预览的 7-Pillar 质量门禁，然后生成 Agent Teams 进行并行界面实现并执行事后审计。

**Phase 3-5 -- 通过 Agent Teams 实现：**
运行 `/id3-spawn-team`。代理读取最终确定的信息模型，生成一个由专业代理组成的团队（spec-generator、implementer、qa-reviewer），以并行方式实现系统。

---

## 技能

### id3-identify-entities (Phase 0/1)

IDDD 工作流的入口点。此技能**自动分支**到 brownfield 和 greenfield 路径。

**触发关键词：** `identify entities`、`information analysis`、`domain analysis`、`new project`、`entity identification`

**自动检测逻辑：** 该技能扫描项目根目录中的 ORM/schema 文件（Prisma、Drizzle、Django models、TypeORM entities、SQL migrations、Sequelize configs）。如果找到，进入 Phase 0；否则进入 Phase 1。

#### Phase 0: Brownfield -- 逆向提取信息模型

对于现有代码库，代理从四个层级系统性地提取隐含的信息模型：

| 层级 | 来源 | 检查内容 | 可靠性 |
|-------|------------------|--------------------------------------------------------|-------------|
| L1    | DB Schema        | 表、列、FK、索引、约束 | 最高 |
| L2    | ORM / Models     | 虚拟字段、派生 Attribute、软删除、状态 | 高 |
| L3    | API Contracts    | 端点、DTO、验证逻辑 | 中等 |
| L4    | Frontend         | 路由、组件、表单字段 | 参考 |

L4 调查非常深入：它扫描基于文件的路由（Next.js `app/`、`pages/`）、React Router、Vue Router 等，以构建完整的 UI 清单（`specs/ui-inventory.md`），包含界面-Entity 映射矩阵。

发现结果被分类为 **match**（跨层级一致）、**mismatch**（记录在 `docs/info-debt.md` 中）或 **implicit**（隐藏在代码逻辑中，作为显式业务规则呈现）。

提取后，通过**验证访谈**与用户确认准确性。

**生成的产物：** `specs/entity-catalog.md`、`specs/data-model.md`、`specs/ui-inventory.md`、`docs/business-rules.md`、`docs/info-debt.md`

#### Phase 1: Greenfield -- 结构化访谈

对于新项目，代理进行结构化访谈以发现领域信息：

1. **信息识别** -- "该系统管理哪些核心'事物'（名词）？"
2. **Relationship 发现** -- "这些事物之间有什么关系？一对多还是多对多？"
3. **规则发现** -- "需要执行哪些规则？是否存在状态转换？"
4. **Silverston 通用模式清单** -- 代理将发现的 Entity 与已验证的模式进行交叉比对：Party、Product/Service、Order/Transaction、Classification、Status/Lifecycle、Hierarchy、Contact Mechanism、Document/Content。

**生成的产物：** `specs/entity-catalog.md`、`specs/data-model.md`、`docs/business-rules.md`

---

### id3-design-information (Phase 2)

将概念模型精化为**逻辑模型**。业务规则、有效性约束和派生规则从信息模型中自动派生。

**触发关键词：** `design information`、`refine model`、`logical model`、`schema design`、`information structuring`

**前提条件：** `specs/entity-catalog.md` 必须存在且至少包含 2 个已识别的 Entity。

**流程：**

1. **Attribute 精化** -- 分配具体数据类型（UUID、TEXT、INTEGER、TIMESTAMP、JSONB 等）、NOT NULL / DEFAULT / UNIQUE 约束和索引需求。
2. **Relationship 具体化** -- 确定 FK 放置位置、删除/更新规则（CASCADE、SET NULL、RESTRICT），并识别多对多 Relationship 的连接表。
3. **自动业务规则派生：**
   - NOT NULL 约束 --> "此字段为必填"（BR-xxx）
   - UNIQUE 约束 --> "不允许重复"（BR-xxx）
   - FK + CASCADE --> "删除父项同时删除子项"（BR-xxx）
   - 状态转换 --> "允许的转换路径"（BR-xxx）
   - 派生 Attribute --> "计算规则"（BR-xxx）
4. **设计决策问题** -- 代理询问用户关于大数据存储策略、软删除范围、多租户、审计追踪需求等。
5. **产物定稿** -- 更新所有规格文件的版本头和 Hook 配置。

**更新的产物：** `specs/entity-catalog.md`、`specs/data-model.md`、`docs/business-rules.md`

---

### id3-design-ui (Phase 2.5)

从信息模型派生 UI 结构和视觉设计，然后使用 Agent Teams 实现界面。

**触发关键词：** `design ui`、`ui design`、`screen design`、`phase 2.5`、`ui structure`

**前提条件：** Phase 2 完成（`entity-catalog.md` version >= `"1.0"`）。

**4 步流水线：**

1. **UI 结构派生** -- 使用 9 条派生规则（entity -> list/detail/form/dashboard）自动将 Entity 映射到界面。使用 12 条基于类型的规则将 Attribute 映射到 Widget。应用"输出优先、输入其次"原则。
2. **视觉设计契约** -- 检测现有前端框架（React、Vue、Svelte 等）和 UI 库。建立 5 个设计令牌领域：spacing、typography、color、copywriting、component registry。
3. **实现前门禁** -- 运行 7-Pillar 验证（结构完整性、spacing、typography、color、copywriting、component registry、traceability）。使用示例数据生成 3 级 HTML mockup（wireframe、styled、interactive）。
4. **实现 + 事后审计** -- 生成 Agent Teams 并行实现界面。实现后视觉审计对每个 Pillar 评分 1-4 并得出前 3 项修复建议。

**产物：** `specs/ui-structure.md`、`specs/ui-design-contract.md`、`.iddd/preview/mockup-*.html`、`.iddd/preview/ui-audit.html`

---

### id3-spawn-team (Phase 3-5)

生成一个由专业代理组成的团队，基于最终确定的信息模型实现系统。

**前提条件：** `specs/entity-catalog.md` 和 `specs/data-model.md` 必须存在且 Phase 2 已完成。

#### Claude Code: Agent Teams

生成三个团队成员，每个成员拥有独立的上下文窗口和独立的 Git 工作树：

| 团队成员 | 角色 |
|------------------|---------------------------------------------------------------|
| spec-generator   | 将信息模型转换为 requirements.md 和 api-contracts.md |
| implementer      | 根据规格构建代码，每个 Entity 一次原子提交 |
| qa-reviewer      | 根据信息模型验证实现；失败时向 implementer 发送直接消息 |

**任务生成规则：**
- 读取 Entity 目录，为每个 Entity 创建一个任务（模型 + 迁移 + API + 验证 + 测试）。
- 数据模型中的 FK 依赖关系决定依赖图。
- 独立的 Entity 并行运行；有依赖的 Entity 等待其父项完成。

#### OpenAI Codex: Agents SDK + Handoff 模式

在 Codex 上，多代理工作使用 Agents SDK Handoff 模式。Codex 作为 MCP Server 启动（`codex --mcp-server`），项目管理代理读取 Entity 目录，通过 Handoff 将任务分配给相同的三个角色（spec-generator、implementer、qa-reviewer）。

---

### id3-info-audit

根据信息模型审计代码库，以检测漂移和熵增。

**触发关键词：** `info audit`、`information audit`、`model audit`、`drift check`

**流程：**

1. 从 `specs/entity-catalog.md` 读取 Entity 列表。
2. 扫描代码库以发现：
   - 未实现的 Entity / 未定义的模型
   - `docs/business-rules.md` 中未在代码中反映的业务规则
   - 数据类型/约束不匹配
3. 根据 `specs/ui-structure.md` 和 `specs/ui-design-contract.md` 检查 UI 一致性：
   - 未实现的界面 / 未定义的界面
   - 表单字段与 Attribute 映射不匹配
   - 缺失的导航路径
4. 更新版本头（`last_verified`、`audit_status`）。
5. 检查 Hook 绕过历史（`.iddd/skip-history.log`）。
6. 输出带有可视化指标的按 Entity 状态报告。

**可视化输出：** 审计结果渲染为 `.iddd/preview/audit-{date}.html` 中的交互式 HTML 仪表板。

---

### id3-preview

启动轻量级本地 HTTP 服务器，在浏览器中查看信息模型和审计结果。

**触发关键词：** `preview`、`show erd`、`show model`、`visual preview`

服务器使用 `listen(0)`（操作系统分配端口）并提供：
- **ERD 预览** -- 交互式 Mermaid ERD，点击 Entity 可跳转到目录详情
- **UI 原型** -- 从 `specs/ui-structure.md` 和 `specs/ui-design-contract.md` 派生的线框布局
- **审计仪表板** -- 按 Entity 的状态卡片，含业务规则覆盖率

所有 HTML 文件持久化存储在 `.iddd/preview/` 中，即使没有服务器也可以直接在浏览器中打开。

---

## Harness Hook 系统

IDDD 通过自动化 Hook 来贯彻信息优先的原则。其理念不是"请遵循流程"，而是**"如果你不遵循，提交就会被阻止。"**

### Hook 概览

| Hook           | 触发时机 | 动作 | 严重程度 |
|----------------|------------------|-----------------------------------------------------|------------|
| schema-drift   | pre-commit       | 验证 schema 变更是否与 entity-catalog.md 匹配 | **BLOCK**（拒绝提交） |
| rule-check     | pre-commit       | 检查新的验证逻辑是否与 business-rules.md 对应 | **WARN**（允许提交，显示消息） |
| auto-audit     | post-commit      | 每 N 次提交运行 info-audit | **INFO**（生成报告） |

### schema-drift (BLOCK)

当你修改与 schema 相关的文件（Prisma、Drizzle、Django models、TypeORM entities、SQL migrations 等）时，Hook 会检查 `specs/entity-catalog.md` 是否已相应更新。如果没有，提交将被**拒绝**。信息模型必须始终在代码*之前*更新。

**监控的文件模式**（可配置）：
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check (WARN)

当你添加或修改验证逻辑（Zod、Yup、Joi、Pydantic 等）时，Hook 会检查 `docs/business-rules.md` 中是否有对应的 `BR-xxx` 条目。如果缺失，将发出警告。提交会继续，但缺失的规则会被标记。

**监控的文件模式**（可配置）：
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit (INFO)

每 N 次提交（默认：10，可配置）后，Harness 自动运行 info-audit，将代码库与信息模型进行比较。提交计数器存储在 `.iddd/commit-count` 中。结果写入 `.iddd/preview/audit-{date}.html`。

### Hook 配置

所有 Hook 设置位于 `.claude/hooks/hook-config.json`（Claude Code）或 `.codex/hooks.json`（Codex）。

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

要禁用所有 IDDD Hook，将顶层的 `"enabled"` 设为 `false`。要禁用单个 Hook，将其 `"enabled"` 设为 `false`。要更改 auto-audit 频率，调整 `"interval_commits"`。

### Hook 绕过

设置 `IDDD_SKIP_HOOKS=1` 可临时跳过所有 Hook。绕过记录会被写入 `.iddd/skip-history.log`，并在审计时进行审查。

---

## 熵管理

随着时间推移，信息模型会与代码产生偏离。IDDD 通过三种机制对抗熵增：

### 版本头

`specs/entity-catalog.md` 和 `specs/data-model.md` 包含 YAML frontmatter，用于追踪模型状态：

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

**规则：**
- `version` 在每个 Phase 完成时递增（Phase 1：`"0.1"`，Phase 2：`"1.0"`，后续：`"1.1"`、`"1.2"`、...）。
- `last_verified` 在每次审计或验证模型时更新。
- 如果 `last_verified` **超过 7 天**，代理将提示你在开始新工作之前运行 `/id3-info-audit`。陈旧的模型会导致漂移。

### 变更日志

所有模型变更都记录在 `docs/model-changelog.md` 中，使用 [Keep a Changelog](https://keepachangelog.com/) 格式：

```markdown
## [1.0] -- 2026-04-05
### Phase 2 Complete
- 12 entities finalized in logical model
- 19 business rules derived
- Design decisions: D-01 (S3 separation), D-02 (multi-tenant reservation), D-03 (soft delete scope)
- UI proposals: 6 screens generated
```

### 自动审计

`auto-audit` Hook（post-commit）每 N 次提交运行一次完整的信息审计，在漂移积累之前捕获偏差。

---

## 自定义指南

IDDD 设计为可适配你的项目约定。以下是自定义内容及对应文件：

| 自定义内容 | 要编辑的文件 |
|------------------------------------------------|------------------------------------|
| 产品愿景与范围 | `steering/product.md` |
| 命名约定、PK 策略、时间戳、软删除策略、ENUM vs 引用表 | `steering/data-conventions.md` |
| Entity 定义 | `specs/entity-catalog.md` |
| 数据模型（ERD） | `specs/data-model.md` |
| 业务规则 | `docs/business-rules.md` |
| 领域术语表 | `docs/domain-glossary.md` |
| UI 界面清单 | `specs/ui-inventory.md` |
| UI 结构（界面派生） | `specs/ui-structure.md` |
| UI 设计契约（令牌、组件） | `specs/ui-design-contract.md` |
| Hook 行为（启用/禁用、严重程度） | `.claude/hooks/hook-config.json` |
| Hook 的监控文件模式 | `.claude/hooks/hook-config.json` |
| auto-audit 提交间隔 | `.claude/hooks/hook-config.json` |
| Codex Hook 配置 | `.codex/hooks.json` |

**提示：** 所有 `specs/` 和 `docs/` 文件使用 YAML frontmatter 和版本头。IDDD Harness 追踪这些版本以检测熵漂移。修改规格文件时，请务必更新版本头。

---

## 使用示例

### 示例 1：启动新项目（Greenfield）

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

### 示例 2：应用到��有项目（Brownfield）

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

## 学术渊源

IDDD 综合了多个学术传统的思想：

- **Peter Chen 的 ER 模型（1976）** -- "现实世界由实体和关系组成。"信息结构先于应用逻辑这一基础性洞见。
- **Len Silverston 的通用数据模型** -- 可复用的信息模式（Party、Product、Order、Hierarchy），作为验证已发现 Entity 的清单。
- **Eric Evans 的 DDD（2003）** -- Bounded Context、Ubiquitous Language 和 Aggregate 模式。IDDD 继承了对领域语言和显式边界的强调。
- **Sophia Prater 的 OOUX（面向对象的用户体验）** -- "先设计对象，再设计交互。"ORCA 框架（Objects、Relationships、CTAs、Attributes）直接启发了 IDDD 的输出优先 UI 派生方法。
- **Jamie Lord 的"数据优先，代码其次"（2024）** -- "将知识折叠进数据。"将 Unix 表示法则应用于现代软件开发。
- **Mitchell Hashimoto 的 Harness 工程（2026）** -- `Agent = Model + Harness`。AI 代理需要架构约束、上下文工程和熵管理才能长期保持有效性的洞见。IDDD 的 Hook 系统、版本头和 auto-audit 是 Harness 工程原则的直接应用。

**核心洞见：** *当逻辑模型完成时，80% 的应用行为就已经定义——在做出任何技术选择之前。而信息模型本身就是 AI 代理最好的 Harness。*

---

## 许可证

MIT

---

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│    "What information exists?" -- always the first question.      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

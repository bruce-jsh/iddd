<div align="center">

[![npm version](https://img.shields.io/npm/v/id3-cli.svg)](https://www.npmjs.com/package/id3-cli)
[![license](https://img.shields.io/npm/l/id3-cli.svg)](https://github.com/bruce-jsh/iddd/blob/master/LICENSE)

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
║    ╚═╝╚═════╝ ╚═════╝ ╚═════╝                                    v1.0.1                ║
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

## 快速开始

```bash
npm i -g id3-cli
```

在项目中运行 `/id3-start`。系统会自动检测 IDDD 安装状态，并通过进度仪表板指引您下一步要执行的命令。

---

**从"存在哪些信息？"开始，而不是"需要构建什么功能？"。**

IDDD 是一种以**信息模型**为所有软件开发核心的开发方法论，同时也是一套 AI Agent 技能包。在做出任何技术选型*之前*，先构建严谨的 Entity 目录、数据模型、业务规则和领域术语表。通过这种方式，IDDD 确保在逻辑模型阶段就已定义 80% 的应用行为。此后，信息模型将成为需求、API 契约、界面设计和验证规则系统性派生的生成中心（generative center）。

该软件包将 IDDD 以 AI Agent 技能、Harness Hook 和文档模板集的形式安装到项目中，使编码 Agent 在整个开发生命周期中强制执行信息优先（information-first）原则。

---

## 什么是 IDDD？

大多数软件项目从*"需要构建什么功能？"*这个问题开始，随即投入实现。IDDD 颠覆了这一做法：从**"该领域中存在哪些信息？"**出发，将信息模型不是作为规格说明书中的一个章节，而是作为所有其他开发产物派生的**唯一真实来源（single source of truth）**。

### 核心原则

1. **信息模型是生成中心。** 所有代码、API、UI 和测试都从 Entity 目录和数据模型中派生。当代码与规格不一致时，以规格为准。
2. **Entity 优先识别。** 在编写代码之前，必须先识别并记录 Entity。新功能从"涉及哪些 Entity？"开始，而不是"需要哪些端点？"。
3. **数据模型可追溯性。** 代码库中的每一列、每个约束、每个 Relationship 都必须可追溯到 Entity 目录中的条目。不可追溯的 Schema 元素被视为漂移（drift）。
4. **输出优先设计。** 在设计输入（表单、API）之前，先设计用户*看到的内容*（仪表板、报表、列表）。输出视图驱动信息模型。
5. **业务规则必须显式化。** 所有验证、约束和派生规则都使用 BR-xxx 标识符注册。仅存在于代码中的规则被视为技术债务（debt）。

### 三级数据建模与软件开发的映射

IDDD 将传统的三级数据建模过程直接映射到软件开发阶段：

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

信息模型的每个元素会自动蕴含开发产物：

| 信息模型元素                 | 派生的产物                                           |
|------------------------------|------------------------------------------------------|
| Entity 识别                  | 需求范围、用户故事                                   |
| Relationship 与基数          | API 端点结构、导航                                   |
| Attribute 与数据类型         | 表单字段、验证规则、DTO                              |
| 约束条件                     | 输入验证、类型定义                                   |
| 派生 Attribute               | 业务逻辑、计算规则                                   |
| 状态转换                     | 工作流、状态管理                                     |
| 聚合/关联规则                | 事务边界、一致性规则                                 |

**当逻辑模型完成时，在做出技术选型之前，80% 的应用行为已经被定义。**

---

## 支持的平台

| 平台         | Agent 系统               | 多 Agent 策略                                       |
|--------------|--------------------------|------------------------------------------------------|
| Claude Code  | Claude Agent Teams       | 对等消息传递，独立工作树                             |
| OpenAI Codex | Codex Agents SDK         | 通过 MCP Server 的交接模式                           |

---

## 前置要求

| 要求           | 详情                                                 |
|----------------|------------------------------------------------------|
| Node.js        | **18+**（含 npm 或兼容的包管理器）                   |
| Claude Code    | **Claude Max** 会员 + Agent Teams 已启用             |
| OpenAI Codex   | **ChatGPT Plus** 及以上（Pro/Business/Enterprise）   |

需要 Node.js 18+ 和 npm。AI 平台订阅取决于您使用的平台。

---

## 安装

```bash
npm i -g id3-cli
```

全局安装后，两个全局技能（`/id3-start`、`/id3-clear`）将被注册，可在所有项目中使用。在项目中首次运行 `/id3-start` 时，系统会自动检测 IDDD 是否已安装，并指引下一步操作。

### 选项

| 选项            | 说明                                                     |
|-----------------|----------------------------------------------------------|
| `[target-dir]`  | 目标目录（默认值：当前目录 `.`）                         |
| `--no-symlink`  | 复制技能文件而非创建符号链接（适用于 Windows）           |
| `--platform`    | 强制指定平台：`claude`、`codex` 或 `all`                 |

### 覆盖检测

如果目标目录中已存在 `CLAUDE.md`，`id3-cli` 会询问：

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
│    2. Run /id3-start to begin                             │
│    3. Customize steering/data-conventions.md              │
│                                                           │
│  Global Skills (via npm i -g):                            │
│    ├── id3-start               (Entry Point)              │
│    └── id3-clear               (Project Reset)            │
│                                                           │
│  Project Skills (per-project):                            │
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

## 安装后目录结构

执行 `npm i -g id3-cli` 后，以下全局技能将安装到系统中：

```
~/.claude/skills-global/              全局技能（通过 npm i -g 安装）
  ├── id3-start/                      IDDD 入口点
  │   ├── SKILL.md
  │   └── references/
  │       ├── phase-guide.md            Phase 路由分类体系
  │       └── dashboard-template.md     进度仪表板格式
  └── id3-clear/                      项目重置
      └── SKILL.md
```

运行 `/id3-start` 后（或 `id3-cli init .`），项目将具有以下结构：

```
your-project/
│
│   ===== 通用（所有平台）=====
│
├── skills/                          技能源文件（唯一真实来源）
│   ├── id3-identify-entities/       Phase 0/1：Entity 识别
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   从现有代码反向提取
│   │       └── phase1-greenfield.md   新项目的结构化访谈
│   ├── id3-design-information/      Phase 2：信息结构化
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── phase2-procedure.md    精化流程
│   ├── id3-design-ui/               Phase 2.5：UI 设计与实现
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── step1-structure-derivation.md
│   │       ├── step2-visual-contract.md
│   │       ├── step3-gate-and-mockup.md
│   │       └── step4-implementation.md
│   ├── id3-spawn-team/              多 Agent 实现调度
│   ├── id3-info-audit/              熵审计（漂移检测）
│   └── id3-preview/                 信息模型可视化预览
│
├── specs/                           信息模型产物
│   ├── entity-catalog.md              Entity 列表 + 摘要表
│   ├── data-model.md                  Mermaid ERD + 设计决策
│   ├── ui-inventory.md                界面列表 + 映射矩阵
│   ├── ui-structure.md                界面列表 + 导航（Phase 2.5）
│   └── ui-design-contract.md          设计令牌 + 组件映射（Phase 2.5）
│
├── docs/                            支持文档
│   ├── business-rules.md              BR-xxx 索引的业务规则
│   ├── domain-glossary.md             术语/英文名/定义/备注
│   ├── info-debt.md                   不一致追踪器
│   └── model-changelog.md            Keep a Changelog 格式
│
├── steering/                        项目级约定
│   ├── product.md                     产品愿景与范围（用户编写）
│   └── data-conventions.md            PK 策略、命名、时间戳等
│
├── hooks/                           Harness Hook 脚本（构建后的 JS 包）
│   ├── iddd-schema-drift.js           Schema 漂移检测
│   ├── iddd-rule-check.js             业务规则追踪
│   ├── iddd-auto-audit.js             自动熵审计
│   ├── pre-commit                     Git Hook（schema-drift + rule-check）
│   └── post-commit                    Git Hook（auto-audit）
│
├── .iddd/                           IDDD 内部状态
│   ├── commit-count                   auto-audit 间隔计数器
│   └── preview/                       生成的预览 HTML
│
│   ===== 平台：Claude Code =====
│
├── CLAUDE.md                        Lead Agent 上下文文档
├── .claude/
│   ├── settings.local.json            Hook 注册（由 init 注入）
│   ├── skills/ -> skills/             指向 skills/ 源目录的符号链接
│   └── hooks/
│       └── hook-config.json           IDDD Hook 配置
│
│   ===== 平台：OpenAI Codex =====
│
├── AGENTS.md                        跨平台 Agent 指令
├── .agents/
│   └── skills/ -> skills/             指向 skills/ 源目录的符号链接
└── .codex/
    └── hooks.json                     Codex Hook 配置
```

### 技能文件共享策略

技能内容维护在单一规范位置（`skills/`）。平台专属路径（`.claude/skills/`、`.agents/skills/`）是 `init` CLI 动态创建的符号链接。这确保了跨所有平台的单一维护点。在 Windows 上请使用 `--no-symlink` 创建副本。

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

### 各 Phase 指南

> **提示：** 首次运行 `/id3-start` 时，系统会显示当前进度和下一步操作。之后请直接使用下列各命令。

**Phase 0/1：Entity 识别：**
运行 `/id3-identify-entities`。Agent 会自动检测是否存在现有代码库（棕地）或从头开始（绿地），然后执行相应的识别流程。

**Phase 2：信息设计：**
运行 `/id3-design-information`。Agent 将概念模型精化为逻辑模型，派生业务规则，并配置版本头和 Hook 设置。

**Phase 2.5：UI 设计：**
运行 `/id3-design-ui`。Agent 从 Entity 目录派生界面结构，使用设计令牌建立视觉设计契约，通过交互式原型预览执行 7-Pillar 质量门禁，然后生成 Agent Teams 并行实现界面并执行事后审计。

**Phase 3-5：通过 Agent Teams 实现：**
运行 `/id3-spawn-team`。Agent 读取已确定的信息模型，生成专业 Agent 团队（spec-generator、implementer、qa-reviewer）并行实现系统。

---

## 技能

### id3-start（全局 - 入口点）

IDDD 的入口点。首次运行时提供项目设置、进度仪表板和下一步指引。如果附带请求，则路由到正确的 Phase 技能。之后请直接使用指引的各命令。

**功能：**

1. **自动设置：** 检测当前项目是否已安装 IDDD（`specs/entity-catalog.md` + `CLAUDE.md`）。如未安装，自动运行 `id3-cli init .` 来设置 IDDD。
2. **进度仪表板：** 显示 Phase 流水线，以可视符号（完成勾号、进行中菱形、未开始圆圈）和进度条展示各 Phase（Phase 0/1、Phase 2、Phase 2.5、Phase 3-5）的完成状态。
3. **意图路由：** 如果附带请求，则路由到正确的 Phase 技能（`/id3-identify-entities`、`/id3-design-information`、`/id3-design-ui`、`/id3-spawn-team`、`/id3-info-audit` 或 `/id3-preview`）。
4. **模糊请求处理：** 当请求可能匹配多个 Phase 时（例如："给列表添加筛选器"——是仅 UI 变更还是需要新的数据 Entity？），在路由前提出澄清问题。
5. **UI 快速路径：** 当请求仅包含明确的 UI 关键词且数据模型已存在（version >= 1.0）时，跳过 Entity 问题直接路由到 `/id3-design-ui`。
6. **前置条件检查：** 如果目标 Phase 的前置条件未满足，发出警告并建议正确的起始 Phase。

**用法：**

```
/id3-start                             显示仪表板 + 下一步命令指引
```

**安装：** 通过 `npm i -g id3-cli` 全局安装到 `~/.claude/skills-global/id3-start/`。

---

### id3-identify-entities（Phase 0/1）

IDDD 工作流的入口点。该技能**自动分支**为棕地和绿地路径。

**自动检测逻辑：** 技能在项目根目录扫描 ORM/Schema 文件（Prisma、Drizzle、Django models、TypeORM entities、SQL migrations、Sequelize configs）。如果发现则进入 Phase 0，否则进入 Phase 1。

#### Phase 0：棕地 - 信息模型反向提取

对于现有代码库，Agent 从四个层次系统性地提取隐式信息模型：

| 层次 | 来源             | 调查对象                                               | 可信度    |
|------|------------------|--------------------------------------------------------|-----------|
| L1   | 数据库 Schema    | 表、列、FK、索引、约束                                 | 最高      |
| L2   | ORM/模型         | 虚拟字段、派生 Attribute、软删除、状态                  | 高        |
| L3   | API 契约         | 端点、DTO、验证逻辑                                    | 中等      |
| L4   | 前端             | 路由、组件、表单字段                                   | 参考      |

L4 调查是彻底的：扫描基于文件的路由（Next.js `app/`、`pages/`）、React Router、Vue Router 等，构建包含界面-Entity 映射矩阵的完整 UI 清单（`specs/ui-inventory.md`）。

发现结果分为：**一致**（跨层一致）、**不一致**（记录在 `docs/info-debt.md`）、**隐式**（从代码逻辑中挖掘出的隐含业务规则，显式化为业务规则）。

提取完成后，通过**验证访谈**与用户确认准确性。

**生成的产物：** `specs/entity-catalog.md`、`specs/data-model.md`、`specs/ui-inventory.md`、`docs/business-rules.md`、`docs/info-debt.md`

#### Phase 1：绿地 - 结构化访谈

对于新项目，Agent 执行结构化访谈以发现领域信息：

1. **信息识别：** "该系统管理的核心'事物'（名词）是什么？"
2. **Relationship 发现：** "它们之间如何关联？是一对多还是多对多？"
3. **规则发现：** "需要强制执行哪些规则？是否存在状态转换？"
4. **Silverston 通用模式检查清单：** Agent 将发现的 Entity 与经过验证的模式进行对照：Party、Product/Service、Order/Transaction、Classification、Status/Lifecycle、Hierarchy、Contact Mechanism、Document/Content。

**生成的产物：** `specs/entity-catalog.md`、`specs/data-model.md`、`docs/business-rules.md`

---

### id3-design-information（Phase 2）

将概念模型精化为**逻辑模型**。业务规则、验证约束和派生规则从信息模型中自动派生。

**前置条件：** `specs/entity-catalog.md` 中至少存在 2 个已识别的 Entity。

**流程：**

1. **Attribute 精化：** 分配具体数据类型（UUID、TEXT、INTEGER、TIMESTAMP、JSONB 等）、NOT NULL / DEFAULT / UNIQUE 约束以及索引需求。
2. **Relationship 具体化：** 确定 FK 放置、删除/更新规则（CASCADE、SET NULL、RESTRICT），识别多对多 Relationship 的关联表。
3. **自动业务规则派生：**
   - NOT NULL 约束 --> "此字段为必填"（BR-xxx）
   - UNIQUE 约束 --> "不允许重复"（BR-xxx）
   - FK + CASCADE --> "删除父记录时子记录一并删除"（BR-xxx）
   - 状态转换 --> "允许的转换路径"（BR-xxx）
   - 派生 Attribute --> "计算规则"（BR-xxx）
4. **设计决策提问：** Agent 就大容量数据存储策略、软删除范围、多租户、审计追踪需求等向用户提问。
5. **产物确定：** 使用版本头和 Hook 配置更新所有规格文件。

**更新的产物：** `specs/entity-catalog.md`、`specs/data-model.md`、`docs/business-rules.md`

---

### id3-design-ui（Phase 2.5）

从信息模型派生 UI 结构和视觉设计，然后使用 Agent Teams 实现界面。

**前置条件：** Phase 2 已完成（`entity-catalog.md` version >= `"1.0"`）。

**四阶段流水线：**

1. **UI 结构派生：** 使用 9 条派生规则（entity -> list/detail/form/dashboard）将 Entity 自动映射到界面。使用 12 条基于类型的规则将 Attribute 映射到 Widget。应用"输出优先、输入后置"原则。
2. **视觉设计契约：** 检测现有前端框架（React、Vue、Svelte 等）和 UI 库。建立 5 个设计令牌领域（spacing、typography、color、copywriting、component registry）。
3. **实现前门禁：** 执行 7-Pillar 验证（结构完整性、spacing、typography、color、copywriting、component registry、traceability）。使用示例数据生成三级 HTML 原型（wireframe、styled、interactive）。
4. **实现 + 事后审计：** 生成 Agent Teams 并行实现界面。实现后，视觉审计对每个 Pillar 评分（1-4 分）并提出前三项修正建议。

**产物：** `specs/ui-structure.md`、`specs/ui-design-contract.md`、`.iddd/preview/mockup-*.html`、`.iddd/preview/ui-audit.html`

---

### id3-spawn-team（Phase 3-5）

基于已确定的信息模型生成专业 Agent 团队来实现系统。

**前置条件：** `specs/entity-catalog.md` 和 `specs/data-model.md` 存在且 Phase 2 已完成。

#### Claude Code：Agent Teams

生成三名团队成员，各自拥有独立的上下文窗口和独立的 Git 工作树：

| 团队成员         | 角色                                                          |
|------------------|---------------------------------------------------------------|
| spec-generator   | 将信息模型转换为 requirements.md 和 api-contracts.md          |
| implementer      | 根据规格构建代码，每个 Entity 一个原子提交                    |
| qa-reviewer      | 对照信息模型验证实现；失败时直接向 implementer 发送消息       |

**任务生成规则：**
- 读取 Entity 目录，为每个 Entity 创建一个任务（模型 + 迁移 + API + 验证 + 测试）。
- 数据模型中的 FK 依赖关系决定依赖图。
- 独立的 Entity 并行执行，依赖的 Entity 等待父 Entity 完成。

#### OpenAI Codex：Agents SDK + 交接模式

在 Codex 中，多 Agent 任务使用 Agents SDK 交接模式。Codex 以 MCP Server（`codex --mcp-server`）启动，项目管理器 Agent 读取 Entity 目录，通过交接将任务分配给相同的三个角色（spec-generator、implementer、qa-reviewer）。

---

### id3-info-audit

对照信息模型审计代码库，检测漂移和熵增。

**流程：**

1. 从 `specs/entity-catalog.md` 读取 Entity 列表。
2. 扫描代码库中的以下内容：
   - 未实现的 Entity / 未定义的模型
   - `docs/business-rules.md` 中的业务规则未在代码中体现
   - 数据类型/约束不一致
3. 对照 `specs/ui-structure.md` 和 `specs/ui-design-contract.md` 检查 UI 一致性：
   - 未实现的界面 / 未定义的界面
   - 表单字段与 Attribute 映射不一致
   - 缺失的导航路径
4. 更新版本头（`last_verified`、`audit_status`）。
5. 检查 Hook 绕过历史（`.iddd/skip-history.log`）。
6. 输出带有可视化指标的逐 Entity 状态报告。

**可视化输出：** 审计结果以交互式 HTML 仪表板形式渲染到 `.iddd/preview/audit-{date}.html`。

---

### id3-preview

启动轻量级本地 HTTP 服务器，以便在浏览器中查看信息模型和审计结果。

服务器使用 `listen(0)`（操作系统分配端口），提供以下内容：
- **ERD 预览：** 点击 Entity 可跳转到目录详情的交互式 Mermaid ERD
- **UI 原型：** 从 `specs/ui-structure.md` 和 `specs/ui-design-contract.md` 派生的线框布局
- **审计仪表板：** 包含业务规则覆盖率的逐 Entity 状态卡片

所有 HTML 文件保存在 `.iddd/preview/` 中，无需服务器也可在浏览器中直接打开。

---

### id3-clear（全局 - 项目重置）

安全移除当前项目中 IDDD 生成的所有文件，恢复到 IDDD 安装之前的状态。

**流程：**

1. **安装确认：** 检查项目中是否存在 IDDD 文件。如不存在，报告"未找到 IDDD 文件"并中止。
2. **删除目标扫描：** 识别哪些 IDDD 目录（`specs/`、`docs/`、`steering/`、`hooks/`、`skills/`、`.claude/skills/`、`.claude/hooks/`、`.codex/skills/`、`.agents/skills/`、`.iddd/`）和文件（`CLAUDE.md`、`AGENTS.md`）实际存在。
3. **警告显示：** 展示将被删除的所有文件和目录的详细列表。对用户编写的文件（`steering/product.md`、`steering/data-conventions.md`）添加特别注释。
4. **确认要求：** 以 `[y/N]` 提示（默认 N）。仅在明确输入"y"或"yes"时才继续。
5. **执行删除：** 仅移除已识别的目标。显示包含删除数量的完成摘要。

**安全规则：**
- 绝不删除已知 IDDD 文件列表以外的文件
- 绝不使用 `rm -rf *` 等通配符模式
- 绝不跳过确认步骤
- 如需选择性删除，请使用手动文件操作

**安装：** 通过 `npm i -g id3-cli` 全局安装到 `~/.claude/skills-global/id3-clear/`。

---

## Harness Hook 系统

IDDD 通过自动化 Hook 强制执行信息优先原则。其理念不是"请遵循流程"，而是**"不遵循就会阻止提交。"**

### Hook 概览

| Hook           | 触发时机         | 行为                                                | 严重程度   |
|----------------|------------------|-----------------------------------------------------|------------|
| schema-drift   | pre-commit       | 验证 Schema 变更是否与 entity-catalog.md 一致        | **BLOCK**（拒绝提交）|
| rule-check     | pre-commit       | 检查新的验证逻辑是否在 business-rules.md 中有对应项  | **WARN**（允许提交，显示消息）|
| auto-audit     | post-commit      | 每 N 次提交运行一次 info-audit                       | **INFO**（生成报告）|

### schema-drift（BLOCK）

修改 Schema 相关文件（Prisma、Drizzle、Django models、TypeORM entities、SQL migrations 等）时，Hook 会检查 `specs/entity-catalog.md` 是否也一并更新。如未更新，提交将被**拒绝**。信息模型必须始终*先于*代码更新。

**监控文件模式**（可配置）：
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check（WARN）

添加或修改验证逻辑（Zod、Yup、Joi、Pydantic 等）时，Hook 会检查 `docs/business-rules.md` 中是否有对应的 `BR-xxx` 条目。如果没有，将发出警告。提交会继续进行，但会显示缺失的规则。

**监控文件模式**（可配置）：
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit（INFO）

每 N 次提交（默认：10，可配置），Harness 会自动运行 info-audit，将代码库与信息模型进行比较。提交计数器存储在 `.iddd/commit-count` 中。结果记录到 `.iddd/preview/audit-{date}.html`。

### Hook 配置

所有 Hook 配置位于 `.claude/hooks/hook-config.json`（Claude Code）或 `.codex/hooks.json`（Codex）中。

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

要禁用所有 IDDD Hook，将顶层的 `"enabled"` 设为 `false`。要禁用单个 Hook，将该 Hook 的 `"enabled"` 设为 `false`。要更改 auto-audit 频率，调整 `"interval_commits"`。

### Hook 绕过

设置 `IDDD_SKIP_HOOKS=1` 可临时跳过所有 Hook。绕过记录会保存在 `.iddd/skip-history.log` 中，审计时将被审查。

---

## 熵管理

随着时间推移，信息模型与代码会产生偏离。IDDD 通过三种机制应对熵增：

### 版本头

`specs/entity-catalog.md` 和 `specs/data-model.md` 包含用于追踪模型状态的 YAML 前置元数据：

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
- `version` 在每个 Phase 完成时递增（Phase 1：`"0.1"`，Phase 2：`"1.0"`，之后：`"1.1"`、`"1.2"`、...）。
- `last_verified` 在每次模型审计或验证时更新。
- 当 `last_verified` **超过 7 天**时，Agent 会在进行新任务前建议运行 `/id3-info-audit`。过时的模型会导致漂移。

### 变更日志

所有模型变更以 [Keep a Changelog](https://keepachangelog.com/) 格式记录在 `docs/model-changelog.md` 中：

```markdown
## [1.0] -- 2026-04-05
### Phase 2 Complete
- 12 entities finalized in logical model
- 19 business rules derived
- Design decisions: D-01 (S3 separation), D-02 (multi-tenant reservation), D-03 (soft delete scope)
- UI proposals: 6 screens generated
```

### 自动审计

`auto-audit` Hook（post-commit）每 N 次提交运行一次全面信息审计，在漂移累积之前将其捕获。

---

## 自定义指南

IDDD 旨在适应项目的约定。自定义项目及对应编辑文件如下：

| 自定义项目                                           | 编辑文件                             |
|------------------------------------------------------|--------------------------------------|
| 产品愿景与范围                                       | `steering/product.md`                |
| 命名约定、PK 策略、时间戳、软删除策略、ENUM vs 引用表 | `steering/data-conventions.md` |
| Entity 定义                                          | `specs/entity-catalog.md`            |
| 数据模型（ERD）                                      | `specs/data-model.md`                |
| 业务规则                                             | `docs/business-rules.md`             |
| 领域术语表                                           | `docs/domain-glossary.md`            |
| UI 界面清单                                          | `specs/ui-inventory.md`              |
| UI 结构（界面派生）                                  | `specs/ui-structure.md`              |
| UI 设计契约（令牌、组件）                            | `specs/ui-design-contract.md`        |
| Hook 行为（启用/禁用、严重程度）                     | `.claude/hooks/hook-config.json`     |
| Hook 监控文件模式                                    | `.claude/hooks/hook-config.json`     |
| auto-audit 提交间隔                                  | `.claude/hooks/hook-config.json`     |
| Codex Hook 配置                                      | `.codex/hooks.json`                  |

**提示：** 所有 `specs/` 和 `docs/` 文件都使用包含版本头的 YAML 前置元数据。IDDD Harness 通过追踪这些版本来检测熵漂移。修改规格文件时请始终更新版本头。

---

## 使用示例

### 示例 1：启动新项目（绿地）

```
$ npm i -g id3-cli
$ mkdir my-saas && cd my-saas && git init
$ claude
> /id3-start 识别 SaaS 领域的 Entity

  ╔════════════════════════════════════════════════════════════════╗
  ║  Welcome to IDDD -- Information Design-Driven Development.     ║
  ║  Your information model is your harness.                       ║
  ╚════════════════════════════════════════════════════════════════╝

  IDDD is not set up in this project. Setting up now...
  IDDD initialized. Here is your project dashboard:

  （仪表板显示所有 Phase 为 ○ -- 未开始）

  Routing to /id3-identify-entities -- 通过结构化访谈识别领域 Entity。
  本 Phase 生成的产物：specs/entity-catalog.md、specs/data-model.md、docs/business-rules.md

  Agent: "系统管理的核心'事物'是什么？"
  You: "Users、Organizations、Subscriptions、Invoices、Features"
  Agent: "Users 和 Organizations 之间如何关联？"
  You: "通过带有 role Attribute 的 Membership Entity 形成多对多关系。"
  ...

  Entity catalog produced: specs/entity-catalog.md (5 entities, 7 relationships)

> /id3-design-information

  将概念模型精化为逻辑模型。

  Agent refines attributes, derives 14 business rules.
  specs/entity-catalog.md updated (version: 1.0)
  docs/business-rules.md updated (BR-001 through BR-014)

> /id3-design-ui

  从信息模型派生 UI 并实现。

  Step 1: Deriving UI structure from 5 entities... 8 screens mapped
  Step 2: Design contract established (React + Tailwind detected)
  Step 3: 7-Pillar gate passed. Mockup preview: http://localhost:52341
  Step 4: Spawning Agent Teams for screen implementation...
  Post-audit: all 7 pillars scored 3+/4

  specs/ui-structure.md generated
  specs/ui-design-contract.md generated

> /id3-spawn-team

  生成 Agent Teams 进行并行实现。

  Spawning Agent Teams:
  - spec-generator: generating requirements.md, api-contracts.md
  - implementer: building User -> Organization -> Membership -> ...
  - qa-reviewer: verifying against information model
```

### 示例 2：应用到现有项目（棕地）

```
$ cd existing-django-project
$ id3-cli init .

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

## 学术谱系

IDDD 综合了多个学术传统的理念：

- **Peter Chen 的 ER Model（1976）：** "现实世界由 Entity 和 Relationship 组成。"信息结构先于应用逻辑的根本洞察。
- **Len Silverston 的 Universal Data Models：** 作为验证已发现 Entity 的检查清单的可复用信息模式（Party、Product、Order、Hierarchy）。
- **Eric Evans 的 Domain-Driven Design（2003）：** Bounded Context、Ubiquitous Language、Aggregate 模式。IDDD 继承了对领域语言和显式边界的强调。
- **Sophia Prater 的 OOUX（Object-Oriented UX）：** "先设计对象，再设计交互。"ORCA 框架（Objects、Relationships、CTAs、Attributes）直接影响了 IDDD 的输出优先 UI 派生。
- **Jamie Lord 的 "Data First, Code Second"（2024）：** "将知识折叠进数据中。"将 Unix 表示法则应用于现代软件开发。
- **Mitchell Hashimoto 的 Harness Engineering（2026）：** `Agent = Model + Harness`。AI Agent 要在时间推移中保持有效，需要架构约束、上下文工程和熵管理的洞察。IDDD 的 Hook 系统、版本头和 auto-audit 是 Harness Engineering 原则的直接应用。

**核心洞察：** *当逻辑模型完成时，在做出技术选型之前，80% 的应用行为已经被定义。而信息模型本身就是 AI Agent 最好的 Harness。*

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

<div align="center">

[![npm version](https://img.shields.io/npm/v/id3-cli.svg)](https://www.npmjs.com/package/id3-cli)
[![license](https://img.shields.io/npm/l/id3-cli.svg)](https://github.com/bruce-jsh/iddd/blob/master/LICENSE)

[English](https://github.com/bruce-jsh/iddd/blob/master/README.md) · [한국어](https://github.com/bruce-jsh/iddd/blob/master/README.ko-KR.md) · [简体中文](https://github.com/bruce-jsh/iddd/blob/master/README.zh-CN.md) · **日本語** · [Türkçe](https://github.com/bruce-jsh/iddd/blob/master/README.tr-TR.md)

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

## クイックスタート

```bash
npm i -g id3-cli
```

プロジェクトで `/id3-start` を実行してください。IDDDの導入状況を自動検出し、進捗ダッシュボードとともに次に実行すべきコマンドを案内します。

---

**「どのような情報が存在するか？」から始めてください。「どのような機能を作るべきか？」ではありません。**

IDDDは**情報モデル**をすべてのソフトウェア開発の中心に据える開発方法論であり、AIエージェントスキルパッケージです。技術選定が行われる*前に*、厳密な Entity カタログ、データモデル、ビジネスルール、ドメイン用語集を先に構築することで、IDDDは論理モデルの段階でアプリケーション動作の80%がすでに定義されることを保証します。その後、情報モデルは要件、APIコントラクト、画面設計、バリデーションルールが体系的に導出される生成中心（generative center）となります。

本パッケージはIDDDをAIエージェントスキル、Harness Hook、ドキュメントテンプレートセットとしてインストールし、コーディングエージェントが開発ライフサイクル全体を通じて情報優先（information-first）の原則を強制できるようにします。

---

## IDDDとは何か？

多くのソフトウェアプロジェクトは*「どのような機能を作るべきか？」*という問いから始まり、すぐに実装に着手します。IDDDはこれを逆転させます。**「このドメインにどのような情報が存在するか？」**から始め、情報モデルを仕様書の一セクションではなく、他のすべての開発成果物が導出される**唯一の真実の源泉（single source of truth）**として扱います。

### 核心原則

1. **情報モデルが生成中心である。** すべてのコード、API、UI、テストは Entity カタログとデータモデルから導出されます。コードが仕様と不一致の場合、仕様が優先されます。
2. **Entity 優先識別。** コードを書く前に Entity を識別し文書化する必要があります。新しい機能は「どのエンドポイントが必要か？」ではなく「どの Entity が関連するか？」から始まります。
3. **データモデルのトレーサビリティ。** コードベースのすべてのカラム、制約、Relationship は Entity カタログの項目まで追跡可能でなければなりません。追跡できないスキーマ要素はドリフト（drift）とみなされます。
4. **出力優先設計。** 入力（フォーム、API）を設計する前に、ユーザーが*見るもの*（ダッシュボード、レポート、リスト）をまず設計します。出力のイメージが情報モデルを駆動します。
5. **ビジネスルールは明示的である。** すべてのバリデーション、制約、導出ルールは BR-xxx 識別子で登録されます。コードにのみ存在するルールは負債（debt）とみなされます。

### 3段階データモデリングとソフトウェア開発のマッピング

IDDDは伝統的な3段階データモデリングプロセスをソフトウェア開発段階に直接マッピングします：

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

情報モデルの各要素は自動的に開発成果物を含意します：

| 情報モデル要素                 | 導出される成果物                                       |
|-------------------------------|-------------------------------------------------------|
| Entity 識別                   | 要件スコープ、ユーザーストーリー                        |
| Relationship & Cardinality    | APIエンドポイント構造、ナビゲーション                    |
| Attribute & データ型           | フォームフィールド、バリデーションルール、DTO             |
| 制約                          | 入力バリデーション、型定義                               |
| 派生 Attribute                | ビジネスロジック、計算ルール                              |
| 状態遷移                      | ワークフロー、状態管理                                   |
| 集約 / 関連ルール              | トランザクション境界、整合性ルール                        |

**論理モデルが完成すれば、技術選定が行われる前にアプリケーション動作の80%がすでに定義されます。**

---

## 対応プラットフォーム

| プラットフォーム | エージェントシステム    | マルチエージェント戦略                                |
|-----------------|------------------------|------------------------------------------------------|
| Claude Code     | Claude Agent Teams     | ピアメッセージング、独立ワークツリー                   |
| OpenAI Codex    | Codex Agents SDK       | MCP Serverを介したハンドオフパターン                   |

---

## 前提条件

| 要件            | 詳細                                                 |
|-----------------|------------------------------------------------------|
| Node.js         | **18+** (npm または互換パッケージマネージャー含む)    |
| Claude Code     | **Claude Max** メンバーシップ + Agent Teams 有効化    |
| OpenAI Codex    | **ChatGPT Plus** 以上 (Pro/Business/Enterprise)       |

Node.js 18+ と npm が必要です。AIプラットフォームのサブスクリプションは使用するプラットフォームに応じて必要です。

---

## インストール

```bash
npm i -g id3-cli
```

グローバルインストール時に2つのグローバルスキル（`/id3-start`、`/id3-clear`）が登録され、すべてのプロジェクトで使用できます。プロジェクトで初めて `/id3-start` を実行すると、IDDDの導入状況を自動検出し、次のステップを案内します。

### オプション

| オプション       | 説明                                                     |
|-----------------|----------------------------------------------------------|
| `[target-dir]`  | 対象ディレクトリ（デフォルト：カレントディレクトリ `.`）     |
| `--no-symlink`  | シンボリックリンクの代わりにスキルファイルをコピー（Windowsで有用） |
| `--platform`    | プラットフォーム強制指定：`claude`、`codex`、または `all`   |

### 上書き検出

対象ディレクトリに `CLAUDE.md` がすでに存在する場合、`id3-cli` は次のように確認します：

```
"IDDD appears to be already installed. Overwrite? (y/N)"
```

### インストール後の出力

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

## インストール後のディレクトリ構造

`npm i -g id3-cli` 実行後、以下のグローバルスキルがシステム全体にインストールされます：

```
~/.claude/skills-global/              グローバルスキル（npm i -g でインストール）
  ├── id3-start/                      IDDDエントリポイント
  │   ├── SKILL.md
  │   └── references/
  │       ├── phase-guide.md            Phase ルーティング分類体系
  │       └── dashboard-template.md     進捗ダッシュボード形式
  └── id3-clear/                      プロジェクト初期化
      └── SKILL.md
```

`/id3-start` 実行後（または `id3-cli init .`）、プロジェクトは以下の構造になります：

```
your-project/
│
│   ===== 共通（全プラットフォーム） =====
│
├── skills/                          スキル原本（唯一の真実の源泉）
│   ├── id3-identify-entities/       Phase 0/1：Entity 識別
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   既存コードからの逆抽出
│   │       └── phase1-greenfield.md   新規プロジェクト向け構造化インタビュー
│   ├── id3-design-information/      Phase 2：情報構造化
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── phase2-procedure.md    精緻化手順
│   ├── id3-design-ui/               Phase 2.5：UI設計 & 実装
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── step1-structure-derivation.md
│   │       ├── step2-visual-contract.md
│   │       ├── step3-gate-and-mockup.md
│   │       └── step4-implementation.md
│   ├── id3-spawn-team/              マルチエージェント実装ディスパッチ
│   ├── id3-info-audit/              エントロピー監査（ドリフト検出）
│   └── id3-preview/                 情報モデルビジュアルプレビュー
│
├── specs/                           情報モデル成果物
│   ├── entity-catalog.md              Entity 一覧 + サマリーテーブル
│   ├── data-model.md                  Mermaid ERD + 設計決定事項
│   ├── ui-inventory.md                画面一覧 + マッピングマトリクス
│   ├── ui-structure.md                画面一覧 + ナビゲーション（Phase 2.5）
│   └── ui-design-contract.md          デザイントークン + コンポーネントマッピング（Phase 2.5）
│
├── docs/                            サポートドキュメント
│   ├── business-rules.md              BR-xxx インデックス付きビジネスルール
│   ├── domain-glossary.md             用語 / 英名 / 定義 / 備考
│   ├── info-debt.md                   不整合トラッカー
│   └── model-changelog.md            Keep a Changelog 形式
│
├── steering/                        プロジェクトレベル規約
│   ├── product.md                     プロダクトビジョン & スコープ（ユーザー記述）
│   └── data-conventions.md            PK戦略、命名規約、タイムスタンプ等
│
├── hooks/                           Harness Hook スクリプト（ビルド済みJSバンドル）
│   ├── iddd-schema-drift.js           スキーマドリフト検出
│   ├── iddd-rule-check.js             ビジネスルール追跡
│   ├── iddd-auto-audit.js             自動エントロピー監査
│   ├── pre-commit                     Git Hook（schema-drift + rule-check）
│   └── post-commit                    Git Hook（auto-audit）
│
├── .iddd/                           IDDD内部状態
│   ├── commit-count                   auto-audit 間隔カウンター
│   └── preview/                       生成されたプレビューHTML
│
│   ===== プラットフォーム：Claude Code =====
│
├── CLAUDE.md                        リードエージェントコンテキスト文書
├── .claude/
│   ├── settings.local.json            Hook 登録（init により注入）
│   ├── skills/ -> skills/             skills/ 原本へのシンボリックリンク
│   └── hooks/
│       └── hook-config.json           IDDD Hook 設定
│
│   ===== プラットフォーム：OpenAI Codex =====
│
├── AGENTS.md                        クロスプラットフォームエージェント指針
├── .agents/
│   └── skills/ -> skills/             skills/ 原本へのシンボリックリンク
└── .codex/
    └── hooks.json                     Codex Hook 設定
```

### スキルファイル共有戦略

スキルコンテンツは単一の正規位置（`skills/`）で管理されます。プラットフォーム固有のパス（`.claude/skills/`、`.agents/skills/`）は `init` CLI が動的に生成するシンボリックリンクです。これにより、すべてのプラットフォームにわたって単一のメンテナンスポイントを確保します。Windowsでは `--no-symlink` を使用してコピーを作成してください。

---

## ワークフロー

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

### Phase 別ガイド

> **ヒント：** 最初に `/id3-start` を実行すると、現在の進捗状況と次のステップを案内します。その後は以下の個別コマンドを直接使用してください。

**Phase 0/1：Entity 識別：**
`/id3-identify-entities` を実行してください。エージェントが既存コードベースがあるか（ブラウンフィールド）、新規に開始するか（グリーンフィールド）を自動検出した後、適切な識別フローを実行します。

**Phase 2：情報設計：**
`/id3-design-information` を実行してください。エージェントが概念モデルを論理モデルに精緻化し、ビジネスルールを導出し、バージョンヘッダーと Hook 設定を構成します。

**Phase 2.5：UI設計：**
`/id3-design-ui` を実行してください。エージェントが Entity カタログから画面構造を導出し、デザイントークンでビジュアルデザインコントラクトを策定し、インタラクティブモックアッププレビューとともに7-Pillar品質ゲートを実行した後、Agent Teams を生成して画面を並列実装し、事後監査を行います。

**Phase 3-5：Agent Teams による実装：**
`/id3-spawn-team` を実行してください。エージェントが確定済みの情報モデルを読み込み、専門エージェントチーム（spec-generator、implementer、qa-reviewer）を生成してシステムを並列実装します。

---

## スキル

### id3-start（グローバル：エントリポイント）

IDDDのエントリポイントです。最初に一度実行すると、プロジェクト設定、進捗ダッシュボード、次のステップの案内を提供します。リクエストを一緒に渡すと、正しい Phase スキルにルーティングします。その後は案内された個別コマンドを直接使用してください。

**機能：**

1. **自動セットアップ：** 現在のプロジェクトにIDDDがインストールされているかを検出します（`specs/entity-catalog.md` + `CLAUDE.md`）。インストールされていない場合、自動的に `id3-cli init .` を実行してIDDDをセットアップします。
2. **進捗ダッシュボード：** 各 Phase（Phase 0/1、Phase 2、Phase 2.5、Phase 3-5）の完了状態をビジュアルシンボル（完了チェックマーク、進行中ダイヤモンド、未着手サークル）と進捗バーで示す Phase パイプラインを表示します。
3. **インテントルーティング：** リクエストを一緒に渡すと、正しい Phase スキル（`/id3-identify-entities`、`/id3-design-information`、`/id3-design-ui`、`/id3-spawn-team`、`/id3-info-audit`、または `/id3-preview`）にルーティングします。
4. **曖昧なリクエストの処理：** リクエストが複数の Phase にマッチする可能性がある場合（例：「リストにフィルターを追加」：UI変更のみか、新しいデータ Entity が必要か）、ルーティング前に明確化のための質問を行います。
5. **UIクイックパス：** リクエストが明示的なUIキーワードのみを含み、データモデルがすでに存在する場合（version >= 1.0）、Entity に関する質問なしで直接 `/id3-design-ui` にルーティングします。
6. **前提条件チェック：** 対象 Phase の前提条件が満たされていない場合、警告を出し、正しい開始 Phase を提案します。

**使い方：**

```
/id3-start                             ダッシュボード表示 + 次のコマンド案内
```

**インストール：** `npm i -g id3-cli` で `~/.claude/skills-global/id3-start/` にグローバルインストールされます。

---

### id3-identify-entities (Phase 0/1)

IDDDワークフローのエントリポイントです。このスキルはブラウンフィールドとグリーンフィールドのパスを**自動分岐**します。

**自動検出ロジック：** スキルはプロジェクトルートでORM/スキーマファイル（Prisma、Drizzle、Django models、TypeORM entities、SQL migrations、Sequelize configs）をスキャンします。見つかった場合は Phase 0 に進み、そうでなければ Phase 1 に進みます。

#### Phase 0：ブラウンフィールド：情報モデルの逆抽出

既存コードベースの場合、エージェントが4つのレイヤーから暗黙の情報モデルを体系的に抽出します：

| レイヤー | ソース            | 調査対象                                               | 信頼度     |
|---------|------------------|--------------------------------------------------------|-----------|
| L1      | DBスキーマ        | テーブル、カラム、FK、インデックス、制約                  | 最高      |
| L2      | ORM / モデル      | 仮想フィールド、派生 Attribute、ソフトデリート、状態       | 高       |
| L3      | APIコントラクト    | エンドポイント、DTO、バリデーションロジック                | 中       |
| L4      | フロントエンド     | ルート、コンポーネント、フォームフィールド                 | 参考      |

L4の調査は徹底的です：ファイルベースルーティング（Next.js `app/`、`pages/`）、React Router、Vue Router等をスキャンし、画面-Entity マッピングマトリクスを含む完全なUIインベントリ（`specs/ui-inventory.md`）を構築します。

発見事項は**一致**（レイヤー間で一貫性あり）、**不一致**（`docs/info-debt.md` に記録）、**暗黙的**（コードロジックに隠れていたものを明示的ビジネスルールとして導出）に分類されます。

抽出後、**検証インタビュー**を通じてユーザーと正確性を確認します。

**生成される成果物：** `specs/entity-catalog.md`、`specs/data-model.md`、`specs/ui-inventory.md`、`docs/business-rules.md`、`docs/info-debt.md`

#### Phase 1：グリーンフィールド：構造化インタビュー

新規プロジェクトの場合、エージェントがドメイン情報を発見するための構造化インタビューを実施します：

1. **情報識別：** 「このシステムが管理する主要な『もの』（名詞）は何ですか？」
2. **Relationship 発見：** 「これらはどのように関連していますか？一対多ですか、多対多ですか？」
3. **ルール発見：** 「どのようなルールが強制されるべきですか？状態遷移はありますか？」
4. **Silverston 汎用パターンチェックリスト：** エージェントが発見された Entity を検証済みパターンと照合します：Party、Product/Service、Order/Transaction、Classification、Status/Lifecycle、Hierarchy、Contact Mechanism、Document/Content。

**生成される成果物：** `specs/entity-catalog.md`、`specs/data-model.md`、`docs/business-rules.md`

---

### id3-design-information (Phase 2)

概念モデルを**論理モデル**に精緻化します。ビジネスルール、バリデーション制約、導出ルールが情報モデルから自動的に導出されます。

**前提条件：** `specs/entity-catalog.md` に最低2つの識別済み Entity が存在する必要があります。

**手順：**

1. **Attribute 精緻化：** 具体的なデータ型（UUID、TEXT、INTEGER、TIMESTAMP、JSONB等）、NOT NULL / DEFAULT / UNIQUE 制約、インデックス要件を割り当てます。
2. **Relationship 具体化：** FK配置、削除/更新ルール（CASCADE、SET NULL、RESTRICT）を決定し、多対多 Relationship のための結合テーブルを識別します。
3. **自動ビジネスルール導出：**
   - NOT NULL 制約 --> 「このフィールドは必須です」（BR-xxx）
   - UNIQUE 制約 --> 「重複は許可されません」（BR-xxx）
   - FK + CASCADE --> 「親を削除すると子も削除されます」（BR-xxx）
   - 状態遷移 --> 「許可される遷移パス」（BR-xxx）
   - 派生 Attribute --> 「計算ルール」（BR-xxx）
4. **設計決定の質問：** エージェントが大容量データ保存戦略、ソフトデリートの範囲、マルチテナンシー、監査トレイルの必要性等についてユーザーに質問します。
5. **成果物確定：** すべての仕様ファイルをバージョンヘッダーと Hook 設定で更新します。

**更新される成果物：** `specs/entity-catalog.md`、`specs/data-model.md`、`docs/business-rules.md`

---

### id3-design-ui (Phase 2.5)

情報モデルからUI構造とビジュアルデザインを導出した後、Agent Teams を使用して画面を実装します。

**前提条件：** Phase 2 完了（`entity-catalog.md` version >= `"1.0"`）。

**4段階パイプライン：**

1. **UI構造導出：** 9つの導出ルール（entity -> list/detail/form/dashboard）を使用して Entity を画面に自動マッピングします。12のタイプベースルールで Attribute を Widget にマッピングします。「出力優先、入力後回し」の原則を適用します。
2. **ビジュアルデザインコントラクト：** 既存のフロントエンドフレームワーク（React、Vue、Svelte等）とUIライブラリを検出します。5つのデザイントークン領域（spacing、typography、color、copywriting、component registry）を策定します。
3. **実装前ゲート：** 7-Pillar検証（構造完全性、spacing、typography、color、copywriting、component registry、traceability）を実行します。サンプルデータで3段階HTMLモックアップ（wireframe、styled、interactive）を生成します。
4. **実装 + 事後監査：** Agent Teams を生成して画面を並列実装します。実装後のビジュアル監査が各 Pillar を1-4でスコア化し、上位3つの修正事項を導出します。

**成果物：** `specs/ui-structure.md`、`specs/ui-design-contract.md`、`.iddd/preview/mockup-*.html`、`.iddd/preview/ui-audit.html`

---

### id3-spawn-team (Phase 3-5)

確定済みの情報モデルに基づき、システムを実装する専門エージェントチームを生成します。

**前提条件：** `specs/entity-catalog.md` と `specs/data-model.md` が存在し、Phase 2 が完了している必要があります。

#### Claude Code：Agent Teams

3名のチームメンバーが生成され、それぞれ独立したコンテキストウィンドウと独立した Git ワークツリーを持ちます：

| チームメンバー    | 役割                                                          |
|------------------|---------------------------------------------------------------|
| spec-generator   | 情報モデルを requirements.md と api-contracts.md に変換        |
| implementer      | 仕様からコードをビルド、Entity ごとに1つのアトミックコミット     |
| qa-reviewer      | 情報モデルに対して実装を検証、失敗時は implementer に直接メッセージ送信 |

**タスク生成ルール：**
- Entity カタログを読み取り、Entity ごとに1つのタスクを生成します（モデル + マイグレーション + API + バリデーション + テスト）。
- データモデルの FK 依存関係が依存グラフを決定します。
- 独立した Entity は並列実行され、依存する Entity は親の完了を待ちます。

#### OpenAI Codex：Agents SDK + ハンドオフパターン

Codex ではマルチエージェントタスクが Agents SDK ハンドオフパターンを使用します。Codex は MCP Server（`codex --mcp-server`）として起動され、プロジェクトマネージャーエージェントが Entity カタログを読み取り、同じ3つの役割（spec-generator、implementer、qa-reviewer）にハンドオフを通じてタスクを分配します。

---

### id3-info-audit

情報モデルに対してコードベースを監査し、ドリフトとエントロピーを検出します。

**手順：**

1. `specs/entity-catalog.md` から Entity 一覧を読み取ります。
2. コードベースで以下をスキャンします：
   - 未実装 Entity / 未定義モデル
   - `docs/business-rules.md` のビジネスルールがコードに反映されていない場合
   - データ型 / 制約の不一致
3. `specs/ui-structure.md` と `specs/ui-design-contract.md` に対するUI整合性を確認します：
   - 未実装画面 / 未定義画面
   - フォームフィールド対 Attribute マッピングの不一致
   - 欠落したナビゲーションパス
4. バージョンヘッダー（`last_verified`、`audit_status`）を更新します。
5. Hook バイパス履歴（`.iddd/skip-history.log`）を確認します。
6. Entity ごとの状態レポートをビジュアル指標とともに出力します。

**ビジュアル出力：** 監査結果は `.iddd/preview/audit-{date}.html` にインタラクティブHTMLダッシュボードとしてレンダリングされます。

---

### id3-preview

情報モデルと監査結果をブラウザで閲覧できるよう、軽量ローカルHTTPサーバーを起動します。

サーバーは `listen(0)`（OS割り当てポート）を使用し、以下を提供します：
- **ERDプレビュー：** Entity クリック時にカタログ詳細へ遷移するインタラクティブ Mermaid ERD
- **UIモックアップ：** `specs/ui-structure.md` と `specs/ui-design-contract.md` から導出されたワイヤーフレームレイアウト
- **監査ダッシュボード：** ビジネスルールカバレッジを含む Entity ごとのステータスカード

すべてのHTMLファイルは `.iddd/preview/` に保持され、サーバーなしでもブラウザで直接開くことができます。

---

### id3-clear（グローバル：プロジェクト初期化）

現在のプロジェクトからIDDDが生成したすべてのファイルを安全に削除し、IDDD導入前の状態に復元します。

**手順：**

1. **インストール確認：** プロジェクトにIDDDファイルが存在するかを確認します。存在しない場合、「IDDDファイルが見つかりません」と報告して中断します。
2. **削除対象スキャン：** どのIDDDディレクトリ（`specs/`、`docs/`、`steering/`、`hooks/`、`skills/`、`.claude/skills/`、`.claude/hooks/`、`.codex/skills/`、`.agents/skills/`、`.iddd/`）とファイル（`CLAUDE.md`、`AGENTS.md`）が実際に存在するかを特定します。
3. **警告表示：** 削除されるすべてのファイルとディレクトリの詳細リストを表示します。ユーザー作成ファイル（`steering/product.md`、`steering/data-conventions.md`）には特別な注記を追加します。
4. **確認要求：** `[y/N]` でプロンプトします（デフォルト N）。明示的に「y」または「yes」と入力した場合にのみ続行します。
5. **削除実行：** 特定された対象のみを削除します。削除数を含む完了サマリーを表示します。

**安全ルール：**
- 既知のIDDDファイルリスト以外のファイルは絶対に削除しない
- `rm -rf *` のようなグロブパターンは絶対に使用しない
- 確認ステップは絶対にスキップしない
- 選択的削除が必要な場合は手動ファイル操作を使用してください

**インストール：** `npm i -g id3-cli` で `~/.claude/skills-global/id3-clear/` にグローバルインストールされます。

---

## Harness Hook システム

IDDDは自動化された Hook を通じて情報優先の原則を強制します。哲学は「プロセスに従ってください」ではなく、**「従わなければコミットがブロックされます。」**です。

### Hook 概要

| Hook           | トリガー          | 動作                                                | 重大度      |
|----------------|------------------|-----------------------------------------------------|------------|
| schema-drift   | pre-commit       | スキーマ変更が entity-catalog.md と一致するか検証     | **BLOCK**（コミット拒否） |
| rule-check     | pre-commit       | 新しいバリデーションロジックが business-rules.md にあるか確認 | **WARN**（コミット許可、メッセージ表示） |
| auto-audit     | post-commit      | N回コミットごとに info-audit を実行                   | **INFO**（レポート生成） |

### schema-drift (BLOCK)

スキーマ関連ファイル（Prisma、Drizzle、Django models、TypeORM entities、SQL migrations等）を変更する際、Hook が `specs/entity-catalog.md` も同時に更新されているかを確認します。更新されていなければコミットが**拒否**されます。情報モデルは常にコード*よりも先に*更新される必要があります。

**モニタリングファイルパターン**（設定可能）：
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check (WARN)

バリデーションロジック（Zod、Yup、Joi、Pydantic等）を追加または変更する際、Hook が `docs/business-rules.md` に対応する `BR-xxx` エントリがあるかを確認します。ない場合は警告が発生します。コミットは続行されますが、欠落しているルールが表示されます。

**モニタリングファイルパターン**（設定可能）：
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit (INFO)

N回コミットごと（デフォルト：10、設定可能）に、Harness がコードベースを情報モデルと比較する info-audit を自動実行します。コミットカウンターは `.iddd/commit-count` に保存されます。結果は `.iddd/preview/audit-{date}.html` に記録されます。

### Hook 設定

すべての Hook 設定は `.claude/hooks/hook-config.json`（Claude Code）または `.codex/hooks.json`（Codex）にあります。

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

すべてのIDDD Hook を無効化するには、最上位の `"enabled"` を `false` に設定してください。個別の Hook を無効化するには、該当 Hook の `"enabled"` を `false` に設定してください。auto-audit の頻度を変更するには `"interval_commits"` を調整してください。

### Hook バイパス

`IDDD_SKIP_HOOKS=1` を設定すると、すべての Hook を一時的にスキップします。バイパス記録は `.iddd/skip-history.log` に残り、監査時にレビューされます。

---

## エントロピー管理

時間の経過とともに情報モデルとコードは乖離します。IDDDは3つのメカニズムでエントロピーに対処します：

### バージョンヘッダー

`specs/entity-catalog.md` と `specs/data-model.md` にはモデル状態を追跡するYAMLフロントマターが含まれています：

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

**ルール：**
- `version` は各 Phase 完了時にインクリメントされます（Phase 1：`"0.1"`、Phase 2：`"1.0"`、以降：`"1.1"`、`"1.2"`、...）。
- `last_verified` はモデルが監査または検証されるたびに更新されます。
- `last_verified` が**7日以上経過**すると、エージェントが新しいタスクを進める前に `/id3-info-audit` の実行を推奨します。古いモデルはドリフトを引き起こします。

### 変更ログ

すべてのモデル変更は [Keep a Changelog](https://keepachangelog.com/) 形式で `docs/model-changelog.md` に記録されます：

```markdown
## [1.0] -- 2026-04-05
### Phase 2 Complete
- 12 entities finalized in logical model
- 19 business rules derived
- Design decisions: D-01 (S3 separation), D-02 (multi-tenant reservation), D-03 (soft delete scope)
- UI proposals: 6 screens generated
```

### 自動監査

`auto-audit` Hook（post-commit）はN回コミットごとに全体情報監査を実行し、ドリフトが蓄積する前に捕捉します。

---

## カスタマイズガイド

IDDDはプロジェクトの規約に合わせて適応できるよう設計されています。カスタマイズ項目と編集対象ファイルは以下の通りです：

| カスタマイズ項目                                       | 編集対象ファイル                      |
|------------------------------------------------------|--------------------------------------|
| プロダクトビジョン & スコープ                           | `steering/product.md`                |
| 命名規約、PK戦略、タイムスタンプ、ソフトデリートポリシー、ENUM vs 参照テーブル | `steering/data-conventions.md` |
| Entity 定義                                           | `specs/entity-catalog.md`            |
| データモデル（ERD）                                    | `specs/data-model.md`                |
| ビジネスルール                                         | `docs/business-rules.md`             |
| ドメイン用語集                                         | `docs/domain-glossary.md`            |
| UI画面インベントリ                                     | `specs/ui-inventory.md`              |
| UI構造（画面導出）                                     | `specs/ui-structure.md`              |
| UIデザインコントラクト（トークン、コンポーネント）        | `specs/ui-design-contract.md`        |
| Hook 動作（有効化/無効化、重大度）                      | `.claude/hooks/hook-config.json`     |
| Hook モニタリングファイルパターン                        | `.claude/hooks/hook-config.json`     |
| auto-audit コミット間隔                                 | `.claude/hooks/hook-config.json`     |
| Codex Hook 設定                                        | `.codex/hooks.json`                  |

**ヒント：** すべての `specs/` と `docs/` ファイルはバージョンヘッダーを含むYAMLフロントマターを使用しています。IDDD Harness はこのバージョンを追跡してエントロピードリフトを検出します。仕様ファイルを変更する際は必ずバージョンヘッダーを更新してください。

---

## 使用例

### 例1：新規プロジェクトの開始（グリーンフィールド）

```
$ npm i -g id3-cli
$ mkdir my-saas && cd my-saas && git init
$ claude
> /id3-start SaaS ドメインの Entity を識別してください

  ╔════════════════════════════════════════════════════════════════╗
  ║  Welcome to IDDD -- Information Design-Driven Development.     ║
  ║  Your information model is your harness.                       ║
  ╚════════════════════════════════════════════════════════════════╝

  IDDD is not set up in this project. Setting up now...
  IDDD initialized. Here is your project dashboard:

  （ダッシュボードにすべての Phase が ○ -- 未着手と表示）

  Routing to /id3-identify-entities -- 構造化インタビューを通じてドメイン Entity を識別します。
  この Phase で生成される成果物：specs/entity-catalog.md、specs/data-model.md、docs/business-rules.md

  Agent: "システムが管理する主要な『もの』は何ですか？"
  You: "Users, Organizations, Subscriptions, Invoices, Features"
  Agent: "Users と Organizations はどのように関連していますか？"
  You: "role Attribute を持つ Membership Entity を介した多対多の関係です。"
  ...

  Entity catalog produced: specs/entity-catalog.md (5 entities, 7 relationships)

> /id3-design-information

  概念モデルを論理モデルに精緻化します。

  Agent refines attributes, derives 14 business rules.
  specs/entity-catalog.md updated (version: 1.0)
  docs/business-rules.md updated (BR-001 through BR-014)

> /id3-design-ui

  情報モデルからUIを導出し実装します。

  Step 1: Deriving UI structure from 5 entities... 8 screens mapped
  Step 2: Design contract established (React + Tailwind detected)
  Step 3: 7-Pillar gate passed. Mockup preview: http://localhost:52341
  Step 4: Spawning Agent Teams for screen implementation...
  Post-audit: all 7 pillars scored 3+/4

  specs/ui-structure.md generated
  specs/ui-design-contract.md generated

> /id3-spawn-team

  Agent Teams を生成して並列実装します。

  Spawning Agent Teams:
  - spec-generator: generating requirements.md, api-contracts.md
  - implementer: building User -> Organization -> Membership -> ...
  - qa-reviewer: verifying against information model
```

### 例2：既存プロジェクトへの適用（ブラウンフィールド）

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

## 知的系譜

IDDDは複数の知的伝統のアイデアを統合しています：

- **Peter ChenのER Model（1976）：** 「現実世界は Entity と Relationship で構成される。」情報構造がアプリケーションロジックに先行するという根本的洞察。
- **Len SilverstonのUniversal Data Models：** 発見された Entity を検証するチェックリストとして機能する再利用可能な情報パターン（Party、Product、Order、Hierarchy）。
- **Eric EvansのDomain-Driven Design（2003）：** Bounded Context、Ubiquitous Language、Aggregate パターン。IDDDはドメイン言語と明示的境界への重視を継承しています。
- **Sophia PraterのOOUX（Object-Oriented UX）：** 「インタラクションよりオブジェクトを先に設計せよ。」ORCAフレームワーク（Objects、Relationships、CTAs、Attributes）がIDDDの出力優先UI導出に直接影響を与えています。
- **Jamie Lordの"Data First, Code Second"（2024）：** 「知識をデータに折り畳め。」Unix表現規則を現代のソフトウェア開発に適用。
- **Mitchell HashimotoのHarness Engineering（2026）：** `Agent = Model + Harness`。AIエージェントが時間の経過とともに効果的であり続けるには、アーキテクチャ上の制約、コンテキストエンジニアリング、エントロピー管理が必要であるという洞察。IDDDの Hook システム、バージョンヘッダー、auto-audit は Harness Engineering 原則の直接的適用です。

**核心的洞察：** *論理モデルが完成すれば、技術選定が行われる前にアプリケーション動作の80%がすでに定義されます。そして、その情報モデル自体がAIエージェントにとって最高の Harness です。*

---

## ライセンス

MIT

---

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│    "What information exists?" -- always the first question.      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

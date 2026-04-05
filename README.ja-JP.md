<div align="center">

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
║    ╚═╝╚═════╝ ╚═════╝ ╚═════╝                                    v0.9.3                ║
║                                                                                        ║
║  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -               ║
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

**「どんな情報が存在するか？」から始める -- 「どんな機能を構築すべきか？」からではなく**

IDDDは、**情報モデル**をソフトウェア開発全体の中心に据える開発方法論およびAIエージェントスキルパッケージです。技術選定の前に、厳密な Entity カタログ、データモデル、ビジネスルール、ドメイン用語集を構築することで、IDDDは論理モデルの段階でアプリケーション動作の80%がすでに定義されていることを保証します。情報モデルは、要件、API コントラクト、画面設計、バリデーションルールが体系的に導出される生成的中心となります。

このパッケージは、IDDDをAIエージェントスキル、Harness Hook、およびドキュメントテンプレートのセットとしてインストールし、コーディングエージェントが開発ライフサイクル全体を通じて情報優先の規律を強制できるようにします。

---

## IDDDとは？

多くのソフトウェアプロジェクトは*「どんな機能を構築すべきか？」*と問うことから始まり、すぐに実装に飛び込みます。IDDDはこれを逆転させます。**「このドメインにはどんな情報が存在するか？」**から出発し、情報モデルを仕様書の一セクションとしてではなく、他のすべての開発成果物が導出される**唯一の信頼できる情報源**として扱います。

### 基本原則

1. **情報モデルが生成的中心である。** すべてのコード、API、UI、テストは Entity カタログとデータモデルから導出されます。コードと仕様が矛盾する場合、仕様が優先されます。
2. **Entity 優先の識別。** コードを書く前に、Entity を識別して文書化する必要があります。新機能は「どの Entity が関係するか？」から始まり、「どのエンドポイントが必要か？」からではありません。
3. **データモデルのトレーサビリティ。** コードベース内のすべてのカラム、制約、Relationship は Entity カタログのエントリまで遡れなければなりません。追跡されていないスキーマ要素はドリフトとみなされます。
4. **出力優先の設計。** 入力（フォーム、API）を設計する前に、ユーザーが*見る*もの（ダッシュボード、レポート、一覧）を設計します。出力イメージが情報モデルを駆動します。
5. **ビジネスルールは明示的である。** すべてのバリデーション、制約、導出ルールはBR-xxx識別子で登録されます。コードのみのルールは負債とみなされます。

### ソフトウェア開発にマッピングされた三段階データモデリング

IDDDは、古典的な三段階データモデリングプロセスをソフトウェア開発フェーズに直接マッピングします：

```
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Conceptual Model                         │         │  要件定義 / スコープ定義                  │
│  "どんな情報が存在するか？"               │────────>│  Entity 識別、ユーザーストーリー           │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
                    │
                    v
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Logical Model                            │         │  API コントラクト / バリデーション / BizLogic │
│  "どのように構造化されているか？"          │────────>│  動作の80%がここで定義される               │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
                    │
                    v
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Physical Model                           │         │  実装上の意思決定                         │
│  "どのように保存/実行されるか？"           │────────>│  技術選定、ストレージ、デプロイメント      │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
```

情報モデルの各要素は自動的に開発成果物を暗示します：

| 情報モデル要素               | 導出される成果物                                    |
|------------------------------|-----------------------------------------------------|
| Entity 識別                  | 要件スコープ、ユーザーストーリー                     |
| Relationship と Cardinality  | API エンドポイント構造、ナビゲーション               |
| Attribute とデータ型         | フォームフィールド、バリデーションルール、DTO        |
| 制約                         | 入力バリデーション、型定義                           |
| 導出 Attribute               | ビジネスロジック、計算ルール                         |
| 状態遷移                     | ワークフロー、状態管理                               |
| 集約 / 関連ルール            | トランザクション境界、整合性ルール                   |

**論理モデルが完成すると、技術選定の前にアプリケーション動作の80%がすでに定義されています。**

---

## 対応プラットフォーム

| プラットフォーム | エージェントシステム      | マルチエージェント戦略                               |
|------------------|---------------------------|------------------------------------------------------|
| Claude Code      | Claude Agent Teams        | ピアメッセージング、独立ワークツリー                 |
| OpenAI Codex     | Codex Agents SDK          | MCP Server を介した Handoff パターン                 |

---

## 前提条件

| 要件           | 詳細                                                 |
|----------------|------------------------------------------------------|
| Node.js        | **18+**（npm または互換性のあるパッケージマネージャ） |
| Claude Code    | **Claude Max** メンバーシップ + Agent Teams 有効化    |
| OpenAI Codex   | **ChatGPT Plus** 以上（Pro/Business/Enterprise）      |

インストーラ `npx` のために Node.js が必要です。AIプラットフォームのサブスクリプションは、使用するプラットフォームに応じて必要です。

---

## インストール

```bash
npx id3-cli@latest
```

サブコマンドは不要です -- `id3-cli` は直接 init プロセスを実行します。以下を行います：

1. すべてのIDDDテンプレート（仕様、ドキュメント、ステアリング、スキル、Hook）をプロジェクトにコピーします。
2. プラットフォーム固有のシンボリックリンク（`.claude/skills/` または `.agents/skills/`）を作成し、正規の `skills/` オリジナルを指すようにします。
3. プラットフォームの設定ファイルに Harness Hook を登録します。
4. `.iddd/` 状態ディレクトリ（コミットカウンタ、プレビュー出力）を初期化します。

### オプション

| オプション      | 説明                                                     |
|-----------------|----------------------------------------------------------|
| `[target-dir]`  | ターゲットディレクトリ（デフォルトはカレントディレクトリ `.`） |
| `--no-symlink`  | シンボリックリンクの代わりにスキルファイルをコピー（Windowsで有用） |
| `--platform`    | プラットフォームを強制指定: `claude`、`codex`、または `all` |

### 上書き検出

ターゲットディレクトリに `CLAUDE.md` がすでに存在する場合、`id3-cli` はプロンプトを表示します：

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

## インストール後のディレクトリ構造

`npx id3-cli@latest` を実行した後、プロジェクトに以下の構造が追加されます：

```
your-project/
│
│   ===== 共通（全プラットフォーム） =====
│
├── skills/                          スキルオリジナル（唯一の信頼できる情報源）
│   ├── id3-identify-entities/       Phase 0/1: Entity 識別
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   既存コードからの逆抽出
│   │       └── phase1-greenfield.md   新規プロジェクト向け構造化インタビュー
│   ├── id3-design-information/      Phase 2: 情報の構造化
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── phase2-procedure.md    リファインメント手順
│   ├── id3-design-ui/               Phase 2.5: UI設計と実装
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── step1-structure-derivation.md
│   │       ├── step2-visual-contract.md
│   │       ├── step3-gate-and-mockup.md
│   │       └── step4-implementation.md
│   ├── id3-spawn-team/              マルチエージェント実装のディスパッチ
│   ├── id3-info-audit/              エントロピー監査（ドリフト検出）
│   └── id3-preview/                 情報モデルのビジュアルプレビュー
│
├── specs/                           情報モデル成果物
│   ├── entity-catalog.md              Entity インベントリ + サマリーテーブル
│   ├── data-model.md                  Mermaid ERD + 設計上の意思決定
│   ├── ui-inventory.md                画面インベントリ + マッピングマトリクス
│   ├── ui-structure.md                画面インベントリ + ナビゲーション (Phase 2.5)
│   └── ui-design-contract.md          デザイントークン + コンポーネントマッピング (Phase 2.5)
│
├── docs/                            サポートドキュメント
│   ├── business-rules.md              BR-xxx インデックス付きビジネスルール
│   ├── domain-glossary.md             用語 / 英語 / 定義 / 備考
│   ├── info-debt.md                   不整合トラッカー
│   └── model-changelog.md            Keep a Changelog 形式
│
├── steering/                        プロジェクトレベルの規約
│   ├── product.md                     プロダクトビジョンとスコープ（ユーザー記述）
│   └── data-conventions.md            PK 戦略、命名規則、タイムスタンプなど
│
├── hooks/                           Harness Hook スクリプト（ビルド済みJSバンドル）
│   ├── iddd-schema-drift.js           schema-drift 検出
│   ├── iddd-rule-check.js             ビジネスルールの追跡
│   ├── iddd-auto-audit.js             自動エントロピー監査
│   ├── pre-commit                     Git Hook（schema-drift + rule-check）
│   └── post-commit                    Git Hook（auto-audit）
│
├── .iddd/                           IDDD 内部状態
│   ├── commit-count                   auto-audit インターバルカウンタ
│   └── preview/                       生成されたプレビューHTML
│
│   ===== プラットフォーム: Claude Code =====
│
├── CLAUDE.md                        リードエージェントのコンテキストドキュメント
├── .claude/
│   ├── settings.local.json            Hook 登録（init で注入）
│   ├── skills/ -> skills/             skills/ オリジナルへのシンボリックリンク
│   └── hooks/
│       └── hook-config.json           IDDD Hook 設定
│
│   ===== プラットフォーム: OpenAI Codex =====
│
├── AGENTS.md                        クロスプラットフォームエージェント指示書
├── .agents/
│   └── skills/ -> skills/             skills/ オリジナルへのシンボリックリンク
└── .codex/
    └── hooks.json                     Codex Hook 設定
```

### スキルファイル共有戦略

スキルコンテンツは単一の正規の場所（`skills/`）で管理されます。プラットフォーム固有のパス（`.claude/skills/`、`.agents/skills/`）は `init` CLI によって動的に作成されるシンボリックリンクです。これにより、すべてのプラットフォームで単一のメンテナンスポイントが保証されます。Windowsでは `--no-symlink` を使用してコピーを作成してください。

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

### Phase ウォークスルー

**Phase 0/1 -- Entity 識別：**
AIコーディングエージェントを開き、`/id3-identify-entities` を実行します。エージェントは既存のコードベースがあるか（ブラウンフィールド）、新規プロジェクトか（グリーンフィールド）を自動検出し、適切な識別フローを実行します。

**Phase 2 -- 情報設計：**
`/id3-design-information` を実行します。エージェントは概念モデルを論理モデルに洗練し、ビジネスルールを導出し、バージョンヘッダーと Hook 設定をセットアップします。

**Phase 2.5 -- UI設計：**
`/id3-design-ui` を実行します。エージェントは Entity カタログから画面構造を導出し、デザイントークンでビジュアルデザインコントラクトを確立し、インタラクティブなモックアッププレビュー付きの 7-Pillar 品質ゲートを実行した後、Agent Teams を生成して画面を並列実装し、事後監査を行います。

**Phase 3-5 -- Agent Teams による実装：**
`/id3-spawn-team` を実行します。エージェントは確定した情報モデルを読み込み、専門化されたエージェントチーム（spec-generator、implementer、qa-reviewer）を生成して、並列でシステムを実装します。

---

## スキル

### id3-identify-entities (Phase 0/1)

IDDDワークフローのエントリーポイント。このスキルはブラウンフィールドとグリーンフィールドのパスを**自動的に分岐**します。

**トリガーキーワード：** `identify entities`、`information analysis`、`domain analysis`、`new project`、`entity identification`

**自動検出ロジック：** スキルはプロジェクトルートでORM/スキーマファイル（Prisma、Drizzle、Djangoモデル、TypeORM Entity、SQLマイグレーション、Sequelize設定）をスキャンします。見つかった場合は Phase 0 に入り、そうでない場合は Phase 1 に入ります。

#### Phase 0: ブラウンフィールド -- 情報モデルの逆抽出

既存のコードベースに対して、エージェントは4つのレイヤーから暗黙の情報モデルを体系的に抽出します：

| レイヤー | ソース           | 調査内容                                               | 信頼性      |
|----------|------------------|--------------------------------------------------------|-------------|
| L1       | DBスキーマ       | テーブル、カラム、FK、インデックス、制約                | 最高        |
| L2       | ORM / モデル     | 仮想フィールド、導出 Attribute、論理削除、状態          | 高          |
| L3       | API コントラクト | エンドポイント、DTO、バリデーションロジック             | 中          |
| L4       | フロントエンド   | ルート、コンポーネント、フォームフィールド              | 参考        |

L4調査は徹底的です：ファイルベースルーティング（Next.js `app/`、`pages/`）、React Router、Vue Routerなどをスキャンし、画面-Entity マッピングマトリクスを含む完全なUIインベントリ（`specs/ui-inventory.md`）を構築します。

発見事項は**一致**（レイヤー間で整合性あり）、**不一致**（`docs/info-debt.md` に記録）、または**暗黙的**（コードロジックに隠れていたものを明示的なビジネスルールとして表出）に分類されます。

抽出後、**検証インタビュー**でユーザーに正確性を確認します。

**生成される成果物：** `specs/entity-catalog.md`、`specs/data-model.md`、`specs/ui-inventory.md`、`docs/business-rules.md`、`docs/info-debt.md`

#### Phase 1: グリーンフィールド -- 構造化インタビュー

新規プロジェクトに対して、エージェントはドメイン情報を発見するための構造化インタビューを実施します：

1. **情報の識別** -- 「このシステムが管理する核となる『もの』（名詞）は何ですか？」
2. **Relationship の発見** -- 「これらのものはどのように関連していますか？一対多ですか、多対多ですか？」
3. **ルールの発見** -- 「どんなルールを強制する必要がありますか？状態遷移はありますか？」
4. **Silverston ユニバーサルパターンチェックリスト** -- エージェントは発見された Entity を実証済みパターンと照合します：Party、Product/Service、Order/Transaction、Classification、Status/Lifecycle、Hierarchy、Contact Mechanism、Document/Content。

**生成される成果物：** `specs/entity-catalog.md`、`specs/data-model.md`、`docs/business-rules.md`

---

### id3-design-information (Phase 2)

概念モデルを**論理モデル**に洗練します。ビジネスルール、妥当性制約、導出ルールは情報モデルから自動的に導出されます。

**トリガーキーワード：** `design information`、`refine model`、`logical model`、`schema design`、`information structuring`

**前提条件：** `specs/entity-catalog.md` が存在し、少なくとも2つの識別済み Entity が含まれている必要があります。

**手順：**

1. **Attribute のリファインメント** -- 具体的なデータ型（UUID、TEXT、INTEGER、TIMESTAMP、JSONB など）、NOT NULL / DEFAULT / UNIQUE 制約、およびインデックス要件を割り当てます。
2. **Relationship の具体化** -- FK の配置、削除/更新ルール（CASCADE、SET NULL、RESTRICT）を決定し、多対多 Relationship のジャンクションテーブルを識別します。
3. **ビジネスルールの自動導出：**
   - NOT NULL 制約 --> 「このフィールドは必須です」(BR-xxx)
   - UNIQUE 制約 --> 「重複は許可されません」(BR-xxx)
   - FK + CASCADE --> 「親を削除すると子も削除されます」(BR-xxx)
   - 状態遷移 --> 「許可される遷移パス」(BR-xxx)
   - 導出 Attribute --> 「計算ルール」(BR-xxx)
4. **設計上の意思決定に関する質問** -- エージェントは、大容量データの保存戦略、論理削除のスコープ、マルチテナンシー、監査証跡のニーズなどについてユーザーに質問します。
5. **成果物の確定** -- すべての仕様ファイルをバージョンヘッダーと Hook 設定で更新します。

**更新される成果物：** `specs/entity-catalog.md`、`specs/data-model.md`、`docs/business-rules.md`

---

### id3-design-ui (Phase 2.5)

情報モデルからUI構造とビジュアルデザインを導出し、Agent Teams を使用して画面を実装します。

**トリガーキーワード：** `design ui`、`ui design`、`screen design`、`phase 2.5`、`ui structure`

**前提条件：** Phase 2 完了（`entity-catalog.md` version >= `"1.0"`）。

**4ステップパイプライン：**

1. **UI構造の導出** -- 9つの導出ルール（entity -> list/detail/form/dashboard）を使用して Entity を画面に自動マッピングします。12のタイプベースルールで Attribute を Widget にマッピングします。「出力優先、入力後回し」の原則を適用します。
2. **ビジュアルデザインコントラクト** -- 既存のフロントエンドフレームワーク（React、Vue、Svelte など）とUIライブラリを検出します。5つのデザイントークン領域（spacing、typography、color、copywriting、component registry）を確立します。
3. **実装前ゲート** -- 7-Pillar 検証（構造の完全性、spacing、typography、color、copywriting、component registry、traceability）を実行します。サンプルデータで3レベルのHTMLモックアップ（wireframe、styled、interactive）を生成します。
4. **実装 + 事後監査** -- Agent Teams を生成して画面を並列実装します。実装後のビジュアル監査が各 Pillar を1-4でスコアリングし、上位3つの修正点を導出します。

**成果物：** `specs/ui-structure.md`、`specs/ui-design-contract.md`、`.iddd/preview/mockup-*.html`、`.iddd/preview/ui-audit.html`

---

### id3-spawn-team (Phase 3-5)

確定した情報モデルに基づいてシステムを実装する専門化されたエージェントチームを生成します。

**前提条件：** `specs/entity-catalog.md` と `specs/data-model.md` が存在し、Phase 2 が完了している必要があります。

#### Claude Code: Agent Teams

3つのチームメンバーが生成され、それぞれ独立したコンテキストウィンドウと独立した Git ワークツリーを持ちます：

| チームメンバー   | 役割                                                          |
|------------------|---------------------------------------------------------------|
| spec-generator   | 情報モデルを requirements.md と api-contracts.md に変換        |
| implementer      | 仕様からコードを構築、Entity ごとのアトミックコミット          |
| qa-reviewer      | 情報モデルに対する実装を検証、失敗時は implementer にダイレクトメッセージを送信 |

**タスク生成ルール：**
- Entity カタログを読み込み、Entity ごとに1タスクを作成（モデル + マイグレーション + API + バリデーション + テスト）。
- データモデルの FK 依存関係が依存グラフを決定します。
- 独立した Entity は並列で実行され、依存する Entity は親の完了を待ちます。

#### OpenAI Codex: Agents SDK + Handoff パターン

Codex では、マルチエージェント作業は Agents SDK の Handoff パターンを使用します。Codex は MCP Server として起動され（`codex --mcp-server`）、プロジェクトマネージャーエージェントが Entity カタログを読み込み、同じ3つの役割（spec-generator、implementer、qa-reviewer）にハンドオフを通じてタスクを分配します。

---

### id3-info-audit

情報モデルに対するコードベースを監査し、ドリフトとエントロピーを検出します。

**トリガーキーワード：** `info audit`、`information audit`、`model audit`、`drift check`

**手順：**

1. `specs/entity-catalog.md` から Entity リストを読み込みます。
2. コードベースをスキャンして以下を検出します：
   - 未実装の Entity / 未定義のモデル
   - `docs/business-rules.md` のビジネスルールがコードに反映されていない
   - データ型 / 制約の不一致
3. `specs/ui-structure.md` と `specs/ui-design-contract.md` に対するUI整合性をチェックします：
   - 未実装の画面 / 未定義の画面
   - フォームフィールドと Attribute のマッピング不一致
   - 欠落しているナビゲーションパス
4. バージョンヘッダーを更新します（`last_verified`、`audit_status`）。
5. Hook バイパス履歴（`.iddd/skip-history.log`）をチェックします。
6. ビジュアルインジケーター付きの Entity ごとのステータスレポートを出力します。

**ビジュアル出力：** 監査結果は `.iddd/preview/audit-{date}.html` にインタラクティブなHTMLダッシュボードとしてレンダリングされます。

---

### id3-preview

ブラウザで情報モデルと監査結果を表示するための軽量なローカルHTTPサーバーを起動します。

**トリガーキーワード：** `preview`、`show erd`、`show model`、`visual preview`

サーバーは `listen(0)`（OSが割り当てるポート）を使用し、以下を配信します：
- **ERD プレビュー** -- Entity クリックスルーでカタログ詳細に遷移するインタラクティブな Mermaid ERD
- **UIモックアップ** -- `specs/ui-structure.md` と `specs/ui-design-contract.md` から導出されたワイヤーフレームレイアウト
- **監査ダッシュボード** -- ビジネスルールカバレッジ付きの Entity ごとのステータスカード

すべてのHTMLファイルは `.iddd/preview/` に永続化され、サーバーなしでもブラウザで直接開くことができます。

---

## Harness Hook システム

IDDDは自動化された Hook を通じて情報優先の規律を強制します。その哲学は「プロセスに従ってください」ではなく、**「従わなければコミットがブロックされます」**です。

### Hook 概要

| Hook           | トリガー         | アクション                                              | 重大度     |
|----------------|------------------|---------------------------------------------------------|------------|
| schema-drift   | pre-commit       | スキーマ変更が entity-catalog.md と一致するか検証        | **BLOCK**（コミット拒否） |
| rule-check     | pre-commit       | 新しいバリデーションロジックが business-rules.md に対応しているかチェック | **WARN**（コミット許可、メッセージ表示） |
| auto-audit     | post-commit      | N コミットごとに info-audit を実行                       | **INFO**（レポート生成） |

### schema-drift (BLOCK)

スキーマ関連ファイル（Prisma、Drizzle、Djangoモデル、TypeORM Entity、SQLマイグレーションなど）を変更する際、Hook は `specs/entity-catalog.md` が対応して更新されているかチェックします。更新されていない場合、コミットは**拒否されます**。情報モデルは常にコードの*前に*更新される必要があります。

**監視対象のファイルパターン**（設定可能）：
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check (WARN)

バリデーションロジック（Zod、Yup、Joi、Pydanticなど）を追加または変更する際、Hook は `docs/business-rules.md` に対応する `BR-xxx` エントリがあるかチェックします。存在しない場合、警告が発行されます。コミットは続行されますが、欠落しているルールがフラグされます。

**監視対象のファイルパターン**（設定可能）：
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit (INFO)

N コミットごと（デフォルト：10、設定可能）に、Harness は情報モデルに対するコードベースの info-audit を自動的に実行します。コミットカウンタは `.iddd/commit-count` に保存されます。結果は `.iddd/preview/audit-{date}.html` に書き込まれます。

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

すべてのIDDD Hook を無効にするには、トップレベルの `"enabled"` を `false` に設定します。単一の Hook を無効にするには、その `"enabled"` を `false` に設定します。auto-audit の頻度を変更するには、`"interval_commits"` を調整します。

### Hook バイパス

`IDDD_SKIP_HOOKS=1` を設定すると、すべての Hook を一時的にスキップできます。バイパスは `.iddd/skip-history.log` に記録され、監査時にレビューされます。

---

## エントロピー管理

時間の経過とともに、情報モデルはコードからドリフトします。IDDDは3つのメカニズムでエントロピーに対抗します：

### バージョンヘッダー

`specs/entity-catalog.md` と `specs/data-model.md` は、モデルの状態を追跡するYAMLフロントマターを含みます：

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
- `version` は各 Phase 完了時にインクリメントされます（Phase 1: `"0.1"`、Phase 2: `"1.0"`、以降: `"1.1"`、`"1.2"`、...）。
- `last_verified` はモデルが監査または検証されるたびに更新されます。
- `last_verified` が**7日以上古い**場合、エージェントは新しい作業を進める前に `/id3-info-audit` の実行を促します。古いモデルはドリフトにつながります。

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

`auto-audit` Hook（post-commit）はNコミットごとにフル情報監査を実行し、ドリフトが蓄積する前にキャッチします。

---

## カスタマイズガイド

IDDDはプロジェクトの規約に合わせて適応できるよう設計されています。何をどこでカスタマイズするかを以下に示します：

| カスタマイズ対象                               | 編集するファイル                   |
|------------------------------------------------|------------------------------------|
| プロダクトビジョンとスコープ                   | `steering/product.md`              |
| 命名規則、PK 戦略、タイムスタンプ、論理削除ポリシー、ENUM vs 参照テーブル | `steering/data-conventions.md` |
| Entity 定義                                    | `specs/entity-catalog.md`          |
| データモデル（ERD）                            | `specs/data-model.md`              |
| ビジネスルール                                 | `docs/business-rules.md`           |
| ドメイン用語集                                 | `docs/domain-glossary.md`          |
| UI画面インベントリ                             | `specs/ui-inventory.md`            |
| UI構造（画面導出）                             | `specs/ui-structure.md`            |
| UIデザインコントラクト（トークン、コンポーネント） | `specs/ui-design-contract.md`      |
| Hook の動作（有効/無効、重大度）               | `.claude/hooks/hook-config.json`   |
| Hook の監視対象ファイルパターン                | `.claude/hooks/hook-config.json`   |
| auto-audit のコミットインターバル              | `.claude/hooks/hook-config.json`   |
| Codex Hook 設定                                | `.codex/hooks.json`                |

**ヒント：** すべての `specs/` と `docs/` ファイルはバージョンヘッダー付きのYAMLフロントマターを使用しています。IDDD Harness はこれらのバージョンを追跡してエントロピーのドリフトを検出します。仕様ファイルを変更する際は、必ずバージョンヘッダーを更新してください。

---

## 使用例

### 例1: 新規プロジェクトの開始（グリーンフィールド）

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

### 例2: 既存プロジェクトへの適用（ブラウンフィールド）

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

## 知的系譜

IDDDはいくつかの知的伝統からアイデアを統合しています：

- **Peter Chen の ER モデル (1976)** -- 「現実世界は Entity と Relationship から成る。」情報構造がアプリケーションロジックに先行するという基礎的な洞察。
- **Len Silverston のユニバーサルデータモデル** -- 再利用可能な情報パターン（Party、Product、Order、Hierarchy）。発見された Entity を検証するチェックリストとして機能します。
- **Eric Evans の Domain-Driven Design (2003)** -- Bounded Context、Ubiquitous Language、Aggregate パターン。IDDDはドメイン言語と明示的な境界への重点を継承しています。
- **Sophia Prater の OOUX (Object-Oriented UX)** -- 「インタラクションの前にオブジェクトをデザインせよ。」ORCAフレームワーク（Objects、Relationships、CTAs、Attributes）はIDDDの出力優先UI導出に直接影響を与えています。
- **Jamie Lord の "Data First, Code Second" (2024)** -- 「知識をデータに畳み込め。」Unix の表現の法則を現代のソフトウェア開発に適用。
- **Mitchell Hashimoto の Harness Engineering (2026)** -- `Agent = Model + Harness`。AIエージェントが長期にわたって効果的であり続けるには、アーキテクチャ上の制約、コンテキストエンジニアリング、およびエントロピー管理が必要であるという洞察。IDDDの Hook システム、バージョンヘッダー、auto-audit は Harness Engineering の原則を直接適用したものです。

**核となる洞察：** *論理モデルが完成すると、技術選定の前にアプリケーション動作の80%がすでに定義されている。そしてその情報モデル自体が、AIエージェントにとって最良の Harness である。*

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

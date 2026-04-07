<div align="center">

[![npm version](https://img.shields.io/npm/v/id3-cli.svg)](https://www.npmjs.com/package/id3-cli)
[![license](https://img.shields.io/npm/l/id3-cli.svg)](https://github.com/bruce-jsh/iddd/blob/master/LICENSE)

[English](https://github.com/bruce-jsh/iddd/blob/master/README.md) · [한국어](https://github.com/bruce-jsh/iddd/blob/master/README.ko-KR.md) · [简体中文](https://github.com/bruce-jsh/iddd/blob/master/README.zh-CN.md) · [日本語](https://github.com/bruce-jsh/iddd/blob/master/README.ja-JP.md) · **Türkçe**

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

## Hızlı Başlangıç

```bash
npm i -g id3-cli
```

Projenizde `/id3-start` komutunu çalıştırın. IDDD kurulum durumunu otomatik olarak algılar, ilerleme panosu ile birlikte çalıştırmanız gereken bir sonraki komutu gösterir.

---

**"Hangi bilgi mevcut?" sorusuyla başlayın, "Hangi özellikler geliştirilmeli?" sorusuyla değil.**

IDDD, **bilgi modelini** tüm yazılım geliştirmenin merkezine koyan bir geliştirme metodolojisi ve AI ajanı yetenek paketidir. Herhangi bir teknoloji seçimi yapılmadan *önce* titiz bir Entity kataloğu, veri modeli, iş kuralları ve alan sözlüğü oluşturarak, IDDD mantıksal model aşamasında uygulama davranışının %80'inin zaten tanımlı olmasını garanti eder. Ardından bilgi modeli: gereksinimlerin, API sözleşmelerinin, ekran tasarımlarının ve doğrulama kurallarının sistematik olarak türetildiği üretici merkez (generative center) haline gelir.

Bu paket, IDDD'yi AI ajanı yetenekleri, Harness Hook'ları ve belge şablonları seti olarak kurarak, kodlama ajanlarının tüm geliştirme yaşam döngüsü boyunca bilgi öncelikli (information-first) ilkeleri uygulamasını sağlar.

---

## IDDD Nedir?

Çoğu yazılım projesi *"Hangi özellikler geliştirilmeli?"* sorusuyla başlar ve hemen uygulamaya geçer. IDDD bu yaklaşımı tersine çevirir. **"Bu alanda hangi bilgi mevcut?"** sorusuyla başlar ve bilgi modelini, spesifikasyonun bir bölümü olarak değil, diğer tüm geliştirme çıktılarının türetildiği **tek doğru kaynak (single source of truth)** olarak ele alır.

### Temel İlkeler

1. **Bilgi modeli üretici merkezdir.** Tüm kod, API, kullanıcı arayüzü ve testler Entity kataloğu ile veri modelinden türetilir. Kod spesifikasyonla uyuşmazsa, spesifikasyon önceliklidir.
2. **Önce Entity tanımlama.** Kod yazmadan önce Entity'ler tanımlanmalı ve belgelenmelidir. Yeni özellikler "Hangi endpoint gerekli?" yerine "Hangi Entity'ler ilişkili?" sorusuyla başlar.
3. **Veri modeli izlenebilirliği.** Kod tabanındaki her sütun, kısıtlama ve Relationship, Entity kataloğundaki bir girdiye izlenebilir olmalıdır. İzlenemeyen şema öğeleri sürüklenme (drift) olarak kabul edilir.
4. **Çıktı öncelikli tasarım.** Girdileri (formlar, API) tasarlamadan önce kullanıcının *gördüğünü* (panolar, raporlar, listeler) tasarlayın. Çıktı görüntüsü bilgi modelini yönlendirir.
5. **İş kuralları açıkça tanımlanır.** Tüm doğrulama, kısıtlama ve türetme kuralları BR-xxx tanımlayıcılarıyla kayıt altına alınır. Yalnızca kodda bulunan kurallar teknik borç olarak kabul edilir.

### 3 Aşamalı Veri Modelleme ve Yazılım Geliştirme Eşlemesi

IDDD, geleneksel 3 aşamalı veri modelleme sürecini doğrudan yazılım geliştirme aşamalarına eşler:

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

Bilgi modelinin her öğesi otomatik olarak geliştirme çıktılarını ima eder:

| Bilgi Modeli Öğesi                   | Türetilen Çıktılar                                           |
|--------------------------------------|---------------------------------------------------------------|
| Entity tanımlama                     | Gereksinim kapsamı, kullanıcı hikayeleri                      |
| Relationship & Cardinality           | API endpoint yapısı, gezinme                                  |
| Attribute & veri tipleri             | Form alanları, doğrulama kuralları, DTO                       |
| Kısıtlamalar                         | Girdi doğrulama, tip tanımları                                |
| Türetilmiş Attribute                 | İş mantığı, hesaplama kuralları                               |
| Durum geçişleri                      | İş akışları, durum yönetimi                                   |
| Toplama / ilişki kuralları           | İşlem sınırları, tutarlılık kuralları                         |

**Mantıksal model tamamlandığında, teknoloji seçimi yapılmadan önce uygulama davranışının %80'i zaten tanımlıdır.**

---

## Desteklenen Platformlar

| Platform     | Ajan Sistemi             | Çoklu Ajan Stratejisi                                        |
|--------------|--------------------------|--------------------------------------------------------------|
| Claude Code  | Claude Agent Teams       | Eşler arası mesajlaşma, bağımsız iş ağaçları                |
| OpenAI Codex | Codex Agents SDK         | MCP Server üzerinden el değiştirme (handoff) deseni          |

---

## Ön Koşullar

| Gereksinim     | Ayrıntı                                                     |
|----------------|--------------------------------------------------------------|
| Node.js        | **18+** (npm veya uyumlu paket yöneticisi dahil)             |
| Claude Code    | **Claude Max** üyeliği + Agent Teams etkin                   |
| OpenAI Codex   | **ChatGPT Plus** veya üstü (Pro/Business/Enterprise)         |

Node.js 18+ ve npm gereklidir. AI platformu aboneliği kullandığınız platforma göre gereklidir.

---

## Kurulum

```bash
npm i -g id3-cli
```

Global kurulumda iki global yetenek (`/id3-start`, `/id3-clear`) kayıt edilir ve tüm projelerde kullanılabilir hale gelir. Bir projede ilk kez `/id3-start` çalıştırdığınızda IDDD kurulumunun mevcut olup olmadığını otomatik algılar ve sonraki adımları gösterir.

### Seçenekler

| Seçenek         | Açıklama                                                     |
|-----------------|--------------------------------------------------------------|
| `[target-dir]`  | Hedef dizin (varsayılan: geçerli dizin `.`)                  |
| `--no-symlink`  | Sembolik bağlantı yerine yetenek dosyalarını kopyala (Windows'ta kullanışlı) |
| `--platform`    | Platformu zorla belirt: `claude`, `codex` veya `all`         |

### Üzerine Yazma Algılama

Hedef dizinde `CLAUDE.md` zaten mevcutsa, `id3-cli` şunu sorar:

```
"IDDD appears to be already installed. Overwrite? (y/N)"
```

### Kurulum Sonrası Çıktı

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

## Kurulum Sonrası Dizin Yapısı

`npm i -g id3-cli` çalıştırıldıktan sonra, aşağıdaki global yetenekler sistem genelinde kurulur:

```
~/.claude/skills-global/              Global yetenekler (npm i -g ile kurulur)
  ├── id3-start/                      IDDD giriş noktası
  │   ├── SKILL.md
  │   └── references/
  │       ├── phase-guide.md            Phase yönlendirme taksonomisi
  │       └── dashboard-template.md     İlerleme panosu biçimi
  └── id3-clear/                      Proje sıfırlama
      └── SKILL.md
```

`/id3-start` çalıştırıldıktan sonra (veya `id3-cli init .`), proje aşağıdaki yapıya sahip olur:

```
your-project/
│
│   ===== Ortak (tüm platformlar) =====
│
├── skills/                          Yetenek kaynağı (tek doğru kaynak)
│   ├── id3-identify-entities/       Phase 0/1: Entity tanımlama
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   Mevcut koddan ters çıkarım
│   │       └── phase1-greenfield.md   Yeni projeler için yapılandırılmış mülakat
│   ├── id3-design-information/      Phase 2: Bilgi yapılandırma
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── phase2-procedure.md    İyileştirme prosedürü
│   ├── id3-design-ui/               Phase 2.5: UI tasarımı & uygulama
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── step1-structure-derivation.md
│   │       ├── step2-visual-contract.md
│   │       ├── step3-gate-and-mockup.md
│   │       └── step4-implementation.md
│   ├── id3-spawn-team/              Çoklu ajan uygulama dağıtımı
│   ├── id3-info-audit/              Entropi denetimi (sürüklenme tespiti)
│   └── id3-preview/                 Bilgi modeli görsel önizleme
│
├── specs/                           Bilgi modeli çıktıları
│   ├── entity-catalog.md              Entity listesi + özet tablosu
│   ├── data-model.md                  Mermaid ERD + tasarım kararları
│   ├── ui-inventory.md                Ekran listesi + eşleme matrisi
│   ├── ui-structure.md                Ekran listesi + gezinme (Phase 2.5)
│   └── ui-design-contract.md          Tasarım token'ları + bileşen eşleme (Phase 2.5)
│
├── docs/                            Destek belgeleri
│   ├── business-rules.md              BR-xxx dizinli iş kuralları
│   ├── domain-glossary.md             Terim / İngilizce ad / Tanım / Not
│   ├── info-debt.md                   Uyumsuzluk izleyicisi
│   └── model-changelog.md            Keep a Changelog biçimi
│
├── steering/                        Proje düzeyi kurallar
│   ├── product.md                     Ürün vizyonu & kapsamı (kullanıcı tarafından yazılır)
│   └── data-conventions.md            PK stratejisi, adlandırma, zaman damgaları vb.
│
├── hooks/                           Harness Hook betikleri (derlenmiş JS paketleri)
│   ├── iddd-schema-drift.js           Şema sürüklenme tespiti
│   ├── iddd-rule-check.js             İş kuralı takibi
│   ├── iddd-auto-audit.js             Otomatik entropi denetimi
│   ├── pre-commit                     Git Hook (schema-drift + rule-check)
│   └── post-commit                    Git Hook (auto-audit)
│
├── .iddd/                           IDDD dahili durum
│   ├── commit-count                   auto-audit aralık sayacı
│   └── preview/                       Oluşturulan önizleme HTML'leri
│
│   ===== Platform: Claude Code =====
│
├── CLAUDE.md                        Lider ajan bağlam belgesi
├── .claude/
│   ├── settings.local.json            Hook kaydı (init tarafından enjekte edilir)
│   ├── skills/ -> skills/             skills/ kaynağına sembolik bağlantı
│   └── hooks/
│       └── hook-config.json           IDDD Hook yapılandırması
│
│   ===== Platform: OpenAI Codex =====
│
├── AGENTS.md                        Platformlar arası ajan yönergeleri
├── .agents/
│   └── skills/ -> skills/             skills/ kaynağına sembolik bağlantı
└── .codex/
    └── hooks.json                     Codex Hook yapılandırması
```

### Yetenek Dosyası Paylaşım Stratejisi

Yetenek içerikleri tek bir kurallı konumda (`skills/`) tutulur. Platforma özgü yollar (`.claude/skills/`, `.agents/skills/`), `init` CLI'nin dinamik olarak oluşturduğu sembolik bağlantılardır. Bu sayede tüm platformlarda tek bir bakım noktası sağlanır. Windows'ta `--no-symlink` kullanarak dosya kopyası oluşturun.

---

## İş Akışı

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

### Phase Bazlı Rehber

> **İpucu:** Başlangıçta `/id3-start` çalıştırırsanız mevcut ilerleme durumunu ve sonraki adımı gösterir. Sonrasında aşağıdaki bireysel komutları doğrudan kullanın.

**Phase 0/1: Entity Tanımlama:**
`/id3-identify-entities` komutunu çalıştırın. Ajan, mevcut bir kod tabanının olup olmadığını (brownfield) veya sıfırdan başlanıp başlanmadığını (greenfield) otomatik olarak algılar, ardından uygun tanımlama akışını yürütür.

**Phase 2: Bilgi Tasarımı:**
`/id3-design-information` komutunu çalıştırın. Ajan, kavramsal modeli mantıksal modele dönüştürür, iş kurallarını türetir, versiyon başlıklarını ve Hook yapılandırmasını ayarlar.

**Phase 2.5: UI Tasarımı:**
`/id3-design-ui` komutunu çalıştırın. Ajan, Entity kataloğundan ekran yapısını türetir, tasarım token'larıyla görsel tasarım sözleşmesi oluşturur, etkileşimli maket önizlemesiyle birlikte 7-Pillar kalite kapısını çalıştırır, ardından Agent Teams oluşturarak ekranları paralel uygular ve son denetimi gerçekleştirir.

**Phase 3-5: Agent Teams ile Uygulama:**
`/id3-spawn-team` komutunu çalıştırın. Ajan, kesinleşmiş bilgi modelini okur ve uzman ajan ekipleri (spec-generator, implementer, qa-reviewer) oluşturarak sistemi paralel olarak uygular.

---

## Yetenekler

### id3-start (Global - Giriş Noktası)

IDDD'nin giriş noktasıdır. İlk çalıştırmada proje kurulumu, ilerleme panosu ve sonraki adım rehberliği sağlar. Bir istek birlikte iletilirse doğru Phase yeteneğine yönlendirir. Sonrasında yönlendirilen bireysel komutları doğrudan kullanın.

**Özellikler:**

1. **Otomatik kurulum:** Geçerli projede IDDD'nin kurulu olup olmadığını algılar (`specs/entity-catalog.md` + `CLAUDE.md`). Kurulu değilse, otomatik olarak `id3-cli init .` çalıştırarak IDDD'yi kurar.
2. **İlerleme panosu:** Her Phase'in (Phase 0/1, Phase 2, Phase 2.5, Phase 3-5) tamamlanma durumunu görsel sembollerle (tamamlanmış onay işareti, devam eden karo, başlanmamış daire) ve ilerleme çubuğuyla gösteren Phase hattını görüntüler.
3. **Niyet yönlendirme:** Bir istek birlikte iletilirse doğru Phase yeteneğine (`/id3-identify-entities`, `/id3-design-information`, `/id3-design-ui`, `/id3-spawn-team`, `/id3-info-audit` veya `/id3-preview`) yönlendirir.
4. **Belirsiz istek işleme:** İstek birden fazla Phase ile eşleşebiliyorsa (örn. "listeye filtre ekle": yalnızca UI değişikliği mi yoksa yeni veri Entity'si mi gerekiyor?), yönlendirmeden önce netleştirme sorusu sorar.
5. **UI hızlı yolu:** İstek yalnızca açık UI anahtar kelimeleri içeriyorsa ve veri modeli zaten mevcutsa (version >= 1.0), Entity sorusu sormadan doğrudan `/id3-design-ui`'ye yönlendirir.
6. **Ön koşul kontrolü:** Hedef Phase'in ön koşulları karşılanmıyorsa uyarır ve doğru başlangıç Phase'ini önerir.

**Kullanım:**

```
/id3-start                             Panoyu göster + sonraki komut rehberliği
```

**Kurulum:** `npm i -g id3-cli` ile `~/.claude/skills-global/id3-start/` konumuna global olarak kurulur.

---

### id3-identify-entities (Phase 0/1)

IDDD iş akışının giriş noktasıdır. Bu yetenek, brownfield ve greenfield yollarını **otomatik olarak dallandırır**.

**Otomatik algılama mantığı:** Yetenek, proje kökünde ORM/şema dosyalarını (Prisma, Drizzle, Django models, TypeORM entities, SQL migrations, Sequelize configs) tarar. Bulunursa Phase 0'a girer, aksi halde Phase 1'e girer.

#### Phase 0: Brownfield - Bilgi Modeli Ters Çıkarımı

Mevcut kod tabanları için ajan, 4 katmandan örtük bilgi modelini sistematik olarak çıkarır:

| Katman | Kaynak           | İnceleme Konusu                                              | Güvenilirlik |
|--------|------------------|--------------------------------------------------------------|--------------|
| L1     | DB şeması        | Tablolar, sütunlar, FK, dizinler, kısıtlamalar               | En yüksek    |
| L2     | ORM / model      | Sanal alanlar, türetilmiş Attribute, yumuşak silme, durum    | Yüksek       |
| L3     | API sözleşmesi   | Endpoint'ler, DTO, doğrulama mantığı                         | Orta         |
| L4     | Ön yüz           | Rotalar, bileşenler, form alanları                           | Referans     |

L4 incelemesi kapsamlıdır: dosya tabanlı yönlendirme (Next.js `app/`, `pages/`), React Router, Vue Router vb. taranarak ekran-Entity eşleme matrisi içeren eksiksiz bir UI envanteri (`specs/ui-inventory.md`) oluşturulur.

Bulgular **tutarlı** (katmanlar arası uyumlu), **uyumsuz** (`docs/info-debt.md`'ye kaydedilir) ve **örtük** (kod mantığında gizli olanlar, açık iş kurallarına dönüştürülür) olarak sınıflandırılır.

Çıkarım sonrasında, **doğrulama mülakatı** ile kullanıcıdan doğruluk onayı alınır.

**Oluşturulan çıktılar:** `specs/entity-catalog.md`, `specs/data-model.md`, `specs/ui-inventory.md`, `docs/business-rules.md`, `docs/info-debt.md`

#### Phase 1: Greenfield - Yapılandırılmış Mülakat

Yeni projeler için ajan, alan bilgisini keşfetmek üzere yapılandırılmış mülakat yürütür:

1. **Bilgi tanımlama:** "Bu sistemin yönettiği temel 'şeyler' (isimler) nelerdir?"
2. **Relationship keşfi:** "Bunlar nasıl ilişkilidir? Bire-çok mu, çoka-çok mu?"
3. **Kural keşfi:** "Hangi kurallar uygulanmalıdır? Durum geçişleri var mı?"
4. **Silverston evrensel örüntü kontrol listesi:** Ajan, keşfedilen Entity'leri kanıtlanmış örüntülerle karşılaştırır: Party, Product/Service, Order/Transaction, Classification, Status/Lifecycle, Hierarchy, Contact Mechanism, Document/Content.

**Oluşturulan çıktılar:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-information (Phase 2)

Kavramsal modeli **mantıksal modele** dönüştürür. İş kuralları, doğrulama kısıtlamaları ve türetme kuralları bilgi modelinden otomatik olarak türetilir.

**Ön koşul:** `specs/entity-catalog.md` dosyasında en az 2 tanımlanmış Entity bulunmalıdır.

**Prosedür:**

1. **Attribute iyileştirme:** Somut veri tipleri (UUID, TEXT, INTEGER, TIMESTAMP, JSONB vb.), NOT NULL / DEFAULT / UNIQUE kısıtlamaları ve dizin gereksinimleri atanır.
2. **Relationship somutlaştırma:** FK yerleşimi, silme/güncelleme kuralları (CASCADE, SET NULL, RESTRICT) belirlenir ve çoka-çok Relationship'ler için bağlantı tabloları tanımlanır.
3. **Otomatik iş kuralı türetme:**
   - NOT NULL kısıtlaması --> "Bu alan zorunludur" (BR-xxx)
   - UNIQUE kısıtlaması --> "Tekrara izin verilmez" (BR-xxx)
   - FK + CASCADE --> "Üst öğe silindiğinde alt öğeler de silinir" (BR-xxx)
   - Durum geçişleri --> "İzin verilen geçiş yolları" (BR-xxx)
   - Türetilmiş Attribute --> "Hesaplama kuralı" (BR-xxx)
4. **Tasarım kararı soruları:** Ajan, büyük veri depolama stratejisi, yumuşak silme kapsamı, çoklu kiracılık, denetim izi ihtiyacı gibi konularda kullanıcıya sorular sorar.
5. **Çıktı kesinleştirme:** Tüm spesifikasyon dosyalarını versiyon başlıkları ve Hook yapılandırmasıyla günceller.

**Güncellenen çıktılar:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-ui (Phase 2.5)

Bilgi modelinden UI yapısını ve görsel tasarımı türettikten sonra Agent Teams kullanarak ekranları uygular.

**Ön koşul:** Phase 2 tamamlanmış olmalıdır (`entity-catalog.md` version >= `"1.0"`).

**4 Aşamalı İşlem Hattı:**

1. **UI yapı türetme:** 9 türetme kuralı (entity -> list/detail/form/dashboard) kullanılarak Entity'ler ekranlara otomatik eşlenir. 12 tip tabanlı kuralla Attribute'lar Widget'lara eşlenir. "Çıktı önce, girdi sonra" ilkesi uygulanır.
2. **Görsel tasarım sözleşmesi:** Mevcut ön yüz çerçevesi (React, Vue, Svelte vb.) ve UI kitaplıkları algılanır. 5 tasarım token alanı (spacing, typography, color, copywriting, component registry) oluşturulur.
3. **Uygulama öncesi kapı:** 7-Pillar doğrulaması (yapısal bütünlük, spacing, typography, color, copywriting, component registry, izlenebilirlik) çalıştırılır. Örnek verilerle 3 seviyeli HTML maket (wireframe, styled, interactive) oluşturulur.
4. **Uygulama + son denetim:** Agent Teams oluşturularak ekranlar paralel uygulanır. Uygulama sonrasında görsel denetim her Pillar'ı 1-4 arasında puanlar ve en önemli 3 düzeltmeyi belirler.

**Çıktılar:** `specs/ui-structure.md`, `specs/ui-design-contract.md`, `.iddd/preview/mockup-*.html`, `.iddd/preview/ui-audit.html`

---

### id3-spawn-team (Phase 3-5)

Kesinleşmiş bilgi modeline dayalı olarak sistemi uygulayacak uzman ajan ekipleri oluşturur.

**Ön koşul:** `specs/entity-catalog.md` ve `specs/data-model.md` mevcut olmalı ve Phase 2 tamamlanmış olmalıdır.

#### Claude Code: Agent Teams

Üç ekip üyesi oluşturulur, her biri bağımsız bağlam penceresi ve bağımsız Git iş ağacına sahiptir:

| Ekip Üyesi       | Rol                                                            |
|-------------------|----------------------------------------------------------------|
| spec-generator    | Bilgi modelini requirements.md ve api-contracts.md'ye dönüştürür |
| implementer       | Spesifikasyonlardan kod oluşturur, Entity başına atomik commit  |
| qa-reviewer       | Bilgi modeline göre uygulamayı doğrular. Başarısız olursa implementer'a doğrudan mesaj gönderir |

**Görev oluşturma kuralları:**
- Entity kataloğunu okuyarak Entity başına bir görev oluşturur (model + migration + API + doğrulama + test).
- Veri modelindeki FK bağımlılıkları, bağımlılık grafiğini belirler.
- Bağımsız Entity'ler paralel çalıştırılır, bağımlı Entity'ler üst öğeyi bekler.

#### OpenAI Codex: Agents SDK + Handoff Deseni

Codex'te çoklu ajan görevleri Agents SDK handoff deseni kullanır. Codex, MCP Server (`codex --mcp-server`) olarak başlatılır, proje yöneticisi ajanı Entity kataloğunu okuyarak aynı üç role (spec-generator, implementer, qa-reviewer) handoff yoluyla görevleri dağıtır.

---

### id3-info-audit

Bilgi modeline karşı kod tabanını denetleyerek sürüklenme ve entropiyi tespit eder.

**Prosedür:**

1. `specs/entity-catalog.md` dosyasından Entity listesini okur.
2. Kod tabanında şunları tarar:
   - Uygulanmamış Entity'ler / tanımlanmamış modeller
   - `docs/business-rules.md`'deki iş kurallarının koda yansıtılmamış olması
   - Veri tipi / kısıtlama uyumsuzlukları
3. `specs/ui-structure.md` ve `specs/ui-design-contract.md` karşısında UI tutarlılığını kontrol eder:
   - Uygulanmamış ekranlar / tanımlanmamış ekranlar
   - Form alanı - Attribute eşleme uyumsuzlukları
   - Eksik gezinme yolları
4. Versiyon başlıklarını (`last_verified`, `audit_status`) günceller.
5. Hook atlatma geçmişini (`.iddd/skip-history.log`) kontrol eder.
6. Entity bazlı durum raporunu görsel göstergelerle birlikte çıktılar.

**Görsel çıktı:** Denetim sonuçları `.iddd/preview/audit-{date}.html` dosyasına etkileşimli HTML panosu olarak işlenir.

---

### id3-preview

Bilgi modelini ve denetim sonuçlarını tarayıcıda görüntülenebilir hale getirmek için hafif yerel HTTP sunucusu başlatır.

Sunucu `listen(0)` (işletim sistemi tarafından atanan port) kullanır ve şunları sunar:
- **ERD önizleme:** Entity'ye tıklandığında katalog detayına giden etkileşimli Mermaid ERD
- **UI maketi:** `specs/ui-structure.md` ve `specs/ui-design-contract.md`'den türetilen wireframe düzeni
- **Denetim panosu:** İş kuralı kapsam bilgisini içeren Entity bazlı durum kartları

Tüm HTML dosyaları `.iddd/preview/` dizininde tutulur ve sunucu olmadan doğrudan tarayıcıda açılabilir.

---

### id3-clear (Global - Proje Sıfırlama)

Geçerli projede IDDD'nin oluşturduğu tüm dosyaları güvenli bir şekilde kaldırarak, IDDD kurulumundan önceki duruma geri döndürür.

**Prosedür:**

1. **Kurulum kontrolü:** Projede IDDD dosyalarının mevcut olup olmadığını kontrol eder. Yoksa "IDDD dosyaları bulunamadı" mesajı verir ve durur.
2. **Silme hedefi taraması:** Hangi IDDD dizinlerinin (`specs/`, `docs/`, `steering/`, `hooks/`, `skills/`, `.claude/skills/`, `.claude/hooks/`, `.codex/skills/`, `.agents/skills/`, `.iddd/`) ve dosyaların (`CLAUDE.md`, `AGENTS.md`) gerçekten mevcut olduğunu belirler.
3. **Uyarı gösterimi:** Silinecek tüm dosya ve dizinlerin ayrıntılı listesini gösterir. Kullanıcı tarafından yazılmış dosyalar (`steering/product.md`, `steering/data-conventions.md`) için özel not ekler.
4. **Onay gereksinimi:** `[y/N]` ile onay ister (varsayılan N). Yalnızca açıkça "y" veya "yes" girildiğinde devam eder.
5. **Silme yürütme:** Yalnızca belirlenen hedefleri kaldırır. Silme sayısı içeren tamamlanma özeti gösterir.

**Güvenlik kuralları:**
- Bilinen IDDD dosya listesi dışındaki dosyalar asla silinmez
- `rm -rf *` gibi glob desenleri asla kullanılmaz
- Onay adımı asla atlanmaz
- Seçici silme gerekiyorsa manuel dosya işlemleri kullanın

**Kurulum:** `npm i -g id3-cli` ile `~/.claude/skills-global/id3-clear/` konumuna global olarak kurulur.

---

## Harness Hook Sistemi

IDDD, otomatik Hook'lar aracılığıyla bilgi öncelikli ilkeleri uygular. Felsefe "Lütfen süreci takip edin" değil, **"Takip etmezseniz commit engellenir."** şeklindedir.

### Hook Genel Bakışı

| Hook           | Tetikleyici      | Davranış                                                    | Önem Derecesi  |
|----------------|------------------|-------------------------------------------------------------|----------------|
| schema-drift   | pre-commit       | Şema değişikliğinin entity-catalog.md ile eşleştiğini doğrular | **BLOCK** (commit reddedilir) |
| rule-check     | pre-commit       | Yeni doğrulama mantığının business-rules.md'de olduğunu kontrol eder | **WARN** (commit geçer, mesaj gösterilir) |
| auto-audit     | post-commit      | Her N commit'te info-audit çalıştırır                        | **INFO** (rapor oluşturur) |

### schema-drift (BLOCK)

Şema ile ilgili dosyalar (Prisma, Drizzle, Django models, TypeORM entities, SQL migrations vb.) değiştirildiğinde, Hook `specs/entity-catalog.md`'nin de birlikte güncellenip güncellenmediğini kontrol eder. Güncellenmemişse commit **reddedilir**. Bilgi modeli her zaman koddan *önce* güncellenmelidir.

**İzlenen dosya desenleri** (yapılandırılabilir):
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check (WARN)

Doğrulama mantığı (Zod, Yup, Joi, Pydantic vb.) eklendiğinde veya değiştirildiğinde, Hook `docs/business-rules.md` dosyasında karşılık gelen `BR-xxx` girişinin olup olmadığını kontrol eder. Yoksa uyarı verilir. Commit geçer, ancak eksik kurallar gösterilir.

**İzlenen dosya desenleri** (yapılandırılabilir):
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit (INFO)

Her N commit'te (varsayılan: 10, yapılandırılabilir), Harness kod tabanını bilgi modeliyle karşılaştıran info-audit'i otomatik olarak çalıştırır. Commit sayacı `.iddd/commit-count` dosyasında saklanır. Sonuçlar `.iddd/preview/audit-{date}.html` dosyasına kaydedilir.

### Hook Yapılandırması

Tüm Hook yapılandırmaları `.claude/hooks/hook-config.json` (Claude Code) veya `.codex/hooks.json` (Codex) dosyasındadır.

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

Tüm IDDD Hook'larını devre dışı bırakmak için en üst düzey `"enabled"` değerini `false` olarak ayarlayın. Tek bir Hook'u devre dışı bırakmak için ilgili Hook'un `"enabled"` değerini `false` olarak ayarlayın. auto-audit sıklığını değiştirmek için `"interval_commits"` değerini ayarlayın.

### Hook Atlatma

`IDDD_SKIP_HOOKS=1` ayarlandığında tüm Hook'lar geçici olarak atlanır. Atlatma kaydı `.iddd/skip-history.log` dosyasına yazılır ve denetim sırasında incelenir.

---

## Entropi Yönetimi

Zaman geçtikçe bilgi modeli ile kod arasında farklılaşma oluşur. IDDD, entropiye üç mekanizmayla karşı koyar:

### Versiyon Başlıkları

`specs/entity-catalog.md` ve `specs/data-model.md` dosyaları, model durumunu izleyen YAML ön madde (frontmatter) içerir:

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

**Kurallar:**
- `version`, her Phase tamamlandığında artar (Phase 1: `"0.1"`, Phase 2: `"1.0"`, sonrası: `"1.1"`, `"1.2"`, ...).
- `last_verified`, model denetlendiğinde veya doğrulandığında güncellenir.
- `last_verified` **7 günden eski** olduğunda, ajan yeni bir göreve başlamadan önce `/id3-info-audit` çalıştırmayı önerir. Eski modeller sürüklenmeye neden olur.

### Değişiklik Günlüğü

Tüm model değişiklikleri [Keep a Changelog](https://keepachangelog.com/) biçiminde `docs/model-changelog.md` dosyasına kaydedilir:

```markdown
## [1.0] -- 2026-04-05
### Phase 2 Complete
- 12 entities finalized in logical model
- 19 business rules derived
- Design decisions: D-01 (S3 separation), D-02 (multi-tenant reservation), D-03 (soft delete scope)
- UI proposals: 6 screens generated
```

### Otomatik Denetim

`auto-audit` Hook'u (post-commit), her N commit'te tam bir bilgi denetimi çalıştırarak sürüklenmenin birikmesini önler.

---

## Özelleştirme Rehberi

IDDD, projenizin kurallarına uyum sağlayabilecek şekilde tasarlanmıştır. Özelleştirme öğeleri ve düzenlenecek dosyalar aşağıdaki gibidir:

| Özelleştirme Öğesi                                              | Düzenlenecek Dosya                   |
|-----------------------------------------------------------------|--------------------------------------|
| Ürün vizyonu & kapsamı                                          | `steering/product.md`                |
| Adlandırma kuralları, PK stratejisi, zaman damgaları, yumuşak silme politikası, ENUM vs referans tablosu | `steering/data-conventions.md` |
| Entity tanımları                                                | `specs/entity-catalog.md`            |
| Veri modeli (ERD)                                               | `specs/data-model.md`                |
| İş kuralları                                                    | `docs/business-rules.md`             |
| Alan sözlüğü                                                    | `docs/domain-glossary.md`            |
| UI ekran envanteri                                              | `specs/ui-inventory.md`              |
| UI yapısı (ekran türetme)                                       | `specs/ui-structure.md`              |
| UI tasarım sözleşmesi (token'lar, bileşenler)                  | `specs/ui-design-contract.md`        |
| Hook davranışı (etkinleştirme/devre dışı bırakma, önem derecesi) | `.claude/hooks/hook-config.json`     |
| Hook izlenen dosya desenleri                                    | `.claude/hooks/hook-config.json`     |
| auto-audit commit aralığı                                       | `.claude/hooks/hook-config.json`     |
| Codex Hook yapılandırması                                       | `.codex/hooks.json`                  |

**İpucu:** Tüm `specs/` ve `docs/` dosyaları, versiyon başlığı içeren YAML ön madde kullanır. IDDD Harness bu versiyonu izleyerek entropi sürüklenmesini tespit eder. Spesifikasyon dosyalarını düzenlerken her zaman versiyon başlığını güncelleyin.

---

## Kullanım Örnekleri

### Örnek 1: Yeni Proje Başlatma (Greenfield)

```
$ npm i -g id3-cli
$ mkdir my-saas && cd my-saas && git init
$ claude
> /id3-start SaaS alanının Entity'lerini tanımla

  ╔════════════════════════════════════════════════════════════════╗
  ║  Welcome to IDDD -- Information Design-Driven Development.     ║
  ║  Your information model is your harness.                       ║
  ╚════════════════════════════════════════════════════════════════╝

  IDDD is not set up in this project. Setting up now...
  IDDD initialized. Here is your project dashboard:

  (Panoda tüm Phase'ler ○ -- başlanmamış olarak gösterilir)

  Routing to /id3-identify-entities -- yapılandırılmış mülakat ile alan Entity'leri tanımlanır.
  Bu Phase'de oluşturulan çıktılar: specs/entity-catalog.md, specs/data-model.md, docs/business-rules.md

  Agent: "Sisteminizin yönettiği temel 'şeyler' nelerdir?"
  You: "Users, Organizations, Subscriptions, Invoices, Features"
  Agent: "Users ve Organizations nasıl ilişkilidir?"
  You: "role Attribute'una sahip Membership Entity'si aracılığıyla çoka-çok ilişki."
  ...

  Entity catalog produced: specs/entity-catalog.md (5 entities, 7 relationships)

> /id3-design-information

  Kavramsal model mantıksal modele dönüştürülür.

  Agent refines attributes, derives 14 business rules.
  specs/entity-catalog.md updated (version: 1.0)
  docs/business-rules.md updated (BR-001 through BR-014)

> /id3-design-ui

  Bilgi modelinden UI türetilir ve uygulanır.

  Step 1: Deriving UI structure from 5 entities... 8 screens mapped
  Step 2: Design contract established (React + Tailwind detected)
  Step 3: 7-Pillar gate passed. Mockup preview: http://localhost:52341
  Step 4: Spawning Agent Teams for screen implementation...
  Post-audit: all 7 pillars scored 3+/4

  specs/ui-structure.md generated
  specs/ui-design-contract.md generated

> /id3-spawn-team

  Agent Teams oluşturularak paralel uygulama gerçekleştirilir.

  Spawning Agent Teams:
  - spec-generator: generating requirements.md, api-contracts.md
  - implementer: building User -> Organization -> Membership -> ...
  - qa-reviewer: verifying against information model
```

### Örnek 2: Mevcut Projeye Uygulama (Brownfield)

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

## Entelektüel Kökenler

IDDD, birden fazla entelektüel geleneğin fikirlerini bir araya getirir:

- **Peter Chen'in ER Modeli (1976):** "Gerçek dünya Entity'ler ve Relationship'lerden oluşur." Bilgi yapısının uygulama mantığından önce geldiğine dair temel kavrayış.
- **Len Silverston'ın Evrensel Veri Modelleri:** Keşfedilen Entity'leri doğrulamak için kontrol listesi işlevi gören yeniden kullanılabilir bilgi örüntüleri (Party, Product, Order, Hierarchy).
- **Eric Evans'ın Domain-Driven Design'ı (2003):** Bounded Context, Ubiquitous Language, Aggregate örüntüleri. IDDD, alan dili ve açık sınırlara verilen önemi miras alır.
- **Sophia Prater'ın OOUX'u (Object-Oriented UX):** "Etkileşimden önce nesneleri tasarlayın." ORCA çerçevesi (Objects, Relationships, CTAs, Attributes), IDDD'nin çıktı öncelikli UI türetmesini doğrudan etkiler.
- **Jamie Lord'un "Data First, Code Second" Yaklaşımı (2024):** "Bilgiyi veriye katla." Unix ifade kuralının modern yazılım geliştirmeye uygulanması.
- **Mitchell Hashimoto'nun Harness Engineering'i (2026):** `Agent = Model + Harness`. AI ajanlarının zaman içinde etkili kalabilmesi için mimari kısıtlamalar, bağlam mühendisliği ve entropi yönetimi gerektiğine dair kavrayış. IDDD'nin Hook sistemi, versiyon başlıkları ve otomatik denetimi, Harness Engineering ilkelerinin doğrudan uygulamasıdır.

**Temel kavrayış:** *Mantıksal model tamamlandığında, teknoloji seçimi yapılmadan önce uygulama davranışının %80'i zaten tanımlıdır. Ve o bilgi modeli, AI ajanları için en iyi Harness'tır.*

---

## Lisans

MIT

---

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│    "What information exists?" -- always the first question.      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

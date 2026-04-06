<div align="center">

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
║    ╚═╝╚═════╝ ╚═════╝ ╚═════╝                                    v0.9.3                ║
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

**"Hangi bilgi mevcut?" ile başlayın -- "Hangi özellikleri geliştirmeliyiz?" ile değil.**

IDDD, **bilgi modelini** tüm yazılım geliştirmenin merkezine yerleştiren bir geliştirme metodolojisi ve yapay zeka ajan beceri paketidir. Herhangi bir teknoloji seçimi yapılmadan *önce* titiz bir Entity kataloğu, veri modeli, iş kuralları ve alan sözlüğü oluşturarak, IDDD uygulama davranışının %80'inin mantıksal model aşamasında zaten tanımlanmış olmasını sağlar. Bilgi modeli daha sonra gereksinimler, API sözleşmeleri, ekran tasarımları ve doğrulama kurallarının sistematik olarak türetildiği üretken merkez haline gelir.

Bu paket, IDDD'yi bir dizi yapay zeka ajan becerisi, Harness Hook'ları ve belge şablonları olarak yükler; böylece kodlama ajanınız tüm geliştirme yaşam döngüsü boyunca bilgi-öncelikli disiplini uygular.

---

## IDDD Nedir?

Çoğu yazılım projesi *"Hangi özellikleri geliştirmeliyiz?"* sorusunu sorarak başlar ve doğrudan uygulamaya geçer. IDDD bunu tersine çevirir. **"Bu alanda hangi bilgi mevcut?"** sorusundan yola çıkar ve bilgi modelini spesifikasyonun bir bölümü olarak değil, diğer tüm geliştirme çıktılarının türetildiği **tek doğru kaynak** olarak ele alır.

### Temel İlkeler

1. **Bilgi modeli üretken merkezdir.** Tüm kod, API'ler, kullanıcı arayüzü ve testler Entity kataloğu ve veri modelinden türetilir. Kod spesifikasyonla uyuşmazsa, spesifikasyon kazanır.
2. **Entity-öncelikli tanımlama.** Herhangi bir kod yazmadan önce Entity'ler tanımlanmalı ve belgelenmelidir. Yeni özellikler "hangi endpoint'lere ihtiyacımız var?" ile değil, "hangi Entity'ler ilgili?" ile başlar.
3. **Veri modeli izlenebilirliği.** Kod tabanındaki her sütun, kısıtlama ve Relationship, Entity kataloğundaki bir girdiye kadar izlenebilir olmalıdır. İzlenmeyen şema öğeleri sapma olarak kabul edilir.
4. **Çıktı-öncelikli tasarım.** Kullanıcıların *gördüğü* şeyleri (gösterge panelleri, raporlar, listeler) girdilerden (formlar, API'ler) önce tasarlayın. Çıktı görüntüsü bilgi modelini yönlendirir.
5. **İş kuralları açıktır.** Her doğrulama, kısıtlama ve türetim kuralı bir BR-xxx tanımlayıcısı ile kayıt altına alınır. Yalnızca kodda bulunan kurallar borç olarak kabul edilir.

### Yazılım Geliştirmeye Eşlenen Üç Aşamalı Veri Modelleme

IDDD, klasik üç aşamalı veri modelleme sürecini doğrudan yazılım geliştirme aşamalarına eşler:

```
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Conceptual Model                         │         │  Gereksinimler / Kapsam Tanımı            │
│  "Hangi bilgi mevcut?"                    │────────>│  Entity tanımlama, kullanıcı hikayeleri   │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
                    │
                    v
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Logical Model                            │         │  API Sözleşmeleri / Doğrulama / İş Mantığı│
│  "Nasıl yapılandırılmış?"                 │────────>│  Davranışın %80'i burada tanımlanır       │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
                    │
                    v
┌───────────────────────────────────────────┐         ┌───────────────────────────────────────────┐
│  Physical Model                           │         │  Uygulama Kararları                       │
│  "Nasıl depolanır/çalıştırılır?"          │────────>│  Teknoloji seçimleri, depolama, dağıtım   │
└───────────────────────────────────────────┘         └───────────────────────────────────────────┘
```

Bilgi modelinin her öğesi otomatik olarak geliştirme çıktılarını ima eder:

| Bilgi Modeli Öğesi             | Türetilen Çıktı                                           |
|--------------------------------|------------------------------------------------------------|
| Entity tanımlama               | Gereksinim kapsamı, kullanıcı hikayeleri                   |
| Relationship'ler ve Cardinality| API endpoint yapısı, navigasyon                            |
| Attribute'lar ve veri tipleri  | Form alanları, doğrulama kuralları, DTO'lar                |
| Kısıtlamalar                   | Girdi doğrulama, tip tanımları                             |
| Türetilmiş Attribute'lar      | İş mantığı, hesaplama kuralları                            |
| Durum geçişleri                | İş akışları, durum yönetimi                                |
| Toplama / ilişki kuralları     | İşlem sınırları, tutarlılık kuralları                      |

**Mantıksal model tamamlandığında, uygulama davranışının %80'i zaten tanımlanmıştır -- herhangi bir teknoloji seçimi yapılmadan önce.**

---

## Desteklenen Platformlar

| Platform     | Ajan Sistemi            | Çoklu Ajan Stratejisi                                |
|--------------|-------------------------|------------------------------------------------------|
| Claude Code  | Claude Agent Teams      | Eşler arası mesajlaşma, bağımsız worktree'ler        |
| OpenAI Codex | Codex Agents SDK        | MCP Server üzerinden Handoff deseni                   |

---

## Ön Koşullar

| Gereksinim      | Detaylar                                             |
|------------------|------------------------------------------------------|
| Node.js          | **18+** (npm veya uyumlu bir paket yöneticisi ile)   |
| Claude Code      | **Claude Max** üyeliği + Agent Teams etkinleştirilmiş|
| OpenAI Codex     | **ChatGPT Plus** veya üstü (Pro/Business/Enterprise) |

`npx` yükleyicisi için Node.js'e ihtiyacınız var. Yapay zeka platform aboneliği, hangi platformu kullanıyorsanız onun için gereklidir.

---

## Kurulum

### Önerilen: Global Kurulum

```bash
npm i -g id3-cli
```

Global kurulum, tüm projelerinizde çalışan iki global beceri (`/id3-start` ve `/id3-clear`) kaydeder. Ardından herhangi bir projede `/id3-start` komutunu çalıştırın -- IDDD'nin kurulu olup olmadığını otomatik algılar ve her şeyi halleder.

### Alternatif: Proje Düzeyinde Kurulum

```bash
npx id3-cli@latest
```

Alt komuta gerek yoktur -- `id3-cli` başlatma sürecini doğrudan çalıştırır. Şunları yapacaktır:

1. Tüm IDDD şablonlarını (spesifikasyonlar, belgeler, yönlendirme, beceriler, Hook'lar) projenize kopyalar.
2. Platforma özgü sembolik bağlantılar (`.claude/skills/` veya `.agents/skills/`) oluşturarak orijinal `skills/` dizinine işaret eder.
3. Harness Hook'larını platformunuzun yapılandırma dosyasına kaydeder.
4. `.iddd/` durum dizinini başlatır (commit sayacı, önizleme çıktısı).

### Seçenekler

| Seçenek         | Açıklama                                                   |
|-----------------|-------------------------------------------------------------|
| `[target-dir]`  | Hedef dizin (varsayılan olarak mevcut dizin `.`)            |
| `--no-symlink`  | Sembolik bağlantı yerine beceri dosyalarını kopyalar (Windows'ta kullanışlıdır) |
| `--platform`    | Platformu zorla: `claude`, `codex` veya `all`               |

### Üzerine Yazma Algılama

Hedef dizinde `CLAUDE.md` zaten mevcutsa, `id3-cli` şu soruyu sorar:

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
│    2. Run /id3-start to begin (or /id3-identify-entities) │
│    3. Customize steering/data-conventions.md              │
│                                                           │
│  Global Skills (via npm i -g):                            │
│    ├── id3-start               (Smart Router)             │
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

## Kurulumdan Sonra Dizin Yapısı

`npm i -g id3-cli` komutunu çalıştırdıktan sonra aşağıdaki global beceriler sisteme kurulur:

```
~/.claude/skills-global/              Global beceriler (npm i -g ile kurulur)
  ├── id3-start/                      Akıllı yönlendirici giriş noktası
  │   ├── SKILL.md
  │   └── references/
  │       ├── phase-guide.md            Phase yönlendirme sınıflandırması
  │       └── dashboard-template.md     İlerleme gösterge paneli formatı
  └── id3-clear/                      Proje sıfırlama
      └── SKILL.md
```

`npx id3-cli@latest` komutunu çalıştırdıktan sonra (veya `/id3-start` aracılığıyla otomatik olarak) projeniz aşağıdaki yapıya sahip olur:

```
your-project/
│
│   ===== Paylaşılan (tüm platformlar) =====
│
├── skills/                          Beceri orijinalleri (tek doğru kaynak)
│   ├── id3-identify-entities/       Phase 0/1: Entity tanımlama
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── phase0-brownfield.md   Mevcut koddan tersine çıkarma
│   │       └── phase1-greenfield.md   Yeni projeler için yapılandırılmış görüşme
│   ├── id3-design-information/      Phase 2: Bilgi yapılandırma
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── phase2-procedure.md    İyileştirme prosedürü
│   ├── id3-design-ui/               Phase 2.5: UI tasarımı ve uygulaması
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── step1-structure-derivation.md
│   │       ├── step2-visual-contract.md
│   │       ├── step3-gate-and-mockup.md
│   │       └── step4-implementation.md
│   ├── id3-spawn-team/              Çoklu ajan uygulamasını dağıtma
│   ├── id3-info-audit/              Entropi denetimi (sapma algılama)
│   └── id3-preview/                 Bilgi modelinin görsel önizlemesi
│
├── specs/                           Bilgi modeli çıktıları
│   ├── entity-catalog.md              Entity envanteri + özet tablosu
│   ├── data-model.md                  Mermaid ERD + tasarım kararları
│   ├── ui-inventory.md                Ekran envanteri + eşleme matrisi
│   ├── ui-structure.md                Ekran envanteri + navigasyon (Phase 2.5)
│   └── ui-design-contract.md          Tasarım token'ları + bileşen eşleme (Phase 2.5)
│
├── docs/                            Destekleyici belgeler
│   ├── business-rules.md              BR-xxx indeksli iş kuralları
│   ├── domain-glossary.md             Terim / İngilizce / tanım / notlar
│   ├── info-debt.md                   Tutarsızlık takipçisi
│   └── model-changelog.md            Keep a Changelog formatı
│
├── steering/                        Proje düzeyinde kurallar
│   ├── product.md                     Ürün vizyonu ve kapsamı (kullanıcı tarafından yazılır)
│   └── data-conventions.md            PK stratejisi, adlandırma, zaman damgaları vb.
│
├── hooks/                           Harness Hook betikleri (derlenmiş JS paketleri)
│   ├── iddd-schema-drift.js           schema-drift algılama
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
│   ├── skills/ -> skills/             skills/ orijinallerine sembolik bağlantılar
│   └── hooks/
│       └── hook-config.json           IDDD Hook ayarları
│
│   ===== Platform: OpenAI Codex =====
│
├── AGENTS.md                        Platformlar arası ajan talimatları
├── .agents/
│   └── skills/ -> skills/             skills/ orijinallerine sembolik bağlantılar
└── .codex/
    └── hooks.json                     Codex Hook yapılandırması
```

### Beceri Dosyası Paylaşım Stratejisi

Beceri içeriği tek bir kanonik konumda (`skills/`) tutulur. Platforma özgü yollar (`.claude/skills/`, `.agents/skills/`) `init` CLI tarafından dinamik olarak oluşturulan sembolik bağlantılardır. Bu, tüm platformlarda tek bir bakım noktası sağlar. Windows'ta kopyalar oluşturmak için `--no-symlink` kullanın.

---

## İş Akışı

```
╔══════════════════════════════════════════════════════════════════════════╗
║                          IDDD WORKFLOW OVERVIEW                          ║
╚══════════════════════════════════════════════════════════════════════════╝

  ┌──────────────┐                  ┌──────────────┐
  │              │<--- diyalog ---->│              │
  │  Kullanıcı   │                  │  Lider Ajan  │
  │              │                  │              │
  └──────────────┘                  └──────┬───────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        │                                     │
                        v                                     v
             ┌────────────────────┐          ┌────────────────────┐
             │  Mevcut kod var mı?│          │  Mevcut kod yok mu?│
             └─────────┬──────────┘          └─────────┬──────────┘
                       │                               │
                       v                               v
  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
  │  Phase 0: Tersine Çıkarma        │  │  Phase 1: Yapılandırılmış Görüşme│
  │                                  │  │                                  │
  │  - ORM / şema dosyalarını tara   │  │  "Alanınız hangi bilgileri       │
  │  - Entity'leri çıkar             │  │   yönetiyor?"                    │
  │  - Relationship'leri çıkar       │  │  - Temel Entity'leri tanımla     │
  │  - Doğrulama görüşmesi           │  │  - Relationship'leri keşfet      │
  └────────────────┬─────────────────┘  └────────────────┬─────────────────┘
                   │                                     │
                   v                                     v
          ┌─────────────────────────────────────────────────────┐
          │              Entity Kataloğu Üretildi               │
          └─────────────────────────┬───────────────────────────┘
                                    │
                                    v
  ┌────────────────────────────────────────────────────────────────────┐
  │  Phase 2: Bilgi Tasarımı                                           │
  │                                                                    │
  │  - Conceptual --> Logical Model                                    │
  │  - İş kurallarını türet (BR-xxx)                                   │
  │  - Hook'ları ve sürüm başlıklarını kaydet                          │
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
  │  │  spec  │ │ impl │ │ qa │    │  │  │  Handoff Deseni          │  │
  │  └───┬────┘ └──┬───┘ └─┬──┘    │  │  │  MCP Server üzerinden    │  │
  │      │         │       │       │  │  └──────────────────────────┘  │
  │      └── mesajlaşma ───┘       │  │                                │
  │         (eşler arası)          │  │  spec -> impl -> qa            │
  │                                │  │  (sıralı handoff)              │
  └────────────────────────────────┘  └────────────────────────────────┘
```

### Phase Adım Adım

> **İpucu:** Bireysel phase komutlarını ezberlemek yerine `/id3-start [isteğiniz]` komutunu kullanın. İlerleme gösterge panelini gösterir, niyetinizi analiz eder ve doğru phase becerisine otomatik yönlendirir. Bu, önerilen giriş noktasıdır.

**Phase 0/1 -- Entity Tanımlama:**
Yapay zeka kodlama ajanınızı açın ve `/id3-start alan entity'lerini tanımla` komutunu çalıştırın (ya da doğrudan `/id3-identify-entities`). Ajan, mevcut bir kod tabanınız (brownfield) olup olmadığını veya sıfırdan mı başladığınızı (greenfield) otomatik olarak algılar, ardından uygun tanımlama akışını çalıştırır.

**Phase 2 -- Bilgi Tasarımı:**
`/id3-start bilgi modelini iyileştir` komutunu çalıştırın (ya da doğrudan `/id3-design-information`). Ajan kavramsal modeli mantıksal modele dönüştürür, iş kurallarını türetir ve sürüm başlıkları ile Hook yapılandırmalarını ayarlar.

**Phase 2.5 -- UI Tasarımı:**
`/id3-start UI'yi tasarla` komutunu çalıştırın (ya da doğrudan `/id3-design-ui`). Ajan, Entity kataloğundan ekran yapısını türetir, tasarım token'ları ile görsel tasarım sözleşmesi oluşturur, etkileşimli mockup önizlemesi ile 7-Pillar kalite kapısı çalıştırır ve ardından paralel ekran uygulaması için Agent Teams oluşturarak uygulama sonrası denetim gerçekleştirir.

**Phase 3-5 -- Agent Teams ile Uygulama:**
`/id3-start sistemi geliştir` komutunu çalıştırın (ya da doğrudan `/id3-spawn-team`). Ajan, sonlandırılmış bilgi modelini okur ve sistemi paralel olarak uygulamak için özelleşmiş ajanlardan oluşan bir takım (spec-generator, implementer, qa-reviewer) oluşturur.

---

## Beceriler

### id3-start (Global -- Akıllı Yönlendirici)

IDDD için akıllı giriş noktası. Kullanıcıların bireysel phase beceri adlarını ezberlemesi gerekmez -- `/id3-start` isteği analiz eder ve doğru beceriye otomatik yönlendirir.

**Tetikleme anahtar kelimeleri:** `start IDDD`, `begin project`, `what should I do next`, `identify entities`, `design information`, `design ui`, `build`, `audit`, `preview`

**Yetenekler:**

1. **Otomatik kurulum:** Mevcut projede IDDD'nin kurulu olup olmadığını algılar (`specs/entity-catalog.md` + `CLAUDE.md`). Kurulu değilse, devam etmeden önce IDDD'yi kurmak için `npx id3-cli .` komutunu otomatik olarak çalıştırır.
2. **İlerleme gösterge paneli:** Her phase için tamamlanma durumunu (Phase 0/1, Phase 2, Phase 2.5, Phase 3-5) görsel semboller (tamamlandı için onay işareti, devam ediyor için elmas, başlanmadı için daire) ve ilerleme çubuğu ile gösterir.
3. **Niyet yönlendirme:** Kullanıcının doğal dil isteğini phase sinyal anahtar kelimelerine göre analiz eder ve doğru phase becerisine (`/id3-identify-entities`, `/id3-design-information`, `/id3-design-ui`, `/id3-spawn-team`, `/id3-info-audit` veya `/id3-preview`) yönlendirir.
4. **Belirsiz istek yönetimi:** Bir istek birden fazla phase ile eşleşebiliyorsa (örn. "listeye filtre ekle" yalnızca UI veya yeni veri entity'leri gerektirebilir), yönlendirmeden önce bir netleştirme sorusu sorar.
5. **UI hızlı yolu:** İstek yalnızca açık UI anahtar kelimeleri içeriyorsa ve halihazırda bir veri modeli mevcutsa (sürüm >= 1.0), entity'ler hakkında sormadan doğrudan `/id3-design-ui`'ya yönlendirir.
6. **Ön koşul kontrolü:** Hedef phase karşılanmamış ön koşullara sahipse uyarır ve doğru başlangıç phase'ini önerir.

**Kullanım:**

```
/id3-start                          Gösterge panelini göster + sonraki eylemi öner
/id3-start identify the entities    /id3-identify-entities'e yönlendir
/id3-start design the UI            /id3-design-ui'ya yönlendir
/id3-start build the system         /id3-spawn-team'e yönlendir
/id3-start run an audit             /id3-info-audit'e yönlendir
```

**Kurulum:** `npm i -g id3-cli` aracılığıyla `~/.claude/skills-global/id3-start/` konumuna global olarak kurulur.

---

### id3-identify-entities (Phase 0/1)

IDDD iş akışının giriş noktası. Bu beceri brownfield ve greenfield yolları arasında **otomatik olarak dallanır**.

**Tetikleme anahtar kelimeleri:** `identify entities`, `information analysis`, `domain analysis`, `new project`, `entity identification`

**Otomatik algılama mantığı:** Beceri, proje kök dizinini ORM/şema dosyaları (Prisma, Drizzle, Django models, TypeORM entities, SQL migrations, Sequelize configs) için tarar. Bulunursa Phase 0'a girer; aksi halde Phase 1'e.

#### Phase 0: Brownfield -- Bilgi Modelini Tersine Çıkarma

Mevcut kod tabanları için ajan, örtük bilgi modelini sistematik olarak dört katmandan çıkarır:

| Katman | Kaynak           | İncelenen                                              | Güvenilirlik |
|--------|------------------|--------------------------------------------------------|--------------|
| L1     | Veritabanı Şeması| Tablolar, sütunlar, FK, indeksler, kısıtlamalar        | En Yüksek    |
| L2     | ORM / Modeller   | Sanal alanlar, türetilmiş Attribute'lar, soft delete, durum | Yüksek   |
| L3     | API Sözleşmeleri | Endpoint'ler, DTO'lar, doğrulama mantığı               | Orta         |
| L4     | Ön Yüz          | Rotalar, bileşenler, form alanları                      | Referans     |

L4 araştırması kapsamlıdır: ekran-Entity eşleme matrisleri içeren eksiksiz bir kullanıcı arayüzü envanteri (`specs/ui-inventory.md`) oluşturmak için dosya tabanlı yönlendirmeyi (Next.js `app/`, `pages/`), React Router, Vue Router vb. tarar.

Bulgular **eşleşme** (katmanlar arasında tutarlı), **uyumsuzluk** (`docs/info-debt.md`'de kaydedilir) veya **örtük** (kod mantığında gizli, açık iş kuralları olarak ortaya çıkarılır) şeklinde sınıflandırılır.

Çıkarma işleminden sonra, bir **doğrulama görüşmesi** doğruluğu kullanıcıyla teyit eder.

**Üretilen çıktılar:** `specs/entity-catalog.md`, `specs/data-model.md`, `specs/ui-inventory.md`, `docs/business-rules.md`, `docs/info-debt.md`

#### Phase 1: Greenfield -- Yapılandırılmış Görüşme

Yeni projeler için ajan, alan bilgisini keşfetmek üzere yapılandırılmış bir görüşme yapar:

1. **Bilgi tanımlama** -- "Bu sistem hangi temel 'şeyleri' (isimleri) yönetiyor?"
2. **Relationship keşfi** -- "Bu şeyler nasıl ilişkili? Bire-çok mu yoksa çoka-çok mu?"
3. **Kural keşfi** -- "Hangi kurallar uygulanmalı? Herhangi bir durum geçişi var mı?"
4. **Silverston evrensel desen kontrol listesi** -- Ajan, keşfedilen Entity'leri kanıtlanmış desenlere karşı çapraz referanslar: Party, Product/Service, Order/Transaction, Classification, Status/Lifecycle, Hierarchy, Contact Mechanism, Document/Content.

**Üretilen çıktılar:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-information (Phase 2)

Kavramsal modeli bir **mantıksal modele** dönüştürür. İş kuralları, geçerlilik kısıtlamaları ve türetim kuralları bilgi modelinden otomatik olarak türetilir.

**Tetikleme anahtar kelimeleri:** `design information`, `refine model`, `logical model`, `schema design`, `information structuring`

**Ön koşul:** `specs/entity-catalog.md` en az 2 tanımlanmış Entity ile mevcut olmalıdır.

**Prosedür:**

1. **Attribute iyileştirme** -- Somut veri tipleri (UUID, TEXT, INTEGER, TIMESTAMP, JSONB vb.), NOT NULL / DEFAULT / UNIQUE kısıtlamaları ve indeks gereksinimleri atanır.
2. **Relationship somutlaştırma** -- FK yerleşimi, silme/güncelleme kuralları (CASCADE, SET NULL, RESTRICT) belirlenir ve çoka-çok Relationship'ler için birleştirme tabloları tanımlanır.
3. **Otomatik iş kuralı türetme:**
   - NOT NULL kısıtlaması --> "Bu alan zorunludur" (BR-xxx)
   - UNIQUE kısıtlaması --> "Yinelenenlere izin verilmez" (BR-xxx)
   - FK + CASCADE --> "Üst öğeyi silmek alt öğeleri de siler" (BR-xxx)
   - Durum geçişleri --> "İzin verilen geçiş yolları" (BR-xxx)
   - Türetilmiş Attribute'lar --> "Hesaplama kuralı" (BR-xxx)
4. **Tasarım kararı soruları** -- Ajan, kullanıcıya büyük veri depolama stratejisi, soft delete kapsamı, çok kiracılılık, denetim izi ihtiyaçları vb. hakkında sorular sorar.
5. **Çıktı sonlandırma** -- Tüm spesifikasyon dosyalarını sürüm başlıkları ve Hook yapılandırmaları ile günceller.

**Güncellenen çıktılar:** `specs/entity-catalog.md`, `specs/data-model.md`, `docs/business-rules.md`

---

### id3-design-ui (Phase 2.5)

Bilgi modelinden UI yapısı ve görsel tasarım türetir, ardından Agent Teams kullanarak ekranları uygular.

**Tetikleme anahtar kelimeleri:** `design ui`, `ui design`, `screen design`, `phase 2.5`, `ui structure`

**Ön koşul:** Phase 2 tamamlanmış (`entity-catalog.md` version >= `"1.0"`).

**4 Adımlı Pipeline:**

1. **UI Yapı Türetme** -- 9 türetme kuralı (entity -> list/detail/form/dashboard) kullanarak Entity'leri ekranlara otomatik eşler. 12 tip tabanlı kural ile Attribute'ları Widget'lara eşler. "Çıktı önce, girdi sonra" ilkesini uygular.
2. **Görsel Tasarım Sözleşmesi** -- Mevcut frontend framework'ü (React, Vue, Svelte vb.) ve UI kütüphanesini algılar. 5 tasarım token alanı oluşturur: spacing, typography, color, copywriting, component registry.
3. **Uygulama Öncesi Kapı** -- 7-Pillar doğrulama (yapı bütünlüğü, spacing, typography, color, copywriting, component registry, traceability) çalıştırır. Örnek verilerle 3 seviyeli HTML mockup (wireframe, styled, interactive) oluşturur.
4. **Uygulama + Sonrası Denetim** -- Paralel ekran uygulaması için Agent Teams oluşturur. Uygulama sonrası görsel denetim her Pillar'ı 1-4 olarak puanlar ve en önemli 3 düzeltmeyi türetir.

**Çıktılar:** `specs/ui-structure.md`, `specs/ui-design-contract.md`, `.iddd/preview/mockup-*.html`, `.iddd/preview/ui-audit.html`

---

### id3-spawn-team (Phase 3-5)

Sonlandırılmış bilgi modeline dayalı olarak sistemi uygulamak için özelleşmiş ajanlardan oluşan bir takım oluşturur.

**Ön koşul:** `specs/entity-catalog.md` ve `specs/data-model.md` Phase 2 tamamlanmış olarak mevcut olmalıdır.

#### Claude Code: Agent Teams

Her biri bağımsız bağlam pencereleri ve bağımsız Git worktree'leri olan üç takım üyesi oluşturulur:

| Takım Üyesi       | Rol                                                           |
|--------------------|---------------------------------------------------------------|
| spec-generator     | Bilgi modelini requirements.md ve api-contracts.md'ye dönüştürür |
| implementer        | Spesifikasyonlardan kod oluşturur, Entity başına atomik commit  |
| qa-reviewer        | Uygulamayı bilgi modeline karşı doğrular; başarısızlık durumunda implementer'a doğrudan mesaj gönderir |

**Görev oluşturma kuralları:**
- Entity başına bir görev oluşturmak için Entity kataloğu okunur (model + migration + API + doğrulama + testler).
- Veri modelindeki FK bağımlılıkları bağımlılık grafiğini belirler.
- Bağımsız Entity'ler paralel çalışır; bağımlı Entity'ler üst öğelerini bekler.

#### OpenAI Codex: Agents SDK + Handoff Deseni

Codex'te, çoklu ajan çalışması Agents SDK handoff desenini kullanır. Codex bir MCP Server olarak başlatılır (`codex --mcp-server`) ve bir Proje Yöneticisi ajanı, aynı üç role (spec-generator, implementer, qa-reviewer) görevleri handoff'lar aracılığıyla dağıtmak için Entity kataloğunu okur.

---

### id3-info-audit

Sapma ve entropiyi algılamak için kod tabanını bilgi modeline karşı denetler.

**Tetikleme anahtar kelimeleri:** `info audit`, `information audit`, `model audit`, `drift check`

**Prosedür:**

1. `specs/entity-catalog.md`'den Entity listesini okur.
2. Kod tabanını şunlar için tarar:
   - Uygulanmamış Entity'ler / tanımlanmamış modeller
   - `docs/business-rules.md`'de olup koda yansımayan iş kuralları
   - Veri tipi / kısıtlama uyumsuzlukları
3. `specs/ui-structure.md` ve `specs/ui-design-contract.md`'ye karşı kullanıcı arayüzü tutarlılığını kontrol eder:
   - Uygulanmamış ekranlar / tanımlanmamış ekranlar
   - Form alanı ile Attribute eşleme uyumsuzlukları
   - Eksik navigasyon yolları
4. Sürüm başlıklarını günceller (`last_verified`, `audit_status`).
5. Hook atlama geçmişini kontrol eder (`.iddd/skip-history.log`).
6. Görsel göstergelerle Entity bazında durum raporu çıktılar.

**Görsel çıktı:** Denetim sonuçları `.iddd/preview/audit-{date}.html` içinde etkileşimli bir HTML gösterge paneli olarak oluşturulur.

---

### id3-preview

Bilgi modelini ve denetim sonuçlarını tarayıcıda görüntülemek için hafif bir yerel HTTP sunucusu başlatır.

**Tetikleme anahtar kelimeleri:** `preview`, `show erd`, `show model`, `visual preview`

Sunucu `listen(0)` (işletim sistemi tarafından atanan port) kullanır ve şunları sunar:
- **ERD Önizlemesi** -- Entity'ye tıklayarak katalog detaylarına giden etkileşimli Mermaid ERD
- **Kullanıcı Arayüzü Mockup'ı** -- `specs/ui-structure.md` ve `specs/ui-design-contract.md`'den türetilen wireframe düzenleri
- **Denetim Gösterge Paneli** -- İş kuralı kapsamı ile Entity bazında durum kartları

Tüm HTML dosyaları `.iddd/preview/` içinde kalıcıdır ve sunucu olmadan bile doğrudan tarayıcıda açılabilir.

---

### id3-clear (Global -- Proje Sıfırlama)

Mevcut projeden tüm IDDD tarafından oluşturulan dosyaları güvenle kaldırır ve projeyi IDDD öncesi durumuna geri döndürür.

**Tetikleme anahtar kelimeleri:** `clear iddd`, `reset iddd`, `remove iddd`, `clean project`

**Prosedür:**

1. **Kurulumu doğrula:** Projede IDDD dosyalarının mevcut olup olmadığını kontrol eder. Hiçbiri bulunamazsa "No IDDD files found" mesajı verir ve durur.
2. **Hedefleri tara:** Hangi IDDD dizinlerinin (`specs/`, `docs/`, `steering/`, `hooks/`, `skills/`, `.claude/skills/`, `.claude/hooks/`, `.codex/skills/`, `.agents/skills/`, `.iddd/`) ve dosyaların (`CLAUDE.md`, `AGENTS.md`) gerçekten mevcut olduğunu belirler.
3. **Uyarı göster:** Silinecek tüm dosya ve dizinlerin ayrıntılı listesini görüntüler. Kullanıcı tarafından yazılmış dosyalar için özel uyarılar ekler (`steering/product.md`, `steering/data-conventions.md`).
4. **Onay iste:** `[y/N]` ile onay ister (varsayılan N). Yalnızca açık "y" veya "yes" yanıtında devam eder.
5. **Silme işlemini gerçekleştir:** Yalnızca belirlenen hedefleri kaldırır. Sayılarla tamamlanma özetini gösterir.

**Güvenlik kuralları:**
- Bilinen IDDD dosya listesi dışındaki dosyaları asla silmez
- `rm -rf *` gibi glob desenleri asla kullanmaz
- Onay adımını asla atlamaz
- Seçici silme için bunun yerine manuel dosya işlemlerini kullanın

**Kurulum:** `npm i -g id3-cli` aracılığıyla `~/.claude/skills-global/id3-clear/` konumuna global olarak kurulur.

---

## Harness Hook Sistemi

IDDD, otomatik Hook'lar aracılığıyla bilgi-öncelikli disiplini uygular. Felsefe "lütfen süreci takip edin" değil, **"takip etmezseniz commit engellenir"** şeklindedir.

### Hook Genel Bakış

| Hook           | Tetikleyici      | Eylem                                               | Önem Derecesi |
|----------------|------------------|------------------------------------------------------|---------------|
| schema-drift   | pre-commit       | Şema değişikliklerinin entity-catalog.md ile eşleştiğini doğrular | **BLOCK** (commit reddedilir) |
| rule-check     | pre-commit       | Yeni doğrulama mantığını business-rules.md'ye karşı kontrol eder | **WARN** (commit izin verilir, mesaj gösterilir) |
| auto-audit     | post-commit      | Her N commit'te bir info-audit çalıştırır            | **INFO** (rapor oluşturulur) |

### schema-drift (BLOCK)

Şema ile ilgili dosyaları (Prisma, Drizzle, Django models, TypeORM entities, SQL migrations vb.) değiştirdiğinizde, Hook `specs/entity-catalog.md`'nin buna uygun olarak güncellenip güncellenmediğini kontrol eder. Güncellenmemişse commit **reddedilir**. Bilgi modeli her zaman koddan *önce* güncellenmelidir.

**İzlenen dosya desenleri** (yapılandırılabilir):
```
prisma/schema.prisma, drizzle/**/*.ts, **/migrations/*.sql,
**/models.py, **/entities/*.ts, **/entities/*.java, schema.sql
```

### rule-check (WARN)

Doğrulama mantığı (Zod, Yup, Joi, Pydantic vb.) eklediğinizde veya değiştirdiğinizde, Hook `docs/business-rules.md`'de karşılık gelen bir `BR-xxx` girdisi arar. Eksikse bir uyarı verilir. Commit devam eder, ancak eksik kural işaretlenir.

**İzlenen dosya desenleri** (yapılandırılabilir):
```
*.schema.ts, *.validator.*, **/validators/**
```

### auto-audit (INFO)

Her N commit'te bir (varsayılan: 10, yapılandırılabilir), Harness otomatik olarak kod tabanını bilgi modeline karşı karşılaştıran bir info-audit çalıştırır. Commit sayacı `.iddd/commit-count` içinde saklanır. Sonuçlar `.iddd/preview/audit-{date}.html` dosyasına yazılır.

### Hook Yapılandırması

Tüm Hook ayarları `.claude/hooks/hook-config.json` (Claude Code) veya `.codex/hooks.json` (Codex) içinde bulunur.

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

Tüm IDDD Hook'larını devre dışı bırakmak için üst düzeyde `"enabled": false` olarak ayarlayın. Tek bir Hook'u devre dışı bırakmak için ilgili Hook'un `"enabled"` değerini `false` yapın. auto-audit sıklığını değiştirmek için `"interval_commits"` değerini ayarlayın.

### Hook Atlama

Tüm Hook'ları geçici olarak atlamak için `IDDD_SKIP_HOOKS=1` ayarlayın. Atlamalar `.iddd/skip-history.log` dosyasına kaydedilir ve denetimler sırasında gözden geçirilir.

---

## Entropi Yönetimi

Zaman içinde bilgi modelleri koddan uzaklaşır. IDDD, entropiyle üç mekanizma aracılığıyla mücadele eder:

### Sürüm Başlıkları

`specs/entity-catalog.md` ve `specs/data-model.md`, model durumunu izleyen YAML ön bilgi içerir:

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
- `version` her Phase tamamlandığında artırılır (Phase 1: `"0.1"`, Phase 2: `"1.0"`, sonraki: `"1.1"`, `"1.2"`, ...).
- `last_verified` model denetlendiğinde veya doğrulandığında güncellenir.
- `last_verified` **7 günden eski** ise, ajan yeni çalışmaya devam etmeden önce `/id3-info-audit` çalıştırmanızı isteyecektir. Eski modeller sapmaya yol açar.

### Değişiklik Günlüğü

Tüm model değişiklikleri `docs/model-changelog.md` içinde [Keep a Changelog](https://keepachangelog.com/) formatıyla kaydedilir:

```markdown
## [1.0] -- 2026-04-05
### Phase 2 Complete
- 12 entities finalized in logical model
- 19 business rules derived
- Design decisions: D-01 (S3 separation), D-02 (multi-tenant reservation), D-03 (soft delete scope)
- UI proposals: 6 screens generated
```

### Otomatik Denetim

`auto-audit` Hook'u (post-commit), sapma birikmeden önce yakalamak için her N commit'te bir tam bilgi denetimi çalıştırır.

---

## Özelleştirme Rehberi

IDDD, projenizin kurallarına uyarlanacak şekilde tasarlanmıştır. Neyi ve nerede özelleştireceğiniz aşağıda belirtilmiştir:

| Neyi özelleştirmeli                            | Düzenlenecek dosya                 |
|------------------------------------------------|------------------------------------|
| Ürün vizyonu ve kapsamı                        | `steering/product.md`              |
| Adlandırma kuralları, PK stratejisi, zaman damgaları, soft-delete politikası, ENUM vs referans tabloları | `steering/data-conventions.md` |
| Entity tanımları                               | `specs/entity-catalog.md`          |
| Veri modeli (ERD)                              | `specs/data-model.md`              |
| İş kuralları                                   | `docs/business-rules.md`           |
| Alan sözlüğü                                   | `docs/domain-glossary.md`          |
| Kullanıcı arayüzü ekran envanteri             | `specs/ui-inventory.md`            |
| UI yapısı (ekran türetme)                      | `specs/ui-structure.md`            |
| UI tasarım sözleşmesi (token'lar, bileşenler) | `specs/ui-design-contract.md`      |
| Hook davranışı (etkinleştirme/devre dışı bırakma, önem derecesi) | `.claude/hooks/hook-config.json`   |
| Hook'lar için izlenen dosya desenleri          | `.claude/hooks/hook-config.json`   |
| auto-audit commit aralığı                      | `.claude/hooks/hook-config.json`   |
| Codex Hook yapılandırması                      | `.codex/hooks.json`                |

**İpucu:** Tüm `specs/` ve `docs/` dosyaları sürüm başlıkları içeren YAML ön bilgi kullanır. IDDD Harness'ı entropi sapmasını algılamak için bu sürümleri izler. Bir spesifikasyon dosyasını değiştirdiğinizde her zaman sürüm başlığını güncelleyin.

---

## Kullanım Örnekleri

### Örnek 1: Yeni Bir Proje Başlatma (Greenfield)

```
$ npm i -g id3-cli
$ mkdir my-saas && cd my-saas && git init
$ claude
> /id3-start

  ╔════════════════════════════════════════════════════════════════╗
  ║  Welcome to IDDD -- Information Design-Driven Development.     ║
  ║  Your information model is your harness.                       ║
  ╚════════════════════════════════════════════════════════════════╝

  IDDD is not set up in this project. Setting up now...
  IDDD initialized. Here is your project dashboard:

  (dashboard shows all phases as ○ -- not started)

  > Suggested next action: Entity Identification (Phase 0/1).
  > Use `/id3-start [your request]` to begin.

> /id3-start identify the entities in my SaaS domain

  Routing to /id3-identify-entities -- Identify domain entities through structured interview.
  This phase produces: specs/entity-catalog.md, specs/data-model.md, docs/business-rules.md

  Agent: "What core 'things' does your system manage?"
  You: "Users, Organizations, Subscriptions, Invoices, and Features."
  Agent: "How are Users related to Organizations?"
  You: "Many-to-many through a Membership entity with a role attribute."
  ...

  Entity catalog produced: specs/entity-catalog.md (5 entities, 7 relationships)

> /id3-start refine the model

  Routing to /id3-design-information -- Refine conceptual model into logical model.

  Agent refines attributes, derives 14 business rules.
  specs/entity-catalog.md updated (version: 1.0)
  docs/business-rules.md updated (BR-001 through BR-014)

> /id3-start design the UI

  Routing to /id3-design-ui -- Design and implement UI derived from the information model.

  Step 1: Deriving UI structure from 5 entities... 8 screens mapped
  Step 2: Design contract established (React + Tailwind detected)
  Step 3: 7-Pillar gate passed. Mockup preview: http://localhost:52341
  Step 4: Spawning Agent Teams for screen implementation...
  Post-audit: all 7 pillars scored 3+/4

  specs/ui-structure.md generated
  specs/ui-design-contract.md generated

> /id3-start build

  Routing to /id3-spawn-team -- Spawn Agent Teams for parallel implementation.

  Spawning Agent Teams:
  - spec-generator: generating requirements.md, api-contracts.md
  - implementer: building User -> Organization -> Membership -> ...
  - qa-reviewer: verifying against information model
```

### Örnek 2: Mevcut Bir Projeye Uygulama (Brownfield)

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

## Entelektüel Köken

IDDD, çeşitli entelektüel geleneklerden fikirleri sentezler:

- **Peter Chen'in ER Modeli (1976)** -- "Gerçek dünya Entity'lerden ve Relationship'lerden oluşur." Bilgi yapısının uygulama mantığından önce geldiğine dair temel içgörü.
- **Len Silverston'ın Evrensel Veri Modelleri** -- Keşfedilen Entity'lerin doğrulandığı bir kontrol listesi olarak hizmet eden yeniden kullanılabilir bilgi desenleri (Party, Product, Order, Hierarchy).
- **Eric Evans'ın Domain-Driven Design'ı (2003)** -- Bounded Context, Ubiquitous Language ve Aggregate desenleri. IDDD, alan diline ve açık sınırlara verilen önemi miras alır.
- **Sophia Prater'ın OOUX'u (Object-Oriented UX)** -- "Etkileşimlerden önce nesneleri tasarlayın." ORCA çerçevesi (Objects, Relationships, CTAs, Attributes) doğrudan IDDD'nin çıktı-öncelikli kullanıcı arayüzü türetmesini bilgilendirir.
- **Jamie Lord'un "Data First, Code Second" (2024)** -- "Bilgiyi veriye katla." Unix Temsil Kuralı'nın modern yazılım geliştirmeye uygulanması.
- **Mitchell Hashimoto'nun Harness Mühendisliği (2026)** -- `Agent = Model + Harness`. Yapay zeka ajanlarının zaman içinde etkin kalabilmeleri için mimari kısıtlamalara, bağlam mühendisliğine ve entropi yönetimine ihtiyaç duyduğu içgörüsü. IDDD'nin Hook sistemi, sürüm başlıkları ve auto-audit'i Harness mühendisliği ilkelerinin doğrudan uygulamalarıdır.

**Temel içgörü:** *Mantıksal model tamamlandığında, uygulama davranışının %80'i zaten tanımlanmıştır -- herhangi bir teknoloji seçimi yapılmadan önce. Ve bu bilgi modelinin kendisi, yapay zeka ajanları için en iyi Harness'tır.*

---

## Lisans

MIT

---

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│    "Hangi bilgi mevcut?" -- her zaman ilk soru.                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

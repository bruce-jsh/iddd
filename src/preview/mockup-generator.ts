import { escapeHtml } from './renderer.js';

// ── Types ──────────────────────────────────────────────

export interface AttributeDef {
  name: string;
  type: string; // VARCHAR, TEXT, ENUM, BOOLEAN, INTEGER, DECIMAL, DATE, TIMESTAMP, FK, UUID, FILE, JSONB
  constraints: string[]; // PK, NOT NULL, UNIQUE, DEFAULT, CHECK
  maxLength?: number;
  enumValues?: string[];
  refEntity?: string;
  subtype?: string; // email, url, phone
  min?: number;
  max?: number;
}

export interface RelationshipDef {
  target: string;
  type: '1:N' | 'N:1' | 'N:M' | '1:1';
  fk: string;
}

export interface StateTransition {
  from: string;
  to: string;
}

export interface EntityDef {
  name: string;
  attributes: AttributeDef[];
  relationships: RelationshipDef[];
  stateTransitions: StateTransition[];
}

export interface ScreenDerivation {
  name: string;
  url: string;
  entity: string;
  pattern: string; // list, detail, create, edit, dashboard, child-tab, association-manager
  priority: string;
  source: string;
  relatedEntity?: string;
}

export interface DesignTokens {
  spacing: { base: number };
  colors: { accent: string; surface: string; secondary: string };
  typography: { body: { size: string; weight: string } };
}

// ── Entity -> Screen derivation (9 rules) ──────────────

function pluralize(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith('s')) return lower + 'es';
  if (lower.endsWith('y') && !/[aeiou]y$/i.test(name)) return lower.slice(0, -1) + 'ies';
  return lower + 's';
}

export function deriveScreensFromEntities(entities: EntityDef[]): ScreenDerivation[] {
  const screens: ScreenDerivation[] = [];

  for (const entity of entities) {
    const plural = pluralize(entity.name);
    const hasPk = entity.attributes.some(a => a.constraints.includes('PK'));
    const hasNotNull = entity.attributes.some(a =>
      a.constraints.includes('NOT NULL') && !a.constraints.includes('PK')
      && !['created_at', 'updated_at', 'deleted_at'].includes(a.name)
    );
    const hasMutable = entity.attributes.some(a =>
      !a.constraints.includes('PK')
      && !['created_at', 'updated_at', 'deleted_at'].includes(a.name)
    );
    const hasStateTransitions = entity.stateTransitions.length > 0;

    // Rule 1: Entity exists -> List View
    screens.push({
      name: `${entity.name} List`,
      url: `/${plural}`,
      entity: entity.name,
      pattern: 'list',
      priority: 'P1',
      source: 'auto-derived',
    });

    // Rule 2: PK exists -> Detail View
    if (hasPk) {
      screens.push({
        name: `${entity.name} Detail`,
        url: `/${plural}/:id`,
        entity: entity.name,
        pattern: 'detail',
        priority: 'P1',
        source: 'auto-derived',
      });
    }

    // Rule 3: NOT NULL attributes -> Create Form
    if (hasNotNull) {
      screens.push({
        name: `Create ${entity.name}`,
        url: `/${plural}/new`,
        entity: entity.name,
        pattern: 'create',
        priority: 'P1',
        source: 'auto-derived',
      });
    }

    // Rule 4: Mutable attributes -> Edit Form
    if (hasMutable) {
      screens.push({
        name: `Edit ${entity.name}`,
        url: `/${plural}/:id/edit`,
        entity: entity.name,
        pattern: 'edit',
        priority: 'P2',
        source: 'auto-derived',
      });
    }

    // Rule 5: State Transition -> Status Dashboard
    if (hasStateTransitions) {
      screens.push({
        name: `${entity.name} Dashboard`,
        url: `/${plural}/dashboard`,
        entity: entity.name,
        pattern: 'dashboard',
        priority: 'P2',
        source: 'auto-derived',
      });
    }

    // Rule 6: 1:N FK (parent side) -> Child Tab
    for (const rel of entity.relationships) {
      if (rel.type === '1:N') {
        screens.push({
          name: `${entity.name} ${rel.target} Tab`,
          url: `/${plural}/:id/${pluralize(rel.target)}`,
          entity: entity.name,
          pattern: 'child-tab',
          priority: 'P2',
          source: 'auto-derived',
          relatedEntity: rel.target,
        });
      }

      // Rule 7: N:M -> Association Manager
      if (rel.type === 'N:M') {
        screens.push({
          name: `${entity.name} ${rel.target} Manager`,
          url: `/${plural}/:id/${pluralize(rel.target)}/manage`,
          entity: entity.name,
          pattern: 'association-manager',
          priority: 'P3',
          source: 'auto-derived',
          relatedEntity: rel.target,
        });
      }
    }
  }

  return screens;
}

// ── Attribute -> Widget mapping (12 rules) ──────────────

export function mapAttributeToWidget(attr: AttributeDef): string {
  // Rule 10: UUID PK -> hidden
  if (attr.type === 'UUID' && attr.constraints.includes('PK')) return 'hidden';

  // Rule 12: Specialized input (email/url/phone)
  if (attr.subtype && ['email', 'url', 'phone'].includes(attr.subtype)) return 'specialized-input';

  // Rule 11: File -> file-upload
  if (attr.type === 'FILE') return 'file-upload';

  // Rule 3: ENUM -> select
  if (attr.type === 'ENUM') return 'select';

  // Rule 4: BOOLEAN -> toggle
  if (attr.type === 'BOOLEAN') return 'toggle';

  // Rule 5-6: INTEGER/DECIMAL -> number-input
  if (attr.type === 'INTEGER' || attr.type === 'DECIMAL') return 'number-input';

  // Rule 7: DATE -> date-picker
  if (attr.type === 'DATE') return 'date-picker';

  // Rule 8: TIMESTAMP -> datetime-picker
  if (attr.type === 'TIMESTAMP') return 'datetime-picker';

  // Rule 9: FK -> autocomplete
  if (attr.type === 'FK') return 'autocomplete';

  // Rule: JSONB -> json-editor
  if (attr.type === 'JSONB') return 'json-editor';

  // Rule 1-2: VARCHAR/TEXT based on length
  if (attr.type === 'TEXT' || (attr.type === 'VARCHAR' && (attr.maxLength === undefined || attr.maxLength > 200))) {
    return 'textarea';
  }

  return 'text-input';
}

// ── Sample data generation ────────────────────────────

const SAMPLE_NAMES = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eve Davis'];
const SAMPLE_EMAILS = ['alice@example.com', 'bob@example.com', 'carol@example.com', 'david@example.com', 'eve@example.com'];
const SAMPLE_ORGS = ['Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Corp', 'Stark Industries'];
const SAMPLE_TIMESTAMPS = ['2026-04-05 14:30', '2026-03-28 09:15', '2026-02-14 16:45', '2026-01-10 11:00', '2025-12-25 08:30'];
const SAMPLE_INTS = [42, 128, 7, 256, 1024];

export function generateSampleData(attr: AttributeDef, count: number): (string | number | boolean)[] {
  const results: (string | number | boolean)[] = [];
  for (let i = 0; i < count; i++) {
    if (attr.type === 'BOOLEAN') {
      results.push(i % 2 === 0);
    } else if (attr.type === 'INTEGER' || attr.type === 'DECIMAL') {
      results.push(SAMPLE_INTS[i % SAMPLE_INTS.length]);
    } else if (attr.type === 'ENUM' && attr.enumValues) {
      results.push(attr.enumValues[i % attr.enumValues.length]);
    } else if (attr.type === 'TIMESTAMP') {
      results.push(SAMPLE_TIMESTAMPS[i % SAMPLE_TIMESTAMPS.length]);
    } else if (attr.type === 'DATE') {
      results.push(SAMPLE_TIMESTAMPS[i % SAMPLE_TIMESTAMPS.length].split(' ')[0]);
    } else if (attr.type === 'FK') {
      results.push(SAMPLE_ORGS[i % SAMPLE_ORGS.length]);
    } else if (attr.subtype === 'email' || attr.name.includes('email')) {
      results.push(SAMPLE_EMAILS[i % SAMPLE_EMAILS.length]);
    } else if (attr.name.includes('name') || attr.name.includes('title')) {
      results.push(SAMPLE_NAMES[i % SAMPLE_NAMES.length]);
    } else {
      results.push(`Sample ${attr.name} ${i + 1}`);
    }
  }
  return results;
}

// ── Mockup Index HTML (left menu + full screen list) ─────

export function renderMockupIndexHtml(screens: ScreenDerivation[], title: string): string {
  // Group screens by entity
  const byEntity = new Map<string, ScreenDerivation[]>();
  for (const s of screens) {
    if (!byEntity.has(s.entity)) byEntity.set(s.entity, []);
    byEntity.get(s.entity)!.push(s);
  }

  const navItems = Array.from(byEntity.entries())
    .map(([entity, entityScreens]) => {
      const links = entityScreens
        .map(s => `        <li><a href="mockup-${entity.toLowerCase()}.html#${s.pattern}">${escapeHtml(s.name)}</a></li>`)
        .join('\n');
      return `      <li class="nav-group">
        <strong>${escapeHtml(entity)}</strong>
        <ul>
${links}
        </ul>
      </li>`;
    })
    .join('\n');

  const cards = screens
    .map(s => `      <div class="card">
        <div class="card-header">${escapeHtml(s.name)}</div>
        <div class="card-url">${escapeHtml(s.url)}</div>
        <div class="card-meta">Entity: ${escapeHtml(s.entity)} | Pattern: ${escapeHtml(s.pattern)} | Priority: ${escapeHtml(s.priority)}</div>
      </div>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { --bg: #ffffff; --text: #1a1a2e; --card: #f8f9fa; --border: #dee2e6; --accent: #3b82f6; --nav-bg: #f1f5f9; }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #1a1a2e; --text: #e0e0e0; --card: #16213e; --border: #334155; --nav-bg: #0f172a; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--text); display: flex; min-height: 100vh; }
    nav { width: 260px; background: var(--nav-bg); border-right: 1px solid var(--border); padding: 1rem; overflow-y: auto; position: fixed; top: 0; bottom: 0; }
    nav h2 { font-size: 1.1rem; margin-bottom: 1rem; }
    nav ul { list-style: none; }
    nav .nav-group { margin-bottom: 0.75rem; }
    nav .nav-group ul { margin-top: 0.25rem; padding-left: 1rem; }
    nav a { color: var(--accent); text-decoration: none; font-size: 0.9rem; }
    nav a:hover { text-decoration: underline; }
    main { margin-left: 260px; padding: 2rem; flex: 1; }
    h1 { font-size: 1.5rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; }
    .card-header { font-weight: bold; font-size: 1.1rem; }
    .card-url { font-family: monospace; color: #6c757d; margin: 0.25rem 0; }
    .card-meta { font-size: 0.85rem; color: #6c757d; }
    .meta { font-size: 0.85rem; color: #6c757d; margin-top: 2rem; }
  </style>
</head>
<body>
  <nav>
    <h2>Screens</h2>
    <ul>
${navItems}
    </ul>
  </nav>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <div class="grid">
${cards}
    </div>
    <p class="meta">Generated by IDDD Phase 2.5 -- ${new Date().toISOString().split('T')[0]}</p>
  </main>
</body>
</html>`;
}

// ── Entity Mockup HTML (3 fidelity levels + traceability) ──

export function renderEntityMockupHtml(entity: EntityDef, tokens: DesignTokens): string {
  const visibleAttrs = entity.attributes.filter(a =>
    !a.constraints.includes('PK')
    && !['created_at', 'updated_at', 'deleted_at'].includes(a.name)
  );

  // Generate wireframe tab content
  const wireframeRows = visibleAttrs
    .map(a => {
      const widget = mapAttributeToWidget(a);
      const required = a.constraints.includes('NOT NULL') ? ' *' : '';
      return `        <tr><td>${escapeHtml(a.name)}${required}</td><td>[${escapeHtml(widget)}]</td></tr>`;
    })
    .join('\n');

  const wireframeHtml = `
      <table class="wireframe-table">
        <tr><th>Field</th><th>Widget</th></tr>
${wireframeRows}
      </table>`;

  // Generate styled tab content (design tokens applied)
  const styledRows = visibleAttrs
    .map(a => {
      const widget = mapAttributeToWidget(a);
      const required = a.constraints.includes('NOT NULL') ? '<span class="required">*</span>' : '';
      return `        <div class="form-group" style="margin-bottom: ${tokens.spacing.base * 2}px;">
          <label style="font-size: ${tokens.typography.body.size}; font-weight: ${tokens.typography.body.weight};">${escapeHtml(a.name)}${required}</label>
          <div class="widget" data-type="${escapeHtml(widget)}">${escapeHtml(widget)}</div>
        </div>`;
    })
    .join('\n');

  const styledHtml = `
      <div class="styled-form" style="background: ${tokens.colors.surface}; padding: ${tokens.spacing.base * 3}px;">
${styledRows}
        <button style="background: ${tokens.colors.accent}; color: white; border: none; padding: ${tokens.spacing.base}px ${tokens.spacing.base * 2}px; border-radius: 4px;">Save</button>
      </div>`;

  // Generate interactive tab content (sample data)
  const sampleCount = 3;
  const headerCells = visibleAttrs.map(a => `<th>${escapeHtml(a.name)}</th>`).join('');
  const bodyRows: string[] = [];
  for (let row = 0; row < sampleCount; row++) {
    const cells = visibleAttrs
      .map(a => {
        const samples = generateSampleData(a, sampleCount);
        return `<td>${escapeHtml(String(samples[row]))}</td>`;
      })
      .join('');
    bodyRows.push(`        <tr>${cells}</tr>`);
  }

  const interactiveHtml = `
      <table class="interactive-table">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>
${bodyRows.join('\n')}
        </tbody>
      </table>`;

  // Generate traceability panel
  const traceRows = entity.attributes
    .map(a => {
      const widget = mapAttributeToWidget(a);
      const constraints = a.constraints.join(', ') || '-';
      return `        <tr>
          <td>${escapeHtml(entity.name)}</td>
          <td>${escapeHtml(a.name)}</td>
          <td>${escapeHtml(a.type)}</td>
          <td>${escapeHtml(widget)}</td>
          <td>${escapeHtml(constraints)}</td>
        </tr>`;
    })
    .join('\n');

  const traceHtml = `
      <div class="traceability">
        <h3>Traceability</h3>
        <table>
          <thead><tr><th>Entity</th><th>Attribute</th><th>Type</th><th>Widget</th><th>Constraints</th></tr></thead>
          <tbody>
${traceRows}
          </tbody>
        </table>
      </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mockup: ${escapeHtml(entity.name)}</title>
  <style>
    :root { --bg: #ffffff; --text: #1a1a2e; --card: #f8f9fa; --border: #dee2e6; --accent: ${tokens.colors.accent}; }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #1a1a2e; --text: #e0e0e0; --card: #16213e; --border: #334155; }
    }
    body { font-family: -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
    h1 { font-size: 1.5rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
    .tabs { display: flex; gap: 0; margin: 1.5rem 0 0; border-bottom: 2px solid var(--border); }
    .tab { padding: 0.5rem 1.5rem; cursor: pointer; border: 1px solid transparent; border-bottom: none; background: transparent; font-size: 1rem; color: var(--text); }
    .tab.active { background: var(--card); border-color: var(--border); border-bottom: 2px solid var(--bg); margin-bottom: -2px; font-weight: bold; }
    .tab-content { display: none; padding: 1.5rem; background: var(--card); border: 1px solid var(--border); border-top: none; }
    .tab-content.active { display: block; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.5rem; border: 1px solid var(--border); text-align: left; }
    th { background: var(--card); font-weight: 600; }
    .wireframe-table { font-family: monospace; }
    .form-group label { display: block; margin-bottom: 4px; }
    .widget { padding: 8px; border: 1px dashed var(--border); border-radius: 4px; color: ${tokens.colors.secondary}; }
    .required { color: #ef4444; margin-left: 2px; }
    .traceability { margin-top: 2rem; padding-top: 1rem; border-top: 2px solid var(--border); }
    .traceability h3 { margin-bottom: 0.5rem; }
    .meta { font-size: 0.85rem; color: #6c757d; margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>Mockup: ${escapeHtml(entity.name)}</h1>

  <div class="tabs">
    <button class="tab active" onclick="switchTab('wireframe')">Wireframe</button>
    <button class="tab" onclick="switchTab('styled')">Styled</button>
    <button class="tab" onclick="switchTab('interactive')">Interactive</button>
  </div>

  <div id="wireframe" class="tab-content active">
    <h2>Wireframe</h2>
${wireframeHtml}
  </div>

  <div id="styled" class="tab-content">
    <h2>Styled</h2>
${styledHtml}
  </div>

  <div id="interactive" class="tab-content">
    <h2>Interactive</h2>
${interactiveHtml}
  </div>

${traceHtml}

  <p class="meta">Generated by IDDD Phase 2.5 -- ${new Date().toISOString().split('T')[0]}</p>

  <script>
    function switchTab(tabId) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      document.querySelector('[onclick="switchTab(\\'' + tabId + '\\')"]').classList.add('active');
    }
  </script>
</body>
</html>`;
}

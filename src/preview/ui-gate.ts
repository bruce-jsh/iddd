// ── Types ──────────────────────────────────────────────

export interface ScreenEntry {
  name: string;
  url: string;
  entity: string;
  pattern: string;
  priority: string;
  source: string;
}

export interface TraceabilityEntry {
  entity: string;
  screens: Record<string, string>;
}

export interface UiStructureData {
  screens: ScreenEntry[];
  entityCoverage: string;
  traceabilityMatrix: TraceabilityEntry[];
}

export interface SpacingToken {
  token: string;
  value: string;
  usage: string;
}

export interface TypographyToken {
  token: string;
  size: string;
  weight: string;
  lineHeight: string;
  usage: string;
}

export interface ColorToken {
  token: string;
  light: string;
  dark: string;
  usage: string;
}

export interface CopywritingPattern {
  pattern: string;
  template: string;
  example: string;
}

export interface ComponentMapEntry {
  widget: string;
  component: string;
  importPath: string;
}

export interface UiDesignContractData {
  framework: string;
  spacing: SpacingToken[];
  typography: TypographyToken[];
  colors: ColorToken[];
  copywriting: CopywritingPattern[];
  componentMapping: ComponentMapEntry[];
}

export interface PillarResult {
  name: string;
  status: 'PASS' | 'BLOCKED';
  details: string;
}

export interface GateResult {
  verdict: 'PASS' | 'BLOCKED';
  pillars: PillarResult[];
}

// ── Markdown parsers ──────────────────────────────────

function parseMarkdownTable(markdown: string, headerPattern: RegExp): string[][] {
  const lines = markdown.split('\n');
  const rows: string[][] = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!inTable && headerPattern.test(trimmed)) {
      inTable = true;
      continue;
    }
    if (inTable && trimmed.startsWith('|') && trimmed.includes('---')) {
      continue; // separator row
    }
    if (inTable && trimmed.startsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      // Skip placeholder rows (first cell is a template marker)
      if (cells[0]?.startsWith('_(')) continue;
      rows.push(cells);
    } else if (inTable && !trimmed.startsWith('|')) {
      break; // end of table
    }
  }

  return rows;
}

export function parseUiStructure(markdown: string): UiStructureData {
  // Extract entity coverage from frontmatter
  const coverageMatch = markdown.match(/entity_coverage:\s*"([^"]+)"/);
  const entityCoverage = coverageMatch ? coverageMatch[1] : '0/0 (0%)';

  // Parse Screen Inventory table
  const screenRows = parseMarkdownTable(markdown, /^\|\s*Screen\s*\|/);
  const screens: ScreenEntry[] = screenRows.map(row => ({
    name: row[0] || '',
    url: row[1] || '',
    entity: row[2] || '',
    pattern: row[3] || '',
    priority: row[4] || '',
    source: row[5] || '',
  }));

  // Parse Traceability Matrix table
  const traceRows = parseMarkdownTable(markdown, /^\|\s*Entity\s*\|\s*List\s*\|/);
  const traceabilityMatrix: TraceabilityEntry[] = traceRows.map(row => {
    const screens: Record<string, string> = {};
    const headers = ['List', 'Detail', 'Create', 'Edit', 'Dashboard'];
    for (let i = 0; i < headers.length; i++) {
      const val = row[i + 1];
      if (val && val !== '-' && val !== '') {
        screens[headers[i]] = val;
      }
    }
    return { entity: row[0] || '', screens };
  });

  return { screens, entityCoverage, traceabilityMatrix };
}

export function parseUiDesignContract(markdown: string): UiDesignContractData {
  // Extract framework from frontmatter
  const fwMatch = markdown.match(/framework:\s*"([^"]+)"/);
  const framework = fwMatch ? fwMatch[1] : '';

  // Parse Spacing table
  const spacingRows = parseMarkdownTable(markdown, /^\|\s*Token\s*\|\s*Value\s*\|\s*Usage\s*\|/);
  const spacing: SpacingToken[] = spacingRows.map(row => ({
    token: row[0] || '',
    value: row[1] || '',
    usage: row[2] || '',
  }));

  // Parse Typography table
  const typographyRows = parseMarkdownTable(markdown, /^\|\s*Token\s*\|\s*Size\s*\|/);
  const typography: TypographyToken[] = typographyRows.map(row => ({
    token: row[0] || '',
    size: row[1] || '',
    weight: row[2] || '',
    lineHeight: row[3] || '',
    usage: row[4] || '',
  }));

  // Parse Colors table
  const colorRows = parseMarkdownTable(markdown, /^\|\s*Token\s*\|\s*Light\s*\|/);
  const colors: ColorToken[] = colorRows.map(row => ({
    token: row[0] || '',
    light: row[1] || '',
    dark: row[2] || '',
    usage: row[3] || '',
  }));

  // Parse Copywriting table
  const copyRows = parseMarkdownTable(markdown, /^\|\s*Pattern\s*\|\s*Template\s*\|/);
  const copywriting: CopywritingPattern[] = copyRows.map(row => ({
    pattern: row[0] || '',
    template: row[1] || '',
    example: row[2] || '',
  }));

  // Parse Component Mapping table
  const compRows = parseMarkdownTable(markdown, /^\|\s*Widget\s*\|\s*Component\s*\|/);
  const componentMapping: ComponentMapEntry[] = compRows.map(row => ({
    widget: row[0] || '',
    component: row[1] || '',
    importPath: row[2] || '',
  }));

  return { framework, spacing, typography, colors, copywriting, componentMapping };
}

// ── 7-Pillar Gate ─────────────────────────────────────

const GENERIC_TERMS = ['submit', 'click here', 'click', 'go', 'ok', 'press'];
const SPACING_SCALE = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128];

export function runSevenPillarGate(
  structure: UiStructureData,
  contract: UiDesignContractData,
  entityNames: string[]
): GateResult {
  const pillars: PillarResult[] = [];

  // Pillar 1: Structure Completeness
  const tracedEntities = new Set(structure.traceabilityMatrix.map(t => t.entity));
  const missingEntities = entityNames.filter(e => !tracedEntities.has(e));
  const coverageMatch = structure.entityCoverage.match(/(\d+)\/(\d+)/);
  const coveragePct = coverageMatch ? (parseInt(coverageMatch[1]) / parseInt(coverageMatch[2])) * 100 : 0;
  const structurePass = coveragePct >= 100 && missingEntities.length === 0;
  pillars.push({
    name: 'Structure Completeness',
    status: structurePass ? 'PASS' : 'BLOCKED',
    details: structurePass
      ? `All ${entityNames.length} entities have at least 1 screen mapping`
      : `Entity coverage: ${structure.entityCoverage}. Missing: ${missingEntities.join(', ')}`,
  });

  // Pillar 2: Spacing
  const spacingValues = contract.spacing.map(s => {
    const num = parseInt(s.value);
    return isNaN(num) ? -1 : num;
  });
  const badSpacing = spacingValues.filter(v => v >= 0 && !SPACING_SCALE.includes(v));
  const spacingPass = badSpacing.length === 0 && contract.spacing.length > 0;
  pillars.push({
    name: 'Spacing',
    status: spacingPass ? 'PASS' : 'BLOCKED',
    details: spacingPass
      ? `All ${contract.spacing.length} spacing values are on the 4px/8px scale`
      : `Non-standard spacing values found: ${badSpacing.join(', ')}px`,
  });

  // Pillar 3: Typography
  const uniqueSizes = new Set(contract.typography.map(t => t.size));
  const uniqueWeights = new Set(contract.typography.map(t => t.weight));
  const typoPass = uniqueSizes.size <= 4 && uniqueWeights.size <= 2 && contract.typography.length > 0;
  pillars.push({
    name: 'Typography',
    status: typoPass ? 'PASS' : 'BLOCKED',
    details: typoPass
      ? `${uniqueSizes.size} sizes, ${uniqueWeights.size} weights (within limits)`
      : `${uniqueSizes.size} sizes (max 4), ${uniqueWeights.size} weights (max 2)`,
  });

  // Pillar 4: Color
  const hasAccent = contract.colors.some(c => c.token.toLowerCase().includes('accent'));
  const semanticColors = contract.colors.filter(c =>
    ['error', 'warning', 'success', 'info'].some(s => c.token.toLowerCase().includes(s))
  );
  const accentCount = contract.colors.filter(c => c.token.toLowerCase().includes('accent')).length;
  const colorPass = hasAccent && accentCount <= 2 && contract.colors.length > 0;
  pillars.push({
    name: 'Color',
    status: colorPass ? 'PASS' : 'BLOCKED',
    details: colorPass
      ? `Accent defined (${accentCount}), ${semanticColors.length} semantic colors`
      : hasAccent ? `Too many accent colors: ${accentCount} (max 2)` : 'No accent color defined',
  });

  // Pillar 5: Copywriting
  const allTemplates = contract.copywriting.map(c => c.template.toLowerCase());
  const genericFound = allTemplates.filter(t =>
    GENERIC_TERMS.some(g => t === g || t.startsWith(g + ' '))
  );
  const hasRequiredPatterns = contract.copywriting.length >= 3; // CTA, Empty State, Error minimum
  const copyPass = genericFound.length === 0 && hasRequiredPatterns;
  pillars.push({
    name: 'Copywriting',
    status: copyPass ? 'PASS' : 'BLOCKED',
    details: copyPass
      ? `${contract.copywriting.length} patterns defined, no generic terms`
      : genericFound.length > 0
        ? `Generic terms found: ${genericFound.join(', ')}`
        : `Only ${contract.copywriting.length} patterns (need >= 3)`,
  });

  // Pillar 6: Component Registry
  const registryPass = contract.componentMapping.length > 0;
  pillars.push({
    name: 'Component Registry',
    status: registryPass ? 'PASS' : 'BLOCKED',
    details: registryPass
      ? `${contract.componentMapping.length} widget->component mappings defined`
      : 'No widget->component mappings defined',
  });

  // Pillar 7: Traceability
  const traceEntities = new Set(structure.traceabilityMatrix.map(t => t.entity));
  const untracedEntities = entityNames.filter(e => !traceEntities.has(e));
  const tracePass = untracedEntities.length === 0 && structure.screens.length > 0;
  pillars.push({
    name: 'Traceability',
    status: tracePass ? 'PASS' : 'BLOCKED',
    details: tracePass
      ? `All ${entityNames.length} entities have traceability entries`
      : `Missing traceability for: ${untracedEntities.join(', ')}`,
  });

  const verdict = pillars.every(p => p.status === 'PASS') ? 'PASS' : 'BLOCKED';

  return { verdict, pillars };
}

// ── Gate result report renderer ───────────────────────

export function renderGateResultMarkdown(result: GateResult): string {
  const lines: string[] = [
    '# UI Gate Result',
    '',
    `**Verdict: ${result.verdict}**`,
    '',
    '| # | Pillar | Status | Details |',
    '|---|--------|--------|---------|',
  ];

  result.pillars.forEach((p, i) => {
    const icon = p.status === 'PASS' ? 'PASS' : 'BLOCKED';
    lines.push(`| ${i + 1} | ${p.name} | ${icon} | ${p.details} |`);
  });

  return lines.join('\n');
}

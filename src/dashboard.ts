import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

interface PhaseInfo {
  name: string;
  label: string;
  status: 'complete' | 'in-progress' | 'not-started';
  value?: string;
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      result[key] = val;
    }
  }
  return result;
}

function readSpecFile(targetDir: string, filename: string): Record<string, string> | null {
  const path = join(targetDir, 'specs', filename);
  if (!existsSync(path)) return null;
  try {
    return parseFrontmatter(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

function getPhases(targetDir: string): PhaseInfo[] {
  const entityCatalog = readSpecFile(targetDir, 'entity-catalog.md');
  const uiStructure = readSpecFile(targetDir, 'ui-structure.md');

  const entityVersion = entityCatalog?.version ?? '0.0';
  const entityCount = entityCatalog?.entity_count ?? '0';
  const uiVersion = uiStructure?.version ?? '0.0';
  const uiScreenCount = uiStructure?.screen_count ?? '0';

  const entityDone = entityVersion !== '0.0' && entityVersion !== '';
  const modelDone = parseFloat(entityVersion) >= 1.0;
  const uiDone = uiStructure !== null && parseFloat(uiVersion) > 0;

  const phases: PhaseInfo[] = [
    {
      name: 'Phase 0/1',
      label: 'Entities',
      status: entityDone ? 'complete' : 'not-started',
      value: entityDone ? entityCount : undefined,
    },
    {
      name: 'Phase 2',
      label: 'Info Model',
      status: modelDone ? 'complete' : entityDone ? 'in-progress' : 'not-started',
      value: modelDone ? `v${entityVersion}` : undefined,
    },
    {
      name: 'Phase 2.5',
      label: 'UI Design',
      status: uiDone ? 'complete' : modelDone ? 'in-progress' : 'not-started',
      value: uiDone ? uiScreenCount : undefined,
    },
    {
      name: 'Phase 3-5',
      label: 'Build',
      status: uiDone ? 'in-progress' : 'not-started',
    },
  ];

  // Only one phase may show in-progress
  let foundInProgress = false;
  for (const p of phases) {
    if (p.status === 'in-progress') {
      if (foundInProgress) p.status = 'not-started';
      else foundInProgress = true;
    }
  }

  return phases;
}

function centerInBox(text: string, width: number): string {
  const pad = Math.max(0, width - text.length);
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}

function statusSymbol(phase: PhaseInfo): string {
  switch (phase.status) {
    case 'complete':
      return phase.value ? `\u2713  ${phase.value}` : '\u2713';
    case 'in-progress':
      return '\u25C6';
    default:
      return '\u25CB';
  }
}

function renderHeader(): string {
  const W = 64;
  const lines = [
    '\u2554' + '\u2550'.repeat(W) + '\u2557',
    '\u2551' + centerInBox('IDDD \u2014 Information Design-Driven Development', W) + '\u2551',
    '\u2551' + centerInBox('Your information model is your harness.', W) + '\u2551',
    '\u255A' + '\u2550'.repeat(W) + '\u255D',
  ];
  return lines.join('\n');
}

function renderPipeline(phases: PhaseInfo[]): string {
  const INNER = 14;
  const INDENT = '  ';
  const GUTTER_ARROW = '\u2500\u2500\u2500>';
  const GUTTER_BLANK = '    ';

  const boxes: string[][] = [];
  for (const p of phases) {
    boxes.push([
      '\u250C' + '\u2500'.repeat(INNER) + '\u2510',
      '\u2502' + centerInBox(p.name, INNER) + '\u2502',
      '\u2502' + centerInBox(p.label, INNER) + '\u2502',
      '\u2502' + centerInBox(statusSymbol(p), INNER) + '\u2502',
      '\u2514' + '\u2500'.repeat(INNER) + '\u2518',
    ]);
  }

  const lines: string[] = [];
  for (let r = 0; r < 5; r++) {
    const gutter = r === 1 ? GUTTER_ARROW : GUTTER_BLANK;
    lines.push(INDENT + boxes.map((b) => b[r]).join(gutter));
  }

  return lines.join('\n');
}

function renderProgressBar(phases: PhaseInfo[]): string {
  const completed = phases.filter((p) => p.status === 'complete').length;
  const pct = Math.round((completed / phases.length) * 100);
  const BAR_WIDTH = 66;
  const filled = Math.round(BAR_WIDTH * pct / 100);
  const empty = BAR_WIDTH - filled;

  const rule = '  ' + '\u2500'.repeat(70);
  const bar = '  ' + '\u2588'.repeat(filled) + '\u2591'.repeat(empty) + `  ${pct}%`;

  return [rule, bar, rule].join('\n');
}

function getStatusMessage(phases: PhaseInfo[]): string {
  const completed = phases.filter((p) => p.status === 'complete').length;

  const messages = [
    'Ready to begin entity identification',
    'Entity identification complete. Ready for information design',
    'Information model complete. Ready for UI design',
    'UI design complete. Ready for implementation',
    'All phases complete. Use /id3-info-audit for model verification',
  ];

  return messages[Math.min(completed, messages.length - 1)];
}

function getNextCommand(phases: PhaseInfo[]): string {
  const current = phases.find((p) => p.status === 'in-progress' || p.status === 'not-started');
  if (!current) return '/id3-info-audit';

  const commands: Record<string, string> = {
    'Phase 0/1': '/id3-identify-entities',
    'Phase 2': '/id3-design-information',
    'Phase 2.5': '/id3-design-ui',
    'Phase 3-5': '/id3-spawn-team',
  };

  return commands[current.name] ?? '/id3-start';
}

export function renderDashboard(targetDir: string, request?: string): string {
  const dir = resolve(targetDir);
  const phases = getPhases(dir);

  const parts = [
    renderHeader(),
    '',
    renderPipeline(phases),
    '',
    renderProgressBar(phases),
    '',
    `  > Current status: ${getStatusMessage(phases)}`,
  ];

  if (request && request.trim()) {
    parts.push(`  > Request: "${request}"`);
  } else {
    parts.push(`  > Suggested next action: Run \`${getNextCommand(phases)}\` to begin.`);
  }

  return parts.join('\n');
}

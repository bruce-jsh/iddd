import {
  getCachedDiff,
  getCachedFileContent,
  isSchemaFile,
  isSkipHooks,
  logSkip,
  loadHookConfig,
  printBlock,
  printWarn,
  type HookInput,
} from './shared.js';

export interface SchemaChange {
  type: 'add' | 'modify' | 'drop';
  table: string;
  column?: string;
  trivial: boolean;
  description: string;
}

export function analyzeSchemaChanges(
  diffContent: string,
  filePath: string
): SchemaChange[] {
  const changes: SchemaChange[] = [];
  const addedLines = diffContent
    .split('\n')
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
    .map((l) => l.slice(1).trim());

  for (const line of addedLines) {
    // SQL: CREATE TABLE
    const createMatch = line.match(/CREATE\s+TABLE\s+(\w+)/i);
    if (createMatch) {
      changes.push({
        type: 'add',
        table: createMatch[1],
        trivial: false,
        description: `Table ${createMatch[1]} created`,
      });
      continue;
    }

    // SQL: ALTER TABLE ... ADD COLUMN
    const alterAddMatch = line.match(
      /ALTER\s+TABLE\s+(\w+)\s+ADD\s+(?:COLUMN\s+)?(\w+)/i
    );
    if (alterAddMatch) {
      changes.push({
        type: 'add',
        table: alterAddMatch[1],
        column: alterAddMatch[2],
        trivial: false,
        description: `Column ${alterAddMatch[1]}.${alterAddMatch[2]} added`,
      });
      continue;
    }

    // SQL: DROP TABLE
    const dropMatch = line.match(/DROP\s+TABLE\s+(\w+)/i);
    if (dropMatch) {
      changes.push({
        type: 'drop',
        table: dropMatch[1],
        trivial: false,
        description: `Table ${dropMatch[1]} dropped`,
      });
      continue;
    }

    // SQL: CREATE INDEX (trivial)
    const indexMatch = line.match(/CREATE\s+(?:UNIQUE\s+)?INDEX\s+/i);
    if (indexMatch) {
      const tableMatch = line.match(/ON\s+(\w+)/i);
      changes.push({
        type: 'modify',
        table: tableMatch?.[1] ?? 'unknown',
        trivial: true,
        description: `Index added`,
      });
      continue;
    }

    // Prisma: model definition
    const prismaModel = line.match(/^model\s+(\w+)\s*\{/);
    if (prismaModel) {
      changes.push({
        type: 'add',
        table: prismaModel[1],
        trivial: false,
        description: `Model ${prismaModel[1]} added`,
      });
      continue;
    }

    // Django: class Model(models.Model)
    const djangoModel = line.match(/^class\s+(\w+)\(.*Model.*\)/);
    if (djangoModel) {
      changes.push({
        type: 'add',
        table: djangoModel[1],
        trivial: false,
        description: `Model ${djangoModel[1]} added`,
      });
      continue;
    }
  }

  return changes;
}

/**
 * Git Hook mode: extract file list from git diff --cached
 */
export async function runSchemaDrift(projectRoot: string): Promise<boolean> {
  if (isSkipHooks()) {
    await logSkip(projectRoot);
    return true; // allow
  }

  const config = await loadHookConfig(projectRoot);
  if (!config?.hooks['pre-commit']['schema-drift']?.enabled) {
    return true;
  }

  const { monitored_patterns } = config.hooks['pre-commit']['schema-drift'];
  const diff = getCachedDiff();

  const schemaFiles = diff.filter((e) =>
    isSchemaFile(e.path, monitored_patterns)
  );
  if (schemaFiles.length === 0) return true;

  // Check if entity-catalog.md is also being committed
  const catalogModified = diff.some(
    (e) => e.path === 'specs/entity-catalog.md'
  );

  // Analyze changes
  const allChanges: SchemaChange[] = [];
  for (const file of schemaFiles) {
    const content = getCachedFileContent(file.path);
    if (content) {
      allChanges.push(...analyzeSchemaChanges(content, file.path));
    }
  }

  if (allChanges.length === 0) return true;

  const hasStructural = allChanges.some((c) => !c.trivial);

  if (catalogModified) {
    return true; // entity-catalog.md updated together — OK
  }

  if (!hasStructural) {
    // Only trivial changes (indexes, etc.)
    printWarn(
      '⚠️ Schema Change Detected',
      allChanges.map((c) => c.description).join('\n') +
        '\n\nConsider updating specs/entity-catalog.md'
    );
    return true;
  }

  // Structural change without entity-catalog.md update — BLOCK
  const changeList = allChanges
    .filter((c) => !c.trivial)
    .map((c) => `  ${c.description}`)
    .join('\n');

  printBlock(
    '❌ Schema Drift Detected',
    `entity-catalog.md must be updated first.\n\n${changeList}\n\nRun /id3-info-audit or manually update\nspecs/entity-catalog.md`
  );

  return false; // block commit
}

/**
 * Claude Code Hook mode: receive { tool_name, tool_input: { file_path } } JSON from stdin
 */
export async function runSchemaDriftFromHookInput(
  projectRoot: string,
  hookInput: HookInput
): Promise<boolean> {
  if (isSkipHooks()) {
    await logSkip(projectRoot);
    return true;
  }

  const config = await loadHookConfig(projectRoot);
  if (!config?.hooks['pre-commit']['schema-drift']?.enabled) {
    return true;
  }

  const { monitored_patterns } = config.hooks['pre-commit']['schema-drift'];

  // Extract relative path from absolute file_path
  const relativePath = hookInput.filePath.startsWith(projectRoot)
    ? hookInput.filePath.slice(projectRoot.length + 1)
    : hookInput.filePath;

  if (!isSchemaFile(relativePath, monitored_patterns)) {
    return true; // not a schema file — allow
  }

  // Schema file is being written/edited — check if entity-catalog.md exists and is recent
  printWarn(
    '⚠️ Schema File Modified',
    `File: ${relativePath}\n\nEnsure specs/entity-catalog.md is updated\nto reflect this schema change.`
  );

  return true; // warn only in Claude Code Hook mode (non-blocking)
}

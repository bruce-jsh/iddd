import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { box } from '../utils/ascii.js';

export interface DiffEntry {
  status: string;
  path: string;
}

export function parseGitDiff(output: string): DiffEntry[] {
  if (!output.trim()) return [];
  return output
    .trim()
    .split('\n')
    .map((line) => {
      const [status, path] = line.split('\t');
      return { status, path };
    })
    .filter((e) => e.path);
}

export interface HookInput {
  toolName: string;
  filePath: string;
}

export function parseHookInput(stdinData: string): HookInput | null {
  try {
    const parsed = JSON.parse(stdinData);
    if (!parsed.tool_name || !parsed.tool_input?.file_path) {
      return null;
    }
    return {
      toolName: parsed.tool_name,
      filePath: parsed.tool_input.file_path,
    };
  } catch {
    return null;
  }
}

export function getCachedDiff(): DiffEntry[] {
  try {
    const output = execSync('git diff --cached --name-status', {
      encoding: 'utf-8',
    });
    return parseGitDiff(output);
  } catch {
    return [];
  }
}

export function getCachedFileContent(filePath: string): string | null {
  try {
    return execSync(`git show :${filePath}`, { encoding: 'utf-8' });
  } catch {
    return null;
  }
}

export function isSchemaFile(filePath: string, patterns: string[]): boolean {
  return patterns.some((pattern) => matchGlob(filePath, pattern));
}

export function isValidationFile(
  filePath: string,
  patterns: string[]
): boolean {
  return patterns.some((pattern) => matchGlob(filePath, pattern));
}

export function matchGlob(filePath: string, pattern: string): boolean {
  const regex = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '{{GLOBSTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/\{\{GLOBSTAR\}\}/g, '.*');
  return (
    new RegExp(`^${regex}$`).test(filePath) ||
    new RegExp(`(^|/)${regex}$`).test(filePath)
  );
}

export interface HookConfig {
  enabled: boolean;
  hooks: {
    'pre-commit': {
      'schema-drift': {
        enabled: boolean;
        severity: 'block' | 'warn';
        monitored_patterns: string[];
      };
      'rule-check': {
        enabled: boolean;
        severity: 'block' | 'warn';
        validation_patterns: string[];
      };
    };
    'post-commit': {
      'auto-audit': {
        enabled: boolean;
        interval_commits: number;
      };
    };
  };
}

export async function loadHookConfig(
  projectRoot: string
): Promise<HookConfig | null> {
  try {
    const configPath = join(
      projectRoot,
      '.claude',
      'hooks',
      'hook-config.json'
    );
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content) as HookConfig;
  } catch {
    return null;
  }
}

export function isSkipHooks(): boolean {
  return process.env['IDDD_SKIP_HOOKS'] === '1';
}

export async function logSkip(projectRoot: string): Promise<void> {
  const { appendFile, mkdir } = await import('node:fs/promises');
  const logDir = join(projectRoot, '.iddd');
  await mkdir(logDir, { recursive: true });
  const logPath = join(logDir, 'skip-history.log');
  const timestamp = new Date().toISOString();
  let commitHash = 'unknown';
  try {
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch {}
  await appendFile(logPath, `${timestamp}\t${commitHash}\tHook skipped\n`);
}

export function printBlock(title: string, message: string): void {
  console.error(box(message, { title }));
}

export function printWarn(title: string, message: string): void {
  console.error(box(message, { title }));
}

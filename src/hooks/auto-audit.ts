import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { isSkipHooks, logSkip, loadHookConfig, printWarn } from './shared.js';

export async function incrementCounter(projectRoot: string): Promise<number> {
  const counterPath = join(projectRoot, '.iddd', 'commit-count');
  let count = 0;
  try {
    const content = await readFile(counterPath, 'utf-8');
    count = parseInt(content.trim(), 10) || 0;
  } catch {}
  count++;
  await mkdir(join(projectRoot, '.iddd'), { recursive: true });
  await writeFile(counterPath, count.toString());
  return count;
}

export async function shouldRunAudit(
  projectRoot: string,
  threshold: number
): Promise<boolean> {
  const counterPath = join(projectRoot, '.iddd', 'commit-count');
  try {
    const content = await readFile(counterPath, 'utf-8');
    return parseInt(content.trim(), 10) >= threshold;
  } catch {
    return false;
  }
}

export async function resetCounter(projectRoot: string): Promise<void> {
  const counterPath = join(projectRoot, '.iddd', 'commit-count');
  await writeFile(counterPath, '0');
}

export async function runAutoAudit(projectRoot: string): Promise<void> {
  if (isSkipHooks()) {
    await logSkip(projectRoot);
    return;
  }

  const config = await loadHookConfig(projectRoot);
  if (!config?.hooks['post-commit']['auto-audit']?.enabled) {
    return;
  }

  const threshold = config.hooks['post-commit']['auto-audit'].interval_commits;
  const count = await incrementCounter(projectRoot);

  if (count >= threshold) {
    printWarn(
      'ℹ️ Auto-Audit Triggered',
      `${count} commits since last audit.\nRun /id3-info-audit for a full check.\n\nReport saved to .iddd/last-audit-report.md`
    );
    await resetCounter(projectRoot);
  }
}

import { join, resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { copyDir, createSymlink, fileExists } from './utils/fs.js';
import { banner, box } from './utils/ascii.js';
import { execSync } from 'node:child_process';

export interface InitOptions {
  templatesDir?: string;
  overwrite?: boolean;
  skipGitHooks?: boolean;
  noSymlink?: boolean;
}

export interface InitResult {
  alreadyInstalled: boolean;
  targetDir: string;
  gitHooksInstalled: boolean;
  claudeHooksInjected: boolean;
  platforms: { claude: boolean; codex: boolean };
}

export async function initProject(
  targetDir: string,
  options: InitOptions = {}
): Promise<InitResult> {
  const {
    templatesDir: tplDir,
    overwrite = false,
    skipGitHooks = false,
    noSymlink = false,
  } = options;

  const absTarget = resolve(targetDir);
  // When compiled, runs from dist/src/, so go up 2 levels to project root
  const templatesDir = tplDir ?? join(import.meta.dirname, '..', '..', 'templates');

  // Check existing installation
  const claudeMdExists = await fileExists(join(absTarget, 'CLAUDE.md'));
  if (claudeMdExists && !overwrite) {
    return {
      alreadyInstalled: true,
      targetDir: absTarget,
      gitHooksInstalled: false,
      claudeHooksInjected: false,
      platforms: { claude: false, codex: false },
    };
  }

  // Copy templates
  await copyDir(templatesDir, absTarget, { overwrite });

  // Create skill symlinks
  if (!noSymlink) {
    await createSkillSymlinks(absTarget);
  } else {
    // Windows fallback: copy instead of symlink
    await copySkillFiles(absTarget);
  }

  // Detect platforms
  const platforms = detectPlatforms();

  // Inject Claude Code Hooks into settings.local.json
  let claudeHooksInjected = false;
  if (platforms.claude) {
    await injectClaudeHooks(absTarget);
    claudeHooksInjected = true;
  }

  // Set up Codex hooks.json if Codex detected
  if (platforms.codex) {
    // hooks.json is already in templates/.codex/hooks.json
    // Symlinks to .agents/skills/ are handled by createSkillSymlinks
  }

  // Install Git hooks
  let gitHooksInstalled = false;
  if (!skipGitHooks) {
    gitHooksInstalled = await installGitHooks(absTarget);
  }

  return {
    alreadyInstalled: false,
    targetDir: absTarget,
    gitHooksInstalled,
    claudeHooksInjected,
    platforms,
  };
}

async function createSkillSymlinks(targetDir: string): Promise<void> {
  const skills = [
    'id3-identify-entities',
    'id3-design-information',
    'id3-design-ui',
    'id3-spawn-team',
    'id3-info-audit',
    'id3-preview',
  ];
  const platforms = ['.claude', '.agents'];

  for (const skill of skills) {
    const original = join(targetDir, 'skills', skill, 'SKILL.md');
    for (const platform of platforms) {
      const link = join(targetDir, platform, 'skills', skill, 'SKILL.md');
      await createSymlink(original, link);
    }
  }
}

async function copySkillFiles(targetDir: string): Promise<void> {
  // Windows fallback: copy files instead of creating symlinks
  const { copyFile, mkdir } = await import('node:fs/promises');
  const skills = [
    'id3-identify-entities',
    'id3-design-information',
    'id3-design-ui',
    'id3-spawn-team',
    'id3-info-audit',
    'id3-preview',
  ];
  const platformDirs = ['.claude', '.agents'];

  for (const skill of skills) {
    const original = join(targetDir, 'skills', skill, 'SKILL.md');
    for (const platform of platformDirs) {
      const dest = join(targetDir, platform, 'skills', skill, 'SKILL.md');
      await mkdir(join(targetDir, platform, 'skills', skill), { recursive: true });
      if (await fileExists(original)) {
        await copyFile(original, dest);
      }
    }
  }
}

export async function injectClaudeHooks(targetDir: string): Promise<void> {
  const settingsPath = join(targetDir, '.claude', 'settings.local.json');

  let settings: Record<string, unknown> = {};

  try {
    const existing = await readFile(settingsPath, 'utf-8');
    settings = JSON.parse(existing);
  } catch {
    // No existing settings — start fresh
  }

  // Inject Hook configuration
  const hooks = (settings['hooks'] as Record<string, unknown[]>) ?? {};

  hooks['PreToolUse'] = [
    ...(hooks['PreToolUse'] ?? []),
    {
      matcher: 'Write|Edit',
      command: `node "${join(targetDir, 'hooks', 'iddd-schema-drift.js')}"`,
    },
  ];

  hooks['Stop'] = [
    ...(hooks['Stop'] ?? []),
    {
      command: `node "${join(targetDir, 'hooks', 'iddd-auto-audit.js')}"`,
    },
  ];

  settings['hooks'] = hooks;

  const { mkdir } = await import('node:fs/promises');
  await mkdir(join(targetDir, '.claude'), { recursive: true });
  await writeFile(settingsPath, JSON.stringify(settings, null, 2));
}

function detectPlatforms(): { claude: boolean; codex: boolean } {
  const claude = commandExists('claude');
  const codex = commandExists('codex');
  return { claude, codex };
}

function commandExists(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function installGitHooks(targetDir: string): Promise<boolean> {
  const gitDir = join(targetDir, '.git');
  if (!(await fileExists(gitDir))) {
    return false;
  }

  const hooksDir = join(gitDir, 'hooks');
  const hooks = ['pre-commit', 'post-commit'];

  for (const hook of hooks) {
    const target = join(targetDir, 'hooks', hook);
    const link = join(hooksDir, hook);

    if (await fileExists(link)) {
      continue; // don't overwrite existing hooks
    }

    await createSymlink(target, link);
  }

  return true;
}

export function printBanner(): void {
  const version = getVersion();
  console.log(banner(version));
}

function getVersion(): string {
  try {
    const pkgPath = new URL('../../package.json', import.meta.url);
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export function printSuccess(result: InitResult): void {
  const platformLine = [
    result.platforms.claude ? 'Claude Code \u2713' : 'Claude Code \u2717',
    result.platforms.codex ? 'Codex \u2713' : 'Codex \u2717',
  ].join('  ');

  const hookLine = [
    result.gitHooksInstalled ? 'Git Hooks \u2713' : 'Git Hooks \u2717',
    result.claudeHooksInjected ? 'Claude Code Hooks \u2713' : 'Claude Code Hooks \u2717',
  ].join('  ');

  const content = [
    'Next steps:',
    '',
    '1. Fill in steering/product.md',
    '2. Use "identify entities" to start',
    '3. Customize steering/data-conventions.md',
    '',
    'Skills:',
    '\u251c\u2500\u2500 id3-identify-entities  (Phase 0/1)',
    '\u251c\u2500\u2500 id3-design-information (Phase 2)',
    '\u251c\u2500\u2500 id3-design-ui          (Phase 2.5)',
    '\u251c\u2500\u2500 id3-spawn-team         (Phase 3-5)',
    '\u251c\u2500\u2500 id3-info-audit         (Audit)',
    '\u2514\u2500\u2500 id3-preview            (Visual Preview)',
    '',
    `Platforms: ${platformLine}`,
    `Hooks: ${hookLine}`,
  ].join('\n');

  console.log(box(content, { title: '\u2713 IDDD installed' }));
}

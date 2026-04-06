import { join } from 'node:path';
import { homedir } from 'node:os';
import { rm } from 'node:fs/promises';
import { copyDir, fileExists } from './utils/fs.js';
import { execSync } from 'node:child_process';

export const GLOBAL_SKILLS = ['id3-start', 'id3-clear'] as const;

export interface Platform {
  name: string;
  skillsDir: string;
}

export function detectPlatforms(): Platform[] {
  const home = homedir();
  const platforms: Platform[] = [];

  if (commandExists('claude')) {
    platforms.push({ name: 'Claude Code', skillsDir: join(home, '.claude', 'skills') });
  }
  if (commandExists('codex')) {
    platforms.push({ name: 'Codex', skillsDir: join(home, '.codex', 'skills') });
  }

  // Fallback: if no platform detected, default to Claude Code
  if (platforms.length === 0) {
    platforms.push({ name: 'Claude Code', skillsDir: join(home, '.claude', 'skills') });
  }

  return platforms;
}

function commandExists(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function getSkillsSourceDir(): string {
  // When compiled, runs from dist/src/, so go up 2 levels to project root
  return join(import.meta.dirname, '..', '..', 'skills-global');
}

export interface RegisterOptions {
  sourceDir?: string;
  platforms?: Platform[];
}

export interface UnregisterOptions {
  platforms?: Platform[];
}

export async function registerSkills(
  options?: RegisterOptions
): Promise<{ platforms: Platform[]; skills: string[] }> {
  const sourceDir = options?.sourceDir ?? getSkillsSourceDir();
  const platforms = options?.platforms ?? detectPlatforms();

  for (const platform of platforms) {
    for (const skill of GLOBAL_SKILLS) {
      const src = join(sourceDir, skill);
      const dest = join(platform.skillsDir, skill);
      await copyDir(src, dest, { overwrite: true });
    }
  }

  return { platforms, skills: [...GLOBAL_SKILLS] };
}

export async function unregisterSkills(
  options?: UnregisterOptions
): Promise<{ platforms: Platform[] }> {
  const platforms = options?.platforms ?? detectPlatforms();

  for (const platform of platforms) {
    for (const skill of GLOBAL_SKILLS) {
      const dest = join(platform.skillsDir, skill);
      if (await fileExists(dest)) {
        await rm(dest, { recursive: true });
      }
    }
  }

  return { platforms };
}

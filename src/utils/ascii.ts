import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

export interface BoxOptions {
  title?: string;
  width?: number;
  padding?: number;
}

export function box(content: string, options: BoxOptions = {}): string {
  const { title, width = 47, padding = 1 } = options;
  const lines = content.split('\n');
  const innerWidth = width - 2; // borders

  const padStr = ' '.repeat(padding);

  const result: string[] = [];

  // top border
  if (title) {
    const titleStr = ` ${title} `;
    const remaining = innerWidth - titleStr.length - 1;
    result.push(`  ┌─${titleStr}${'─'.repeat(Math.max(0, remaining))}┐`);
  } else {
    result.push(`  ┌${'─'.repeat(innerWidth)}┐`);
  }

  // padding line
  result.push(`  │${' '.repeat(innerWidth)}│`);

  // content lines
  for (const line of lines) {
    const padded = `${padStr}${line}`;
    const spaces = innerWidth - padded.length;
    result.push(`  │${padded}${' '.repeat(Math.max(0, spaces))}│`);
  }

  // padding line
  result.push(`  │${' '.repeat(innerWidth)}│`);

  // bottom border
  result.push(`  └${'─'.repeat(innerWidth)}┘`);

  return result.join('\n');
}

function findPackageRoot(startDir: string): string | null {
  let dir = startDir;
  while (true) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function banner(version: string): string {
  const vStr = `v${version}`;
  const placeholder = '{{version}}';

  const root = findPackageRoot(import.meta.dirname);
  if (!root) {
    return `IDDD v${version} — Information Design-Driven Development`;
  }

  try {
    const bannerPath = join(root, 'assets', 'banner.txt');
    let template = readFileSync(bannerPath, 'utf-8');

    // Replace {{version}} and adjust padding so line width stays consistent
    const lines = template.split('\n');
    const result = lines.map((line) => {
      if (!line.includes(placeholder)) return line;

      const replaced = line.replace(placeholder, vStr);
      const diff = placeholder.length - vStr.length;

      if (diff > 0) {
        // Version string is shorter — add spaces before trailing ║
        const trailingIdx = replaced.lastIndexOf('║');
        return replaced.slice(0, trailingIdx) + ' '.repeat(diff) + replaced.slice(trailingIdx);
      } else if (diff < 0) {
        // Version string is longer — remove spaces before trailing ║
        const trailingIdx = replaced.lastIndexOf('║');
        const before = replaced.slice(0, trailingIdx);
        const trimmed = before.replace(new RegExp(` {${Math.abs(diff)}}$`), '');
        return trimmed + replaced.slice(trailingIdx);
      }

      return replaced;
    });

    return result.join('\n');
  } catch {
    return `IDDD v${version} — Information Design-Driven Development`;
  }
}

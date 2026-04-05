import { copyFile, mkdir, readdir, stat, symlink, access } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export interface CopyOptions {
  overwrite?: boolean;
}

export async function copyDir(
  src: string,
  dest: string,
  options: CopyOptions = {}
): Promise<void> {
  const { overwrite = false } = options;
  await mkdir(dest, { recursive: true });

  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, options);
    } else {
      if (!overwrite && (await fileExists(destPath))) {
        continue;
      }
      await mkdir(dirname(destPath), { recursive: true });
      await copyFile(srcPath, destPath);
    }
  }
}

export async function createSymlink(
  target: string,
  linkPath: string
): Promise<void> {
  if (await fileExists(linkPath)) {
    return;
  }
  await mkdir(dirname(linkPath), { recursive: true });
  const rel = relative(dirname(linkPath), target);
  await symlink(rel, linkPath);
}

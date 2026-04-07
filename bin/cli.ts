#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'install-skills': {
    const { registerSkills } = await import('../src/register-skills.js');
    const result = await registerSkills();
    console.log('id3-cli: Skills registered successfully!\n');
    for (const p of result.platforms) {
      console.log(`  ${p.name}: ${p.skillsDir}`);
      for (const s of result.skills) {
        console.log(`    /${s}`);
      }
    }
    console.log('\nSlash commands /id3-start and /id3-clear are now available.');
    break;
  }

  case 'uninstall-skills': {
    const { unregisterSkills } = await import('../src/register-skills.js');
    const result = await unregisterSkills();
    console.log('id3-cli: Skills unregistered.\n');
    for (const p of result.platforms) {
      console.log(`  Cleaned: ${p.skillsDir}`);
    }
    break;
  }

  case 'dashboard': {
    const { renderDashboard } = await import('../src/dashboard.js');
    const request = args.slice(1).join(' ');
    console.log(renderDashboard('.', request || undefined));
    break;
  }

  case '--help':
  case '-h': {
    printHelp();
    break;
  }

  case '--version':
  case '-v': {
    console.log(getVersion());
    break;
  }

  case 'init':
  default: {
    const { initProject, printBanner, printSuccess } = await import('../src/init.js');
    const { createInterface } = await import('node:readline');

    const flags = args.filter((a) => a.startsWith('--'));
    const positional = args.filter((a) => !a.startsWith('--'));

    const hasInit = positional[0] === 'init';
    const targetDir = hasInit ? (positional[1] ?? '.') : (positional[0] ?? '.');
    const noSymlink = flags.includes('--no-symlink');

    printBanner();

    const result = await initProject(targetDir, { noSymlink });

    if (result.alreadyInstalled) {
      const answer = await prompt(
        'IDDD appears to be already installed. Overwrite? (y/N) ',
        createInterface
      );
      if (answer.toLowerCase() !== 'y') {
        console.log('Aborted.');
        process.exit(0);
      }
      const retryResult = await initProject(targetDir, {
        overwrite: true,
        noSymlink,
      });
      printSuccess(retryResult);
    } else {
      printSuccess(result);
    }
    break;
  }
}

function printHelp(): void {
  console.log(`Usage: id3-cli [command] [options]

Commands:
  init [dir]           Initialize IDDD in a project (default command)
  dashboard [request]  Show project progress dashboard
  install-skills       Register /id3-start and /id3-clear in your AI coding agent
  uninstall-skills     Remove registered skills (run before npm uninstall -g id3-cli)

Options:
  --no-symlink         Copy skill files instead of creating symlinks
  -v, --version        Show version number
  -h, --help           Show this help message

Quick Start:
  npm i -g id3-cli            Install globally
  id3-cli install-skills      Register slash commands
  /id3-start [your request]   Start using IDDD in any project`);
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

function prompt(
  question: string,
  createInterface: typeof import('node:readline').createInterface
): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

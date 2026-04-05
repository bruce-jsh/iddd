#!/usr/bin/env node

import { initProject, printBanner, printSuccess } from '../src/init.js';
import { createInterface } from 'node:readline';

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const positional = args.filter((a) => !a.startsWith('--'));

// npx id3-cli@latest [target-dir]  — no subcommand needed
// npx id3-cli@latest init [target-dir]  — also works
const hasInit = positional[0] === 'init';
const targetDir = hasInit ? (positional[1] ?? '.') : (positional[0] ?? '.');
const noSymlink = flags.includes('--no-symlink');

{

  printBanner();

  const result = await initProject(targetDir, { noSymlink });

  if (result.alreadyInstalled) {
    const answer = await prompt(
      'IDDD appears to be already installed. Overwrite? (y/N) '
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
}

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

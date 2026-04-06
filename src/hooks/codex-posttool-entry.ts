import { resolve } from 'node:path';
import { runRuleCheck } from './rule-check.js';

const projectRoot = resolve('.');

async function main() {
  await runRuleCheck(projectRoot);
}

main().catch((err) => {
  console.error('IDDD codex-posttool hook error:', err);
  process.exit(0); // don't block on errors
});

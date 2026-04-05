import { resolve } from 'node:path';
import { runSchemaDrift } from './schema-drift.js';
import { runRuleCheck } from './rule-check.js';

const projectRoot = resolve('.');

async function main() {
  const schemaDriftOk = await runSchemaDrift(projectRoot);
  if (!schemaDriftOk) {
    process.exit(1);
  }

  await runRuleCheck(projectRoot);
}

main().catch((err) => {
  console.error('IDDD pre-commit hook error:', err);
  process.exit(1);
});

import { resolve } from 'node:path';
import { parseHookInput } from './shared.js';
import { runSchemaDriftFromHookInput } from './schema-drift.js';
import { runRuleCheck } from './rule-check.js';

const projectRoot = resolve('.');

async function main() {
  // Read stdin JSON from Claude Code Hook API
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const stdinData = Buffer.concat(chunks).toString('utf-8');

  const hookInput = parseHookInput(stdinData);
  if (!hookInput) {
    // Not a valid hook input — pass through
    process.exit(0);
  }

  // schema-drift check
  const schemaDriftOk = await runSchemaDriftFromHookInput(
    projectRoot,
    hookInput
  );
  if (!schemaDriftOk) {
    // Output error JSON for Claude Code Hook API
    const result = {
      decision: 'block',
      reason: 'Schema drift detected. Update specs/entity-catalog.md first.',
    };
    process.stdout.write(JSON.stringify(result));
    process.exit(0);
  }

  // rule-check (warning only, does not block)
  await runRuleCheck(projectRoot);
}

main().catch((err) => {
  console.error('IDDD claude-pretool hook error:', err);
  process.exit(0); // don't block on errors
});

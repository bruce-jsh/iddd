/**
 * Runs automatically after `npm i -g id3-cli`.
 * Registers /id3-start and /id3-clear as global AI agent skills.
 */
import { registerSkills } from '../src/register-skills.js';

try {
  const result = await registerSkills();
  for (const p of result.platforms) {
    console.log(`id3-cli: Skills registered in ${p.name} (${p.skillsDir})`);
  }
} catch {
  // Non-fatal: skill registration failure shouldn't block install
  console.log('id3-cli: Could not auto-register skills. Run `id3-cli install-skills` manually.');
}

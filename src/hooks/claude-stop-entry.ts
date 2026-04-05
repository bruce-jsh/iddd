import { resolve } from 'node:path';
import { runAutoAudit } from './auto-audit.js';

const projectRoot = resolve('.');

runAutoAudit(projectRoot).catch((err) => {
  console.error('IDDD claude-stop hook error:', err);
});

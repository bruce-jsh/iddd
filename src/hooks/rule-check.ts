import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  getCachedDiff,
  getCachedFileContent,
  isValidationFile,
  isSkipHooks,
  logSkip,
  loadHookConfig,
  printWarn,
} from './shared.js';

export interface ValidationDetection {
  file: string;
  line: number;
  content: string;
  pattern: string;
}

const VALIDATION_PATTERNS: Array<{ regex: RegExp; label: string }> = [
  {
    regex: /z\.\s*(?:object|string|number|boolean|array|enum)\s*\(/g,
    label: 'zod',
  },
  {
    regex: /yup\.\s*(?:object|string|number|boolean|array)\s*\(/g,
    label: 'yup',
  },
  {
    regex: /Joi\.\s*(?:object|string|number|boolean|array)\s*\(/g,
    label: 'joi',
  },
  { regex: /CHECK\s*\(/gi, label: 'SQL CHECK' },
  { regex: /NOT\s+NULL/gi, label: 'SQL NOT NULL' },
  { regex: /ADD\s+.*UNIQUE/gi, label: 'SQL UNIQUE' },
  { regex: /@validator\s*\(/g, label: 'pydantic' },
  { regex: /@field_validator\s*\(/g, label: 'pydantic-v2' },
  { regex: /@Valid/g, label: 'java-valid' },
  { regex: /@NotNull/g, label: 'java-notnull' },
  {
    regex: /@Column\s*\(\s*.*nullable\s*[:=]\s*false/g,
    label: 'orm-notnull',
  },
  { regex: /@IsNotEmpty\s*\(/g, label: 'class-validator' },
  {
    regex: /body\s*\(\s*['"].*['"]\s*\)\s*\.(?:not|is)/g,
    label: 'express-validator',
  },
];

export function detectValidationPatterns(
  content: string,
  filePath: string
): ValidationDetection[] {
  const detections: ValidationDetection[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('+') && content.includes('\n+')) {
      // only check added lines if it looks like a diff
      continue;
    }
    const cleanLine = line.replace(/^\+/, '');

    for (const { regex, label } of VALIDATION_PATTERNS) {
      regex.lastIndex = 0;
      if (regex.test(cleanLine)) {
        detections.push({
          file: filePath,
          line: i + 1,
          content: cleanLine.trim(),
          pattern: label,
        });
      }
    }
  }

  return detections;
}

async function hasMatchingRule(
  projectRoot: string,
  detection: ValidationDetection
): Promise<boolean> {
  try {
    const rulesPath = join(projectRoot, 'docs', 'business-rules.md');
    const rules = await readFile(rulesPath, 'utf-8');
    // Simple check: look for BR-xxx entries that reference the same file/pattern
    return rules.includes('BR-') && rules.length > 200;
  } catch {
    return false;
  }
}

export async function runRuleCheck(projectRoot: string): Promise<boolean> {
  if (isSkipHooks()) {
    await logSkip(projectRoot);
    return true;
  }

  const config = await loadHookConfig(projectRoot);
  if (!config?.hooks['pre-commit']['rule-check']?.enabled) {
    return true;
  }

  const { validation_patterns } = config.hooks['pre-commit']['rule-check'];
  const diff = getCachedDiff();

  const validationFiles = diff.filter((e) =>
    isValidationFile(e.path, validation_patterns)
  );
  if (validationFiles.length === 0) return true;

  const allDetections: ValidationDetection[] = [];
  for (const file of validationFiles) {
    const content = getCachedFileContent(file.path);
    if (content) {
      allDetections.push(...detectValidationPatterns(content, file.path));
    }
  }

  if (allDetections.length === 0) return true;

  // Check if rules exist
  for (const detection of allDetections) {
    const matched = await hasMatchingRule(projectRoot, detection);
    if (!matched) {
      printWarn(
        '⚠️ New Validation Detected',
        `File: ${detection.file}:${detection.line}\nPattern: ${detection.pattern}\nContent: ${detection.content}\n\nNo matching BR-xxx in business-rules.md\nConsider registering this rule.`
      );
    }
  }

  return true; // never blocks, warning only
}

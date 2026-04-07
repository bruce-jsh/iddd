#!/usr/bin/env node

// src/hooks/codex-posttool-entry.ts
import { resolve } from "node:path";

// src/hooks/rule-check.ts
import { readFile as readFile2 } from "node:fs/promises";
import { join as join2 } from "node:path";

// src/hooks/shared.ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";

// src/utils/ascii.ts
function box(content, options = {}) {
  const { title, width = 50, padding = 1 } = options;
  const lines = content.split("\n");
  const innerWidth = width - 2;
  const padStr = " ".repeat(padding);
  const result = [];
  if (title) {
    const titleStr = ` ${title} `;
    const remaining = innerWidth - titleStr.length - 1;
    result.push(`  \u250C\u2500${titleStr}${"\u2500".repeat(Math.max(0, remaining))}\u2510`);
  } else {
    result.push(`  \u250C${"\u2500".repeat(innerWidth)}\u2510`);
  }
  result.push(`  \u2502${" ".repeat(innerWidth)}\u2502`);
  for (const line of lines) {
    const padded = `${padStr}${line}`;
    const spaces = innerWidth - padded.length;
    result.push(`  \u2502${padded}${" ".repeat(Math.max(0, spaces))}\u2502`);
  }
  result.push(`  \u2502${" ".repeat(innerWidth)}\u2502`);
  result.push(`  \u2514${"\u2500".repeat(innerWidth)}\u2518`);
  return result.join("\n");
}

// src/hooks/shared.ts
function parseGitDiff(output) {
  if (!output.trim()) return [];
  return output.trim().split("\n").map((line) => {
    const [status, path] = line.split("	");
    return { status, path };
  }).filter((e) => e.path);
}
function getCachedDiff() {
  try {
    const output = execSync("git diff --cached --name-status", {
      encoding: "utf-8"
    });
    return parseGitDiff(output);
  } catch {
    return [];
  }
}
function getCachedFileContent(filePath) {
  try {
    return execSync(`git show :${filePath}`, { encoding: "utf-8" });
  } catch {
    return null;
  }
}
function isValidationFile(filePath, patterns) {
  return patterns.some((pattern) => matchGlob(filePath, pattern));
}
function matchGlob(filePath, pattern) {
  const regex = pattern.replace(/\./g, "\\.").replace(/\*\*/g, "{{GLOBSTAR}}").replace(/\*/g, "[^/]*").replace(/\{\{GLOBSTAR\}\}/g, ".*");
  return new RegExp(`^${regex}$`).test(filePath) || new RegExp(`(^|/)${regex}$`).test(filePath);
}
async function loadHookConfig(projectRoot2) {
  try {
    const configPath = join(
      projectRoot2,
      ".claude",
      "hooks",
      "hook-config.json"
    );
    const content = await readFile(configPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}
function isSkipHooks() {
  return process.env["IDDD_SKIP_HOOKS"] === "1";
}
async function logSkip(projectRoot2) {
  const { appendFile, mkdir } = await import("node:fs/promises");
  const logDir = join(projectRoot2, ".iddd");
  await mkdir(logDir, { recursive: true });
  const logPath = join(logDir, "skip-history.log");
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  let commitHash = "unknown";
  try {
    commitHash = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  } catch {
  }
  await appendFile(logPath, `${timestamp}	${commitHash}	Hook skipped
`);
}
function printWarn(title, message) {
  console.error(box(message, { title }));
}

// src/hooks/rule-check.ts
var VALIDATION_PATTERNS = [
  {
    regex: /z\.\s*(?:object|string|number|boolean|array|enum)\s*\(/g,
    label: "zod"
  },
  {
    regex: /yup\.\s*(?:object|string|number|boolean|array)\s*\(/g,
    label: "yup"
  },
  {
    regex: /Joi\.\s*(?:object|string|number|boolean|array)\s*\(/g,
    label: "joi"
  },
  { regex: /CHECK\s*\(/gi, label: "SQL CHECK" },
  { regex: /NOT\s+NULL/gi, label: "SQL NOT NULL" },
  { regex: /ADD\s+.*UNIQUE/gi, label: "SQL UNIQUE" },
  { regex: /@validator\s*\(/g, label: "pydantic" },
  { regex: /@field_validator\s*\(/g, label: "pydantic-v2" },
  { regex: /@Valid/g, label: "java-valid" },
  { regex: /@NotNull/g, label: "java-notnull" },
  {
    regex: /@Column\s*\(\s*.*nullable\s*[:=]\s*false/g,
    label: "orm-notnull"
  },
  { regex: /@IsNotEmpty\s*\(/g, label: "class-validator" },
  {
    regex: /body\s*\(\s*['"].*['"]\s*\)\s*\.(?:not|is)/g,
    label: "express-validator"
  }
];
function detectValidationPatterns(content, filePath) {
  const detections = [];
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("+") && content.includes("\n+")) {
      continue;
    }
    const cleanLine = line.replace(/^\+/, "");
    for (const { regex, label } of VALIDATION_PATTERNS) {
      regex.lastIndex = 0;
      if (regex.test(cleanLine)) {
        detections.push({
          file: filePath,
          line: i + 1,
          content: cleanLine.trim(),
          pattern: label
        });
      }
    }
  }
  return detections;
}
async function hasMatchingRule(projectRoot2, detection) {
  try {
    const rulesPath = join2(projectRoot2, "docs", "business-rules.md");
    const rules = await readFile2(rulesPath, "utf-8");
    return rules.includes("BR-") && rules.length > 200;
  } catch {
    return false;
  }
}
async function runRuleCheck(projectRoot2) {
  if (isSkipHooks()) {
    await logSkip(projectRoot2);
    return true;
  }
  const config = await loadHookConfig(projectRoot2);
  if (!config?.hooks["pre-commit"]["rule-check"]?.enabled) {
    return true;
  }
  const { validation_patterns } = config.hooks["pre-commit"]["rule-check"];
  const diff = getCachedDiff();
  const validationFiles = diff.filter(
    (e) => isValidationFile(e.path, validation_patterns)
  );
  if (validationFiles.length === 0) return true;
  const allDetections = [];
  for (const file of validationFiles) {
    const content = getCachedFileContent(file.path);
    if (content) {
      allDetections.push(...detectValidationPatterns(content, file.path));
    }
  }
  if (allDetections.length === 0) return true;
  for (const detection of allDetections) {
    const matched = await hasMatchingRule(projectRoot2, detection);
    if (!matched) {
      printWarn(
        "\u26A0\uFE0F New Validation Detected",
        `File: ${detection.file}:${detection.line}
Pattern: ${detection.pattern}
Content: ${detection.content}

No matching BR-xxx in business-rules.md
Consider registering this rule.`
      );
    }
  }
  return true;
}

// src/hooks/codex-posttool-entry.ts
var projectRoot = resolve(".");
async function main() {
  await runRuleCheck(projectRoot);
}
main().catch((err) => {
  console.error("IDDD codex-posttool hook error:", err);
  process.exit(0);
});

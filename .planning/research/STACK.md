# Technology Stack

**Project:** IDDD Skill Package v2 - Deployment & Smart Routing
**Researched:** 2026-04-06

## Executive Summary

The id3-cli package needs to evolve from a `npx`-only template copier into a **Claude Code plugin** distributed via npm. The Claude Code plugin system (launched Oct 2025, now stable) is the official mechanism for npm packages to register skills as slash commands. This is not a "copy files to ~/.claude/skills" postinstall hack -- it is a first-class plugin architecture with its own manifest, directory conventions, and marketplace distribution.

The critical architectural insight: **id3-cli should become both a standalone CLI and a Claude Code plugin simultaneously.** The same npm package ships a `bin` entry for `npx id3-cli` (backward compat) and a `.claude-plugin/plugin.json` manifest + `skills/` directory for plugin-based skill registration.

## Recommended Stack

### Core Runtime

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Node.js | >=22.x | Runtime | Already in use (v22.20.0 on this machine). ES2022 target + Node16 module resolution are stable here. | HIGH |
| TypeScript | ^5.8.x | Language | Already in use. No reason to change. | HIGH |

### Build Tooling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| tsc | (bundled with TS) | Type checking + JS emit | Already in use via `tsc` in build script. Keep this -- it produces clean ESM output matching the `"type": "module"` package config. No bundler needed for a CLI tool. | HIGH |

**Why NOT switch to tsup/esbuild for build?** The project already uses `tsc` and the output is a CLI tool, not a library consumed by other bundlers. `tsc` produces clean, debuggable ESM output. Adding a bundler adds complexity with no payoff for this project type. Keep esbuild only for the hooks build script (already in devDeps). tsup is no longer actively maintained (project recommends tsdown), further reason to avoid adopting it.

### Testing

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vitest | ^3.1.x | Test runner | Already in use. Fast, ESM-native, TypeScript-native. | HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| (none new) | -- | -- | The project has zero runtime dependencies currently. Keep it that way. Node.js built-ins (fs, path, child_process) cover all needs. | HIGH |

**Why no commander/yargs/citty?** The CLI has exactly two modes: (1) `id3-cli [init] [target-dir]` for npx usage and (2) `id3-cli register` for plugin self-registration. This is simple enough for manual `process.argv` parsing (already implemented). Adding a CLI framework for 2 commands is over-engineering.

## Claude Code Plugin Architecture (The Core Decision)

### How Skill Registration Actually Works

**Confidence: HIGH** (verified against official Claude Code docs at code.claude.com/docs/en/plugins, code.claude.com/docs/en/skills, code.claude.com/docs/en/plugin-marketplaces)

Claude Code has a formal plugin system. Skills are NOT registered by copying files to `~/.claude/skills/`. Instead:

1. A **plugin** is a directory with `.claude-plugin/plugin.json` manifest and a `skills/` directory.
2. Plugins are installed via **marketplaces** (git repos or npm packages containing a `marketplace.json`).
3. Users install via `/plugin marketplace add <source>` then `/plugin install <name>@<marketplace>`.
4. Plugin skills are namespaced: `/plugin-name:skill-name` (e.g., `/id3-cli:id3-identify-entities`).

npm packages can serve as plugin sources. In a marketplace.json, a plugin entry can specify:

```json
{
  "source": {
    "source": "npm",
    "package": "id3-cli",
    "version": "^1.0.0"
  }
}
```

### Two Distribution Strategies

#### Strategy A: Plugin-First (Recommended)

The id3-cli npm package is **itself** a Claude Code plugin. Its directory structure includes `.claude-plugin/plugin.json` and `skills/` at the package root.

**How users install:**
1. A marketplace (could be a small git repo or the official Anthropic marketplace) lists id3-cli as a plugin with npm source.
2. User runs `/plugin marketplace add bruce-jsh/id3-cli-marketplace` (or the official marketplace).
3. User runs `/plugin install id3-cli@marketplace-name`.
4. Claude Code downloads the npm package, caches it, and registers all skills under the `id3-cli:` namespace.

**How `npx id3-cli` still works:**
The `bin.id3-cli` entry in package.json continues to work for the init/setup flow. The `bin/cli.ts` entrypoint handles `npx id3-cli [target-dir]` for template copying. This is independent of the plugin system.

**Pros:**
- Clean separation of concerns: CLI for project setup, plugin for skill invocation
- Skills are versioned with the npm package
- Marketplace auto-updates work out of the box
- Namespacing prevents conflicts (`/id3-cli:id3-identify-entities`)

**Cons:**
- Users need two steps: `npx id3-cli .` (setup templates) + plugin install (get skills)
- Skill names become longer: `/id3-cli:id3-start` instead of `/id3-start`

#### Strategy B: CLI + Local Skills (Current Approach, Keep for Backward Compat)

The `npx id3-cli .` command copies templates including skills into the project's `.claude/skills/` directory. Skills appear as `/id3-identify-entities` (no namespace prefix).

**Pros:**
- Single step: `npx id3-cli .` sets up everything
- No namespace prefix on skill names
- Already implemented and working

**Cons:**
- Skills are not auto-updated (stuck at install-time version)
- Requires running CLI in every new project
- No centralized management

### Recommended Approach: Dual-Mode

Use **both** strategies. The package serves as:

1. **A CLI tool** (`npx id3-cli .`) that copies templates + project-local skills to `.claude/skills/` -- this is the backward-compatible path and the initial project setup step.
2. **A Claude Code plugin** (via marketplace/npm) that provides the same skills globally, plus the new `/id3-cli:id3-init` and `/id3-cli:id3-start` commands that are plugin-only.

For the new `/id3-init` and `/id3-start` skills specifically:
- `/id3-init` runs as a plugin skill that invokes the CLI's init logic (via `${CLAUDE_PLUGIN_ROOT}` scripts)
- `/id3-start` is a new smart router skill that exists only in the plugin (not copied to projects)

### Required Package Structure Changes

```
id3-cli/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest (NEW)
├── skills/                       # Plugin skills directory (NEW - at package root)
│   ├── id3-init/
│   │   └── SKILL.md             # /id3-cli:id3-init - project setup
│   ├── id3-start/
│   │   └── SKILL.md             # /id3-cli:id3-start - smart router
│   ├── id3-identify-entities/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── id3-design-information/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── id3-design-ui/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── id3-spawn-team/
│   │   └── SKILL.md
│   ├── id3-info-audit/
│   │   └── SKILL.md
│   └── id3-preview/
│       └── SKILL.md
├── templates/                    # EXISTING - for npx init flow
│   ├── skills/                   # Project-local skills (copied by init)
│   ├── specs/
│   ├── docs/
│   ├── steering/
│   └── hooks/
├── bin/
│   └── cli.ts                    # EXISTING - npx entrypoint
├── src/
│   ├── init.ts                   # EXISTING - init logic
│   ├── router.ts                 # NEW - smart routing logic
│   └── ...
├── dist/                         # Build output
├── package.json
└── tsconfig.json
```

### Plugin Manifest

`.claude-plugin/plugin.json`:

```json
{
  "name": "id3-cli",
  "description": "IDDD: Information Design-Driven Development skills for Claude Code",
  "version": "1.0.0",
  "author": {
    "name": "Bruce Jung",
    "email": "sunghunet@gmail.com"
  },
  "homepage": "https://github.com/bruce-jsh/iddd",
  "repository": "https://github.com/bruce-jsh/iddd",
  "license": "MIT",
  "keywords": ["iddd", "information-design", "data-modeling"]
}
```

### Marketplace Configuration

A separate marketplace repo (e.g., `bruce-jsh/id3-cli-marketplace`) or a `marketplace.json` within the same repo:

```json
{
  "name": "id3-cli-marketplace",
  "owner": { "name": "Bruce Jung" },
  "plugins": [
    {
      "name": "id3-cli",
      "source": {
        "source": "npm",
        "package": "id3-cli"
      },
      "description": "IDDD skill package for Claude Code"
    }
  ]
}
```

Alternatively, submit to the official Anthropic marketplace via claude.ai/settings/plugins/submit for maximum visibility.

## package.json Changes Required

```json
{
  "name": "id3-cli",
  "version": "1.0.0",
  "description": "IDDD: Information Design-Driven Development",
  "type": "module",
  "bin": {
    "id3-cli": "dist/bin/cli.js"
  },
  "files": [
    "dist/",
    "templates/",
    "skills/",
    ".claude-plugin/",
    "assets/"
  ]
}
```

Key changes:
- Add `"skills/"` and `".claude-plugin/"` to `files` array so they ship with npm package
- Version bump to 1.0.0 (this is a significant milestone)

## Smart Router Skill (`id3-start`)

The `/id3-start` skill needs no special runtime dependencies. It is a SKILL.md file with routing instructions embedded as prompt engineering. The "smart routing" is done by Claude itself based on the skill's instructions -- no custom TypeScript logic needed for the routing decision.

The SKILL.md will:
1. Accept user input via `$ARGUMENTS`
2. Instruct Claude to analyze the request
3. Provide routing rules (e.g., "if UI-related, invoke /id3-design-ui")
4. Claude then invokes the appropriate skill using its built-in Skill tool

This is pure prompt engineering, not code. No `src/router.ts` is actually needed unless there is a desire for deterministic keyword matching (which would be inferior to Claude's semantic understanding).

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Skill Distribution | Claude Code Plugin system | postinstall copying to ~/.claude/skills/ | Fragile, not officially supported, breaks on updates, security concerns with postinstall hooks |
| Skill Distribution | Claude Code Plugin system | `npx skills add` (Vercel) | Third-party tool dependency, not the native Claude Code mechanism |
| Build Tool | tsc (keep current) | tsup/tsdown | Unnecessary for CLI-only package, tsup is unmaintained, tsc output is sufficient |
| CLI Framework | Manual argv parsing (keep current) | commander/yargs | Only 2 commands, framework is overkill |
| Smart Router | Prompt-based (SKILL.md only) | TypeScript router with keyword matching | Claude's semantic understanding is strictly superior to keyword matching |
| Plugin Scope | npm + marketplace | Global install + postinstall | Claude Code plugin system is the official path; postinstall scripts are a security anti-pattern |

## Installation Flow (End User Perspective)

### Path A: Plugin Installation (New, Primary)

```bash
# Inside Claude Code:
/plugin marketplace add bruce-jsh/id3-cli-marketplace
/plugin install id3-cli@id3-cli-marketplace

# Now available:
/id3-cli:id3-init     # Sets up IDDD in current project
/id3-cli:id3-start    # Smart router
# ... all other skills
```

### Path B: npx Installation (Backward Compatible)

```bash
# In terminal:
npx id3-cli@latest .

# Skills are copied to .claude/skills/ as before
# Available as /id3-identify-entities (no namespace prefix)
```

### Path C: npm Global + Plugin (Advanced)

```bash
# In terminal:
npm i -g id3-cli

# Then use as CLI:
id3-cli .

# Plugin registration is separate (via marketplace)
```

## What NOT to Do

| Anti-Pattern | Why It Fails |
|-------------|-------------|
| Use npm postinstall to copy skills to `~/.claude/skills/` | Not how Claude Code discovers skills. Skills in `~/.claude/skills/` are personal skills, not plugin skills. Postinstall scripts are a security vector. npm warns on postinstall. |
| Ship a `--register` CLI subcommand that writes to `~/.claude/` | Bypasses Claude Code's plugin trust model. Users must explicitly install plugins through Claude Code's UI. Writing directly to config is fragile and unsafe. |
| Put all skills in `templates/skills/` only | Works for npx init, but plugin system needs skills at package root in `skills/` directory. Need skills in both places (or symlinks). |
| Bundle a marketplace.json inside the npm package | marketplace.json needs to be in a git repo that users can add. It references the npm package as a source. The marketplace is the catalog, not part of the plugin itself. |
| Use `npm i -g` as the primary installation method | Global npm installs do not auto-register as Claude Code plugins. The plugin system has its own install mechanism. |
| Add runtime dependencies for the router | The smart router is a prompt, not code. Adding NLP libraries or pattern matching frameworks is over-engineering. |

## Sources

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) - Official skill structure, frontmatter, discovery
- [Claude Code Plugins Documentation](https://code.claude.com/docs/en/plugins) - Plugin creation, structure, distribution
- [Claude Code Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) - npm source, marketplace.json schema, distribution
- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference) - Complete manifest schema, directory structure, versioning
- [Claude Code Discover Plugins](https://code.claude.com/docs/en/discover-plugins) - End-user installation flow
- [TypeScript ESM/CJS publishing in 2025](https://lirantal.com/blog/typescript-in-2025-with-esm-and-cjs-npm-publishing) - Build tooling landscape

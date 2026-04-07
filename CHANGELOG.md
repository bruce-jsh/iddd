# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.0] - TBD

### Added
- IDDD methodology as AI agent skill package for Claude Code and OpenAI Codex
- Global CLI (`npm i -g id3-cli`) with automatic skill registration to `~/.claude/skills/`
- Smart router (`/id3-start`): auto-setup detection, progress dashboard, phase routing
- Project reset (`/id3-clear`): safe removal of all IDDD-generated files with confirmation
- 6 phase skills: entity identification, information design, UI design, team spawn, audit, preview
- Harness hook system: schema-drift detection (BLOCK), rule-check (WARN), auto-audit (INFO)
- Cross-platform support: macOS, Linux, Windows path handling
- Document templates: entity catalog, data model, business rules, domain glossary, conventions

[unreleased]: https://github.com/bruce-jsh/iddd/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/bruce-jsh/iddd/releases/tag/v1.0.0

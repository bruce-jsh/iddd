import { describe, it, expect } from 'vitest';
import {
  parseUiStructure,
  parseUiDesignContract,
  runSevenPillarGate,
  type UiStructureData,
  type UiDesignContractData,
  type GateResult,
  type PillarResult,
} from '../../src/preview/ui-gate.js';

describe('parseUiStructure', () => {
  it('extracts screen inventory from markdown', () => {
    const md = `---
version: "1.0"
derived_from: "entity-catalog.md v1.0"
screen_count: 3
entity_coverage: "2/2 (100%)"
---

# UI Structure

## Screen Inventory

| Screen | URL | Primary Entity | Pattern | Priority | Source |
|--------|-----|----------------|---------|----------|--------|
| User List | /users | User | List | P1 | Auto-derived |
| User Detail | /users/:id | User | Detail | P1 | Auto-derived |
| Post List | /posts | Post | List | P1 | Auto-derived |

## Entity-Screen Traceability Matrix

| Entity | List | Detail | Create | Edit | Dashboard | Notes |
|--------|------|--------|--------|------|-----------|-------|
| User | /users | /users/:id | - | - | - | |
| Post | /posts | - | - | - | - | |
`;
    const data = parseUiStructure(md);
    expect(data.screens).toHaveLength(3);
    expect(data.screens[0].entity).toBe('User');
    expect(data.entityCoverage).toBe('2/2 (100%)');
    expect(data.traceabilityMatrix).toHaveLength(2);
  });

  it('returns empty screens for unpopulated template', () => {
    const md = `---
version: "0.0"
---

# UI Structure

## Screen Inventory

| Screen | URL | Primary Entity | Pattern | Priority | Source |
|--------|-----|----------------|---------|----------|--------|
| _(Populated in Phase 2.5)_ | | | | | |
`;
    const data = parseUiStructure(md);
    expect(data.screens).toHaveLength(0);
  });
});

describe('parseUiDesignContract', () => {
  it('extracts design tokens from markdown', () => {
    const md = `---
version: "1.0"
framework: "React + Next.js"
ui_library: "shadcn/ui"
css: "Tailwind CSS"
---

# UI Design Contract

## Tech Stack
- Framework: React 19 + Next.js 15

## Design Tokens

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Inline padding |
| space-2 | 8px | Input padding |
| space-4 | 16px | Section gaps |

### Typography

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| display | 36px | 700 | 1.2 | Page titles |
| body | 16px | 400 | 1.5 | Body text |

### Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| surface | #ffffff | #0a0a0b | Backgrounds |
| accent | #3b82f6 | #60a5fa | CTAs, active |
| error | #ef4444 | #f87171 | Errors |

### Copywriting

| Pattern | Template | Example |
|---------|----------|---------|
| CTA Primary | Create [Entity] | Create User |
| Empty State | No [entities] yet. Create your first [entity]. | No users yet. |
| Error Required | [Field] is required. | Email is required. |
| Danger | This will permanently delete [entity]. | This will permanently delete User. |

## Component Mapping

| Widget | Component | Import |
|--------|-----------|--------|
| Text Input | <Input /> | @/components/ui/input |
| Select | <Select /> | @/components/ui/select |
| Toggle | <Switch /> | @/components/ui/switch |
`;
    const data = parseUiDesignContract(md);
    expect(data.framework).toBe('React + Next.js');
    expect(data.spacing).toHaveLength(3);
    expect(data.typography).toHaveLength(2);
    expect(data.colors).toHaveLength(3);
    expect(data.copywriting).toHaveLength(4);
    expect(data.componentMapping).toHaveLength(3);
  });
});

describe('runSevenPillarGate', () => {
  const validStructure: UiStructureData = {
    screens: [
      { name: 'User List', url: '/users', entity: 'User', pattern: 'List', priority: 'P1', source: 'Auto-derived' },
      { name: 'Post List', url: '/posts', entity: 'Post', pattern: 'List', priority: 'P1', source: 'Auto-derived' },
    ],
    entityCoverage: '2/2 (100%)',
    traceabilityMatrix: [
      { entity: 'User', screens: { List: '/users' } },
      { entity: 'Post', screens: { List: '/posts' } },
    ],
  };

  const validContract: UiDesignContractData = {
    framework: 'React + Next.js',
    spacing: [
      { token: 'space-1', value: '4px', usage: 'Inline' },
      { token: 'space-2', value: '8px', usage: 'Input' },
      { token: 'space-4', value: '16px', usage: 'Section' },
    ],
    typography: [
      { token: 'display', size: '36px', weight: '700', lineHeight: '1.2', usage: 'Titles' },
      { token: 'body', size: '16px', weight: '400', lineHeight: '1.5', usage: 'Body' },
    ],
    colors: [
      { token: 'surface', light: '#ffffff', dark: '#0a0a0b', usage: 'Backgrounds' },
      { token: 'accent', light: '#3b82f6', dark: '#60a5fa', usage: 'CTAs' },
      { token: 'error', light: '#ef4444', dark: '#f87171', usage: 'Errors' },
    ],
    copywriting: [
      { pattern: 'CTA Primary', template: 'Create [Entity]', example: 'Create User' },
      { pattern: 'Empty State', template: 'No [entities] yet.', example: 'No users yet.' },
      { pattern: 'Error Required', template: '[Field] is required.', example: 'Email is required.' },
      { pattern: 'Danger', template: 'This will permanently delete [entity].', example: 'Delete user.' },
    ],
    componentMapping: [
      { widget: 'Text Input', component: '<Input />', importPath: '@/components/ui/input' },
      { widget: 'Select', component: '<Select />', importPath: '@/components/ui/select' },
      { widget: 'Toggle', component: '<Switch />', importPath: '@/components/ui/switch' },
    ],
  };

  const entityNames = ['User', 'Post'];

  it('returns PASS for valid structure and contract', () => {
    const result = runSevenPillarGate(validStructure, validContract, entityNames);
    expect(result.verdict).toBe('PASS');
    expect(result.pillars).toHaveLength(7);
    result.pillars.forEach(p => expect(p.status).toBe('PASS'));
  });

  it('returns BLOCKED when entity coverage < 100%', () => {
    const incompleteStructure: UiStructureData = {
      ...validStructure,
      entityCoverage: '1/2 (50%)',
      traceabilityMatrix: [
        { entity: 'User', screens: { List: '/users' } },
      ],
    };
    const result = runSevenPillarGate(incompleteStructure, validContract, entityNames);
    expect(result.verdict).toBe('BLOCKED');
    const structurePillar = result.pillars.find(p => p.name === 'Structure Completeness');
    expect(structurePillar!.status).toBe('BLOCKED');
  });

  it('returns BLOCKED when spacing has non-scale values', () => {
    const badContract: UiDesignContractData = {
      ...validContract,
      spacing: [
        { token: 'space-1', value: '5px', usage: 'Inline' }, // 5 is not a multiple of 4
      ],
    };
    const result = runSevenPillarGate(validStructure, badContract, entityNames);
    const spacingPillar = result.pillars.find(p => p.name === 'Spacing');
    expect(spacingPillar!.status).toBe('BLOCKED');
  });

  it('returns BLOCKED when typography exceeds 4 sizes', () => {
    const badContract: UiDesignContractData = {
      ...validContract,
      typography: [
        { token: 't1', size: '12px', weight: '400', lineHeight: '1.5', usage: 'a' },
        { token: 't2', size: '14px', weight: '400', lineHeight: '1.5', usage: 'b' },
        { token: 't3', size: '16px', weight: '400', lineHeight: '1.5', usage: 'c' },
        { token: 't4', size: '20px', weight: '400', lineHeight: '1.5', usage: 'd' },
        { token: 't5', size: '24px', weight: '600', lineHeight: '1.2', usage: 'e' },
      ],
    };
    const result = runSevenPillarGate(validStructure, badContract, entityNames);
    const typoPillar = result.pillars.find(p => p.name === 'Typography');
    expect(typoPillar!.status).toBe('BLOCKED');
  });

  it('returns BLOCKED when accent color is missing', () => {
    const badContract: UiDesignContractData = {
      ...validContract,
      colors: [
        { token: 'surface', light: '#ffffff', dark: '#0a0a0b', usage: 'Backgrounds' },
      ],
    };
    const result = runSevenPillarGate(validStructure, badContract, entityNames);
    const colorPillar = result.pillars.find(p => p.name === 'Color');
    expect(colorPillar!.status).toBe('BLOCKED');
  });

  it('returns BLOCKED when copywriting uses generic terms', () => {
    const badContract: UiDesignContractData = {
      ...validContract,
      copywriting: [
        { pattern: 'CTA', template: 'Submit', example: 'Submit' },
        { pattern: 'Link', template: 'Click here', example: 'Click here' },
      ],
    };
    const result = runSevenPillarGate(validStructure, badContract, entityNames);
    const copyPillar = result.pillars.find(p => p.name === 'Copywriting');
    expect(copyPillar!.status).toBe('BLOCKED');
  });

  it('returns BLOCKED when component mapping is empty', () => {
    const badContract: UiDesignContractData = {
      ...validContract,
      componentMapping: [],
    };
    const result = runSevenPillarGate(validStructure, badContract, entityNames);
    const regPillar = result.pillars.find(p => p.name === 'Component Registry');
    expect(regPillar!.status).toBe('BLOCKED');
  });

  it('returns BLOCKED when traceability is missing for an entity', () => {
    const incompleteStructure: UiStructureData = {
      ...validStructure,
      entityCoverage: '2/2 (100%)',
      traceabilityMatrix: [
        { entity: 'User', screens: { List: '/users' } },
        // Post is missing from traceability matrix
      ],
    };
    const result = runSevenPillarGate(incompleteStructure, validContract, entityNames);
    const tracePillar = result.pillars.find(p => p.name === 'Traceability');
    expect(tracePillar!.status).toBe('BLOCKED');
  });
});

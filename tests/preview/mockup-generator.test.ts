import { describe, it, expect } from 'vitest';
import {
  deriveScreensFromEntities,
  mapAttributeToWidget,
  generateSampleData,
  renderMockupIndexHtml,
  renderEntityMockupHtml,
  type EntityDef,
  type AttributeDef,
  type ScreenDerivation,
} from '../../src/preview/mockup-generator.js';

describe('deriveScreensFromEntities', () => {
  const entities: EntityDef[] = [
    {
      name: 'User',
      attributes: [
        { name: 'id', type: 'UUID', constraints: ['PK'] },
        { name: 'email', type: 'VARCHAR', constraints: ['NOT NULL', 'UNIQUE'], maxLength: 200 },
        { name: 'name', type: 'VARCHAR', constraints: ['NOT NULL'], maxLength: 100 },
        { name: 'status', type: 'ENUM', constraints: ['NOT NULL'], enumValues: ['active', 'inactive', 'pending'] },
        { name: 'bio', type: 'TEXT', constraints: [], maxLength: undefined },
        { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
      ],
      relationships: [
        { target: 'Post', type: '1:N', fk: 'user_id' },
      ],
      stateTransitions: [
        { from: 'pending', to: 'active' },
        { from: 'active', to: 'inactive' },
      ],
    },
  ];

  it('derives List View for every entity', () => {
    const screens = deriveScreensFromEntities(entities);
    const listScreen = screens.find(s => s.entity === 'User' && s.pattern === 'list');
    expect(listScreen).toBeDefined();
    expect(listScreen!.url).toBe('/users');
    expect(listScreen!.name).toBe('User List');
  });

  it('derives Detail View when PK exists', () => {
    const screens = deriveScreensFromEntities(entities);
    const detailScreen = screens.find(s => s.entity === 'User' && s.pattern === 'detail');
    expect(detailScreen).toBeDefined();
    expect(detailScreen!.url).toBe('/users/:id');
  });

  it('derives Create Form when NOT NULL attributes exist', () => {
    const screens = deriveScreensFromEntities(entities);
    const createScreen = screens.find(s => s.entity === 'User' && s.pattern === 'create');
    expect(createScreen).toBeDefined();
    expect(createScreen!.url).toBe('/users/new');
  });

  it('derives Edit Form when mutable attributes exist', () => {
    const screens = deriveScreensFromEntities(entities);
    const editScreen = screens.find(s => s.entity === 'User' && s.pattern === 'edit');
    expect(editScreen).toBeDefined();
    expect(editScreen!.url).toBe('/users/:id/edit');
  });

  it('derives Status Dashboard when state transitions exist', () => {
    const screens = deriveScreensFromEntities(entities);
    const dashScreen = screens.find(s => s.entity === 'User' && s.pattern === 'dashboard');
    expect(dashScreen).toBeDefined();
  });

  it('derives Child Tab for 1:N parent side', () => {
    const screens = deriveScreensFromEntities(entities);
    const childTab = screens.find(s => s.entity === 'User' && s.pattern === 'child-tab');
    expect(childTab).toBeDefined();
    expect(childTab!.relatedEntity).toBe('Post');
  });
});

describe('mapAttributeToWidget', () => {
  it('maps VARCHAR (short) to text-input', () => {
    const attr: AttributeDef = { name: 'name', type: 'VARCHAR', constraints: ['NOT NULL'], maxLength: 100 };
    expect(mapAttributeToWidget(attr)).toBe('text-input');
  });

  it('maps TEXT (long) to textarea', () => {
    const attr: AttributeDef = { name: 'bio', type: 'TEXT', constraints: [], maxLength: undefined };
    expect(mapAttributeToWidget(attr)).toBe('textarea');
  });

  it('maps ENUM to select', () => {
    const attr: AttributeDef = { name: 'status', type: 'ENUM', constraints: [], enumValues: ['a', 'b'] };
    expect(mapAttributeToWidget(attr)).toBe('select');
  });

  it('maps BOOLEAN to toggle', () => {
    const attr: AttributeDef = { name: 'active', type: 'BOOLEAN', constraints: [] };
    expect(mapAttributeToWidget(attr)).toBe('toggle');
  });

  it('maps INTEGER to number-input', () => {
    const attr: AttributeDef = { name: 'count', type: 'INTEGER', constraints: [] };
    expect(mapAttributeToWidget(attr)).toBe('number-input');
  });

  it('maps DECIMAL to number-input', () => {
    const attr: AttributeDef = { name: 'price', type: 'DECIMAL', constraints: [] };
    expect(mapAttributeToWidget(attr)).toBe('number-input');
  });

  it('maps DATE to date-picker', () => {
    const attr: AttributeDef = { name: 'birth', type: 'DATE', constraints: [] };
    expect(mapAttributeToWidget(attr)).toBe('date-picker');
  });

  it('maps TIMESTAMP to datetime-picker', () => {
    const attr: AttributeDef = { name: 'ts', type: 'TIMESTAMP', constraints: [] };
    expect(mapAttributeToWidget(attr)).toBe('datetime-picker');
  });

  it('maps FK to autocomplete', () => {
    const attr: AttributeDef = { name: 'org_id', type: 'FK', constraints: [], refEntity: 'Organization' };
    expect(mapAttributeToWidget(attr)).toBe('autocomplete');
  });

  it('maps UUID PK to hidden', () => {
    const attr: AttributeDef = { name: 'id', type: 'UUID', constraints: ['PK'] };
    expect(mapAttributeToWidget(attr)).toBe('hidden');
  });

  it('maps File to file-upload', () => {
    const attr: AttributeDef = { name: 'avatar', type: 'FILE', constraints: [] };
    expect(mapAttributeToWidget(attr)).toBe('file-upload');
  });

  it('maps Email to specialized-input', () => {
    const attr: AttributeDef = { name: 'email', type: 'VARCHAR', constraints: [], subtype: 'email' };
    expect(mapAttributeToWidget(attr)).toBe('specialized-input');
  });
});

describe('generateSampleData', () => {
  it('generates string sample for VARCHAR name', () => {
    const samples = generateSampleData({ name: 'name', type: 'VARCHAR', constraints: [] }, 3);
    expect(samples).toHaveLength(3);
    expect(typeof samples[0]).toBe('string');
  });

  it('generates email sample for email attribute', () => {
    const samples = generateSampleData({ name: 'email', type: 'VARCHAR', constraints: [], subtype: 'email' }, 2);
    expect(samples).toHaveLength(2);
    expect(samples[0]).toContain('@');
  });

  it('generates ENUM values from enumValues', () => {
    const samples = generateSampleData({ name: 'status', type: 'ENUM', constraints: [], enumValues: ['active', 'inactive'] }, 2);
    expect(['active', 'inactive']).toContain(samples[0]);
  });

  it('generates integer for INTEGER type', () => {
    const samples = generateSampleData({ name: 'count', type: 'INTEGER', constraints: [] }, 3);
    expect(typeof samples[0]).toBe('number');
  });

  it('generates boolean for BOOLEAN type', () => {
    const samples = generateSampleData({ name: 'active', type: 'BOOLEAN', constraints: [] }, 2);
    expect(typeof samples[0]).toBe('boolean');
  });

  it('generates timestamp string for TIMESTAMP type', () => {
    const samples = generateSampleData({ name: 'created_at', type: 'TIMESTAMP', constraints: [] }, 2);
    expect(typeof samples[0]).toBe('string');
    expect(samples[0]).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});

describe('renderMockupIndexHtml', () => {
  it('generates index HTML with screen list and left menu', () => {
    const screens: ScreenDerivation[] = [
      { name: 'User List', url: '/users', entity: 'User', pattern: 'list', priority: 'P1', source: 'auto-derived' },
      { name: 'User Detail', url: '/users/:id', entity: 'User', pattern: 'detail', priority: 'P1', source: 'auto-derived' },
    ];
    const html = renderMockupIndexHtml(screens, 'Mockup Index');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('User List');
    expect(html).toContain('User Detail');
    expect(html).toContain('nav'); // left menu
  });
});

describe('renderEntityMockupHtml', () => {
  const entity: EntityDef = {
    name: 'User',
    attributes: [
      { name: 'id', type: 'UUID', constraints: ['PK'] },
      { name: 'email', type: 'VARCHAR', constraints: ['NOT NULL', 'UNIQUE'], maxLength: 200 },
      { name: 'name', type: 'VARCHAR', constraints: ['NOT NULL'], maxLength: 100 },
      { name: 'status', type: 'ENUM', constraints: ['NOT NULL'], enumValues: ['active', 'inactive'] },
    ],
    relationships: [],
    stateTransitions: [],
  };

  it('generates mockup HTML with 3 fidelity tabs (wireframe/styled/interactive)', () => {
    const html = renderEntityMockupHtml(entity, {
      spacing: { base: 8 },
      colors: { accent: '#3b82f6', surface: '#ffffff', secondary: '#6b7280' },
      typography: { body: { size: '16px', weight: '400' } },
    });
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Wireframe');
    expect(html).toContain('Styled');
    expect(html).toContain('Interactive');
  });

  it('includes traceability panel with entity/attribute source', () => {
    const html = renderEntityMockupHtml(entity, {
      spacing: { base: 8 },
      colors: { accent: '#3b82f6', surface: '#ffffff', secondary: '#6b7280' },
      typography: { body: { size: '16px', weight: '400' } },
    });
    expect(html).toContain('Traceability');
    expect(html).toContain('User');
    expect(html).toContain('email');
  });

  it('applies design tokens to styled tab', () => {
    const html = renderEntityMockupHtml(entity, {
      spacing: { base: 8 },
      colors: { accent: '#3b82f6', surface: '#ffffff', secondary: '#6b7280' },
      typography: { body: { size: '16px', weight: '400' } },
    });
    expect(html).toContain('#3b82f6');
    expect(html).toContain('16px');
  });

  it('generates sample data in interactive tab', () => {
    const html = renderEntityMockupHtml(entity, {
      spacing: { base: 8 },
      colors: { accent: '#3b82f6', surface: '#ffffff', secondary: '#6b7280' },
      typography: { body: { size: '16px', weight: '400' } },
    });
    // Interactive tab should have actual data values, not placeholders
    expect(html).toContain('@'); // email sample contains @
  });
});

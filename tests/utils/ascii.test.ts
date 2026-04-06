import { describe, it, expect } from 'vitest';
import { box, banner } from '../../src/utils/ascii.js';

describe('box', () => {
  it('wraps content in a box', () => {
    const result = box('Hello');
    expect(result).toContain('┌');
    expect(result).toContain('┘');
    expect(result).toContain('Hello');
  });

  it('handles multi-line content', () => {
    const result = box('Line 1\nLine 2');
    expect(result).toContain('Line 1');
    expect(result).toContain('Line 2');
  });

  it('supports title', () => {
    const result = box('Content', { title: 'My Title' });
    expect(result).toContain('My Title');
  });
});

describe('banner', () => {
  it('renders IDDD banner', () => {
    const result = banner('1.0.0');
    expect(result).toContain('Information Design-Driven Development');
    expect(result).toContain('1.0.0');
  });

  it('loads banner from assets/banner.txt file', () => {
    const result = banner('1.0.0');
    // These strings are in assets/banner.txt but NOT in the fallback string
    expect(result).toContain('Information Design-Driven Development');
    expect(result).toContain('██'); // Block characters from the ASCII art
    expect(result).toContain('╔'); // Double-line box from banner.txt
  });

  it('replaces version placeholder in banner', () => {
    const result = banner('2.5.0');
    expect(result).toContain('v2.5.0');
    expect(result).not.toContain('{{version}}');
  });
});

export interface BoxOptions {
  title?: string;
  width?: number;
  padding?: number;
}

export function box(content: string, options: BoxOptions = {}): string {
  const { title, width = 47, padding = 1 } = options;
  const lines = content.split('\n');
  const innerWidth = width - 2; // borders

  const padStr = ' '.repeat(padding);

  const result: string[] = [];

  // top border
  if (title) {
    const titleStr = ` ${title} `;
    const remaining = innerWidth - titleStr.length - 1;
    result.push(`  ┌─${titleStr}${'─'.repeat(Math.max(0, remaining))}┐`);
  } else {
    result.push(`  ┌${'─'.repeat(innerWidth)}┐`);
  }

  // padding line
  result.push(`  │${' '.repeat(innerWidth)}│`);

  // content lines
  for (const line of lines) {
    const padded = `${padStr}${line}`;
    const spaces = innerWidth - padded.length;
    result.push(`  │${padded}${' '.repeat(Math.max(0, spaces))}│`);
  }

  // padding line
  result.push(`  │${' '.repeat(innerWidth)}│`);

  // bottom border
  result.push(`  └${'─'.repeat(innerWidth)}┘`);

  return result.join('\n');
}

export function banner(version: string): string {
  const content = [
    '╦╔╦╗╔╦╗╔╦╗  IDDD',
    '║ ║║ ║║ ║║',
    '╩═╩╝═╩╝═╩╝',
    '',
    'Information Design-Driven Development',
    `v${version}`,
  ].join('\n');

  return box(content);
}

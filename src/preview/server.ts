import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { box } from '../utils/ascii.js';

export interface PreviewServerResult {
  port: number;
  close: () => void;
}

export async function startPreviewServer(
  previewDir: string
): Promise<PreviewServerResult> {
  return new Promise((resolve) => {
    const server: Server = createServer(async (req, res) => {
      const urlPath = req.url?.replace(/^\//, '') || 'index';
      const filePath = join(previewDir, `${urlPath}.html`);

      try {
        const content = await readFile(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      } catch {
        // Try listing available files
        const { readdir } = await import('node:fs/promises');
        try {
          const files = (await readdir(previewDir))
            .filter((f) => f.endsWith('.html'))
            .map((f) => f.replace('.html', ''));
          const links = files
            .map((f) => `<li><a href="/${f}">${f}</a></li>`)
            .join('');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(
            `<!DOCTYPE html><html><body><h1>IDDD Preview</h1><ul>${links}</ul></body></html>`
          );
        } catch {
          res.writeHead(404);
          res.end('Not found');
        }
      }
    });

    server.listen(0, () => {
      const actualPort = (server.address() as any)?.port;
      resolve({
        port: actualPort,
        close: () => server.close(),
      });
    });
  });
}

export function printPreviewReady(
  port: number,
  files: Array<{ name: string; path: string }>
): void {
  const lines = files.map(
    (f) => `${f.name.padEnd(10)} http://localhost:${port}/${f.name.toLowerCase()}`
  );
  const filePaths = files.map((f) => `File: ${f.path}`);

  const content = [
    ...lines,
    '',
    ...filePaths,
    '',
    'Press Enter to close server...',
  ].join('\n');

  console.log(box(content, { title: '📊 Preview Ready' }));
}

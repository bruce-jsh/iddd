---
name: id3-preview
description: >
  Start the IDDD preview server to view ERD diagrams, UI mockups, and audit
  reports in the browser. Generates HTML from current specs/ files and serves
  existing .iddd/preview/ files.
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
user-invocable: true
---

# IDDD Preview Server

You are the lead agent starting the IDDD visual preview system. This skill generates HTML renderings of the information model (ERD, UI mockups, audit reports) and serves them via a local HTTP server for browser-based review.

## What This Skill Does

1. Reads current `specs/` files and generates interactive HTML previews.
2. Serves existing files in `.iddd/preview/` alongside newly generated ones.
3. Starts a local HTTP server and displays the URL for browser access.

---

## Procedure

### Step 1: Check for Existing Previews

Scan `.iddd/preview/` for existing HTML files:

```bash
ls -la .iddd/preview/*.html 2>/dev/null
```

List any existing files to the user so they know what is already available.

### Step 2: Generate Previews from Current Specs

Generate or regenerate HTML previews based on the current state of spec files.

#### ERD Preview

If `specs/data-model.md` exists and contains a Mermaid ERD code block:

1. Extract the Mermaid ERD code block from `specs/data-model.md`.
2. Generate `.iddd/preview/erd.html` with the following structure:
   - HTML5 document with Mermaid.js loaded from CDN (`https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js`).
   - Mermaid configuration: `startOnLoad: false`, `maxTextSize: 200000` (for large ERDs).
   - Explicit `mermaid.run()` call after DOM load.
   - Dark/light theme toggle button.
   - Entity click handler that displays entity details from `specs/entity-catalog.md` in a side panel.
   - Responsive layout that works on various screen sizes.

#### UI Mockup Preview

If `specs/output-designs.md` exists and contains screen proposals:

1. Extract screen proposals from `specs/output-designs.md`.
2. Generate `.iddd/preview/mockup.html` with:
   - HTML/CSS wireframe rendering of each proposed screen.
   - Navigation links between screens (based on entity relationships).
   - Entity-screen mapping highlights.
   - Each screen clearly labeled with its entity context.

#### Audit Preview

If any `audit-*.html` file exists in `.iddd/preview/`, it will be served as-is. To generate a new audit report, use `/id3-info-audit` instead.

### Step 3: Start the Preview Server

Start a local HTTP server to serve the `.iddd/preview/` directory:

```bash
node -e "
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.resolve('.iddd/preview');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(dir, url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try with .html extension
      fs.readFile(filePath + '.html', (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
      res.end(data);
    }
  });
});

server.listen(0, () => {
  const port = server.address().port;
  console.log('Preview server running at http://localhost:' + port);
});
"
```

The server uses `listen(0)` so the OS assigns an available port automatically.

### Step 4: Generate Index Page

Create `.iddd/preview/index.html` as a landing page that links to all available previews:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IDDD Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    h1 { border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    .card h2 { margin-top: 0; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  <h1>IDDD Preview Dashboard</h1>
  <!-- Links to erd.html, mockup.html, audit-*.html -->
</body>
</html>
```

Populate the links dynamically based on which files exist in `.iddd/preview/`.

### Step 5: Display Server URL

After the server starts, display the access information:

```
┌─ Preview Ready ──────────────────────────────┐
│                                               │
│  Dashboard:  http://localhost:PORT             │
│  ERD:        http://localhost:PORT/erd         │
│  Mockup:     http://localhost:PORT/mockup      │
│                                               │
│  Files: .iddd/preview/                        │
│                                               │
│  Press Ctrl+C to stop the server.             │
│                                               │
└───────────────────────────────────────────────┘
```

Only show links for files that actually exist.

---

## Notes

- **Port assignment:** The server always uses `listen(0)` for automatic port selection. Do not hardcode a port number.
- **File persistence:** All generated HTML files remain in `.iddd/preview/` after the server stops. Users can open them directly in a browser without the server.
- **Regeneration:** Running this skill again regenerates previews from the latest specs. Existing audit HTML files are preserved (they are generated by `/id3-info-audit`).
- **No external dependencies:** The server uses only Node.js built-in modules. Mermaid.js is loaded from CDN in the generated HTML.

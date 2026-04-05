import { escapeHtml } from './renderer.js';

// ── Types ──────────────────────────────────────────────

export interface PillarScore {
  pillar: string;
  score: number; // 1~4
  total: number;
  implemented: number;
  violations: number;
  findings: string[];
}

export interface AuditIssue {
  pillar: string;
  score: number;
  finding: string;
  suggestion: string;
}

export interface UiAuditReport {
  scores: PillarScore[];
  averageScore: number;
  verdict: 'PASS' | 'FAIL';
  topIssues: AuditIssue[];
}

// ── Scoring logic ─────────────────────────────────────

export function scorePillar(
  type: string,
  data: { total: number; implemented: number; violations: number }
): number {
  const { total, implemented, violations } = data;

  // For structure-type pillars: use percentage
  if (type === 'structure' || type === 'traceability') {
    const pct = total > 0 ? (implemented / total) * 100 : 0;
    if (pct >= 100) return 4;
    if (pct >= 90) return 3;
    if (pct >= 70) return 2;
    return 1;
  }

  // For detail pillars (spacing, typography, color, copywriting, registry): use violation count
  if (violations === 0) return 4;
  if (violations <= 2) return 3;
  if (violations <= 5) return 2;
  return 1;
}

// ── Report generation ─────────────────────────────────

export function generateAuditReport(scores: PillarScore[]): UiAuditReport {
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
  const verdict = averageScore >= 3.0 ? 'PASS' : 'FAIL';

  // Top 3 issues: sort by score ascending (worst first), pick those with findings
  const issuesWithFindings = scores
    .filter(s => s.findings.length > 0 && s.score < 4)
    .sort((a, b) => a.score - b.score);

  const topIssues: AuditIssue[] = issuesWithFindings.slice(0, 3).map(s => ({
    pillar: s.pillar,
    score: s.score,
    finding: s.findings[0],
    suggestion: `Resolve ${s.violations} violation(s) in ${s.pillar} to improve score from ${s.score} to ${Math.min(s.score + 1, 4)}`,
  }));

  return { scores, averageScore: Math.round(averageScore * 100) / 100, verdict, topIssues };
}

// ── Audit HTML dashboard ──────────────────────────────

function scoreColor(score: number): string {
  if (score === 4) return '#22c55e';
  if (score === 3) return '#eab308';
  if (score === 2) return '#f97316';
  return '#ef4444';
}

function scoreLabel(score: number): string {
  if (score === 4) return 'Excellent';
  if (score === 3) return 'Good';
  if (score === 2) return 'Needs Work';
  return 'Critical';
}

export function renderUiAuditHtml(report: UiAuditReport): string {
  const pillarCards = report.scores
    .map(s => {
      const color = scoreColor(s.score);
      const label = scoreLabel(s.score);
      const findings = s.findings.length > 0
        ? `<ul class="findings">${s.findings.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
        : '<p class="no-issues">No issues</p>';
      return `      <div class="pillar-card">
        <div class="pillar-score" style="color: ${color};">${s.score}/4</div>
        <div class="pillar-name">${escapeHtml(s.pillar)}</div>
        <div class="pillar-label" style="color: ${color};">${label}</div>
        <div class="pillar-stats">${s.implemented}/${s.total} implemented, ${s.violations} violation(s)</div>
        ${findings}
      </div>`;
    })
    .join('\n');

  const topIssueRows = report.topIssues
    .map((issue, i) => `        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(issue.pillar)}</td>
          <td style="color: ${scoreColor(issue.score)};">${issue.score}/4</td>
          <td>${escapeHtml(issue.finding)}</td>
          <td>${escapeHtml(issue.suggestion)}</td>
        </tr>`)
    .join('\n');

  const verdictColor = report.verdict === 'PASS' ? '#22c55e' : '#ef4444';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IDDD UI Audit Report</title>
  <style>
    :root { --bg: #ffffff; --text: #1a1a2e; --card: #f8f9fa; --border: #dee2e6; }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #1a1a2e; --text: #e0e0e0; --card: #16213e; --border: #334155; }
    }
    body { font-family: -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
    h1 { font-size: 1.5rem; }
    .verdict { font-size: 2rem; font-weight: bold; margin: 1rem 0; }
    .average { font-size: 1.2rem; color: #6c757d; margin-bottom: 1.5rem; }
    .pillars { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
    .pillar-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; }
    .pillar-score { font-size: 1.8rem; font-weight: bold; }
    .pillar-name { font-weight: 600; margin-top: 0.25rem; }
    .pillar-label { font-size: 0.85rem; margin-top: 0.15rem; }
    .pillar-stats { font-size: 0.8rem; color: #6c757d; margin-top: 0.5rem; }
    .findings { font-size: 0.85rem; margin-top: 0.5rem; padding-left: 1.2rem; }
    .no-issues { font-size: 0.85rem; color: #22c55e; margin-top: 0.5rem; }
    h2 { margin-top: 2rem; font-size: 1.2rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
    th, td { padding: 0.5rem; border: 1px solid var(--border); text-align: left; }
    th { background: var(--card); font-weight: 600; }
    .meta { font-size: 0.85rem; color: #6c757d; margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>IDDD UI Audit Report</h1>
  <div class="verdict" style="color: ${verdictColor};">${report.verdict}</div>
  <div class="average">Average Score: ${report.averageScore}/4.00</div>

  <div class="pillars">
${pillarCards}
  </div>

  <h2>Top Issues</h2>
  <table>
    <thead>
      <tr><th>#</th><th>Pillar</th><th>Score</th><th>Finding</th><th>Suggestion</th></tr>
    </thead>
    <tbody>
${topIssueRows}
    </tbody>
  </table>

  <p class="meta">Generated by IDDD Phase 2.5 UI Audit -- ${new Date().toISOString().split('T')[0]}</p>
</body>
</html>`;
}

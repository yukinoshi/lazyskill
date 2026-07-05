#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse: --title="用 MSW mock" --context="..." --decision="..." --alternatives="..." --consequences="..."
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  if (arg.indexOf('--') === 0) {
    const eq = arg.indexOf('=');
    if (eq > 0) params[arg.slice(2, eq)] = arg.slice(eq + 1);
  }
});

const title = params.title;
const context = params.context || '(未提供)';
const decision = params.decision || '(未提供)';
const alternatives = params.alternatives || '(未提供)';
const consequences = params.consequences || '(待观察)';

if (!title) {
  console.error('Usage: node add-decision.js --title="ADR 标题" --context="背景" --decision="决策" [--alternatives="备选"] [--consequences="后果"]');
  process.exit(1);
}

const root = process.cwd();
const decisionsPath = path.join(root, '.project-state', 'decisions.md');

if (!fs.existsSync(decisionsPath)) {
  console.error('decisions.md 不存在。请先运行 init-project.js');
  process.exit(1);
}

// --- 1. Find next ADR number ---
const existing = fs.readFileSync(decisionsPath, 'utf8');
const numMatches = [...existing.matchAll(/ADR-(\d+)/g)];
const nextNum = numMatches.length === 0 ? 1 : Math.max(...numMatches.map(m => parseInt(m[1], 10))) + 1;
const padNum = String(nextNum).padStart(3, '0');

// --- 2. Format date ---
const now = new Date();
const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

// --- 3. Build ADR entry ---
const entry = [
  '',
  '## ADR-' + padNum + ': ' + title + ' (' + dateStr + ')',
  '',
  '**背景**: ' + context,
  '**决策**: ' + decision,
  '**备选方案**: ' + alternatives,
  '**后果**: ' + consequences,
  ''
].join('\n');

// --- 4. Append ---
fs.appendFileSync(decisionsPath, entry);
console.log('ADR-' + padNum + ' appended to decisions.md');

// --- 5. Commit ---
try {
  execSync('git add .project-state/decisions.md');
  execSync('git commit -m "docs: ADR-' + padNum + ' ' + title + '"');
  console.log('Committed: ADR-' + padNum);
} catch (e) {
  console.log('Note: commit skipped (' + e.message.split('\n')[0] + ')');
}

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse: --to=ARCHITECTURE
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  if (arg.indexOf('--') === 0) {
    const eq = arg.indexOf('=');
    if (eq > 0) params[arg.slice(2, eq)] = arg.slice(eq + 1);
  }
});

const target = params.to;
const validPhases = ['BOOTSTRAP', 'ARCHITECTURE', 'FEATURE_DEV', 'POLISH', 'DONE'];

if (!target || validPhases.indexOf(target) < 0) {
  console.error('Usage: node phase-advance.js --to=<BOOTSTRAP|ARCHITECTURE|FEATURE_DEV|POLISH|DONE>');
  console.error('Valid phases: ' + validPhases.join(', '));
  process.exit(1);
}

const root = process.cwd();
const stateDir = path.join(root, '.project-state');
const overviewPath = path.join(stateDir, 'overview.md');
const resumePath = path.join(stateDir, 'checkpoints', 'resume.md');
const agentsPath = path.join(root, 'AGENTS.md');

// --- 0. Read current phase ---
function readCurrentPhase() {
  if (!fs.existsSync(overviewPath)) return null;
  const text = fs.readFileSync(overviewPath, 'utf8');
  // Match "## 当前阶段\n<value>" or "当前阶段: <value>"
  let m = text.match(/##\s*当前阶段\s*\n([^\n]+)/i);
  if (m) return m[1].trim();
  m = text.match(/当前阶段[::]\s*([^\n]+)/i);
  if (m) return m[1].trim();
  return null;
}

const current = readCurrentPhase();

if (current === target) {
  console.log('Already at phase: ' + target + ' — nothing to do');
  process.exit(0);
}

console.log('Phase transition: ' + (current || '(unknown)') + ' → ' + target);
console.log('\n⚠️  请确认 ' + (current || '当前') + ' 阶段的 exit conditions 已满足！');
console.log('   参考: reference/phase-definitions.md\n');

// --- 1. Update overview.md ---
if (fs.existsSync(overviewPath)) {
  let text = fs.readFileSync(overviewPath, 'utf8');
  // Replace value under "## 当前阶段" header
  if (/##\s*当前阶段\s*\n[^\n]+/i.test(text)) {
    text = text.replace(/(##\s*当前阶段\s*\n)([^\n]+)/i, '$1' + target);
  } else if (/当前阶段[::]\s*[^\n]+/i.test(text)) {
    text = text.replace(/(当前阶段[::]\s*)([^\n]+)/i, '$1' + target);
  } else {
    // Append if missing
    text += '\n\n## 当前阶段\n' + target + '\n';
  }
  fs.writeFileSync(overviewPath, text);
  console.log('Updated: overview.md');
} else {
  console.error('overview.md not found — run init-project.js first');
  process.exit(1);
}

// --- 2. Update AGENTS.md ---
if (fs.existsSync(agentsPath)) {
  let text = fs.readFileSync(agentsPath, 'utf8');
  // Format: "## Current Phase\n<PHASE> — 见 ..."
  if (/##\s*Current Phase\s*\n[^\n]+/i.test(text)) {
    text = text.replace(/(##\s*Current Phase\s*\n)([^\n—]+)(.*)/i, '$1' + target + ' $3');
  } else {
    text += '\n## Current Phase\n' + target + ' — 见 .project-state/checkpoints/resume.md\n';
  }
  fs.writeFileSync(agentsPath, text);
  console.log('Updated: AGENTS.md');
} else {
  console.log('Warning: AGENTS.md not found, skipped');
}

// --- 3. Update resume.md ---
if (fs.existsSync(resumePath)) {
  let text = fs.readFileSync(resumePath, 'utf8');
  // Format: "- 阶段: FEATURE_DEV" or "- **阶段**: FEATURE_DEV"
  if (/阶段\*{0,2}[::]\s*[^\n]+/i.test(text)) {
    text = text.replace(/(阶段\*{0,2}[::]\s*)([^\n]+)/i, '$1' + target);
  } else {
    // Append under "## 当前状态" if exists
    if (/##\s*当前状态/i.test(text)) {
      text = text.replace(/(##\s*当前状态\s*\n)/i, '$1- 阶段: ' + target + '\n');
    } else {
      text += '\n## 当前状态\n- 阶段: ' + target + '\n';
    }
  }
  fs.writeFileSync(resumePath, text);
  console.log('Updated: checkpoints/resume.md');
} else {
  console.log('Warning: resume.md not found, skipped');
}

// --- 4. Commit ---
try {
  execSync('git add .project-state/overview.md .project-state/checkpoints/resume.md AGENTS.md');
  execSync('git commit -m "chore: phase advance ' + (current || '?') + ' -> ' + target + '"');
  console.log('\nCommitted: phase advance to ' + target);
} catch (e) {
  console.log('\nNote: commit skipped (' + e.message.split('\n')[0] + ')');
}

console.log('\nNext: load reference/phase-definitions.md for ' + target + ' entry actions');

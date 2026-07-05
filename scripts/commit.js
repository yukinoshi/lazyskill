#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse: --scope=auth --scenario=login --phase=green --files=a.ts,b.ts --cycle=5 --feature=user-auth [--block="描述"]
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  if (arg.indexOf('--') === 0) {
    const eq = arg.indexOf('=');
    if (eq > 0) params[arg.slice(2, eq)] = arg.slice(eq + 1);
  }
});

const scope = params.scope;
const scenario = params.scenario;
const phase = params.phase;
const files = params.files ? params.files.split(',') : [];
const cycle = parseInt(params.cycle || '0', 10);
const feature = params.feature || '';
const block = params.block || '';

if (!scope || !scenario || !phase) {
  console.error('Usage: node commit.js --scope=<scope> --scenario=<scenario> --phase=<red|green|refactor> --files=<f1,f2> [--cycle=<N>] [--feature=<name>] [--block="描述"]');
  process.exit(1);
}

// --- 1. Generate commit message ---
var type = phase === 'red' ? 'test' : phase === 'green' ? 'feat' : 'refactor';
var msg = type + '(' + scope + '): ' + scenario + ' - ' + phase;

// --- 2. Stage files ---
if (files.length > 0) {
  var staged = files.map(function(f) { return '"' + f + '"'; }).join(' ');
  try {
    execSync('git add ' + staged);
  } catch (e) {
    console.error('git add failed: ' + e.message);
    process.exit(1);
  }
}

// --- 3. Commit ---
try {
  execSync('git commit -m "' + msg + '"');
  console.log('Committed: ' + msg);
} catch (e) {
  console.error('Commit failed: ' + e.message);
  process.exit(1);
}

// --- 4. If block present, append to blockers.md ---
if (block) {
  var root = process.cwd();
  var stateDir = path.join(root, '.project-state');
  var blockersPath = path.join(stateDir, 'checkpoints', 'blockers.md');

  // Format timestamp
  var now = new Date();
  var ts = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

  var entry = '- [' + scenario + '] ' + block + ' (' + ts + ')\n';

  // Ensure blockers.md exists, append
  if (!fs.existsSync(blockersPath)) {
    fs.writeFileSync(blockersPath, '# Blockers\n\n');
  }
  fs.appendFileSync(blockersPath, entry);
  console.log('Blocker recorded: ' + block);

  // Also update resume.md Blockers section if it exists
  var resumePath = path.join(stateDir, 'checkpoints', 'resume.md');
  if (fs.existsSync(resumePath)) {
    var resume = fs.readFileSync(resumePath, 'utf8');
    if (/##\s*Blockers/i.test(resume)) {
      // Replace "- 无" or append
      resume = resume.replace(/(##\s*Blockers\s*\n)(- 无)?/i, '$1' + entry);
      fs.writeFileSync(resumePath, resume);
    }
  }

  // Commit blockers
  try {
    execSync('git add .project-state/checkpoints/blockers.md .project-state/checkpoints/resume.md');
    execSync('git commit -m "docs: block ' + scenario + ' - ' + block.slice(0, 40) + '"');
    console.log('Blocker committed');
  } catch (e) {
    console.log('Blocker: no changes to commit separately');
  }
}

// --- 5. If green, update checkpoint ---
if (phase === 'green') {
  var root2 = process.cwd();
  var stateDir2 = path.join(root2, '.project-state');
  var resumePath2 = path.join(stateDir2, 'checkpoints', 'resume.md');

  var nextCycle = cycle + 1;
  var hasBlock = block ? '- [' + scenario + '] ' + block : '- 无';
  var resumeContent = [
    '# Resume Checkpoint',
    '',
    '## 当前状态',
    '- 阶段: FEATURE_DEV',
    '- 当前功能: ' + feature,
    '- 当前场景: ' + scenario,
    '- 循环计数: ' + nextCycle + '/20',
    '',
    '## 进度',
    '- 已完成: ' + scenario,
    '- 下一步: 取下一个场景',
    '',
    '## Context Manifest',
    '- (由 agent 填写本次加载的知识文件)',
    '',
    '## Blockers',
    hasBlock
  ].join('\n');

  try {
    fs.writeFileSync(resumePath2, resumeContent);
  } catch (e) {
    console.error('Failed to write resume.md: ' + e.message);
  }

  // Commit state files
  try {
    execSync('git add .project-state/');
    execSync('git commit -m "chore: checkpoint - ' + scenario + ' done"');
    console.log('Checkpoint updated and committed (' + nextCycle + '/20)');
  } catch (e) {
    console.log('Checkpoint: no state changes to commit');
  }

  // Audit every 5 cycles
  if (nextCycle % 5 === 0) {
    console.log('--- Running audit (cycle ' + nextCycle + ') ---');
    try {
      execSync('node "' + path.join(__dirname, 'audit.js') + '"', { stdio: 'inherit' });
    } catch (e) {
      console.log('Audit found issues. Please fix before continuing.');
    }
  }
}

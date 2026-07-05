#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse: --name=user-auth
const args = process.argv.slice(2);
const params = {};
args.forEach(function(arg) {
  if (arg.indexOf('--') === 0) {
    var eq = arg.indexOf('=');
    if (eq > 0) params[arg.slice(2, eq)] = arg.slice(eq + 1);
  }
});

const feature = params.name;
if (!feature) {
  console.error('Usage: node feature-done.js --name=<feature-name>');
  process.exit(1);
}

const root = process.cwd();
const state = path.join(root, '.project-state');
const currentPath = path.join(state, 'features', 'current.md');
const donePath = path.join(state, 'features', 'done.md');
const backlogPath = path.join(state, 'features', 'backlog.md');

// --- 1. Read current.md ---
var current = '';
if (fs.existsSync(currentPath)) {
  current = fs.readFileSync(currentPath, 'utf8');
}

// --- 2. Append to done.md ---
var done = '';
if (fs.existsSync(donePath)) {
  done = fs.readFileSync(donePath, 'utf8');
}
if (done && !done.endsWith('\n')) done += '\n';
done += '\n---\n\n' + current + '\n';
fs.writeFileSync(donePath, done);

// --- 3. Clear current.md ---
fs.writeFileSync(currentPath, '# Current Feature\n\n_暂无 - 从 backlog 拉取下一个功能_\n');

// --- 4. Remove feature from backlog.md ---
if (fs.existsSync(backlogPath)) {
  var backlog = fs.readFileSync(backlogPath, 'utf8');
  var lines = backlog.split('\n');
  var startIdx = -1;
  var endIdx = lines.length;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('## Feature:') >= 0) {
      if (startIdx >= 0) {
        endIdx = i;
        break;
      }
      if (lines[i].indexOf('(' + feature + ')') >= 0) {
        startIdx = i;
      }
    }
  }
  if (startIdx >= 0) {
    lines.splice(startIdx, endIdx - startIdx);
    backlog = lines.join('\n');
    fs.writeFileSync(backlogPath, backlog);
    console.log('Removed ' + feature + ' from backlog.md');
  } else {
    console.log('Warning: ' + feature + ' not found in backlog.md (no removal)');
  }
}

// --- 5. Commit ---
try {
  execSync('git add .project-state/features/');
  execSync('git commit -m "chore: feature ' + feature + ' complete"');
  console.log('Feature ' + feature + ' moved to done.md and committed');
} catch (e) {
  console.error('Commit failed: ' + e.message);
  process.exit(1);
}

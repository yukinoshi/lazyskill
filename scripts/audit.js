#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const state = path.join(root, '.project-state');
let issues = [];

function readFile(rel) {
  const p = path.join(state, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function exists(rel) {
  return fs.existsSync(path.join(state, rel));
}

// --- 1. Required files ---
const reqFiles = [
  'overview.md', 'decisions.md',
  'features/backlog.md', 'features/current.md', 'features/done.md',
  'architecture/structure.md', 'architecture/conventions.md', 'architecture/api-contracts.md',
  'dev/setup.md', 'dev/run.md', 'dev/test-conventions.md',
  'checkpoints/resume.md',
  'knowledge/standards/frontend.md', 'knowledge/standards/testing.md',
  'knowledge/patterns/state-management.md',
  'knowledge/conventions/naming.md', 'knowledge/conventions/git-flow.md'
];
reqFiles.forEach(f => { if (!exists(f)) issues.push('缺失文件: .project-state/' + f); });

// --- 2. Required directories ---
const reqDirs = [
  'knowledge/implementation-paths', 'knowledge/patterns',
  'knowledge/conventions', 'knowledge/standards',
  'dev', 'checkpoints'
];
reqDirs.forEach(d => {
  if (!fs.existsSync(path.join(state, d))) issues.push('缺失目录: .project-state/' + d + '/');
});

// --- 3. Phase consistency ---
const overview = readFile('overview.md');
const resume = readFile('checkpoints/resume.md');
const agentsPath = path.join(root, 'AGENTS.md');
const agents = fs.existsSync(agentsPath) ? fs.readFileSync(agentsPath, 'utf8') : null;

let pOverview = null, pResume = null, pAgents = null;
if (overview) {
  // Support both "## 当前阶段\n<value>" and "当前阶段: <value>" formats
  let m = overview.match(/##\s*当前阶段\s*\n([^\n]+)/i);
  if (m) pOverview = m[1].trim();
  if (!pOverview) {
    m = overview.match(/当前阶段[::]\s*([^\n]+)/i);
    if (m) pOverview = m[1].trim();
  }
}
if (resume) {
  let m = resume.match(/阶段\*{0,2}[::]\s*([^\n]+)/i);
  if (m) pResume = m[1].trim();
}
if (agents) {
  // Support both "## Current Phase\n<value>" and "Current Phase: <value>" formats
  let m = agents.match(/##\s*Current Phase\s*\n([^\n]+)/i);
  if (m) pAgents = m[1].trim().split('—')[0].trim();
  if (!pAgents) {
    m = agents.match(/Current Phase[::]\s*([^\n]+)/i);
    if (m) pAgents = m[1].trim().split('—')[0].trim();
  }
}

if (pOverview && pResume && pOverview !== pResume) {
  issues.push('阶段不一致: overview.md=' + pOverview + ' vs resume.md=' + pResume);
}
if (pOverview && pAgents && pAgents.indexOf(pOverview) < 0) {
  issues.push('阶段不一致: overview.md=' + pOverview + ' vs AGENTS.md=' + pAgents);
}
if (!pOverview) issues.push('overview.md 缺少"当前阶段"字段');
if (!pResume) issues.push('resume.md 缺少"阶段"字段');

// --- 4. Backlog/done consistency ---
const backlog = readFile('features/backlog.md');
const done = readFile('features/done.md');
if (backlog && done) {
  const doneMatches = done.matchAll(/Feature:\s+(.+?)\s/g);
  for (const m of doneMatches) {
    const fname = m[1].trim();
    if (backlog.indexOf('Feature: ' + fname) >= 0) {
      const section = backlog.split('Feature: ' + fname)[1] || '';
      if (section.indexOf('[ ]') >= 0) {
        issues.push('backlog 不一致: ' + fname + ' 在 done.md 标记完成，但 backlog.md 仍有未完成场景');
      }
    }
  }
}

// --- 5. Resume.md required fields ---
if (resume) {
  if (resume.indexOf('循环计数') < 0) issues.push('resume.md 缺少字段: 循环计数');
  if (!/\d+\/20/.test(resume)) issues.push('resume.md 循环计数缺少 /20 阈值');
  if (resume.indexOf('Context Manifest') < 0 && resume.indexOf('context manifest') < 0) {
    issues.push('resume.md 缺少字段: Context Manifest');
  }
}

// --- 6. Branch name ---
try {
  const branch = execSync('git branch --show-current', { cwd: root }).toString().trim();
  if (branch === 'master') issues.push('分支名是 master，应为 main');
} catch (e) {
  issues.push('无法获取 git 分支名');
}

// --- 7. AGENTS.md File Map references non-existent files ---
if (agents) {
  const refs = [
    'architecture/conventions.md', 'dev/setup.md', 'dev/run.md',
    'dev/test-conventions.md', 'knowledge/implementation-paths/'
  ];
  refs.forEach(ref => {
    if (agents.indexOf(ref) >= 0) {
      if (ref.endsWith('/')) {
        if (!fs.existsSync(path.join(state, ref)))
          issues.push('AGENTS.md 引用了不存在的目录: ' + ref);
      } else {
        if (!exists(ref))
          issues.push('AGENTS.md 引用了不存在的文件: ' + ref);
      }
    }
  });
} else {
  issues.push('AGENTS.md 不存在');
}

// --- Output ---
console.log('\n=== lazyskill 审计报告 ===\n');
if (issues.length === 0) {
  console.log('OK - 审计通过，所有检查项合规\n');
  process.exit(0);
} else {
  console.log('发现 ' + issues.length + ' 个问题:\n');
  issues.forEach((issue, i) => {
    console.log('  ' + (i + 1) + '. ' + issue);
  });
  console.log('');
  process.exit(1);
}

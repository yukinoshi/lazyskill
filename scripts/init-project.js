#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Skill directory (parent of scripts/)
const skillDir = path.join(__dirname, '..');
const root = process.cwd();

// Parse: --name="闲置集市" --stack=vite-vue
const args = process.argv.slice(2);
const params = {};
args.forEach(function(arg) {
  if (arg.indexOf('--') === 0) {
    var eq = arg.indexOf('=');
    if (eq > 0) params[arg.slice(2, eq)] = arg.slice(eq + 1);
  }
});

const projectName = params.name || 'unnamed-project';
const stack = params.stack || 'vite-vue';
const templateDir = path.join(skillDir, 'templates', 'web', stack);
const sharedDir = path.join(skillDir, 'templates', '_shared');

// --- 1. Create directory structure ---
var dirs = [
  'features', 'architecture', 'dev',
  'knowledge/standards', 'knowledge/patterns',
  'knowledge/implementation-paths', 'knowledge/conventions',
  'checkpoints'
];
dirs.forEach(function(d) {
  var p = path.join(root, '.project-state', d);
  fs.mkdirSync(p, { recursive: true });
});
console.log('Directory structure created');

// --- 2. Copy knowledge files from templates ---
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  var entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach(function(entry) {
    var s = path.join(src, entry.name);
    var d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  });
}

// Copy stack-specific knowledge
var knowledgeSrc = path.join(templateDir, 'knowledge');
if (fs.existsSync(knowledgeSrc)) {
  copyDir(knowledgeSrc, path.join(root, '.project-state', 'knowledge'));
  console.log('Stack knowledge files copied');
}

// Copy shared knowledge (merge into knowledge/)
if (fs.existsSync(sharedDir)) {
  copyDir(sharedDir, path.join(root, '.project-state', 'knowledge'));
  console.log('Shared knowledge files copied');
}

// --- 3. Create initial state files ---
var stateDir = path.join(root, '.project-state');

function writeFile(rel, content) {
  fs.writeFileSync(path.join(stateDir, rel), content);
}

writeFile('overview.md', [
  '# ' + projectName,
  '',
  '## 一句话描述',
  '(待填写)',
  '',
  '## 栈',
  '- (由脚手架决定)',
  '',
  '## 目标用户',
  '(待填写)',
  '',
  '## 核心功能',
  '(待填写 - 在 ARCHITECTURE 阶段细化)',
  '',
  '## 当前阶段',
  'BOOTSTRAP'
].join('\n'));

writeFile('decisions.md', '# Decisions Log\n\n_(ARCHITECTURE 阶段开始填写)_\n');
writeFile('features/backlog.md', '# Feature Backlog\n\n_(用户审阅后填入)_\n');
writeFile('features/current.md', '# Current Feature\n\n_暂无_\n');
writeFile('features/done.md', '# Completed Features\n');
writeFile('architecture/structure.md', '# Project Structure\n\n_(ARCHITECTURE 阶段填写)_\n');
writeFile('architecture/conventions.md', '# Architecture Conventions\n\n_(ARCHITECTURE 阶段填写 - 编码规范 + 设计规范摘要)_\n');
writeFile('architecture/api-contracts.md', '# API Contracts\n\n_(ARCHITECTURE 阶段填写)_\n');

writeFile('dev/setup.md', [
  '# Setup',
  '',
  '## 安装',
  '```bash',
  'npm install',
  '```',
  '',
  '## 环境变量',
  '_(按需补充)_'
].join('\n'));

writeFile('dev/run.md', [
  '# Run Commands',
  '',
  '- dev: npm run dev',
  '- test: npm test',
  '- e2e: npm run test:e2e',
  '- lint: npm run lint',
  '- format: npm run format'
].join('\n'));

writeFile('dev/test-conventions.md', [
  '# Test Conventions',
  '',
  '- 单元测试: src/**/__tests__/*.test.ts',
  '- E2E 测试: e2e/*.spec.ts',
  '- 框架: Vitest (unit) + Playwright (E2E)',
  '- 使用 describe/it 模式',
  '- 一个场景 = 一个 describe 块'
].join('\n'));

writeFile('checkpoints/resume.md', [
  '# Resume Checkpoint',
  '',
  '## 当前状态',
  '- 阶段: BOOTSTRAP',
  '- 当前功能: none',
  '- 当前场景: none',
  '- 循环计数: 0/20',
  '',
  '## 进度',
  '- 已完成: 项目初始化',
  '- 下一步: 验证 BOOTSTRAP exit conditions',
  '',
  '## Context Manifest',
  '- (空)',
  '',
  '## Blockers',
  '- 无'
].join('\n'));

writeFile('checkpoints/blockers.md', '# Blockers\n\n_(无)_\n');

console.log('Initial state files created');

// --- 4. Create AGENTS.md from template ---
var agentsTpl = path.join(templateDir, 'agents-md.tpl');
if (fs.existsSync(agentsTpl)) {
  var tpl = fs.readFileSync(agentsTpl, 'utf8');
  tpl = tpl.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
  tpl = tpl.replace(/\{\{PHASE\}\}/g, 'BOOTSTRAP');
  fs.writeFileSync(path.join(root, 'AGENTS.md'), tpl);
  console.log('AGENTS.md created from template');
} else {
  console.log('Warning: agents-md.tpl not found, skip AGENTS.md');
}

// --- 5. Copy .gitignore from template ---
var gitignoreTpl = path.join(templateDir, 'gitignore.tpl');
if (fs.existsSync(gitignoreTpl)) {
  fs.copyFileSync(gitignoreTpl, path.join(root, '.gitignore'));
  console.log('.gitignore created from template');
}

console.log('\nDone! Project state initialized at .project-state/');
console.log('Next: run scaffold commands, then verify BOOTSTRAP exit conditions');

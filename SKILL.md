---
name: lazyskill
description: Continuous-runs development harness that creates projects from scratch and drives BDD+TDD loops to completion. Supports Vite+Vue3, Vite+React, Next.js. Manages project state in structured files, uses git commits as checkpoints, and supports seamless interruption recovery and agent handoff. Use when the user says "create a project", "continue project", "用 lazyskill", "创建项目", "继续开发", "交接项目", or wants to start, resume, or handoff a lazyskill-managed project.
---

# lazyskill — Continuous Development Harness

lazyskill 是一个可以持续运行的编程 harness。它从零创建项目，驱动 BDD+TDD 循环，管理项目状态，支持中断恢复和 agent 交接。

## Core Concepts

**Phases（阶段）**: BOOTSTRAP → ARCHITECTURE → FEATURE_DEV ↔ POLISH → DONE

**State files（状态文件）**: 项目记忆存放在 `.project-state/`，结构化知识库，agent 按需查询而非全量加载。

**Git checkpoints**: 每个 green test 触发一次 commit。git 是项目状态的唯一真相来源。

**BDD+TDD loop**: 心跳循环。取场景 → 写失败测试 (RED) → 实现 (GREEN) → 重构 (REFACTOR) → commit。

**Handoff protocol**: 任何 agent 都能接手：读 AGENTS.md → 定阶段 → 加载文件 → 验证状态 → 继续。

## Phase Model

| Phase | Goal | Exit Condition |
|-------|------|----------------|
| BOOTSTRAP | 项目骨架能跑能测 | dev starts, test passes, git initialized, .project-state/ created |
| ARCHITECTURE | 核心选型做完，结构定型 | architecture/*.md written, decisions.md 3+ entries, smoke feature passes |
| FEATURE_DEV | 按 backlog 实现功能 | backlog empty / user stops / 3 feature blockers / context budget hit |
| POLISH | 重构、优化、文档 | user adds to backlog (→ FEATURE_DEV) or says done |

BOOTSTRAP→ARCHITECTURE→FEATURE_DEV 自动推进。FEATURE_DEV↔POLISH 由 backlog 状态驱动。任何阶段→DONE 由用户决定。

详细入口/出口条件见 [reference/phase-definitions.md](reference/phase-definitions.md)。

## First Run Flow

用户说"用 lazyskill 创建一个 Vue 项目"时：

**Step 1: 问栈**。用 AskUserQuestion 问：框架（Vite+Vue3 推荐/Vite+React/Next.js）、项目类型、数据库、部署目标。

**Step 2: 脚手架**。读 `templates/<stack>/scaffold.md`，执行脚手架命令。

**Step 3: 初始化项目状态**。创建 `.project-state/` 目录。从 `templates/<stack>/knowledge/` 拷贝初始知识文件。用 `templates/<stack>/agents-md.tpl` 写初始 AGENTS.md。

**Step 4: Git init**。`git init` → 写 .gitignore → 创建 dev 分支 → initial commit。

**Step 5: 验证 BOOTSTRAP**。跑 `npm run dev` 和 `npm test`。都通过 → 进 ARCHITECTURE 阶段。

**Step 6: ARCHITECTURE 阶段**。做技术选型 → 写 decisions.md → 搭目录结构 → 配路由/状态/布局 → 写 architecture/*.md → 实现一个 smoke feature 端到端。

**Step 7: 收集第一批功能**。用 AskUserQuestion 问"前三个功能是什么"。帮用户把每个功能拆成 BDD 场景。用户审阅 → 进 backlog.md。

**Step 8: 开始循环**。进 FEATURE_DEV，开始 BDD+TDD 循环。

详细步骤见 `templates/<stack>/scaffold.md` 和 `templates/<stack>/init-checklist.md`。

## Resume / Handoff Protocol

新会话或 agent 交接时：

**Step 1**: 读 AGENTS.md → 项目名、栈、当前阶段、文件地图。

**Step 2**: 读 `handoff.md`（如有）或 `checkpoints/resume.md` → 进度、下一步、blockers。都没有 → 从 BOOTSTRAP 开始。

**Step 3**: 根据阶段加载文件：
- BOOTSTRAP → reference/phase-definitions.md
- ARCHITECTURE → architecture/*.md + decisions.md
- FEATURE_DEV → features/current.md + 按 context loading checklist 加载
- POLISH → features/done.md + architecture/structure.md

**Step 4**: 验证状态：
- `git status` — 干净 = 上次正常 commit
- `npm test` — 绿 = 代码可用

**Step 5**: 处理脏状态：
- 干净+绿 → 继续下一场景
- 脏+绿 → refactor 中断，从当前场景 RED 重新开始
- 脏+红 → `git stash`，从当前场景重新开始
- 干净+红 → `git reset HEAD~1`，重做该场景

**Step 6**: 继续 BDD+TDD 循环。

详细格式见 [reference/handoff-format.md](reference/handoff-format.md)。

## BDD+TDD Loop

每个循环：
1. **取场景** — 从 features/current.md（或从 backlog 拉下一个功能）
2. **写/完善 BDD 场景** — Given/When/Then，3-8 个断言
3. **RED** — 写失败测试
4. **GREEN** — 最小实现
5. **REFACTOR** — 清理代码
6. **COMMIT** — `git add <files>` → conventional commit
7. **UPDATE** — 更新 resume.md（进度、下一步、循环计数）
8. **CHECKPOINT** — 每 5 循环评估上下文预算
9. **REPEAT**

详细步骤和场景格式见 [reference/bdd-tdd-loop.md](reference/bdd-tdd-loop.md)。

## Context Loading Checklist

开始任何任务前，确定加载哪些知识文件：

**Step 1: 定任务类型** — 前端组件 / 后端 API / 测试 / 重构 / Bug 修复 / 架构

**Step 2: 查映射表加载必读文件**：

| Task Type | Required Files |
|-----------|---------------|
| 前端组件 | conventions/naming.md, standards/frontend.md, patterns/* |
| 后端 API | conventions/naming.md, standards/backend.md, patterns/api-layer.md, architecture/api-contracts.md |
| 测试 | standards/testing.md, dev/test-conventions.md |
| 重构 | architecture/structure.md, conventions/* |
| Bug 修复 | features/current.md, architecture/structure.md |

**Step 3: 读任务描述补充** — 涉及 auth → 加载 implementation-paths/auth-flow.md。涉及 forms → 加载 form-validation.md。

**Step 4: 记录 context manifest** — 在 resume.md 记录本次加载了哪些文件。

详细结构见 [reference/knowledge-base.md](reference/knowledge-base.md)。

## UI Design Integration

lazyskill 集成 `design-taste-frontend` skill 用于 UI 设计质量控制。

**ARCHITECTURE 阶段**：做 UI 布局/设计语言决策时，调用 `design-taste-frontend` skill 获取设计方向指导（页面类型推断、设计系统选择、排版/配色/动效规范）。

**FEATURE_DEV 阶段**：实现前端组件时，调用 `design-taste-frontend` skill 确保设计质量，避免模板化输出。

**依赖检查**：BOOTSTRAP 阶段检查 `design-taste-frontend` 是否已安装。未安装则提示用户： "检测到 design-taste-frontend 未安装，这是 UI 设计质量保障 skill，建议安装。是否安装？"

## Failure Protocol

**第一层：单场景失败 3 次** → 跳到当前功能的下一个场景。不停。

**第二层：当前功能所有场景卡住** → 标记功能 blocker，跳到 backlog 下一功能。不停。

**第三层：累积 3 个功能级 blocker** → 停，报告所有 blocker，等用户。

详细处理见 [reference/failure-protocol.md](reference/failure-protocol.md)。

## Git Checkpoint Protocol

- **When**: 每个 green test（所有测试通过）
- **Branch**: dev 分支，永远不 commit 到 main
- **Format**: Conventional Commits + 场景名
- **State files**: `.project-state/` 更新也 commit
- **Rules**: 永不 amend，永不跳 hooks，用 HEREDOC

详细协议见 [reference/git-protocol.md](reference/git-protocol.md)。

## Stop Conditions

按优先级：
1. **用户喊停** → 立即停，写 checkpoint
2. **3 个功能级 blocker** → 停，报告所有 blocker
3. **上下文预算到阈值（20 循环）** → 写 handoff.md，停，等接手
4. **backlog 空** → 进 POLISH 阶段（不停，换模式）

## Scripts

lazyskill 提供六个 Node.js 脚本，agent 必须在对应时机调用。脚本路径：`~/.qoderworkcn/skills/lazyskill/scripts/`

**init-project.js** — BOOTSTRAP 阶段创建 .project-state/ 完整结构和初始文件：
```
node ~/.qoderworkcn/skills/lazyskill/scripts/init-project.js --name="项目名" --stack=vite-vue
```

**commit.js** — 每个 TDD 循环的 commit 步骤。自动格式化 message，green 阶段自动写 resume.md + 提交状态文件，每 5 循环自动跑 audit。`--block` 参数记录失败场景到 blockers.md：
```
node ~/.qoderworkcn/skills/lazyskill/scripts/commit.js --scope=auth --scenario=login --phase=green --files=src/auth.ts,src/__tests__/auth.test.ts --cycle=5 --feature=user-auth [--block="场景描述"]
```

**feature-done.js** — 功能所有场景完成时。自动把功能从 current.md 移到 done.md，从 backlog.md 删除：
```
node ~/.qoderworkcn/skills/lazyskill/scripts/feature-done.js --name=user-auth
```

**audit.js** — 每 5 循环自动调用（commit.js 内置）。接手时也必须手动调用：
```
node ~/.qoderworkcn/skills/lazyskill/scripts/audit.js
```

**add-decision.js** — 记录技术决策到 decisions.md（ADR 格式，自增编号 + 日期）。ARCHITECTURE 阶段和每次重大技术选择时调用：
```
node ~/.qoderworkcn/skills/lazyskill/scripts/add-decision.js --title="用 MSW mock API" --context="背景" --decision="决策" --alternatives="备选方案" --consequences="后果"
```

**phase-advance.js** — 阶段切换时同步 overview.md / AGENTS.md / resume.md 三处阶段字段。调用前 agent 必须手动验证当前阶段 exit conditions：
```
node ~/.qoderworkcn/skills/lazyskill/scripts/phase-advance.js --to=ARCHITECTURE
```

## Reference Index

| File | When to Read |
|------|-------------|
| reference/phase-definitions.md | 进入或退出某个阶段 |
| reference/bdd-tdd-loop.md | 开始 FEATURE_DEV 阶段 |
| reference/handoff-format.md | 恢复或交接项目 |
| reference/knowledge-base.md | 设置或查询 .project-state/knowledge/ |
| reference/failure-protocol.md | 测试反复失败 |
| reference/git-protocol.md | 执行 git 操作 |

## Template Index

| Template | Stack |
|----------|-------|
| templates/web/vite-vue/ | Vite + Vue 3 + TS + Tailwind + Pinia + Vitest + Playwright |
| templates/web/vite-react/ | (planned) |
| templates/web/nextjs/ | (planned) |
| templates/_shared/ | 跨平台共享知识文件 |

## Quick Start

- **创建新项目**: "用 lazyskill 创建一个 Vue 项目"
- **恢复项目**: "继续 lazyskill 项目"
- **交接项目**: "交接项目"（agent 写 handoff.md）
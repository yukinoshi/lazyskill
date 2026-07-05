# Knowledge Base Structure

## Directory Layout

项目中的 .project-state/ 是结构化知识库，agent 按需查询：

    .project-state/
    ├── overview.md              # 项目目标、技术栈、当前阶段
    ├── decisions.md             # ADR 式决策日志
    ├── features/
    │   ├── backlog.md           # 排队的 BDD 场景
    │   ├── current.md           # 正在做的功能
    │   └── done.md              # 完成的功能
    ├── architecture/
    │   ├── structure.md         # 目录布局、模块边界
    │   ├── conventions.md       # 编码规范摘要
    │   └── api-contracts.md     # 模块间 API 契约
    ├── dev/
    │   ├── setup.md             # 安装、env、依赖
    │   ├── run.md               # 跑应用/测试/lint 命令
    │   └── test-conventions.md  # 测试怎么写
    ├── knowledge/
    │   ├── standards/           # 规范类
    │   │   ├── frontend.md
    │   │   ├── backend.md
    │   │   └── testing.md
    │   ├── patterns/            # 模式类
    │   │   ├── state-management.md
    │   │   ├── api-layer.md
    │   │   └── error-handling.md
    │   ├── implementation-paths/ # 实现路径类
    │   │   ├── auth-flow.md
    │   │   ├── data-fetching.md
    │   │   └── form-validation.md
    │   └── conventions/         # 约定类
    │       ├── naming.md
    │       ├── file-structure.md
    │       └── git-flow.md
    └── checkpoints/
        ├── resume.md            # 最新恢复点
        └── handoff.md           # 交接文档

## File Constraints

- 每个知识文件 < 200 行。超过 → 拆分。
- 一个文件只讲一件事。
- 文件独立可读——不依赖其他文件就能理解。
- 文件名用 kebab-case。

## Context Loading Protocol

### Step 1: 定任务类型
分六类：前端组件 / 后端 API / 测试 / 重构 / Bug 修复 / 架构

### Step 2: 查映射表

| Task Type | Required Files |
|-----------|---------------|
| 前端组件 | conventions/naming.md, standards/frontend.md, patterns/* |
| 后端 API | conventions/naming.md, standards/backend.md, patterns/api-layer.md, architecture/api-contracts.md |
| 测试 | standards/testing.md, dev/test-conventions.md |
| 重构 | architecture/structure.md, conventions/* |
| Bug 修复 | features/current.md, architecture/structure.md |
| 架构 | architecture/structure.md, decisions.md, overview.md |

### Step 3: 读任务描述，判断补充文件
看场景涉及什么：
- auth → implementation-paths/auth-flow.md
- forms → implementation-paths/form-validation.md
- data → implementation-paths/data-fetching.md
- state → patterns/state-management.md
- error → patterns/error-handling.md

### Step 4: 记录 context manifest
在 resume.md 记录本次加载了哪些文件：

    ## Context Manifest
    - conventions/naming.md
    - standards/frontend.md
    - implementation-paths/auth-flow.md

## Maintenance

- 新增知识文件时，检查映射表是否需要更新。
- 决策变更时，更新 decisions.md（不删除旧记录，改状态为"已推翻"）。
- 功能完成后，如果发现新模式，写回对应知识文件。

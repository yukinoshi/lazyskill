# lazyskill

> 从零创建项目，驱动 BDD+TDD 循环到完成的开发。

## 什么是 lazyskill

lazyskill 是一个 agent skill，设计为持续运行的开发工具（类似于harness）。它从零创建项目，自主驱动 BDD+TDD 开发循环，通过结构化状态文件管理上下文，支持任务中断、恢复和 agent 交接。

## 核心特性

- **从零创建项目**：脚手架 + 状态初始化 + git 仓库
- **BDD+TDD 循环**：场景 → RED（失败测试）→ GREEN（实现）→ REFACTOR → COMMIT
- **上下文即数据库**：`.project-state/` 知识库，按需查询而非全量加载
- **阶段模型**：BOOTSTRAP → ARCHITECTURE → FEATURE_DEV ↔ POLISH → DONE
- **Git 检查点**：每个 TDD 循环自动提交，Conventional Commits 规范
- **Agent 交接**：resume.md + handoff.md，新 agent 读取即可接手
- **ADR 决策日志**：防止偏好漂移，技术决策可追溯
- **脚本硬控制**：6 个 Node.js 脚本在最容易出错的环节强制约束

## 安装

```bash
npx skills add yukinoshi/lazyskill -g -y
```

## 快速开始

对 AI 说：

> 用 lazyskill 创建一个 Vue 项目

恢复已有项目：

> 继续 lazyskill 项目

## 项目结构

```
lazyskill/
├── SKILL.md                    # 核心流程
├── reference/                  # 参考文档（按需加载）
│   ├── phase-definitions.md    # 阶段定义 + 脚本调用时机
│   ├── bdd-tdd-loop.md         # BDD 场景格式 + TDD 循环
│   ├── handoff-format.md       # 交接/恢复协议
│   ├── knowledge-base.md       # .project-state/ 知识库协议
│   ├── failure-protocol.md     # 三层失败处理
│   └── git-protocol.md         # git 提交规则
├── scripts/                    # 6 个 Node.js 脚本
│   ├── init-project.js         # 创建 .project-state/ 完整结构
│   ├── commit.js               # 格式化提交 + checkpoint + audit
│   ├── feature-done.js         # 功能完成：current → done + backlog 清理
│   ├── audit.js                # 检查一致性
│   ├── add-decision.js         # ADR 决策日志追加
│   └── phase-advance.js        # 阶段切换 + 三处字段同步
└── templates/
    ├── _shared/                # 跨栈共享知识文件
    └── web/vite-vue/           # Vite + Vue 3 模板
```

## 6 个脚本

辅助脚本让做正确的事更容易，审计脚本捕捉问题。

| 脚本               | 作用                                                         | 调用时机                  |
| ------------------ | ------------------------------------------------------------ | ------------------------- |
| `init-project.js`  | 创建 .project-state/ 完整结构和初始文件                      | BOOTSTRAP 阶段            |
| `commit.js`        | 格式化 Conventional Commit，green 阶段自动写 resume.md，每 5 循环自动跑 audit | 每个 TDD 循环             |
| `feature-done.js`  | 功能从 current.md 移到 done.md，从 backlog.md 删除           | 功能所有场景完成时        |
| `audit.js`         | 检查文件/目录/阶段/backlog/字段一致性                        | 每 5 循环 + 交接时        |
| `add-decision.js`  | ADR 格式追加决策记录到 decisions.md                          | 技术选型 + 重大选择       |
| `phase-advance.js` | 阶段切换时同步 overview/AGENTS/resume 三处字段               | 阶段 exit conditions 满足 |

## 阶段模型

```
BOOTSTRAP → ARCHITECTURE → FEATURE_DEV ↔ POLISH → DONE
```

- **BOOTSTRAP**：脚手架 + 状态初始化 + git 仓库
- **ARCHITECTURE**：技术选型 + 目录结构 + smoke feature
- **FEATURE_DEV**：按 backlog 逐个实现功能，BDD+TDD 循环
- **POLISH**：代码质量 + 性能 + 文档
- **DONE**：交付

## .project-state/ 知识库

"上下文即数据库"——不全量加载所有文件到上下文，而是按任务类型映射所需文件，按需查询。每个文件 <200 行，一个主题。

```
.project-state/
├── overview.md                 # 项目概览 + 当前阶段
├── decisions.md                # ADR 决策日志
├── features/
│   ├── backlog.md              # 待实现功能 + BDD 场景
│   ├── current.md              # 当前功能
│   └── done.md                 # 已完成功能
├── architecture/
│   ├── structure.md            # 目录结构
│   ├── conventions.md          # 编码 + 设计规范
│   └── api-contracts.md        # API 约定
├── dev/
│   ├── setup.md                # 安装/环境
│   ├── run.md                  # 运行命令
│   └── test-conventions.md     # 测试约定
├── knowledge/
│   ├── standards/              # 编码/前端/测试标准
│   ├── conventions/            # 命名/git 流程约定
│   ├── patterns/               # 状态管理等模式
│   └── implementation-paths/   # 关键模块入口索引
└── checkpoints/
    ├── resume.md               # 恢复检查点
    └── blockers.md             # 阻塞记录
```

## BDD+TDD 循环

```
场景（Gherkin）→ RED（失败测试）→ commit --phase=red
              → GREEN（最小实现）→ commit --phase=green → audit（每 5 循环）
              → REFACTOR → commit --phase=refactor
              → 功能所有场景完成 → feature-done.js
```

## 路线图

- [x] Vite + Vue 3 模板（`web/vite-vue/`）
- [x] 6 个硬控制脚本
- [x] 完整流程验证
- [ ] Vite + React 模板（`web/vite-react/`）
- [ ] Next.js 模板（`web/nextjs/`）
- [ ] 移动端模板
- [ ] 桌面端模板
- [ ] agent 交接实测

## License

MIT

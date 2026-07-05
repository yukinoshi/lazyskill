# Phase Definitions

## BOOTSTRAP

**Goal**: 项目骨架能跑能测，git 就位，知识库初始化。

**Entry**: 用户说"创建项目"。

**Actions**:
1. 用 AskUserQuestion 问栈选择（框架、项目类型、数据库、部署）
2. 检查 design-taste-frontend skill 是否已安装。未安装则提示用户安装
3. 读 templates/<stack>/scaffold.md，执行脚手架命令
4. 装 Vitest + Playwright + Prettier
5. **调用 init-project.js 创建 .project-state/ 完整结构**：
   `node ~/.qoderworkcn/skills/lazyskill/scripts/init-project.js --name="项目名" --stack=vite-vue`
6. 用 templates/<stack>/agents-md.tpl 写 AGENTS.md（init-project.js 已处理）
7. 按 init-checklist.md 验证脚手架 + 填写 knowledge/implementation-paths/index.md
8. git init + .gitignore + initial commit + 创建 dev 分支
9. 跑 npm run dev + npm test 验证
10. 验证 exit conditions 全部满足后，**调用 phase-advance.js 切换阶段**：
    `node ~/.qoderworkcn/skills/lazyskill/scripts/phase-advance.js --to=ARCHITECTURE`

**Exit Conditions** (全部满足):
- [ ] npm run dev 成功启动
- [ ] npm test 成功运行（零测试也算）
- [ ] git 有 initial commit，dev 分支存在
- [ ] AGENTS.md 存在，包含项目名、栈、当前阶段
- [ ] .project-state/ 目录结构完整（init-project.js 保证）
- [ ] knowledge/implementation-paths/index.md 已填写
- [ ] design-taste-frontend 已安装（或用户选择跳过）

---

## ARCHITECTURE

**Goal**: 核心技术选型做完，目录结构定型，基础能力就位，smoke feature 端到端跑通。

**Entry**: BOOTSTRAP exit conditions 全部满足。

**Actions**:
1. 做技术选型决策（状态管理方案、路由结构、API 层模式、目录结构）
2. 每个决策 **调用 add-decision.js 写入 decisions.md**：
   `node ~/.qoderworkcn/skills/lazyskill/scripts/add-decision.js --title="决策标题" --context="背景" --decision="决策内容" --alternatives="备选方案" --consequences="后果"`
3. 搭目录结构
4. 配置路由、状态管理、布局
5. **调用 design-taste-frontend skill**：推断设计方向，确定配色/排版/动效规范
6. 写 architecture/structure.md
7. 写 architecture/conventions.md（编码规范 + 设计规范摘要）
8. 写 architecture/api-contracts.md
9. 写 dev/setup.md（安装、env、依赖）
10. 写 dev/run.md（跑应用/测试/lint 命令）
11. 写 dev/test-conventions.md（测试怎么写）
12. 实现 smoke feature：首页渲染 + 一个计数器组件
13. 为 smoke feature 写测试
14. **调用 commit.js 提交**：
    `node ~/.qoderworkcn/skills/lazyskill/scripts/commit.js --scope=architecture --scenario=smoke-feature --phase=green --files=<文件列表> --cycle=0 --feature=architecture`
15. 验证 exit conditions 全部满足后，**调用 phase-advance.js 切换阶段**：
    `node ~/.qoderworkcn/skills/lazyskill/scripts/phase-advance.js --to=FEATURE_DEV`

**Exit Conditions** (全部满足):
- [ ] architecture/structure.md 存在且内容完整
- [ ] architecture/conventions.md 存在（含设计规范）
- [ ] architecture/api-contracts.md 存在
- [ ] dev/setup.md, dev/run.md, dev/test-conventions.md 存在
- [ ] decisions.md 有至少 3 条决策记录（通过 add-decision.js）
- [ ] smoke feature 端到端通过（UI 渲染 + 测试绿）
- [ ] 所有代码已 commit（通过 commit.js）

---

## FEATURE_DEV

**Goal**: 按 backlog 逐个实现功能，每个功能走 BDD+TDD 循环。

**Entry**: ARCHITECTURE exit conditions 满足 + backlog.md 至少 1 个功能。

**Actions**:
1. 从 backlog.md 拉下一个功能到 features/current.md
2. 确认该功能的 BDD 场景完整（3-8 个场景）
3. 对每个场景执行 BDD+TDD 循环（见 reference/bdd-tdd-loop.md）：
   - RED: 写失败测试
   - **调用 commit.js**：`--phase=red --scope=<scope> --scenario=<name> --files=<test文件>`
   - GREEN: 最小实现
   - **调用 commit.js**：`--phase=green --scope=<scope> --scenario=<name> --files=<实现文件,测试文件> --cycle=<N> --feature=<name>`
   - REFACTOR: 清理代码
   - **调用 commit.js**：`--phase=refactor --scope=<scope> --scenario=<name> --files=<文件>`
4. 前端组件场景：实现时调用 design-taste-frontend skill 确保设计质量
5. 重大技术选择（如发现需要换方案）**调用 add-decision.js** 记录决策
6. 场景 3 次失败 → **调用 commit.js --block 记录 blocker**：
   `node ~/.qoderworkcn/skills/lazyskill/scripts/commit.js --scope=<scope> --scenario=<name> --phase=red --files=<test文件> --block="失败原因描述"`
7. 功能所有场景通过 → **调用 feature-done.js**：
   `node ~/.qoderworkcn/skills/lazyskill/scripts/feature-done.js --name=<feature-name>`

**Exit Conditions** (满足任一):
- backlog.md 为空
- 用户喊停
- 累积 3 个功能级 blocker
- 循环计数达到 20（上下文预算阈值）

**Transitions**:
- backlog 空 → 调用 `phase-advance.js --to=POLISH`
- 用户喊停 → 写 checkpoint，停
- 3 blockers → 报告，停
- 上下文预算到 → 写 handoff.md，停

---

## POLISH

**Goal**: 代码质量、性能、文档补齐。

**Entry**: backlog.md 为空 + 用户没说 done。

**Actions**:
1. **调用 audit.js 检查项目状态一致性**：
   `node ~/.qoderworkcn/skills/lazyskill/scripts/audit.js`
2. 修复 audit 发现的所有问题
3. 检查代码质量：运行 lint，修复 warning
4. 补充集成测试：为已完成功能补 E2E 测试
5. UI 审查：调用 design-taste-frontend skill 对已完成页面做设计审查
6. 性能检查：检查 bundle size
7. 写 README.md
8. **调用 phase-advance.js 同步阶段字段**：
   `node ~/.qoderworkcn/skills/lazyskill/scripts/phase-advance.js --to=POLISH`

**Exit Conditions** (满足任一):
- 用户往 backlog.md 加了新功能 → 调用 `phase-advance.js --to=FEATURE_DEV` 回 FEATURE_DEV
- 用户说 done → 调用 `phase-advance.js --to=DONE`
- 所有 polish 项完成且用户无新需求 → 调用 `phase-advance.js --to=DONE`

**Note**: POLISH 不是必须阶段。如果 backlog 空了但用户还在加功能，不会进 POLISH。

---

## DONE

**Goal**: 项目完成，交付。

**Entry**: POLISH exit conditions 满足 + 用户确认 done。

**Actions**:
1. **调用 audit.js 做最终检查**
2. 确认所有测试绿
3. 确认 git 工作区干净
4. 写交付摘要到 overview.md
5. **调用 phase-advance.js 标记完成**：
   `node ~/.qoderworkcn/skills/lazyskill/scripts/phase-advance.js --to=DONE`

**Exit Conditions**:
- [ ] audit.js 通过
- [ ] 所有测试绿
- [ ] git 工作区干净
- [ ] overview.md 有交付摘要

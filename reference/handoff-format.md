# Handoff & Resume Protocol

## handoff.md Format

```markdown
# Handoff — [ISO timestamp]

## 项目状态
- 阶段: [BOOTSTRAP|ARCHITECTURE|FEATURE_DEV|POLISH]
- 当前功能: [功能名 or "none"]
- 已完成场景: [列表 or "none"]
- 下一个场景: [场景名 or "none"]
- 循环计数: [N]/20

## 本次会话产出
- [做了什么，1-3 条]

## 本次新增决策
- [决策摘要，已写入 decisions.md 的]

## Blockers
- 无 / [blocker 描述]

## Gotchas
- [非显而易见的注意事项，2-3 条]

## 接手步骤
1. 读 AGENTS.md 确认阶段
2. 读本文件了解进度
3. 读 features/current.md（如 FEATURE_DEV）
4. git status + npm test 验证状态
5. 按 BDD+TDD 循环继续
```

## resume.md Format

```markdown
# Resume Checkpoint

## 当前状态
- 阶段: [phase]
- 当前功能: [name]
- 当前场景: [name]
- 循环计数: [N]/20

## 进度
- 已完成: [列表]
- 下一步: [具体描述]

## Context Manifest
- 本次加载的知识文件: [文件列表]

## Blockers
- 无 / [列表]
```

## Resume Protocol（新 agent 接手时的动作序列）

### Step 1: 读 AGENTS.md
获取：项目名、栈、当前阶段、文件地图。

### Step 2: 读进度文件
优先读 handoff.md（交接时写）。没有则读 checkpoints/resume.md（循环中写的）。都没有 → 全新项目，从 BOOTSTRAP 开始。

### Step 3: 按阶段加载文件
根据 AGENTS.md 的"当前阶段"：

**BOOTSTRAP**: 读 reference/phase-definitions.md 的 BOOTSTRAP 部分，检查 exit conditions。

**ARCHITECTURE**: 读 architecture/structure.md + decisions.md。不要推翻 decisions.md 里"已定"状态的决策。

**FEATURE_DEV**: 读 features/current.md + 按 context loading checklist 加载知识文件：
1. 看 current.md 的当前场景是什么类型
2. 查 SKILL.md 的映射表
3. 加载必读文件
4. 读任务描述，补充相关文件
5. 记录 context manifest

**POLISH**: 读 features/done.md + architecture/structure.md。

### Step 4: 验证状态（必做）

```bash
git status
npm test
```

git status 解读：
- "nothing to commit, working tree clean" → 干净
- 有 changes → 脏状态，中途断开

npm test 解读：
- 全绿 → 代码可用
- 有失败 → 代码损坏

### Step 5: 根据状态组合决定动作

| git status | npm test | 动作 |
|-----------|----------|------|
| 干净 | 绿 | 直接继续下一场景 |
| 干净 | 红 | git reset HEAD~1，重做该场景 |
| 脏 | 绿 | 可能 refactor 中断，从 RED 重新开始 |
| 脏 | 红 | git stash，从上个 commit 重新开始 |

### Step 6: 继续循环
确认状态干净 + 测试绿后，按 BDD+TDD 循环继续。

## 交接触发条件

agent 在以下情况写 handoff.md 并停止：
- 循环计数达到 20
- 每 5 循环评估时判断剩余上下文不足
- 用户要求交接

写 handoff.md 时：
1. 按上面的格式填写
2. 确保 .project-state/ 已 commit
3. 最后一次 commit message: chore: handoff checkpoint

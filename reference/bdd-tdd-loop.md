# BDD+TDD Loop

## BDD Scenario Format

场景用简化版 Gherkin（纯文本，不依赖 Cucumber）：

```markdown
## Feature: 用户登录

### Scenario: 有效凭据登录
- Given: 用户已注册，邮箱 user@example.com
- When: POST /api/auth/login，body: { email, password: "123456" }
- Then: 返回 200，body 含 token 字段
- And: token 解码后包含 userId

### Scenario: 错误密码
- Given: 用户已注册
- When: POST /api/auth/login，密码 "wrong"
- Then: 返回 401，body 含 error: "密码错误"
```

## Granularity Rules

- 每个场景 3-8 个断言。少于 3 → 合并相邻场景。多于 8 → 拆分。
- 每个功能 3-8 个场景。超过 8 → 拆成子功能。
- 一个场景 = 一个 test 文件或一个 describe 块。

## Scenario to Test Mapping

- API 逻辑场景 → Vitest 单元测试（src/**/__tests__/*.test.ts）
- UI 交互场景 → Playwright E2E（e2e/*.spec.ts）
- 组件行为场景 → Vitest + @vue/test-utils

## TDD Cycle

### Step 1: Pick Scenario
从 features/current.md 取下一个未完成场景 `[ ]`。如果是新功能，先从 backlog.md 拉到 current.md。

### Step 2: Write/Refine Scenario
确认 Given/When/Then 完整。如果场景是草稿，补细节（具体输入值、预期输出）。

### Step 3: RED — Write Failing Test
- 根据场景类型选测试位置（单元/E2E/组件）
- 写测试，断言对应 Then 的每一条
- 跑 npm test，确认失败（因为实现还没写）
- 如果测试不失败，说明实现已存在或测试写错了

### Step 4: GREEN — Minimum Implementation
- 写最少的代码让测试通过
- 不做额外优化，不加额外功能
- 跑 npm test，确认全绿

### Step 5: REFACTOR
- 检查代码：重复逻辑、命名、可读性
- 重构，保持测试绿
- 每次重构后跑 npm test 确认没破坏

### Step 6: COMMIT
- git add 具体文件（不用 -A）
- commit message: feat(<scope>): <scenario-name> - green
- 纯测试: test(<scope>): <scenario-name> - red
- 重构: refactor(<scope>): <scenario-name>
- 用 HEREDOC 写 message

### Step 7: UPDATE RESUME
更新 .project-state/checkpoints/resume.md:
- 当前功能名
- 已完成场景列表（打 [x]）
- 下一个场景
- 循环计数 +1
- context manifest（本次加载了哪些知识文件）

### Step 8: CHECKPOINT CHECK
如果循环计数 % 5 == 0:
- 评估是否需要交接（看剩余上下文）
- 如果需要：写 handoff.md，停
- 如果不需要：继续

### Step 9: REPEAT
回到 Step 1，取下一个场景。

## Feature Completion

当 current.md 中所有场景都 [x]:
1. 把功能从 current.md 移到 done.md
2. commit: chore: feature <name> complete
3. 从 backlog.md 拉下一个功能到 current.md
4. 继续 Step 1

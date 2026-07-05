# Failure Protocol

## Three-Tier Failure Handling

### Tier 1: Single Scenario Failure

某个场景的测试连续失败：

**Attempt 1-2**: 换思路重试：
- 重新读场景定义，确认理解正确
- 换实现方式
- 检查测试本身是否写错（断言是否正确）

**Attempt 3**:
1. 在 .project-state/checkpoints/blockers.md 记录：

       ## [timestamp] 场景: [name]
       - 功能: [feature name]
       - 失败原因: [描述]
       - 已尝试: [方法列表]
       - 状态: skipped

2. 在 current.md 把该场景标记为 [~]（blocked）
3. 跳到当前功能的下一个场景
4. 不停循环

### Tier 2: Feature-Level Blocker

当前功能的所有场景都 blocked（[~]）：

1. 在 blockers.md 更新该功能的状态为 "feature-blocked"
2. 把功能从 current.md 移回 backlog.md（标记为 blocked）
3. 从 backlog.md 拉下一个功能到 current.md
4. 不停循环

### Tier 3: Project-Level Stop

blockers.md 累积 3 个 feature-blocked：

1. 停止所有循环
2. 写 handoff.md，包含所有 blocker 详情
3. 向用户报告：
   - 3 个 blocked 功能的名称和原因
   - 已尝试的方法
   - 建议的解决方向
4. 等用户响应

## Blocker Recovery

当用户帮助解决了一个 blocker：
1. 在 blockers.md 把状态改为 "resolved"
2. 把功能从 backlog.md 移回 current.md（或重新拉到 current）
3. 把场景标记从 [~] 改回 [ ]
4. 正常继续循环

## blockers.md Format

    # Blockers

    ## [timestamp] 场景: [name]
    - 功能: [feature name]
    - 失败原因: [描述]
    - 已尝试: [方法]
    - 状态: [skipped|feature-blocked|resolved]

    ## [timestamp] 功能: [name] (feature-blocked)
    - 场景数: [N] 全部 blocked
    - 主要原因: [描述]
    - 状态: [feature-blocked|resolved]

## Environment Failures

不是测试失败而是环境问题（deps 没装、DB 连不上等）：
- 立即停，不重试
- 写到 blockers.md，标记为 "environment"
- 向用户报告，等修复

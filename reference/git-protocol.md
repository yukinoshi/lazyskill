# Git Checkpoint Protocol

## Branch Strategy

- **main**: 受保护分支，只有 POLISH 阶段结束且用户确认后才 merge dev -> main
- **dev**: 日常工作分支，所有 BDD+TDD 循环在此 commit

## Commit Triggers

| When | Type | Message Format |
|------|------|---------------|
| 写完失败测试 | RED | test(<scope>): <scenario> - red |
| 实现通过测试 | GREEN | feat(<scope>): <scenario> - green |
| 重构完成 | REFACTOR | refactor(<scope>): <scenario> |
| 功能完成 | MILESTONE | chore: feature <name> complete |
| 状态文件更新 | CHECKPOINT | chore: checkpoint - <描述> |
| 交接 | HANDOFF | chore: handoff checkpoint |
| 架构阶段产出 | ARCH | feat(<scope>): <描述> 或 chore: architecture setup |

## Commit Rules

1. 永远用 HEREDOC 写 commit message：

       git commit -m "$(cat <<'EOF'
       feat(auth): login with valid credentials - green
       EOF
       )"

2. 永不 amend。hook 失败 → 修问题 → 新 commit。

3. 永不跳 hooks。不用 --no-verify。

4. git add 具体文件，不用 git add -A：

       git add src/auth/login.ts src/auth/__tests__/login.test.ts

5. 状态文件单独 commit：

       git add .project-state/
       git commit -m "chore: checkpoint - scenario X done"

## .gitignore 必须包含

    node_modules/
    dist/
    .env
    .env.local
    .env.*.local
    coverage/
    playwright-report/
    test-results/
    *.log
    .DS_Store

## Git Status as State Validator

接手时用 git status 判断上次是否正常结束：

    git status --short

- 空输出 = 干净
- 有输出 = 脏状态，中途断开

## Dirty State Recovery

    # 方案1: stash（保留改动以防需要参考）
    git stash

    # 方案2: 丢弃改动（确定不需要时）
    git checkout -- .

    # 方案3: 回退上个 commit（代码损坏时）
    git reset HEAD~1

恢复后跑 npm test 确认绿，再继续。

## First Commit (Bootstrap)

    git init
    git add .
    git commit -m "chore: bootstrap project"
    git checkout -b dev

## Merge to Main (Polish 完成)

    git checkout main
    git merge dev
    git checkout dev  # 回到 dev 继续工作

# BDD Scenario Format Reference

## Overview

- Format: simplified Gherkin — plain text, no Cucumber dependency.
- Structure: `Feature` > `Scenario` > `Given` / `When` / `Then` / `And`.

## Feature

- One feature = one domain area.
- Feature names: domain-focused — `用户登录`, `购物车管理`. Not `login-test`.
- Each feature contains 3-8 scenarios.

```
Feature: 用户登录
```

## Scenario

- One scenario = one test file or one `describe` block.
- Scenario names: descriptive, action-focused — `有效凭据登录`. Not `测试登录`.
- Each scenario contains 3-8 assertions (Then + And lines).

```
Scenario: 有效凭据登录
  Given 用户在登录页面
  And 用户已注册 (user@example.com / Password123)
  When 用户输入邮箱 user@example.com
  And 用户输入密码 Password123
  And 用户点击登录按钮
  Then 页面显示欢迎消息
  And URL 跳转到 /dashboard
  And 导航栏显示用户头像
```

## Keywords

- **Given**: preconditions — state before the action. What must be true before the test runs.
- **When**: the action being tested. The user interaction or system event.
- **Then**: expected outcomes. One per line, each maps to a test assertion.
- **And**: additional preconditions or assertions. Chains with the preceding keyword.

## Values

- Use concrete values, not placeholders.
  - `user@example.com` — not `<email>`.
  - `Password123` — not `<password>`.
- Makes scenarios self-documenting and immediately runnable as tests.

## Backlog Management

- **Drafts**: `backlog-draft.md` — scenarios not yet reviewed.
- **Approved**: `backlog.md` — user-approved features and scenarios, ready for implementation.
- **Current WIP**: `current.md` — the feature currently being implemented.
  - Scenario checkboxes: `[ ]` todo, `[x]` done, `[~]` blocked.
- **Completed**: `done.md` — finished features, archived for reference.

### Example current.md

```markdown
# Feature: 用户登录

## Scenario: 有效凭据登录
- [x] Given 用户在登录页面
- [x] When 用户输入有效邮箱和密码
- [x] Then 页面显示欢迎消息
- [x] And URL 跳转到 /dashboard

## Scenario: 无效密码登录
- [ ] Given 用户在登录页面
- [ ] When 用户输入错误密码
- [ ] Then 页面显示错误提示
- [ ] And 登录表单保留邮箱输入

## Scenario: 账户锁定
- [~] Given 用户连续5次输入错误密码
- [~] When 用户再次尝试登录
- [~] Then 账户被锁定15分钟
- [~] And 页面显示锁定提示
```

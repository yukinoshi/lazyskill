# Project: {{PROJECT_NAME}}

## Stack
- Framework: Vite + Vue 3 + TypeScript
- Styling: Tailwind CSS
- State: Pinia
- Router: Vue Router
- Testing: Vitest (unit) + Playwright (E2E)
- Quality: ESLint + Prettier

## Current Phase
{{PHASE}} — 见 .project-state/checkpoints/resume.md

## Hard Rules
- 所有功能必须有测试（BDD 场景 → 测试）
- 永不在 main 分支直接 commit，用 dev
- commit message 用 Conventional Commits
- 不删除 decisions.md 里"已定"状态的决策

## File Map
- 概览: .project-state/overview.md
- 决策: .project-state/decisions.md
- 功能: .project-state/features/{backlog,current,done}.md
- 架构: .project-state/architecture/{structure,conventions,api-contracts}.md
- 开发指南: .project-state/dev/{setup,run,test-conventions}.md
- 知识库: .project-state/knowledge/{standards,patterns,implementation-paths,conventions}/
- 检查点: .project-state/checkpoints/{resume,handoff}.md

## Quick Commands
- dev: npm run dev
- test: npm test
- e2e: npm run test:e2e
- lint: npm run lint
- format: npm run format

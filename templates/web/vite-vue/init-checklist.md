# Post-Init Verification Checklist

init-project.js 执行后的验证清单：

## 脚手架验证

- [ ] npm run dev 启动成功，浏览器能打开
- [ ] npm test 运行成功（至少 smoke test 通过）
- [ ] Tailwind CSS 生效（页面有默认样式重置）
- [ ] Vitest 配置正确（jsdom 环境，globals: true）
- [ ] Playwright 配置正确（e2e/ 目录，baseURL 设好）
- [ ] @ alias 指向 src/
- [ ] .gitignore 包含 node_modules, dist, .env, coverage

## design-taste-frontend 依赖检查

检查 skill 是否可用：
- 在 skills 列表中查找 design-taste-frontend
- 如果未安装，向用户提示：
  "检测到 design-taste-frontend 未安装。这是 UI 设计质量保障 skill，lazyskill 在 ARCHITECTURE 和 FEATURE_DEV 阶段会调用它。是否安装？"
- 用户同意 → 从 skills.sh 安装: npx skills add leonxlnx/taste-skill@design-taste-frontend -g -y
- 用户拒绝 → 继续不加 design-taste-frontend，UI 设计质量由 agent 自行判断

## .project-state/ 验证

init-project.js 已创建目录结构和初始文件。验证：

- [ ] overview.md 存在，项目名正确
- [ ] AGENTS.md 从模板生成，{{PROJECT_NAME}} 和 {{PHASE}} 已替换
- [ ] .gitignore 已复制
- [ ] knowledge/ 下有 standards/patterns/conventions 文件
- [ ] checkpoints/resume.md 存在，阶段为 BOOTSTRAP

## 填写 implementation-paths/index.md

init-project.js 创建了 .project-state/knowledge/implementation-paths/ 目录但内容为空。
在 BOOTSTRAP 或 ARCHITECTURE 阶段早期，创建 index.md 记录关键模块入口：

    # Implementation Paths

    ## 入口
    - 应用入口: src/main.ts
    - 路由: src/router/index.ts
    - Pinia: src/stores/index.ts

    ## API 层
    - Axios 实例: src/services/api.ts
    - Mock handlers: src/mocks/handlers/

    ## 测试
    - 单元测试: src/__tests__/
    - E2E: e2e/

    ## 配置
    - Vite: vite.config.ts
    - Tailwind: src/assets/main.css (@import "tailwindcss")
    - Vitest: vite.config.ts (test 字段)

随着项目演进，持续更新此文件——新 agent 接手时先读它快速定位。

## Git 初始化

    git init
    git add .
    git commit -m "chore: bootstrap project"
    git checkout -b dev

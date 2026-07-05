# Vite + Vue 3 Scaffold

## Stack
- Vite + Vue 3 + TypeScript
- Tailwind CSS
- Pinia (state)
- Vue Router
- Vitest (unit)
- Playwright (E2E)
- ESLint + Prettier

## Commands

    # 1. 创建项目
    npm create vite@latest <project-name> -- --template vue-ts

    # 2. 进入目录
    cd <project-name>

    # 3. 安装核心依赖
    npm install

    # 4. 安装 Tailwind CSS
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

    # 5. 安装 Pinia + Vue Router
    npm install pinia vue-router

    # 6. 安装测试工具
    npm install -D vitest @vue/test-utils jsdom @playwright/test
    npx playwright install

    # 7. 安装代码质量工具
    npm install -D prettier eslint-config-prettier

## Tailwind Config (tailwind.config.js)

    /** @type {import('tailwindcss').Config} */
    export default {
      content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
      theme: { extend: {} },
      plugins: [],
    };

## Tailwind CSS (src/style.css)

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

## Vitest Config (vitest.config.ts)

    import { defineConfig } from "vitest/config";
    import vue from "@vitejs/plugin-vue";
    import { fileURLToPath } from "url";

    export default defineConfig({
      plugins: [vue()],
      test: {
        environment: "jsdom",
        globals: true,
      },
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
      },
    });

## Playwright Config (playwright.config.ts)

    import { defineConfig } from "@playwright/test";

    export default defineConfig({
      testDir: "./e2e",
      fullyParallel: true,
      use: {
        baseURL: "http://localhost:5173",
      },
      webServer: {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
      },
    });

## package.json scripts

确保 package.json 有：

    {
      "scripts": {
        "dev": "vite",
        "build": "vue-tsc && vite build",
        "test": "vitest run",
        "test:watch": "vitest",
        "test:e2e": "playwright test",
        "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx",
        "format": "prettier --write ."
      }
    }

## Smoke Test (src/__tests__/smoke.test.ts)

    import { describe, it, expect } from "vitest";

    describe("smoke test", () => {
      it("runs vitest", () => {
        expect(true).toBe(true);
      });
    });

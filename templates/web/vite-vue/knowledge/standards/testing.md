# Testing Standards (Vitest + Playwright)

## Test Organization

- Unit/component tests: `src/**/__tests__/*.test.ts` — co-located with source files.
- E2E tests: `e2e/*.spec.ts` — top-level directory.
- One `describe` block per scenario.
- Each test must be independent. No test order dependency.
- Test names in English, descriptive: `"returns user data when API call succeeds"`.

## Frameworks

- **Vitest** for unit and component testing.
- **Playwright** for E2E testing.
- Use `@vue/test-utils` `mount()` for component testing.

## Structure

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserProfile from '../UserProfile.vue'

describe('UserProfile', () => {
  beforeEach(() => {
    // setup
  })

  afterEach(() => {
    // cleanup
    vi.restoreAllMocks()
  })

  it('displays user name when loaded', () => {
    // arrange, act, assert
  })
})
```

## Mocking

- Use `vi.fn()` for function mocks.
- Use `vi.mock()` for module mocks.
- Mock external dependencies (API calls, third-party modules). Do not mock internal application modules.
- Place mock factories in `__mocks__/` when shared across tests.

## Assertions

- Use `expect().toBe()` for primitives.
- Use `expect().toEqual()` for deep equality.
- Use `expect().toBeTruthy()` / `toBeFalsy()` for boolean checks.
- Use `expect().toHaveBeenCalledTimes(n)` for mock call verification.
- Use `expect().toHaveBeenCalledWith(...)` for argument verification.

## Async

- Use `async`/`await` — never `.then()` chains.
- Mark test functions as `async` when testing async code.
- Use `waitFor` or `flushPromises` when testing async component updates.

## Playwright (E2E)

- Use `page.goto()` for navigation.
- Use `page.locator()` with auto-waiting — avoid manual `waitForSelector`.
- One spec file per user flow.
- Use `test.describe` for grouping.

```ts
import { test, expect } from '@playwright/test'

test.describe('User Login', () => {
  test('logs in with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.locator('[data-testid="email"]').fill('user@example.com')
    await page.locator('[data-testid="password"]').fill('password123')
    await page.locator('[data-testid="submit"]').click()
    await expect(page.locator('[data-testid="welcome"]')).toBeVisible()
  })
})
```

## Coverage

- Target: 80% coverage for critical paths.
- Focus on business logic and user-facing flows.
- Do not write tests for trivial getters/setters or type-only code.

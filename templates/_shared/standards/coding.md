# General Coding Standards (Platform-Agnostic)

## TypeScript

- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`).
- No `any` types. Use `unknown` and narrow with type guards.

```ts
// Bad
function process(data: any) { ... }

// Good
function process(data: unknown) {
  if (typeof data === 'string') { ... }
}
```

- Prefer `interface` over `type` for object shapes.
- Use `enum` for fixed sets of values.

```ts
enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}
```

## Functions

- Pure when possible. No hidden side effects.
- Single responsibility — one function does one thing.
- Max function length: 30 lines. Extract into helper functions if longer.
- Max file length: 200 lines. Split into modules if longer.

## Control Flow

- Early return pattern: guard clauses at the top of functions.

```ts
// Good
function getUser(id: string) {
  if (!id) return null
  if (!isValidId(id)) return null

  return fetchUser(id)
}

// Bad
function getUser(id: string) {
  if (id) {
    if (isValidId(id)) {
      return fetchUser(id)
    }
  }
  return null
}
```

- No nested ternary operators. Use `if/else` or extract to a function.
- Use optional chaining (`?.`) and nullish coalescing (`??`).

## Error Handling

- `try/catch` at the service layer.
- Throw typed errors — create custom error classes.

```ts
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}
```

## Logging

- `console.error` for errors.
- `console.warn` for warnings.
- No `console.log` in production code. Use a logger utility if structured logging is needed.

## Comments

- Explain WHY, not WHAT. The code already says what it does.
- Remove all commented-out code before committing.

## Constants

- No magic numbers. Extract to named constants.

```ts
// Bad
if (retries > 3) { ... }

// Good
const MAX_RETRY = 3
if (retries > MAX_RETRY) { ... }
```

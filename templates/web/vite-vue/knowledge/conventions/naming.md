# Naming Conventions

## Files

- Non-component files: `kebab-case` — `user-service.ts`, `auth-utils.ts`.
- Component files: `PascalCase` — `UserProfile.vue`, `LoginForm.vue`.

## Directories

- `kebab-case` — `user-profile/`, `auth/`, `order-management/`.

## Components

- `PascalCase` — `UserProfile`, `LoginForm`, `ProductCard`.
- Multi-word names required (except root `App`): `UserCard` not `Card`.

## Composables

- `camelCase` with `use` prefix — `useAuth`, `useCounter`, `useFetchData`.

## Stores

- `camelCase` with `Store` suffix or `use` prefix — `useAuthStore`, `useUserStore`.

## Functions

- `camelCase` — `getUserData`, `formatDateString`, `parseJwtToken`.

## Variables

- `camelCase` — `userData`, `isLoading`, `retryCount`.

## Constants

- `UPPER_SNAKE_CASE` — `MAX_RETRY`, `API_BASE_URL`, `DEFAULT_TIMEOUT`.

## Types and Interfaces

- `PascalCase` — `UserProfile`, `LoginResponse`, `ApiResponse`.
- Prefix interfaces only when needed for disambiguation (e.g., `IUser` is not required).

## Enums

- `PascalCase` for enum name, `PascalCase` for members — `HttpStatus.Ok`, `LogLevel.Error`.

```ts
enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  InternalServerError = 500,
}
```

## CSS Classes

- `kebab-case` — `user-card`, `nav-sidebar`.
- Prefer Tailwind utility classes over custom class names.
- Custom class names only when composing complex reusable styles.

## Test Files

- Unit tests: `*.test.ts` — `user-service.test.ts`.
- E2E tests: `*.spec.ts` — `login-flow.spec.ts`.

## Route Names

- `kebab-case` — `user-profile`, `auth-login`, `order-detail`.

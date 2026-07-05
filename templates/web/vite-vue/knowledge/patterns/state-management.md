# Pinia State Management Patterns

## Store Location

- Define stores in `src/stores/` directory.
- One store per domain: `auth.ts`, `user.ts`, `cart.ts`, `app-config.ts`.

## Setup Store Syntax (Function-Based)

- Always use setup store syntax. Do not use option-based stores.

```ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // state
  const token = ref<string | null>(null)
  const user = ref<UserProfile | null>(null)

  // getters (computed)
  const isLoggedIn = computed(() => !!token.value)

  // actions (async functions)
  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    token.value = response.token
    user.value = response.user
  }

  const logout = () => {
    token.value = null
    user.value = null
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
  }
})
```

## Principles

- Keep stores small and focused. One store per domain.
- Do not put UI state in stores (loading spinners, modal visibility, etc.). Use local refs in components.
- Use stores for: auth, user data, cart, app configuration.
- Use composables for: form handling, animation, local UI logic.
- Getters are `computed()` — never access state directly from outside the store and compute in components.
- Actions are async functions — all state mutations go through actions.
- Do not mutate state directly outside the store. Always use actions.

## Persistence

- Do not persist sensitive data directly in the store.
- Use a composable (e.g., `useSessionStorage`) to handle persistence externally.
- Example pattern:

```ts
// In the store setup, sync to sessionStorage
const token = ref<string | null>(sessionStorage.getItem('token'))

watch(token, (newVal) => {
  if (newVal) sessionStorage.setItem('token', newVal)
  else sessionStorage.removeItem('token')
})
```

## Reset

- Reset store on logout using `$reset()` or manually clearing refs:

```ts
const logout = () => {
  token.value = null
  user.value = null
}
```

- With setup stores, `$reset()` is available via Pinia plugins if configured. Otherwise, implement a manual `reset()` action.

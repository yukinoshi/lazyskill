# Frontend Coding Standards (Vue 3 + TypeScript)

## Component Structure

- Use `<script setup lang="ts">` for all components.
- Use Composition API only. Options API is not permitted.
- One component per file.
- Component files use PascalCase naming: `UserProfile.vue`, `LoginForm.vue`.
- Keep files under 200 lines. Split into sub-components or composables if longer.

## Props and Emits

- Use `defineProps` and `defineEmits` with TypeScript interfaces — never use runtime declaration.
- Props must be validated with TypeScript interfaces.
- Example:

```ts
interface Props {
  userId: string
  isLoading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit', value: string): void
  (e: 'cancel'): void
}>()
```

- Use `defineExpose()` to explicitly expose methods or state that parents need to access.

## Styling

- Use Tailwind CSS for all styling.
- Avoid scoped CSS unless Tailwind cannot express the requirement (e.g., third-party component overrides).
- No inline styles unless dynamically computed.

## State and Reactivity

- Use `ref()` for primitives and most cases.
- Use `reactive()` for object-heavy state where destructuring is not needed.
- Prefer `ref` for most cases — it works universally and avoids reactivity pitfalls.
- Use `watchEffect` for automatic dependency tracking when you want side effects to run on any dependency change.
- Use `watch()` when you need explicit control over which sources to watch, or access to old values.
- Use `computed()` for all derived state.

## Templates

- Keep template expressions simple. Move complex logic to `computed` properties.
- Use `v-show` for frequent toggling (element stays in DOM).
- Use `v-if` for rare conditionals (element is added/removed from DOM).
- Always use `:key` with `v-for`. Keys must be unique and stable — never use array index as key when items can reorder.

## Composables

- Place reusable logic in `src/composables/`.
- Name with `use` prefix: `useAuth.ts`, `useCounter.ts`.
- Composables return refs or reactive objects, never plain values.

## File Organization

```
src/
  components/       # Reusable UI components
  composables/      # use* composables
  views/            # Route-level components (pages)
  stores/           # Pinia stores
  services/         # API and external service calls
  types/            # Shared TypeScript types
  utils/            # Pure utility functions
```

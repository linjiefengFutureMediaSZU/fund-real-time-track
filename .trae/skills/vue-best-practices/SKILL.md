---
name: vue-best-practices
description: Provides Vue 3 + TypeScript best practices for Volar, Composition API, and performance. Invoke when writing Vue components, refactoring Vue code, or setting up a Vue project.
metadata:
  author: antfu (adapted)
  version: 1.0.0
  source: hyf0/vue-skills
---

# Vue Best Practices

This skill provides best practices for modern Vue 3 development with TypeScript, focusing on the Composition API and Volar compatibility.

## Core Principles

1.  **Script Setup**: Always use `<script setup lang="ts">`.
2.  **Composition API**: Prefer Composition API over Options API for better type inference and code organization.
3.  **Type Safety**: Fully type props, emits, and provided/injected values.

## Component Structure

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'
import type { User } from '@/types'

// 2. Props & Emits
// Use generic type arguments for better Type inference
const props = defineProps<{
  user: User
  active?: boolean
}>()

const emits = defineEmits<{
  change: [id: string]
  update: [user: User]
}>()

// 3. State
const count = ref(0)

// 4. Computed & Logic
const double = computed(() => count.value * 2)

// 5. Lifecycle
// ...
</script>

<template>
  <div>{{ double }}</div>
</template>
```

## Best Practices

### Reactivity
- Use `ref` for primitives and single objects when possible (more explicit `.value` access).
- Use `reactive` for grouped state if preferred, but be aware of destructuring losing reactivity (use `toRefs`).
- **Destructuring Props**: In Vue 3.3+, use strict destructuring or `toRefs(props)` to maintain reactivity.

### TypeScript Integration
- **Props**: Use `defineProps<Interface>()`.
- **Emits**: Use `defineEmits<{ (e: 'name', payload: Type): void }>()` or the tuple syntax `defineEmits<{ name: [payload: Type] }>()`.
- **Refs**: Explicitly type refs when inference is insufficient: `const el = ref<HTMLDivElement | null>(null)`.

### Performance
- **v-show vs v-if**: Use `v-show` for frequent toggles, `v-if` for conditional rendering that rarely changes.
- **Key Attribute**: Always use unique keys in `v-for`.
- **Shallow Refs**: Use `shallowRef` for large objects that don't need deep reactivity (e.g., charts, large data lists).

### Volar Optimization
- Ensure `tsconfig.json` includes `"vueCompilerOptions": { "target": 3.3 }`.
- Use `defineOptions` for component name and other non-prop options.

## Common Pitfalls to Avoid
- **Mutating Props**: Never mutate props directly. Emit an event instead.
- **Async Setup**: Top-level await in `<script setup>` requires `<Suspense>` in the parent.
- **Reactivity Loss**: accidental destructuring of `reactive()` objects without `toRefs()`.

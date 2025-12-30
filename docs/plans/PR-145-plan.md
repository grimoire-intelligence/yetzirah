# PR-145: Progress Vue/Svelte/Angular Wrappers

## Overview
Create framework wrappers for the ytz-progress web component across Vue, Svelte, and Angular packages.

## Core Component API Reference
The `ytz-progress` component provides:
- **Attributes**: `value` (0-100 or null), `linear`, `size`, `label`
- **Properties**: `value`, `linear`, `indeterminate` (read-only), `size`
- **No events** - purely presentational component
- **Modes**: Circular (default) or Linear; Determinate (with value) or Indeterminate (no value)
- **Sizes**: 'small', 'medium', 'large'

## Implementation Tasks

### 1. Vue Wrapper (`packages/vue/src/Progress.vue`)
```vue
<template>
  <ytz-progress
    :value="value ?? undefined"
    :linear="linear || undefined"
    :size="size"
    :label="label"
    :class="$attrs.class"
    v-bind="$attrs"
  />
</template>
```

**Props**:
- `value` (number | null) - progress value 0-100, null for indeterminate
- `linear` (boolean) - linear bar vs circular spinner
- `size` ('small' | 'medium' | 'large') - size variant
- `label` (string) - accessible label

**Computed**:
- `indeterminate` - expose read-only computed based on value

### 2. Svelte Wrapper (`packages/svelte/src/Progress.svelte`)
```svelte
<script lang="ts">
  export let value: number | null = null
  export let linear = false
  export let size: 'small' | 'medium' | 'large' = 'medium'
  export let label: string | undefined = undefined

  $: indeterminate = value === null
</script>

<ytz-progress
  bind:this={element}
  value={value ?? undefined}
  linear={linear || undefined}
  {size}
  {label}
  {...$$restProps}
/>
```

**Props**:
- `value` - progress value or null for indeterminate
- `linear` - linear bar mode
- `size` - size variant
- `label` - accessible label

**Reactive**:
- `indeterminate` - derived from value

### 3. Angular Wrapper (`packages/angular/src/lib/progress.component.ts`)
```typescript
@Component({
  selector: 'g-progress',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-progress #progressElement>
    </ytz-progress>
  `
})
export class ProgressComponent implements AfterViewInit, OnChanges
```

**Inputs**:
- `value` (number | null) - progress value
- `linear` (boolean) - linear mode
- `size` (string) - size variant
- `label` (string) - accessible label

**Getters**:
- `indeterminate` - returns `value === null`

## Files to Create/Modify

### Create:
1. `packages/vue/src/Progress.vue`
2. `packages/svelte/src/Progress.svelte`
3. `packages/angular/src/lib/progress.component.ts`

### Modify:
1. `packages/vue/src/index.ts` - add `export { default as Progress } from './Progress.vue'`
2. `packages/svelte/src/index.ts` - add `export { default as Progress } from './Progress.svelte'`
3. `packages/angular/src/public-api.ts` - add `export { ProgressComponent } from './lib/progress.component'`

## Testing Approach
- Verify indeterminate mode when value is null/undefined
- Test determinate mode with value 0-100
- Test linear vs circular rendering
- Test size variants apply correctly
- Test label attribute passes through for accessibility
- Verify value clamping (values outside 0-100)

## Acceptance Criteria
- [ ] Vue wrapper with null-safe value handling
- [ ] Svelte wrapper with reactive indeterminate computed
- [ ] Angular wrapper with OnChanges for attribute sync
- [ ] All packages export the new component
- [ ] TypeScript types for size and value props
- [ ] Proper handling of indeterminate state

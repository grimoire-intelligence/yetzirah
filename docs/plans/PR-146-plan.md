# PR-146: Badge Vue/Svelte/Angular Wrappers

## Overview
Create framework wrappers for the ytz-badge web component across Vue, Svelte, and Angular packages.

## Core Component API Reference
The `ytz-badge` component provides:
- **Attributes**: `value`, `max`, `position`, `hidden`
- **Properties**: `value` (string | number | null), `max`, `position`
- **Positions**: 'top-right' (default), 'top-left', 'bottom-right', 'bottom-left'
- **Modes**: Dot (no value), Count (with value), Hidden (value=0 or hidden attr)

## Implementation Tasks

### 1. Vue Wrapper (`packages/vue/src/Badge.vue`)
```vue
<template>
  <ytz-badge
    :value="value ?? undefined"
    :max="max"
    :position="position"
    :hidden="isHidden || undefined"
    :class="$attrs.class"
    v-bind="$attrs"
  >
    <slot />
  </ytz-badge>
</template>
```

**Props**:
- `value` (string | number | null) - badge value, null for dot mode
- `max` (number) - maximum displayed value (shows "max+" when exceeded)
- `position` ('top-right' | 'top-left' | 'bottom-right' | 'bottom-left')
- `hidden` (boolean) - force hide the badge

**Slot**: Default slot for badge target content (e.g., button, icon)

### 2. Svelte Wrapper (`packages/svelte/src/Badge.svelte`)
```svelte
<script lang="ts">
  export let value: string | number | null = null
  export let max: number | undefined = undefined
  export let position: BadgePosition = 'top-right'
  export let hidden = false

  $: mode = value === null ? 'dot' : value === '0' || value === 0 ? 'hidden' : 'count'
</script>

<ytz-badge
  bind:this={element}
  value={value ?? undefined}
  {max}
  {position}
  hidden={hidden || undefined}
  {...$$restProps}
>
  <slot />
</ytz-badge>
```

**Props**:
- `value` - badge value
- `max` - max cap value
- `position` - badge position
- `hidden` - visibility override

**Reactive**:
- `mode` - derived from value ('dot' | 'count' | 'hidden')

### 3. Angular Wrapper (`packages/angular/src/lib/badge.component.ts`)
```typescript
@Component({
  selector: 'g-badge',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-badge #badgeElement>
      <ng-content></ng-content>
    </ytz-badge>
  `
})
export class BadgeComponent implements AfterViewInit, OnChanges
```

**Inputs**:
- `value` (string | number | null)
- `max` (number)
- `position` (string)
- `hidden` (boolean)

**Getters**:
- `isDot` - returns true when value is null
- `displayValue` - computed display string with max+ logic

## Files to Create/Modify

### Create:
1. `packages/vue/src/Badge.vue`
2. `packages/svelte/src/Badge.svelte`
3. `packages/angular/src/lib/badge.component.ts`

### Modify:
1. `packages/vue/src/index.ts` - add `export { default as Badge } from './Badge.vue'`
2. `packages/svelte/src/index.ts` - add `export { default as Badge } from './Badge.svelte'`
3. `packages/angular/src/public-api.ts` - add `export { BadgeComponent } from './lib/badge.component'`

## Testing Approach
- Test dot mode when value is null/undefined
- Test count mode with numeric and string values
- Test hidden mode when value is "0" or 0
- Test max prop shows "max+" when value exceeds max
- Test all position variants
- Test hidden attribute override
- Verify slotted content renders correctly

## Acceptance Criteria
- [ ] Vue wrapper with proper null handling for dot mode
- [ ] Svelte wrapper with reactive mode computation
- [ ] Angular wrapper with OnChanges for attribute sync
- [ ] All packages export the new component
- [ ] TypeScript types for position prop
- [ ] Proper max+ display logic
- [ ] Slotted content support in all frameworks

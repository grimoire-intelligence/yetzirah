# PR-144: Snackbar Vue/Svelte/Angular Wrappers

## Overview
Create framework wrappers for the ytz-snackbar web component across Vue, Svelte, and Angular packages.

## Core Component API Reference
The `ytz-snackbar` component provides:
- **Attributes**: `open`, `duration`, `position`, `dismissible`, `max-visible`
- **Methods**: `show(message?)`, `dismiss()`
- **Events**: `dismiss` (with `detail.reason`: 'timeout' | 'manual')
- **Positions**: 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'

## Implementation Tasks

### 1. Vue Wrapper (`packages/vue/src/Snackbar.vue`)
```vue
<template>
  <ytz-snackbar
    :open="open || undefined"
    :duration="duration"
    :position="position"
    :dismissible="dismissible || undefined"
    :max-visible="maxVisible"
    @dismiss="handleDismiss"
    v-bind="$attrs"
  >
    <slot />
  </ytz-snackbar>
</template>
```

**Props**:
- `open` (boolean, v-model:open) - two-way binding for visibility
- `duration` (number, default: 5000) - auto-dismiss duration in ms
- `position` (string, default: 'bottom-center') - placement position
- `dismissible` (boolean) - show close button
- `maxVisible` (number, default: 3) - max stacked snackbars

**Events**:
- `update:open` - for v-model support
- `dismiss` - native dismiss event

**Template ref methods**:
- `show(message?)` - programmatic show
- `dismiss()` - programmatic dismiss

### 2. Svelte Wrapper (`packages/svelte/src/Snackbar.svelte`)
```svelte
<script lang="ts">
  export let open = false
  export let duration = 5000
  export let position: SnackbarPosition = 'bottom-center'
  export let dismissible = false
  export let maxVisible = 3
</script>

<ytz-snackbar
  bind:this={element}
  {position}
  {duration}
  {maxVisible}
  on:dismiss
>
  <slot />
</ytz-snackbar>
```

**Props** (all with bind: support):
- `open` - visibility state
- `duration` - auto-dismiss duration
- `position` - placement position
- `dismissible` - show close button
- `maxVisible` - max stacked snackbars

**Exported methods**:
- `show(message?)` - calls element.show()
- `dismiss()` - calls element.dismiss()

### 3. Angular Wrapper (`packages/angular/src/lib/snackbar.component.ts`)
```typescript
@Component({
  selector: 'g-snackbar',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-snackbar #snackbarElement (dismiss)="onDismiss($event)">
      <ng-content></ng-content>
    </ytz-snackbar>
  `
})
export class SnackbarComponent implements AfterViewInit
```

**Inputs**:
- `open` (boolean) - with two-way binding via `openChange`
- `duration` (number)
- `position` (string)
- `dismissible` (boolean)
- `maxVisible` (number)

**Outputs**:
- `openChange` - for [(open)] support
- `dismiss` - EventEmitter<CustomEvent>

**Public methods**:
- `show(message?: string)` - programmatic show
- `dismiss()` - programmatic dismiss

## Files to Create/Modify

### Create:
1. `packages/vue/src/Snackbar.vue`
2. `packages/svelte/src/Snackbar.svelte`
3. `packages/angular/src/lib/snackbar.component.ts`

### Modify:
1. `packages/vue/src/index.ts` - add `export { default as Snackbar } from './Snackbar.vue'`
2. `packages/svelte/src/index.ts` - add `export { default as Snackbar } from './Snackbar.svelte'`
3. `packages/angular/src/public-api.ts` - add `export { SnackbarComponent } from './lib/snackbar.component'`

## Testing Approach
- Verify two-way binding for `open` state in each framework
- Test programmatic show/dismiss methods
- Verify dismiss event with correct reason ('timeout' vs 'manual')
- Test position and duration props pass through correctly
- Test dismissible prop adds close button
- Test maxVisible queue enforcement

## Acceptance Criteria
- [ ] Vue wrapper with v-model:open support and expose methods
- [ ] Svelte wrapper with bind:open and exported show/dismiss
- [ ] Angular wrapper with [(open)] and public methods
- [ ] All packages export the new component
- [ ] TypeScript types for position and props

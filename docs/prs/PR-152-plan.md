# PR-152: x-ytz Directive Implementation

## Overview
Enhance and complete the x-ytz directive system for Alpine.js integration. The base plugin was created in PR-151; this PR focuses on completing the directive implementations with proper modifier support, validation, and edge case handling.

## Current State (from PR-151)
The following directives exist but need enhancement:
- `x-ytz-dialog` - Dialog open state binding
- `x-ytz-drawer` - Drawer open state binding
- `x-ytz-tabs` - Tab value binding
- `x-ytz-toggle` - Toggle checked state binding
- `x-ytz-slider` - Slider value binding
- `x-ytz-select` - Select value binding
- `x-ytz-disclosure` - Disclosure open state binding

## Enhancements Needed

### 1. Add Missing Component Directives
```typescript
// Accordion item state
Alpine.directive('ytz-accordion-item', ...)

// Popover state
Alpine.directive('ytz-popover', ...)

// Autocomplete value/selection
Alpine.directive('ytz-autocomplete', ...)

// Listbox value/selection
Alpine.directive('ytz-listbox', ...)

// Menu open state
Alpine.directive('ytz-menu', ...)

// Progress value
Alpine.directive('ytz-progress', ...)

// Snackbar open state
Alpine.directive('ytz-snackbar', ...)
```

### 2. Add Modifier Support
Enable directive modifiers for common patterns:
```html
<!-- .once - only sync once on init -->
<ytz-dialog x-ytz-dialog.once="initialOpen">

<!-- .lazy - debounced sync for performance -->
<ytz-slider x-ytz-slider.lazy="volume">

<!-- .number - ensure numeric value -->
<ytz-slider x-ytz-slider.number="count">
```

### 3. Improve Event Handling
- Add proper event detail extraction
- Handle bubbling/capturing correctly
- Add error boundaries for expression evaluation

### 4. Add Initialization Hooks
```typescript
// Allow components to run init logic
Alpine.directive('ytz-init', (el, { expression }, { evaluate }) => {
  // Run expression when component is ready
  el.addEventListener('ytz:ready', () => evaluate(expression), { once: true })
})
```

## Implementation

### File: `packages/alpine/src/directives.ts`
```typescript
import type { Alpine } from 'alpinejs'

export function registerDirectives(Alpine: Alpine, prefix: string) {
  // Dialog directive with enhanced features
  Alpine.directive(`${prefix}-dialog`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      // One-time sync
      const isOpen = evaluate(expression)
      if (isOpen) el.setAttribute('open', '')
    } else {
      // Reactive sync
      effect(() => {
        const isOpen = evaluate(expression)
        if (isOpen) {
          el.setAttribute('open', '')
        } else {
          el.removeAttribute('open')
        }
      })
    }

    // Close event handler
    const handleClose = () => {
      Alpine.evaluate(el, `${expression} = false`)
    }
    el.addEventListener('close', handleClose)
    cleanup(() => el.removeEventListener('close', handleClose))
  })

  // ... additional directives
}
```

### File: `packages/alpine/src/index.ts` (updated)
```typescript
import { registerDirectives } from './directives'
import { registerMagics } from './magics'

export function yetzirahPlugin(Alpine, options = {}) {
  const prefix = options.prefix ?? 'ytz'

  registerDirectives(Alpine, prefix)
  registerMagics(Alpine, prefix)
}
```

## New Directives to Add

| Directive | Component | Syncs | Events |
|-----------|-----------|-------|--------|
| x-ytz-accordion-item | ytz-accordion-item | open | toggle |
| x-ytz-popover | ytz-popover | open | toggle |
| x-ytz-autocomplete | ytz-autocomplete | value | input, select |
| x-ytz-listbox | ytz-listbox | value | change |
| x-ytz-menu | ytz-menu | open | close |
| x-ytz-progress | ytz-progress | value | - |
| x-ytz-snackbar | ytz-snackbar | open | close |
| x-ytz-chip | ytz-chip | - | remove |
| x-ytz-badge | ytz-badge | count | - |

## Tasks

1. **Refactor directives into separate module**
   - Create `src/directives.ts`
   - Move existing directives from index.ts
   - Add cleanup utility pattern

2. **Add missing directives** (9 new)
   - accordion-item, popover, autocomplete
   - listbox, menu, progress
   - snackbar, chip, badge

3. **Add modifier support**
   - Parse modifiers from directive
   - Implement .once, .lazy, .number

4. **Add x-ytz-init directive**
   - Component ready hook

5. **Update type declarations**
   - Export directive types
   - Document modifiers

6. **Update tests**
   - Test each directive
   - Test modifier behavior

## Dependencies
- PR-151 (completed): Alpine.js Plugin Package Setup

## Acceptance Criteria
- [ ] All component directives implemented (16 total)
- [ ] Modifier support (.once, .lazy, .number)
- [ ] x-ytz-init hook directive
- [ ] Proper cleanup on element removal
- [ ] TypeScript types updated
- [ ] Package builds without errors

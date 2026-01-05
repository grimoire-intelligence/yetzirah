# PR-153: x-ytz:model Two-way Binding

## Overview
Implement `x-ytz:model` directive for two-way data binding between Alpine.js data and Yetzirah component values. This is similar to Vue's `v-model` - it syncs Alpine state to component attributes AND listens to component events to update Alpine state.

## Current State
PR-152 added component-specific directives like `x-ytz-slider`, `x-ytz-select`, etc. These work but require knowing which directive to use for each component.

`x-ytz:model` provides a unified two-way binding that auto-detects the component type.

## Implementation

### File: `packages/alpine/src/model.ts`
```typescript
export function registerModelDirective(Alpine: AlpineInstance, prefix: string): void {
  Alpine.directive(`${prefix}:model`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const tagName = el.tagName.toLowerCase()

    // Determine binding strategy based on component type
    const config = getComponentConfig(tagName)
    if (!config) return

    const isLazy = modifiers.includes('lazy')
    const isNumber = modifiers.includes('number')
    const isTrim = modifiers.includes('trim')

    // Sync Alpine data → component attribute
    effect(() => {
      let value = evaluate(expression)
      if (value !== undefined) {
        el.setAttribute(config.attr, String(value))
      }
    })

    // Sync component events → Alpine data
    const updateValue = (e: Event) => {
      let value = (e as CustomEvent).detail?.[config.detailKey] ?? ''
      if (isNumber) value = Number(value)
      if (isTrim && typeof value === 'string') value = value.trim()
      Alpine.evaluate(el, `${expression} = ${JSON.stringify(value)}`)
    }

    const handler = isLazy ? debounce(updateValue, 150) : updateValue

    for (const event of config.events) {
      el.addEventListener(event, handler)
    }

    cleanup(() => {
      for (const event of config.events) {
        el.removeEventListener(event, handler)
      }
    })
  })
}

function getComponentConfig(tagName: string) {
  const configs: Record<string, { attr: string; detailKey: string; events: string[] }> = {
    'ytz-slider': { attr: 'value', detailKey: 'value', events: ['change'] },
    'ytz-select': { attr: 'value', detailKey: 'value', events: ['change'] },
    'ytz-toggle': { attr: 'checked', detailKey: 'checked', events: ['change'] },
    'ytz-autocomplete': { attr: 'value', detailKey: 'value', events: ['input', 'select'] },
    'ytz-listbox': { attr: 'value', detailKey: 'value', events: ['change'] },
    'ytz-dialog': { attr: 'open', detailKey: 'open', events: ['close'] },
    'ytz-drawer': { attr: 'open', detailKey: 'open', events: ['close'] },
    'ytz-disclosure': { attr: 'open', detailKey: 'open', events: ['toggle'] },
    'ytz-popover': { attr: 'open', detailKey: 'open', events: ['toggle'] },
    'ytz-accordion-item': { attr: 'open', detailKey: 'open', events: ['toggle'] },
    'ytz-tabs': { attr: 'default-tab', detailKey: 'value', events: ['change'] },
    'ytz-progress': { attr: 'value', detailKey: 'value', events: [] },
    'ytz-badge': { attr: 'count', detailKey: 'count', events: [] },
    'ytz-snackbar': { attr: 'open', detailKey: 'open', events: ['close'] },
    'ytz-menu': { attr: 'open', detailKey: 'open', events: ['close'] },
  }
  return configs[tagName]
}
```

## Usage Examples

```html
<!-- Slider value binding -->
<ytz-slider x-ytz:model="volume" min="0" max="100"></ytz-slider>

<!-- Toggle binding -->
<ytz-toggle x-ytz:model="enabled"></ytz-toggle>

<!-- Select binding -->
<ytz-select x-ytz:model="selectedOption">
  <ytz-select-option value="a">Option A</ytz-select-option>
  <ytz-select-option value="b">Option B</ytz-select-option>
</ytz-select>

<!-- Dialog open state -->
<ytz-dialog x-ytz:model="dialogOpen">...</ytz-dialog>

<!-- With modifiers -->
<ytz-slider x-ytz:model.lazy="volume"></ytz-slider>
<ytz-autocomplete x-ytz:model.trim="searchQuery"></ytz-autocomplete>
```

## Modifiers

| Modifier | Effect |
|----------|--------|
| `.lazy` | Debounce updates (150ms) |
| `.number` | Cast value to number |
| `.trim` | Trim whitespace from strings |

## Tasks

1. **Create model.ts module**
   - Implement `registerModelDirective`
   - Component config mapping
   - Modifier support

2. **Update index.ts**
   - Import and register model directive

3. **Add tests** (optional for now)

## Dependencies
- PR-152 (completed): x-ytz Directive Implementation

## Acceptance Criteria
- [ ] x-ytz:model works for all supported components
- [ ] Modifiers (.lazy, .number, .trim) work correctly
- [ ] Two-way binding syncs in both directions
- [ ] Package builds without errors

# PR-155: Alpine.js Integration Tests & Documentation

## Overview

Add comprehensive integration tests and documentation for the `@grimoire/yetzirah-alpine` package. This PR completes the Alpine.js integration by:

1. Creating integration tests for all directives and the `x-ytz:model` directive
2. Adding a README.md with installation, usage examples, and API documentation

## Current State Analysis

The Alpine package currently has:
- `src/index.ts` - Main plugin with magic registration
- `src/directives.ts` - 17+ directives for component bindings
- `src/model.ts` - Unified `x-ytz:model` two-way binding directive
- `src/magics/ytz.ts` - `$ytz` magic methods (PR-154)
- `src/__tests__/magics.test.ts` - Tests for magic methods only

Missing:
- Integration tests for directives
- Integration tests for `x-ytz:model`
- README.md documentation

## Implementation Plan

### Step 1: Create `packages/alpine/src/__tests__/directives.test.ts`

Test all 17 directives from `directives.ts`:

```typescript
describe('Alpine Directive Integration Tests', () => {
  // Test each directive with mock Alpine instance
  describe('x-ytz-dialog', () => {
    it('syncs open attribute from Alpine state')
    it('updates Alpine state on close event')
    it('supports .once modifier')
  })
  // ... similar for all directives
})
```

Directives to test:
- `x-ytz-dialog` - Dialog open state
- `x-ytz-drawer` - Drawer open state
- `x-ytz-tabs` - Tab value
- `x-ytz-toggle` - Toggle checked state
- `x-ytz-slider` - Slider value with .lazy and .number modifiers
- `x-ytz-select` - Select value
- `x-ytz-disclosure` - Disclosure open state
- `x-ytz-accordion-item` - Accordion item open state
- `x-ytz-popover` - Popover open state
- `x-ytz-autocomplete` - Autocomplete value with .lazy modifier
- `x-ytz-listbox` - Listbox value
- `x-ytz-menu` - Menu open state
- `x-ytz-progress` - Progress value (no events)
- `x-ytz-snackbar` - Snackbar open state
- `x-ytz-chip` - Chip remove handler
- `x-ytz-badge` - Badge count
- `x-ytz-init` - Init callback

### Step 2: Create `packages/alpine/src/__tests__/model.test.ts`

Test the unified `x-ytz:model` directive:

```typescript
describe('x-ytz:model Directive', () => {
  describe('component detection', () => {
    it('auto-detects ytz-slider and binds value')
    it('auto-detects ytz-toggle and binds checked')
    it('auto-detects ytz-dialog and binds open')
    // ... all supported components
  })

  describe('modifiers', () => {
    it('.lazy debounces updates')
    it('.number coerces to number')
    it('.trim trims string values')
  })

  describe('error handling', () => {
    it('warns on unsupported component')
  })
})
```

### Step 3: Create `packages/alpine/README.md`

Documentation structure following Vue README pattern:

1. **Installation** - npm/pnpm/yarn commands
2. **Requirements** - Alpine.js 3.0+
3. **Usage**
   - Plugin registration
   - Basic example with directives
   - $ytz magic usage
4. **Directives Reference**
   - Table of all directives with descriptions
   - Examples for each major directive
5. **x-ytz:model Directive**
   - Auto-detection explanation
   - Supported components table
   - Modifier documentation
6. **$ytz Magic Methods**
   - Table of all methods
   - Usage examples
7. **Development & Testing**
8. **TypeScript**
9. **Architecture notes**

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/alpine/src/__tests__/directives.test.ts` | Create | Integration tests for all directives |
| `packages/alpine/src/__tests__/model.test.ts` | Create | Tests for x-ytz:model directive |
| `packages/alpine/README.md` | Create | Package documentation |

## Test Strategy

Since Alpine.js directives require a mock Alpine instance, tests will:

1. Create a mock Alpine object with `directive()`, `magic()`, and `evaluate()` methods
2. Call `registerDirectives()` and `registerModelDirective()` with the mock
3. Capture the registered directive callbacks
4. Create DOM elements and invoke callbacks with mock utilities
5. Verify attribute changes and event handling

Example mock structure:
```typescript
function createMockAlpine() {
  const directives: Map<string, DirectiveCallback> = new Map()
  return {
    directive: (name: string, cb: DirectiveCallback) => directives.set(name, cb),
    evaluate: vi.fn((el, expr) => eval(expr)), // simplified
    getDirective: (name: string) => directives.get(name),
  }
}
```

## Acceptance Criteria

- [ ] All 17 directives have test coverage
- [ ] x-ytz:model has tests for all supported components
- [ ] Modifier tests (.once, .lazy, .number, .trim)
- [ ] README.md with complete API documentation
- [ ] All tests pass
- [ ] Build succeeds

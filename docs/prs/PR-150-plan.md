# PR-150: Solid.js Integration Tests & Documentation

## Overview
Add comprehensive tests and documentation for the Solid.js component wrappers. Follow patterns established by React package (individual component tests) and documentation style from existing docs (preact-htm.md as reference).

## Current State
- 24 Solid.js component wrappers exist in `packages/solid/src/`
- Vitest is configured (`vitest.config.ts`)
- No tests exist yet
- No Solid-specific documentation exists

## Tasks

### 1. Core Component Tests (Priority: High)

Create tests for key components following React test patterns:

```
packages/solid/src/__tests__/
├── Dialog.test.tsx
├── Tabs.test.tsx
├── Select.test.tsx
├── Toggle.test.tsx
├── Slider.test.tsx
└── Disclosure.test.tsx
```

Each test should cover:
- Renders children
- Syncs reactive props to attributes
- Fires callbacks on component events
- Cleans up event listeners (via onCleanup)

**Test Pattern:**
```tsx
import { render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { Dialog } from '../Dialog'

describe('Dialog', () => {
  test('syncs open prop reactively', async () => {
    const [open, setOpen] = createSignal(false)
    const { container } = render(() => <Dialog open={open()}>Content</Dialog>)

    const dialog = container.querySelector('ytz-dialog')
    expect(dialog).not.toHaveAttribute('open')

    setOpen(true)
    await Promise.resolve() // flush reactivity
    expect(dialog).toHaveAttribute('open')
  })

  test('calls onClose callback', async () => {
    const handleClose = vi.fn()
    const { container } = render(() => (
      <Dialog open onClose={handleClose}>Content</Dialog>
    ))

    const dialog = container.querySelector('ytz-dialog')!
    dialog.dispatchEvent(new CustomEvent('close', { bubbles: true }))

    expect(handleClose).toHaveBeenCalled()
  })
})
```

### 2. Documentation (Priority: Medium)

Create `docs/solid.md` following preact-htm.md style:

```markdown
# Using Yetzirah with Solid.js

## Installation
## Quick Start
## Component Examples
  - Button
  - Dialog with open state
  - Tabs with controlled value
  - Form components (Select, Toggle, Slider)
## Reactivity Patterns
  - Using createSignal with props
  - Event callbacks
## TypeScript Support
## SSR Considerations
```

### 3. Demo App (Priority: Low)

Create minimal demo:
```
demos/solid/
├── index.html
├── App.tsx
└── vite.config.ts
```

Demo should showcase:
- Counter with Button
- Dialog open/close
- Tabs with panels
- Form with Select, Toggle, Slider

## Files to Create

| File | Priority | Description |
|------|----------|-------------|
| `packages/solid/src/__tests__/Dialog.test.tsx` | High | Dialog open/close, onClose |
| `packages/solid/src/__tests__/Tabs.test.tsx` | High | Tab switching, onChange |
| `packages/solid/src/__tests__/Select.test.tsx` | High | Value sync, onChange |
| `packages/solid/src/__tests__/Toggle.test.tsx` | High | Checked state, onChange |
| `packages/solid/src/__tests__/Slider.test.tsx` | Medium | Value sync, onChange |
| `packages/solid/src/__tests__/Disclosure.test.tsx` | Medium | Open/close, onToggle |
| `docs/solid.md` | Medium | Usage documentation |
| `demos/solid/index.html` | Low | Demo page |
| `demos/solid/App.tsx` | Low | Demo application |

## Test Dependencies (already in package.json)
- `@solidjs/testing-library`
- `happy-dom`
- `vitest`

## Dependencies
- PR-149 (completed): Components exist

## Acceptance Criteria
- [ ] Core component tests pass
- [ ] `pnpm --filter @grimoire/yetzirah-solid test` succeeds
- [ ] docs/solid.md documents usage patterns
- [ ] Demo app runs (optional)

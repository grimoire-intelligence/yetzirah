# PR-006: Disclosure React Wrapper

## Overview
Create a thin React wrapper for `<ytz-disclosure>` Web Component, providing React-idiomatic props and event handling.

**Status:** Blocked by PR-005
**Complexity:** 2 (haiku-level)
**Target:** < 50 lines

## Component API

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controlled open state |
| `defaultOpen` | boolean | false | Uncontrolled initial state |
| `onToggle` | (open: boolean) => void | - | Callback when state changes |
| `className` | string | - | CSS classes passed to element |
| `children` | ReactNode | - | Trigger button + content |

### Usage Examples

```jsx
// Controlled
function ControlledDisclosure() {
  const [open, setOpen] = useState(false)

  return (
    <Disclosure open={open} onToggle={setOpen}>
      <button className="ph3 pv2 br2 bg-blue white">
        {open ? 'Hide' : 'Show'} Details
      </button>
      <div className="pa3 bg-light-gray mt2">
        Hidden content...
      </div>
    </Disclosure>
  )
}

// Uncontrolled with defaultOpen
function UncontrolledDisclosure() {
  return (
    <Disclosure defaultOpen onToggle={(open) => console.log('Now:', open)}>
      <button>Toggle</button>
      <div>Content</div>
    </Disclosure>
  )
}
```

## Implementation Plan

### File: `packages/react/src/disclosure.js`

```javascript
/**
 * React wrapper for ytz-disclosure Web Component.
 * Provides controlled/uncontrolled open state management.
 *
 * @module @yetzirah/react/disclosure
 */

import '@yetzirah/core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Disclosure component - expandable content with toggle trigger.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controlled open state
 * @param {boolean} [props.defaultOpen] - Initial open state (uncontrolled)
 * @param {Function} [props.onToggle] - Callback when open state changes
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Trigger and content elements
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Disclosure open={open} onToggle={setOpen}>
 *   <button>Toggle</button>
 *   <div>Content</div>
 * </Disclosure>
 */
export const Disclosure = forwardRef(function Disclosure(
  { open, defaultOpen, onToggle, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Sync controlled open prop to attribute
  useEffect(() => {
    const el = innerRef.current
    if (!el || open === undefined) return

    if (open) {
      el.setAttribute('open', '')
    } else {
      el.removeAttribute('open')
    }
  }, [open])

  // Handle toggle events
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const handleToggle = (e) => {
      onToggle?.(e.detail.open)
    }

    el.addEventListener('toggle', handleToggle)
    return () => el.removeEventListener('toggle', handleToggle)
  }, [onToggle])

  return (
    <ytz-disclosure
      ref={innerRef}
      class={className}
      open={defaultOpen || undefined}
      {...props}
    >
      {children}
    </ytz-disclosure>
  )
})
```

### File: `packages/react/src/disclosure.test.js`

Test cases to cover:
1. **Rendering**: Renders children correctly
2. **Controlled mode**: `open` prop controls visibility
3. **Uncontrolled mode**: `defaultOpen` sets initial state
4. **onToggle callback**: Called with new open state when toggled
5. **Ref forwarding**: ref points to ytz-disclosure element
6. **className**: Passed through as class attribute
7. **ARIA passthrough**: aria-* props forwarded to element

```javascript
/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef, useState } from 'react'
import { Disclosure } from './disclosure.js'

describe('Disclosure', () => {
  test('renders children', () => {
    render(
      <Disclosure>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    expect(screen.getByText('Toggle')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  test('controlled mode - open prop controls state', () => {
    const { rerender } = render(
      <Disclosure open={false}>
        <button>Toggle</button>
        <div data-testid="content">Content</div>
      </Disclosure>
    )

    const disclosure = screen.getByText('Toggle').closest('ytz-disclosure')
    expect(disclosure).not.toHaveAttribute('open')

    rerender(
      <Disclosure open={true}>
        <button>Toggle</button>
        <div data-testid="content">Content</div>
      </Disclosure>
    )
    expect(disclosure).toHaveAttribute('open')
  })

  test('calls onToggle when toggled', async () => {
    const handleToggle = jest.fn()
    render(
      <Disclosure onToggle={handleToggle}>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )

    const button = screen.getByText('Toggle')
    fireEvent.click(button)

    // Wait for custom event
    await new Promise(r => setTimeout(r, 0))
    expect(handleToggle).toHaveBeenCalledWith(true)
  })

  test('forwards ref to ytz-disclosure element', () => {
    const ref = createRef()
    render(
      <Disclosure ref={ref}>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-disclosure')
  })

  test('passes className as class attribute', () => {
    render(
      <Disclosure className="test-class">
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    const disclosure = screen.getByText('Toggle').closest('ytz-disclosure')
    expect(disclosure).toHaveAttribute('class', 'test-class')
  })

  test('defaultOpen sets initial open state', () => {
    render(
      <Disclosure defaultOpen>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    const disclosure = screen.getByText('Toggle').closest('ytz-disclosure')
    expect(disclosure).toHaveAttribute('open')
  })
})
```

### File: `packages/react/src/index.js` (modify)

Add export:
```javascript
export { Disclosure } from './disclosure.js'
```

## Acceptance Criteria Checklist
- [ ] `open` prop synced to attribute
- [ ] `onToggle` callback fires on state change
- [ ] Ref forwarding works
- [ ] < 50 lines implementation
- [ ] All tests passing

## Dependencies
- PR-005: Disclosure Core Component (provides the Web Component)

## Downstream Dependents
- PR-007: Disclosure Documentation & Demo

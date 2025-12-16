# Block 12: Popover Component (Core + React + Demo)

## Overview

Block 12 implements the Popover component - click-triggered positioned content with interactive capabilities. This component derives from Tooltip (PR-014), reusing the position utility, but differs in trigger behavior (click vs hover) and content model (interactive vs descriptive).

**PRs in sequence:**
1. PR-035: Popover Component (Core) - complexity 3, ~45 min
2. PR-036: Popover React Wrapper - complexity 2, ~20 min
3. PR-037: Popover Documentation & Demo - complexity 2, ~25 min

**Dependencies:** PR-014 (Tooltip Core - completed) -> PR-035 -> PR-036 -> PR-037

---

## PR-035: Popover Component (Core)

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/core/src/popover.js` | create | ytz-popover Web Component |
| `packages/core/src/popover.test.js` | create | Popover component tests |
| `packages/core/src/index.js` | modify | Export YtzPopover |

### Implementation Details

#### 1. Popover Component (`popover.js`)

The Popover is structurally similar to Tooltip but with key differences:
- Click-triggered (not hover)
- Interactive content (forms, buttons, links)
- Focus management for keyboard accessibility
- Light dismiss (click outside)
- Escape to close

```javascript
/**
 * ytz-popover - Click-triggered positioned content Web Component.
 * Shows interactive content anchored to a trigger element.
 *
 * @module @yetzirah/core/popover
 * @example
 * <ytz-popover>
 *   <button>Open menu</button>
 *   <div slot="content">
 *     <p>Popover content with interactive elements</p>
 *     <button onclick="this.closest('ytz-popover').open = false">Close</button>
 *   </div>
 * </ytz-popover>
 *
 * @example
 * // With placement
 * <ytz-popover placement="bottom">
 *   <button>Settings</button>
 *   <div slot="content" class="pa3 bg-white shadow-2 br2">
 *     <label class="db mb2">
 *       <input type="checkbox"> Enable notifications
 *     </label>
 *     <button>Save</button>
 *   </div>
 * </ytz-popover>
 */

import { position } from './utils/position.js'

let popoverId = 0

/**
 * @class YtzPopover
 * @extends HTMLElement
 */
class YtzPopover extends HTMLElement {
  static observedAttributes = ['open', 'placement', 'offset']

  /** @type {HTMLElement|null} */
  #trigger = null
  /** @type {HTMLElement|null} */
  #content = null
  /** @type {string|null} */
  #contentId = null

  connectedCallback() {
    this.#setup()
    // Check initial open state
    if (this.hasAttribute('open')) {
      this.#show()
    }
  }

  disconnectedCallback() {
    this.#cleanup()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return

    if (name === 'open') {
      newVal !== null ? this.#show() : this.#hide()
    } else if (this.hasAttribute('open')) {
      // Reposition if placement/offset changed while open
      this.#updatePosition()
    }
  }

  /** @returns {'top'|'bottom'|'left'|'right'} */
  get placement() {
    return this.getAttribute('placement') || 'bottom'
  }

  set placement(value) {
    this.setAttribute('placement', value)
  }

  /** @returns {number} */
  get offset() {
    return parseInt(this.getAttribute('offset') || '8', 10)
  }

  set offset(value) {
    this.setAttribute('offset', String(value))
  }

  /** @returns {boolean} */
  get open() {
    return this.hasAttribute('open')
  }

  set open(value) {
    if (value) {
      this.setAttribute('open', '')
    } else {
      this.removeAttribute('open')
    }
  }

  #setup() {
    // Find trigger (first child) and content ([slot="content"] or last child)
    this.#trigger = this.firstElementChild
    this.#content = this.querySelector('[slot="content"]') || this.lastElementChild

    if (!this.#trigger || !this.#content || this.#trigger === this.#content) return

    // Generate unique ID for content
    this.#contentId = this.#content.id || `ytz-popover-${++popoverId}`
    this.#content.id = this.#contentId

    // Set up ARIA - popover uses aria-expanded on trigger
    this.#trigger.setAttribute('aria-haspopup', 'dialog')
    this.#trigger.setAttribute('aria-expanded', 'false')
    this.#trigger.setAttribute('aria-controls', this.#contentId)

    // Content hidden initially
    this.#content.hidden = true

    // Click listener on trigger
    this.#trigger.addEventListener('click', this.#handleTriggerClick)
  }

  #cleanup() {
    this.#trigger?.removeEventListener('click', this.#handleTriggerClick)
    document.removeEventListener('click', this.#handleOutsideClick)
    document.removeEventListener('keydown', this.#handleEscape)
    window.removeEventListener('scroll', this.#updatePosition, { capture: true })
    window.removeEventListener('resize', this.#updatePosition)
  }

  #handleTriggerClick = (e) => {
    e.stopPropagation()
    this.open = !this.open
  }

  #handleOutsideClick = (e) => {
    // Close if click is outside popover content
    if (!this.#content?.contains(e.target) && !this.#trigger?.contains(e.target)) {
      this.open = false
    }
  }

  #handleEscape = (e) => {
    if (e.key === 'Escape' && this.open) {
      e.preventDefault()
      this.open = false
      // Return focus to trigger
      this.#trigger?.focus()
    }
  }

  #show() {
    if (!this.#content) return

    // Update ARIA
    this.#trigger?.setAttribute('aria-expanded', 'true')

    // Show content
    this.#content.hidden = false
    this.#updatePosition()

    // Add listeners for dismiss
    // Use setTimeout to avoid immediate close from the same click
    setTimeout(() => {
      document.addEventListener('click', this.#handleOutsideClick)
    }, 0)
    document.addEventListener('keydown', this.#handleEscape)

    // Reposition on scroll/resize
    window.addEventListener('scroll', this.#updatePosition, { passive: true, capture: true })
    window.addEventListener('resize', this.#updatePosition, { passive: true })

    // Focus first focusable element in content, or content itself
    requestAnimationFrame(() => {
      const focusable = this.#content?.querySelector(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable) {
        /** @type {HTMLElement} */ (focusable).focus()
      }
    })

    this.dispatchEvent(new CustomEvent('show', { bubbles: true }))
  }

  #hide() {
    if (!this.#content) return

    // Update ARIA
    this.#trigger?.setAttribute('aria-expanded', 'false')

    // Hide content
    this.#content.hidden = true

    // Remove listeners
    document.removeEventListener('click', this.#handleOutsideClick)
    document.removeEventListener('keydown', this.#handleEscape)
    window.removeEventListener('scroll', this.#updatePosition, { capture: true })
    window.removeEventListener('resize', this.#updatePosition)

    this.dispatchEvent(new CustomEvent('hide', { bubbles: true }))
  }

  #updatePosition = () => {
    if (!this.#trigger || !this.#content) return

    const { x, y, placement: finalPlacement } = position(this.#trigger, this.#content, {
      placement: this.placement,
      offset: this.offset
    })

    // Position popover fixed relative to viewport
    this.#content.style.position = 'fixed'
    this.#content.style.left = `${x}px`
    this.#content.style.top = `${y}px`

    // Set data attribute for CSS styling based on actual placement
    this.#content.dataset.placement = finalPlacement
  }

  // Public API

  /** Show the popover programmatically */
  show() {
    this.open = true
  }

  /** Hide the popover programmatically */
  hide() {
    this.open = false
  }

  /** Toggle the popover open/closed */
  toggle() {
    this.open = !this.open
  }
}

customElements.define('ytz-popover', YtzPopover)

export { YtzPopover }
```

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | false | Controls visibility |
| `placement` | 'top'\|'bottom'\|'left'\|'right' | 'bottom' | Preferred position |
| `offset` | number | 8 | Gap between trigger and content |

**Events:**

| Event | Detail | Description |
|-------|--------|-------------|
| `show` | - | Fired when popover opens |
| `hide` | - | Fired when popover closes |

**ARIA Requirements:**
- Trigger has `aria-haspopup="dialog"`
- Trigger has `aria-expanded` (true/false)
- Trigger has `aria-controls` pointing to content ID
- Content hidden via `hidden` attribute

**Behavior:**
- Opens on trigger click
- Closes on click outside (light dismiss)
- Closes on Escape key
- Focus moves to first focusable element on open
- Focus returns to trigger on Escape close
- Repositions on scroll/resize
- Flips placement if near viewport edge

**Key differences from Tooltip:**
- Click-triggered (not hover/focus)
- Default placement is "bottom" (not "top")
- Interactive content expected
- Focus management
- Light dismiss behavior

**Line budget:** < 150 lines

#### 2. Tests (`popover.test.js`)

```javascript
describe('YtzPopover', () => {
  // Structure & ARIA
  test('renders with content hidden by default')
  test('trigger has aria-haspopup="dialog"')
  test('trigger has aria-expanded="false" when closed')
  test('trigger has aria-expanded="true" when open')
  test('trigger has aria-controls pointing to content')

  // Open/close on click
  test('opens on trigger click')
  test('closes on second trigger click')
  test('open attribute controls visibility')
  test('open property syncs with attribute')

  // Light dismiss
  test('closes when clicking outside content')
  test('does not close when clicking inside content')
  test('does not close when clicking trigger (toggle instead)')

  // Keyboard
  test('Escape closes popover')
  test('Escape returns focus to trigger')

  // Focus management
  test('focuses first focusable element on open')
  test('content is focusable if no focusable children')

  // Positioning
  test('positions below trigger by default')
  test('respects placement attribute')
  test('flips when near viewport edge')
  test('repositions on window resize')
  test('respects offset attribute')

  // Public API
  test('show() method opens popover')
  test('hide() method closes popover')
  test('toggle() method toggles popover')

  // Events
  test('dispatches show event when opened')
  test('dispatches hide event when closed')
})
```

#### 3. Index Export

```javascript
// Add to packages/core/src/index.js
export { YtzPopover } from './popover.js'
```

### Acceptance Criteria

- [ ] Opens on click, not hover
- [ ] Light dismiss (click outside to close)
- [ ] Escape closes and returns focus to trigger
- [ ] Focus moves to content on open
- [ ] Correct ARIA (aria-haspopup, aria-expanded, aria-controls)
- [ ] Positioned correctly (top/bottom/left/right)
- [ ] Flips when near viewport edge
- [ ] Repositions on scroll/resize
- [ ] `show`/`hide` events dispatched
- [ ] Public `show()`/`hide()`/`toggle()` methods
- [ ] < 150 lines
- [ ] All tests pass

---

## PR-036: Popover React Wrapper

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/react/src/popover.js` | create | React wrapper for ytz-popover |
| `packages/react/src/popover.test.js` | create | Wrapper tests |
| `packages/react/src/index.js` | modify | Export Popover |

### Implementation Details

#### 1. Popover Wrapper (`popover.js`)

```javascript
/**
 * React wrapper for ytz-popover Web Component.
 * Click-triggered positioned content for interactive overlays.
 *
 * @module @yetzirah/react/popover
 * @example
 * const [open, setOpen] = useState(false)
 *
 * <Popover open={open} onOpenChange={setOpen} placement="bottom">
 *   <button>Open menu</button>
 *   <div className="pa3 bg-white shadow-2 br2">
 *     <p>Popover content</p>
 *     <button onClick={() => setOpen(false)}>Close</button>
 *   </div>
 * </Popover>
 */
import '@yetzirah/core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Popover component - click-triggered positioned content.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controlled open state
 * @param {Function} [props.onOpenChange] - Callback when open state changes
 * @param {Function} [props.onShow] - Callback when popover shows
 * @param {Function} [props.onHide] - Callback when popover hides
 * @param {'top'|'bottom'|'left'|'right'} [props.placement='bottom'] - Position
 * @param {number} [props.offset=8] - Gap between trigger and content
 * @param {string} [props.className] - CSS classes for popover content
 * @param {React.ReactNode} props.children - Trigger and content elements
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 */
export const Popover = forwardRef(function Popover(
  { open, onOpenChange, onShow, onHide, placement, offset, className, children, ...props },
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

  // Bridge show/hide events to onOpenChange
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const handleShow = () => {
      onShow?.()
      onOpenChange?.(true)
    }
    const handleHide = () => {
      onHide?.()
      onOpenChange?.(false)
    }

    el.addEventListener('show', handleShow)
    el.addEventListener('hide', handleHide)

    return () => {
      el.removeEventListener('show', handleShow)
      el.removeEventListener('hide', handleHide)
    }
  }, [onShow, onHide, onOpenChange])

  // Extract trigger (first child) and content (second child)
  const childArray = Array.isArray(children) ? children : [children]
  const trigger = childArray[0]
  const content = childArray[1]

  return (
    <ytz-popover
      ref={innerRef}
      placement={placement}
      offset={offset}
      {...props}
    >
      {trigger}
      {content && (
        <div slot="content" class={className}>
          {content}
        </div>
      )}
    </ytz-popover>
  )
})
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | - | Controlled open state |
| `onOpenChange` | function | - | Callback `(open: boolean) => void` |
| `onShow` | function | - | Callback when popover shows |
| `onHide` | function | - | Callback when popover hides |
| `placement` | string | 'bottom' | Position: 'top', 'bottom', 'left', 'right' |
| `offset` | number | 8 | Gap between trigger and content |
| `className` | string | - | Classes for popover content wrapper |
| `children` | ReactNode | required | [trigger, content] |

**Line budget:** < 60 lines

#### 2. Tests (`popover.test.js`)

```javascript
describe('Popover (React)', () => {
  test('renders trigger and content children')
  test('syncs controlled open prop to attribute')
  test('calls onOpenChange when show event fires')
  test('calls onOpenChange when hide event fires')
  test('calls onShow when shown')
  test('calls onHide when hidden')
  test('passes placement attribute')
  test('passes offset attribute')
  test('passes className to content wrapper')
  test('forwards ref to element')
})
```

#### 3. Index Export

```javascript
// Add to packages/react/src/index.js
export { Popover } from './popover.js'
```

### Acceptance Criteria

- [ ] Controlled `open` prop syncs to attribute
- [ ] `onOpenChange` callback fires on show/hide
- [ ] `onShow`/`onHide` callbacks work
- [ ] Placement/offset props passed correctly
- [ ] Children properly split into trigger/content
- [ ] Ref forwarding works
- [ ] < 60 lines

---

## PR-037: Popover Documentation & Demo

### Files to Create

| File | Action | Description |
|------|--------|-------------|
| `demos/popover.html` | create | Static HTML demo page |

### Demo Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Popover Component - Yetzirah</title>
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">
  <script type="module" src="../packages/core/dist/index.js"></script>
  <style>
    /* Basic popover styling - users customize this */
    [slot="content"] {
      z-index: 1000;
    }
  </style>
</head>
<body class="sans-serif pa4 mw8 center">
  <header class="mb5">
    <nav class="mb3">
      <a href="index.html" class="link blue">&larr; All Components</a>
    </nav>
    <h1 class="f2 fw6 mb2">Popover</h1>
    <p class="f5 lh-copy gray mt0">
      Click-triggered positioned content for menus, forms, and interactive overlays.
    </p>
  </header>

  <main>
    <!-- Basic Usage -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">Basic Usage</h2>
      <p class="lh-copy mb3">
        Click the button to toggle the popover. Click outside or press Escape to close.
      </p>

      <ytz-popover>
        <button class="ph3 pv2 br2 bg-blue white bn pointer">
          Click me
        </button>
        <div slot="content" class="pa3 bg-white shadow-2 br2 ba b--light-gray">
          <p class="ma0 mb2 fw5">Popover Title</p>
          <p class="ma0 f6 gray">This is interactive popover content.</p>
        </div>
      </ytz-popover>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto mt3"><code>&lt;ytz-popover&gt;
  &lt;button&gt;Click me&lt;/button&gt;
  &lt;div slot="content" class="pa3 bg-white shadow-2 br2"&gt;
    Popover content
  &lt;/div&gt;
&lt;/ytz-popover&gt;</code></pre>
    </section>

    <!-- Placements -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">Placements</h2>
      <p class="lh-copy mb3">
        Position the popover relative to its trigger.
      </p>

      <div class="flex flex-wrap items-center" style="gap: 1rem;">
        <ytz-popover placement="top">
          <button class="ph3 pv2 br2 bg-blue white bn pointer">Top</button>
          <div slot="content" class="pa2 bg-dark-gray white br2 f6">
            Top placement
          </div>
        </ytz-popover>

        <ytz-popover placement="bottom">
          <button class="ph3 pv2 br2 bg-blue white bn pointer">Bottom</button>
          <div slot="content" class="pa2 bg-dark-gray white br2 f6">
            Bottom placement
          </div>
        </ytz-popover>

        <ytz-popover placement="left">
          <button class="ph3 pv2 br2 bg-blue white bn pointer">Left</button>
          <div slot="content" class="pa2 bg-dark-gray white br2 f6">
            Left placement
          </div>
        </ytz-popover>

        <ytz-popover placement="right">
          <button class="ph3 pv2 br2 bg-blue white bn pointer">Right</button>
          <div slot="content" class="pa2 bg-dark-gray white br2 f6">
            Right placement
          </div>
        </ytz-popover>
      </div>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto mt3"><code>&lt;ytz-popover placement="top"&gt;...&lt;/ytz-popover&gt;
&lt;ytz-popover placement="bottom"&gt;...&lt;/ytz-popover&gt;
&lt;ytz-popover placement="left"&gt;...&lt;/ytz-popover&gt;
&lt;ytz-popover placement="right"&gt;...&lt;/ytz-popover&gt;</code></pre>
    </section>

    <!-- Interactive Content -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">Interactive Content</h2>
      <p class="lh-copy mb3">
        Unlike tooltips, popovers can contain interactive elements like forms and buttons.
      </p>

      <ytz-popover placement="bottom">
        <button class="ph3 pv2 br2 bg-blue white bn pointer">
          Settings
        </button>
        <div slot="content" class="pa3 bg-white shadow-2 br2 ba b--light-gray w5">
          <h3 class="f5 fw6 mt0 mb3">Preferences</h3>
          <label class="db mb3">
            <input type="checkbox" class="mr2">
            Enable notifications
          </label>
          <label class="db mb3">
            <input type="checkbox" class="mr2" checked>
            Dark mode
          </label>
          <div class="flex justify-end">
            <button onclick="this.closest('ytz-popover').open = false"
                    class="ph3 pv2 br2 bg-blue white bn pointer f6">
              Save
            </button>
          </div>
        </div>
      </ytz-popover>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto mt3"><code>&lt;ytz-popover&gt;
  &lt;button&gt;Settings&lt;/button&gt;
  &lt;div slot="content" class="pa3 bg-white shadow-2"&gt;
    &lt;label&gt;
      &lt;input type="checkbox"&gt; Enable notifications
    &lt;/label&gt;
    &lt;button onclick="this.closest('ytz-popover').open = false"&gt;
      Save
    &lt;/button&gt;
  &lt;/div&gt;
&lt;/ytz-popover&gt;</code></pre>
    </section>

    <!-- Dropdown Menu Pattern -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">Dropdown Menu Pattern</h2>
      <p class="lh-copy mb3">
        Create simple dropdown menus. For complex menus with keyboard navigation, use <code>&lt;ytz-menu&gt;</code>.
      </p>

      <ytz-popover placement="bottom">
        <button class="ph3 pv2 br2 bg-white ba b--light-gray pointer flex items-center">
          Actions
          <span class="ml2">&#9660;</span>
        </button>
        <div slot="content" class="bg-white shadow-2 br2 ba b--light-gray overflow-hidden">
          <button onclick="alert('Edit'); this.closest('ytz-popover').open = false"
                  class="db w-100 pa3 tl bg-transparent bn pointer hover-bg-light-gray bb b--light-gray">
            Edit
          </button>
          <button onclick="alert('Duplicate'); this.closest('ytz-popover').open = false"
                  class="db w-100 pa3 tl bg-transparent bn pointer hover-bg-light-gray bb b--light-gray">
            Duplicate
          </button>
          <button onclick="alert('Delete'); this.closest('ytz-popover').open = false"
                  class="db w-100 pa3 tl bg-transparent bn pointer hover-bg-light-gray red">
            Delete
          </button>
        </div>
      </ytz-popover>
    </section>

    <!-- Programmatic Control -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">Programmatic Control</h2>
      <p class="lh-copy mb3">
        Control popovers via JavaScript using the <code>open</code> property or methods.
      </p>

      <div class="mb3">
        <button onclick="document.getElementById('prog-popover').show()"
                class="ph3 pv2 br2 bg-blue white bn pointer mr2">
          Open
        </button>
        <button onclick="document.getElementById('prog-popover').hide()"
                class="ph3 pv2 br2 ba b--blue blue bg-transparent pointer mr2">
          Close
        </button>
        <button onclick="document.getElementById('prog-popover').toggle()"
                class="ph3 pv2 br2 ba b--gray gray bg-transparent pointer">
          Toggle
        </button>
      </div>

      <ytz-popover id="prog-popover">
        <button class="ph3 pv2 br2 bg-green white bn pointer">
          Target
        </button>
        <div slot="content" class="pa3 bg-white shadow-2 br2 ba b--light-gray">
          Controlled popover content
        </div>
      </ytz-popover>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto mt3"><code>const popover = document.getElementById('my-popover')

popover.show()    // Open
popover.hide()    // Close
popover.toggle()  // Toggle
popover.open = true  // Property access</code></pre>
    </section>

    <!-- Custom Offset -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">Custom Offset</h2>
      <p class="lh-copy mb3">
        Adjust the gap between trigger and popover content.
      </p>

      <div class="flex items-center" style="gap: 2rem;">
        <ytz-popover offset="4">
          <button class="ph3 pv2 br2 bg-blue white bn pointer">4px offset</button>
          <div slot="content" class="pa2 bg-dark-gray white br2 f6">
            Close to trigger
          </div>
        </ytz-popover>

        <ytz-popover offset="24">
          <button class="ph3 pv2 br2 bg-blue white bn pointer">24px offset</button>
          <div slot="content" class="pa2 bg-dark-gray white br2 f6">
            Far from trigger
          </div>
        </ytz-popover>
      </div>
    </section>

    <!-- Keyboard & Focus -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">Keyboard & Focus</h2>
      <p class="lh-copy mb3">
        Popovers provide full keyboard accessibility:
      </p>
      <ul class="lh-copy pl3 mb3">
        <li><kbd class="ph2 pv1 bg-light-gray br1 f6">Enter</kbd> / <kbd class="ph2 pv1 bg-light-gray br1 f6">Space</kbd> - Toggle popover (on trigger)</li>
        <li><kbd class="ph2 pv1 bg-light-gray br1 f6">Escape</kbd> - Close and return focus to trigger</li>
        <li><kbd class="ph2 pv1 bg-light-gray br1 f6">Tab</kbd> - Navigate within popover content</li>
        <li>Focus moves to first focusable element on open</li>
      </ul>
    </section>

    <!-- API Reference -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">API Reference</h2>

      <h3 class="f5 fw6 mb2">Attributes</h3>
      <table class="collapse ba b--light-gray w-100 mb4">
        <thead>
          <tr class="bg-light-gray">
            <th class="pa2 tl">Attribute</th>
            <th class="pa2 tl">Type</th>
            <th class="pa2 tl">Default</th>
            <th class="pa2 tl">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>open</code></td>
            <td class="pa2">Boolean</td>
            <td class="pa2">false</td>
            <td class="pa2">Controls visibility</td>
          </tr>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>placement</code></td>
            <td class="pa2">String</td>
            <td class="pa2">'bottom'</td>
            <td class="pa2">Position: top, bottom, left, right</td>
          </tr>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>offset</code></td>
            <td class="pa2">Number</td>
            <td class="pa2">8</td>
            <td class="pa2">Gap between trigger and content</td>
          </tr>
        </tbody>
      </table>

      <h3 class="f5 fw6 mb2">Methods</h3>
      <table class="collapse ba b--light-gray w-100 mb4">
        <thead>
          <tr class="bg-light-gray">
            <th class="pa2 tl">Method</th>
            <th class="pa2 tl">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>show()</code></td>
            <td class="pa2">Open the popover</td>
          </tr>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>hide()</code></td>
            <td class="pa2">Close the popover</td>
          </tr>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>toggle()</code></td>
            <td class="pa2">Toggle open/closed</td>
          </tr>
        </tbody>
      </table>

      <h3 class="f5 fw6 mb2">Events</h3>
      <table class="collapse ba b--light-gray w-100 mb4">
        <thead>
          <tr class="bg-light-gray">
            <th class="pa2 tl">Event</th>
            <th class="pa2 tl">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>show</code></td>
            <td class="pa2">Fired when popover opens</td>
          </tr>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>hide</code></td>
            <td class="pa2">Fired when popover closes</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- React Usage -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">React Usage</h2>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>import { useState } from 'react'
import { Popover } from '@yetzirah/react'

function App() {
  const [open, setOpen] = useState(false)

  return (
    &lt;Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
    &gt;
      &lt;button&gt;Open menu&lt;/button&gt;
      &lt;div className="pa3 bg-white shadow-2 br2"&gt;
        &lt;p&gt;Popover content&lt;/p&gt;
        &lt;button onClick={() =&gt; setOpen(false)}&gt;
          Close
        &lt;/button&gt;
      &lt;/div&gt;
    &lt;/Popover&gt;
  )
}

// Uncontrolled - manages its own state
&lt;Popover placement="bottom"&gt;
  &lt;button&gt;Click me&lt;/button&gt;
  &lt;div&gt;Popover content&lt;/div&gt;
&lt;/Popover&gt;</code></pre>
    </section>

    <!-- MUI Migration -->
    <section class="demo-section pv4 bb b--light-gray">
      <h2 class="f4 fw6 mb3">Migrating from MUI Popover</h2>

      <table class="w-100 collapse ba b--light-gray mb4">
        <thead>
          <tr class="bg-near-white">
            <th class="pa2 tl bb b--light-gray">MUI</th>
            <th class="pa2 tl bb b--light-gray">Yetzirah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pa2 bb b--light-gray"><code>&lt;Popover&gt;</code></td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-popover&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>open={true}</code></td>
            <td class="pa2 bb b--light-gray"><code>open</code> attribute</td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>onClose={fn}</code></td>
            <td class="pa2 bb b--light-gray"><code>hide</code> event</td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>anchorEl={ref}</code></td>
            <td class="pa2 bb b--light-gray">First child is trigger</td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>anchorOrigin={{ vertical, horizontal }}</code></td>
            <td class="pa2 bb b--light-gray"><code>placement="bottom"</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>transformOrigin</code></td>
            <td class="pa2 bb b--light-gray">CSS / not needed</td>
          </tr>
          <tr>
            <td class="pa2"><code>TransitionComponent</code></td>
            <td class="pa2">CSS transitions on content</td>
          </tr>
        </tbody>
      </table>

      <div class="flex flex-wrap nl2 nr2">
        <div class="w-50-ns w-100 ph2 mb3">
          <h4 class="f6 fw6 mb2 gray ttu">MUI</h4>
          <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;Button onClick={handleClick}&gt;
  Open Popover
&lt;/Button&gt;
&lt;Popover
  open={open}
  anchorEl={anchorEl}
  onClose={handleClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
&gt;
  Popover content
&lt;/Popover&gt;</code></pre>
        </div>
        <div class="w-50-ns w-100 ph2 mb3">
          <h4 class="f6 fw6 mb2 gray ttu">Yetzirah</h4>
          <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;Popover
  open={open}
  onOpenChange={setOpen}
  placement="bottom"
&gt;
  &lt;button&gt;Open Popover&lt;/button&gt;
  &lt;div&gt;Popover content&lt;/div&gt;
&lt;/Popover&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- Tooltip vs Popover -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Tooltip vs Popover</h2>
      <p class="lh-copy mb3">
        When to use each component:
      </p>
      <table class="w-100 collapse ba b--light-gray">
        <thead>
          <tr class="bg-near-white">
            <th class="pa2 tl bb b--light-gray">Use Case</th>
            <th class="pa2 tl bb b--light-gray">Component</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pa2 bb b--light-gray">Brief hint text (label, description)</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-tooltip&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray">Show on hover/focus</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-tooltip&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray">Non-interactive content</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-tooltip&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray">Rich interactive content</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-popover&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray">Click to open/close</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-popover&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray">Forms, buttons, links inside</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-popover&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray">Simple dropdown menu</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-popover&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2">Menu with keyboard nav (arrows)</td>
            <td class="pa2"><code>&lt;ytz-menu&gt;</code></td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer class="mt5 pt4 bt b--light-gray">
    <p class="f6 gray">
      <a href="index.html" class="link blue">Back to all components</a>
    </p>
  </footer>
</body>
</html>
```

### Acceptance Criteria

- [ ] Demo shows: basic, placements, interactive content, menu pattern, programmatic control
- [ ] Works when opened directly in browser (no build)
- [ ] JSDoc complete in source files
- [ ] Demo follows existing component demo structure
- [ ] MUI migration table included
- [ ] Tooltip vs Popover guidance included

---

## Implementation Notes

### Relationship to Tooltip

Popover shares the position utility with Tooltip:
- Same flip/shift logic
- Same `data-placement` CSS hook
- Same scroll/resize handling

Key differences:
- Trigger: click (Popover) vs hover/focus (Tooltip)
- Content: interactive (Popover) vs descriptive (Tooltip)
- Default placement: bottom (Popover) vs top (Tooltip)
- Focus: managed (Popover) vs none (Tooltip)
- ARIA: aria-haspopup/aria-expanded (Popover) vs aria-describedby (Tooltip)

### Light Dismiss Implementation

The click-outside detection uses a simple approach:
1. After opening, add document click listener (with setTimeout to avoid immediate trigger)
2. Check if click target is outside both trigger and content
3. Close if outside

This handles:
- Clicking the backdrop (closes)
- Clicking inside content (stays open)
- Clicking trigger again (toggle via separate handler)

### Focus Management

Unlike Dialog, Popover does NOT trap focus:
- User can Tab out of popover
- This matches expected popover behavior
- If focus leaves popover naturally, it stays open
- Only Escape explicitly closes and returns focus

For fully trapped focus (modal behavior), use `<ytz-dialog>`.

### CSS Animations

Users can add CSS transitions on the content:

```css
[slot="content"] {
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.15s, transform 0.15s;
}

ytz-popover[open] [slot="content"] {
  opacity: 1;
  transform: translateY(0);
}
```

Note: The `hidden` attribute is still used, so animations need to work with the timing.

---

## Downstream Dependents

None - Popover is a leaf component in the dependency graph.

---

## Estimated Work

| PR | Complexity | Est. Time |
|----|------------|-----------|
| PR-035 | 3 | 45 min |
| PR-036 | 2 | 20 min |
| PR-037 | 2 | 25 min |
| **Total** | **7** | **~1.5 hrs** |

# Block 6: Tooltip Component (Core + React + Demo)

## Overview

Block 6 implements the Tooltip component - positioned hint text triggered by hover/focus with proper ARIA. This requires the positioning utility that will be reused by Menu, Popover, and Autocomplete.

**PRs in sequence:**
1. PR-014: Tooltip Component (Core) - complexity 4, ~60 min
2. PR-015: Tooltip React Wrapper - complexity 2, ~25 min
3. PR-016: Tooltip Documentation & Demo - complexity 2, ~30 min

**Dependencies:** PR-001 (completed) → PR-014 → PR-015 → PR-016

---

## PR-014: Tooltip Component (Core)

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/core/src/utils/position.js` | create | Internal positioning utility |
| `packages/core/src/tooltip.js` | create | ytz-tooltip Web Component |
| `packages/core/src/tooltip.test.js` | create | Tooltip component tests |
| `packages/core/src/index.js` | modify | Export YtzTooltip |

### Implementation Details

#### 1. Position Utility (`utils/position.js`)

Internal utility - NOT exported from package. Minimal native alternative to Floating UI.

```javascript
/**
 * Position utility for tooltips, menus, popovers.
 * Places an element relative to an anchor with flip/shift logic.
 *
 * @param {HTMLElement} anchor - Element to position relative to
 * @param {HTMLElement} floating - Element to position
 * @param {Object} options - Positioning options
 * @param {'top'|'bottom'|'left'|'right'} [options.placement='top'] - Preferred placement
 * @param {number} [options.offset=8] - Gap between anchor and floating
 * @returns {{ x: number, y: number, placement: string }}
 */
export function position(anchor, floating, options = {}) {
  const { placement = 'top', offset = 8 } = options

  const anchorRect = anchor.getBoundingClientRect()
  const floatingRect = floating.getBoundingClientRect()
  const viewport = { width: window.innerWidth, height: window.innerHeight }

  // Calculate initial position based on placement
  let x, y
  let finalPlacement = placement

  // Position based on placement
  switch (placement) {
    case 'top':
      x = anchorRect.left + (anchorRect.width - floatingRect.width) / 2
      y = anchorRect.top - floatingRect.height - offset
      break
    case 'bottom':
      x = anchorRect.left + (anchorRect.width - floatingRect.width) / 2
      y = anchorRect.bottom + offset
      break
    case 'left':
      x = anchorRect.left - floatingRect.width - offset
      y = anchorRect.top + (anchorRect.height - floatingRect.height) / 2
      break
    case 'right':
      x = anchorRect.right + offset
      y = anchorRect.top + (anchorRect.height - floatingRect.height) / 2
      break
  }

  // Flip if outside viewport
  if (placement === 'top' && y < 0) {
    y = anchorRect.bottom + offset
    finalPlacement = 'bottom'
  } else if (placement === 'bottom' && y + floatingRect.height > viewport.height) {
    y = anchorRect.top - floatingRect.height - offset
    finalPlacement = 'top'
  } else if (placement === 'left' && x < 0) {
    x = anchorRect.right + offset
    finalPlacement = 'right'
  } else if (placement === 'right' && x + floatingRect.width > viewport.width) {
    x = anchorRect.left - floatingRect.width - offset
    finalPlacement = 'left'
  }

  // Shift to stay in viewport (horizontal for top/bottom, vertical for left/right)
  if (placement === 'top' || placement === 'bottom') {
    x = Math.max(0, Math.min(x, viewport.width - floatingRect.width))
  } else {
    y = Math.max(0, Math.min(y, viewport.height - floatingRect.height))
  }

  return { x, y, placement: finalPlacement }
}
```

**Requirements:**
- Anchor-relative positioning (top, bottom, left, right)
- Flip when near viewport edge
- Shift to stay in viewport
- < 60 lines

**Known limitations (document in JSDoc):**
- Does not handle nested scroll containers
- Does not support virtual elements
- No middleware system

#### 2. Tooltip Component (`tooltip.js`)

```javascript
/**
 * ytz-tooltip - Positioned hint text Web Component.
 * Shows on hover/focus with configurable delay and placement.
 *
 * @module @yetzirah/core/tooltip
 * @example
 * <ytz-tooltip>
 *   <button>Hover me</button>
 *   <span slot="content">Tooltip text</span>
 * </ytz-tooltip>
 *
 * @example
 * // With placement and delay
 * <ytz-tooltip placement="bottom" delay="200">
 *   <button>Hover me</button>
 *   <span slot="content">Bottom tooltip</span>
 * </ytz-tooltip>
 */

import { position } from './utils/position.js'

let tooltipId = 0

class YtzTooltip extends HTMLElement {
  static observedAttributes = ['placement', 'delay', 'offset']

  #trigger = null
  #content = null
  #contentId = null
  #showTimeout = null
  #hideTimeout = null
  #isVisible = false

  connectedCallback() {
    this.#setup()
  }

  disconnectedCallback() {
    this.#cleanup()
    clearTimeout(this.#showTimeout)
    clearTimeout(this.#hideTimeout)
  }

  attributeChangedCallback() {
    if (this.#isVisible) this.#updatePosition()
  }

  get placement() {
    return this.getAttribute('placement') || 'top'
  }

  get delay() {
    return parseInt(this.getAttribute('delay') || '0', 10)
  }

  get offset() {
    return parseInt(this.getAttribute('offset') || '8', 10)
  }

  #setup() {
    // First child is trigger, [slot="content"] or last child is content
    this.#trigger = this.firstElementChild
    this.#content = this.querySelector('[slot="content"]') || this.lastElementChild

    if (!this.#trigger || !this.#content || this.#trigger === this.#content) return

    // Generate unique ID for content
    this.#contentId = this.#content.id || `ytz-tooltip-${++tooltipId}`
    this.#content.id = this.#contentId

    // Set up ARIA
    this.#trigger.setAttribute('aria-describedby', this.#contentId)
    this.#content.setAttribute('role', 'tooltip')
    this.#content.hidden = true

    // Hover listeners
    this.#trigger.addEventListener('mouseenter', this.#handleMouseEnter)
    this.#trigger.addEventListener('mouseleave', this.#handleMouseLeave)
    this.#content.addEventListener('mouseenter', this.#handleContentMouseEnter)
    this.#content.addEventListener('mouseleave', this.#handleMouseLeave)

    // Focus listeners
    this.#trigger.addEventListener('focusin', this.#handleFocusIn)
    this.#trigger.addEventListener('focusout', this.#handleFocusOut)

    // Touch support (show on long press, hide on touch elsewhere)
    this.#trigger.addEventListener('touchstart', this.#handleTouchStart, { passive: true })
  }

  #cleanup() {
    this.#trigger?.removeEventListener('mouseenter', this.#handleMouseEnter)
    this.#trigger?.removeEventListener('mouseleave', this.#handleMouseLeave)
    this.#content?.removeEventListener('mouseenter', this.#handleContentMouseEnter)
    this.#content?.removeEventListener('mouseleave', this.#handleMouseLeave)
    this.#trigger?.removeEventListener('focusin', this.#handleFocusIn)
    this.#trigger?.removeEventListener('focusout', this.#handleFocusOut)
    this.#trigger?.removeEventListener('touchstart', this.#handleTouchStart)
  }

  #handleMouseEnter = () => {
    clearTimeout(this.#hideTimeout)
    this.#showTimeout = setTimeout(() => this.#show(), this.delay)
  }

  #handleMouseLeave = () => {
    clearTimeout(this.#showTimeout)
    this.#hideTimeout = setTimeout(() => this.#hide(), 100)
  }

  #handleContentMouseEnter = () => {
    clearTimeout(this.#hideTimeout)
  }

  #handleFocusIn = () => {
    clearTimeout(this.#hideTimeout)
    this.#show()
  }

  #handleFocusOut = () => {
    this.#hide()
  }

  #handleTouchStart = () => {
    // Toggle on touch
    if (this.#isVisible) {
      this.#hide()
    } else {
      this.#show()
    }
  }

  #show() {
    if (!this.#content || this.#isVisible) return

    this.#content.hidden = false
    this.#isVisible = true
    this.#updatePosition()

    // Listen for scroll/resize to reposition
    window.addEventListener('scroll', this.#updatePosition, { passive: true, capture: true })
    window.addEventListener('resize', this.#updatePosition, { passive: true })

    this.dispatchEvent(new CustomEvent('show', { bubbles: true }))
  }

  #hide() {
    if (!this.#content || !this.#isVisible) return

    this.#content.hidden = true
    this.#isVisible = false

    window.removeEventListener('scroll', this.#updatePosition, { capture: true })
    window.removeEventListener('resize', this.#updatePosition)

    this.dispatchEvent(new CustomEvent('hide', { bubbles: true }))
  }

  #updatePosition = () => {
    if (!this.#trigger || !this.#content) return

    const { x, y, placement } = position(this.#trigger, this.#content, {
      placement: this.placement,
      offset: this.offset
    })

    // Position tooltip absolutely
    this.#content.style.position = 'fixed'
    this.#content.style.left = `${x}px`
    this.#content.style.top = `${y}px`

    // Set data attribute for CSS styling based on actual placement
    this.#content.dataset.placement = placement
  }

  // Public API
  show() {
    clearTimeout(this.#hideTimeout)
    this.#show()
  }

  hide() {
    clearTimeout(this.#showTimeout)
    this.#hide()
  }
}

customElements.define('ytz-tooltip', YtzTooltip)

export { YtzTooltip }
```

**Attributes:**
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `placement` | string | 'top' | Position: 'top', 'bottom', 'left', 'right' |
| `delay` | number | 0 | Show delay in milliseconds |
| `offset` | number | 8 | Gap between trigger and tooltip |

**Events:**
| Event | Detail | Description |
|-------|--------|-------------|
| `show` | - | Fired when tooltip becomes visible |
| `hide` | - | Fired when tooltip is hidden |

**ARIA Requirements:**
- Trigger has `aria-describedby` pointing to tooltip ID
- Tooltip content has `role="tooltip"`
- Content hidden via `hidden` attribute

**Behavior:**
- Shows on mouseenter (with optional delay)
- Shows on focus (no delay for accessibility)
- Hides on mouseleave (with brief delay to allow moving to tooltip)
- User can hover over tooltip content without it disappearing
- Touch: toggles on tap
- Repositions on scroll/resize
- Flips placement if near viewport edge

**Line budget:** < 150 lines (excluding position utility)

#### 3. Tests (`tooltip.test.js`)

```javascript
describe('YtzTooltip', () => {
  // Rendering
  test('renders with content hidden by default')
  test('has correct ARIA attributes (aria-describedby, role="tooltip")')

  // Show/hide on hover
  test('shows tooltip on mouseenter')
  test('hides tooltip on mouseleave')
  test('respects delay attribute')
  test('keeps tooltip visible when hovering over content')

  // Show/hide on focus
  test('shows tooltip on focusin')
  test('hides tooltip on focusout')

  // Touch
  test('toggles on touch')

  // Positioning
  test('positions above trigger by default')
  test('respects placement attribute')
  test('flips when near viewport edge')
  test('repositions on window resize')
  test('respects offset attribute')

  // Public API
  test('show() method shows tooltip')
  test('hide() method hides tooltip')

  // Events
  test('dispatches show event when shown')
  test('dispatches hide event when hidden')
})
```

#### 4. Index Export

```javascript
// Add to packages/core/src/index.js
export { YtzTooltip } from './tooltip.js'
```

### Acceptance Criteria

- [ ] Shows on hover with configurable delay
- [ ] Shows on focus (immediate for accessibility)
- [ ] Hides on mouseleave/focusout
- [ ] User can hover over tooltip content
- [ ] Correct ARIA (aria-describedby, role="tooltip")
- [ ] Positioned correctly (top/bottom/left/right)
- [ ] Flips when near viewport edge
- [ ] Repositions on scroll/resize
- [ ] Touch support
- [ ] `show`/`hide` events dispatched
- [ ] Public `show()`/`hide()` methods
- [ ] < 200 lines total (tooltip.js + position.js)
- [ ] All tests pass

---

## PR-015: Tooltip React Wrapper

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/react/src/tooltip.js` | create | React wrapper |
| `packages/react/src/tooltip.test.js` | create | Wrapper tests |
| `packages/react/src/index.js` | modify | Export Tooltip |

### Implementation Details

#### 1. Tooltip Wrapper (`tooltip.js`)

```javascript
/**
 * React wrapper for ytz-tooltip.
 *
 * @module @yetzirah/react/tooltip
 * @example
 * <Tooltip content="Helpful hint" placement="top">
 *   <button>Hover me</button>
 * </Tooltip>
 */
import '@yetzirah/core'
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

/**
 * Tooltip component - positioned hint text on hover/focus.
 *
 * @param {Object} props - Component props
 * @param {string} props.content - Tooltip text content
 * @param {'top'|'bottom'|'left'|'right'} [props.placement='top'] - Tooltip position
 * @param {number} [props.delay=0] - Show delay in milliseconds
 * @param {number} [props.offset=8] - Gap between trigger and tooltip
 * @param {Function} [props.onShow] - Callback when tooltip shows
 * @param {Function} [props.onHide] - Callback when tooltip hides
 * @param {string} [props.className] - CSS classes for tooltip content
 * @param {React.ReactNode} props.children - Trigger element
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 */
export const Tooltip = forwardRef(function Tooltip(
  { content, placement, delay, offset, onShow, onHide, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Bridge show/hide events
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const handleShow = () => onShow?.()
    const handleHide = () => onHide?.()

    el.addEventListener('show', handleShow)
    el.addEventListener('hide', handleHide)

    return () => {
      el.removeEventListener('show', handleShow)
      el.removeEventListener('hide', handleHide)
    }
  }, [onShow, onHide])

  return (
    <ytz-tooltip
      ref={innerRef}
      placement={placement}
      delay={delay}
      offset={offset}
      {...props}
    >
      {children}
      <span slot="content" class={className}>
        {content}
      </span>
    </ytz-tooltip>
  )
})
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | string/ReactNode | required | Tooltip content |
| `placement` | string | 'top' | Position: 'top', 'bottom', 'left', 'right' |
| `delay` | number | 0 | Show delay in ms |
| `offset` | number | 8 | Gap between trigger and tooltip |
| `onShow` | function | - | Callback when shown |
| `onHide` | function | - | Callback when hidden |
| `className` | string | - | Classes for tooltip content |
| `children` | ReactNode | required | Trigger element |

**Line budget:** < 50 lines

#### 2. Tests (`tooltip.test.js`)

```javascript
describe('Tooltip (React)', () => {
  test('renders children as trigger')
  test('renders content in slot')
  test('passes placement attribute')
  test('passes delay attribute')
  test('passes offset attribute')
  test('calls onShow when show event fires')
  test('calls onHide when hide event fires')
  test('forwards ref to element')
  test('passes className to content span')
})
```

#### 3. Index Export

```javascript
// Add to packages/react/src/index.js
export { Tooltip } from './tooltip.js'
```

### Acceptance Criteria

- [ ] Content rendered correctly in slot
- [ ] Placement/delay/offset props passed to element
- [ ] `onShow`/`onHide` callbacks fire correctly
- [ ] Children rendered as trigger
- [ ] Ref forwarding works
- [ ] < 50 lines

---

## PR-016: Tooltip Documentation & Demo

### Files to Create

| File | Action | Description |
|------|--------|-------------|
| `demos/tooltip.html` | create | Static HTML demo page |

### Demo Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Tooltip - Yetzirah Demo</title>
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">
  <script type="module" src="../packages/core/dist/index.js"></script>
  <style>
    /* Basic tooltip styling - users customize this */
    [role="tooltip"] {
      background: #333;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      z-index: 1000;
      pointer-events: auto;
    }

    /* Arrow example (optional) */
    [role="tooltip"][data-placement="top"]::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
  </style>
</head>
<body class="sans-serif pa4 mw8 center">
  <header>
    <nav><a href="index.html">&larr; All Components</a></nav>
    <h1 class="f2 fw6">Tooltip</h1>
    <p class="f5 lh-copy measure">Positioned hint text with hover/focus triggers and ARIA support.</p>
  </header>

  <main class="mt4">
    <!-- Basic Tooltip -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Basic Tooltip</h2>
      <ytz-tooltip>
        <button class="ph3 pv2 br2 pointer">Hover me</button>
        <span slot="content">Helpful tooltip text</span>
      </ytz-tooltip>
    </section>

    <!-- Placements -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Placements</h2>
      <div class="flex flex-wrap gap3">
        <ytz-tooltip placement="top">
          <button class="ph3 pv2 br2 pointer">Top</button>
          <span slot="content">Top placement</span>
        </ytz-tooltip>
        <ytz-tooltip placement="bottom">
          <button class="ph3 pv2 br2 pointer">Bottom</button>
          <span slot="content">Bottom placement</span>
        </ytz-tooltip>
        <ytz-tooltip placement="left">
          <button class="ph3 pv2 br2 pointer">Left</button>
          <span slot="content">Left placement</span>
        </ytz-tooltip>
        <ytz-tooltip placement="right">
          <button class="ph3 pv2 br2 pointer">Right</button>
          <span slot="content">Right placement</span>
        </ytz-tooltip>
      </div>
    </section>

    <!-- With Delay -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Show Delay</h2>
      <ytz-tooltip delay="500">
        <button class="ph3 pv2 br2 pointer">500ms delay</button>
        <span slot="content">Waited 500ms to show</span>
      </ytz-tooltip>
    </section>

    <!-- Custom Offset -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Custom Offset</h2>
      <ytz-tooltip offset="16">
        <button class="ph3 pv2 br2 pointer">16px offset</button>
        <span slot="content">More space between trigger and tooltip</span>
      </ytz-tooltip>
    </section>

    <!-- Focus Example -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Focus Support</h2>
      <p class="f6 gray mb2">Tab to the input to see tooltip on focus</p>
      <ytz-tooltip>
        <input type="text" class="pa2 ba b--light-gray br2" placeholder="Focus me">
        <span slot="content">This shows on keyboard focus too</span>
      </ytz-tooltip>
    </section>

    <!-- Edge Flipping -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Auto-flip</h2>
      <p class="f6 gray mb2">Tooltip flips when near viewport edge</p>
      <div class="flex justify-end">
        <ytz-tooltip placement="right">
          <button class="ph3 pv2 br2 pointer">Near right edge</button>
          <span slot="content">I flip to the left when there's no room</span>
        </ytz-tooltip>
      </div>
    </section>

    <!-- Rich Content -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Rich Content</h2>
      <ytz-tooltip>
        <button class="ph3 pv2 br2 pointer">Hover for details</button>
        <span slot="content">
          <strong>Title</strong><br>
          <span class="f7">More detailed description</span>
        </span>
      </ytz-tooltip>
    </section>

    <!-- React Usage -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">React Usage</h2>
      <pre class="pa3 bg-near-white br2 f6 overflow-x-auto"><code>import { Tooltip, Button } from '@yetzirah/react'

function App() {
  return (
    &lt;Tooltip content="Helpful hint" placement="top"&gt;
      &lt;Button&gt;Hover me&lt;/Button&gt;
    &lt;/Tooltip&gt;
  )
}

// With callbacks
&lt;Tooltip
  content="Tracking shows"
  onShow={() => analytics.track('tooltip_shown')}
  onHide={() => analytics.track('tooltip_hidden')}
&gt;
  &lt;Button&gt;Tracked tooltip&lt;/Button&gt;
&lt;/Tooltip&gt;</code></pre>
    </section>

    <!-- MUI Migration -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">MUI Migration</h2>
      <table class="w-100 collapse ba b--light-gray">
        <thead>
          <tr class="bg-near-white">
            <th class="pa2 tl bb b--light-gray">MUI</th>
            <th class="pa2 tl bb b--light-gray">Yetzirah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pa2 bb b--light-gray"><code>&lt;Tooltip title="text"&gt;</code></td>
            <td class="pa2 bb b--light-gray"><code>&lt;Tooltip content="text"&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>placement="bottom"</code></td>
            <td class="pa2 bb b--light-gray"><code>placement="bottom"</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>enterDelay={500}</code></td>
            <td class="pa2 bb b--light-gray"><code>delay={500}</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>arrow</code></td>
            <td class="pa2 bb b--light-gray">CSS (see example above)</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Styling Tips -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Styling</h2>
      <p class="f5 lh-copy">Yetzirah provides no default styles. Add your own:</p>
      <pre class="pa3 bg-near-white br2 f6 overflow-x-auto"><code>/* Basic dark tooltip */
[role="tooltip"] {
  background: #333;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  z-index: 1000;
}

/* Arrow based on placement */
[role="tooltip"][data-placement="top"]::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border: 5px solid transparent;
  border-top-color: #333;
}</code></pre>
    </section>
  </main>
</body>
</html>
```

### Acceptance Criteria

- [ ] Demo shows: basic, placements, delay, offset, focus, auto-flip, rich content
- [ ] Works when opened directly in browser (no build)
- [ ] JSDoc complete in source files
- [ ] Demo follows existing disclosure/button.html structure
- [ ] MUI migration table included

---

## Implementation Notes

### Position Utility Strategy

The position utility is intentionally minimal. From the PRD:

> **In scope:**
> - Anchor-relative positioning (top, bottom, left, right + alignment)
> - Flip when near viewport edge
> - Shift to stay in viewport
> - Window resize updates
>
> **Out of scope:**
> - Nested scroll containers
> - Virtual elements
> - Middleware system
>
> **Target:** < 100 lines

Document this limitation prominently - users with complex layouts should use the tooltip manually with Floating UI.

### Hover Intent Pattern

The small delay on mouseleave (100ms) is intentional:
- Allows user to move mouse to tooltip content
- Common pattern for interactive tooltips
- Prevents flickering when moving between elements

### Touch Behavior

Touch devices don't have hover. The implementation:
- Tap trigger = show tooltip
- Tap elsewhere = hide tooltip
- This matches MUI's behavior

### Content Slot Pattern

Using `[slot="content"]` allows:
- Clear separation of trigger vs content
- Rich HTML content in tooltips
- CSS targeting via `[slot="content"]`

Alternative: infer first child = trigger, last child = content (like Disclosure). The slot approach is more explicit.

### CSS Hook: `data-placement`

The `data-placement` attribute on the tooltip content allows CSS-based arrows:

```css
[data-placement="top"]::after { /* arrow pointing down */ }
[data-placement="bottom"]::after { /* arrow pointing up */ }
```

This is set dynamically based on actual placement (which may flip).

---

## Downstream Dependents

- **PR-017 (Menu)**: Uses position utility for dropdown positioning
- **PR-035 (Popover)**: Derived from Tooltip (click-triggered, richer content)

---

## Estimated Work

| PR | Complexity | Est. Time |
|----|------------|-----------|
| PR-014 | 4 | 60 min |
| PR-015 | 2 | 25 min |
| PR-016 | 2 | 30 min |
| **Total** | **8** | **~2 hrs** |

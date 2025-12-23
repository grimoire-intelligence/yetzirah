# Block 10: Accordion Component (Core + React + Demo)

## Overview

Block 10 implements the Accordion component - coordinated disclosures with optional exclusive mode (only one panel open at a time). This component derives from and reuses the patterns established by Disclosure (PR-005).

**PRs in sequence:**
1. PR-029: Accordion Component (Core) - complexity 3, ~45 min
2. PR-030: Accordion React Wrapper - complexity 2, ~20 min
3. PR-031: Accordion Documentation & Demo - complexity 2, ~25 min

**Dependencies:** PR-005 (Disclosure Core - completed) → PR-029 → PR-030 → PR-031

---

## PR-029: Accordion Component (Core)

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/core/src/accordion.js` | create | ytz-accordion, ytz-accordion-item Web Components |
| `packages/core/src/accordion.test.js` | create | Accordion component tests |
| `packages/core/src/index.js` | modify | Export YtzAccordion, YtzAccordionItem |

### Implementation Details

#### 1. Accordion Components (`accordion.js`)

Two related Web Components that work together. The key difference from standalone disclosures is coordination - items communicate through their parent accordion.

```javascript
/**
 * ytz-accordion - Coordinated disclosure container.
 * Manages multiple accordion items with optional exclusive mode.
 *
 * @module @grimoire/yetzirah-core/accordion
 * @example
 * <ytz-accordion>
 *   <ytz-accordion-item>
 *     <button>Section 1</button>
 *     <div>Content 1</div>
 *   </ytz-accordion-item>
 *   <ytz-accordion-item>
 *     <button>Section 2</button>
 *     <div>Content 2</div>
 *   </ytz-accordion-item>
 * </ytz-accordion>
 *
 * @example
 * // Exclusive mode - only one item open at a time
 * <ytz-accordion exclusive>
 *   <ytz-accordion-item open>...</ytz-accordion-item>
 *   <ytz-accordion-item>...</ytz-accordion-item>
 * </ytz-accordion>
 */

let accordionItemId = 0

/**
 * @class YtzAccordion
 * @extends HTMLElement
 */
class YtzAccordion extends HTMLElement {
  connectedCallback() {
    // Listen for toggle events from children
    this.addEventListener('toggle', this.#handleItemToggle)
  }

  disconnectedCallback() {
    this.removeEventListener('toggle', this.#handleItemToggle)
  }

  /**
   * Whether exclusive mode is enabled (only one item open at a time).
   * @type {boolean}
   */
  get exclusive() {
    return this.hasAttribute('exclusive')
  }

  set exclusive(value) {
    if (value) {
      this.setAttribute('exclusive', '')
    } else {
      this.removeAttribute('exclusive')
    }
  }

  /**
   * Get all accordion items.
   * @returns {YtzAccordionItem[]}
   */
  get items() {
    return Array.from(this.querySelectorAll(':scope > ytz-accordion-item'))
  }

  /**
   * Handle toggle event from accordion item.
   * In exclusive mode, close other items when one opens.
   * @param {CustomEvent} e
   */
  #handleItemToggle = (e) => {
    if (!this.exclusive || !e.detail.open) return

    // Close other items
    const openedItem = e.target
    this.items.forEach(item => {
      if (item !== openedItem && item.open) {
        item.open = false
      }
    })
  }
}

/**
 * ytz-accordion-item - Individual accordion panel.
 * Functions like ytz-disclosure but coordinates with parent accordion.
 *
 * @attr open - When present, content is visible
 */
class YtzAccordionItem extends HTMLElement {
  static observedAttributes = ['open']

  /** @type {HTMLElement|null} */
  #trigger = null
  /** @type {HTMLElement|null} */
  #content = null
  /** @type {string|null} */
  #contentId = null

  connectedCallback() {
    this.#setup()
    this.#updateState()
  }

  disconnectedCallback() {
    this.#trigger?.removeEventListener('click', this.#handleClick)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open' && this.isConnected) {
      this.#updateState()
    }
  }

  #setup() {
    // Find trigger (first button) and content (next sibling element)
    this.#trigger = this.querySelector('button')
    this.#content = this.#trigger?.nextElementSibling

    if (!this.#trigger || !this.#content) return

    // Generate unique ID for content if needed
    this.#contentId = this.#content.id || `ytz-accordion-content-${++accordionItemId}`
    this.#content.id = this.#contentId

    // Generate ID for trigger if needed (for aria-labelledby on content)
    this.#trigger.id = this.#trigger.id || `ytz-accordion-trigger-${accordionItemId}`

    // Set up ARIA attributes
    this.#trigger.setAttribute('aria-controls', this.#contentId)
    this.#content.setAttribute('aria-labelledby', this.#trigger.id)
    this.#content.setAttribute('role', 'region')

    // Attach click listener
    this.#trigger.addEventListener('click', this.#handleClick)
  }

  #handleClick = () => {
    this.toggle()
  }

  #updateState() {
    const isOpen = this.hasAttribute('open')

    if (this.#trigger) {
      this.#trigger.setAttribute('aria-expanded', String(isOpen))
    }

    if (this.#content) {
      this.#content.hidden = !isOpen
    }
  }

  /**
   * Toggle the accordion item open/closed state.
   * Dispatches a 'toggle' event with the new state.
   */
  toggle() {
    const willOpen = !this.hasAttribute('open')

    if (willOpen) {
      this.setAttribute('open', '')
    } else {
      this.removeAttribute('open')
    }

    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      detail: { open: willOpen }
    }))
  }

  /**
   * Get/set the open state.
   * @type {boolean}
   */
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
}

customElements.define('ytz-accordion', YtzAccordion)
customElements.define('ytz-accordion-item', YtzAccordionItem)

export { YtzAccordion, YtzAccordionItem }
```

**Attributes:**

| Component | Attribute | Type | Default | Description |
|-----------|-----------|------|---------|-------------|
| `ytz-accordion` | `exclusive` | boolean | false | Only one item open at a time |
| `ytz-accordion-item` | `open` | boolean | false | Content visibility |

**Events:**

| Event | Target | Detail | Description |
|-------|--------|--------|-------------|
| `toggle` | `ytz-accordion-item` | `{ open: boolean }` | Fired when item's open state changes |

**ARIA Requirements:**
- Trigger has `aria-expanded` (true/false)
- Trigger has `aria-controls` pointing to content ID
- Content has `role="region"`
- Content has `aria-labelledby` pointing to trigger ID
- Content hidden via `hidden` attribute

**Behavior:**
- Items can be toggled independently (default)
- With `exclusive` attribute, opening one item closes others
- Keyboard: native button behavior (Enter/Space to toggle)
- Events bubble up for accordion-level coordination

**Line budget:** < 150 lines total (both components)

#### 2. Tests (`accordion.test.js`)

```javascript
describe('YtzAccordion', () => {
  // Structure
  test('renders ytz-accordion-item children')
  test('items getter returns all direct child items')

  // Non-exclusive mode (default)
  test('multiple items can be open simultaneously')
  test('toggling one item does not affect others')

  // Exclusive mode
  test('exclusive attribute enables single-open mode')
  test('opening one item closes others in exclusive mode')
  test('closing an item does not open others in exclusive mode')
})

describe('YtzAccordionItem', () => {
  // Structure
  test('finds button trigger')
  test('finds content element')

  // ARIA
  test('trigger has aria-expanded="false" when closed')
  test('trigger has aria-expanded="true" when open')
  test('trigger has aria-controls pointing to content')
  test('content has role="region"')
  test('content has aria-labelledby pointing to trigger')

  // State
  test('content is hidden when closed')
  test('content is visible when open')
  test('open attribute toggles visibility')
  test('open property syncs with attribute')

  // Interaction
  test('clicking trigger toggles open state')
  test('toggle() method toggles open state')
  test('dispatches toggle event with open detail')
  test('toggle event bubbles')

  // Keyboard
  test('Enter key toggles when trigger focused')
  test('Space key toggles when trigger focused')
})
```

#### 3. Index Export

```javascript
// Add to packages/core/src/index.js
export { YtzAccordion, YtzAccordionItem } from './accordion.js'
```

### Acceptance Criteria

- [ ] Multiple disclosures coordinated under parent
- [ ] `exclusive` attribute enables single-open mode
- [ ] Correct ARIA attributes (aria-expanded, aria-controls, role="region", aria-labelledby)
- [ ] `toggle` event dispatched on state change
- [ ] Works with animation stylesheet (shares disclosure.css patterns)
- [ ] < 150 lines total
- [ ] All tests pass

---

## PR-030: Accordion React Wrapper

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/react/src/accordion.js` | create | React wrappers for accordion components |
| `packages/react/src/accordion.test.js` | create | Wrapper tests |
| `packages/react/src/index.js` | modify | Export Accordion, AccordionItem |

### Implementation Details

#### 1. Accordion Wrappers (`accordion.js`)

```javascript
/**
 * React wrappers for ytz-accordion components.
 *
 * @module @grimoire/yetzirah-react/accordion
 * @example
 * <Accordion exclusive>
 *   <AccordionItem open={expanded === 'panel1'} onToggle={(open) => setExpanded(open ? 'panel1' : null)}>
 *     <button>Section 1</button>
 *     <div>Content 1</div>
 *   </AccordionItem>
 *   <AccordionItem open={expanded === 'panel2'} onToggle={(open) => setExpanded(open ? 'panel2' : null)}>
 *     <button>Section 2</button>
 *     <div>Content 2</div>
 *   </AccordionItem>
 * </Accordion>
 */
import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

/**
 * Accordion container - coordinates accordion items.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.exclusive] - Only one item open at a time
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - AccordionItem children
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 */
export const Accordion = forwardRef(function Accordion(
  { exclusive, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  return (
    <ytz-accordion
      ref={innerRef}
      class={className}
      exclusive={exclusive || undefined}
      {...props}
    >
      {children}
    </ytz-accordion>
  )
})

/**
 * Accordion item - individual expandable panel.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controlled open state
 * @param {boolean} [props.defaultOpen] - Initial open state (uncontrolled)
 * @param {Function} [props.onToggle] - Callback when open state changes
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Trigger button and content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 */
export const AccordionItem = forwardRef(function AccordionItem(
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
    if (!el || !onToggle) return

    const handleToggle = (e) => {
      // Only handle events from this item, not children
      if (e.target === el) {
        onToggle(e.detail.open)
      }
    }

    el.addEventListener('toggle', handleToggle)
    return () => el.removeEventListener('toggle', handleToggle)
  }, [onToggle])

  return (
    <ytz-accordion-item
      ref={innerRef}
      class={className}
      open={defaultOpen || undefined}
      {...props}
    >
      {children}
    </ytz-accordion-item>
  )
})
```

**Props:**

| Component | Prop | Type | Default | Description |
|-----------|------|------|---------|-------------|
| `Accordion` | `exclusive` | boolean | false | Single-open mode |
| `Accordion` | `className` | string | - | CSS classes |
| `Accordion` | `ref` | Ref | - | Forwarded ref |
| `AccordionItem` | `open` | boolean | - | Controlled open state |
| `AccordionItem` | `defaultOpen` | boolean | false | Initial state (uncontrolled) |
| `AccordionItem` | `onToggle` | function | - | Callback `(open: boolean) => void` |
| `AccordionItem` | `className` | string | - | CSS classes |
| `AccordionItem` | `ref` | Ref | - | Forwarded ref |

**Line budget:** < 50 lines per component (~80 total)

#### 2. Tests (`accordion.test.js`)

```javascript
describe('Accordion (React)', () => {
  test('renders children')
  test('passes exclusive attribute when true')
  test('omits exclusive attribute when false')
  test('passes className as class attribute')
  test('forwards ref to element')
})

describe('AccordionItem (React)', () => {
  test('renders children')
  test('syncs controlled open prop to attribute')
  test('sets defaultOpen attribute initially')
  test('calls onToggle when toggle event fires')
  test('only handles toggle events from self, not children')
  test('passes className as class attribute')
  test('forwards ref to element')
})
```

#### 3. Index Export

```javascript
// Add to packages/react/src/index.js
export { Accordion, AccordionItem } from './accordion.js'
```

### Acceptance Criteria

- [ ] Both components wrapped (Accordion, AccordionItem)
- [ ] `exclusive` prop on Accordion works
- [ ] Controlled `open` prop on AccordionItem works
- [ ] `defaultOpen` for uncontrolled usage
- [ ] `onToggle` callback fires correctly
- [ ] Ref forwarding works for both components
- [ ] < 50 lines per component

---

## PR-031: Accordion Documentation & Demo

### Files to Create

| File | Action | Description |
|------|--------|-------------|
| `demos/accordion.html` | create | Static HTML demo page |

### Demo Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accordion Component - Yetzirah</title>
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">
  <link rel="stylesheet" href="../packages/core/disclosure.css">
  <script type="module" src="../packages/core/dist/index.js"></script>
  <style>
    /* Demo layout */
    .demo-section {
      border-bottom: 1px solid #e0e0e0;
    }
    .demo-section:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body class="sans-serif pa4 mw8 center">
  <header class="mb5">
    <nav class="mb3">
      <a href="index.html" class="link blue">&larr; All Components</a>
    </nav>
    <h1 class="f2 fw6 mb2">Accordion</h1>
    <p class="f5 lh-copy gray mt0">
      Coordinated disclosures with optional exclusive mode. Built on ytz-disclosure patterns.
    </p>
  </header>

  <main>
    <!-- Basic Usage -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Basic Usage</h2>
      <p class="lh-copy mb3">
        Multiple panels that can be expanded independently. Each item manages its own state.
      </p>

      <ytz-accordion class="ba b--light-gray br2">
        <ytz-accordion-item class="bb b--light-gray">
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center f5">
            <span class="fw5">Section 1</span>
            <span class="ytz-disclosure-icon">&#9660;</span>
          </button>
          <div>
            <div class="pa3 bg-near-white">
              <p class="ma0 lh-copy">
                Content for section 1. This panel can be opened independently of other panels.
              </p>
            </div>
          </div>
        </ytz-accordion-item>

        <ytz-accordion-item class="bb b--light-gray">
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center f5">
            <span class="fw5">Section 2</span>
            <span class="ytz-disclosure-icon">&#9660;</span>
          </button>
          <div>
            <div class="pa3 bg-near-white">
              <p class="ma0 lh-copy">
                Content for section 2. Multiple panels can be open at the same time by default.
              </p>
            </div>
          </div>
        </ytz-accordion-item>

        <ytz-accordion-item>
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center f5">
            <span class="fw5">Section 3</span>
            <span class="ytz-disclosure-icon">&#9660;</span>
          </button>
          <div>
            <div class="pa3 bg-near-white">
              <p class="ma0 lh-copy">
                Content for section 3. The accordion reuses disclosure.css for animations.
              </p>
            </div>
          </div>
        </ytz-accordion-item>
      </ytz-accordion>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto mt3"><code>&lt;ytz-accordion&gt;
  &lt;ytz-accordion-item&gt;
    &lt;button&gt;Section 1&lt;/button&gt;
    &lt;div&gt;&lt;div&gt;Content 1&lt;/div&gt;&lt;/div&gt;
  &lt;/ytz-accordion-item&gt;
  &lt;ytz-accordion-item&gt;
    &lt;button&gt;Section 2&lt;/button&gt;
    &lt;div&gt;&lt;div&gt;Content 2&lt;/div&gt;&lt;/div&gt;
  &lt;/ytz-accordion-item&gt;
&lt;/ytz-accordion&gt;</code></pre>
    </section>

    <!-- Exclusive Mode -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Exclusive Mode</h2>
      <p class="lh-copy mb3">
        Add the <code class="bg-near-white ph1">exclusive</code> attribute to allow only
        one panel open at a time. Opening one closes the others.
      </p>

      <ytz-accordion exclusive class="ba b--light-gray br2">
        <ytz-accordion-item open class="bb b--light-gray">
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center f5">
            <span class="fw5">Account Settings</span>
            <span class="ytz-disclosure-indicator fw6"></span>
          </button>
          <div>
            <div class="pa3 bg-near-white">
              <p class="ma0 lh-copy">
                Manage your account details, profile picture, and display name.
                This panel is open by default.
              </p>
            </div>
          </div>
        </ytz-accordion-item>

        <ytz-accordion-item class="bb b--light-gray">
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center f5">
            <span class="fw5">Privacy Settings</span>
            <span class="ytz-disclosure-indicator fw6"></span>
          </button>
          <div>
            <div class="pa3 bg-near-white">
              <p class="ma0 lh-copy">
                Control who can see your profile and activity. Opening this
                closes the Account Settings panel above.
              </p>
            </div>
          </div>
        </ytz-accordion-item>

        <ytz-accordion-item>
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center f5">
            <span class="fw5">Notification Settings</span>
            <span class="ytz-disclosure-indicator fw6"></span>
          </button>
          <div>
            <div class="pa3 bg-near-white">
              <p class="ma0 lh-copy">
                Configure email notifications, push alerts, and reminder preferences.
              </p>
            </div>
          </div>
        </ytz-accordion-item>
      </ytz-accordion>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto mt3"><code>&lt;ytz-accordion exclusive&gt;
  &lt;ytz-accordion-item open&gt;...&lt;/ytz-accordion-item&gt;
  &lt;ytz-accordion-item&gt;...&lt;/ytz-accordion-item&gt;
  &lt;ytz-accordion-item&gt;...&lt;/ytz-accordion-item&gt;
&lt;/ytz-accordion&gt;</code></pre>
    </section>

    <!-- Programmatic Control -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Programmatic Control</h2>
      <p class="lh-copy mb3">
        Control accordion items via JavaScript using the <code class="bg-near-white ph1">open</code>
        property or attribute.
      </p>

      <div class="mb3">
        <button onclick="document.querySelector('#prog-accordion ytz-accordion-item:nth-child(1)').open = true"
                class="ph3 pv2 br2 bg-blue white bn pointer mr2">
          Open First
        </button>
        <button onclick="document.querySelector('#prog-accordion ytz-accordion-item:nth-child(2)').open = true"
                class="ph3 pv2 br2 bg-blue white bn pointer mr2">
          Open Second
        </button>
        <button onclick="document.querySelectorAll('#prog-accordion ytz-accordion-item').forEach(i => i.open = false)"
                class="ph3 pv2 br2 ba b--blue blue bg-transparent pointer">
          Close All
        </button>
      </div>

      <ytz-accordion id="prog-accordion" class="ba b--light-gray br2">
        <ytz-accordion-item class="bb b--light-gray">
          <button class="w-100 pa3 tl bg-transparent bn pointer f5 fw5">First Panel</button>
          <div><div class="pa3 bg-near-white">First panel content</div></div>
        </ytz-accordion-item>
        <ytz-accordion-item>
          <button class="w-100 pa3 tl bg-transparent bn pointer f5 fw5">Second Panel</button>
          <div><div class="pa3 bg-near-white">Second panel content</div></div>
        </ytz-accordion-item>
      </ytz-accordion>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto mt3"><code>// Open/close programmatically
const item = document.querySelector('ytz-accordion-item')
item.open = true
item.open = false
item.toggle()

// Listen for changes
item.addEventListener('toggle', (e) => {
  console.log('Item is now:', e.detail.open ? 'open' : 'closed')
})</code></pre>
    </section>

    <!-- Styled Variants -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Styling Variants</h2>
      <p class="lh-copy mb3">
        Style with Tachyons classes. The component has no opinions about appearance.
      </p>

      <h3 class="f5 fw6 mb2 mt4">Card Style</h3>
      <ytz-accordion class="shadow-1 br3 overflow-hidden">
        <ytz-accordion-item class="bg-white">
          <button class="w-100 pa3 tl bg-white bn pointer f5 fw6 bb b--light-gray">
            How do I reset my password?
          </button>
          <div>
            <div class="pa3 bg-near-white">
              <p class="ma0 lh-copy">
                Click the "Forgot Password" link on the login page and enter your email address.
              </p>
            </div>
          </div>
        </ytz-accordion-item>
        <ytz-accordion-item class="bg-white">
          <button class="w-100 pa3 tl bg-white bn pointer f5 fw6">
            What payment methods do you accept?
          </button>
          <div>
            <div class="pa3 bg-near-white">
              <p class="ma0 lh-copy">
                We accept Visa, Mastercard, American Express, and PayPal.
              </p>
            </div>
          </div>
        </ytz-accordion-item>
      </ytz-accordion>

      <h3 class="f5 fw6 mb2 mt4">Minimal Style</h3>
      <ytz-accordion>
        <ytz-accordion-item class="bb b--light-gray pb2 mb2">
          <button class="w-100 pa0 tl bg-transparent bn pointer f5 blue flex justify-between items-center">
            <span>Terms of Service</span>
            <span class="ytz-disclosure-icon f7">&#9660;</span>
          </button>
          <div>
            <div class="pt2">
              <p class="ma0 lh-copy f6 gray">
                By using this service you agree to our terms and conditions...
              </p>
            </div>
          </div>
        </ytz-accordion-item>
        <ytz-accordion-item>
          <button class="w-100 pa0 tl bg-transparent bn pointer f5 blue flex justify-between items-center">
            <span>Privacy Policy</span>
            <span class="ytz-disclosure-icon f7">&#9660;</span>
          </button>
          <div>
            <div class="pt2">
              <p class="ma0 lh-copy f6 gray">
                We respect your privacy and handle your data responsibly...
              </p>
            </div>
          </div>
        </ytz-accordion-item>
      </ytz-accordion>
    </section>

    <!-- Keyboard Navigation -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Keyboard Support</h2>
      <p class="lh-copy mb3">
        Native button behavior provides keyboard accessibility:
      </p>
      <ul class="lh-copy pl3 mb3">
        <li><kbd class="ph2 pv1 bg-light-gray br1 f6">Tab</kbd> - Navigate between accordion headers</li>
        <li><kbd class="ph2 pv1 bg-light-gray br1 f6">Enter</kbd> / <kbd class="ph2 pv1 bg-light-gray br1 f6">Space</kbd> - Toggle panel</li>
      </ul>
    </section>

    <!-- API Reference -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">API Reference</h2>

      <h3 class="f5 fw6 mb2">ytz-accordion Attributes</h3>
      <table class="collapse ba b--light-gray w-100 mb4">
        <thead>
          <tr class="bg-light-gray">
            <th class="pa2 tl">Attribute</th>
            <th class="pa2 tl">Type</th>
            <th class="pa2 tl">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>exclusive</code></td>
            <td class="pa2">Boolean</td>
            <td class="pa2">Only one item can be open at a time</td>
          </tr>
        </tbody>
      </table>

      <h3 class="f5 fw6 mb2">ytz-accordion-item Attributes</h3>
      <table class="collapse ba b--light-gray w-100 mb4">
        <thead>
          <tr class="bg-light-gray">
            <th class="pa2 tl">Attribute</th>
            <th class="pa2 tl">Type</th>
            <th class="pa2 tl">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>open</code></td>
            <td class="pa2">Boolean</td>
            <td class="pa2">When present, content is visible</td>
          </tr>
        </tbody>
      </table>

      <h3 class="f5 fw6 mb2">Events</h3>
      <table class="collapse ba b--light-gray w-100 mb4">
        <thead>
          <tr class="bg-light-gray">
            <th class="pa2 tl">Event</th>
            <th class="pa2 tl">Target</th>
            <th class="pa2 tl">Detail</th>
            <th class="pa2 tl">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>toggle</code></td>
            <td class="pa2">ytz-accordion-item</td>
            <td class="pa2"><code>{ open: boolean }</code></td>
            <td class="pa2">Fired when open state changes</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- React Usage -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">React Usage</h2>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>import { useState } from 'react'
import { Accordion, AccordionItem } from '@grimoire/yetzirah-react'
import '@grimoire/yetzirah-core/disclosure.css' // Optional animations

// Uncontrolled - each item manages its own state
function FAQ() {
  return (
    &lt;Accordion&gt;
      &lt;AccordionItem defaultOpen&gt;
        &lt;button&gt;Question 1&lt;/button&gt;
        &lt;div&gt;&lt;div&gt;Answer 1&lt;/div&gt;&lt;/div&gt;
      &lt;/AccordionItem&gt;
      &lt;AccordionItem&gt;
        &lt;button&gt;Question 2&lt;/button&gt;
        &lt;div&gt;&lt;div&gt;Answer 2&lt;/div&gt;&lt;/div&gt;
      &lt;/AccordionItem&gt;
    &lt;/Accordion&gt;
  )
}

// Controlled exclusive mode
function Settings() {
  const [expanded, setExpanded] = useState('account')

  return (
    &lt;Accordion exclusive&gt;
      &lt;AccordionItem
        open={expanded === 'account'}
        onToggle={(open) =&gt; setExpanded(open ? 'account' : null)}
      &gt;
        &lt;button&gt;Account&lt;/button&gt;
        &lt;div&gt;&lt;div&gt;Account settings...&lt;/div&gt;&lt;/div&gt;
      &lt;/AccordionItem&gt;
      &lt;AccordionItem
        open={expanded === 'privacy'}
        onToggle={(open) =&gt; setExpanded(open ? 'privacy' : null)}
      &gt;
        &lt;button&gt;Privacy&lt;/button&gt;
        &lt;div&gt;&lt;div&gt;Privacy settings...&lt;/div&gt;&lt;/div&gt;
      &lt;/AccordionItem&gt;
    &lt;/Accordion&gt;
  )
}</code></pre>
    </section>

    <!-- MUI Migration -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Migrating from MUI Accordion</h2>

      <table class="w-100 collapse ba b--light-gray mb4">
        <thead>
          <tr class="bg-near-white">
            <th class="pa2 tl bb b--light-gray">MUI</th>
            <th class="pa2 tl bb b--light-gray">Yetzirah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pa2 bb b--light-gray"><code>&lt;Accordion&gt;</code></td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-accordion&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>&lt;AccordionSummary&gt;</code></td>
            <td class="pa2 bb b--light-gray"><code>&lt;button&gt;</code> (first child)</td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>&lt;AccordionDetails&gt;</code></td>
            <td class="pa2 bb b--light-gray"><code>&lt;div&gt;</code> (second child)</td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>expanded={true}</code></td>
            <td class="pa2 bb b--light-gray"><code>open</code> attribute</td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>onChange={(e, exp) =&gt; ...}</code></td>
            <td class="pa2 bb b--light-gray"><code>toggle</code> event</td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>TransitionProps</code></td>
            <td class="pa2 bb b--light-gray">CSS via disclosure.css</td>
          </tr>
          <tr>
            <td class="pa2"><code>expandIcon</code></td>
            <td class="pa2">Add icon in button, use <code>ytz-disclosure-icon</code> class</td>
          </tr>
        </tbody>
      </table>

      <div class="flex flex-wrap nl2 nr2">
        <div class="w-50-ns w-100 ph2 mb3">
          <h4 class="f6 fw6 mb2 gray ttu">MUI</h4>
          <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;Accordion
  expanded={expanded === 'panel1'}
  onChange={handleChange('panel1')}
&gt;
  &lt;AccordionSummary expandIcon={&lt;ExpandMore /&gt;}&gt;
    Section 1
  &lt;/AccordionSummary&gt;
  &lt;AccordionDetails&gt;
    Content 1
  &lt;/AccordionDetails&gt;
&lt;/Accordion&gt;</code></pre>
        </div>
        <div class="w-50-ns w-100 ph2 mb3">
          <h4 class="f6 fw6 mb2 gray ttu">Yetzirah</h4>
          <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;Accordion exclusive&gt;
  &lt;AccordionItem
    open={expanded === 'panel1'}
    onToggle={(open) =&gt; setExpanded(open ? 'panel1' : null)}
  &gt;
    &lt;button&gt;
      Section 1 &lt;span className="ytz-disclosure-icon"&gt;▼&lt;/span&gt;
    &lt;/button&gt;
    &lt;div&gt;&lt;div&gt;Content 1&lt;/div&gt;&lt;/div&gt;
  &lt;/AccordionItem&gt;
&lt;/Accordion&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- Disclosure vs Accordion -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Disclosure vs Accordion</h2>
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
            <td class="pa2 bb b--light-gray">Single expandable section</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-disclosure&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray">Multiple independent sections (FAQ)</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-accordion&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray">Only one section open at a time (settings)</td>
            <td class="pa2 bb b--light-gray"><code>&lt;ytz-accordion exclusive&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2">"Show more" / "Read more" toggle</td>
            <td class="pa2"><code>&lt;ytz-disclosure&gt;</code></td>
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

- [ ] Demo shows: basic accordion, exclusive mode, programmatic control, styling variants
- [ ] Works when opened directly in browser (no build)
- [ ] Uses disclosure.css for animations (reuses existing styles)
- [ ] JSDoc complete in source files
- [ ] Demo follows existing disclosure.html structure
- [ ] MUI migration table included
- [ ] Disclosure vs Accordion guidance included

---

## Implementation Notes

### Relationship to Disclosure

Accordion items are structurally identical to Disclosure:
- Same trigger/content pattern
- Same ARIA attributes
- Same CSS animation support

The key difference is coordination:
- Disclosure: standalone, no coordination
- Accordion: parent coordinates children via toggle events

The accordion reuses `disclosure.css` for animations - no new stylesheet needed.

### CSS Selector Considerations

The animation stylesheet uses patterns like:
```css
ytz-disclosure > :last-child { ... }
ytz-disclosure[open] > :last-child { ... }
```

For accordion items to work with the same stylesheet, either:
1. Add equivalent rules for `ytz-accordion-item`
2. Or have users include accordion-specific CSS

Recommended approach: Add to disclosure.css:
```css
/* Accordion items share disclosure animation patterns */
ytz-accordion-item > :last-child { ... }
ytz-accordion-item[open] > :last-child { ... }
```

This keeps animations DRY and ensures consistency.

### Exclusive Mode Implementation

The exclusive mode is implemented via event bubbling:
1. AccordionItem dispatches `toggle` event with `bubbles: true`
2. Accordion listens for `toggle` events on itself
3. When an item opens in exclusive mode, accordion closes other items

This approach is cleaner than having items query siblings directly.

### ID Generation

Both trigger and content need IDs for ARIA linking:
- `aria-controls` on trigger → content ID
- `aria-labelledby` on content → trigger ID

Generate unique IDs if not provided by user.

---

## Downstream Dependents

None - Accordion is a leaf component in the dependency graph.

---

## Estimated Work

| PR | Complexity | Est. Time |
|----|------------|-----------|
| PR-029 | 3 | 45 min |
| PR-030 | 2 | 20 min |
| PR-031 | 2 | 25 min |
| **Total** | **7** | **~1.5 hrs** |

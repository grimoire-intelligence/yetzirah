# PR-005: Disclosure Component (Core)

## Overview
Implement `<ytz-disclosure>` - an expandable content Web Component with proper ARIA attributes. This is a foundational component that will be reused by the Accordion component (PR-029).

**Status:** Unblocked (depends only on PR-001 which is completed)
**Complexity:** 3 (haiku-level)
**Target:** < 100 lines

## Component Behavior

### Structure
The disclosure component consists of:
- A **trigger** element (button) that toggles the disclosure
- A **content** region that shows/hides based on state

### Expected DOM Structure
```html
<ytz-disclosure>
  <button slot="trigger">Show Details</button>
  <div slot="content">
    Hidden content goes here...
  </div>
</ytz-disclosure>
```

Or simpler (auto-detect first button as trigger, rest as content):
```html
<ytz-disclosure>
  <button>Show Details</button>
  <div>Hidden content goes here...</div>
</ytz-disclosure>
```

### Attributes
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | false | Controls visibility of content |

### Events
| Event | Detail | Description |
|-------|--------|-------------|
| `toggle` | `{ open: boolean }` | Fired when open state changes |

### ARIA Requirements
- Trigger button must have `aria-expanded` matching open state
- Trigger button must have `aria-controls` pointing to content ID
- Content region should have unique ID for `aria-controls` linkage
- Content visibility controlled via `hidden` attribute (CSS-animatable)

## Implementation Plan

### File: `packages/core/src/disclosure.js`

```javascript
/**
 * ytz-disclosure - Expandable content Web Component.
 * Toggles content visibility with proper ARIA attributes.
 *
 * @module @grimoire/yetzirah-core/disclosure
 * @example
 * <ytz-disclosure>
 *   <button>Show Details</button>
 *   <div>Hidden content...</div>
 * </ytz-disclosure>
 *
 * @example
 * // Controlled via attribute
 * <ytz-disclosure open>
 *   <button>Hide Details</button>
 *   <div>Visible content...</div>
 * </ytz-disclosure>
 */

let disclosureId = 0

class YtzDisclosure extends HTMLElement {
  static observedAttributes = ['open']

  #trigger = null
  #content = null
  #contentId = null

  connectedCallback() {
    this.#setup()
    this.#updateState()
  }

  disconnectedCallback() {
    this.#trigger?.removeEventListener('click', this.#handleClick)
    this.#trigger?.removeEventListener('keydown', this.#handleKeydown)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open' && this.isConnected) {
      this.#updateState()
    }
  }

  #setup() {
    // Find trigger (first button) and content (everything else)
    this.#trigger = this.querySelector('button')
    this.#content = this.#trigger?.nextElementSibling

    if (!this.#trigger || !this.#content) return

    // Generate unique ID for content
    this.#contentId = this.#content.id || `ytz-disclosure-${++disclosureId}`
    this.#content.id = this.#contentId

    // Set up ARIA
    this.#trigger.setAttribute('aria-controls', this.#contentId)

    // Attach event listeners
    this.#trigger.addEventListener('click', this.#handleClick)
    this.#trigger.addEventListener('keydown', this.#handleKeydown)
  }

  #handleClick = (e) => {
    this.toggle()
  }

  #handleKeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.toggle()
    }
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

  // Public API
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

customElements.define('ytz-disclosure', YtzDisclosure)

export { YtzDisclosure }
```

### File: `packages/core/src/disclosure.test.js`

Test cases to cover:
1. **Rendering**: Content hidden by default, shown when `open` attribute present
2. **Toggle behavior**: Clicking trigger toggles open state
3. **Keyboard support**: Enter/Space on trigger toggles state
4. **ARIA attributes**: `aria-expanded` matches open state, `aria-controls` links to content
5. **Events**: `toggle` event dispatched with correct detail
6. **Dynamic updates**: Adding/removing `open` attribute updates visibility
7. **Public API**: `open` getter/setter works correctly, `toggle()` method works

### File: `packages/core/src/index.js` (modify)

Add export:
```javascript
export { YtzDisclosure } from './disclosure.js'
```

## Acceptance Criteria Checklist
- [ ] `open` attribute toggles content visibility
- [ ] Correct ARIA attributes (aria-expanded, aria-controls)
- [ ] `toggle` event dispatched on state change
- [ ] Keyboard accessible (Enter/Space on trigger)
- [ ] < 100 lines implementation
- [ ] All tests passing

## CSS Hooks for Animation

Users can animate the disclosure using CSS:

```css
/* Content transition */
ytz-disclosure [hidden] {
  display: block !important;
  height: 0;
  overflow: hidden;
  opacity: 0;
  transition: height 0.2s, opacity 0.2s;
}

ytz-disclosure:not([hidden]) > :last-child {
  height: auto;
  opacity: 1;
}

/* Or using data attributes */
ytz-disclosure[open] > :last-child {
  /* open styles */
}
```

## Dependencies
- PR-001 (completed): Project setup provides build infrastructure

## Downstream Dependents
- PR-006: Disclosure React Wrapper
- PR-029: Accordion Component (coordinates multiple disclosures)

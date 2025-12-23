# Block 5: Tabs Component (Core + React + Demo)

## Overview

Block 5 implements the Tabs component - a tabbed interface with keyboard navigation and roving tabindex. This component creates three related elements that work together.

**PRs in sequence:**
1. PR-011: Tabs Component (Core) - complexity 5, ~90 min
2. PR-012: Tabs React Wrapper - complexity 3, ~30 min
3. PR-013: Tabs Documentation & Demo - complexity 2, ~30 min

**Dependencies:** PR-001 (completed) → PR-011 → PR-012 → PR-013

---

## PR-011: Tabs Component (Core)

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/core/src/utils/key-nav.js` | create | Internal keyboard navigation utility |
| `packages/core/src/tabs.js` | create | ytz-tabs, ytz-tab, ytz-tabpanel Web Components |
| `packages/core/src/tabs.test.js` | create | Tabs component tests |
| `packages/core/src/index.js` | modify | Export YtzTabs, YtzTab, YtzTabPanel |

### Implementation Details

#### 1. Key Navigation Utility (`utils/key-nav.js`)

Internal utility - NOT exported from package.

```javascript
/**
 * Keyboard navigation utility for arrow key navigation.
 * Handles Left/Right (horizontal) or Up/Down (vertical) navigation.
 *
 * @param {HTMLElement[]} items - Array of navigable elements
 * @param {Object} options
 * @param {'horizontal'|'vertical'} options.orientation - Arrow key direction
 * @param {boolean} options.wrap - Wrap around at ends (default: true)
 * @returns {{ handleKeyDown: (e: KeyboardEvent) => void }}
 */
export function createKeyNav(items, options = {}) {
  const { orientation = 'horizontal', wrap = true } = options

  const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'

  return {
    handleKeyDown(event) {
      const currentIndex = items.indexOf(document.activeElement)
      if (currentIndex === -1) return

      let newIndex
      if (event.key === prevKey) {
        newIndex = currentIndex - 1
        if (newIndex < 0) newIndex = wrap ? items.length - 1 : 0
      } else if (event.key === nextKey) {
        newIndex = currentIndex + 1
        if (newIndex >= items.length) newIndex = wrap ? 0 : items.length - 1
      } else if (event.key === 'Home') {
        newIndex = 0
      } else if (event.key === 'End') {
        newIndex = items.length - 1
      } else {
        return
      }

      event.preventDefault()
      items[newIndex].focus()
    }
  }
}
```

**Requirements:**
- Support horizontal (Left/Right) and vertical (Up/Down) modes
- Home/End for first/last navigation
- Wrap around at ends (configurable)
- < 50 lines

#### 2. Tabs Component (`tabs.js`)

Three related Web Components that work together:

```javascript
/**
 * ytz-tabs - Container for tabbed interface.
 * Coordinates tab selection and panel visibility.
 *
 * @example
 * <ytz-tabs>
 *   <ytz-tab slot="tabs" panel="panel1">Tab 1</ytz-tab>
 *   <ytz-tab slot="tabs" panel="panel2">Tab 2</ytz-tab>
 *   <ytz-tabpanel id="panel1">Content 1</ytz-tabpanel>
 *   <ytz-tabpanel id="panel2">Content 2</ytz-tabpanel>
 * </ytz-tabs>
 */
class YtzTabs extends HTMLElement {
  static observedAttributes = ['value']

  connectedCallback() {
    this.setAttribute('role', 'tablist')

    // Set up keyboard navigation
    this.addEventListener('keydown', this.#handleKeyDown.bind(this))

    // Initialize first tab if no value set
    if (!this.hasAttribute('value')) {
      const firstTab = this.querySelector('ytz-tab')
      if (firstTab?.getAttribute('panel')) {
        this.value = firstTab.getAttribute('panel')
      }
    }
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(v) {
    const oldValue = this.value
    this.setAttribute('value', v)
    if (oldValue !== v) {
      this.#updateSelection()
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        detail: { value: v }
      }))
    }
  }

  #updateSelection() {
    const value = this.value

    // Update tabs
    this.querySelectorAll('ytz-tab').forEach(tab => {
      const isSelected = tab.getAttribute('panel') === value
      tab.setAttribute('aria-selected', isSelected)
      tab.setAttribute('tabindex', isSelected ? '0' : '-1')
    })

    // Update panels
    this.querySelectorAll('ytz-tabpanel').forEach(panel => {
      panel.hidden = panel.id !== value
    })
  }

  #handleKeyDown(event) {
    // Delegate to key-nav utility
  }
}

/**
 * ytz-tab - Individual tab button.
 * Must be used within ytz-tabs.
 *
 * @attr panel - ID of associated tabpanel
 */
class YtzTab extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'tab')
    this.setAttribute('tabindex', '-1')

    const panelId = this.getAttribute('panel')
    if (panelId) {
      this.setAttribute('aria-controls', panelId)
    }

    this.addEventListener('click', () => {
      const tabs = this.closest('ytz-tabs')
      if (tabs) tabs.value = this.getAttribute('panel')
    })
  }
}

/**
 * ytz-tabpanel - Tab panel content.
 * Must have id matching a ytz-tab's panel attribute.
 */
class YtzTabPanel extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'tabpanel')
    this.hidden = true

    // Set aria-labelledby to associated tab
    const tabs = this.closest('ytz-tabs')
    if (tabs) {
      const tab = tabs.querySelector(`ytz-tab[panel="${this.id}"]`)
      if (tab) {
        tab.id = tab.id || `tab-${this.id}`
        this.setAttribute('aria-labelledby', tab.id)
      }
    }
  }
}
```

**Attributes:**
- `ytz-tabs`:
  - `value` - ID of currently selected panel
  - `orientation` - 'horizontal' (default) or 'vertical'
- `ytz-tab`:
  - `panel` - ID of associated tabpanel
- `ytz-tabpanel`:
  - `id` - Panel identifier (required)

**Events:**
- `change` - Dispatched on ytz-tabs when selection changes (bubbles: true, detail: { value })

**Behavior:**
- Arrow keys navigate between tabs
- Only active tab is in tab order (roving tabindex)
- Correct ARIA roles and states set automatically
- Panels show/hide based on selection

**Line budget:** < 200 lines total (all three components + utility)

#### 3. Tests (`tabs.test.js`)

```javascript
describe('YtzTabs', () => {
  // Structure
  test('has role="tablist"')
  test('ytz-tab has role="tab"')
  test('ytz-tabpanel has role="tabpanel"')

  // ARIA
  test('active tab has aria-selected="true"')
  test('inactive tabs have aria-selected="false"')
  test('active tab has tabindex="0"')
  test('inactive tabs have tabindex="-1"')
  test('tab has aria-controls pointing to panel')
  test('panel has aria-labelledby pointing to tab')

  // Selection
  test('first tab selected by default')
  test('clicking tab selects it')
  test('setting value selects corresponding tab')
  test('dispatches change event on selection')

  // Keyboard
  test('ArrowRight moves to next tab')
  test('ArrowLeft moves to previous tab')
  test('Home moves to first tab')
  test('End moves to last tab')
  test('wraps from last to first')
  test('wraps from first to last')

  // Panels
  test('only selected panel is visible')
  test('hidden panels have hidden attribute')
})

describe('Vertical Tabs', () => {
  test('ArrowDown moves to next tab')
  test('ArrowUp moves to previous tab')
})
```

#### 4. Index Export

```javascript
// Add to packages/core/src/index.js
export { YtzTabs, YtzTab, YtzTabPanel } from './tabs.js'
```

### Acceptance Criteria

- [ ] Arrow keys navigate tabs (Left/Right or Up/Down based on orientation)
- [ ] Only active tab in tab order (roving tabindex)
- [ ] Correct ARIA roles (tablist, tab, tabpanel) and states (aria-selected)
- [ ] `change` event dispatched on tab switch
- [ ] < 200 lines total
- [ ] All tests pass

---

## PR-012: Tabs React Wrapper

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/react/src/tabs.js` | create | React wrappers for all three components |
| `packages/react/src/tabs.test.js` | create | Wrapper tests |
| `packages/react/src/index.js` | modify | Export Tabs, Tab, TabPanel |

### Implementation Details

#### 1. Tabs Wrappers (`tabs.js`)

```javascript
/**
 * React wrappers for ytz-tabs components.
 *
 * @example
 * <Tabs value={activeTab} onChange={setActiveTab}>
 *   <Tab panel="one">Tab 1</Tab>
 *   <Tab panel="two">Tab 2</Tab>
 *   <TabPanel id="one">Content 1</TabPanel>
 *   <TabPanel id="two">Content 2</TabPanel>
 * </Tabs>
 */
import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

export const Tabs = forwardRef(function Tabs(
  { value, onChange, orientation, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Sync value prop to attribute
  useEffect(() => {
    const el = innerRef.current
    if (!el || !value) return
    if (el.value !== value) {
      el.value = value
    }
  }, [value])

  // Bridge change event
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const handleChange = (e) => onChange?.(e.detail.value)
    el.addEventListener('change', handleChange)
    return () => el.removeEventListener('change', handleChange)
  }, [onChange])

  return (
    <ytz-tabs
      ref={innerRef}
      class={className}
      orientation={orientation}
      {...props}
    >
      {children}
    </ytz-tabs>
  )
})

export const Tab = forwardRef(function Tab(
  { panel, className, children, ...props },
  ref
) {
  return (
    <ytz-tab ref={ref} panel={panel} class={className} {...props}>
      {children}
    </ytz-tab>
  )
})

export const TabPanel = forwardRef(function TabPanel(
  { id, className, children, ...props },
  ref
) {
  return (
    <ytz-tabpanel ref={ref} id={id} class={className} {...props}>
      {children}
    </ytz-tabpanel>
  )
})
```

**Props:**
- `Tabs`:
  - `value` - Currently selected panel ID
  - `onChange` - Callback when selection changes (receives panel ID)
  - `orientation` - 'horizontal' or 'vertical'
  - `className` - CSS classes
  - `ref` - Forwarded ref
- `Tab`:
  - `panel` - ID of associated panel
  - `className` - CSS classes
  - `ref` - Forwarded ref
- `TabPanel`:
  - `id` - Panel identifier
  - `className` - CSS classes
  - `ref` - Forwarded ref

**Line budget:** < 50 lines per component (~100 total)

#### 2. Tests (`tabs.test.js`)

```javascript
describe('Tabs (React)', () => {
  test('renders children')
  test('syncs value prop to element')
  test('calls onChange when change event fires')
  test('forwards ref to element')
  test('passes className as class attribute')
  test('passes orientation attribute')
})

describe('Tab (React)', () => {
  test('renders children')
  test('passes panel attribute')
  test('forwards ref')
})

describe('TabPanel (React)', () => {
  test('renders children')
  test('passes id attribute')
  test('forwards ref')
})
```

#### 3. Index Export

```javascript
// Add to packages/react/src/index.js
export { Tabs, Tab, TabPanel } from './tabs.js'
```

### Acceptance Criteria

- [ ] All three components wrapped (Tabs, Tab, TabPanel)
- [ ] `onChange` callback on Tabs works
- [ ] Ref forwarding works for all components
- [ ] < 50 lines per component

---

## PR-013: Tabs Documentation & Demo

### Files to Create

| File | Action | Description |
|------|--------|-------------|
| `demos/tabs.html` | create | Static HTML demo page |

### Demo Structure

Following the pattern from existing demos:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Tabs - Yetzirah Demo</title>
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">
  <script type="module" src="../packages/core/dist/index.js"></script>
  <style>
    /* Optional: Basic styling for demo */
    ytz-tabs {
      display: block;
    }
    ytz-tab {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }
    ytz-tab[aria-selected="true"] {
      border-bottom-color: currentColor;
      font-weight: 600;
    }
    ytz-tabpanel {
      padding: 1rem;
    }
  </style>
</head>
<body class="sans-serif pa4 mw8 center">
  <header>
    <nav><a href="index.html">&larr; All Components</a></nav>
    <h1>Tabs</h1>
    <p>Tabbed interface with keyboard navigation and roving tabindex.</p>
  </header>

  <main>
    <!-- Basic Tabs -->
    <section class="mv4">
      <h2>Basic Tabs</h2>
      <ytz-tabs class="ba b--light-gray br2">
        <div class="flex bb b--light-gray">
          <ytz-tab panel="tab1">Account</ytz-tab>
          <ytz-tab panel="tab2">Password</ytz-tab>
          <ytz-tab panel="tab3">Notifications</ytz-tab>
        </div>
        <ytz-tabpanel id="tab1">
          <h3>Account Settings</h3>
          <p>Manage your account details here.</p>
        </ytz-tabpanel>
        <ytz-tabpanel id="tab2">
          <h3>Password Settings</h3>
          <p>Change your password and security settings.</p>
        </ytz-tabpanel>
        <ytz-tabpanel id="tab3">
          <h3>Notification Preferences</h3>
          <p>Control how you receive notifications.</p>
        </ytz-tabpanel>
      </ytz-tabs>
    </section>

    <!-- Vertical Tabs -->
    <section class="mv4">
      <h2>Vertical Tabs</h2>
      <ytz-tabs orientation="vertical" class="flex ba b--light-gray br2">
        <div class="flex flex-column br b--light-gray">
          <ytz-tab panel="v1">General</ytz-tab>
          <ytz-tab panel="v2">Privacy</ytz-tab>
          <ytz-tab panel="v3">Advanced</ytz-tab>
        </div>
        <div class="flex-auto">
          <ytz-tabpanel id="v1">General settings content</ytz-tabpanel>
          <ytz-tabpanel id="v2">Privacy settings content</ytz-tabpanel>
          <ytz-tabpanel id="v3">Advanced settings content</ytz-tabpanel>
        </div>
      </ytz-tabs>
    </section>

    <!-- Controlled Tabs (with JS) -->
    <section class="mv4">
      <h2>Programmatic Control</h2>
      <div class="mv2">
        <button onclick="document.getElementById('prog-tabs').value = 'prog1'">Select Tab 1</button>
        <button onclick="document.getElementById('prog-tabs').value = 'prog2'">Select Tab 2</button>
      </div>
      <ytz-tabs id="prog-tabs">
        <div class="flex">
          <ytz-tab panel="prog1">First</ytz-tab>
          <ytz-tab panel="prog2">Second</ytz-tab>
        </div>
        <ytz-tabpanel id="prog1">First panel content</ytz-tabpanel>
        <ytz-tabpanel id="prog2">Second panel content</ytz-tabpanel>
      </ytz-tabs>
    </section>

    <!-- Styling Examples -->
    <section class="mv4">
      <h2>Styling with Tachyons</h2>
      <p>Tabs are unstyled by default. Use Tachyons classes for appearance:</p>
      <pre class="bg-near-white pa3 br2 f6"><code>&lt;ytz-tabs class="ba b--light-gray br2"&gt;
  &lt;div class="flex bb b--light-gray bg-near-white"&gt;
    &lt;ytz-tab panel="a" class="pa3 pointer hover-bg-light-gray"&gt;Tab A&lt;/ytz-tab&gt;
    &lt;ytz-tab panel="b" class="pa3 pointer hover-bg-light-gray"&gt;Tab B&lt;/ytz-tab&gt;
  &lt;/div&gt;
  &lt;ytz-tabpanel id="a" class="pa3"&gt;Content A&lt;/ytz-tabpanel&gt;
  &lt;ytz-tabpanel id="b" class="pa3"&gt;Content B&lt;/ytz-tabpanel&gt;
&lt;/ytz-tabs&gt;</code></pre>
    </section>

    <!-- React Usage -->
    <section class="mv4">
      <h2>React Usage</h2>
      <pre class="bg-near-white pa3 br2 f6"><code>import { Tabs, Tab, TabPanel } from '@grimoire/yetzirah-react'

function Settings() {
  const [activeTab, setActiveTab] = useState('account')

  return (
    &lt;Tabs value={activeTab} onChange={setActiveTab}&gt;
      &lt;Tab panel="account"&gt;Account&lt;/Tab&gt;
      &lt;Tab panel="password"&gt;Password&lt;/Tab&gt;
      &lt;TabPanel id="account"&gt;Account settings...&lt;/TabPanel&gt;
      &lt;TabPanel id="password"&gt;Password settings...&lt;/TabPanel&gt;
    &lt;/Tabs&gt;
  )
}</code></pre>
    </section>

    <!-- Keyboard Navigation -->
    <section class="mv4">
      <h2>Keyboard Navigation</h2>
      <table class="collapse ba b--light-gray w-100">
        <thead>
          <tr class="bg-near-white">
            <th class="pa2 tl">Key</th>
            <th class="pa2 tl">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="pa2 bb b--light-gray"><kbd>Tab</kbd></td><td class="pa2 bb b--light-gray">Move to active tab, then to panel</td></tr>
          <tr><td class="pa2 bb b--light-gray"><kbd>&larr;</kbd> / <kbd>&rarr;</kbd></td><td class="pa2 bb b--light-gray">Navigate between tabs (horizontal)</td></tr>
          <tr><td class="pa2 bb b--light-gray"><kbd>&uarr;</kbd> / <kbd>&darr;</kbd></td><td class="pa2 bb b--light-gray">Navigate between tabs (vertical)</td></tr>
          <tr><td class="pa2 bb b--light-gray"><kbd>Home</kbd></td><td class="pa2 bb b--light-gray">Move to first tab</td></tr>
          <tr><td class="pa2"><kbd>End</kbd></td><td class="pa2">Move to last tab</td></tr>
        </tbody>
      </table>
    </section>

    <!-- MUI Migration -->
    <section class="mv4">
      <h2>MUI Migration</h2>
      <table class="collapse ba b--light-gray w-100">
        <thead>
          <tr class="bg-near-white">
            <th class="pa2 tl">MUI</th>
            <th class="pa2 tl">Yetzirah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pa2 bb b--light-gray"><code>&lt;Tabs value={0}&gt;</code></td>
            <td class="pa2 bb b--light-gray"><code>&lt;Tabs value="panel-id"&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>onChange={(e, val) => ...}</code></td>
            <td class="pa2 bb b--light-gray"><code>onChange={val => ...}</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>&lt;Tab label="Tab 1" /&gt;</code></td>
            <td class="pa2 bb b--light-gray"><code>&lt;Tab panel="id"&gt;Tab 1&lt;/Tab&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>&lt;TabPanel value={0} index={0}&gt;</code></td>
            <td class="pa2 bb b--light-gray"><code>&lt;TabPanel id="id"&gt;</code></td>
          </tr>
          <tr>
            <td class="pa2 bb b--light-gray"><code>orientation="vertical"</code></td>
            <td class="pa2 bb b--light-gray"><code>orientation="vertical"</code></td>
          </tr>
          <tr>
            <td class="pa2"><code>variant="scrollable"</code></td>
            <td class="pa2">Use CSS <code>overflow-x: auto</code></td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>
```

### Acceptance Criteria

- [ ] Demo shows: basic tabs, vertical tabs, dynamic content
- [ ] Works when opened directly in browser (no build)
- [ ] JSDoc complete in source files
- [ ] Demo follows existing structure

---

## Implementation Notes

### Slot-based vs Query-based

Two approaches for finding tabs/panels:

1. **Slots** - Use named slots for tabs area
2. **Query** - Query children directly

Recommend query-based for simplicity:
- `this.querySelectorAll('ytz-tab')` for tabs
- `this.querySelectorAll('ytz-tabpanel')` for panels

### ID Generation

Tabs need IDs for aria-labelledby. Generate if missing:

```javascript
tab.id = tab.id || `ytz-tab-${crypto.randomUUID().slice(0, 8)}`
```

### Manual vs Automatic Activation

WAI-ARIA has two patterns:
1. **Automatic** - Arrow keys move focus AND select tab
2. **Manual** - Arrow keys move focus, Enter/Space selects

Recommend automatic for simpler UX. The panel changes as you arrow through tabs.

### CSS Considerations

Tabs should work without CSS, but typical styling:

```css
ytz-tabs {
  display: block;
}

/* Horizontal tab list */
ytz-tabs > [role="tablist"],
ytz-tabs > div:has(ytz-tab) {
  display: flex;
}

/* Vertical orientation */
ytz-tabs[orientation="vertical"] {
  display: flex;
}

ytz-tabs[orientation="vertical"] > div:has(ytz-tab) {
  flex-direction: column;
}

/* Active tab indicator */
ytz-tab[aria-selected="true"] {
  border-bottom: 2px solid currentColor;
}
```

---

## Estimated Work

| PR | Complexity | Est. Time |
|----|------------|-----------|
| PR-011 | 5 | 90 min |
| PR-012 | 3 | 30 min |
| PR-013 | 2 | 30 min |
| **Total** | **10** | **~2.5 hrs** |

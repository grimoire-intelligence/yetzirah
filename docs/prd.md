# Yetzirah

**The world of formation.**

---

## Philosophy

**HTML is good—stop overcomplicating it.**
**CSS is good—stop obfuscating it.**
**Material is good—stop bloating it.**

HTML already has buttons, inputs, forms, and semantic structure. CSS already has layout, typography, and spacing. The browser already handles focus, scrolling, and events. We don't need to reinvent these. We need to fill the gaps.

Material UI solved the behavioral complexity of modern components—dialogs, dropdowns, autocomplete, accessible tabs. But it buried those solutions under a styling runtime, a theme engine, and hundreds of kilobytes of abstraction. Worse, that complexity makes MUI actively hostile to AI-assisted development: no LLM can hold MUI's API surface in context, so your copilot hallucinates props that don't exist.

Yetzirah extracts what MUI got right and discards everything else.

---

## Principles

**Platform-native.** Web Components extend the DOM rather than replacing it. Custom elements are real HTML elements. Events are real events. The browser is the runtime.

**AI-native.** The entire framework—source, documentation, component APIs—fits in a single LLM context window. Your AI assistant doesn't guess at Yetzirah; it *knows* Yetzirah.

**Framework-agnostic.** The core is Web Components. React, Vue, Svelte, Angular get thin wrappers. Vanilla HTML needs no wrapper at all.

**No-pinionated.** Not unopinionated—that implies there were opinions to remove. Yetzirah has no opinions about styling because styling isn't its job. It provides behavior and accessibility. You provide appearance.

**Readable source.** If a component can't be understood by reading it, it's too complex. Every component fits in a single file. Implementation is documentation.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              @grimoire/yetzirah-core                 │
│    Web Components (light DOM, no Shadow)    │
│  <ytz-dialog>, <ytz-autocomplete>, etc.     │
└─────────────────────────────────────────────┘
                     │
     ┌───────┬───────┼───────┬───────┐
     ▼       ▼       ▼       ▼       ▼
   React    Vue   Svelte  Angular  Vanilla
  wrapper  wrapper wrapper wrapper  (no wrapper)
```

**Why light DOM (no Shadow DOM):**

- Yetzirah ships no styles, so encapsulation solves nothing
- Tachyons and user CSS work naturally
- Framework integration is simpler (no `::part()` gymnastics)
- Custom elements as behavior boundaries, not style boundaries

**Why no Lit:**

- Raw `HTMLElement` is sufficient for behavioral components
- Zero dependencies in core
- Smaller bundle
- Forces simplicity

---

## Phased Rollout

### Phase 1: Core + React

Ship the foundation and the largest market.

- `@grimoire/yetzirah-core` — Web Components, works in vanilla HTML
- `@grimoire/yetzirah-react` — Thin wrappers for React integration
- NPM distribution primary, CDN available
- Tachyons recommended for styling, any CSS works

**Target audience:** React developers migrating from MUI; vanilla HTML developers who want behavioral components without frameworks.

### Phase 2: Vue, Svelte, Angular

Expand to the rest of the framework market.

- `@grimoire/yetzirah-vue` — Vue 3 wrappers with proper reactivity binding
- `@grimoire/yetzirah-svelte` — Svelte wrappers (likely thinnest of all)
- `@grimoire/yetzirah-angular` — Angular wrappers with change detection integration

**Target audience:** Everyone else who hates their framework's Material implementation.

### Phase 3: CDN-First Distribution

Optimize for buildless and global deployment.

- Single-file bundles for each component
- ESM imports from CDN
- Documentation for Preact + HTM usage (wrapper optional)
- Sub-10kb total for core + all Tier 1 components

**Target audience:** Developers without build steps, applications serving bandwidth-constrained users.

### Phase 4: Extensions, Additional Components & Distribution

Extend to minimalist frameworks, ship additional components, and finalize npm distribution.

#### NPM Distribution Setup

Finalize `@grimoire` organization on npmjs.com and publish all packages. Until then, CDN distribution via jsDelivr/unpkg serves as primary distribution channel.

#### Additional Components

| Component | Element | Notes |
|-----------|---------|-------|
| **Snackbar/Toast** | `<ytz-snackbar>` | Queue management, auto-dismiss, stacking, position anchoring |
| **Progress/Spinner** | `<ytz-progress>` | Mostly CSS. Indeterminate and determinate modes. Circular and linear variants. |
| **Badge** | `<ytz-badge>` | Notification dot/count overlay. Positioned relative to slotted content. |
| **Carousel** | `<ytz-carousel>` | *Maybe.* Stripped-down version—no infinite scroll, no autoplay by default. Touch/swipe, keyboard nav, dots/arrows. Based on existing MUI-idiomatic implementation. |

#### Solid.js Wrappers (`@grimoire/yetzirah-solid`)

Solid.js developers prioritize fine-grained reactivity and minimal overhead—the same values Yetzirah embodies. The wrapper will be thin, leveraging Solid's excellent Web Component interop.

- Native signal integration for component state
- Ref forwarding with Solid's reactive primitives
- Event handler bridging (`on:close` → `addEventListener`)
- SSR-compatible (Solid Start)

**Why Solid fits:** Solid compiles away the framework, leaving only DOM operations—philosophically aligned with "the platform is sufficient."

#### Alpine.js Plugin (`@grimoire/yetzirah-alpine`)

Alpine.js is the jQuery of the modern era: progressive enhancement without build steps. Its CDN-first distribution makes it a natural complement to Yetzirah's Phase 3 work.

**The problem:** Yetzirah components dispatch `CustomEvent` with data in `event.detail.value`. Alpine expects `event.target.value` (like native form elements). This impedance mismatch requires boilerplate to bridge.

**The solution:** An `x-ytz` directive that harmonizes event handling:

```html
<!-- Without plugin: manual event.detail extraction -->
<yz-select @change="value = $event.detail.value">

<!-- With x-ytz: Alpine-native experience -->
<yz-select x-ytz @change="value = $event.target.value">
```

**Plugin responsibilities:**
- `x-ytz` directive: Patches element to expose `event.detail.value` as `event.target.value`
- `x-ytz:model` directive: Two-way binding for form components (Select, Autocomplete, Toggle)
- Auto-detection of Yetzirah components (no manual `x-ytz` needed if plugin is loaded)
- Alpine magics: `$ytz.open()`, `$ytz.close()` for imperative control

**Example:**

```html
<div x-data="{ country: '' }">
  <yz-select x-ytz:model="country">
    <yz-option value="us">United States</yz-option>
    <yz-option value="uk">United Kingdom</yz-option>
  </yz-select>

  <p>Selected: <span x-text="country"></span></p>
</div>
```

**Target audience:**
- Solid.js: Performance-obsessed developers who find React too heavy
- Alpine.js: Server-rendered apps (Rails, Laravel, Django) adding interactivity without SPAs

---

## Technical Foundation

### Core (`@grimoire/yetzirah-core`)

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Base class | `HTMLElement` | No library overhead. Platform-native. |
| Shadow DOM | No (light DOM) | Styling is user's concern. Simpler integration. |
| Dependencies | Zero | The platform is sufficient. |

### Framework Wrappers

| Package | Responsibility |
|---------|---------------|
| `@grimoire/yetzirah-react` | `onX` → `addEventListener` bridging, ref forwarding, boolean attribute handling |
| `@grimoire/yetzirah-vue` | `v-model` support, `.sync` handling, event mapping |
| `@grimoire/yetzirah-svelte` | Event forwarding, reactive attribute binding |
| `@grimoire/yetzirah-angular` | `ControlValueAccessor` for forms, change detection |
| `@grimoire/yetzirah-solid` | Signal integration, fine-grained reactivity binding |
| `@grimoire/yetzirah-alpine` | `x-ytz` directive, `event.detail` → `event.target` bridging |

Wrappers are thin. If a wrapper exceeds 50 lines per component, something is wrong.

### No Wrapper Needed

Some frameworks have native Web Component interop and need no wrapper:

| Framework | Why It Works |
|-----------|--------------|
| **Lit** | Built on Web Components. Yetzirah elements compose with Lit elements naturally—they're the same technology. |
| **HTMX** | HTML-centric, attribute-driven. Yetzirah's `<ytz-*>` elements work like any HTML element with `hx-*` attributes. |
| **Stencil** | Compiles to Web Components. Native interop with other custom elements including Yetzirah. |

These frameworks can import `@grimoire/yetzirah-core` directly and use `<ytz-dialog>`, `<ytz-menu>`, etc. without any bridging code.

---

## Distribution

### CDN (Phase 3 — Primary)

CDN is the primary distribution channel until npm organization is finalized in Phase 4.

```html
<!-- Core components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>

<!-- Individual components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/dialog.js"></script>
```

### NPM (Phase 4)

npm publishing deferred until `@grimoire` organization is claimed on npmjs.com.

```bash
# Core only (vanilla HTML)
npm install @grimoire/yetzirah-core

# With React wrappers
npm install @grimoire/yetzirah-core @grimoire/yetzirah-react

# With Vue wrappers
npm install @grimoire/yetzirah-core @grimoire/yetzirah-vue
```

---

## Component Priority

### Tier 1: The Hard Problems

Components where DIY implementation is painful and accessibility is hard to get right. These are why Yetzirah exists.

| Component | Element | Core Complexity |
|-----------|---------|-----------------|
| **Dialog/Modal** | `<ytz-dialog>` | Focus trapping, scroll locking, escape-to-close, aria-modal, restore focus on close |
| **Autocomplete** | `<ytz-autocomplete>` | Text input with filtering, keyboard nav, single/multi-select, aria-combobox, async loading |
| **Menu** | `<ytz-menu>` | Positioning, keyboard nav, click-outside, focus management, aria-menu, submenus |
| **Tabs** | `<ytz-tabs>` | aria-tablist, keyboard arrow navigation, roving tabindex |
| **Tooltip** | `<ytz-tooltip>` | Positioning, delay logic, aria-describedby, hover/focus/touch handling |
| **Disclosure** | `<ytz-disclosure>` | aria-expanded, animation-friendly open/close |
| **Button** | `<ytz-button>` | Polymorphic button/anchor based on props (see below) |

**Note on Button:**

This seems trivial but solves a real problem: developers think of buttons and link-buttons as the same component, but HTML doesn't allow `<button>` inside `<a>` or vice versa. MUI's Button handles this with a `component` prop and ~1000 lines of code.

Yetzirah's approach is simpler:

```
<ytz-button href="...">  → renders <a>
<ytz-button onclick="..."> → renders <button>
```

**Default classes prepended:**

| Rendered as | Prepended classes |
|-------------|-------------------|
| `<a>` | `pointer font-inherit no-underline dib` |
| `<button>` | `pointer font-inherit bn bg-transparent` |

User-supplied classes follow, allowing full customization:

```html
<!-- Link styled as button -->
<ytz-button href="/dashboard" class="ph3 pv2 br2 white bg-blue">
  Go to Dashboard
</ytz-button>
<!-- Renders: <a href="/dashboard" class="pointer font-inherit no-underline dib ph3 pv2 br2 white bg-blue"> -->

<!-- Actual button -->
<ytz-button onclick="handleSubmit()" class="ph3 pv2 br2 white bg-blue">
  Submit
</ytz-button>
<!-- Renders: <button class="pointer font-inherit bn bg-transparent ph3 pv2 br2 white bg-blue"> -->
```

Accessibility is handled by using the correct element—`<a>` for navigation, `<button>` for actions. No ARIA gymnastics required.

Edge case: supplying both `href` and `onclick` renders an `<a>` with the click handler attached. Valid HTML, occasionally useful (e.g., tracking clicks before navigation), but rare enough that it's a "you know what you're doing" situation.

**Derived components:**

| Component | Element | Derives From | Delta |
|-----------|---------|--------------|-------|
| **Listbox** | `<ytz-listbox>` | Autocomplete | Remove text input and filtering |
| **Select** | `<ytz-select>` | Listbox | Add trigger button |
| **Accordion** | `<ytz-accordion>` | Disclosure | Coordinated disclosures, exclusive mode |
| **Drawer** | `<ytz-drawer>` | Dialog | Slide-in positioning, edge anchoring |
| **Popover** | `<ytz-popover>` | Tooltip | Click-triggered, richer content |

### Tier 2: Useful Conveniences

| Component | Element | Core Complexity |
|-----------|---------|-----------------|
| **Toggle/Switch** | `<ytz-toggle>` | Checkbox semantics with aria-checked |
| **Slider** | `<ytz-slider>` | aria-slider, keyboard control, range support |
| **Chip** | `<ytz-chip>` | Deletable tag/label with keyboard support. `deletable` attribute shows × button, dispatches `delete` event. Future: drag API for reordering, chip input for tag entry. ~30 lines. |
| **IconButton** | `<ytz-icon-button>` | Button variant requiring aria-label, optional integrated tooltip |
| **DataGrid** | `<ytz-datagrid>` | Virtual scroll, sort, filter, keyboard nav, CSV export. No pivot tables—YAGNI. |
| **Dark Theme CSS** | `dark.css` | Optional override stylesheet using CSS custom properties. `[data-theme="dark"]` selector remaps Tachyons color classes. Respects `prefers-color-scheme: dark` by default. No JS runtime—pure CSS. Toggle manually via `document.documentElement.dataset.theme = 'dark'`. |
| **Theme Toggle** | `<ytz-theme-toggle>` | Wraps `<ytz-toggle>` with theme-switching behavior: reads `prefers-color-scheme` on init, persists user preference to `localStorage`, toggles `data-theme` attribute on `<html>`, dispatches `themechange` events. Depends on Toggle. |

### Tier 3: Not Needed

HTML primitives plus CSS already handle these. Yetzirah does not ship:

- Card → `<div>`
- Typography → semantic HTML
- Grid/Layout → CSS

---

## Shared Utilities

```
position()      → Menu, Autocomplete, Tooltip, Popover
focusTrap()     → Dialog, Drawer
clickOutside()  → Dialog, Menu, Autocomplete, Popover
keyNav()        → Menu, Autocomplete, Tabs, Listbox
```

These live in `@grimoire/yetzirah-core` as internal utilities. Not exported—implementation details.

---

## Positioning Engine

Minimal native alternative to Floating UI.

**In scope:**
- Anchor-relative positioning (top, bottom, left, right + alignment)
- Flip when near viewport edge
- Shift to stay in viewport
- Window resize updates

**Out of scope:**
- Nested scroll containers
- Virtual elements
- Middleware system

**Target:** < 100 lines. Documented limitation: "Don't put dropdowns inside overflow:scroll containers."

---

## Component Contract

Every Yetzirah component guarantees:

1. **Accessible by default.** Correct ARIA, keyboard nav, focus management.

2. **Attribute-driven.** State controlled via HTML attributes. `open`, `disabled`, `value`, etc.

3. **Event-based communication.** Components dispatch native `CustomEvent`s. No framework-specific callbacks in core.

4. **No style injection.** Zero CSS. Class names and structure for your styling.

5. **Light DOM.** Children are real DOM children. Slots where needed.

6. **Readable implementation.** Single file per component. < 200 lines.

---

## Example: Dialog

### Vanilla HTML

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>

<ytz-button onclick="document.getElementById('my-dialog').setAttribute('open', '')" class="ph3 pv2 br2 white bg-blue">
  Open Dialog
</ytz-button>

<ytz-dialog id="my-dialog" class="pa4 bg-white br3 shadow-1">
  <h2 class="f4 fw6 mt0">Dialog Title</h2>
  <p class="lh-copy">Content goes here.</p>
  <ytz-button onclick="document.getElementById('my-dialog').removeAttribute('open')" class="ph3 pv2 br2 white bg-blue">
    Close
  </ytz-button>
</ytz-dialog>
```

### React

```jsx
import { Dialog, Button } from '@grimoire/yetzirah-react'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="ph3 pv2 br2 white bg-blue">
        Open Dialog
      </Button>
      
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        className="pa4 bg-white br3 shadow-1"
      >
        <h2 className="f4 fw6 mt0">Dialog Title</h2>
        <p className="lh-copy">Content goes here.</p>
        <Button onClick={() => setOpen(false)} className="ph3 pv2 br2 white bg-blue">
          Close
        </Button>
      </Dialog>
    </>
  )
}
```

### Vue

```vue
<script setup>
import { Dialog, Button } from '@grimoire/yetzirah-vue'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <Button @click="open = true" class="ph3 pv2 br2 white bg-blue">
    Open Dialog
  </Button>
  
  <Dialog 
    :open="open" 
    @close="open = false"
    class="pa4 bg-white br3 shadow-1"
  >
    <h2 class="f4 fw6 mt0">Dialog Title</h2>
    <p class="lh-copy">Content goes here.</p>
    <Button @click="open = false" class="ph3 pv2 br2 white bg-blue">
      Close
    </Button>
  </Dialog>
</template>
```

### Svelte

```svelte
<script>
  import { Dialog, Button } from '@grimoire/yetzirah-svelte'
  let open = false
</script>

<Button on:click={() => open = true} class="ph3 pv2 br2 white bg-blue">
  Open Dialog
</Button>

<Dialog 
  {open} 
  on:close={() => open = false}
  class="pa4 bg-white br3 shadow-1"
>
  <h2 class="f4 fw6 mt0">Dialog Title</h2>
  <p class="lh-copy">Content goes here.</p>
  <Button on:click={() => open = false} class="ph3 pv2 br2 white bg-blue">
    Close
  </Button>
</Dialog>
```

**What Dialog handles:**
- Focus trap while open
- Restore focus to trigger on close
- Escape to close
- Backdrop click to close (configurable)
- Body scroll lock
- aria-modal, role="dialog"

**What you handle:**
- All styling
- Content and layout
- Close button

---

## Core Implementation Pattern

```javascript
// @grimoire/yetzirah-core/dialog.js

class YtzDialog extends HTMLElement {
  static observedAttributes = ['open']
  
  #previousFocus = null
  
  connectedCallback() {
    this.setAttribute('role', 'dialog')
    this.setAttribute('aria-modal', 'true')
    this.addEventListener('keydown', this.#handleKeydown)
  }
  
  disconnectedCallback() {
    this.removeEventListener('keydown', this.#handleKeydown)
    this.#releaseFocusTrap()
  }
  
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open') {
      newVal !== null ? this.#open() : this.#close()
    }
  }
  
  #open() {
    this.#previousFocus = document.activeElement
    this.hidden = false
    document.body.style.overflow = 'hidden'
    this.#initFocusTrap()
    this.#focusFirstElement()
  }
  
  #close() {
    this.hidden = true
    document.body.style.overflow = ''
    this.#releaseFocusTrap()
    this.#previousFocus?.focus()
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }))
  }
  
  #handleKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      this.removeAttribute('open')
    }
  }
  
  #initFocusTrap() { /* ... */ }
  #releaseFocusTrap() { /* ... */ }
  #focusFirstElement() { /* ... */ }
}

customElements.define('ytz-dialog', YtzDialog)

export { YtzDialog }
```

---

## React Wrapper Pattern

```jsx
// @grimoire/yetzirah-react/dialog.js

import '@grimoire/yetzirah-core/dialog.js'
import { useRef, useEffect } from 'react'

export function Dialog({ open, onClose, children, className, ...props }) {
  const ref = useRef(null)
  
  useEffect(() => {
    const el = ref.current
    if (!el) return
    
    const handleClose = () => onClose?.()
    el.addEventListener('close', handleClose)
    return () => el.removeEventListener('close', handleClose)
  }, [onClose])
  
  useEffect(() => {
    const el = ref.current
    if (!el) return
    
    if (open) {
      el.setAttribute('open', '')
    } else {
      el.removeAttribute('open')
    }
  }, [open])
  
  return (
    <ytz-dialog ref={ref} class={className} {...props}>
      {children}
    </ytz-dialog>
  )
}
```

---

## MUI Rosetta Stone

Maps MUI components to Yetzirah equivalents. Ships in package, lives at `docs.yetzirah.dev/rosetta`.

### Component Mapping

| MUI Component | Yetzirah Equivalent |
|---------------|---------------------|
| `<Dialog>` | `<Dialog>` / `<ytz-dialog>` |
| `<Modal>` | `<Dialog>` / `<ytz-dialog>` |
| `<Drawer>` | `<Drawer>` / `<ytz-drawer>` |
| `<Autocomplete>` | `<Autocomplete>` / `<ytz-autocomplete>` |
| `<Select>` | `<Select>` / `<ytz-select>` or native `<select>` |
| `<Menu>` | `<Menu>` / `<ytz-menu>` |
| `<Tabs>` | `<Tabs>` / `<ytz-tabs>` |
| `<Tooltip>` | `<Tooltip>` / `<ytz-tooltip>` |
| `<Accordion>` | `<Accordion>` / `<ytz-accordion>` |
| `<Collapse>` | `<Disclosure>` / `<ytz-disclosure>` |
| `<Popover>` | `<Popover>` / `<ytz-popover>` |
| `<Card>` | `<div class="pa3 bg-white br2 shadow-1">` |
| `<Paper>` | `<div class="pa3 bg-white shadow-1">` |
| `<Box>` | `<div>` with layout classes |
| `<Stack>` | `<div class="flex flex-column gap3">` |
| `<Container>` | `<div class="mw7 center ph3">` |
| `<Typography>` | Semantic HTML + Tachyons (see below) |
| `<Button>` | `<Button>` / `<ytz-button>` + Tachyons (see below) |
| `<IconButton>` | `<button class="pa2 bn br-100 pointer bg-transparent">` |
| `<TextField>` | `<input class="input-reset pa2 ba b--light-gray br2">` |
| `<Switch>` | `<Toggle>` / `<ytz-toggle>` |
| `<Slider>` | `<Slider>` / `<ytz-slider>` |
| `<Avatar>` | `<img>` + Tachyons (see below) |
| `<Chip>` | `<Chip>` / `<ytz-chip>` (deletable) or `<span class="f6 ph2 pv1 br-pill bg-light-gray">` |
| `<Badge>` | Relative parent + absolute `<span>` |
| `<Divider>` | `<hr class="bt b--light-gray">` |
| `<List>` | `<ul class="list pl0">` |
| `<ListItem>` | `<li class="pa2 bb b--light-gray">` |
| `<Alert>` | `<div role="alert">` + Tachyons (see below) |
| `<Skeleton>` | `<div class="bg-light-gray br2 h2 w-100 animate-pulse">` |
| `<CircularProgress>` | CSS animation or SVG |
| `<LinearProgress>` | Styled `<div>` with animated child |
| `<Grid>` | CSS Grid or flex utilities |

### Button: Variants and Sizes

MUI hides styling behind props. Here's what those props actually mean.

Use `<ytz-button>` for polymorphic button/link behavior, or raw `<button>`/`<a>` if you know which you need.

**Variants:**

| MUI | Tachyons (add to ytz-button or button/a) |
|-----|------------------------------------------|
| `variant="contained"` | `ph3 pv2 br2 white bg-blue` |
| `variant="outlined"` | `ph3 pv2 br2 ba b--blue blue bg-transparent` |
| `variant="text"` | `ph3 pv2 blue` |

Note: `<ytz-button>` already includes `bn bg-transparent` for buttons, so `variant="text"` just needs color.

**Sizes:**

| MUI | Tachyons |
|-----|----------|
| `size="small"` | `f6 ph2 pv1` |
| `size="medium"` | `f5 ph3 pv2` |
| `size="large"` | `f4 ph4 pv3` |

**Colors:**

| MUI | Tachyons (contained) | Tachyons (outlined/text) |
|-----|---------------------|-------------------------|
| `color="primary"` | `bg-blue white` | `blue b--blue` |
| `color="secondary"` | `bg-purple white` | `purple b--purple` |
| `color="error"` | `bg-red white` | `red b--red` |
| `color="success"` | `bg-green white` | `green b--green` |
| `color="warning"` | `bg-orange white` | `orange b--orange` |

**Full translation examples:**

```jsx
// MUI contained button
<Button variant="contained" size="large" color="primary">
  Submit
</Button>

// Yetzirah
<ytz-button onclick={handleSubmit} class="f4 ph4 pv3 br2 white bg-blue">
  Submit
</ytz-button>

// MUI link-as-button
<Button component={Link} to="/dashboard" variant="contained">
  Dashboard
</Button>

// Yetzirah (just use href)
<ytz-button href="/dashboard" class="ph3 pv2 br2 white bg-blue">
  Dashboard
</ytz-button>
```

### Typography: Variants

| MUI | HTML + Tachyons |
|-----|-----------------|
| `variant="h1"` | `<h1 class="f-headline fw6">` |
| `variant="h2"` | `<h2 class="f-subheadline fw6">` |
| `variant="h3"` | `<h3 class="f1 fw6">` |
| `variant="h4"` | `<h4 class="f2 fw6">` |
| `variant="h5"` | `<h5 class="f3 fw6">` |
| `variant="h6"` | `<h6 class="f4 fw6">` |
| `variant="subtitle1"` | `<p class="f4 fw5 lh-title">` |
| `variant="subtitle2"` | `<p class="f5 fw5 lh-title">` |
| `variant="body1"` | `<p class="f5 lh-copy">` |
| `variant="body2"` | `<p class="f6 lh-copy">` |
| `variant="caption"` | `<span class="f7 gray">` |
| `variant="overline"` | `<span class="f7 ttu tracked">` |

### TextField: Variants

| MUI | Tachyons |
|-----|----------|
| `variant="outlined"` | `input-reset pa2 ba b--light-gray br2` |
| `variant="filled"` | `input-reset pa2 bn br2 bg-light-gray` |
| `variant="standard"` | `input-reset pa2 bn bb b--light-gray` |

**Sizes:**

| MUI | Tachyons |
|-----|----------|
| `size="small"` | `f6 pa1` |
| `size="medium"` | `f5 pa2` |

**States:**

| MUI | Tachyons |
|-----|----------|
| `error` | `b--red` (outlined) / `bg-washed-red` (filled) |
| `disabled` | `o-50` + `disabled` attribute |

### Avatar: Sizes

| MUI | Tachyons |
|-----|----------|
| (default) | `br-100 w2 h2` |
| `sx={{ width: 24, height: 24 }}` | `br-100 w1 h1` |
| `sx={{ width: 56, height: 56 }}` | `br-100 w3 h3` |

**Variants:**

| MUI | Tachyons |
|-----|----------|
| (image) | `<img class="br-100 w2 h2">` |
| (letter) | `<div class="br-100 w2 h2 flex items-center justify-center bg-blue white">` |

### Alert: Severity

| MUI | Tachyons |
|-----|----------|
| `severity="error"` | `bg-washed-red dark-red` |
| `severity="warning"` | `bg-washed-yellow dark-orange` |
| `severity="info"` | `bg-washed-blue dark-blue` |
| `severity="success"` | `bg-washed-green dark-green` |

**Full translation:**

```jsx
// MUI
<Alert severity="error">This is an error message</Alert>

// Yetzirah + Tachyons
<div role="alert" class="pa3 br2 bg-washed-red dark-red">
  This is an error message
</div>
```

### Chip: Variants and Sizes

**Variants:**

| MUI | Tachyons |
|-----|----------|
| `variant="filled"` | `bg-light-gray dark-gray` |
| `variant="outlined"` | `ba b--light-gray bg-transparent` |

**Sizes:**

| MUI | Tachyons |
|-----|----------|
| `size="small"` | `f7 ph2 pv1` |
| `size="medium"` | `f6 ph2 pv1` |

**Colors (filled):**

| MUI | Tachyons |
|-----|----------|
| `color="primary"` | `bg-blue white` |
| `color="secondary"` | `bg-purple white` |
| `color="error"` | `bg-red white` |
| `color="success"` | `bg-green white` |

### Paper: Elevation

MUI's elevation prop maps to Tachyons shadow utilities:

| MUI | Tachyons |
|-----|----------|
| `elevation={0}` | (no shadow class) |
| `elevation={1}` | `shadow-1` |
| `elevation={2}` | `shadow-2` |
| `elevation={3}` | `shadow-2` |
| `elevation={4}` | `shadow-4` |
| `elevation={5+}` | `shadow-5` |

### Spacing: The `sx` Prop

MUI's `sx={{ m: 2, p: 3 }}` is just Tachyons with extra steps.

**Margin:**

| MUI `sx` | Tachyons |
|----------|----------|
| `m: 0` | `ma0` |
| `m: 1` | `ma1` |
| `m: 2` | `ma2` |
| `m: 3` | `ma3` |
| `m: 4` | `ma4` |
| `mt: 2` | `mt2` |
| `mb: 2` | `mb2` |
| `ml: 2` | `ml2` |
| `mr: 2` | `mr2` |
| `mx: 2` | `mh2` |
| `my: 2` | `mv2` |

**Padding:**

| MUI `sx` | Tachyons |
|----------|----------|
| `p: 0` | `pa0` |
| `p: 1` | `pa1` |
| `p: 2` | `pa2` |
| `p: 3` | `pa3` |
| `p: 4` | `pa4` |
| `pt: 2` | `pt2` |
| `pb: 2` | `pb2` |
| `pl: 2` | `pl2` |
| `pr: 2` | `pr2` |
| `px: 2` | `ph2` |
| `py: 2` | `pv2` |

### Display and Flex

| MUI `sx` | Tachyons |
|----------|----------|
| `display: 'flex'` | `flex` |
| `display: 'block'` | `db` |
| `display: 'inline'` | `di` |
| `display: 'none'` | `dn` |
| `flexDirection: 'column'` | `flex-column` |
| `flexDirection: 'row'` | `flex-row` |
| `justifyContent: 'center'` | `justify-center` |
| `justifyContent: 'space-between'` | `justify-between` |
| `alignItems: 'center'` | `items-center` |
| `alignItems: 'flex-start'` | `items-start` |
| `flexWrap: 'wrap'` | `flex-wrap` |
| `gap: 2` | `gap2` (or use child margins) |

### MUI Props → Tachyons Classes

MUI hides styling decisions behind props. Yetzirah exposes them as classes.

**Button variants:**

| MUI | Tachyons |
|-----|----------|
| `variant="contained"` | `bn white bg-blue` |
| `variant="outlined"` | `bg-transparent ba b--blue blue` |
| `variant="text"` | `bn bg-transparent blue` |

**Button colors:**

| MUI | Tachyons |
|-----|----------|
| `color="primary"` | `bg-blue white` / `blue b--blue` |
| `color="secondary"` | `bg-purple white` / `purple b--purple` |
| `color="error"` | `bg-red white` / `red b--red` |
| `color="success"` | `bg-green white` / `green b--green` |
| `color="warning"` | `bg-orange white` / `orange b--orange` |

**Button sizes:**

| MUI | Tachyons |
|-----|----------|
| `size="small"` | `f6 ph2 pv1` |
| `size="medium"` | `f5 ph3 pv2` |
| `size="large"` | `f4 ph4 pv3` |

**Typography variants:**

| MUI | HTML + Tachyons |
|-----|-----------------|
| `variant="h1"` | `<h1 class="f-headline fw6">` |
| `variant="h2"` | `<h2 class="f-subheadline fw6">` |
| `variant="h3"` | `<h3 class="f1 fw6">` |
| `variant="h4"` | `<h4 class="f2 fw6">` |
| `variant="h5"` | `<h5 class="f3 fw6">` |
| `variant="h6"` | `<h6 class="f4 fw6">` |
| `variant="subtitle1"` | `<p class="f4 fw5 lh-title">` |
| `variant="subtitle2"` | `<p class="f5 fw5 lh-title">` |
| `variant="body1"` | `<p class="f5 lh-copy">` |
| `variant="body2"` | `<p class="f6 lh-copy">` |
| `variant="caption"` | `<span class="f7 gray">` |
| `variant="overline"` | `<span class="f7 ttu tracked">` |

**Spacing (margin/padding):**

| MUI `sx` | Tachyons |
|----------|----------|
| `m={1}` | `ma1` |
| `m={2}` | `ma2` |
| `mt={2}` | `mt2` |
| `mb={2}` | `mb2` |
| `ml={2}` | `ml2` |
| `mr={2}` | `mr2` |
| `mx={2}` | `mh2` |
| `my={2}` | `mv2` |
| `p={1}` | `pa1` |
| `p={2}` | `pa2` |
| `pt={2}` | `pt2` |
| `pb={2}` | `pb2` |
| `pl={2}` | `pl2` |
| `pr={2}` | `pr2` |
| `px={2}` | `ph2` |
| `py={2}` | `pv2` |

**Paper/Card elevation:**

| MUI | Tachyons |
|-----|----------|
| `elevation={0}` | (no class) |
| `elevation={1}` | `shadow-1` |
| `elevation={2}` | `shadow-2` |
| `elevation={3,4}` | `shadow-3` |
| `elevation={5+}` | `shadow-4` or `shadow-5` |

**TextField variants:**

| MUI | HTML + Tachyons |
|-----|-----------------|
| `variant="outlined"` | `<input class="input-reset pa2 ba b--light-gray br2">` |
| `variant="filled"` | `<input class="input-reset pa2 bn bg-light-gray br2 br--top">` |
| `variant="standard"` | `<input class="input-reset pa2 bn bb b--light-gray">` |

**Alert severity:**

| MUI | Tachyons |
|-----|----------|
| `severity="error"` | `bg-washed-red dark-red` |
| `severity="warning"` | `bg-washed-yellow dark-orange` |
| `severity="info"` | `bg-washed-blue dark-blue` |
| `severity="success"` | `bg-washed-green dark-green` |

**Chip variants:**

| MUI | Tachyons |
|-----|----------|
| `variant="filled"` | `bg-light-gray dark-gray` |
| `variant="outlined"` | `bg-transparent ba b--light-gray` |

**Chip sizes:**

| MUI | Tachyons |
|-----|----------|
| `size="small"` | `f7 ph2 pv1` |
| `size="medium"` | `f6 ph2 pv1` |

**Avatar sizes:**

| MUI | Tachyons |
|-----|----------|
| (small) | `w2 h2` |
| (medium/default) | `w3 h3` |
| (large) | `w4 h4` |

**Flexbox (Stack/Box):**

| MUI | Tachyons |
|-----|----------|
| `direction="row"` | `flex flex-row` |
| `direction="column"` | `flex flex-column` |
| `justifyContent="center"` | `justify-center` |
| `justifyContent="space-between"` | `justify-between` |
| `justifyContent="flex-start"` | `justify-start` |
| `justifyContent="flex-end"` | `justify-end` |
| `alignItems="center"` | `items-center` |
| `alignItems="flex-start"` | `items-start` |
| `alignItems="flex-end"` | `items-end` |
| `alignItems="stretch"` | `items-stretch` |
| `flexWrap="wrap"` | `flex-wrap` |
| `gap={2}` | `gap2` (or use child margins) |

**Common patterns:**

```html
<!-- MUI: <Button variant="contained" size="large" color="primary"> -->
<button class="f4 ph4 pv3 bn br2 white bg-blue pointer">

<!-- MUI: <Button variant="outlined" size="small" color="error"> -->
<button class="f6 ph2 pv1 bg-transparent ba b--red red br2 pointer">

<!-- MUI: <Card elevation={2}><CardContent>...</CardContent></Card> -->
<div class="pa3 bg-white br2 shadow-2">

<!-- MUI: <Stack direction="row" spacing={2} alignItems="center"> -->
<div class="flex flex-row items-center gap2">

<!-- MUI: <Typography variant="h4" gutterBottom> -->
<h4 class="f2 fw6 mb3">

<!-- MUI: <Chip label="Tag" variant="outlined" size="small" /> -->
<span class="f7 ph2 pv1 br-pill bg-transparent ba b--light-gray">Tag</span>

<!-- MUI: <Alert severity="success">...</Alert> -->
<div role="alert" class="pa3 br2 bg-washed-green dark-green">
```

**Purpose:** An LLM migrating MUI code can pattern-match props directly to classes. No interpretation needed—the translation is mechanical.

### Variant and Size Translations

MUI's `variant`, `size`, and `color` props map to Tachyons classes:

**Button variants:**

| MUI | Tachyons |
|-----|----------|
| `variant="contained"` | `bn white bg-blue` |
| `variant="outlined"` | `ba b--blue bg-transparent blue` |
| `variant="text"` | `bn bg-transparent blue` |

**Button sizes:**

| MUI | Tachyons |
|-----|----------|
| `size="small"` | `f6 ph2 pv1` |
| `size="medium"` | `f5 ph3 pv2` |
| `size="large"` | `f4 ph4 pv3` |

**Button colors:**

| MUI | Tachyons (contained) | Tachyons (outlined/text) |
|-----|---------------------|-------------------------|
| `color="primary"` | `bg-blue white` | `blue b--blue` |
| `color="secondary"` | `bg-purple white` | `purple b--purple` |
| `color="error"` | `bg-red white` | `red b--red` |
| `color="success"` | `bg-green white` | `green b--green` |
| `color="warning"` | `bg-orange white` | `orange b--orange` |

**TextField variants:**

| MUI | Tachyons |
|-----|----------|
| `variant="outlined"` | `ba b--light-gray br2` |
| `variant="filled"` | `bn bb b--light-gray bg-near-white` |
| `variant="standard"` | `bn bb b--light-gray bg-transparent` |

**Typography variants:**

| MUI | HTML + Tachyons |
|-----|-----------------|
| `variant="h1"` | `<h1 class="f-headline fw6">` |
| `variant="h2"` | `<h2 class="f-subheadline fw6">` |
| `variant="h3"` | `<h3 class="f1 fw6">` |
| `variant="h4"` | `<h4 class="f2 fw6">` |
| `variant="h5"` | `<h5 class="f3 fw6">` |
| `variant="h6"` | `<h6 class="f4 fw6">` |
| `variant="subtitle1"` | `<p class="f4 fw5 lh-title">` |
| `variant="subtitle2"` | `<p class="f5 fw5 lh-title">` |
| `variant="body1"` | `<p class="f5 lh-copy">` |
| `variant="body2"` | `<p class="f6 lh-copy">` |
| `variant="caption"` | `<span class="f7 gray">` |
| `variant="overline"` | `<span class="f7 ttu tracked">` |

**Paper elevation:**

| MUI | Tachyons |
|-----|----------|
| `elevation={0}` | `ba b--light-gray` |
| `elevation={1}` | `shadow-1` |
| `elevation={2}` | `shadow-2` |
| `elevation={3}` | `shadow-2` |
| `elevation={4}` | `shadow-4` |
| `elevation={5+}` | `shadow-5` |

**Spacing (margin/padding):**

MUI's `m`, `p`, `mx`, `py`, etc. map directly to Tachyons:

| MUI sx prop | Tachyons |
|-------------|----------|
| `m={1}` | `ma1` |
| `m={2}` | `ma2` |
| `mt={2}` | `mt2` |
| `mx={3}` | `mh3` |
| `my={2}` | `mv2` |
| `p={3}` | `pa3` |
| `px={4}` | `ph4` |
| `py={2}` | `pv2` |

**Common layout patterns:**

| MUI | Tachyons |
|-----|----------|
| `<Stack spacing={2}>` | `<div class="flex flex-column gap2">` or children with `mb2` |
| `<Stack direction="row">` | `<div class="flex flex-row">` |
| `<Box display="flex" justifyContent="center">` | `<div class="flex justify-center">` |
| `<Box display="flex" alignItems="center">` | `<div class="flex items-center">` |
| `<Grid container spacing={2}>` | `<div class="flex flex-wrap nl2 nr2">` with children `ph2` |

---

## MUI Names Shim

For gradual migration:

```jsx
// @grimoire/yetzirah-react/mui-compat
export { Dialog as MuiDialog } from '@grimoire/yetzirah-react'
export { Autocomplete as MuiAutocomplete } from '@grimoire/yetzirah-react'
// ...

// Passthrough HTML elements
export const Card = (props) => <div {...props} />
export const Paper = (props) => <div {...props} />
export const Box = (props) => <div {...props} />
```

---

## Development Approach

**MUI as specification.** MUI's docs define what each component does. Use as behavioral spec.

**Web Components first.** Core implementation complete before any wrapper. Vanilla HTML is the test environment.

**LLM-assisted development.** Well-specified tasks: "implement MUI Dialog behavior as a Web Component with full accessibility."

**Test matrix:**
- Vanilla HTML (no framework)
- React 18+
- Vue 3
- Svelte 4+
- Angular 16+
- Solid.js 1.8+ (Phase 4)
- Alpine.js 3.x (Phase 4)

---

## Non-Goals

- **Theming system.** CSS custom properties exist.
- **Animation library.** CSS transitions suffice.
- **Form validation.** HTML5 validation exists.
- **Data fetching.** Not a UI concern.
- **State management.** Framework's job.
- **Server-side rendering.** Light DOM helps, but not primary target.
- **Shadow DOM.** Encapsulation solves nothing when you ship no styles.
- **Every MUI feature.** YAGNI. The 10% causing 50% of complexity is cut.

---

## Success Criteria

### Phase 1 (Core + React)
1. All Tier 1 components working in vanilla HTML
2. React wrappers complete with proper event bridging
3. Total core bundle < 10kb gzipped
4. Each wrapper < 50 lines per component
5. Zero dependencies in core
6. WCAG 2.1 AA accessibility compliance
7. LLM can correctly complete usage (tested GPT-4, Claude)

### Phase 2 (Vue, Svelte, Angular)
1. All framework wrappers complete
2. Framework-idiomatic APIs (v-model, Svelte bindings, etc.)
3. Documented in each framework's conventions

### Phase 3 (CDN)
1. Works via script tag, no build step
2. Individual component imports available
3. Total Tier 1 < 10kb from CDN
4. Sub-Saharan Africa load time < 3s on 3G

### Phase 4 (Extensions, Components & Distribution)
1. `@grimoire` npm organization claimed and all packages published
2. Snackbar/Toast component with queue management
3. Progress/Spinner component (CSS-driven)
4. Badge component for notification overlays
5. Solid.js wrappers with native signal integration
6. Alpine.js plugin with `x-ytz` directive
7. Two-way binding support (`x-ytz:model`)
8. CDN distribution for Alpine plugin (no build step required)
9. Documentation for Rails/Laravel/Django integration patterns

---

## Competitive Position

| | MUI | Headless UI | Radix | Shoelace | Yetzirah |
|---|-----|-------------|-------|----------|----------|
| Bundle | ~300kb | ~30kb | ~50kb | ~80kb | <10kb |
| Base | React | React | React | Web Components | Web Components |
| React | ✓ | ✓ | ✓ | Via wrapper | ✓ |
| Vue | Community | ✗ | ✗ | Via wrapper | ✓ |
| Svelte | Community | ✗ | ✗ | Via wrapper | ✓ |
| Angular | Community | ✗ | ✗ | Via wrapper | ✓ |
| Solid | ✗ | ✗ | ✗ | Via wrapper | ✓ (Phase 4) |
| Alpine | ✗ | ✗ | ✗ | ✗ | ✓ (Phase 4) |
| Lit | ✗ | ✗ | ✗ | ✓ | ✓ (native) |
| HTMX | ✗ | ✗ | ✗ | ✗ | ✓ (native) |
| Stencil | ✗ | ✗ | ✗ | ✓ | ✓ (native) |
| Vanilla | ✗ | ✗ | ✗ | ✓ | ✓ |
| CDN-ready | ✗ | ✗ | ✗ | ✓ | ✓ |
| AI-native | ✗ | Partial | Partial | Partial | ✓ |
| MUI-compatible API | — | ✗ | ✗ | ✗ | ✓ |
| Styles included | Yes | No | No | Yes | No |

**Pitch:** Shoelace is the closest competitor (Web Components, framework-agnostic). Yetzirah is smaller, ships no styles, and has MUI-compatible APIs for easy migration.

**Note:** Shoelace is MIT-licensed and Web Components-first. Review their component implementations before building—they may have solved problems we'd otherwise reinvent. Potential outcomes: (1) fork/adapt specific components, (2) learn from their patterns, (3) identify where their approach diverges from Yetzirah's goals (they ship styles, use Shadow DOM, include Lit). Worth a thorough review when time permits.

**Also review:**

- **Lion.js** (ING Bank, MIT-licensed) — Web Components with strong accessibility focus. Seriously overengineered in places (enterprise parentage shows), but the core logic is sound. Potential to extract and simplify, fixing the type structure as we go. Good reference for form components and validation patterns.

- **Vaadin Grid** (Apache 2.0) — Potential starting point for premium DataGrid. Production-tested virtual scrolling, sorting, filtering. Heavy, but the hard problems (virtualization, keyboard nav in large datasets) are solved. Worth studying before building our YAGNI version.

---

## Token Economy: The Hidden Advantage

Yetzirah + Tachyons isn't just smaller for users—it's smaller for LLMs. This has direct cost implications for AI-assisted development.

**Why MUI requires expensive models:**

- API surface is huge and version-dependent
- Theming system requires reasoning about nested contexts
- `sx` prop, `styled()`, component slots, overrides—too many valid approaches
- Model must guess which pattern your codebase uses
- Hallucination rate is high; verification is manual

**Why Yetzirah works with cheap models:**

- Entire framework fits in context window
- Tachyons is ~500 classes, exhaustively enumerable
- One way to do things—no pattern ambiguity
- Model has ground truth, not training data fragments
- Hallucination rate drops; output is verifiable

**Model pricing (as of 2025):**

| Model | Input/1M tokens | Output/1M tokens |
|-------|-----------------|------------------|
| Claude Opus | $15.00 | $75.00 |
| Claude Haiku | $0.25 | $1.25 |
| GPT-4o | $5.00 | $15.00 |
| GPT-4o-mini | $0.15 | $0.60 |

**Cost comparison for a day of frontend work (~500k input, ~100k output):**

| Stack | Model Required | Daily API Cost |
|-------|----------------|----------------|
| MUI + Tailwind | Opus / GPT-4o | $10-15 |
| Yetzirah + Tachyons | Haiku / mini | $0.20-0.50 |

**Annual savings per developer: $2,500-4,000**

**Team savings at scale:**

| Team Size | Annual API Savings | Yetzirah Premium | Net Savings |
|-----------|-------------------|------------------|-------------|
| 5 devs | $12,500-20,000 | $250-500 | $12,000+ |
| 20 devs | $50,000-80,000 | $1,000-2,000 | $49,000+ |

**The pitch:** Yetzirah Premium pays for itself in the first week of API savings. Everything after that is profit.

**Secondary benefits:**

- Haiku/mini respond faster than Opus/4o—tighter iteration loops
- Lower token counts = longer conversations before context overflow
- Predictable outputs = less time debugging AI mistakes
- Framework fits in context alongside your entire page—holistic reasoning

**Why incumbents can't compete:** MUI can't shrink. Tailwind keeps growing (v4 is larger than v3). They're structurally locked into requiring expensive models. Yetzirah's moat isn't just "fits in context"—it's "fits in the *cheap* context."

---

## Future: Premium Tier

| Component | Market | Yetzirah Approach |
|-----------|--------|-------------------|
| DataGrid | AG Grid, MUI X ($588/dev/yr) | YAGNI: virtual scroll, sort, filter, inline edit, XLSX export (custom zero-dependency implementation). No pivot tables. |
| DatePicker | MUI X | Progressive enhancement over `<input type="date">` |
| Charts | Recharts, Victory | 5 chart types covering 95% of dashboards |

**Model:** $50-100/dev/year. Undercut incumbents on price, win on DX and AI-compatibility.

---

## Name

**Yetzirah** — In Kabbalah, the world of formation. Where the fundamental elements first take shape. Below Yetzirah is only raw potential; above it, the finished forms.

Yetzirah is the smallest meaningful layer of UI abstraction. Below this, you're writing vanilla JavaScript. At this layer, you're working with the elements themselves.

*The world of formation.*

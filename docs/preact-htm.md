# Using Yetzirah with Preact + HTM

This guide covers using Yetzirah web components with Preact and HTM for a React-like developer experience without any build step.

## Overview

**Preact** is a 3KB alternative to React with the same modern API. **HTM** (Hyperscript Tagged Markup) provides JSX-like syntax using tagged template literals, eliminating the need for transpilation.

Together with Yetzirah's headless web components, you get:
- React-like component patterns and hooks
- JSX-like syntax without a build step
- All dependencies loaded from CDN
- Accessible, production-ready UI components

## Quick Start

Add these scripts to your HTML:

```html
<!-- Import Map for cleaner imports -->
<script type="importmap">
{
  "imports": {
    "preact": "https://esm.sh/preact@10",
    "preact/": "https://esm.sh/preact@10/",
    "htm": "https://esm.sh/htm@3",
    "htm/preact": "https://esm.sh/htm@3/preact?external=preact"
  }
}
</script>

<!-- Yetzirah components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/core.js"></script>
```

Then in your module script:

```javascript
import { render } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { html } from 'htm/preact';

function App() {
  const [count, setCount] = useState(0);

  return html`
    <div>
      <h1>Count: ${count}</h1>
      <ytz-button onClick=${() => setCount(c => c + 1)}>
        Increment
      </ytz-button>
    </div>
  `;
}

render(html`<${App} />`, document.getElementById('app'));
```

## HTM Syntax Basics

HTM uses tagged template literals instead of JSX. The syntax is nearly identical:

```javascript
// JSX (requires build step)
return <div className="container">
  <MyComponent prop={value}>
    {items.map(item => <li key={item.id}>{item.name}</li>)}
  </MyComponent>
</div>;

// HTM (no build step)
return html`
  <div class="container">
    <${MyComponent} prop=${value}>
      ${items.map(item => html`<li key=${item.id}>${item.name}</li>`)}
    </${MyComponent}>
  </div>
`;
```

Key differences:
- Use `class` instead of `className`
- Component references use `<${Component}>` syntax
- Interpolations use `${}` syntax
- Self-closing tags need explicit closing: `<${Component} />`

## Event Handling

### Inline Event Handlers

Yetzirah components work with standard DOM events:

```javascript
function DialogExample() {
  const dialogRef = useRef(null);

  return html`
    <ytz-button onClick=${() => dialogRef.current?.showModal()}>
      Open Dialog
    </ytz-button>

    <ytz-dialog ref=${dialogRef}>
      <div class="dialog-content">
        <h2>Hello!</h2>
        <ytz-button onClick=${() => dialogRef.current?.close()}>
          Close
        </ytz-button>
      </div>
    </ytz-dialog>
  `;
}
```

### Custom Event Hook

For Yetzirah's custom events (like `change`, `select`, `close`), create a reusable hook:

```javascript
import { useEffect } from 'preact/hooks';

function useYetzirahEvent(ref, eventName, handler) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !handler) return;

    element.addEventListener(eventName, handler);
    return () => element.removeEventListener(eventName, handler);
  }, [ref, eventName, handler]);
}
```

Usage:

```javascript
function AutocompleteExample() {
  const autocompleteRef = useRef(null);
  const [selected, setSelected] = useState(null);

  useYetzirahEvent(autocompleteRef, 'change', (e) => {
    setSelected(e.detail.value);
  });

  return html`
    <ytz-autocomplete ref=${autocompleteRef}>
      <input slot="input" placeholder="Search..." />
      <ytz-option value="apple">Apple</ytz-option>
      <ytz-option value="banana">Banana</ytz-option>
    </ytz-autocomplete>
    <p>Selected: ${selected || 'None'}</p>
  `;
}
```

## Common Event Patterns

### Dialog Events

```javascript
function DialogWithEvents() {
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Listen for close event (backdrop click, escape key, or programmatic)
  useYetzirahEvent(dialogRef, 'close', () => {
    setIsOpen(false);
    console.log('Dialog closed');
  });

  return html`
    <ytz-button onClick=${() => {
      setIsOpen(true);
      dialogRef.current?.showModal();
    }}>
      Open Dialog
    </ytz-button>

    <ytz-dialog ref=${dialogRef}>
      <div class="dialog-content">
        <p>Dialog is ${isOpen ? 'open' : 'closed'}</p>
      </div>
    </ytz-dialog>
  `;
}
```

### Select/Autocomplete Events

```javascript
function SelectWithState() {
  const selectRef = useRef(null);
  const [value, setValue] = useState('');

  useYetzirahEvent(selectRef, 'change', (e) => {
    setValue(e.detail.value);
  });

  return html`
    <ytz-select ref=${selectRef} value=${value}>
      <ytz-option value="small">Small</ytz-option>
      <ytz-option value="medium">Medium</ytz-option>
      <ytz-option value="large">Large</ytz-option>
    </ytz-select>
    <p>Selected size: ${value}</p>
  `;
}
```

### Tab Change Events

```javascript
function ControlledTabs() {
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState('tab1');

  useYetzirahEvent(tabsRef, 'change', (e) => {
    setActiveTab(e.detail.value);
  });

  return html`
    <ytz-tabs ref=${tabsRef} value=${activeTab}>
      <div role="tablist">
        <ytz-tab panel="tab1">First</ytz-tab>
        <ytz-tab panel="tab2">Second</ytz-tab>
      </div>
      <ytz-tabpanel id="tab1">First panel content</ytz-tabpanel>
      <ytz-tabpanel id="tab2">Second panel content</ytz-tabpanel>
    </ytz-tabs>

    <!-- Programmatic control -->
    <button onClick=${() => setActiveTab('tab2')}>Go to Second</button>
  `;
}
```

### Menu Select Events

```javascript
function MenuWithActions() {
  const menuRef = useRef(null);

  useYetzirahEvent(menuRef, 'select', (e) => {
    const action = e.detail.value;
    switch (action) {
      case 'edit': handleEdit(); break;
      case 'delete': handleDelete(); break;
    }
  });

  return html`
    <ytz-menu ref=${menuRef}>
      <button slot="trigger">Actions</button>
      <ytz-menuitem value="edit">Edit</ytz-menuitem>
      <ytz-menuitem value="delete">Delete</ytz-menuitem>
    </ytz-menu>
  `;
}
```

## State Management

### Local State with useState

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return html`
    <div class="counter">
      <ytz-button onClick=${() => setCount(c => c - 1)}>-</ytz-button>
      <span class="count">${count}</span>
      <ytz-button onClick=${() => setCount(c => c + 1)}>+</ytz-button>
    </div>
  `;
}
```

### Complex State with useReducer

```javascript
import { useReducer } from 'preact/hooks';

const initialState = { items: [], filter: 'all' };

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'TOGGLE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id
            ? { ...item, completed: !item.completed }
            : item
        )
      };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectRef = useRef(null);

  useYetzirahEvent(selectRef, 'change', (e) => {
    dispatch({ type: 'SET_FILTER', filter: e.detail.value });
  });

  const filteredItems = state.items.filter(item => {
    if (state.filter === 'active') return !item.completed;
    if (state.filter === 'completed') return item.completed;
    return true;
  });

  return html`
    <ytz-select ref=${selectRef} value=${state.filter}>
      <ytz-option value="all">All</ytz-option>
      <ytz-option value="active">Active</ytz-option>
      <ytz-option value="completed">Completed</ytz-option>
    </ytz-select>

    <ul>
      ${filteredItems.map(item => html`
        <li key=${item.id}>
          <ytz-toggle
            checked=${item.completed}
            onClick=${() => dispatch({ type: 'TOGGLE_ITEM', id: item.id })}
          />
          ${item.text}
        </li>
      `)}
    </ul>
  `;
}
```

### Shared State with Context

```javascript
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return html`
    <${ThemeContext.Provider} value=${{ theme, setTheme }}>
      ${children}
    </${ThemeContext.Provider}>
  `;
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return html`
    <ytz-toggle
      checked=${theme === 'dark'}
      onClick=${() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    />
  `;
}
```

## Controlling Component Methods

Yetzirah components expose methods via the DOM element:

```javascript
function DrawerController() {
  const drawerRef = useRef(null);

  return html`
    <ytz-button onClick=${() => drawerRef.current?.show()}>
      Open Drawer
    </ytz-button>

    <ytz-drawer ref=${drawerRef} anchor="left">
      <div class="drawer-content">
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
        </nav>
        <ytz-button onClick=${() => drawerRef.current?.close()}>
          Close
        </ytz-button>
      </div>
    </ytz-drawer>
  `;
}
```

Common methods:
- `ytz-dialog`: `showModal()`, `close()`
- `ytz-drawer`: `show()`, `close()`
- `ytz-disclosure`: `toggle()`, `open()`, `close()`
- `ytz-accordion-item`: `toggle()`, `open()`, `close()`

## Comparison with React Wrapper

Yetzirah provides official React wrappers (`@grimoire/yetzirah-react`) for build-based projects. Here's how the approaches compare:

### Preact + HTM (No Build)

```javascript
import { html } from 'htm/preact';
import { useRef, useEffect } from 'preact/hooks';

function MyDialog() {
  const dialogRef = useRef(null);

  useEffect(() => {
    const el = dialogRef.current;
    const handler = () => console.log('closed');
    el?.addEventListener('close', handler);
    return () => el?.removeEventListener('close', handler);
  }, []);

  return html`
    <ytz-dialog ref=${dialogRef}>
      <div class="content">...</div>
    </ytz-dialog>
  `;
}
```

### React Wrapper (With Build)

```jsx
import { Dialog } from '@grimoire/yetzirah-react';

function MyDialog() {
  return (
    <Dialog onClose={() => console.log('closed')}>
      <div className="content">...</div>
    </Dialog>
  );
}
```

### When to Use Each

**Use Preact + HTM when:**
- No build step is required
- Prototyping or small projects
- Learning or experimentation
- CDN-only deployment
- Bundle size is critical (Preact is smaller than React)

**Use React Wrapper when:**
- Already using React with a build system
- Team is familiar with React patterns
- Need TypeScript support
- Want cleaner event prop syntax (`onClose` vs `addEventListener`)
- Building a larger application

## Browser Compatibility

### Import Maps Support

Import maps are supported in:
- Chrome 89+
- Edge 89+
- Safari 16.4+
- Firefox 108+

For older browsers, use the es-module-shims polyfill:

```html
<script async src="https://ga.jspm.io/npm:es-module-shims@1/dist/es-module-shims.js"></script>
```

### Preact Compatibility

Preact supports all modern browsers and IE11 (with polyfills).

### Yetzirah Components

Web Components are supported in all modern browsers. For IE11, additional polyfills are required.

## Performance Tips

1. **Lazy load components**: Import only the Yetzirah components you need:
   ```javascript
   import 'https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/dialog.js';
   import 'https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/tabs.js';
   ```

2. **Memoize callbacks**: Use `useCallback` for event handlers:
   ```javascript
   const handleChange = useCallback((e) => {
     setValue(e.detail.value);
   }, []);
   ```

3. **Avoid inline functions in loops**: Extract to a memoized handler.

4. **Use production CDN URLs**: esm.sh and jsDelivr automatically serve minified production builds.

## Complete Example

See the live demo at [demos/cdn/preact-htm.html](../demos/cdn/preact-htm.html) for a complete working example featuring:

- Counter with state
- Dialog with events
- Autocomplete with change events
- Controlled tabs
- Todo app with complex state
- Drawer navigation

## Resources

- [Preact Documentation](https://preactjs.com/guide/v10/getting-started)
- [HTM Repository](https://github.com/developit/htm)
- [Yetzirah CDN Demo](../demos/cdn/index.html)
- [Yetzirah Import Map Demo](../demos/cdn/importmap.html)

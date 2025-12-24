# Vanilla JavaScript Patterns Guide

This guide covers idiomatic vanilla JavaScript patterns for using Yetzirah components without any framework. Build interactive applications with just HTML, CSS, and JavaScript.

## Quick Start

Add a script tag to load Yetzirah components:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>
```

Components are immediately available in your HTML:

```html
<ytz-dialog id="my-dialog">
  <div class="dialog-content">Hello World!</div>
</ytz-dialog>

<button onclick="document.getElementById('my-dialog').showModal()">
  Open Dialog
</button>
```

## Event Handling Patterns

### Direct Event Listeners

Attach event listeners directly to Yetzirah components:

```javascript
const dialog = document.getElementById('my-dialog');

dialog.addEventListener('close', (event) => {
  console.log('Dialog closed');
});

const menu = document.querySelector('ytz-menu');
menu.addEventListener('select', (event) => {
  console.log('Selected:', event.detail.value);
});
```

### Event Delegation

Use event delegation for dynamic content and better performance:

```javascript
document.addEventListener('click', (event) => {
  // Handle dialog triggers
  const dialogTrigger = event.target.closest('[data-dialog]');
  if (dialogTrigger) {
    const dialogId = dialogTrigger.dataset.dialog;
    document.getElementById(dialogId)?.showModal();
  }

  // Handle drawer triggers
  const drawerTrigger = event.target.closest('[data-drawer]');
  if (drawerTrigger) {
    const drawerId = drawerTrigger.dataset.drawer;
    document.getElementById(drawerId)?.show();
  }
});
```

```html
<!-- Any element with data-dialog opens the specified dialog -->
<button data-dialog="settings-dialog">Open Settings</button>
<span data-dialog="help-dialog" class="help-icon">?</span>
```

### Custom Event Handling

Yetzirah components emit custom events with details in `event.detail`:

| Component | Event | Detail Properties |
|-----------|-------|-------------------|
| `ytz-dialog` | `close` | `{ returnValue }` |
| `ytz-drawer` | `close` | `{}` |
| `ytz-menu` | `select` | `{ value, element }` |
| `ytz-select` | `change` | `{ value, values }` |
| `ytz-autocomplete` | `change` | `{ value }` |
| `ytz-tabs` | `change` | `{ value }` |
| `ytz-slider` | `change` | `{ value }` |
| `ytz-toggle` | `change` | `{ checked }` |
| `ytz-chip` | `delete` | `{}` |

```javascript
// Example: Handle all select changes
document.querySelectorAll('ytz-select').forEach(select => {
  select.addEventListener('change', (e) => {
    console.log('Select changed to:', e.detail.value);
    // For multi-select, use e.detail.values
  });
});
```

## State Management

### Simple State Object

For small applications, use a plain JavaScript object:

```javascript
const state = {
  user: null,
  theme: 'light',
  notifications: [],

  // Simple subscribers pattern
  listeners: new Set(),

  update(changes) {
    Object.assign(this, changes);
    this.listeners.forEach(fn => fn(this));
  },

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
};

// React to state changes
state.subscribe((newState) => {
  document.body.classList.toggle('dark-mode', newState.theme === 'dark');
  updateNotificationBadge(newState.notifications.length);
});

// Update state from component events
document.querySelector('ytz-theme-toggle').addEventListener('change', (e) => {
  state.update({ theme: e.detail.checked ? 'dark' : 'light' });
});
```

### Using Custom Events for State

Broadcast state changes using custom events:

```javascript
// State manager
const AppState = {
  data: { cart: [], user: null },

  update(key, value) {
    this.data[key] = value;
    document.dispatchEvent(new CustomEvent('state:change', {
      detail: { key, value, state: this.data }
    }));
  },

  get(key) {
    return this.data[key];
  }
};

// Listen anywhere in the app
document.addEventListener('state:change', (e) => {
  if (e.detail.key === 'cart') {
    updateCartUI(e.detail.value);
  }
});
```

### LocalStorage Persistence

Persist state across page loads:

```javascript
const PersistentState = {
  storageKey: 'app-state',

  data: JSON.parse(localStorage.getItem('app-state') || '{}'),

  update(key, value) {
    this.data[key] = value;
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    document.dispatchEvent(new CustomEvent('state:change', {
      detail: { key, value }
    }));
  },

  get(key) {
    return this.data[key];
  }
};
```

## DOM Manipulation Patterns

### Finding and Controlling Components

```javascript
// Get component by ID
const dialog = document.getElementById('my-dialog');

// Get all components of a type
const allMenus = document.querySelectorAll('ytz-menu');

// Get component within a container
const container = document.querySelector('.settings-panel');
const select = container.querySelector('ytz-select');

// Control component
dialog.showModal();        // Open modal
dialog.close();            // Close with no return value
dialog.close('confirmed'); // Close with return value

const drawer = document.querySelector('ytz-drawer');
drawer.show();
drawer.close();
```

### Dynamic Component Creation

```javascript
// Create a notification toast
function showToast(message, type = 'info') {
  const toast = document.createElement('ytz-dialog');
  toast.id = `toast-${Date.now()}`;
  toast.innerHTML = `
    <div class="toast toast-${type}">
      <p>${message}</p>
    </div>
  `;

  document.body.appendChild(toast);
  toast.showModal();

  // Auto-close after 3 seconds
  setTimeout(() => {
    toast.close();
    toast.addEventListener('close', () => toast.remove(), { once: true });
  }, 3000);
}

// Create dynamic menu items
function populateMenu(menuElement, items) {
  const content = menuElement.querySelector('[slot="content"]');
  content.innerHTML = items.map(item => `
    <ytz-menuitem value="${item.id}" ${item.disabled ? 'disabled' : ''}>
      ${item.icon || ''} ${item.label}
    </ytz-menuitem>
  `).join('');
}
```

### Updating Component Properties

```javascript
// Set select value programmatically
const select = document.querySelector('ytz-select');
select.value = 'option-2';

// Set multiple values for multi-select
select.values = ['option-1', 'option-3'];

// Update slider
const slider = document.querySelector('ytz-slider');
slider.value = 75;
slider.min = 0;
slider.max = 100;

// Update toggle
const toggle = document.querySelector('ytz-toggle');
toggle.checked = true;

// Set active tab
const tabs = document.querySelector('ytz-tabs');
tabs.value = 'settings-tab';
```

## Form Handling Patterns

### Gathering Form Data

```javascript
function getFormData(formElement) {
  const data = {};

  // Standard form fields
  const formData = new FormData(formElement);
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Yetzirah select components
  formElement.querySelectorAll('ytz-select').forEach(select => {
    const name = select.getAttribute('name');
    if (name) {
      data[name] = select.multiple ? select.values : select.value;
    }
  });

  // Yetzirah autocomplete components
  formElement.querySelectorAll('ytz-autocomplete').forEach(ac => {
    const name = ac.getAttribute('name');
    if (name) {
      data[name] = ac.value;
    }
  });

  // Yetzirah toggle components
  formElement.querySelectorAll('ytz-toggle').forEach(toggle => {
    const name = toggle.getAttribute('name');
    if (name) {
      data[name] = toggle.checked;
    }
  });

  return data;
}

// Usage
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = getFormData(e.target);
  console.log('Form data:', data);
});
```

### Form Validation

```javascript
function validateForm(formElement) {
  const errors = [];

  // Validate required selects
  formElement.querySelectorAll('ytz-select[required]').forEach(select => {
    if (!select.value) {
      errors.push({
        field: select.getAttribute('name'),
        message: 'Please select an option'
      });
      select.classList.add('error');
    }
  });

  // Validate autocomplete
  formElement.querySelectorAll('ytz-autocomplete[required]').forEach(ac => {
    if (!ac.value) {
      errors.push({
        field: ac.getAttribute('name'),
        message: 'Please select a value'
      });
      ac.classList.add('error');
    }
  });

  return errors;
}
```

### Form Reset

```javascript
function resetForm(formElement) {
  // Reset standard form fields
  formElement.reset();

  // Reset Yetzirah components
  formElement.querySelectorAll('ytz-select').forEach(select => {
    select.value = select.getAttribute('default-value') || '';
    select.values = [];
  });

  formElement.querySelectorAll('ytz-autocomplete').forEach(ac => {
    ac.value = '';
    const input = ac.querySelector('input');
    if (input) input.value = '';
  });

  formElement.querySelectorAll('ytz-toggle').forEach(toggle => {
    toggle.checked = toggle.hasAttribute('default-checked');
  });

  formElement.querySelectorAll('ytz-slider').forEach(slider => {
    slider.value = slider.getAttribute('default-value') || slider.min;
  });
}
```

## Dialog and Drawer Coordination

### Confirmation Dialog Pattern

```javascript
function confirm(message, options = {}) {
  return new Promise((resolve) => {
    const dialog = document.createElement('ytz-dialog');
    dialog.innerHTML = `
      <div class="confirm-dialog">
        <h3>${options.title || 'Confirm'}</h3>
        <p>${message}</p>
        <div class="confirm-actions">
          <button class="btn-cancel">${options.cancelText || 'Cancel'}</button>
          <button class="btn-confirm">${options.confirmText || 'Confirm'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector('.btn-cancel').onclick = () => {
      dialog.close('cancel');
    };

    dialog.querySelector('.btn-confirm').onclick = () => {
      dialog.close('confirm');
    };

    dialog.addEventListener('close', () => {
      const confirmed = dialog.returnValue === 'confirm';
      dialog.remove();
      resolve(confirmed);
    }, { once: true });

    dialog.showModal();
  });
}

// Usage
async function deleteItem(id) {
  const confirmed = await confirm('Are you sure you want to delete this item?', {
    title: 'Delete Item',
    confirmText: 'Delete',
    cancelText: 'Keep'
  });

  if (confirmed) {
    // Proceed with deletion
  }
}
```

### Modal Stack Management

```javascript
const ModalStack = {
  stack: [],

  push(modalElement) {
    // Pause any current modal
    const current = this.stack[this.stack.length - 1];
    if (current) {
      current.setAttribute('data-paused', 'true');
    }

    this.stack.push(modalElement);
    modalElement.showModal();
  },

  pop() {
    const current = this.stack.pop();
    if (current) {
      current.close();
    }

    // Resume previous modal
    const previous = this.stack[this.stack.length - 1];
    if (previous) {
      previous.removeAttribute('data-paused');
    }
  },

  closeAll() {
    while (this.stack.length) {
      this.pop();
    }
  }
};
```

### Drawer with Navigation State

```javascript
class DrawerNav {
  constructor(drawerId) {
    this.drawer = document.getElementById(drawerId);
    this.currentPage = location.pathname;

    this.setupNavigation();
    this.setupHistoryHandling();
  }

  setupNavigation() {
    this.drawer.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault();
        this.navigateTo(link.getAttribute('href'));
      }
    });
  }

  setupHistoryHandling() {
    window.addEventListener('popstate', () => {
      this.drawer.close();
    });
  }

  navigateTo(path) {
    history.pushState({}, '', path);
    this.currentPage = path;
    this.drawer.close();
    this.loadPage(path);
  }

  async loadPage(path) {
    // Your page loading logic here
  }

  open() {
    this.drawer.show();
  }

  close() {
    this.drawer.close();
  }
}
```

## Progressive Enhancement

### Server-Rendered Content

Yetzirah components progressively enhance server-rendered HTML:

```html
<!-- Before JS loads, this is still visible and somewhat functional -->
<ytz-disclosure>
  <button>Show Details</button>
  <div>
    <p>These details are visible even without JavaScript.</p>
    <p>The disclosure component adds interactive expand/collapse.</p>
  </div>
</ytz-disclosure>

<!-- Server can render initial state -->
<ytz-tabs value="overview">
  <div role="tablist">
    <ytz-tab panel="overview">Overview</ytz-tab>
    <ytz-tab panel="details">Details</ytz-tab>
  </div>
  <ytz-tabpanel id="overview">
    <p>Pre-rendered overview content...</p>
  </ytz-tabpanel>
  <ytz-tabpanel id="details" hidden>
    <p>Pre-rendered details content...</p>
  </ytz-tabpanel>
</ytz-tabs>
```

### Lazy Loading Components

Load components only when needed:

```javascript
// Lazy load dialog component when first needed
let dialogLoaded = false;

async function ensureDialogLoaded() {
  if (dialogLoaded) return;

  await import('https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/dialog.js');
  dialogLoaded = true;
}

document.querySelector('[data-dialog]').addEventListener('click', async (e) => {
  await ensureDialogLoaded();
  document.getElementById(e.target.dataset.dialog).showModal();
});
```

### Feature Detection

```javascript
// Check if custom elements are supported
if ('customElements' in window) {
  // Load Yetzirah components
  import('https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js');
} else {
  // Fallback for older browsers
  console.warn('Custom Elements not supported. Falling back to basic HTML.');
}

// Wait for specific component to be defined
customElements.whenDefined('ytz-dialog').then(() => {
  // Component is ready
  document.querySelectorAll('ytz-dialog').forEach(dialog => {
    // Initialize dialogs
  });
});
```

## Complete Application Example

See the [vanilla-app.html](../demos/cdn/vanilla-app.html) demo for a complete working example featuring:

- Task management with CRUD operations
- Dialog-based editing
- Drawer navigation
- Select-based filtering
- Autocomplete search
- Toggle for completion status
- LocalStorage persistence
- Event delegation
- State management

## Best Practices

### Performance

1. **Use event delegation** for dynamic content instead of attaching listeners to each element
2. **Lazy load components** that aren't immediately needed
3. **Debounce** rapid events like slider changes or autocomplete input

```javascript
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce((value) => {
  // Perform search
}, 300);

autocomplete.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});
```

### Accessibility

1. Components handle ARIA automatically, but ensure your content is accessible
2. Provide visible focus indicators via CSS
3. Use semantic HTML within components

```css
/* Ensure focus is visible */
ytz-button:focus-visible,
ytz-tab:focus-visible,
ytz-menuitem:focus-visible {
  outline: 2px solid var(--focus-color, #0066cc);
  outline-offset: 2px;
}
```

### Error Handling

```javascript
// Wrap component operations in try-catch
function safeShowDialog(dialogId) {
  try {
    const dialog = document.getElementById(dialogId);
    if (!dialog) {
      console.error(`Dialog not found: ${dialogId}`);
      return;
    }
    dialog.showModal();
  } catch (error) {
    console.error('Failed to show dialog:', error);
  }
}
```

---

See also:
- [CDN Usage Guide](./cdn-usage.md)
- [Preact + HTM Guide](./preact-htm.md)
- [CDN Demo](../demos/cdn/index.html)

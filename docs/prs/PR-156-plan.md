# PR-156: Server Framework Integration Patterns

## Overview

Create documentation for integrating Yetzirah with server-rendered frameworks (Rails, Laravel, Django). These frameworks benefit from the combination of:

1. **Server-rendered HTML** - Initial page content from the server
2. **Yetzirah components** - Declarative UI components that work without JavaScript build steps
3. **Alpine.js** - Lightweight reactivity for progressive enhancement

The goal is to show developers how to use Yetzirah in traditional server-rendered applications with minimal JavaScript complexity.

## Current State Analysis

Existing documentation:
- `docs/vanilla-patterns.md` - Progressive enhancement patterns for vanilla JS
- `docs/cdn-usage.md` - CDN loading strategies and import maps
- `packages/alpine/README.md` - Alpine.js plugin documentation with directives and magic methods

Missing:
- Framework-specific asset pipeline configuration
- Integration patterns with Hotwire/Turbo, Livewire, HTMX
- Example templates in each framework's templating language
- Common UI patterns (modals, forms, navigation) in server context

## Implementation Plan

### Step 1: Create `docs/rails-integration.md`

Rails integration guide covering:

1. **Asset Pipeline Setup**
   - Import maps (Rails 7+ default)
   - Alternative: esbuild or Vite configuration
   - Pinning Yetzirah and Alpine packages

2. **Hotwire/Turbo Compatibility**
   - Turbo Drive with custom elements (no special handling needed)
   - Turbo Frames with Yetzirah components
   - Turbo Streams updating components dynamically

3. **Alpine.js + Yetzirah Patterns**
   - Plugin registration in application.js
   - Using x-ytz:model in ERB templates
   - $ytz magic for Stimulus-like control

4. **Example Templates**
   - Modal dialog triggered from controller
   - Form with ytz-select and server validation
   - Navigation drawer with Turbo Frames
   - Snackbar notifications from flash messages

Example structure:
```erb
<%# app/views/shared/_dialog.html.erb %>
<div x-data="{ open: false }">
  <ytz-button @click="open = true"><%= trigger_text %></ytz-button>

  <ytz-dialog x-ytz-dialog="open">
    <%= yield %>
    <ytz-button @click="open = false">Close</ytz-button>
  </ytz-dialog>
</div>
```

### Step 2: Create `docs/laravel-integration.md`

Laravel integration guide covering:

1. **Vite Configuration**
   - Installing via npm/pnpm
   - Vite plugin configuration for Laravel
   - CDN fallback for simpler projects

2. **Livewire Integration**
   - Component state persistence with Alpine
   - wire:model vs x-ytz:model usage
   - Morphing compatibility with custom elements

3. **Blade Component Patterns**
   - Creating Blade components wrapping Yetzirah
   - Anonymous components for common patterns
   - Slot passing to Yetzirah slots

4. **Example Templates**
   - Livewire component with ytz-select
   - Modal with wire:submit integration
   - Alpine-controlled drawer navigation
   - Toast notifications with session flash

Example structure:
```blade
{{-- resources/views/components/dialog.blade.php --}}
<div x-data="{ open: @entangle($attributes->wire('model')) }">
    <ytz-dialog x-ytz-dialog="open">
        {{ $slot }}
    </ytz-dialog>
</div>
```

### Step 3: Create `docs/django-integration.md`

Django integration guide covering:

1. **Static Files Setup**
   - Using CDN (simplest approach)
   - Self-hosting via collectstatic
   - Django Compressor integration
   - WhiteNoise for production

2. **HTMX Integration**
   - HTMX + Yetzirah component updates
   - hx-swap with custom element innerHTML
   - Server-controlled dialog/drawer state
   - Out-of-band swaps for notifications

3. **Template Tag Patterns**
   - Custom template tags for common components
   - Alpine x-data initialization from Django context
   - CSRF token handling in HTMX + Yetzirah forms

4. **Example Templates**
   - Modal dialog with HTMX form submission
   - Search autocomplete with HTMX backend
   - Sidebar navigation with hx-boost
   - Django Messages as snackbar notifications

Example structure:
```html
{# templates/components/dialog.html #}
<div x-data="{ open: {{ open|lower }} }">
  <ytz-dialog x-ytz-dialog="open">
    {% block content %}{% endblock %}
  </ytz-dialog>
</div>
```

## Documentation Structure

Each guide will follow this structure:

```markdown
# Framework Integration Guide

## Quick Start
- Minimal setup for CDN usage
- "Hello World" with a Yetzirah component

## Installation
- Package installation (npm/pnpm/yarn)
- Asset pipeline configuration
- CDN alternative

## Framework Integration
- [Hotwire/Livewire/HTMX] compatibility notes
- State management patterns
- Form handling

## Common Patterns
### Modal Dialogs
### Forms with Validation
### Navigation Drawers
### Toast Notifications

## Example Application
- Link to demo or full example

## Troubleshooting
- Common issues and solutions
```

## Files to Create

| File | Description |
|------|-------------|
| `docs/rails-integration.md` | Rails + Hotwire/Turbo + Yetzirah + Alpine guide |
| `docs/laravel-integration.md` | Laravel + Livewire + Yetzirah + Alpine guide |
| `docs/django-integration.md` | Django + HTMX + Yetzirah guide |

## Key Integration Points

### Custom Element Compatibility

All three frameworks work well with custom elements because:
- Custom elements are valid HTML - servers can render them directly
- No hydration needed - elements self-initialize when JS loads
- Progressive enhancement - content is visible before JS
- Light DOM usage - frameworks can query/modify component content

### Framework-Specific Considerations

| Framework | Reactivity Library | Challenge | Solution |
|-----------|-------------------|-----------|----------|
| Rails | Hotwire/Turbo | Turbo Drive page caching | No issue - custom elements re-initialize |
| Laravel | Livewire | DOM morphing on update | Livewire 3.x handles custom elements |
| Django | HTMX | Partial HTML swaps | Use hx-swap="innerHTML" for content updates |

### Alpine.js as the Bridge

Alpine.js serves as the client-side "glue" because:
- No build step required (CDN-first)
- Declarative with x-attributes (matches server templates)
- Lightweight (~17KB) vs full frameworks
- `x-ytz:model` provides two-way binding for form components
- `$ytz` magic provides imperative control when needed

## Acceptance Criteria

- [ ] Rails guide: import maps setup, Turbo compatibility, ERB examples
- [ ] Laravel guide: Vite setup, Livewire integration, Blade examples
- [ ] Django guide: static files setup, HTMX patterns, template examples
- [ ] Each guide includes asset pipeline configuration
- [ ] Each guide includes common UI patterns (modal, form, nav, notifications)
- [ ] Each guide links to related documentation (Alpine README, CDN guide)
- [ ] Code examples are syntactically correct for each framework

## Dependencies

- PR-150 (Solid.js docs) - Completed
- PR-155 (Alpine.js docs) - Completed

# PR-154: Alpine.js Magic Methods

## Overview

Implement Alpine magic methods (`$ytz`) for imperative control of Yetzirah components. The current implementation already has some magic methods inline in `index.ts`, but this PR will:

1. Refactor magics into a dedicated `magics/ytz.ts` module
2. Add generic `open()`, `close()`, `toggle()` methods that auto-detect component type
3. Add `show()` method for Snackbar
4. Create comprehensive tests

## Current State Analysis

The existing `$ytz` magic in `index.ts` provides:
- `snackbar(message, options)` - creates and shows a snackbar
- `openDialog(target)` / `closeDialog(target)` - specific to dialogs
- `openDrawer(target)` / `closeDrawer(target)` - specific to drawers
- `toggleTheme()` / `getTheme()` / `setTheme()` - theme utilities

## Acceptance Criteria

- [x] `$ytz.open(selector)` opens Dialog/Drawer/Menu
- [x] `$ytz.close(selector)` closes Dialog/Drawer/Menu
- [x] `$ytz.toggle(selector)` toggles open state
- [x] `$ytz.show(selector, message)` shows Snackbar
- [x] Works with element refs or selectors

## Implementation Plan

### Step 1: Create `packages/alpine/src/magics/ytz.ts`

New file with:
- `resolveElement(target)` helper - resolves string selector or Element ref
- `open(target)` - sets `open` attribute, works with ytz-dialog, ytz-drawer, ytz-menu
- `close(target)` - removes `open` attribute
- `toggle(target)` - toggles `open` attribute state
- `show(target, message?)` - for snackbars:
  - If target is an existing snackbar element, opens it
  - If message provided, sets textContent and opens
  - Could also create programmatic snackbar like current `snackbar()` method
- Keep existing `snackbar()`, `openDialog()`, `closeDialog()`, etc. for backwards compatibility

### Step 2: Create `packages/alpine/src/magics/index.ts`

Export barrel file for magics module.

### Step 3: Update `packages/alpine/src/index.ts`

- Import `createYtzMagic` from `./magics`
- Delegate magic registration to the new module
- Keep interface `YtzMagic` updated with new methods

### Step 4: Create `packages/alpine/src/__tests__/magics.test.ts`

Test cases:
- `$ytz.open('#my-dialog')` opens a dialog
- `$ytz.open('#my-drawer')` opens a drawer
- `$ytz.open('#my-menu')` opens a menu
- `$ytz.close()` closes components
- `$ytz.toggle()` toggles open state
- `$ytz.show('#snackbar')` opens existing snackbar
- `$ytz.show('#snackbar', 'Hello')` sets message and opens
- Works with Element refs in addition to selectors
- Error handling for invalid selectors

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/alpine/src/magics/ytz.ts` | Create | Magic methods implementation |
| `packages/alpine/src/magics/index.ts` | Create | Barrel export |
| `packages/alpine/src/index.ts` | Modify | Import and use refactored magics |
| `packages/alpine/src/index.d.ts` | Modify | Update types with new methods |
| `packages/alpine/src/__tests__/magics.test.ts` | Create | Tests for magic methods |

## API Design

```typescript
interface YtzMagic {
  // New generic methods (PR-154)
  open(target: string | HTMLElement): void
  close(target: string | HTMLElement): void
  toggle(target: string | HTMLElement): void
  show(target: string | HTMLElement, message?: string): void

  // Existing methods (keep for backwards compatibility)
  snackbar(message: string, options?: SnackbarOptions): HTMLElement
  openDialog(target: string | HTMLElement): void
  closeDialog(target: string | HTMLElement): void
  openDrawer(target: string | HTMLElement): void
  closeDrawer(target: string | HTMLElement): void
  toggleTheme(): 'light' | 'dark'
  getTheme(): string
  setTheme(theme: 'light' | 'dark'): void
}
```

## Usage Examples

```html
<!-- Open/close any openable component -->
<button @click="$ytz.open('#my-dialog')">Open Dialog</button>
<button @click="$ytz.toggle('#sidebar')">Toggle Sidebar</button>

<!-- Show snackbar with message -->
<button @click="$ytz.show('#notification', 'Saved!')">Save</button>

<!-- Works with $refs -->
<div x-data>
  <button @click="$ytz.open($refs.menu)">Open Menu</button>
  <ytz-menu x-ref="menu">...</ytz-menu>
</div>
```

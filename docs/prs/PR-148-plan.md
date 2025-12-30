# PR-148: Solid.js Core Component Wrappers

## Overview
Create Solid.js component wrappers for all Yetzirah core web components, following Solid's reactive patterns with createSignal, createEffect, and onCleanup.

## Components to Implement

### Tier 1 - Core Components (15 files)
1. `Button.tsx` - Polymorphic button/anchor
2. `Disclosure.tsx` - Expandable content
3. `Dialog.tsx` - Modal dialog with focus trap
4. `Tabs.tsx` + `Tab.tsx` + `TabPanel.tsx` - Tab navigation
5. `Tooltip.tsx` - Hover/focus tooltip
6. `Menu.tsx` + `MenuItem.tsx` + `MenuTrigger.tsx` - Dropdown menu
7. `Autocomplete.tsx` + `AutocompleteOption.tsx` - Combobox
8. `Listbox.tsx` + `ListboxOption.tsx` - Selection list
9. `Select.tsx` + `SelectOption.tsx` - Dropdown select
10. `Accordion.tsx` + `AccordionItem.tsx` - Collapsible panels
11. `Drawer.tsx` - Slide-out panel
12. `Popover.tsx` - Positioned popover

### Tier 2 - Enhanced Components (6 files)
1. `Toggle.tsx` - Switch component
2. `Chip.tsx` - Tag/chip component
3. `IconButton.tsx` - Icon-only button
4. `Slider.tsx` - Range input
5. `ThemeToggle.tsx` - Theme switcher
6. `DataGrid.tsx` - Data table

### Tier 3 - New Components (3 files)
1. `Snackbar.tsx` - Toast notifications
2. `Progress.tsx` - Progress indicators (linear, circular, spinner)
3. `Badge.tsx` - Badge/counter

## Implementation Pattern

Each component follows this Solid.js pattern:

```tsx
import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'
import '@grimoire/yetzirah-core'

interface DialogProps extends JSX.HTMLAttributes<HTMLElement> {
  open?: boolean
  onClose?: () => void
  static?: boolean
  children?: JSX.Element
}

export const Dialog: Component<DialogProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'onClose', 'static', 'children'])

  // Sync open prop reactively
  createEffect(() => {
    if (!ref) return
    if (local.open) {
      ref.setAttribute('open', '')
    } else {
      ref.removeAttribute('open')
    }
  })

  // Handle close events
  createEffect(() => {
    if (!ref || !local.onClose) return
    const handler = () => local.onClose?.()
    ref.addEventListener('close', handler)
    onCleanup(() => ref?.removeEventListener('close', handler))
  })

  return (
    <ytz-dialog
      ref={ref}
      static={local.static || undefined}
      {...others}
    >
      {local.children}
    </ytz-dialog>
  )
}
```

## File Structure
```
packages/solid/src/
├── index.ts           # Re-exports all components
├── index.d.ts         # Type declarations
├── jsx.d.ts           # Solid JSX augmentation
├── Button.tsx
├── Disclosure.tsx
├── Dialog.tsx
├── Tabs.tsx
├── Tab.tsx
├── TabPanel.tsx
├── Tooltip.tsx
├── Menu.tsx
├── MenuItem.tsx
├── MenuTrigger.tsx
├── Autocomplete.tsx
├── AutocompleteOption.tsx
├── Listbox.tsx
├── ListboxOption.tsx
├── Select.tsx
├── SelectOption.tsx
├── Accordion.tsx
├── AccordionItem.tsx
├── Drawer.tsx
├── Popover.tsx
├── Toggle.tsx
├── Chip.tsx
├── IconButton.tsx
├── Slider.tsx
├── ThemeToggle.tsx
├── DataGrid.tsx
├── Snackbar.tsx
├── Progress.tsx
└── Badge.tsx
```

## Tasks

1. **Create component files** (24 components)
   - Follow React wrapper patterns adapted for Solid
   - Use splitProps for prop separation
   - Use createEffect for reactive attribute sync
   - Use onCleanup for event listener cleanup

2. **Update index.ts exports**
   - Export all components
   - Export prop types

3. **Update tsup.config.js**
   - Add solid-js/jsx-runtime support
   - Configure JSX transform

4. **Update package.json**
   - Add entry for each component if needed

5. **Verify build succeeds**

## Dependencies
- PR-147 (completed): Solid.js Package Setup

## Acceptance Criteria
- [ ] All 24 component wrappers created
- [ ] TypeScript types exported
- [ ] Package builds without errors
- [ ] Components follow Solid.js reactive patterns

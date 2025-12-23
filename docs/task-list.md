# Tier 1 Framework Wrappers Task List

## Orchestration Metadata

```yaml
version: 1.0
total_prs: 39
phases:
  - name: Vue 3 Wrappers
    prs: [PR-086, PR-087, PR-088, PR-089, PR-090, PR-091, PR-092, PR-093, PR-094, PR-095, PR-096, PR-097]
    parallel: true
  - name: Svelte Wrappers
    prs: [PR-098, PR-099, PR-100, PR-101, PR-102, PR-103, PR-104, PR-105, PR-106, PR-107, PR-108, PR-109]
    parallel: true
  - name: Angular Wrappers
    prs: [PR-110, PR-111, PR-112, PR-113, PR-114, PR-115, PR-116, PR-117, PR-118, PR-119, PR-120, PR-121]
    parallel: true
  - name: Documentation & Verification
    prs: [PR-122, PR-123, PR-124]
    parallel: false
```

---

## Block 1: Vue 3 Wrappers

### PR-086: Vue Button Wrapper

---
pr_id: PR-086
title: Vue Button Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Simple wrapper following existing patterns, polymorphic button/anchor
dependencies: []
estimated_files:
  - path: packages/vue/src/Button.vue
    action: create
    description: Vue wrapper for ytz-button with href/onclick polymorphism
  - path: packages/vue/src/Button.spec.ts
    action: create
    description: Tests for Button wrapper
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Button component
---

**Description:**
Create Vue 3 wrapper for `<ytz-button>` component. Handle polymorphic behavior (renders as `<a>` when href provided, `<button>` otherwise). Forward all attributes and events.

**Acceptance Criteria:**
- [ ] Button.vue wrapper created with proper typing
- [ ] Href prop renders anchor, otherwise renders button
- [ ] Click events forwarded correctly
- [ ] Tests pass for mount, props, and events

---

### PR-087: Vue Disclosure Wrapper

---
pr_id: PR-087
title: Vue Disclosure Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Two-way binding for open state via v-model:open
dependencies: []
estimated_files:
  - path: packages/vue/src/Disclosure.vue
    action: create
    description: Vue wrapper with v-model:open support
  - path: packages/vue/src/Disclosure.spec.ts
    action: create
    description: Tests for Disclosure wrapper
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Disclosure component
---

**Description:**
Create Vue 3 wrapper for `<ytz-disclosure>` component. Support `v-model:open` for two-way binding of expanded state. Use `defineModel` for Vue 3.4+ compatibility.

**Acceptance Criteria:**
- [ ] Disclosure.vue wrapper with v-model:open support
- [ ] Bidirectional open state binding works
- [ ] Toggle event emitted on state change
- [ ] Tests pass for open/close behavior

---

### PR-088: Vue Dialog Wrapper

---
pr_id: PR-088
title: Vue Dialog Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 30
  suggested_model: sonnet
  rationale: Focus trap, scroll lock, escape-to-close require careful event handling
dependencies: []
estimated_files:
  - path: packages/vue/src/Dialog.vue
    action: create
    description: Vue wrapper with v-model:open and close event
  - path: packages/vue/src/Dialog.spec.ts
    action: create
    description: Tests for Dialog wrapper
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Dialog component
---

**Description:**
Create Vue 3 wrapper for `<ytz-dialog>` component. Support `v-model:open` for modal visibility. Handle close event from escape key and backdrop click.

**Acceptance Criteria:**
- [ ] Dialog.vue wrapper with v-model:open
- [ ] Close event properly forwarded
- [ ] Modal opens/closes based on open prop
- [ ] Tests pass including escape key behavior

---

### PR-089: Vue Tabs Wrapper

---
pr_id: PR-089
title: Vue Tabs Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 35
  suggested_model: sonnet
  rationale: Tab/TabList/TabPanel coordination, keyboard navigation
dependencies: []
estimated_files:
  - path: packages/vue/src/Tabs.vue
    action: create
    description: Vue wrapper for tabs container
  - path: packages/vue/src/TabList.vue
    action: create
    description: Vue wrapper for tab list
  - path: packages/vue/src/Tab.vue
    action: create
    description: Vue wrapper for individual tab
  - path: packages/vue/src/TabPanel.vue
    action: create
    description: Vue wrapper for tab panel
  - path: packages/vue/src/Tabs.spec.ts
    action: create
    description: Tests for Tabs components
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Tabs components
---

**Description:**
Create Vue 3 wrappers for `<ytz-tabs>`, `<ytz-tab-list>`, `<ytz-tab>`, and `<ytz-tab-panel>` components. Support v-model for selected tab index.

**Acceptance Criteria:**
- [ ] All four tab components wrapped
- [ ] Keyboard navigation works (arrow keys)
- [ ] Selected tab syncs with v-model
- [ ] Tests pass for tab switching

---

### PR-090: Vue Tooltip Wrapper

---
pr_id: PR-090
title: Vue Tooltip Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Positioning and delay logic handled by core, wrapper is thin
dependencies: []
estimated_files:
  - path: packages/vue/src/Tooltip.vue
    action: create
    description: Vue wrapper for tooltip with trigger slot
  - path: packages/vue/src/Tooltip.spec.ts
    action: create
    description: Tests for Tooltip wrapper
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Tooltip component
---

**Description:**
Create Vue 3 wrapper for `<ytz-tooltip>` component. Pass through content prop and delay settings. Use default slot for trigger element.

**Acceptance Criteria:**
- [ ] Tooltip.vue wrapper with content prop
- [ ] Trigger slot works correctly
- [ ] Delay props forwarded
- [ ] Tests pass for hover behavior

---

### PR-091: Vue Menu Wrapper

---
pr_id: PR-091
title: Vue Menu Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 35
  suggested_model: sonnet
  rationale: Menu/MenuItem coordination, keyboard nav, click-outside
dependencies: []
estimated_files:
  - path: packages/vue/src/Menu.vue
    action: create
    description: Vue wrapper for menu container
  - path: packages/vue/src/MenuItem.vue
    action: create
    description: Vue wrapper for menu item
  - path: packages/vue/src/MenuTrigger.vue
    action: create
    description: Vue wrapper for menu trigger
  - path: packages/vue/src/Menu.spec.ts
    action: create
    description: Tests for Menu components
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Menu components
---

**Description:**
Create Vue 3 wrappers for `<ytz-menu>`, `<ytz-menu-item>`, and `<ytz-menu-trigger>`. Handle v-model:open for menu visibility.

**Acceptance Criteria:**
- [ ] All menu components wrapped
- [ ] Click-outside closes menu
- [ ] Keyboard navigation works
- [ ] Tests pass for menu interactions

---

### PR-092: Vue Autocomplete Wrapper

---
pr_id: PR-092
title: Vue Autocomplete Wrapper
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 45
  suggested_model: sonnet
  rationale: Text input binding, filtering, keyboard nav, single/multi-select
dependencies: []
estimated_files:
  - path: packages/vue/src/Autocomplete.vue
    action: create
    description: Vue wrapper with v-model for selected value
  - path: packages/vue/src/AutocompleteOption.vue
    action: create
    description: Vue wrapper for autocomplete option
  - path: packages/vue/src/Autocomplete.spec.ts
    action: create
    description: Tests for Autocomplete components
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Autocomplete components
---

**Description:**
Create Vue 3 wrappers for `<ytz-autocomplete>` and `<ytz-autocomplete-option>`. Support v-model for selected value(s), v-model:query for input text.

**Acceptance Criteria:**
- [ ] Autocomplete wrapper with dual v-model support
- [ ] Filtering works via query binding
- [ ] Single and multi-select modes work
- [ ] Tests pass for selection behavior

---

### PR-093: Vue Listbox Wrapper

---
pr_id: PR-093
title: Vue Listbox Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Simpler than Autocomplete - no text input
dependencies: []
estimated_files:
  - path: packages/vue/src/Listbox.vue
    action: create
    description: Vue wrapper with v-model for selected value
  - path: packages/vue/src/ListboxOption.vue
    action: create
    description: Vue wrapper for listbox option
  - path: packages/vue/src/Listbox.spec.ts
    action: create
    description: Tests for Listbox components
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Listbox components
---

**Description:**
Create Vue 3 wrappers for `<ytz-listbox>` and `<ytz-listbox-option>`. Support v-model for selected value.

**Acceptance Criteria:**
- [ ] Listbox wrapper with v-model
- [ ] Keyboard navigation works
- [ ] Selection change events emitted
- [ ] Tests pass for selection

---

### PR-094: Vue Select Wrapper

---
pr_id: PR-094
title: Vue Select Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 30
  suggested_model: sonnet
  rationale: Listbox + trigger button coordination
dependencies: []
estimated_files:
  - path: packages/vue/src/Select.vue
    action: create
    description: Vue wrapper with v-model for selected value
  - path: packages/vue/src/SelectOption.vue
    action: create
    description: Vue wrapper for select option
  - path: packages/vue/src/Select.spec.ts
    action: create
    description: Tests for Select components
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Select components
---

**Description:**
Create Vue 3 wrappers for `<ytz-select>` and `<ytz-select-option>`. Support v-model for selected value, v-model:open for dropdown visibility.

**Acceptance Criteria:**
- [ ] Select wrapper with v-model
- [ ] Trigger button opens/closes dropdown
- [ ] Keyboard navigation works
- [ ] Tests pass for selection behavior

---

### PR-095: Vue Accordion Wrapper

---
pr_id: PR-095
title: Vue Accordion Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 30
  suggested_model: sonnet
  rationale: Coordinated disclosures, exclusive mode option
dependencies: []
estimated_files:
  - path: packages/vue/src/Accordion.vue
    action: create
    description: Vue wrapper for accordion container
  - path: packages/vue/src/AccordionItem.vue
    action: create
    description: Vue wrapper for accordion item
  - path: packages/vue/src/Accordion.spec.ts
    action: create
    description: Tests for Accordion components
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Accordion components
---

**Description:**
Create Vue 3 wrappers for `<ytz-accordion>` and `<ytz-accordion-item>`. Support exclusive mode prop for single-open behavior.

**Acceptance Criteria:**
- [ ] Accordion components wrapped
- [ ] Exclusive mode works (only one open at a time)
- [ ] Multiple open mode works
- [ ] Tests pass for expand/collapse

---

### PR-096: Vue Drawer Wrapper

---
pr_id: PR-096
title: Vue Drawer Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 30
  suggested_model: sonnet
  rationale: Dialog variant with slide-in positioning, same focus trap logic
dependencies: []
estimated_files:
  - path: packages/vue/src/Drawer.vue
    action: create
    description: Vue wrapper with v-model:open and position prop
  - path: packages/vue/src/Drawer.spec.ts
    action: create
    description: Tests for Drawer wrapper
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Drawer component
---

**Description:**
Create Vue 3 wrapper for `<ytz-drawer>` component. Support v-model:open and position prop (left, right, top, bottom).

**Acceptance Criteria:**
- [ ] Drawer.vue wrapper with v-model:open
- [ ] Position prop works for all 4 edges
- [ ] Close event properly forwarded
- [ ] Tests pass for open/close behavior

---

### PR-097: Vue Popover Wrapper

---
pr_id: PR-097
title: Vue Popover Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Click-triggered tooltip variant
dependencies: []
estimated_files:
  - path: packages/vue/src/Popover.vue
    action: create
    description: Vue wrapper with v-model:open
  - path: packages/vue/src/Popover.spec.ts
    action: create
    description: Tests for Popover wrapper
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Popover component
---

**Description:**
Create Vue 3 wrapper for `<ytz-popover>` component. Support v-model:open for popover visibility. Use slots for trigger and content.

**Acceptance Criteria:**
- [ ] Popover.vue wrapper with v-model:open
- [ ] Click to open/close works
- [ ] Click-outside closes popover
- [ ] Tests pass for visibility toggle

---

## Block 2: Svelte Wrappers

### PR-098: Svelte Button Wrapper

---
pr_id: PR-098
title: Svelte Button Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 15
  suggested_model: haiku
  rationale: Thinnest wrapper, Svelte's excellent WC interop
dependencies: []
estimated_files:
  - path: packages/svelte/src/Button.svelte
    action: create
    description: Svelte wrapper for ytz-button
  - path: packages/svelte/src/Button.spec.ts
    action: create
    description: Tests for Button wrapper
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Button component
---

**Description:**
Create Svelte wrapper for `<ytz-button>` component. Forward all props and events. Handle href polymorphism.

**Acceptance Criteria:**
- [ ] Button.svelte wrapper created (~15 lines)
- [ ] Href/onclick polymorphism works
- [ ] Events forwarded correctly
- [ ] Tests pass

---

### PR-099: Svelte Disclosure Wrapper

---
pr_id: PR-099
title: Svelte Disclosure Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: bind:open for reactive binding
dependencies: []
estimated_files:
  - path: packages/svelte/src/Disclosure.svelte
    action: create
    description: Svelte wrapper with bind:open support
  - path: packages/svelte/src/Disclosure.spec.ts
    action: create
    description: Tests for Disclosure wrapper
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Disclosure component
---

**Description:**
Create Svelte wrapper for `<ytz-disclosure>` component. Support `bind:open` for two-way binding of expanded state.

**Acceptance Criteria:**
- [ ] Disclosure.svelte with bind:open support
- [ ] Bidirectional binding works
- [ ] Toggle event dispatched
- [ ] Tests pass

---

### PR-100: Svelte Dialog Wrapper

---
pr_id: PR-100
title: Svelte Dialog Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: bind:open plus close event handling
dependencies: []
estimated_files:
  - path: packages/svelte/src/Dialog.svelte
    action: create
    description: Svelte wrapper with bind:open
  - path: packages/svelte/src/Dialog.spec.ts
    action: create
    description: Tests for Dialog wrapper
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Dialog component
---

**Description:**
Create Svelte wrapper for `<ytz-dialog>` component. Support `bind:open` for modal visibility. Forward close event.

**Acceptance Criteria:**
- [ ] Dialog.svelte with bind:open
- [ ] Close event forwarded
- [ ] Modal opens/closes reactively
- [ ] Tests pass

---

### PR-101: Svelte Tabs Wrapper

---
pr_id: PR-101
title: Svelte Tabs Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Multiple components, keyboard nav handled by core
dependencies: []
estimated_files:
  - path: packages/svelte/src/Tabs.svelte
    action: create
    description: Svelte wrapper for tabs container
  - path: packages/svelte/src/TabList.svelte
    action: create
    description: Svelte wrapper for tab list
  - path: packages/svelte/src/Tab.svelte
    action: create
    description: Svelte wrapper for tab
  - path: packages/svelte/src/TabPanel.svelte
    action: create
    description: Svelte wrapper for tab panel
  - path: packages/svelte/src/Tabs.spec.ts
    action: create
    description: Tests for Tabs components
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Tabs components
---

**Description:**
Create Svelte wrappers for tabs components. Support bind:selectedIndex for active tab.

**Acceptance Criteria:**
- [ ] All tab components wrapped
- [ ] bind:selectedIndex works
- [ ] Keyboard navigation works
- [ ] Tests pass

---

### PR-102: Svelte Tooltip Wrapper

---
pr_id: PR-102
title: Svelte Tooltip Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 15
  suggested_model: haiku
  rationale: Simple prop forwarding, slot for trigger
dependencies: []
estimated_files:
  - path: packages/svelte/src/Tooltip.svelte
    action: create
    description: Svelte wrapper for tooltip
  - path: packages/svelte/src/Tooltip.spec.ts
    action: create
    description: Tests for Tooltip wrapper
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Tooltip component
---

**Description:**
Create Svelte wrapper for `<ytz-tooltip>` component. Pass content and delay props.

**Acceptance Criteria:**
- [ ] Tooltip.svelte wrapper
- [ ] Content prop works
- [ ] Default slot for trigger
- [ ] Tests pass

---

### PR-103: Svelte Menu Wrapper

---
pr_id: PR-103
title: Svelte Menu Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Multiple components, bind:open support
dependencies: []
estimated_files:
  - path: packages/svelte/src/Menu.svelte
    action: create
    description: Svelte wrapper for menu
  - path: packages/svelte/src/MenuItem.svelte
    action: create
    description: Svelte wrapper for menu item
  - path: packages/svelte/src/MenuTrigger.svelte
    action: create
    description: Svelte wrapper for menu trigger
  - path: packages/svelte/src/Menu.spec.ts
    action: create
    description: Tests for Menu components
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Menu components
---

**Description:**
Create Svelte wrappers for menu components. Support bind:open for menu visibility.

**Acceptance Criteria:**
- [ ] All menu components wrapped
- [ ] bind:open works
- [ ] Click-outside closes menu
- [ ] Tests pass

---

### PR-104: Svelte Autocomplete Wrapper

---
pr_id: PR-104
title: Svelte Autocomplete Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 35
  suggested_model: sonnet
  rationale: Dual binding (value + query), filtering
dependencies: []
estimated_files:
  - path: packages/svelte/src/Autocomplete.svelte
    action: create
    description: Svelte wrapper with bind:value and bind:query
  - path: packages/svelte/src/AutocompleteOption.svelte
    action: create
    description: Svelte wrapper for option
  - path: packages/svelte/src/Autocomplete.spec.ts
    action: create
    description: Tests for Autocomplete components
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Autocomplete components
---

**Description:**
Create Svelte wrappers for autocomplete components. Support bind:value for selection, bind:query for input text.

**Acceptance Criteria:**
- [ ] Autocomplete wrapper with dual binding
- [ ] Filtering works
- [ ] Selection events work
- [ ] Tests pass

---

### PR-105: Svelte Listbox Wrapper

---
pr_id: PR-105
title: Svelte Listbox Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Simple value binding
dependencies: []
estimated_files:
  - path: packages/svelte/src/Listbox.svelte
    action: create
    description: Svelte wrapper with bind:value
  - path: packages/svelte/src/ListboxOption.svelte
    action: create
    description: Svelte wrapper for option
  - path: packages/svelte/src/Listbox.spec.ts
    action: create
    description: Tests for Listbox components
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Listbox components
---

**Description:**
Create Svelte wrappers for listbox components. Support bind:value for selection.

**Acceptance Criteria:**
- [ ] Listbox wrapper with bind:value
- [ ] Keyboard navigation works
- [ ] Tests pass

---

### PR-106: Svelte Select Wrapper

---
pr_id: PR-106
title: Svelte Select Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Listbox + trigger, bind:value and bind:open
dependencies: []
estimated_files:
  - path: packages/svelte/src/Select.svelte
    action: create
    description: Svelte wrapper with bind:value and bind:open
  - path: packages/svelte/src/SelectOption.svelte
    action: create
    description: Svelte wrapper for option
  - path: packages/svelte/src/Select.spec.ts
    action: create
    description: Tests for Select components
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Select components
---

**Description:**
Create Svelte wrappers for select components. Support bind:value for selection, bind:open for dropdown.

**Acceptance Criteria:**
- [ ] Select wrapper with dual binding
- [ ] Trigger button works
- [ ] Tests pass

---

### PR-107: Svelte Accordion Wrapper

---
pr_id: PR-107
title: Svelte Accordion Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Multiple disclosures, exclusive mode
dependencies: []
estimated_files:
  - path: packages/svelte/src/Accordion.svelte
    action: create
    description: Svelte wrapper for accordion
  - path: packages/svelte/src/AccordionItem.svelte
    action: create
    description: Svelte wrapper for accordion item
  - path: packages/svelte/src/Accordion.spec.ts
    action: create
    description: Tests for Accordion components
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Accordion components
---

**Description:**
Create Svelte wrappers for accordion components. Support exclusive prop for single-open mode.

**Acceptance Criteria:**
- [ ] Accordion components wrapped
- [ ] Exclusive mode works
- [ ] Tests pass

---

### PR-108: Svelte Drawer Wrapper

---
pr_id: PR-108
title: Svelte Drawer Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Dialog variant with position prop
dependencies: []
estimated_files:
  - path: packages/svelte/src/Drawer.svelte
    action: create
    description: Svelte wrapper with bind:open and position
  - path: packages/svelte/src/Drawer.spec.ts
    action: create
    description: Tests for Drawer wrapper
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Drawer component
---

**Description:**
Create Svelte wrapper for drawer component. Support bind:open and position prop.

**Acceptance Criteria:**
- [ ] Drawer.svelte with bind:open
- [ ] Position prop works (left/right/top/bottom)
- [ ] Tests pass

---

### PR-109: Svelte Popover Wrapper

---
pr_id: PR-109
title: Svelte Popover Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Click-triggered tooltip
dependencies: []
estimated_files:
  - path: packages/svelte/src/Popover.svelte
    action: create
    description: Svelte wrapper with bind:open
  - path: packages/svelte/src/Popover.spec.ts
    action: create
    description: Tests for Popover wrapper
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Popover component
---

**Description:**
Create Svelte wrapper for popover component. Support bind:open for visibility.

**Acceptance Criteria:**
- [ ] Popover.svelte with bind:open
- [ ] Click toggle works
- [ ] Tests pass

---

## Block 3: Angular Wrappers

### PR-110: Angular Button Wrapper

---
pr_id: PR-110
title: Angular Button Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Angular boilerplate, @Input/@Output decorators
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/button.component.ts
    action: create
    description: Angular component for ytz-button
  - path: packages/angular/src/lib/button.component.spec.ts
    action: create
    description: Tests for Button component
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Button to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Button component
---

**Description:**
Create Angular wrapper for `<ytz-button>` component. Use @Input for href and @Output for click. Handle polymorphic rendering.

**Acceptance Criteria:**
- [ ] ButtonComponent created with proper decorators
- [ ] Href/click polymorphism works
- [ ] OnPush change detection
- [ ] Tests pass

---

### PR-111: Angular Disclosure Wrapper

---
pr_id: PR-111
title: Angular Disclosure Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Two-way binding with [(open)]
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/disclosure.component.ts
    action: create
    description: Angular component with two-way open binding
  - path: packages/angular/src/lib/disclosure.component.spec.ts
    action: create
    description: Tests for Disclosure component
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Disclosure to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Disclosure component
---

**Description:**
Create Angular wrapper for `<ytz-disclosure>` component. Support [(open)] two-way binding via @Input/@Output pair.

**Acceptance Criteria:**
- [ ] DisclosureComponent with [(open)] support
- [ ] openChange event emitter
- [ ] Tests pass

---

### PR-112: Angular Dialog Wrapper

---
pr_id: PR-112
title: Angular Dialog Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 35
  suggested_model: sonnet
  rationale: Focus trap, escape handling, two-way open binding
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/dialog.component.ts
    action: create
    description: Angular component with [(open)] and close event
  - path: packages/angular/src/lib/dialog.component.spec.ts
    action: create
    description: Tests for Dialog component
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Dialog to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Dialog component
---

**Description:**
Create Angular wrapper for `<ytz-dialog>` component. Support [(open)] binding and (close) event output.

**Acceptance Criteria:**
- [ ] DialogComponent with two-way binding
- [ ] Close event emitter
- [ ] Modal behavior works
- [ ] Tests pass

---

### PR-113: Angular Tabs Wrapper

---
pr_id: PR-113
title: Angular Tabs Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 40
  suggested_model: sonnet
  rationale: Multiple components, selected index binding
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/tabs.component.ts
    action: create
    description: Angular component for tabs container
  - path: packages/angular/src/lib/tab-list.component.ts
    action: create
    description: Angular component for tab list
  - path: packages/angular/src/lib/tab.component.ts
    action: create
    description: Angular component for tab
  - path: packages/angular/src/lib/tab-panel.component.ts
    action: create
    description: Angular component for tab panel
  - path: packages/angular/src/lib/tabs.component.spec.ts
    action: create
    description: Tests for Tabs components
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Tabs components to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Tabs components
---

**Description:**
Create Angular wrappers for tabs components. Support [(selectedIndex)] for active tab binding.

**Acceptance Criteria:**
- [ ] All tab components wrapped
- [ ] Selected index binding works
- [ ] Keyboard navigation works
- [ ] Tests pass

---

### PR-114: Angular Tooltip Wrapper

---
pr_id: PR-114
title: Angular Tooltip Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Simple prop forwarding
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/tooltip.component.ts
    action: create
    description: Angular component for tooltip
  - path: packages/angular/src/lib/tooltip.component.spec.ts
    action: create
    description: Tests for Tooltip component
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Tooltip to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Tooltip component
---

**Description:**
Create Angular wrapper for `<ytz-tooltip>` component. Input for content and delay props.

**Acceptance Criteria:**
- [ ] TooltipComponent with content input
- [ ] Delay prop works
- [ ] ng-content for trigger
- [ ] Tests pass

---

### PR-115: Angular Menu Wrapper

---
pr_id: PR-115
title: Angular Menu Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 35
  suggested_model: sonnet
  rationale: Multiple components, keyboard nav, click-outside
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/menu.component.ts
    action: create
    description: Angular component for menu
  - path: packages/angular/src/lib/menu-item.component.ts
    action: create
    description: Angular component for menu item
  - path: packages/angular/src/lib/menu-trigger.component.ts
    action: create
    description: Angular component for menu trigger
  - path: packages/angular/src/lib/menu.component.spec.ts
    action: create
    description: Tests for Menu components
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Menu components to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Menu components
---

**Description:**
Create Angular wrappers for menu components. Support [(open)] for menu visibility.

**Acceptance Criteria:**
- [ ] All menu components wrapped
- [ ] Open binding works
- [ ] Click-outside closes
- [ ] Tests pass

---

### PR-116: Angular Autocomplete Wrapper

---
pr_id: PR-116
title: Angular Autocomplete Wrapper with ControlValueAccessor
cold_state: completed
priority: high
complexity:
  score: 6
  estimated_minutes: 50
  suggested_model: sonnet
  rationale: ControlValueAccessor for ngModel/formControl, query binding
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/autocomplete.component.ts
    action: create
    description: Angular component with ControlValueAccessor
  - path: packages/angular/src/lib/autocomplete-option.component.ts
    action: create
    description: Angular component for option
  - path: packages/angular/src/lib/autocomplete.component.spec.ts
    action: create
    description: Tests for Autocomplete components
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Autocomplete components to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Autocomplete components
---

**Description:**
Create Angular wrappers for autocomplete components. Implement ControlValueAccessor for ngModel/formControl integration. Support query input for filtering.

**Acceptance Criteria:**
- [ ] AutocompleteComponent with ControlValueAccessor
- [ ] ngModel works
- [ ] Reactive forms work
- [ ] Query binding for filtering
- [ ] Tests pass

---

### PR-117: Angular Listbox Wrapper

---
pr_id: PR-117
title: Angular Listbox Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Simple value binding without CVA (not a form control)
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/listbox.component.ts
    action: create
    description: Angular component for listbox
  - path: packages/angular/src/lib/listbox-option.component.ts
    action: create
    description: Angular component for option
  - path: packages/angular/src/lib/listbox.component.spec.ts
    action: create
    description: Tests for Listbox components
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Listbox components to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Listbox components
---

**Description:**
Create Angular wrappers for listbox components. Support [(value)] two-way binding.

**Acceptance Criteria:**
- [ ] ListboxComponent with value binding
- [ ] valueChange event emitter
- [ ] Keyboard navigation works
- [ ] Tests pass

---

### PR-118: Angular Select Wrapper

---
pr_id: PR-118
title: Angular Select Wrapper with ControlValueAccessor
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 45
  suggested_model: sonnet
  rationale: ControlValueAccessor for form integration
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/select.component.ts
    action: create
    description: Angular component with ControlValueAccessor
  - path: packages/angular/src/lib/select-option.component.ts
    action: create
    description: Angular component for option
  - path: packages/angular/src/lib/select.component.spec.ts
    action: create
    description: Tests for Select components
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Select components to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Select components
---

**Description:**
Create Angular wrappers for select components. Implement ControlValueAccessor for ngModel/formControl integration.

**Acceptance Criteria:**
- [ ] SelectComponent with ControlValueAccessor
- [ ] ngModel works
- [ ] Reactive forms work
- [ ] Tests pass

---

### PR-119: Angular Accordion Wrapper

---
pr_id: PR-119
title: Angular Accordion Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 30
  suggested_model: sonnet
  rationale: Coordinated items, exclusive mode
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/accordion.component.ts
    action: create
    description: Angular component for accordion
  - path: packages/angular/src/lib/accordion-item.component.ts
    action: create
    description: Angular component for accordion item
  - path: packages/angular/src/lib/accordion.component.spec.ts
    action: create
    description: Tests for Accordion components
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Accordion components to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Accordion components
---

**Description:**
Create Angular wrappers for accordion components. Support exclusive input for single-open mode.

**Acceptance Criteria:**
- [ ] AccordionComponent with exclusive input
- [ ] Items coordinate correctly
- [ ] Tests pass

---

### PR-120: Angular Drawer Wrapper

---
pr_id: PR-120
title: Angular Drawer Wrapper
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 30
  suggested_model: sonnet
  rationale: Dialog variant with position binding
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/drawer.component.ts
    action: create
    description: Angular component with [(open)] and position
  - path: packages/angular/src/lib/drawer.component.spec.ts
    action: create
    description: Tests for Drawer component
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Drawer to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Drawer component
---

**Description:**
Create Angular wrapper for drawer component. Support [(open)] and position input.

**Acceptance Criteria:**
- [ ] DrawerComponent with open binding
- [ ] Position input works (left/right/top/bottom)
- [ ] Close event emitter
- [ ] Tests pass

---

### PR-121: Angular Popover Wrapper

---
pr_id: PR-121
title: Angular Popover Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Click-triggered tooltip
dependencies: []
estimated_files:
  - path: packages/angular/src/lib/popover.component.ts
    action: create
    description: Angular component with [(open)]
  - path: packages/angular/src/lib/popover.component.spec.ts
    action: create
    description: Tests for Popover component
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: modify
    description: Add Popover to module exports
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Popover component
---

**Description:**
Create Angular wrapper for popover component. Support [(open)] binding.

**Acceptance Criteria:**
- [ ] PopoverComponent with open binding
- [ ] Click toggle works
- [ ] ng-content slots for trigger and content
- [ ] Tests pass

---

## Block 4: Documentation & Verification

### PR-122: Framework Wrapper Tests for Tier 1 Components

---
pr_id: PR-122
title: Framework Wrapper Tests for Tier 1 Components
cold_state: new
priority: high
complexity:
  score: 5
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Integration tests across all three frameworks
dependencies:
  - PR-097
  - PR-109
  - PR-121
estimated_files:
  - path: packages/vue/src/__tests__/tier1-integration.spec.ts
    action: create
    description: Integration tests for Vue Tier 1 wrappers
  - path: packages/svelte/src/__tests__/tier1-integration.spec.ts
    action: create
    description: Integration tests for Svelte Tier 1 wrappers
  - path: packages/angular/src/__tests__/tier1-integration.spec.ts
    action: create
    description: Integration tests for Angular Tier 1 wrappers
---

**Description:**
Create integration test suites for all Tier 1 framework wrappers. Verify event forwarding, attribute binding, and two-way binding work correctly across all frameworks.

**Acceptance Criteria:**
- [ ] Vue integration tests pass
- [ ] Svelte integration tests pass
- [ ] Angular integration tests pass
- [ ] All wrappers tested for basic functionality

---

### PR-123: README Update with Tier 1 Framework Support

---
pr_id: PR-123
title: README Update with Tier 1 Framework Support
cold_state: new
priority: high
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Documentation update, examples for all components
dependencies:
  - PR-122
estimated_files:
  - path: README.md
    action: modify
    description: Add Tier 1 framework wrapper documentation
  - path: packages/vue/README.md
    action: modify
    description: Add Vue Tier 1 component examples
  - path: packages/svelte/README.md
    action: modify
    description: Add Svelte Tier 1 component examples
  - path: packages/angular/README.md
    action: modify
    description: Add Angular Tier 1 component examples
---

**Description:**
Update all README files with complete Tier 1 + Tier 2 component documentation. Add usage examples for each framework.

**Acceptance Criteria:**
- [ ] Root README lists all 19 components (12 Tier 1 + 7 Tier 2) - actually 22 total
- [ ] Vue README has examples for all components
- [ ] Svelte README has examples for all components
- [ ] Angular README has examples for all components

---

### PR-124: Bundle Verification for All Frameworks

---
pr_id: PR-124
title: Bundle Verification for All Frameworks (Tier 1 + Tier 2)
cold_state: new
priority: high
complexity:
  score: 4
  estimated_minutes: 35
  suggested_model: sonnet
  rationale: Bundle size analysis, ensure targets met
dependencies:
  - PR-123
estimated_files:
  - path: scripts/verify-bundles.js
    action: modify
    description: Update bundle verification for all components
  - path: docs/bundle-report.md
    action: create
    description: Bundle size report for all packages
---

**Description:**
Run bundle verification for all framework packages with Tier 1 + Tier 2 components. Ensure size targets are met: Vue < 5kb, Svelte < 3kb, Angular < 6kb gzipped.

**Acceptance Criteria:**
- [ ] Vue bundle < 5kb gzipped
- [ ] Svelte bundle < 3kb gzipped
- [ ] Angular bundle < 6kb gzipped
- [ ] Bundle report generated
- [ ] All tests pass

---

## Summary

| Block | PRs | Total Complexity | Parallel |
|-------|-----|------------------|----------|
| Vue Wrappers | PR-086 to PR-097 | 42 | Yes |
| Svelte Wrappers | PR-098 to PR-109 | 31 | Yes |
| Angular Wrappers | PR-110 to PR-121 | 47 | Yes |
| Docs & Verification | PR-122 to PR-124 | 12 | No |
| **Total** | **39 PRs** | **132** | |

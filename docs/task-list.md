# Task List for Yetzirah Phase 1 (Core + React)

## Orchestration Metadata
**Generated for:** Lemegeton v1.0+
**Estimated Total Complexity:** 118
**Recommended Agent Configuration:**
- Haiku agents: 3 (for complexity 1-3)
- Sonnet agents: 2 (for complexity 4-7)
- Opus agents: 0 (for complexity 8-10)
---
## Block 0: Foundation (No dependencies)

### PR-001: Project Setup & Monorepo Structure
---
pr_id: PR-001
title: Project Setup & Monorepo Structure
cold_state: completed
priority: critical
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Multiple config files, tooling setup, requires understanding of monorepo patterns
dependencies: []
estimated_files:
  - path: package.json
    action: create
    description: Root workspace config with pnpm workspaces
  - path: pnpm-workspace.yaml
    action: create
    description: Workspace package definitions
  - path: tsconfig.json
    action: create
    description: Base TypeScript config for JSDoc support
  - path: .eslintrc.js
    action: create
    description: ESLint configuration
  - path: .prettierrc
    action: create
    description: Prettier configuration
  - path: packages/core/package.json
    action: create
    description: Core package manifest
  - path: packages/core/tsup.config.js
    action: create
    description: tsup bundler config for core
  - path: packages/core/src/index.js
    action: create
    description: Core package entry point
  - path: packages/react/package.json
    action: create
    description: React wrapper package manifest
  - path: packages/react/tsup.config.js
    action: create
    description: tsup bundler config for react
  - path: packages/react/src/index.js
    action: create
    description: React package entry point
  - path: demos/index.html
    action: create
    description: Demo index page
  - path: jest.config.js
    action: create
    description: Jest configuration with jsdom
---
**Description:**
Initialize monorepo with pnpm workspaces. Configure tsup for both packages (ESM + CJS outputs, .d.ts generation from JSDoc). Configure Jest with jsdom for Web Component testing. Create demos/ directory structure for static HTML demos.

**Acceptance Criteria:**
- [ ] `pnpm build` produces ESM + CJS bundles for both packages
- [ ] `pnpm test` runs Jest successfully
- [ ] TypeScript declarations generated from JSDoc
- [ ] Demo index page loads in browser
---
## Block 1: Simple Components (Depends on PR-001)

### PR-002: Button Component (Core)
---
pr_id: PR-002
title: Button Component (Core)
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Simple polymorphic element, no utilities needed, <50 lines
dependencies:
  - PR-001
estimated_files:
  - path: packages/core/src/button.js
    action: create
    description: ytz-button Web Component implementation
  - path: packages/core/src/button.test.js
    action: create
    description: Button component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export button component
---
**Description:**
Implement `<ytz-button>` - polymorphic button/anchor based on props. `href` attribute renders `<a>`, `onclick` renders `<button>`. Default classes prepended based on rendered element.

**Acceptance Criteria:**
- [ ] Renders correct element based on attributes
- [ ] Prepends default classes per PRD spec
- [ ] User classes preserved and appended
- [ ] Accessible (correct semantics, no ARIA needed)
- [ ] < 50 lines implementation
---
### PR-005: Disclosure Component (Core)
---
pr_id: PR-005
title: Disclosure Component (Core)
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Simple aria-expanded toggle, no shared utilities, <100 lines
dependencies:
  - PR-001
estimated_files:
  - path: packages/core/src/disclosure.js
    action: create
    description: ytz-disclosure Web Component implementation
  - path: packages/core/src/disclosure.test.js
    action: create
    description: Disclosure component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export disclosure component
---
**Description:**
Implement `<ytz-disclosure>` - expandable content with aria-expanded. `open` attribute controls visibility. Dispatches `toggle` event on state change. Animation-friendly (CSS can hook into open/closed states).

**Acceptance Criteria:**
- [ ] `open` attribute toggles content visibility
- [ ] Correct ARIA attributes (aria-expanded, aria-controls)
- [ ] `toggle` event dispatched
- [ ] Keyboard accessible (Enter/Space on trigger)
- [ ] < 100 lines
---
## Block 2: Button Wrapper & Docs (Depends on PR-002)

### PR-003: Button React Wrapper
---
pr_id: PR-003
title: Button React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper, <50 lines, straightforward event bridging
dependencies:
  - PR-002
estimated_files:
  - path: packages/react/src/button.js
    action: create
    description: React wrapper for ytz-button
  - path: packages/react/src/button.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Button component
---
**Description:**
Create React wrapper for `<ytz-button>`. Bridge onClick prop to element, handle href, pass through className, support ref forwarding.

**Acceptance Criteria:**
- [ ] `onClick` prop bridged to element
- [ ] `href` prop handled correctly
- [ ] `className` passed through
- [ ] Ref forwarding works
- [ ] < 50 lines
---
### PR-004: Button Documentation & Demo
---
pr_id: PR-004
title: Button Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Static HTML demo page, documentation examples
dependencies:
  - PR-003
estimated_files:
  - path: demos/button.html
    action: create
    description: Static HTML demo showing all button variants
---
**Description:**
Create static HTML demo page showing all button variants. Complete JSDoc documentation with examples.

**Acceptance Criteria:**
- [ ] Demo shows: link-button, action-button, styled variants
- [ ] Works when opened directly in browser (no build)
- [ ] JSDoc complete with examples
---
## Block 3: Disclosure Wrapper & Docs (Depends on PR-005)

### PR-006: Disclosure React Wrapper
---
pr_id: PR-006
title: Disclosure React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper, <50 lines
dependencies:
  - PR-005
estimated_files:
  - path: packages/react/src/disclosure.js
    action: create
    description: React wrapper for ytz-disclosure
  - path: packages/react/src/disclosure.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Disclosure component
---
**Description:**
Create React wrapper for `<ytz-disclosure>`. Sync open prop to attribute, provide onToggle callback, support ref forwarding.

**Acceptance Criteria:**
- [ ] `open` prop synced to attribute
- [ ] `onToggle` callback
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-007: Disclosure Documentation & Demo
---
pr_id: PR-007
title: Disclosure Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-006
estimated_files:
  - path: demos/disclosure.html
    action: create
    description: Static HTML demo showing disclosure variants
---
**Description:**
Create static HTML demo page showing disclosure component usage with various content types.

**Acceptance Criteria:**
- [ ] Demo shows basic disclosure, nested content, animation examples
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 4: Dialog with Focus Trap (Depends on PR-001)

### PR-008: Dialog Component (Core)
---
pr_id: PR-008
title: Dialog Component (Core)
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: Focus trap utility, scroll lock, WCAG compliance, <200 lines total
dependencies:
  - PR-001
estimated_files:
  - path: packages/core/src/dialog.js
    action: create
    description: ytz-dialog Web Component implementation
  - path: packages/core/src/dialog.test.js
    action: create
    description: Dialog component tests
  - path: packages/core/src/utils/focus-trap.js
    action: create
    description: Internal focus trap utility
  - path: packages/core/src/index.js
    action: modify
    description: Export dialog component
---
**Description:**
Implement `<ytz-dialog>` - modal dialog with focus management. Features: focus trap while open, restore focus to trigger on close, Escape to close, backdrop click to close (configurable via `static` attribute), body scroll lock, aria-modal, role="dialog".

**Acceptance Criteria:**
- [ ] Focus trapped within dialog
- [ ] Escape closes dialog
- [ ] Focus restored on close
- [ ] Scroll locked on body
- [ ] `close` event dispatched
- [ ] WCAG 2.1 AA compliant
- [ ] < 200 lines
---
### PR-009: Dialog React Wrapper
---
pr_id: PR-009
title: Dialog React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Thin wrapper with open/onClose props
dependencies:
  - PR-008
estimated_files:
  - path: packages/react/src/dialog.js
    action: create
    description: React wrapper for ytz-dialog
  - path: packages/react/src/dialog.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Dialog component
---
**Description:**
Create React wrapper for `<ytz-dialog>`. Sync open prop, provide onClose callback, render children correctly.

**Acceptance Criteria:**
- [ ] `open` prop synced
- [ ] `onClose` callback
- [ ] Children rendered correctly
- [ ] < 50 lines
---
### PR-010: Dialog Documentation & Demo
---
pr_id: PR-010
title: Dialog Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-009
estimated_files:
  - path: demos/dialog.html
    action: create
    description: Static HTML demo showing dialog variants
---
**Description:**
Create static HTML demo page showing dialog component with various configurations.

**Acceptance Criteria:**
- [ ] Demo shows: basic dialog, static (non-dismissible), nested dialogs
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 5: Tabs with Key Navigation (Depends on PR-001)

### PR-011: Tabs Component (Core)
---
pr_id: PR-011
title: Tabs Component (Core)
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: Multiple elements (tabs, tab, tabpanel), keyboard navigation utility, roving tabindex
dependencies:
  - PR-001
estimated_files:
  - path: packages/core/src/tabs.js
    action: create
    description: ytz-tabs, ytz-tab, ytz-tabpanel Web Components
  - path: packages/core/src/tabs.test.js
    action: create
    description: Tabs component tests
  - path: packages/core/src/utils/key-nav.js
    action: create
    description: Internal keyboard navigation utility
  - path: packages/core/src/index.js
    action: modify
    description: Export tabs components
---
**Description:**
Implement `<ytz-tabs>`, `<ytz-tab>`, `<ytz-tabpanel>`. Features: aria-tablist/tab/tabpanel roles, keyboard arrow navigation (left/right), roving tabindex, aria-selected on active tab, aria-controls/aria-labelledby linking.

**Acceptance Criteria:**
- [ ] Arrow keys navigate tabs
- [ ] Only active tab in tab order
- [ ] Correct ARIA roles and states
- [ ] `change` event on tab switch
- [ ] < 200 lines total
---
### PR-012: Tabs React Wrapper
---
pr_id: PR-012
title: Tabs React Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Multiple component wrappers but still thin
dependencies:
  - PR-011
estimated_files:
  - path: packages/react/src/tabs.js
    action: create
    description: React wrappers for tabs components
  - path: packages/react/src/tabs.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Tabs, Tab, TabPanel components
---
**Description:**
Create React wrappers for `<ytz-tabs>`, `<ytz-tab>`, `<ytz-tabpanel>`.

**Acceptance Criteria:**
- [ ] All three components wrapped
- [ ] `onChange` callback on Tabs
- [ ] Ref forwarding
- [ ] < 50 lines per component
---
### PR-013: Tabs Documentation & Demo
---
pr_id: PR-013
title: Tabs Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-012
estimated_files:
  - path: demos/tabs.html
    action: create
    description: Static HTML demo showing tabs variants
---
**Description:**
Create static HTML demo page showing tabs component with various configurations.

**Acceptance Criteria:**
- [ ] Demo shows: basic tabs, vertical tabs, dynamic content
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 6: Tooltip with Positioning (Depends on PR-001)

### PR-014: Tooltip Component (Core)
---
pr_id: PR-014
title: Tooltip Component (Core)
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: Positioning utility (<100 lines), delay logic, touch handling
dependencies:
  - PR-001
estimated_files:
  - path: packages/core/src/tooltip.js
    action: create
    description: ytz-tooltip Web Component implementation
  - path: packages/core/src/tooltip.test.js
    action: create
    description: Tooltip component tests
  - path: packages/core/src/utils/position.js
    action: create
    description: Internal positioning utility
  - path: packages/core/src/index.js
    action: modify
    description: Export tooltip component
---
**Description:**
Implement `<ytz-tooltip>` - positioned tooltip with delay logic. Features: positioning relative to trigger (top/bottom/left/right), flip when near viewport edge, show/hide delays, aria-describedby linking, hover/focus/touch handling, role="tooltip".

**Acceptance Criteria:**
- [ ] Correct positioning with flip
- [ ] Delay logic works
- [ ] Shows on hover/focus
- [ ] Hides on mouseleave/blur
- [ ] Touch support
- [ ] ARIA correct
- [ ] < 200 lines (excluding position utility)
- [ ] Position utility < 100 lines
---
### PR-015: Tooltip React Wrapper
---
pr_id: PR-015
title: Tooltip React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-014
estimated_files:
  - path: packages/react/src/tooltip.js
    action: create
    description: React wrapper for ytz-tooltip
  - path: packages/react/src/tooltip.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Tooltip component
---
**Description:**
Create React wrapper for `<ytz-tooltip>`.

**Acceptance Criteria:**
- [ ] Props passed through correctly
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-016: Tooltip Documentation & Demo
---
pr_id: PR-016
title: Tooltip Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-015
estimated_files:
  - path: demos/tooltip.html
    action: create
    description: Static HTML demo showing tooltip variants
---
**Description:**
Create static HTML demo page showing tooltip component with various positions and triggers.

**Acceptance Criteria:**
- [ ] Demo shows: all positions, focus trigger, custom delays
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 7: Menu (Depends on PR-011 keyNav, PR-014 position)

### PR-017: Menu Component (Core)
---
pr_id: PR-017
title: Menu Component (Core)
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: Combines positioning + keyboard nav + click outside utility
dependencies:
  - PR-011
  - PR-014
estimated_files:
  - path: packages/core/src/menu.js
    action: create
    description: ytz-menu, ytz-menuitem Web Components
  - path: packages/core/src/menu.test.js
    action: create
    description: Menu component tests
  - path: packages/core/src/utils/click-outside.js
    action: create
    description: Internal click outside utility
  - path: packages/core/src/index.js
    action: modify
    description: Export menu components
---
**Description:**
Implement `<ytz-menu>`, `<ytz-menuitem>`. Features: positioning relative to trigger, keyboard navigation (up/down arrows, Home/End), click outside to close, focus management, aria-menu/menuitem roles.

**Acceptance Criteria:**
- [ ] Opens on trigger click
- [ ] Keyboard navigation
- [ ] Click outside closes
- [ ] Focus returns to trigger
- [ ] ARIA correct
- [ ] < 200 lines
---
### PR-018: Menu React Wrapper
---
pr_id: PR-018
title: Menu React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Thin wrapper for menu components
dependencies:
  - PR-017
estimated_files:
  - path: packages/react/src/menu.js
    action: create
    description: React wrappers for menu components
  - path: packages/react/src/menu.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Menu, MenuItem components
---
**Description:**
Create React wrappers for `<ytz-menu>`, `<ytz-menuitem>`.

**Acceptance Criteria:**
- [ ] Both components wrapped
- [ ] `onClose` callback
- [ ] Ref forwarding
- [ ] < 50 lines per component
---
### PR-019: Menu Documentation & Demo
---
pr_id: PR-019
title: Menu Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-018
estimated_files:
  - path: demos/menu.html
    action: create
    description: Static HTML demo showing menu variants
---
**Description:**
Create static HTML demo page showing menu component with various configurations.

**Acceptance Criteria:**
- [ ] Demo shows: basic menu, icon menu, grouped items
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 8: Autocomplete (Depends on PR-017 - uses all utilities)

### PR-020: Autocomplete Component (Core)
---
pr_id: PR-020
title: Autocomplete Component (Core)
cold_state: completed
priority: high
complexity:
  score: 6
  estimated_minutes: 120
  suggested_model: sonnet
  rationale: Most complex Tier 1 component, combines all utilities, multi-select mode
dependencies:
  - PR-017
estimated_files:
  - path: packages/core/src/autocomplete.js
    action: create
    description: ytz-autocomplete Web Component implementation
  - path: packages/core/src/autocomplete.test.js
    action: create
    description: Autocomplete component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export autocomplete component
---
**Description:**
Implement `<ytz-autocomplete>` - the most complex Tier 1 component. Features: text input with filtering, keyboard navigation (up/down), single and multi-select modes, aria-combobox pattern, async loading support (loading state), click outside to close.

**Acceptance Criteria:**
- [ ] Filters options as user types
- [ ] Keyboard navigation works
- [ ] Single select mode
- [ ] Multi-select mode
- [ ] Async loading state
- [ ] WCAG combobox pattern
- [ ] < 200 lines
---
### PR-021: Autocomplete React Wrapper
---
pr_id: PR-021
title: Autocomplete React Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 35
  suggested_model: haiku
  rationale: Slightly more complex due to options handling
dependencies:
  - PR-020
estimated_files:
  - path: packages/react/src/autocomplete.js
    action: create
    description: React wrapper for ytz-autocomplete
  - path: packages/react/src/autocomplete.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Autocomplete component
---
**Description:**
Create React wrapper for `<ytz-autocomplete>`.

**Acceptance Criteria:**
- [ ] `value` and `onChange` props
- [ ] `options` prop handling
- [ ] `multiple` prop
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-022: Autocomplete Documentation & Demo
---
pr_id: PR-022
title: Autocomplete Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: More complex demo with async examples
dependencies:
  - PR-021
estimated_files:
  - path: demos/autocomplete.html
    action: create
    description: Static HTML demo showing autocomplete variants
---
**Description:**
Create static HTML demo page showing autocomplete component with various configurations.

**Acceptance Criteria:**
- [ ] Demo shows: basic, multi-select, async loading, custom rendering
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 9: Derived Components - Listbox & Select (Depends on PR-020)

### PR-023: Listbox Component (Core)
---
pr_id: PR-023
title: Listbox Component (Core)
cold_state: new
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Derived from Autocomplete - remove text input and filtering
dependencies:
  - PR-020
estimated_files:
  - path: packages/core/src/listbox.js
    action: create
    description: ytz-listbox Web Component implementation
  - path: packages/core/src/listbox.test.js
    action: create
    description: Listbox component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export listbox component
---
**Description:**
Derive from Autocomplete: remove text input and filtering. Pure keyboard-navigable list selection.

**Acceptance Criteria:**
- [ ] Keyboard navigation
- [ ] Single/multi-select modes
- [ ] ARIA listbox pattern
- [ ] < 150 lines
---
### PR-024: Listbox React Wrapper
---
pr_id: PR-024
title: Listbox React Wrapper
cold_state: new
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-023
estimated_files:
  - path: packages/react/src/listbox.js
    action: create
    description: React wrapper for ytz-listbox
  - path: packages/react/src/listbox.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Listbox component
---
**Description:**
Create React wrapper for `<ytz-listbox>`.

**Acceptance Criteria:**
- [ ] Props passed through
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-025: Listbox Documentation & Demo
---
pr_id: PR-025
title: Listbox Documentation & Demo
cold_state: new
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-024
estimated_files:
  - path: demos/listbox.html
    action: create
    description: Static HTML demo showing listbox variants
---
**Description:**
Create static HTML demo page showing listbox component.

**Acceptance Criteria:**
- [ ] Demo shows: single-select, multi-select
- [ ] Works when opened directly in browser
---
### PR-026: Select Component (Core)
---
pr_id: PR-026
title: Select Component (Core)
cold_state: new
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Derived from Listbox - add trigger button
dependencies:
  - PR-023
estimated_files:
  - path: packages/core/src/select.js
    action: create
    description: ytz-select Web Component implementation
  - path: packages/core/src/select.test.js
    action: create
    description: Select component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export select component
---
**Description:**
Derive from Listbox: add trigger button that shows selected value and opens listbox.

**Acceptance Criteria:**
- [ ] Trigger button shows selected value
- [ ] Opens listbox on click/Enter/Space
- [ ] ARIA combobox pattern (button variant)
- [ ] < 150 lines
---
### PR-027: Select React Wrapper
---
pr_id: PR-027
title: Select React Wrapper
cold_state: new
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-026
estimated_files:
  - path: packages/react/src/select.js
    action: create
    description: React wrapper for ytz-select
  - path: packages/react/src/select.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Select component
---
**Description:**
Create React wrapper for `<ytz-select>`.

**Acceptance Criteria:**
- [ ] `value` and `onChange` props
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-028: Select Documentation & Demo
---
pr_id: PR-028
title: Select Documentation & Demo
cold_state: new
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-027
estimated_files:
  - path: demos/select.html
    action: create
    description: Static HTML demo showing select variants
---
**Description:**
Create static HTML demo page showing select component.

**Acceptance Criteria:**
- [ ] Demo shows: basic select, with placeholder, disabled
- [ ] Works when opened directly in browser
---
## Block 10: Derived Components - Accordion (Depends on PR-005)

### PR-029: Accordion Component (Core)
---
pr_id: PR-029
title: Accordion Component (Core)
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Derived from Disclosure - coordinated disclosures, exclusive mode
dependencies:
  - PR-005
estimated_files:
  - path: packages/core/src/accordion.js
    action: create
    description: ytz-accordion, ytz-accordion-item Web Components
  - path: packages/core/src/accordion.test.js
    action: create
    description: Accordion component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export accordion components
---
**Description:**
Derive from Disclosure: coordinated disclosures with optional exclusive mode (only one open at a time).

**Acceptance Criteria:**
- [ ] Multiple disclosures coordinated
- [ ] `exclusive` attribute for single-open mode
- [ ] ARIA accordion pattern
- [ ] < 150 lines
---
### PR-030: Accordion React Wrapper
---
pr_id: PR-030
title: Accordion React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-029
estimated_files:
  - path: packages/react/src/accordion.js
    action: create
    description: React wrappers for accordion components
  - path: packages/react/src/accordion.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Accordion, AccordionItem components
---
**Description:**
Create React wrappers for `<ytz-accordion>`, `<ytz-accordion-item>`.

**Acceptance Criteria:**
- [ ] Both components wrapped
- [ ] Ref forwarding
- [ ] < 50 lines per component
---
### PR-031: Accordion Documentation & Demo
---
pr_id: PR-031
title: Accordion Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-030
estimated_files:
  - path: demos/accordion.html
    action: create
    description: Static HTML demo showing accordion variants
---
**Description:**
Create static HTML demo page showing accordion component.

**Acceptance Criteria:**
- [ ] Demo shows: basic accordion, exclusive mode
- [ ] Works when opened directly in browser
---
## Block 11: Derived Components - Drawer (Depends on PR-008)

### PR-032: Drawer Component (Core)
---
pr_id: PR-032
title: Drawer Component (Core)
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Derived from Dialog - slide-in positioning, edge anchoring
dependencies:
  - PR-008
estimated_files:
  - path: packages/core/src/drawer.js
    action: create
    description: ytz-drawer Web Component implementation
  - path: packages/core/src/drawer.test.js
    action: create
    description: Drawer component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export drawer component
---
**Description:**
Derive from Dialog: slide-in positioning from screen edge. Supports left/right/top/bottom anchoring via `anchor` attribute.

**Acceptance Criteria:**
- [ ] Inherits all Dialog behavior
- [ ] `anchor` attribute (left/right/top/bottom)
- [ ] CSS-friendly for slide animations
- [ ] < 100 lines (reuses Dialog internals)
---
### PR-033: Drawer React Wrapper
---
pr_id: PR-033
title: Drawer React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-032
estimated_files:
  - path: packages/react/src/drawer.js
    action: create
    description: React wrapper for ytz-drawer
  - path: packages/react/src/drawer.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Drawer component
---
**Description:**
Create React wrapper for `<ytz-drawer>`.

**Acceptance Criteria:**
- [ ] `open`, `onClose`, `anchor` props
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-034: Drawer Documentation & Demo
---
pr_id: PR-034
title: Drawer Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-033
estimated_files:
  - path: demos/drawer.html
    action: create
    description: Static HTML demo showing drawer variants
---
**Description:**
Create static HTML demo page showing drawer component from all edges.

**Acceptance Criteria:**
- [ ] Demo shows: left, right, top, bottom drawers
- [ ] Works when opened directly in browser
---
## Block 12: Derived Components - Popover (Depends on PR-014)

### PR-035: Popover Component (Core)
---
pr_id: PR-035
title: Popover Component (Core)
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Derived from Tooltip - click-triggered, richer content
dependencies:
  - PR-014
estimated_files:
  - path: packages/core/src/popover.js
    action: create
    description: ytz-popover Web Component implementation
  - path: packages/core/src/popover.test.js
    action: create
    description: Popover component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export popover component
---
**Description:**
Derive from Tooltip: click-triggered (not hover), supports richer content, stays open until dismissed.

**Acceptance Criteria:**
- [ ] Click to open (not hover)
- [ ] Click outside to close
- [ ] Escape to close
- [ ] Positioning inherited from Tooltip
- [ ] < 100 lines
---
### PR-036: Popover React Wrapper
---
pr_id: PR-036
title: Popover React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-035
estimated_files:
  - path: packages/react/src/popover.js
    action: create
    description: React wrapper for ytz-popover
  - path: packages/react/src/popover.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Popover component
---
**Description:**
Create React wrapper for `<ytz-popover>`.

**Acceptance Criteria:**
- [ ] `open`, `onClose` props
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-037: Popover Documentation & Demo
---
pr_id: PR-037
title: Popover Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-036
estimated_files:
  - path: demos/popover.html
    action: create
    description: Static HTML demo showing popover variants
---
**Description:**
Create static HTML demo page showing popover component with various content.

**Acceptance Criteria:**
- [ ] Demo shows: basic popover, with form, with actions
- [ ] Works when opened directly in browser
---
## Block 13: Final Documentation & Verification (Depends on all components)

### PR-038: MUI Rosetta Stone Documentation
---
pr_id: PR-038
title: MUI Rosetta Stone Documentation
cold_state: new
priority: medium
complexity:
  score: 4
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: Comprehensive migration guide, many code examples
dependencies:
  - PR-004
  - PR-007
  - PR-010
  - PR-013
  - PR-016
  - PR-019
  - PR-022
  - PR-025
  - PR-028
  - PR-031
  - PR-034
  - PR-037
estimated_files:
  - path: demos/rosetta.html
    action: create
    description: MUI to Yetzirah migration guide
---
**Description:**
Create comprehensive MUI → Yetzirah migration guide. Component mapping table, prop → class translations, code examples for each component, common patterns. Include "just use native HTML" guidance for form elements that MUI abstracts but the platform already handles.

**Form element mappings to include:**
- `<TextField multiline>` → `<textarea class="input-reset pa2 ba b--light-gray br2">`
- `<FormControl>` → `<div>` or `<fieldset>`
- `<FormGroup>` → `<fieldset>` with `<legend>`
- `<FormLabel>` → `<label>`
- `<FormHelperText>` → `<p class="f7 gray mt1">` or `<small>`
- `<RadioGroup>` → `<fieldset>` + radios with shared `name`
- `<Radio>` → `<input type="radio">`
- `<Checkbox>` → `<input type="checkbox">`
- `<FormControlLabel>` → `<label class="flex items-center gap2">` wrapping input

**Acceptance Criteria:**
- [ ] All MUI components mapped to Yetzirah equivalents
- [ ] Prop translations documented (variant, size, color → Tachyons)
- [ ] Form element mappings documented (Textarea, RadioGroup, Checkbox, FormControl, etc.)
- [ ] Side-by-side code examples
- [ ] Works when opened directly in browser
---
### PR-039: Final Bundle Optimization & Verification
---
pr_id: PR-039
title: Final Bundle Optimization & Verification
cold_state: new
priority: high
complexity:
  score: 3
  estimated_minutes: 60
  suggested_model: haiku
  rationale: Bundle analysis and verification, no new code
dependencies:
  - PR-004
  - PR-007
  - PR-010
  - PR-013
  - PR-016
  - PR-019
  - PR-022
  - PR-025
  - PR-028
  - PR-031
  - PR-034
  - PR-037
estimated_files:
  - path: package.json
    action: modify
    description: Add bundle size check scripts
---
**Description:**
Verify total core bundle < 10kb gzipped. Verify each wrapper < 50 lines per component. Tree-shaking verification. CDN-ready single file bundle.

**Acceptance Criteria:**
- [ ] Core bundle < 10kb gzipped
- [ ] Individual component imports work
- [ ] No dependencies in core package.json
- [ ] Tree-shaking verified
---
## Dependency Graph

```
PR-001 (Setup)
├── PR-002 → PR-003 → PR-004 (Button)
├── PR-005 → PR-006 → PR-007 (Disclosure)
│   └── PR-029 → PR-030 → PR-031 (Accordion)
├── PR-008 → PR-009 → PR-010 (Dialog)
│   └── PR-032 → PR-033 → PR-034 (Drawer)
├── PR-011 → PR-012 → PR-013 (Tabs)
├── PR-014 → PR-015 → PR-016 (Tooltip)
│   └── PR-035 → PR-036 → PR-037 (Popover)
└── PR-017 (Menu, needs PR-011 + PR-014)
    └── PR-018 → PR-019
    └── PR-020 → PR-021 → PR-022 (Autocomplete)
        └── PR-023 → PR-024 → PR-025 (Listbox)
            └── PR-026 → PR-027 → PR-028 (Select)

PR-038 (Rosetta) ← All demo PRs
PR-039 (Optimization) ← All demo PRs
```
---
## Notes

- **Utilities are internal**: `position()`, `focusTrap()`, `clickOutside()`, `keyNav()` live in `packages/core/src/utils/` but are not exported
- **JSDoc everywhere**: All public APIs documented with JSDoc for .d.ts generation
- **Static demos**: Each demo is a standalone HTML file that works without build step
- **< 200 lines per component**: If implementation exceeds this, reconsider complexity
- **< 50 lines per wrapper**: React wrappers should be thin

# Task List for Yetzirah Phase 1.5 (Tier 2 Components)

## Orchestration Metadata
**Generated for:** Lemegeton v1.0+
**Estimated Total Complexity:** 78
**Recommended Agent Configuration:**
- Haiku agents: 3 (for complexity 1-3)
- Sonnet agents: 2 (for complexity 4-7)
- Opus agents: 1 (for complexity 8-10 - DataGrid)
---
## Block 0: Simple Components (No dependencies beyond Tier 1)

### PR-040: Toggle/Switch Component (Core)
---
pr_id: PR-040
title: Toggle/Switch Component (Core)
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Checkbox semantics with visual switch, aria-checked, <100 lines
dependencies: []
estimated_files:
  - path: packages/core/src/toggle.js
    action: create
    description: ytz-toggle Web Component implementation
  - path: packages/core/src/toggle.test.js
    action: create
    description: Toggle component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export toggle component
---
**Description:**
Implement `<ytz-toggle>` - a switch/toggle control with checkbox semantics. Renders as a visually styled toggle but maintains proper checkbox accessibility. Uses `aria-checked` for state, supports `checked` attribute, dispatches `change` event.

**Acceptance Criteria:**
- [ ] `checked` attribute toggles state
- [ ] `aria-checked` reflects state
- [ ] Keyboard accessible (Space to toggle)
- [ ] `change` event dispatched
- [ ] `disabled` attribute support
- [ ] < 100 lines
---
### PR-041: Toggle React Wrapper
---
pr_id: PR-041
title: Toggle React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper with checked/onChange props
dependencies:
  - PR-040
estimated_files:
  - path: packages/react/src/toggle.js
    action: create
    description: React wrapper for ytz-toggle
  - path: packages/react/src/toggle.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Toggle component
---
**Description:**
Create React wrapper for `<ytz-toggle>`. Bridge checked prop to attribute, provide onChange callback.

**Acceptance Criteria:**
- [ ] `checked` prop synced to attribute
- [ ] `onChange` callback
- [ ] `disabled` prop support
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-042: Toggle Documentation & Demo
---
pr_id: PR-042
title: Toggle Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-041
estimated_files:
  - path: demos/toggle.html
    action: create
    description: Static HTML demo showing toggle variants
---
**Description:**
Create static HTML demo page showing toggle component with various states and configurations.

**Acceptance Criteria:**
- [ ] Demo shows: basic toggle, disabled, with labels
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
### PR-043: Chip Component (Core)
---
pr_id: PR-043
title: Chip Component (Core)
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Deletable tag with keyboard support, ~30 lines per PRD
dependencies: []
estimated_files:
  - path: packages/core/src/chip.js
    action: create
    description: ytz-chip Web Component implementation
  - path: packages/core/src/chip.test.js
    action: create
    description: Chip component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export chip component
---
**Description:**
Implement `<ytz-chip>` - a deletable tag/label component. `deletable` attribute shows delete button (x), dispatches `delete` event when clicked or Backspace/Delete pressed while focused. Future consideration: drag API for reordering, chip input for tag entry.

**Acceptance Criteria:**
- [ ] Renders as inline tag/label
- [ ] `deletable` attribute shows x button
- [ ] `delete` event dispatched on x click
- [ ] Keyboard: Backspace/Delete triggers delete when focused
- [ ] `disabled` attribute support
- [ ] < 50 lines
---
### PR-044: Chip React Wrapper
---
pr_id: PR-044
title: Chip React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-043
estimated_files:
  - path: packages/react/src/chip.js
    action: create
    description: React wrapper for ytz-chip
  - path: packages/react/src/chip.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Chip component
---
**Description:**
Create React wrapper for `<ytz-chip>`.

**Acceptance Criteria:**
- [ ] `deletable` prop
- [ ] `onDelete` callback
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-045: Chip Documentation & Demo
---
pr_id: PR-045
title: Chip Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-044
estimated_files:
  - path: demos/chip.html
    action: create
    description: Static HTML demo showing chip variants
---
**Description:**
Create static HTML demo page showing chip component with various configurations.

**Acceptance Criteria:**
- [ ] Demo shows: basic chip, deletable, disabled, styled variants
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 1: IconButton (Depends on Tier 1 Button + Tooltip)

### PR-046: IconButton Component (Core)
---
pr_id: PR-046
title: IconButton Component (Core)
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Button variant with aria-label requirement, optional tooltip integration
dependencies: []
estimated_files:
  - path: packages/core/src/icon-button.js
    action: create
    description: ytz-icon-button Web Component implementation
  - path: packages/core/src/icon-button.test.js
    action: create
    description: IconButton component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export icon-button component
---
**Description:**
Implement `<ytz-icon-button>` - a button variant specifically for icon-only buttons. Requires `aria-label` attribute for accessibility (warns in dev if missing). Optionally integrates with tooltip to show label on hover. Extends Button behavior with icon-specific defaults.

**Acceptance Criteria:**
- [ ] `aria-label` required (console warning if missing)
- [ ] Icon content displayed (slotted)
- [ ] Optional `tooltip` attribute enables tooltip showing aria-label
- [ ] Keyboard accessible
- [ ] < 100 lines
---
### PR-047: IconButton React Wrapper
---
pr_id: PR-047
title: IconButton React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-046
estimated_files:
  - path: packages/react/src/icon-button.js
    action: create
    description: React wrapper for ytz-icon-button
  - path: packages/react/src/icon-button.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export IconButton component
---
**Description:**
Create React wrapper for `<ytz-icon-button>`.

**Acceptance Criteria:**
- [ ] `aria-label` prop (required)
- [ ] `tooltip` prop
- [ ] `onClick` prop
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-048: IconButton Documentation & Demo
---
pr_id: PR-048
title: IconButton Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Static HTML demo page
dependencies:
  - PR-047
estimated_files:
  - path: demos/icon-button.html
    action: create
    description: Static HTML demo showing icon-button variants
---
**Description:**
Create static HTML demo page showing icon-button component with various icons and tooltip.

**Acceptance Criteria:**
- [ ] Demo shows: basic icon button, with tooltip, various sizes
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 2: Slider (Complex accessibility)

### PR-049: Slider Component (Core)
---
pr_id: PR-049
title: Slider Component (Core)
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: aria-slider, keyboard control, range support, thumb positioning
dependencies: []
estimated_files:
  - path: packages/core/src/slider.js
    action: create
    description: ytz-slider Web Component implementation
  - path: packages/core/src/slider.test.js
    action: create
    description: Slider component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export slider component
---
**Description:**
Implement `<ytz-slider>` - accessible range slider with full keyboard control. Supports single value and range (two thumbs) modes. Uses `role="slider"` with proper ARIA attributes (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`).

**Acceptance Criteria:**
- [ ] `min`, `max`, `value` attributes
- [ ] `step` attribute for discrete steps
- [ ] Range mode with `range` attribute (two thumbs)
- [ ] Keyboard: Arrow keys, Home/End, Page Up/Down
- [ ] `change` and `input` events (input for live, change for committed)
- [ ] Proper ARIA slider pattern
- [ ] < 200 lines
---
### PR-050: Slider React Wrapper
---
pr_id: PR-050
title: Slider React Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Thin wrapper with value/onChange
dependencies:
  - PR-049
estimated_files:
  - path: packages/react/src/slider.js
    action: create
    description: React wrapper for ytz-slider
  - path: packages/react/src/slider.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export Slider component
---
**Description:**
Create React wrapper for `<ytz-slider>`.

**Acceptance Criteria:**
- [ ] `value` and `onChange` props
- [ ] `onInput` for live updates
- [ ] `min`, `max`, `step` props
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-051: Slider Documentation & Demo
---
pr_id: PR-051
title: Slider Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Static HTML demo page with range examples
dependencies:
  - PR-050
estimated_files:
  - path: demos/slider.html
    action: create
    description: Static HTML demo showing slider variants
---
**Description:**
Create static HTML demo page showing slider component with various configurations.

**Acceptance Criteria:**
- [ ] Demo shows: basic slider, with steps, range mode, disabled
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 3: Theme System (CSS + Toggle)

### PR-052: Dark Theme CSS
---
pr_id: PR-052
title: Dark Theme CSS
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Pure CSS, no JS, custom properties remapping
dependencies: []
estimated_files:
  - path: packages/core/src/dark.css
    action: create
    description: Dark theme override stylesheet
  - path: packages/core/package.json
    action: modify
    description: Export dark.css
---
**Description:**
Create optional dark theme stylesheet using CSS custom properties. `[data-theme="dark"]` selector remaps Tachyons color classes. Respects `prefers-color-scheme: dark` by default via `@media` query. No JS runtime - pure CSS. User toggles manually via `document.documentElement.dataset.theme = 'dark'`.

**Acceptance Criteria:**
- [ ] `[data-theme="dark"]` selector works
- [ ] `@media (prefers-color-scheme: dark)` fallback
- [ ] Tachyons color classes remapped (bg-white → dark equivalent, etc.)
- [ ] No JavaScript required
- [ ] < 100 lines
---
### PR-053: Theme Toggle Component (Core)
---
pr_id: PR-053
title: Theme Toggle Component (Core)
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Wraps Toggle with theme-switching behavior
dependencies:
  - PR-040
  - PR-052
estimated_files:
  - path: packages/core/src/theme-toggle.js
    action: create
    description: ytz-theme-toggle Web Component implementation
  - path: packages/core/src/theme-toggle.test.js
    action: create
    description: Theme toggle component tests
  - path: packages/core/src/index.js
    action: modify
    description: Export theme-toggle component
---
**Description:**
Implement `<ytz-theme-toggle>` - wraps `<ytz-toggle>` with theme-switching behavior. Reads `prefers-color-scheme` on init, persists user preference to `localStorage`, toggles `data-theme` attribute on `<html>`, dispatches `themechange` events.

**Acceptance Criteria:**
- [ ] Reads `prefers-color-scheme` on init
- [ ] Persists preference to `localStorage`
- [ ] Toggles `data-theme` on document root
- [ ] `themechange` event with detail `{ theme: 'dark' | 'light' }`
- [ ] Uses ytz-toggle internally
- [ ] < 100 lines
---
### PR-054: Theme Toggle React Wrapper
---
pr_id: PR-054
title: Theme Toggle React Wrapper
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thin wrapper
dependencies:
  - PR-053
estimated_files:
  - path: packages/react/src/theme-toggle.js
    action: create
    description: React wrapper for ytz-theme-toggle
  - path: packages/react/src/theme-toggle.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export ThemeToggle component
---
**Description:**
Create React wrapper for `<ytz-theme-toggle>`.

**Acceptance Criteria:**
- [ ] `onThemeChange` callback
- [ ] Ref forwarding
- [ ] < 50 lines
---
### PR-055: Theme System Documentation & Demo
---
pr_id: PR-055
title: Theme System Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Demo showing dark.css + theme-toggle integration
dependencies:
  - PR-054
estimated_files:
  - path: demos/theme.html
    action: create
    description: Static HTML demo showing theme system
---
**Description:**
Create static HTML demo page showing dark theme CSS and theme toggle component working together.

**Acceptance Criteria:**
- [ ] Demo shows theme toggle in action
- [ ] Dark theme applied correctly
- [ ] localStorage persistence demonstrated
- [ ] Works when opened directly in browser
---
## Block 4: DataGrid (Most complex Tier 2 component)

### PR-056: DataGrid Component (Core)
---
pr_id: PR-056
title: DataGrid Component (Core)
cold_state: completed
priority: high
complexity:
  score: 8
  estimated_minutes: 240
  suggested_model: opus
  rationale: Virtual scroll, sort, filter, keyboard nav, export - most complex component
dependencies: []
estimated_files:
  - path: packages/core/src/datagrid.js
    action: create
    description: ytz-datagrid Web Component implementation
  - path: packages/core/src/datagrid.test.js
    action: create
    description: DataGrid component tests
  - path: packages/core/src/utils/virtual-scroll.js
    action: create
    description: Internal virtual scroll utility
  - path: packages/core/src/index.js
    action: modify
    description: Export datagrid component
---
**Description:**
Implement `<ytz-datagrid>` - data table with virtual scrolling for large datasets. Features: column sorting (click header), column filtering, keyboard navigation (arrow keys, Enter to edit), export to CSV and Excel (XLSX). No pivot tables - YAGNI.

**Virtual Scroll Requirements:**
- Only render visible rows plus buffer
- Smooth scrolling with row recycling
- Handle variable row heights if needed

**Keyboard Navigation:**
- Arrow keys move between cells
- Enter to select/edit
- Tab moves between focusable cells
- Home/End for row navigation

**Export:**
- CSV export (native)
- Excel export (simple XLSX, consider SheetJS for robust support)

**Acceptance Criteria:**
- [ ] Virtual scrolling works with 10,000+ rows
- [ ] Column sorting (ascending/descending/none)
- [ ] Column filtering (text input per column)
- [ ] Keyboard navigation
- [ ] CSV export
- [ ] Excel/XLSX export
- [ ] ARIA grid pattern
- [ ] < 400 lines (including virtual scroll utility)
---
### PR-057: DataGrid React Wrapper
---
pr_id: PR-057
title: DataGrid React Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: More complex wrapper due to data/columns props
dependencies:
  - PR-056
estimated_files:
  - path: packages/react/src/datagrid.js
    action: create
    description: React wrapper for ytz-datagrid
  - path: packages/react/src/datagrid.test.js
    action: create
    description: React wrapper tests
  - path: packages/react/src/index.js
    action: modify
    description: Export DataGrid component
---
**Description:**
Create React wrapper for `<ytz-datagrid>`.

**Acceptance Criteria:**
- [ ] `data` prop (array of objects)
- [ ] `columns` prop (column definitions)
- [ ] `onSort`, `onFilter` callbacks
- [ ] `onExport` callback
- [ ] Ref forwarding
- [ ] < 75 lines
---
### PR-058: DataGrid Documentation & Demo
---
pr_id: PR-058
title: DataGrid Documentation & Demo
cold_state: completed
priority: medium
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Complex demo with large dataset, export examples
dependencies:
  - PR-057
estimated_files:
  - path: demos/datagrid.html
    action: create
    description: Static HTML demo showing datagrid with large dataset
---
**Description:**
Create static HTML demo page showing datagrid component with realistic data.

**Acceptance Criteria:**
- [ ] Demo shows: sorting, filtering, virtual scroll with 1000+ rows
- [ ] Export buttons for CSV and Excel
- [ ] Works when opened directly in browser
- [ ] JSDoc complete
---
## Block 5: Final Documentation & Verification

### PR-059: Tier 2 README Update & Rosetta Stone Additions
---
pr_id: PR-059
title: Tier 2 README Update & Rosetta Stone Additions
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 60
  suggested_model: haiku
  rationale: Update existing docs with Tier 2 components
dependencies:
  - PR-042
  - PR-045
  - PR-048
  - PR-051
  - PR-055
  - PR-058
estimated_files:
  - path: README.md
    action: modify
    description: Add Tier 2 components section
  - path: demos/rosetta.html
    action: modify
    description: Add Tier 2 MUI mappings
---
**Description:**
Update README.md and MUI Rosetta Stone with Tier 2 component documentation.

**New MUI Mappings:**
- `<Switch>` → `<Toggle>` / `<ytz-toggle>`
- `<Slider>` → `<Slider>` / `<ytz-slider>`
- `<Chip>` (deletable) → `<Chip>` / `<ytz-chip>`
- `<IconButton>` → `<IconButton>` / `<ytz-icon-button>`
- `<DataGrid>` → `<DataGrid>` / `<ytz-datagrid>`

**Acceptance Criteria:**
- [ ] README lists Tier 2 components
- [ ] Rosetta Stone updated with Tier 2 mappings
- [ ] Prop translations documented
---
### PR-060: Tier 2 Bundle Verification
---
pr_id: PR-060
title: Tier 2 Bundle Verification
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Bundle size check after Tier 2 additions
dependencies:
  - PR-042
  - PR-045
  - PR-048
  - PR-051
  - PR-055
  - PR-058
estimated_files:
  - path: package.json
    action: modify
    description: Update bundle size thresholds if needed
---
**Description:**
Verify bundle sizes remain reasonable after Tier 2 additions. DataGrid may increase bundle significantly - document separately.

**Acceptance Criteria:**
- [ ] Core bundle (without DataGrid) < 15kb gzipped
- [ ] DataGrid as separate entry point
- [ ] Tree-shaking verified
- [ ] Individual component imports work
---
## Dependency Graph

```
Block 0 (No deps):
├── PR-040 → PR-041 → PR-042 (Toggle)
├── PR-043 → PR-044 → PR-045 (Chip)
└── PR-046 → PR-047 → PR-048 (IconButton)

Block 1 (Slider):
└── PR-049 → PR-050 → PR-051 (Slider)

Block 2 (Theme):
├── PR-052 (Dark CSS, no deps)
└── PR-053 → PR-054 → PR-055 (Theme Toggle, needs PR-040 + PR-052)

Block 3 (DataGrid):
└── PR-056 → PR-057 → PR-058 (DataGrid)

Block 4 (Final):
├── PR-059 (Docs) ← All demo PRs
└── PR-060 (Verification) ← All demo PRs
```
---
## Parallel Execution Strategy

**Wave 1 (fully parallel):**
- PR-040 (Toggle Core)
- PR-043 (Chip Core)
- PR-046 (IconButton Core)
- PR-049 (Slider Core)
- PR-052 (Dark CSS)
- PR-056 (DataGrid Core) - longest, start early

**Wave 2 (after Wave 1 completes):**
- PR-041, PR-044, PR-047, PR-050, PR-053, PR-054, PR-057 (all wrappers)

**Wave 3 (after Wave 2 completes):**
- PR-042, PR-045, PR-048, PR-051, PR-055, PR-058 (all demos)

**Wave 4 (after Wave 3 completes):**
- PR-059, PR-060 (final docs and verification)
---
## Notes

- **DataGrid is optional:** If bundle size is a concern, DataGrid can be shipped as a separate package (`@yetzirah/datagrid`)
- **Theme system is opt-in:** Users who don't need dark mode don't pay for it
- **Tier 2 components build on Tier 1 utilities:** position(), keyNav(), clickOutside() already exist
- **< 50 lines per wrapper rule still applies:** Except DataGrid which may need up to 75 lines
- **Excel export consideration:** May use SheetJS (Apache 2.0) or implement minimal XLSX ourselves

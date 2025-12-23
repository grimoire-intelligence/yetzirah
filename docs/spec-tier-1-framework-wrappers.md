# Tier 1 Framework Wrappers Specification

## Objective
Create Vue 3, Svelte 4+, and Angular 16+ wrappers for all 12 Tier 1 components, completing Phase 2 of the Yetzirah roadmap.

## Components to Wrap (12 total)

### Base Components (7)
1. **Button** (`<ytz-button>`) - Polymorphic button/anchor based on href prop
2. **Disclosure** (`<ytz-disclosure>`) - aria-expanded, animation-friendly open/close
3. **Dialog** (`<ytz-dialog>`) - Focus trapping, scroll locking, escape-to-close, aria-modal
4. **Tabs** (`<ytz-tabs>`) - aria-tablist, keyboard arrow navigation, roving tabindex
5. **Tooltip** (`<ytz-tooltip>`) - Positioning, delay logic, aria-describedby
6. **Menu** (`<ytz-menu>`) - Positioning, keyboard nav, click-outside, focus management
7. **Autocomplete** (`<ytz-autocomplete>`) - Text input with filtering, keyboard nav, single/multi-select

### Derived Components (5)
8. **Listbox** (`<ytz-listbox>`) - Autocomplete without text input
9. **Select** (`<ytz-select>`) - Listbox with trigger button
10. **Accordion** (`<ytz-accordion>`) - Coordinated disclosures
11. **Drawer** (`<ytz-drawer>`) - Dialog as slide-in positioning
12. **Popover** (`<ytz-popover>`) - Tooltip with click-triggered, richer content

## Framework Requirements

### Vue 3 Package (`@grimoire/yetzirah-vue`)
- Use existing package structure from Tier 2 wrappers
- Support `v-model` where applicable (e.g., `v-model:open` for Dialog/Drawer/Disclosure)
- Use `defineModel` (Vue 3.4+) for two-way binding
- Event mapping (kebab-case HTML to camelCase Vue)
- Each wrapper < 50 lines

### Svelte 4+ Package (`@grimoire/yetzirah-svelte`)
- Use existing package structure from Tier 2 wrappers
- Thinnest wrappers (~15-30 lines each)
- Support `bind:open`, `bind:value` for reactive binding
- Event forwarding with Svelte's excellent Web Component interop

### Angular 16+ Package (`@grimoire/yetzirah-angular`)
- Use existing package structure from Tier 2 wrappers
- `@Input()` and `@Output()` decorators
- ControlValueAccessor for form-integrated components (Autocomplete, Select)
- OnPush change detection strategy
- NgModule exports

## Testing Requirements
- Each framework wrapper must have corresponding tests
- Follow existing test patterns from Tier 2 (e.g., `packages/vue/src/*.spec.ts`)
- Test event forwarding, attribute binding, and two-way binding where applicable
- Minimum test coverage: mount, basic props, events

## PR Structure

### Block 1: Vue 3 Wrappers (12 PRs)
- PR-086: Vue Button Wrapper
- PR-087: Vue Disclosure Wrapper
- PR-088: Vue Dialog Wrapper
- PR-089: Vue Tabs Wrapper
- PR-090: Vue Tooltip Wrapper
- PR-091: Vue Menu Wrapper
- PR-092: Vue Autocomplete Wrapper
- PR-093: Vue Listbox Wrapper
- PR-094: Vue Select Wrapper
- PR-095: Vue Accordion Wrapper
- PR-096: Vue Drawer Wrapper
- PR-097: Vue Popover Wrapper

### Block 2: Svelte Wrappers (12 PRs)
- PR-098: Svelte Button Wrapper
- PR-099: Svelte Disclosure Wrapper
- PR-100: Svelte Dialog Wrapper
- PR-101: Svelte Tabs Wrapper
- PR-102: Svelte Tooltip Wrapper
- PR-103: Svelte Menu Wrapper
- PR-104: Svelte Autocomplete Wrapper
- PR-105: Svelte Listbox Wrapper
- PR-106: Svelte Select Wrapper
- PR-107: Svelte Accordion Wrapper
- PR-108: Svelte Drawer Wrapper
- PR-109: Svelte Popover Wrapper

### Block 3: Angular Wrappers (12 PRs)
- PR-110: Angular Button Wrapper
- PR-111: Angular Disclosure Wrapper
- PR-112: Angular Dialog Wrapper
- PR-113: Angular Tabs Wrapper
- PR-114: Angular Tooltip Wrapper
- PR-115: Angular Menu Wrapper
- PR-116: Angular Autocomplete Wrapper (with ControlValueAccessor)
- PR-117: Angular Listbox Wrapper
- PR-118: Angular Select Wrapper (with ControlValueAccessor)
- PR-119: Angular Accordion Wrapper
- PR-120: Angular Drawer Wrapper
- PR-121: Angular Popover Wrapper

### Block 4: Documentation & Verification (3 PRs)
- PR-122: Framework Wrapper Tests for Tier 1 components
- PR-123: README Update with Tier 1 Framework Support
- PR-124: Bundle Verification for All Frameworks (Tier 1 + Tier 2)

## Execution Strategy
- Wave 1: Vue wrappers (PR-086 to PR-097) - can run in parallel
- Wave 2: Svelte wrappers (PR-098 to PR-109) - can run in parallel
- Wave 3: Angular wrappers (PR-110 to PR-121) - can run in parallel
- Wave 4: Tests, docs, verification (PR-122 to PR-124) - sequential

## Success Criteria
1. All 12 Tier 1 components wrapped in all 3 frameworks
2. Framework-idiomatic APIs (v-model, bind:, ngModel)
3. Tests passing for all wrappers
4. Bundle sizes maintained (Vue < 5kb, Svelte < 3kb, Angular < 6kb gzipped)
5. README updated with complete Tier 1 + Tier 2 component list

## Constraints
- cold_state for new PRs must be `new` (not `pending` or `Pending`)
- Valid cold_state enum: `new`, `in-progress`, `completed`, `blocked`
- Each wrapper should be < 50 lines
- Zero additional dependencies

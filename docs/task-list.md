# Task List for Yetzirah Phase 2 (Tier 2 Framework Wrappers)

## Orchestration Metadata
**Generated for:** Lemegeton v1.0+
**Estimated Total Complexity:** 65
**Recommended Agent Configuration:**
- Haiku agents: 3 (for complexity 1-3)
- Sonnet agents: 2 (for complexity 4-5)
---
## Block 0: Archive & Preparation

### PR-061: Archive Tier 2 Core Task List
---
pr_id: PR-061
title: Archive Tier 2 Core Task List
cold_state: completed
priority: high
complexity:
  score: 1
  estimated_minutes: 10
  suggested_model: haiku
  rationale: Simple file move operation
dependencies: []
estimated_files:
  - path: docs/old/task-list-tier-2-core.md
    action: create
    description: Archived Tier 2 core + React task list
  - path: docs/task-list.md
    action: create
    description: New Phase 2 framework wrapper task list
---
**Description:**
Move the completed Tier 2 core + React task list to `docs/old/task-list-tier-2-core.md` to preserve the history. Replace with this new Phase 2 task list for framework wrappers.

**Acceptance Criteria:**
- [ ] Old task list preserved in docs/old/
- [ ] New task list in docs/task-list.md
- [ ] Git history clean
---
## Block 1: Vue 3 Package Setup & Components

### PR-062: Vue 3 Package Setup
---
pr_id: PR-062
title: Vue 3 Package Setup
cold_state: completed
priority: critical
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Package configuration, Vue-specific build setup, TypeScript declarations for Vue
dependencies:
  - PR-061
estimated_files:
  - path: packages/vue/package.json
    action: create
    description: Vue package manifest with Vue 3 peer dependency
  - path: packages/vue/tsconfig.json
    action: create
    description: Vue-specific TypeScript config
  - path: packages/vue/tsup.config.js
    action: create
    description: tsup config for Vue SFC compilation
  - path: packages/vue/src/index.ts
    action: create
    description: Vue package entry point
  - path: packages/vue/src/types.ts
    action: create
    description: Shared TypeScript types for Vue wrappers
  - path: packages/vue/README.md
    action: create
    description: Vue package documentation
---
**Description:**
Initialize `@yetzirah/vue` package for Vue 3 wrappers. Configure build to output ESM + CJS with TypeScript declarations. Set up Vue 3.3+ as peer dependency (for defineModel support). Include proper exports for tree-shaking.

**Acceptance Criteria:**
- [ ] `pnpm build` succeeds in packages/vue
- [ ] TypeScript declarations generated
- [ ] Vue 3.3+ peer dependency configured
- [ ] Tree-shakeable exports
---
### PR-063: Vue Toggle Wrapper
---
pr_id: PR-063
title: Vue Toggle Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Simple v-model wrapper, ~40 lines
dependencies:
  - PR-062
estimated_files:
  - path: packages/vue/src/Toggle.vue
    action: create
    description: Toggle component with v-model support
  - path: packages/vue/src/Toggle.test.ts
    action: create
    description: Toggle wrapper tests
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Toggle component
---
**Description:**
Create Vue 3 wrapper for ytz-toggle with `v-model:checked` support. Use defineModel (Vue 3.4+) or modelValue/update:modelValue pattern. Forward disabled prop, emit change events.

**Acceptance Criteria:**
- [ ] v-model:checked binding works
- [ ] disabled prop forwarded
- [ ] Template ref access to web component
- [ ] < 50 lines
---
### PR-064: Vue Chip Wrapper
---
pr_id: PR-064
title: Vue Chip Wrapper
cold_state: ready
priority: high
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Event forwarding wrapper, ~35 lines
dependencies:
  - PR-062
estimated_files:
  - path: packages/vue/src/Chip.vue
    action: create
    description: Chip component with delete event
  - path: packages/vue/src/Chip.test.ts
    action: create
    description: Chip wrapper tests
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Chip component
---
**Description:**
Create Vue 3 wrapper for ytz-chip. Forward deletable and disabled props. Emit delete event via @delete or v-on:delete.

**Acceptance Criteria:**
- [ ] deletable prop forwarded
- [ ] @delete event emitted
- [ ] Slot content passed through
- [ ] < 50 lines
---
### PR-065: Vue IconButton Wrapper
---
pr_id: PR-065
title: Vue IconButton Wrapper
cold_state: ready
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Simplest wrapper, ~25 lines
dependencies:
  - PR-062
estimated_files:
  - path: packages/vue/src/IconButton.vue
    action: create
    description: IconButton component
  - path: packages/vue/src/IconButton.test.ts
    action: create
    description: IconButton wrapper tests
  - path: packages/vue/src/index.ts
    action: modify
    description: Export IconButton component
---
**Description:**
Create Vue 3 wrapper for ytz-icon-button. Forward aria-label (required), tooltip, and disabled props. Emit click event.

**Acceptance Criteria:**
- [ ] aria-label prop forwarded (required)
- [ ] tooltip prop support
- [ ] @click event emitted
- [ ] < 50 lines
---
### PR-066: Vue Slider Wrapper
---
pr_id: PR-066
title: Vue Slider Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 35
  suggested_model: haiku
  rationale: v-model with number coercion, ~45 lines
dependencies:
  - PR-062
estimated_files:
  - path: packages/vue/src/Slider.vue
    action: create
    description: Slider component with v-model support
  - path: packages/vue/src/Slider.test.ts
    action: create
    description: Slider wrapper tests
  - path: packages/vue/src/index.ts
    action: modify
    description: Export Slider component
---
**Description:**
Create Vue 3 wrapper for ytz-slider with v-model support. Handle number type coercion. Forward min, max, step, disabled props. Emit both input (live) and change (committed) events.

**Acceptance Criteria:**
- [ ] v-model binding works with numbers
- [ ] min, max, step props forwarded
- [ ] @input and @change events
- [ ] < 50 lines
---
### PR-067: Vue ThemeToggle Wrapper
---
pr_id: PR-067
title: Vue ThemeToggle Wrapper
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Event forwarding, ~35 lines
dependencies:
  - PR-062
estimated_files:
  - path: packages/vue/src/ThemeToggle.vue
    action: create
    description: ThemeToggle component
  - path: packages/vue/src/ThemeToggle.test.ts
    action: create
    description: ThemeToggle wrapper tests
  - path: packages/vue/src/index.ts
    action: modify
    description: Export ThemeToggle component
---
**Description:**
Create Vue 3 wrapper for ytz-theme-toggle. Forward storageKey and noPersist props. Emit themechange event with theme and isDark details.

**Acceptance Criteria:**
- [ ] storageKey prop (kebab-case: storage-key)
- [ ] noPersist prop (kebab-case: no-persist)
- [ ] @themechange event emitted
- [ ] < 50 lines
---
### PR-068: Vue DataGrid Wrapper
---
pr_id: PR-068
title: Vue DataGrid Wrapper
cold_state: ready
priority: high
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Complex props (data array), multiple events, column children, ~70 lines
dependencies:
  - PR-062
estimated_files:
  - path: packages/vue/src/DataGrid.vue
    action: create
    description: DataGrid component
  - path: packages/vue/src/DataGridColumn.vue
    action: create
    description: DataGridColumn component
  - path: packages/vue/src/DataGrid.test.ts
    action: create
    description: DataGrid wrapper tests
  - path: packages/vue/src/index.ts
    action: modify
    description: Export DataGrid and DataGridColumn components
---
**Description:**
Create Vue 3 wrapper for ytz-datagrid. Handle data array prop via property setter (not attribute). Forward columns prop or accept DataGridColumn children. Emit sort, rowselect, rowactivate events.

**Acceptance Criteria:**
- [ ] data prop synced via property
- [ ] columns prop or DataGridColumn children
- [ ] rowHeight prop
- [ ] @sort, @rowselect, @rowactivate events
- [ ] < 75 lines per component
---
## Block 2: Svelte 4+ Package Setup & Components

### PR-069: Svelte Package Setup
---
pr_id: PR-069
title: Svelte Package Setup
cold_state: completed
priority: critical
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Svelte-specific build config, preprocessor setup
dependencies:
  - PR-061
estimated_files:
  - path: packages/svelte/package.json
    action: create
    description: Svelte package manifest
  - path: packages/svelte/svelte.config.js
    action: create
    description: Svelte preprocessor configuration
  - path: packages/svelte/tsconfig.json
    action: create
    description: TypeScript config for Svelte
  - path: packages/svelte/src/index.ts
    action: create
    description: Svelte package entry point
  - path: packages/svelte/README.md
    action: create
    description: Svelte package documentation
---
**Description:**
Initialize `@yetzirah/svelte` package for Svelte 4+ wrappers. These should be the thinnest wrappers since Svelte has excellent Web Component interop. Configure svelte-package for library build.

**Acceptance Criteria:**
- [ ] `pnpm build` succeeds
- [ ] TypeScript declarations generated
- [ ] Svelte 4+ peer dependency
- [ ] svelte-package configured
---
### PR-070: Svelte Toggle Wrapper
---
pr_id: PR-070
title: Svelte Toggle Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Thinnest possible wrapper, bind:checked, ~20 lines
dependencies:
  - PR-069
estimated_files:
  - path: packages/svelte/src/Toggle.svelte
    action: create
    description: Toggle component with bind:checked
  - path: packages/svelte/src/Toggle.test.ts
    action: create
    description: Toggle wrapper tests
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Toggle component
---
**Description:**
Create Svelte wrapper for ytz-toggle. Use bind:checked for two-way binding. Forward change event. Svelte's reactivity should make this trivial.

**Acceptance Criteria:**
- [ ] bind:checked works
- [ ] on:change event forwarding
- [ ] disabled prop
- [ ] < 30 lines (thinnest)
---
### PR-071: Svelte Chip Wrapper
---
pr_id: PR-071
title: Svelte Chip Wrapper
cold_state: completed
priority: high
complexity:
  score: 1
  estimated_minutes: 15
  suggested_model: haiku
  rationale: Pure event forwarding, ~15 lines
dependencies:
  - PR-069
estimated_files:
  - path: packages/svelte/src/Chip.svelte
    action: create
    description: Chip component
  - path: packages/svelte/src/Chip.test.ts
    action: create
    description: Chip wrapper tests
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Chip component
---
**Description:**
Create Svelte wrapper for ytz-chip. Forward delete event via on:delete. Pass through slot content.

**Acceptance Criteria:**
- [ ] deletable prop
- [ ] on:delete event
- [ ] Slot forwarding
- [ ] < 25 lines
---
### PR-072: Svelte IconButton Wrapper
---
pr_id: PR-072
title: Svelte IconButton Wrapper
cold_state: ready
priority: high
complexity:
  score: 1
  estimated_minutes: 15
  suggested_model: haiku
  rationale: Simplest wrapper, ~15 lines
dependencies:
  - PR-069
estimated_files:
  - path: packages/svelte/src/IconButton.svelte
    action: create
    description: IconButton component
  - path: packages/svelte/src/IconButton.test.ts
    action: create
    description: IconButton wrapper tests
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export IconButton component
---
**Description:**
Create Svelte wrapper for ytz-icon-button. Forward aria-label and tooltip props.

**Acceptance Criteria:**
- [ ] aria-label prop (required)
- [ ] tooltip prop
- [ ] on:click event
- [ ] < 25 lines
---
### PR-073: Svelte Slider Wrapper
---
pr_id: PR-073
title: Svelte Slider Wrapper
cold_state: ready
priority: high
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: bind:value with number type, ~30 lines
dependencies:
  - PR-069
estimated_files:
  - path: packages/svelte/src/Slider.svelte
    action: create
    description: Slider component with bind:value
  - path: packages/svelte/src/Slider.test.ts
    action: create
    description: Slider wrapper tests
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export Slider component
---
**Description:**
Create Svelte wrapper for ytz-slider. Use bind:value for two-way binding. Forward min, max, step props.

**Acceptance Criteria:**
- [ ] bind:value works
- [ ] on:input and on:change events
- [ ] min, max, step props
- [ ] < 35 lines
---
### PR-074: Svelte ThemeToggle Wrapper
---
pr_id: PR-074
title: Svelte ThemeToggle Wrapper
cold_state: ready
priority: medium
complexity:
  score: 1
  estimated_minutes: 15
  suggested_model: haiku
  rationale: Event forwarding only, ~20 lines
dependencies:
  - PR-069
estimated_files:
  - path: packages/svelte/src/ThemeToggle.svelte
    action: create
    description: ThemeToggle component
  - path: packages/svelte/src/ThemeToggle.test.ts
    action: create
    description: ThemeToggle wrapper tests
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export ThemeToggle component
---
**Description:**
Create Svelte wrapper for ytz-theme-toggle. Forward storageKey and noPersist props. Emit themechange event.

**Acceptance Criteria:**
- [ ] storage-key prop (use storageKey with Svelte prop syntax)
- [ ] no-persist prop
- [ ] on:themechange event
- [ ] < 30 lines
---
### PR-075: Svelte DataGrid Wrapper
---
pr_id: PR-075
title: Svelte DataGrid Wrapper
cold_state: ready
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Property binding for data array, ~50 lines total
dependencies:
  - PR-069
estimated_files:
  - path: packages/svelte/src/DataGrid.svelte
    action: create
    description: DataGrid component
  - path: packages/svelte/src/DataGridColumn.svelte
    action: create
    description: DataGridColumn component
  - path: packages/svelte/src/DataGrid.test.ts
    action: create
    description: DataGrid wrapper tests
  - path: packages/svelte/src/index.ts
    action: modify
    description: Export DataGrid and DataGridColumn
---
**Description:**
Create Svelte wrapper for ytz-datagrid. Use use:action or bind:this to set data property. Forward events.

**Acceptance Criteria:**
- [ ] data prop synced via property (not attribute)
- [ ] DataGridColumn child components
- [ ] on:sort, on:rowselect, on:rowactivate events
- [ ] < 50 lines per component
---
## Block 3: Angular 16+ Package Setup & Components

### PR-076: Angular Package Setup
---
pr_id: PR-076
title: Angular Package Setup
cold_state: completed
priority: critical
complexity:
  score: 5
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: Angular library configuration, CUSTOM_ELEMENTS_SCHEMA, ng-packagr setup
dependencies:
  - PR-061
estimated_files:
  - path: packages/angular/package.json
    action: create
    description: Angular package manifest
  - path: packages/angular/ng-package.json
    action: create
    description: ng-packagr configuration
  - path: packages/angular/tsconfig.json
    action: create
    description: Angular TypeScript config
  - path: packages/angular/tsconfig.lib.json
    action: create
    description: Library-specific TypeScript config
  - path: packages/angular/src/public-api.ts
    action: create
    description: Angular library entry point
  - path: packages/angular/src/lib/yetzirah.module.ts
    action: create
    description: NgModule for importing all components
  - path: packages/angular/README.md
    action: create
    description: Angular package documentation
---
**Description:**
Initialize `@yetzirah/angular` package for Angular 16+ wrappers. Use standalone components (Angular 14+). Configure CUSTOM_ELEMENTS_SCHEMA for Web Component support. Set up ng-packagr for library build.

**Acceptance Criteria:**
- [ ] `pnpm build` succeeds with ng-packagr
- [ ] Standalone components configured
- [ ] CUSTOM_ELEMENTS_SCHEMA applied
- [ ] Angular 16+ peer dependency
---
### PR-077: Angular Toggle Wrapper with ControlValueAccessor
---
pr_id: PR-077
title: Angular Toggle Wrapper with ControlValueAccessor
cold_state: ready
priority: high
complexity:
  score: 4
  estimated_minutes: 50
  suggested_model: sonnet
  rationale: ControlValueAccessor implementation for reactive forms, ~45 lines
dependencies:
  - PR-076
estimated_files:
  - path: packages/angular/src/lib/toggle/toggle.component.ts
    action: create
    description: Toggle component with ControlValueAccessor
  - path: packages/angular/src/lib/toggle/toggle.component.spec.ts
    action: create
    description: Toggle wrapper tests
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Toggle component
---
**Description:**
Create Angular wrapper for ytz-toggle implementing ControlValueAccessor for Angular forms integration. Support both template-driven and reactive forms. Use OnPush change detection.

**Acceptance Criteria:**
- [ ] ControlValueAccessor implemented
- [ ] [(ngModel)] works (template-driven)
- [ ] formControlName works (reactive forms)
- [ ] (change) event output
- [ ] OnPush change detection
- [ ] < 50 lines
---
### PR-078: Angular Chip Wrapper
---
pr_id: PR-078
title: Angular Chip Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Event output wrapper, ~30 lines
dependencies:
  - PR-076
estimated_files:
  - path: packages/angular/src/lib/chip/chip.component.ts
    action: create
    description: Chip component
  - path: packages/angular/src/lib/chip/chip.component.spec.ts
    action: create
    description: Chip wrapper tests
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Chip component
---
**Description:**
Create Angular wrapper for ytz-chip. Use @Input for deletable and disabled. Use @Output for delete event.

**Acceptance Criteria:**
- [ ] @Input() deletable
- [ ] @Input() disabled
- [ ] @Output() delete = new EventEmitter()
- [ ] ng-content for slot
- [ ] < 50 lines
---
### PR-079: Angular IconButton Wrapper
---
pr_id: PR-079
title: Angular IconButton Wrapper
cold_state: completed
priority: high
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Simple wrapper, ~25 lines
dependencies:
  - PR-076
estimated_files:
  - path: packages/angular/src/lib/icon-button/icon-button.component.ts
    action: create
    description: IconButton component
  - path: packages/angular/src/lib/icon-button/icon-button.component.spec.ts
    action: create
    description: IconButton wrapper tests
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export IconButton component
---
**Description:**
Create Angular wrapper for ytz-icon-button. Use @Input for ariaLabel (mapped to aria-label), tooltip, disabled.

**Acceptance Criteria:**
- [ ] @Input() ariaLabel (required, mapped to aria-label)
- [ ] @Input() tooltip
- [ ] ng-content for icon
- [ ] < 50 lines
---
### PR-080: Angular Slider Wrapper with ControlValueAccessor
---
pr_id: PR-080
title: Angular Slider Wrapper with ControlValueAccessor
cold_state: ready
priority: high
complexity:
  score: 4
  estimated_minutes: 50
  suggested_model: sonnet
  rationale: ControlValueAccessor with number type, ~45 lines
dependencies:
  - PR-076
estimated_files:
  - path: packages/angular/src/lib/slider/slider.component.ts
    action: create
    description: Slider component with ControlValueAccessor
  - path: packages/angular/src/lib/slider/slider.component.spec.ts
    action: create
    description: Slider wrapper tests
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export Slider component
---
**Description:**
Create Angular wrapper for ytz-slider implementing ControlValueAccessor. Handle number type properly. Support min, max, step inputs.

**Acceptance Criteria:**
- [ ] ControlValueAccessor implemented
- [ ] [(ngModel)] works with numbers
- [ ] @Input() min, max, step
- [ ] (change) and (input) outputs
- [ ] < 50 lines
---
### PR-081: Angular ThemeToggle Wrapper
---
pr_id: PR-081
title: Angular ThemeToggle Wrapper
cold_state: ready
priority: medium
complexity:
  score: 2
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Event output wrapper, ~30 lines
dependencies:
  - PR-076
estimated_files:
  - path: packages/angular/src/lib/theme-toggle/theme-toggle.component.ts
    action: create
    description: ThemeToggle component
  - path: packages/angular/src/lib/theme-toggle/theme-toggle.component.spec.ts
    action: create
    description: ThemeToggle wrapper tests
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export ThemeToggle component
---
**Description:**
Create Angular wrapper for ytz-theme-toggle. Use @Input for storageKey and noPersist. Use @Output for themeChange.

**Acceptance Criteria:**
- [ ] @Input() storageKey
- [ ] @Input() noPersist
- [ ] @Output() themeChange
- [ ] < 50 lines
---
### PR-082: Angular DataGrid Wrapper
---
pr_id: PR-082
title: Angular DataGrid Wrapper
cold_state: ready
priority: high
complexity:
  score: 5
  estimated_minutes: 75
  suggested_model: sonnet
  rationale: Complex inputs, content projection for columns, multiple outputs, ~70 lines
dependencies:
  - PR-076
estimated_files:
  - path: packages/angular/src/lib/datagrid/datagrid.component.ts
    action: create
    description: DataGrid component
  - path: packages/angular/src/lib/datagrid/datagrid-column.component.ts
    action: create
    description: DataGridColumn component
  - path: packages/angular/src/lib/datagrid/datagrid.component.spec.ts
    action: create
    description: DataGrid wrapper tests
  - path: packages/angular/src/public-api.ts
    action: modify
    description: Export DataGrid and DataGridColumn
---
**Description:**
Create Angular wrapper for ytz-datagrid. Handle data array via property binding with setter. Support DataGridColumn via content projection. Emit multiple events.

**Acceptance Criteria:**
- [ ] @Input() set data() with property sync
- [ ] @Input() columns or content projection
- [ ] @Input() rowHeight
- [ ] @Output() sort, rowSelect, rowActivate
- [ ] OnPush change detection
- [ ] < 75 lines per component
---
## Block 4: Documentation & Verification

### PR-083: Framework Wrapper Demos
---
pr_id: PR-083
title: Framework Wrapper Demos
cold_state: ready
priority: medium
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Demo pages for each framework showing integration
dependencies:
  - PR-068
  - PR-075
  - PR-082
estimated_files:
  - path: demos/vue/index.html
    action: create
    description: Vue demo page with CDN Vue + Yetzirah
  - path: demos/svelte/index.html
    action: create
    description: Svelte demo page
  - path: demos/angular/index.html
    action: create
    description: Angular demo page
  - path: demos/frameworks.html
    action: create
    description: Framework comparison demo page
---
**Description:**
Create demo pages showing framework wrappers in action. Include examples of v-model (Vue), bind: (Svelte), and ngModel/reactive forms (Angular).

**Acceptance Criteria:**
- [ ] Vue demo with v-model examples
- [ ] Svelte demo with bind: examples
- [ ] Angular demo with forms examples
- [ ] Framework comparison page
---
### PR-084: README Update with Framework Support
---
pr_id: PR-084
title: README Update with Framework Support
cold_state: ready
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Documentation update for all frameworks
dependencies:
  - PR-083
estimated_files:
  - path: README.md
    action: modify
    description: Add framework wrapper documentation
  - path: packages/vue/README.md
    action: modify
    description: Complete Vue package docs
  - path: packages/svelte/README.md
    action: modify
    description: Complete Svelte package docs
  - path: packages/angular/README.md
    action: modify
    description: Complete Angular package docs
---
**Description:**
Update main README.md and individual package READMEs to document framework wrapper usage. Include installation, v-model/bind:/ngModel examples, and API reference.

**Acceptance Criteria:**
- [ ] Main README lists all framework packages
- [ ] Installation instructions for each framework
- [ ] Usage examples with framework idioms
- [ ] API reference for each component
---
### PR-085: Bundle Verification for All Frameworks
---
pr_id: PR-085
title: Bundle Verification for All Frameworks
cold_state: ready
priority: high
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Size checks across all framework packages
dependencies:
  - PR-084
estimated_files:
  - path: scripts/check-size.js
    action: modify
    description: Add framework package size checks
  - path: package.json
    action: modify
    description: Update size thresholds
---
**Description:**
Verify bundle sizes for all framework packages. Svelte wrappers should be smallest. Vue and Angular should be similar. Ensure tree-shaking works.

**Expected Bundle Sizes (gzipped):**
- @yetzirah/svelte: < 2kb (thinnest wrappers)
- @yetzirah/vue: < 4kb
- @yetzirah/angular: < 5kb (ControlValueAccessor overhead)

**Acceptance Criteria:**
- [ ] Svelte bundle < 2kb gzipped
- [ ] Vue bundle < 4kb gzipped
- [ ] Angular bundle < 5kb gzipped
- [ ] Tree-shaking verified for each
- [ ] Individual component imports work
---
## Dependency Graph

```
Block 0 (Prep):
PR-061 (Archive)

Block 1 (Vue - parallel after PR-061):
PR-062 (Vue Setup) <- PR-061
  ├── PR-063 (Vue Toggle) <- PR-062
  ├── PR-064 (Vue Chip) <- PR-062
  ├── PR-065 (Vue IconButton) <- PR-062
  ├── PR-066 (Vue Slider) <- PR-062
  ├── PR-067 (Vue ThemeToggle) <- PR-062
  └── PR-068 (Vue DataGrid) <- PR-062

Block 2 (Svelte - parallel with Vue):
PR-069 (Svelte Setup) <- PR-061
  ├── PR-070 (Svelte Toggle) <- PR-069
  ├── PR-071 (Svelte Chip) <- PR-069
  ├── PR-072 (Svelte IconButton) <- PR-069
  ├── PR-073 (Svelte Slider) <- PR-069
  ├── PR-074 (Svelte ThemeToggle) <- PR-069
  └── PR-075 (Svelte DataGrid) <- PR-069

Block 3 (Angular - parallel with Vue & Svelte):
PR-076 (Angular Setup) <- PR-061
  ├── PR-077 (Angular Toggle + CVA) <- PR-076
  ├── PR-078 (Angular Chip) <- PR-076
  ├── PR-079 (Angular IconButton) <- PR-076
  ├── PR-080 (Angular Slider + CVA) <- PR-076
  ├── PR-081 (Angular ThemeToggle) <- PR-076
  └── PR-082 (Angular DataGrid) <- PR-076

Block 4 (Final - after all frameworks):
PR-083 (Demos) <- PR-068, PR-075, PR-082
PR-084 (README) <- PR-083
PR-085 (Bundle Verification) <- PR-084
```

## Parallel Execution Strategy

**Wave 1 (sequential):**
- PR-061 (Archive task list)

**Wave 2 (fully parallel - 3 setup tasks):**
- PR-062 (Vue Setup)
- PR-069 (Svelte Setup)
- PR-076 (Angular Setup)

**Wave 3 (fully parallel - 18 component wrappers):**
Vue (6): PR-063, PR-064, PR-065, PR-066, PR-067, PR-068
Svelte (6): PR-070, PR-071, PR-072, PR-073, PR-074, PR-075
Angular (6): PR-077, PR-078, PR-079, PR-080, PR-081, PR-082

**Wave 4 (sequential):**
- PR-083 (Demos) - depends on all DataGrid wrappers
- PR-084 (README)
- PR-085 (Bundle Verification)

## Notes

- **Svelte wrappers are thinnest:** Svelte's Web Component interop is excellent, wrappers may be <25 lines
- **Angular has most boilerplate:** ControlValueAccessor requires more code but enables full forms integration
- **Vue uses defineModel:** Vue 3.4+ defineModel macro simplifies v-model implementation
- **All packages depend on @yetzirah/core:** Ensure core is built first
- **Test strategy:** Use testing-library equivalents for each framework (vue-testing-library, svelte-testing-library, @testing-library/angular)
- **Line limits:** Simple wrappers <50 lines, DataGrid allowed <75 lines

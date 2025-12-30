# Yetzirah Phase 4: Extensions, Components & Distribution

## Orchestration Metadata

```yaml
version: 1.0
project: yetzirah-phase-4
total_prs: 22
parallel_tracks: 4
```

## Overview

Phase 4 extends Yetzirah with additional components, framework integrations, and finalizes npm distribution:
- New components: Snackbar/Toast, Progress/Spinner, Badge
- Solid.js framework wrappers with native signal integration
- Alpine.js plugin with `x-ytz` directives
- Server framework integration patterns (Rails, Laravel, Django)
- NPM package publication to `@grimoire` organization (final step)
---
## Dependency Block 1: Additional Core Components

These PRs add new core components to the library.

### PR-138: Snackbar/Toast Core Component
---
pr_id: PR-138
title: Snackbar/Toast Core Component
cold_state: completed
priority: high
complexity:
  score: 6
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: Queue management, auto-dismiss timing, stacking behavior requires careful state handling
dependencies: []
estimated_files:
  - path: packages/core/src/snackbar.ts
    action: create
    description: Snackbar Web Component implementation
  - path: packages/core/src/snackbar.test.ts
    action: create
    description: Unit tests for snackbar component
  - path: demos/snackbar.html
    action: create
    description: Demo page for snackbar component
---
**Description:**
Implement `<ytz-snackbar>` component for transient notifications. Support queue management (multiple snackbars stacked), auto-dismiss with configurable duration, position anchoring (top/bottom, left/center/right), and manual dismissal.

**Acceptance Criteria:**
- [ ] `<ytz-snackbar>` component registers and renders
- [ ] Queue management: multiple snackbars stack properly
- [ ] Auto-dismiss after configurable duration (default 5s)
- [ ] Position anchoring via `position` attribute (bottom-center default)
- [ ] Manual dismissal via close button or `dismiss()` method
- [ ] Dispatches `dismiss` event when closed
- [ ] ARIA live region for accessibility
- [ ] Works in vanilla HTML without JavaScript
---
### PR-139: Progress/Spinner Core Component
---
pr_id: PR-139
title: Progress/Spinner Core Component
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Mostly CSS-driven, minimal JavaScript logic
dependencies: []
estimated_files:
  - path: packages/core/src/progress.ts
    action: create
    description: Progress/Spinner Web Component implementation
  - path: packages/core/src/progress.test.ts
    action: create
    description: Unit tests for progress component
  - path: demos/progress.html
    action: create
    description: Demo page for progress component
---
**Description:**
Implement `<ytz-progress>` component for loading indicators. Support indeterminate (spinner) and determinate (progress bar) modes. Provide both circular and linear variants. CSS-driven animations with no JavaScript animation loops.

**Acceptance Criteria:**
- [ ] `<ytz-progress>` component registers and renders
- [ ] Indeterminate mode: continuous spinning/animation
- [ ] Determinate mode: shows progress via `value` attribute (0-100)
- [ ] Circular variant (spinner)
- [ ] Linear variant (progress bar)
- [ ] CSS-driven animations (no requestAnimationFrame)
- [ ] `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for determinate mode
- [ ] `role="progressbar"` for accessibility
---
### PR-140: Badge Core Component
---
pr_id: PR-140
title: Badge Core Component
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Simple overlay positioning, minimal logic
dependencies: []
estimated_files:
  - path: packages/core/src/badge.ts
    action: create
    description: Badge Web Component implementation
  - path: packages/core/src/badge.test.ts
    action: create
    description: Unit tests for badge component
  - path: demos/badge.html
    action: create
    description: Demo page for badge component
---
**Description:**
Implement `<ytz-badge>` component for notification dots and counts. Position relative to slotted content with configurable anchor position. Support dot mode (no content) and count mode (shows number).

**Acceptance Criteria:**
- [ ] `<ytz-badge>` component registers and renders
- [ ] Wraps slotted content with positioned badge overlay
- [ ] Dot mode when no `value` attribute (just shows indicator)
- [ ] Count mode when `value` attribute present (shows number)
- [ ] `max` attribute to cap displayed value (e.g., "99+")
- [ ] Position configurable via `position` attribute (top-right default)
- [ ] Hidden when `value="0"` or `hidden` attribute set
---
## Dependency Block 2: React Wrappers for New Components

### PR-141: Snackbar React Wrapper
---
pr_id: PR-141
title: Snackbar React Wrapper
cold_state: completed
priority: high
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Standard wrapper pattern, follows existing React wrapper conventions
dependencies: [PR-138]
estimated_files:
  - path: packages/react/src/Snackbar.tsx
    action: create
    description: React wrapper for Snackbar component
  - path: packages/react/src/Snackbar.test.tsx
    action: create
    description: Tests for Snackbar React wrapper
  - path: packages/react/src/index.ts
    action: modify
    description: Export Snackbar component
---
**Description:**
Create React wrapper for `<ytz-snackbar>` following existing wrapper patterns. Bridge `onDismiss` callback, expose `show()` and `dismiss()` methods via ref.

**Acceptance Criteria:**
- [ ] `<Snackbar>` component exported from @grimoire/yetzirah-react
- [ ] `onDismiss` prop bridges to dismiss event
- [ ] `open` prop controls visibility
- [ ] `autoHideDuration` prop sets dismiss timing
- [ ] `position` prop for anchoring
- [ ] Ref exposes `show()` and `dismiss()` methods
- [ ] TypeScript types exported
---
### PR-142: Progress React Wrapper
---
pr_id: PR-142
title: Progress React Wrapper
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Simple wrapper, mostly prop passthrough
dependencies: [PR-139]
estimated_files:
  - path: packages/react/src/Progress.tsx
    action: create
    description: React wrapper for Progress component
  - path: packages/react/src/Progress.test.tsx
    action: create
    description: Tests for Progress React wrapper
  - path: packages/react/src/index.ts
    action: modify
    description: Export Progress component
---
**Description:**
Create React wrapper for `<ytz-progress>` following existing wrapper patterns. Support both `CircularProgress` and `LinearProgress` named exports for MUI compatibility.

**Acceptance Criteria:**
- [ ] `<Progress>` component exported from @grimoire/yetzirah-react
- [ ] `<CircularProgress>` alias for circular variant
- [ ] `<LinearProgress>` alias for linear variant
- [ ] `value` prop for determinate mode
- [ ] `variant` prop: "indeterminate" | "determinate"
- [ ] TypeScript types exported
---
### PR-143: Badge React Wrapper
---
pr_id: PR-143
title: Badge React Wrapper
cold_state: completed
priority: medium
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Simple wrapper, mostly prop passthrough
dependencies: [PR-140]
estimated_files:
  - path: packages/react/src/Badge.tsx
    action: create
    description: React wrapper for Badge component
  - path: packages/react/src/Badge.test.tsx
    action: create
    description: Tests for Badge React wrapper
  - path: packages/react/src/index.ts
    action: modify
    description: Export Badge component
---
**Description:**
Create React wrapper for `<ytz-badge>` following existing wrapper patterns. Children become the anchored content.

**Acceptance Criteria:**
- [ ] `<Badge>` component exported from @grimoire/yetzirah-react
- [ ] `badgeContent` prop sets the badge value
- [ ] `max` prop caps displayed value
- [ ] `invisible` prop hides the badge
- [ ] `children` rendered as anchored content
- [ ] TypeScript types exported
---
## Dependency Block 3: Vue/Svelte/Angular Wrappers

### PR-144: Snackbar Vue/Svelte/Angular Wrappers
---
pr_id: PR-144
title: Snackbar Vue/Svelte/Angular Wrappers
cold_state: completed
priority: medium
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Three frameworks, each with their own conventions
dependencies: [PR-141]
estimated_files:
  - path: packages/vue/src/Snackbar.vue
    action: create
    description: Vue wrapper for Snackbar
  - path: packages/svelte/src/Snackbar.svelte
    action: create
    description: Svelte wrapper for Snackbar
  - path: packages/angular/src/snackbar.component.ts
    action: create
    description: Angular wrapper for Snackbar
---
**Description:**
Create framework wrappers for Snackbar in Vue, Svelte, and Angular following existing patterns for each framework.

**Acceptance Criteria:**
- [ ] Vue: `<Snackbar>` with `v-model:open` support
- [ ] Svelte: `<Snackbar>` with `bind:open` support
- [ ] Angular: `YtzSnackbar` component with `[(open)]` two-way binding
- [ ] All frameworks: `@dismiss` / `on:dismiss` / `(dismiss)` event
- [ ] Tests for each framework wrapper
---
### PR-145: Progress Vue/Svelte/Angular Wrappers
---
pr_id: PR-145
title: Progress Vue/Svelte/Angular Wrappers
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Simple component, straightforward wrappers
dependencies: [PR-142]
estimated_files:
  - path: packages/vue/src/Progress.vue
    action: create
    description: Vue wrapper for Progress
  - path: packages/svelte/src/Progress.svelte
    action: create
    description: Svelte wrapper for Progress
  - path: packages/angular/src/progress.component.ts
    action: create
    description: Angular wrapper for Progress
---
**Description:**
Create framework wrappers for Progress in Vue, Svelte, and Angular.

**Acceptance Criteria:**
- [ ] Vue: `<Progress>` and `<CircularProgress>`/`<LinearProgress>` aliases
- [ ] Svelte: `<Progress>` with variant prop
- [ ] Angular: `YtzProgress` component
- [ ] All variants (circular/linear, determinate/indeterminate) supported
- [ ] Tests for each framework wrapper
---
### PR-146: Badge Vue/Svelte/Angular Wrappers
---
pr_id: PR-146
title: Badge Vue/Svelte/Angular Wrappers
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Simple component, straightforward wrappers
dependencies: [PR-143]
estimated_files:
  - path: packages/vue/src/Badge.vue
    action: create
    description: Vue wrapper for Badge
  - path: packages/svelte/src/Badge.svelte
    action: create
    description: Svelte wrapper for Badge
  - path: packages/angular/src/badge.component.ts
    action: create
    description: Angular wrapper for Badge
---
**Description:**
Create framework wrappers for Badge in Vue, Svelte, and Angular.

**Acceptance Criteria:**
- [ ] Vue: `<Badge>` with slot for anchored content
- [ ] Svelte: `<Badge>` with slot
- [ ] Angular: `YtzBadge` with content projection
- [ ] All props (badgeContent, max, invisible) supported
- [ ] Tests for each framework wrapper
---
## Dependency Block 4: Solid.js Integration

### PR-147: Solid.js Package Setup
---
pr_id: PR-147
title: Solid.js Package Setup
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 45
  suggested_model: sonnet
  rationale: New package setup with Solid-specific build configuration
dependencies: [PR-146]
estimated_files:
  - path: packages/solid/package.json
    action: create
    description: Package configuration for Solid.js wrappers
  - path: packages/solid/tsconfig.json
    action: create
    description: TypeScript config for Solid
  - path: packages/solid/vite.config.ts
    action: create
    description: Vite build config for Solid
  - path: packages/solid/src/index.ts
    action: create
    description: Main entry point
  - path: packages/solid/src/utils.ts
    action: create
    description: Shared utilities for Solid wrappers
  - path: pnpm-workspace.yaml
    action: modify
    description: Add solid package to workspace
---
**Description:**
Set up `@grimoire/yetzirah-solid` package with proper Solid.js build configuration. Create shared utilities for signal integration and event bridging.

**Acceptance Criteria:**
- [ ] Package builds with `pnpm build`
- [ ] TypeScript configured for Solid JSX
- [ ] Vite configured for Solid library mode
- [ ] Shared `createYetzirahWrapper` utility for consistent wrapper pattern
- [ ] Signal-based state management helper
- [ ] Event handler bridging utility (`on:` → `addEventListener`)
---
### PR-148: Solid.js Core Component Wrappers
---
pr_id: PR-148
title: Solid.js Core Component Wrappers
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 90
  suggested_model: sonnet
  rationale: All Tier 1 and Tier 2 components need Solid wrappers
dependencies: [PR-147]
estimated_files:
  - path: packages/solid/src/Button.tsx
    action: create
    description: Solid wrapper for Button
  - path: packages/solid/src/Dialog.tsx
    action: create
    description: Solid wrapper for Dialog
  - path: packages/solid/src/Drawer.tsx
    action: create
    description: Solid wrapper for Drawer
  - path: packages/solid/src/Menu.tsx
    action: create
    description: Solid wrapper for Menu
  - path: packages/solid/src/Tabs.tsx
    action: create
    description: Solid wrapper for Tabs
  - path: packages/solid/src/Tooltip.tsx
    action: create
    description: Solid wrapper for Tooltip
  - path: packages/solid/src/Disclosure.tsx
    action: create
    description: Solid wrapper for Disclosure
  - path: packages/solid/src/Accordion.tsx
    action: create
    description: Solid wrapper for Accordion
  - path: packages/solid/src/Autocomplete.tsx
    action: create
    description: Solid wrapper for Autocomplete
  - path: packages/solid/src/Select.tsx
    action: create
    description: Solid wrapper for Select
  - path: packages/solid/src/Popover.tsx
    action: create
    description: Solid wrapper for Popover
  - path: packages/solid/src/Toggle.tsx
    action: create
    description: Solid wrapper for Toggle
  - path: packages/solid/src/Slider.tsx
    action: create
    description: Solid wrapper for Slider
  - path: packages/solid/src/Chip.tsx
    action: create
    description: Solid wrapper for Chip
---
**Description:**
Create Solid.js wrappers for all existing Tier 1 and Tier 2 components. Use native Solid signals for state, proper ref forwarding, and idiomatic event handling.

**Acceptance Criteria:**
- [ ] All Tier 1 components wrapped (Button, Dialog, Drawer, Menu, Tabs, Tooltip, Disclosure, Accordion, Autocomplete, Select, Popover)
- [ ] All Tier 2 components wrapped (Toggle, Slider, Chip)
- [ ] Native signal integration for reactive props
- [ ] Ref forwarding via `ref` prop
- [ ] Event handlers use Solid's `on:event` syntax
- [ ] TypeScript types for all components
---
### PR-149: Solid.js New Component Wrappers
---
pr_id: PR-149
title: Solid.js New Component Wrappers
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Three new components, pattern already established
dependencies: [PR-148]
estimated_files:
  - path: packages/solid/src/Snackbar.tsx
    action: create
    description: Solid wrapper for Snackbar
  - path: packages/solid/src/Progress.tsx
    action: create
    description: Solid wrapper for Progress
  - path: packages/solid/src/Badge.tsx
    action: create
    description: Solid wrapper for Badge
  - path: packages/solid/src/index.ts
    action: modify
    description: Export new components
---
**Description:**
Create Solid.js wrappers for the new Phase 4 components (Snackbar, Progress, Badge).

**Acceptance Criteria:**
- [ ] `<Snackbar>` with signal-based open state
- [ ] `<Progress>` with signal-based value
- [ ] `<Badge>` with slot support
- [ ] Consistent with existing Solid wrapper patterns
---
### PR-150: Solid.js Integration Tests & Documentation
---
pr_id: PR-150
title: Solid.js Integration Tests & Documentation
cold_state: new
priority: medium
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Comprehensive testing and documentation for new framework
dependencies: [PR-149]
estimated_files:
  - path: packages/solid/src/__tests__/integration.test.tsx
    action: create
    description: Integration tests for Solid wrappers
  - path: demos/solid/index.html
    action: create
    description: Solid demo page
  - path: demos/solid/App.tsx
    action: create
    description: Solid demo application
  - path: docs/solid.md
    action: create
    description: Solid.js usage documentation
---
**Description:**
Create comprehensive integration tests and documentation for Solid.js wrappers. Include demo application showcasing all components.

**Acceptance Criteria:**
- [ ] Integration tests for all wrapped components
- [ ] Demo application with all components
- [ ] Documentation covering installation, usage, and patterns
- [ ] SSR compatibility notes (Solid Start)
- [ ] Signal integration examples
---
## Dependency Block 5: Alpine.js Integration

### PR-151: Alpine.js Plugin Package Setup
---
pr_id: PR-151
title: Alpine.js Plugin Package Setup
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 45
  suggested_model: sonnet
  rationale: Plugin architecture requires understanding Alpine's extension system
dependencies: [PR-146]
estimated_files:
  - path: packages/alpine/package.json
    action: create
    description: Package configuration for Alpine plugin
  - path: packages/alpine/tsconfig.json
    action: create
    description: TypeScript configuration
  - path: packages/alpine/src/index.ts
    action: create
    description: Plugin entry point
  - path: packages/alpine/src/plugin.ts
    action: create
    description: Alpine plugin registration
  - path: pnpm-workspace.yaml
    action: modify
    description: Add alpine package to workspace
---
**Description:**
Set up `@grimoire/yetzirah-alpine` package as an Alpine.js plugin. Create the plugin registration infrastructure and CDN-ready build.

**Acceptance Criteria:**
- [ ] Package builds as ESM and UMD for CDN usage
- [ ] Plugin registers with `Alpine.plugin(yetzirah)`
- [ ] Auto-detects Yetzirah elements on init
- [ ] Works without build step (CDN-ready)
- [ ] TypeScript types for Alpine integration
---
### PR-152: x-ytz Directive Implementation
---
pr_id: PR-152
title: x-ytz Directive Implementation
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Event bridging between CustomEvent.detail and Alpine's expected event.target.value
dependencies: [PR-151]
estimated_files:
  - path: packages/alpine/src/directives/x-ytz.ts
    action: create
    description: x-ytz directive implementation
  - path: packages/alpine/src/directives/index.ts
    action: create
    description: Directive exports
  - path: packages/alpine/src/__tests__/x-ytz.test.ts
    action: create
    description: Tests for x-ytz directive
---
**Description:**
Implement `x-ytz` directive that patches Yetzirah elements to expose `event.detail.value` as `event.target.value`, harmonizing with Alpine's expected event structure.

**Acceptance Criteria:**
- [ ] `x-ytz` directive registers with Alpine
- [ ] Patches element to proxy `event.detail.value` to `event.target.value`
- [ ] Works with all Yetzirah form components (Select, Autocomplete, Toggle, Slider)
- [ ] Supports `@change`, `@input`, and custom events
- [ ] Auto-applied when plugin loaded (no manual `x-ytz` needed)
---
### PR-153: x-ytz:model Two-way Binding
---
pr_id: PR-153
title: x-ytz:model Two-way Binding
cold_state: new
priority: high
complexity:
  score: 5
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Two-way binding requires watching Alpine data and syncing to element
dependencies: [PR-152]
estimated_files:
  - path: packages/alpine/src/directives/x-ytz-model.ts
    action: create
    description: x-ytz:model directive implementation
  - path: packages/alpine/src/__tests__/x-ytz-model.test.ts
    action: create
    description: Tests for x-ytz:model directive
---
**Description:**
Implement `x-ytz:model` directive for two-way data binding between Alpine state and Yetzirah form components.

**Acceptance Criteria:**
- [ ] `x-ytz:model="variable"` binds Alpine data to component value
- [ ] Changes in component update Alpine data
- [ ] Changes in Alpine data update component
- [ ] Works with Select, Autocomplete, Toggle, Slider
- [ ] Supports modifiers (`.debounce`, `.throttle`)
---
### PR-154: Alpine.js Magic Methods
---
pr_id: PR-154
title: Alpine.js Magic Methods
cold_state: new
priority: medium
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Simple utility methods, pattern is established
dependencies: [PR-153]
estimated_files:
  - path: packages/alpine/src/magics/ytz.ts
    action: create
    description: $ytz magic implementation
  - path: packages/alpine/src/__tests__/magics.test.ts
    action: create
    description: Tests for magic methods
---
**Description:**
Implement Alpine magic methods for imperative control of Yetzirah components.

**Acceptance Criteria:**
- [ ] `$ytz.open(selector)` opens Dialog/Drawer/Menu
- [ ] `$ytz.close(selector)` closes Dialog/Drawer/Menu
- [ ] `$ytz.toggle(selector)` toggles open state
- [ ] `$ytz.show(selector, message)` shows Snackbar
- [ ] Works with element refs or selectors
---
### PR-155: Alpine.js Integration Tests & Documentation
---
pr_id: PR-155
title: Alpine.js Integration Tests & Documentation
cold_state: new
priority: medium
complexity:
  score: 4
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Comprehensive testing and documentation for CDN-first framework
dependencies: [PR-154]
estimated_files:
  - path: packages/alpine/src/__tests__/integration.test.ts
    action: create
    description: Integration tests for Alpine plugin
  - path: demos/alpine/index.html
    action: create
    description: Alpine demo page (CDN-based)
  - path: docs/alpine.md
    action: create
    description: Alpine.js plugin documentation
---
**Description:**
Create comprehensive integration tests and documentation for Alpine.js plugin. Demo must work entirely from CDN with no build step.

**Acceptance Criteria:**
- [ ] Integration tests for all directives and magics
- [ ] CDN-only demo page (no build step)
- [ ] Documentation covering installation, directives, magics
- [ ] Examples for Rails/Laravel/Django usage patterns
- [ ] Comparison with vanilla Alpine patterns
---
## Dependency Block 6: Documentation & CDN

### PR-156: Server Framework Integration Patterns
---
pr_id: PR-156
title: Server Framework Integration Patterns
cold_state: new
priority: medium
complexity:
  score: 3
  estimated_minutes: 45
  suggested_model: haiku
  rationale: Documentation-focused, pattern examples
dependencies: [PR-150, PR-155]
estimated_files:
  - path: docs/rails-integration.md
    action: create
    description: Rails integration guide
  - path: docs/laravel-integration.md
    action: create
    description: Laravel integration guide
  - path: docs/django-integration.md
    action: create
    description: Django integration guide
---
**Description:**
Document integration patterns for server-rendered frameworks (Rails, Laravel, Django) using Yetzirah with Alpine.js for progressive enhancement.

**Acceptance Criteria:**
- [ ] Rails: Hotwire/Turbo + Yetzirah + Alpine patterns
- [ ] Laravel: Livewire + Yetzirah + Alpine patterns
- [ ] Django: HTMX + Yetzirah patterns
- [ ] Asset pipeline configuration for each framework
- [ ] Example templates/views for common patterns
---
### PR-157: CDN Distribution for New Components & Plugins
---
pr_id: PR-157
title: CDN Distribution for New Components & Plugins
cold_state: new
priority: medium
complexity:
  score: 4
  estimated_minutes: 45
  suggested_model: sonnet
  rationale: Build configuration for CDN bundles of new packages
dependencies: [PR-156]
estimated_files:
  - path: packages/core/cdn/snackbar.js
    action: create
    description: CDN bundle for Snackbar
  - path: packages/core/cdn/progress.js
    action: create
    description: CDN bundle for Progress
  - path: packages/core/cdn/badge.js
    action: create
    description: CDN bundle for Badge
  - path: packages/alpine/cdn/alpine-yetzirah.js
    action: create
    description: CDN bundle for Alpine plugin
  - path: scripts/build-cdn.js
    action: modify
    description: Update to build new components
---
**Description:**
Update CDN build to include new components and Alpine.js plugin. Ensure all new components are available via jsDelivr/unpkg after npm publish.

**Acceptance Criteria:**
- [ ] Snackbar, Progress, Badge available as individual CDN bundles
- [ ] Alpine plugin available as single CDN bundle
- [ ] Updated core.js includes new components
- [ ] Bundle sizes documented
- [ ] Demo pages updated to show CDN usage
---
### PR-158: Phase 4 Architecture Documentation
---
pr_id: PR-158
title: Phase 4 Architecture Documentation
cold_state: new
priority: low
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Documentation summarizing Phase 4 decisions
dependencies: [PR-157]
estimated_files:
  - path: docs/architecture-phase4.md
    action: create
    description: Phase 4 architecture decisions and rationale
  - path: CHANGELOG.md
    action: modify
    description: Document Phase 4 release
---
**Description:**
Document architecture decisions made for Phase 4. Cover new components, Solid.js integration, Alpine.js plugin design, and npm distribution setup.

**Acceptance Criteria:**
- [ ] New component architecture documented
- [ ] Solid.js wrapper design decisions
- [ ] Alpine.js plugin architecture explained
- [ ] NPM distribution setup documented
- [ ] CHANGELOG updated for Phase 4 release
---
## Dependency Block 7: NPM Distribution (Final)

### PR-137: Package Registry Publication Setup
---
pr_id: PR-137
title: Package Registry Publication Setup
cold_state: new
priority: high
complexity:
  score: 5
  estimated_minutes: 50
  suggested_model: sonnet
  rationale: CI/CD setup for multi-registry publishing requires careful configuration
dependencies: [PR-158]
estimated_files:
  - path: .github/workflows/publish.yml
    action: create
    description: GitHub Actions workflow for automated package publishing
  - path: .npmrc
    action: create
    description: npm registry configuration
  - path: packages/core/package.json
    action: modify
    description: Add publishConfig and registry metadata
  - path: packages/react/package.json
    action: modify
    description: Add publishConfig and registry metadata
  - path: packages/vue/package.json
    action: modify
    description: Add publishConfig and registry metadata
  - path: packages/svelte/package.json
    action: modify
    description: Add publishConfig and registry metadata
  - path: packages/angular/package.json
    action: modify
    description: Add publishConfig and registry metadata
  - path: packages/solid/package.json
    action: modify
    description: Add publishConfig and registry metadata
  - path: packages/alpine/package.json
    action: modify
    description: Add publishConfig and registry metadata
  - path: scripts/publish.js
    action: create
    description: Publication script with version management
  - path: docs/publishing.md
    action: create
    description: Guide for maintainers on publishing releases
---
**Description:**
Set up automated package publication to npm registry with compatibility for pnpm, bun, and yarn. Configure GitHub Actions workflow for version tagging, changelog generation, and multi-package publishing. All @grimoire/yetzirah-* packages should be published atomically with consistent versions.

**Acceptance Criteria:**
- [ ] GitHub Actions workflow publishes on version tag push
- [ ] All 7 packages published atomically (@grimoire/yetzirah-core, -react, -vue, -svelte, -angular, -solid, -alpine)
- [ ] Packages installable via `npm install`, `pnpm add`, `bun add`, and `yarn add`
- [ ] Provenance attestation enabled for supply chain security
- [ ] CDN bundles automatically available on jsDelivr/unpkg after npm publish
- [ ] Version management script handles monorepo versioning
- [ ] Publishing guide documents the release process for maintainers
---
## Dependency Graph

```
PR-138 (Snackbar Core) ──┐
                         ├── PR-141 (Snackbar React)
PR-139 (Progress Core) ──┤       │
                         ├── PR-142 (Progress React)
PR-140 (Badge Core) ─────┤       │
                         └── PR-143 (Badge React)
                                 │
                                 ▼
                    ┌────────────┴────────────┐
                    │                         │
            PR-144 (Snackbar V/S/A)    PR-145 (Progress V/S/A)
                    │                         │
                    └────────────┬────────────┘
                                 │
                         PR-146 (Badge V/S/A)
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            PR-147 (Solid Setup)      PR-151 (Alpine Setup)
                    │                         │
            PR-148 (Solid Tier 1+2)   PR-152 (x-ytz Directive)
                    │                         │
            PR-149 (Solid New)        PR-153 (x-ytz:model)
                    │                         │
            PR-150 (Solid Docs)       PR-154 (Magic Methods)
                    │                         │
                    │                 PR-155 (Alpine Docs)
                    │                         │
                    └────────────┬────────────┘
                                 │
                         PR-156 (Server Patterns)
                                 │
                         PR-157 (CDN New Components)
                                 │
                         PR-158 (Architecture Docs)
                                 │
                         PR-137 (NPM Distribution)
```

## Parallel Execution Opportunities

Immediately (no dependencies):
- PR-138, PR-139, PR-140 can run in parallel

After each core component completes:
- React wrapper can start immediately (PR-141, PR-142, PR-143 in parallel)

After React wrappers complete:
- PR-144, PR-145, PR-146 can run in parallel

After PR-146 completes:
- PR-147 (Solid) and PR-151 (Alpine) can run in parallel
- Solid track and Alpine track are independent

After PR-150 and PR-155 complete:
- PR-156 → PR-157 → PR-158 → PR-137 run sequentially

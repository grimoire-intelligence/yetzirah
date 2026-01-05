# Changelog

All notable changes to Yetzirah will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - Phase 4: Extensions, Components & Distribution

### Added

#### New Core Components
- `<ytz-snackbar>` - Transient notifications with queue management, auto-dismiss, and position anchoring
- `<ytz-progress>` - Loading indicators with circular/linear variants and CSS-driven animations
- `<ytz-badge>` - Notification dots and counts with overlay positioning

#### Solid.js Integration
- `@grimoire/yetzirah-solid` package with native signal-based wrappers
- Wrappers for all 22 components using Solid's fine-grained reactivity
- TypeScript types with JSX namespace augmentation
- SSR compatibility (Solid Start)

#### Alpine.js Plugin
- `@grimoire/yetzirah-alpine` package for progressive enhancement
- Component-specific directives (`x-ytz-dialog`, `x-ytz-toggle`, etc.)
- Unified `x-ytz:model` directive for two-way data binding
- `$ytz` magic methods for imperative component control
- CDN-ready bundle for buildless usage

#### Server Framework Integration
- Rails + Hotwire integration guide
- Laravel + Livewire integration guide
- Django + HTMX integration guide

#### Framework Wrappers for New Components
- React: `<Snackbar>`, `<Progress>`, `<Badge>`
- Vue: `<Snackbar>`, `<Progress>`, `<Badge>` with v-model support
- Svelte: `<Snackbar>`, `<Progress>`, `<Badge>` with bind: support
- Angular: `YtzSnackbar`, `YtzProgress`, `YtzBadge` components
- Solid: `<Snackbar>`, `<Progress>`, `<Badge>` with signal integration

#### CDN Distribution
- Individual CDN bundles for Snackbar, Progress, Badge
- Alpine.js plugin CDN bundle
- Updated core.js with all 22 components

#### Documentation
- Phase 4 architecture documentation
- Solid.js usage guide
- Alpine.js plugin documentation

### Changed

- Core bundle now includes 22 components (was 19)
- Framework wrapper packages updated with new component exports

### Performance

- New component bundle sizes:
  - Snackbar: ~1 KB gzipped
  - Progress: ~600 B gzipped
  - Badge: ~500 B gzipped
- Solid.js wrappers: ~4 KB gzipped
- Alpine.js plugin: ~3 KB gzipped
- Total core bundle: ~12 KB gzipped (was ~11 KB)

### Technical Details

- Solid.js wrappers use native `createEffect` for reactive updates
- Alpine.js directives use `effect()` for bidirectional sync
- All new components follow ARIA accessibility patterns
- Zero new runtime dependencies

## [0.2.0] - Phase 3: CDN-First Distribution

### Added

#### CDN Build System
- CDN-optimized bundles via tsup/esbuild (`pnpm build:cdn`)
- Combined bundle `cdn/core.js` with all 19 components (10.96 KB gzipped)
- Tier 1 bundle `cdn/tier1.js` with 12 essential components (6.49 KB gzipped)
- Auto-registration bundle `cdn/auto.js` for script tag usage
- Individual component bundles for tree-shaking (504 B - 2.99 KB each)
- Source maps for all CDN bundles

#### Documentation
- CDN Usage Guide with import map examples
- CDN Hosting Guide for jsDelivr, unpkg, esm.sh, and self-hosting
- Preact + HTM integration guide for buildless React-like development
- Vanilla JavaScript patterns guide for framework-free usage
- Performance documentation with budgets and optimization strategies
- Phase 3 architecture documentation

#### Performance Testing
- Performance testing suite (`scripts/perf-test.js`)
- Bundle size budget enforcement
- Network simulation for 3G/4G/broadband
- Parse time estimation
- Baseline comparison for regression detection
- CI-compatible performance checks

#### CDN Integration Tests
- Playwright tests for CDN bundles
- Component functionality verification
- Import map resolution testing
- Console error detection

#### Demos
- CDN demo page with all components
- Import map demo
- Preact + HTM demo
- Vanilla JavaScript application demo

### Changed

- Package exports now include `./cdn/*` paths for CDN bundles
- Build configuration updated for dual dist/cdn output
- Bundle report updated with CDN bundle sizes

### Performance

- Tier 1 bundle: 6.49 KB gzipped (under 10 KB target)
- Full bundle: 10.96 KB gzipped
- Individual components: 504 B - 2.99 KB gzipped
- Estimated load time on Fast 3G: ~350ms for Tier 1 bundle
- 4-5x smaller than comparable libraries (Headless UI: ~68 KB)

### Technical Details

- ESM-only output for modern browsers
- Zero runtime dependencies
- Self-contained bundles (no code splitting)
- Idempotent custom element registration
- Import map support for npm-like DX

## [0.1.0] - Initial Release

### Added

#### Core Web Components (Tier 1)
- `<ytz-button>` - Accessible button with loading states
- `<ytz-disclosure>` - Expandable/collapsible content
- `<ytz-dialog>` - Modal dialog with focus trap
- `<ytz-tabs>` - Tab navigation with panels
- `<ytz-tooltip>` - Accessible tooltips
- `<ytz-menu>` - Dropdown menu with keyboard navigation
- `<ytz-autocomplete>` - Searchable combobox
- `<ytz-listbox>` - Selection list
- `<ytz-select>` - Custom select dropdown
- `<ytz-accordion>` - Collapsible sections
- `<ytz-drawer>` - Slide-out panel
- `<ytz-popover>` - Positioned overlay

#### Extended Components (Tier 2)
- `<ytz-toggle>` - Toggle switch
- `<ytz-chip>` - Dismissible chip/tag
- `<ytz-slider>` - Range input
- `<ytz-icon-button>` - Icon-only button
- `<ytz-theme-toggle>` - Dark/light mode toggle
- `<ytz-datagrid>` - Data table with sorting

#### Framework Wrappers
- `@grimoire/yetzirah-react` - React wrappers with hooks
- `@grimoire/yetzirah-vue` - Vue 3 wrappers with v-model
- `@grimoire/yetzirah-svelte` - Svelte wrappers
- `@grimoire/yetzirah-angular` - Angular wrappers with ControlValueAccessor

#### Infrastructure
- Monorepo with pnpm workspaces
- TypeScript throughout
- Comprehensive test suite
- Bundle size verification

[Unreleased]: https://github.com/grimoire-intelligence/yetzirah/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/grimoire-intelligence/yetzirah/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/grimoire-intelligence/yetzirah/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/grimoire-intelligence/yetzirah/releases/tag/v0.1.0

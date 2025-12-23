# Yetzirah Phase 3: CDN-First Distribution

## Orchestration Metadata

```yaml
version: 1.0
project: yetzirah-phase-3-cdn
total_prs: 13
parallel_tracks: 3
estimated_total_hours: 18
```

## Overview

Phase 3 optimizes Yetzirah for buildless and global deployment:
- Single-file bundles for each component
- ESM imports from CDN
- Documentation for Preact + HTM usage
- Sub-10kb total for core + all Tier 1 components
- Sub-Saharan Africa load time < 3s on 3G
- Publication to npm, pnpm, bun, and yarn registries

---

## Dependency Block 1: Build Infrastructure

These PRs establish the CDN build pipeline.

### PR-125: CDN Build Configuration

---
pr_id: PR-125
title: CDN Build Configuration
cold_state: completed
priority: high
complexity:
  score: 5
  estimated_minutes: 45
  suggested_model: sonnet
  rationale: Rollup/esbuild config for multiple output formats requires bundler expertise
dependencies: []
estimated_files:
  - path: packages/core/rollup.config.cdn.js
    action: create
    description: Rollup config for CDN bundles with tree-shaking
  - path: packages/core/package.json
    action: modify
    description: Add cdn build scripts
  - path: scripts/build-cdn.js
    action: create
    description: Build script orchestrating CDN bundle generation
---

**Description:**
Create build configuration for generating CDN-optimized bundles. Configure Rollup/esbuild to produce ESM bundles with aggressive tree-shaking, minification, and source maps. Output both a combined `core.js` and individual component files.

**Acceptance Criteria:**
- [ ] `pnpm build:cdn` produces ESM bundles in `packages/core/cdn/`
- [ ] Combined `core.js` includes all Tier 1 + Tier 2 components
- [ ] Source maps generated for debugging
- [ ] Build completes in under 10 seconds

---

### PR-126: Individual Component Bundles

---
pr_id: PR-126
title: Individual Component Bundles
cold_state: completed
priority: high
complexity:
  score: 4
  estimated_minutes: 30
  suggested_model: sonnet
  rationale: Generating per-component entry points with shared utilities
dependencies: [PR-125]
estimated_files:
  - path: packages/core/cdn/button.js
    action: create
    description: Standalone Button component bundle
  - path: packages/core/cdn/dialog.js
    action: create
    description: Standalone Dialog component bundle
  - path: packages/core/cdn/index.js
    action: create
    description: Re-export all components for tree-shaking
  - path: scripts/build-cdn.js
    action: modify
    description: Generate individual component entry points
---

**Description:**
Generate individual ESM bundles for each component that can be imported independently from CDN. Each bundle should include only the component and its required utilities (positioning, focus trap, etc.), enabling minimal payloads for single-component usage.

**Acceptance Criteria:**
- [ ] Each Tier 1 component has its own `cdn/{component}.js` file
- [ ] Each Tier 2 component has its own `cdn/{component}.js` file
- [ ] Shared utilities are inlined or chunked appropriately
- [ ] Individual imports work: `import '@cdn/dialog.js'`

---

### PR-127: Bundle Size Optimization

---
pr_id: PR-127
title: Bundle Size Optimization
cold_state: completed
priority: high
complexity:
  score: 6
  estimated_minutes: 60
  suggested_model: sonnet
  rationale: Requires analysis of bundle composition and optimization strategies
dependencies: [PR-126]
estimated_files:
  - path: packages/core/src/utils/index.ts
    action: modify
    description: Optimize utility exports for tree-shaking
  - path: scripts/analyze-bundle.js
    action: create
    description: Bundle analysis script with size breakdown
  - path: docs/bundle-report.md
    action: modify
    description: Update with CDN bundle sizes
---

**Description:**
Optimize CDN bundles to meet the <10KB gzipped target for all Tier 1 components. Analyze bundle composition, eliminate dead code, optimize utility sharing, and ensure aggressive minification. Document final sizes.

**Acceptance Criteria:**
- [ ] Combined Tier 1 bundle < 10KB gzipped
- [ ] Individual component bundles documented with sizes
- [ ] Bundle analysis report generated on each build
- [ ] No duplicate code across component bundles when using import maps

---

## Dependency Block 2: CDN Integration

These PRs enable CDN usage patterns.

### PR-128: Import Map Support

---
pr_id: PR-128
title: Import Map Support
cold_state: completed
priority: medium
complexity:
  score: 3
  estimated_minutes: 25
  suggested_model: haiku
  rationale: Documentation and example configuration, minimal code
dependencies: [PR-126]
estimated_files:
  - path: demos/cdn/importmap.html
    action: create
    description: Demo using import maps for CDN modules
  - path: docs/cdn-usage.md
    action: create
    description: CDN usage documentation with import map examples
---

**Description:**
Document and demonstrate import map usage for CDN bundles. Import maps allow bare specifier imports (`import { Dialog } from 'yetzirah'`) to resolve to CDN URLs, providing a npm-like DX without a build step.

**Acceptance Criteria:**
- [ ] Working import map example in demos/cdn/
- [ ] Documentation covers import map setup
- [ ] Examples for jsDelivr, unpkg, and esm.sh CDNs
- [ ] Browser compatibility notes included

---

### PR-129: CDN Demo Page

---
pr_id: PR-129
title: CDN Demo Page
cold_state: new
priority: medium
complexity:
  score: 4
  estimated_minutes: 35
  suggested_model: sonnet
  rationale: Full demo page with all components loaded from CDN
dependencies: [PR-127]
estimated_files:
  - path: demos/cdn/index.html
    action: create
    description: Comprehensive CDN demo with all Tier 1 components
  - path: demos/cdn/styles.css
    action: create
    description: Demo styles using Tachyons from CDN
---

**Description:**
Create a comprehensive demo page that loads Yetzirah entirely from CDN with no build step. Demonstrate all Tier 1 components working together, styled with Tachyons loaded from CDN. This serves as both documentation and proof that buildless usage works.

**Acceptance Criteria:**
- [ ] Demo loads Yetzirah core from CDN URL
- [ ] Demo loads Tachyons from CDN
- [ ] All Tier 1 components demonstrated and functional
- [ ] Page works when served from any static file server
- [ ] Total page weight < 50KB (excluding images)

---

### PR-130: Script Tag Auto-Registration

---
pr_id: PR-130
title: Script Tag Auto-Registration
cold_state: new
priority: medium
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Simple side-effect module ensuring custom elements register on load
dependencies: [PR-125]
estimated_files:
  - path: packages/core/src/cdn-entry.ts
    action: create
    description: CDN entry point with auto-registration
  - path: packages/core/cdn/core.js
    action: modify
    description: Ensure components self-register when loaded
---

**Description:**
Ensure CDN bundles automatically register custom elements when loaded via script tag. The bundle should be a side-effect module that defines all custom elements immediately, requiring no additional JavaScript from the user.

**Acceptance Criteria:**
- [ ] `<script type="module" src="core.js">` registers all elements
- [ ] No additional JS required to use components
- [ ] Individual component scripts also self-register
- [ ] Multiple script loads are idempotent (no duplicate registration errors)

---

## Dependency Block 3: Framework-less Patterns

These PRs document buildless framework usage.

### PR-131: Preact + HTM Documentation

---
pr_id: PR-131
title: Preact + HTM Documentation
cold_state: new
priority: medium
complexity:
  score: 4
  estimated_minutes: 40
  suggested_model: sonnet
  rationale: Requires testing Preact integration and documenting patterns
dependencies: [PR-129]
estimated_files:
  - path: demos/cdn/preact-htm.html
    action: create
    description: Demo using Preact + HTM with Yetzirah from CDN
  - path: docs/preact-htm.md
    action: create
    description: Guide for using Yetzirah with Preact + HTM (no build)
---

**Description:**
Document using Yetzirah with Preact and HTM (Hyperscript Tagged Markup) for a React-like DX without a build step. This pattern allows JSX-like syntax with tagged template literals, all loaded from CDN.

**Acceptance Criteria:**
- [ ] Working demo loading Preact, HTM, and Yetzirah from CDN
- [ ] Documentation covers component usage patterns
- [ ] Event handling examples (onClose, onChange, etc.)
- [ ] State management with Preact hooks demonstrated
- [ ] Comparison with full React wrapper approach

---

### PR-132: Vanilla JS Patterns Guide

---
pr_id: PR-132
title: Vanilla JS Patterns Guide
cold_state: new
priority: medium
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Documentation with code examples, minimal implementation
dependencies: [PR-129]
estimated_files:
  - path: docs/vanilla-patterns.md
    action: create
    description: Guide for vanilla JS usage patterns
  - path: demos/cdn/vanilla-app.html
    action: create
    description: Complete vanilla JS application example
---

**Description:**
Document idiomatic vanilla JavaScript patterns for using Yetzirah without any framework. Cover event handling, state management with custom events, DOM manipulation patterns, and building interactive applications with just HTML, CSS, and Yetzirah.

**Acceptance Criteria:**
- [ ] Common patterns documented (event delegation, state, etc.)
- [ ] Working demo of a multi-component application
- [ ] Patterns for form handling with Autocomplete/Select
- [ ] Dialog/Drawer coordination patterns
- [ ] Progressive enhancement examples

---

## Dependency Block 4: Performance & Testing

### PR-133: Performance Testing Suite

---
pr_id: PR-133
title: Performance Testing Suite
cold_state: new
priority: high
complexity:
  score: 5
  estimated_minutes: 45
  suggested_model: sonnet
  rationale: Setting up Lighthouse CI and network throttling tests
dependencies: [PR-129]
estimated_files:
  - path: scripts/perf-test.js
    action: create
    description: Performance testing script with Lighthouse
  - path: .github/workflows/perf.yml
    action: create
    description: CI workflow for performance regression testing
  - path: docs/performance.md
    action: create
    description: Performance benchmarks and methodology
---

**Description:**
Create performance testing infrastructure to verify CDN bundles meet the <3s load time target on 3G networks. Use Lighthouse CI for automated performance scoring and network throttling to simulate constrained environments.

**Acceptance Criteria:**
- [ ] Lighthouse CI configured for CDN demo page
- [ ] 3G throttling test achieves < 3s First Contentful Paint
- [ ] Bundle sizes tracked in CI (fail on regression)
- [ ] Performance report generated and documented

---

### PR-134: CDN Integration Tests

---
pr_id: PR-134
title: CDN Integration Tests
cold_state: new
priority: medium
complexity:
  score: 4
  estimated_minutes: 35
  suggested_model: sonnet
  rationale: E2E tests verifying CDN bundles work correctly
dependencies: [PR-129]
estimated_files:
  - path: tests/cdn/cdn.spec.ts
    action: create
    description: Playwright tests for CDN demo page
  - path: tests/cdn/importmap.spec.ts
    action: create
    description: Tests verifying import map functionality
---

**Description:**
Create integration tests that verify CDN bundles work correctly in a browser environment. Test component functionality, event handling, and interaction patterns using Playwright against the CDN demo page.

**Acceptance Criteria:**
- [ ] All Tier 1 components tested via CDN bundles
- [ ] Tests run against actual CDN demo page
- [ ] Import map resolution verified
- [ ] No console errors during component usage

---

## Dependency Block 5: Documentation & Finalization

### PR-135: CDN Hosting Guide

---
pr_id: PR-135
title: CDN Hosting Guide
cold_state: new
priority: low
complexity:
  score: 2
  estimated_minutes: 20
  suggested_model: haiku
  rationale: Documentation only, listing CDN options and setup
dependencies: [PR-127]
estimated_files:
  - path: docs/cdn-hosting.md
    action: create
    description: Guide for hosting Yetzirah on various CDNs
  - path: README.md
    action: modify
    description: Add CDN installation section
---

**Description:**
Document how to use Yetzirah from popular CDNs (jsDelivr, unpkg, esm.sh, Skypack) and how to self-host the CDN bundles. Include version pinning strategies and cache considerations.

**Acceptance Criteria:**
- [ ] jsDelivr, unpkg, esm.sh URLs documented
- [ ] Self-hosting instructions provided
- [ ] Version pinning best practices
- [ ] README updated with CDN installation option

---

### PR-136: Phase 3 Architecture Documentation

---
pr_id: PR-136
title: Phase 3 Architecture Documentation
cold_state: new
priority: low
complexity:
  score: 3
  estimated_minutes: 30
  suggested_model: haiku
  rationale: Final documentation summarizing CDN architecture decisions
dependencies: [PR-133, PR-134, PR-135]
estimated_files:
  - path: docs/architecture-phase3.md
    action: create
    description: CDN architecture decisions and rationale
  - path: CHANGELOG.md
    action: modify
    description: Document Phase 3 release
---

**Description:**
Document the architecture decisions made for Phase 3 CDN distribution. Cover build pipeline, bundle structure, performance optimizations, and lessons learned. This serves as onboarding documentation for future contributors.

**Acceptance Criteria:**
- [ ] Build pipeline architecture documented
- [ ] Bundle structure and size breakdown
- [ ] Performance optimization decisions explained
- [ ] Future improvement opportunities identified
- [ ] CHANGELOG updated for Phase 3 release

---

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
dependencies: [PR-136]
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
- [ ] All 5 packages published atomically (@grimoire/yetzirah-core, -react, -vue, -svelte, -angular)
- [ ] Packages installable via `npm install`, `pnpm add`, `bun add`, and `yarn add`
- [ ] Provenance attestation enabled for supply chain security
- [ ] CDN bundles automatically available on jsDelivr/unpkg after npm publish
- [ ] Version management script handles monorepo versioning
- [ ] Publishing guide documents the release process for maintainers

---

## Dependency Graph

```
PR-125 (CDN Build Config)
    ├── PR-126 (Individual Bundles)
    │       └── PR-127 (Size Optimization)
    │               ├── PR-129 (CDN Demo)
    │               │       ├── PR-131 (Preact+HTM)
    │               │       ├── PR-132 (Vanilla Patterns)
    │               │       ├── PR-133 (Perf Testing)
    │               │       └── PR-134 (Integration Tests)
    │               └── PR-135 (Hosting Guide)
    ├── PR-128 (Import Maps) ← depends on PR-126
    └── PR-130 (Auto-Registration)

PR-136 (Architecture Docs) ← depends on PR-133, PR-134, PR-135
    └── PR-137 (Registry Publication) ← final PR
```

## Parallel Execution Opportunities

After PR-125 completes:
- PR-128, PR-130 can run in parallel

After PR-127 completes:
- PR-129, PR-135 can run in parallel

After PR-129 completes:
- PR-131, PR-132, PR-133, PR-134 can all run in parallel

PR-137 runs last after all documentation is complete.

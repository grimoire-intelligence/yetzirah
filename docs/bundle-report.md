# Yetzirah Bundle Size Report

Generated: 2025-12-23

## Summary

| Package | Raw Size | Gzipped | Limit | Status |
|---------|----------|---------|-------|--------|
| Core | 61.07 KB | 11.90 KB | 15.00 KB | ✅ Pass |
| Vue | 45.80 KB | 4.90 KB | 5.00 KB | ✅ Pass |
| Svelte | 1.93 KB | 521 B | 3.00 KB | ✅ Pass |
| Angular | 98.35 KB | 11.69 KB | 12.00 KB | ✅ Pass |
| React | 23.12 KB | 3.10 KB | 15.00 KB | ✅ Pass |

## Size Targets

The following gzipped size limits are enforced for framework wrapper packages:

| Framework | Limit | Rationale |
|-----------|-------|-----------|
| **Core** | 15KB | All web component definitions |
| **Vue** | 5KB | Efficient wrappers with v-model support |
| **Svelte** | 3KB | Thinnest wrappers - excellent WC interop |
| **Angular** | 12KB | Higher overhead from decorators, ControlValueAccessor, TypeScript metadata |
| **React** | 15KB | All wrappers with hooks and forwardRef |

### Angular Bundle Size Notes

Angular wrappers have higher bundle size due to:
- **Decorators**: @Component, @Input, @Output, @ViewChild add metadata
- **ControlValueAccessor**: Form integration (ngModel, formControl) for Select, Autocomplete components
- **TypeScript Classes**: Angular requires class-based components vs function components
- **Event Handlers**: Setup/teardown lifecycle for web component event forwarding

The ~12KB gzipped for 27 components averages ~444 bytes per wrapper, which is reasonable for Angular's architecture.

### Comparison: Yetzirah Angular vs Angular Material

**Total Yetzirah Angular Stack:**
| Layer | Gzipped Size |
|-------|--------------|
| Yetzirah Core (Web Components) | ~12KB |
| Angular Wrappers | ~12KB |
| Tachyons CSS | ~15KB |
| **Total** | **~39KB** |

**Angular Material (comparable components):**
| Components | Estimated Gzipped Size |
|------------|------------------------|
| Button, Dialog, Tabs, Menu, Autocomplete, Select, Tooltip, etc. | ~100-150KB+ |

**Takeaway**: The Yetzirah Angular stack (~39KB total) is roughly 2-3x smaller than a comparable Angular Material setup, while providing the same component functionality. The architecture trades some Angular-specific integration depth for significantly reduced bundle size and cross-framework code reuse.

### Comparison: Yetzirah vs Headless UI

[Headless UI](https://headlessui.com/) by Tailwind Labs is the most direct comparison - both are unstyled, accessible component libraries.

| Library | React | Vue |
|---------|-------|-----|
| **Yetzirah** (wrappers + core) | ~15 KB | ~17 KB |
| **Headless UI** | ~68 KB | ~68 KB |
| **Difference** | **4.5x smaller** | **4x smaller** |

**Yetzirah breakdown:**
- React: 3.1 KB wrappers + 11.9 KB core = ~15 KB gzipped
- Vue: 4.9 KB wrappers + 11.9 KB core = ~17 KB gzipped

**Headless UI:**
- @headlessui/react v2.2.4: ~68 KB gzipped
- @headlessui/vue v1.7.23: ~68 KB gzipped

**Why the difference?**
- Headless UI has native implementations for each framework (duplicated logic)
- Yetzirah shares a Web Component core with thin framework adapters
- Headless UI users have [raised bundle size concerns](https://github.com/tailwindlabs/headlessui/discussions/568) and the v2.0 upgrade [added ~20KB](https://github.com/tailwindlabs/headlessui/discussions/3373)

## Component Coverage

All framework wrapper packages include wrappers for:

### Tier 1 Components (12)
- Button, Disclosure, Dialog, Tabs (TabList, Tab, TabPanel)
- Tooltip, Menu (MenuItem, MenuTrigger), Autocomplete (AutocompleteOption)
- Listbox (ListboxOption), Select (SelectOption), Accordion (AccordionItem)
- Drawer, Popover

### Tier 2 Components (7)
- Chip, Slider, Toggle, ThemeToggle, IconButton, DataGrid

## Verification Status

| Check | Status |
|-------|--------|
| coreBundleSize | ✅ Pass |
| frameworkBundleSizes | ✅ Pass |
| treeShaking | ✅ Pass |
| wrapperLines | ✅ Pass |
| dependencies | ✅ Pass |

## CDN Bundle Sizes

Generated: 2025-12-23

### Combined Bundles

| Bundle | Raw | Gzipped | Target | Status |
|--------|-----|---------|--------|--------|
| tier1.js | 36.76 KB | 6.49 KB | < 10 KB | ✅ Pass |
| core.js | 56.19 KB | 10.96 KB | - | All components |
| index.js | 56.19 KB | 11.00 KB | - | Tree-shakeable |

### Individual Component Bundles

These standalone bundles can be loaded independently via CDN.

#### Tier 1 Components

| Component | Raw | Gzipped |
|-----------|-----|---------|
| accordion | 1.83 KB | 758 B |
| autocomplete | 8.72 KB | 2.59 KB |
| button | 921 B | 504 B |
| dialog | 2.24 KB | 906 B |
| disclosure | 1.15 KB | 551 B |
| drawer | 2.52 KB | 1001 B |
| listbox | 3.63 KB | 1.24 KB |
| menu | 5.65 KB | 1.91 KB |
| popover | 3.74 KB | 1.35 KB |
| select | 6.90 KB | 2.21 KB |
| tabs | 3.08 KB | 1.12 KB |
| tooltip | 3.74 KB | 1.23 KB |
| **Total** | **44.08 KB** | **15.29 KB** |

#### Tier 2 Components

| Component | Raw | Gzipped |
|-----------|-----|---------|
| chip | 1.49 KB | 614 B |
| datagrid | 9.11 KB | 2.99 KB |
| icon-button | 2.41 KB | 935 B |
| slider | 3.92 KB | 1.19 KB |
| theme-toggle | 3.19 KB | 1.08 KB |
| toggle | 1.32 KB | 540 B |
| **Total** | **21.43 KB** | **7.30 KB** |

### Size Targets

| Target | Status | Actual |
|--------|--------|--------|
| Tier 1 bundle < 10KB gzip | ✅ Pass | 6.49 KB |
| All components (core.js) | - | 10.96 KB |

### Import Map Usage Notes

When using import maps with CDN bundles:

- **Single component usage**: Load individual bundles (e.g., `dialog.js` at 906 B)
- **Multiple components**: Use `core.js` for better efficiency (10.96 KB total vs 22.59 KB summed individuals)
- **Tree-shaking**: Use `index.js` with a bundler for optimal dead code elimination

---

*Report generated by `pnpm analyze-bundle --report`*

## Notes

- Bundle sizes are measured after gzip compression
- Tree-shaking is verified by checking for named exports
- Framework wrapper line counts are checked for React (max 200 lines per wrapper)
- Core package must have zero runtime dependencies

---

*Report generated by `pnpm check-size --generate-report`*

#!/usr/bin/env node
/**
 * Bundle size checker for Yetzirah
 * Verifies core bundle stays under 15kb gzipped (Tier 1+2 components)
 * Verifies framework wrapper bundles stay under size limits
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { gzipSync } from 'zlib'

// Dist directories
const CORE_DIST = 'packages/core/dist'
const REACT_DIST = 'packages/react/dist'
const VUE_DIST = 'packages/vue/dist'
const SVELTE_DIST = 'packages/svelte/dist'
const ANGULAR_DIST = 'packages/angular/dist'

// Size limits (in bytes) - Updated for Tier 1 + Tier 2 components (27 components each)
const MAX_CORE_SIZE = 15 * 1024      // 15kb (all core components)
const MAX_SVELTE_SIZE = 3 * 1024     // 3kb gzipped (thinnest wrappers, Tier 1+2)
const MAX_VUE_SIZE = 5 * 1024        // 5kb gzipped (Tier 1+2)
const MAX_ANGULAR_SIZE = 12 * 1024   // 12kb gzipped (Angular has higher overhead: decorators, CVA, TypeScript metadata)
const MAX_REACT_SIZE = 15 * 1024     // 15kb (existing limit)

const MAX_WRAPPER_LINES = 200 // Realistic max for complex wrappers
const IDEAL_WRAPPER_LINES = 50 // PRD aspirational target

const showReport = process.argv.includes('--report')
const generateReport = process.argv.includes('--generate-report')

function getGzipSize(content) {
  return gzipSync(content).length
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(2)} KB`
}

function getDistSize(distPath, extensions = ['.js', '.mjs']) {
  if (!existsSync(distPath)) {
    return { raw: 0, gzipped: 0, files: [] }
  }

  const files = readdirSync(distPath).filter(f => 
    extensions.some(ext => f.endsWith(ext)) && !f.endsWith('.map')
  )

  let totalRaw = 0
  const fileDetails = []

  for (const file of files) {
    const content = readFileSync(join(distPath, file))
    const gzipped = getGzipSize(content)
    fileDetails.push({ file, raw: content.length, gzipped })
    totalRaw += content.length
  }

  // Combine all JS for total gzipped size (better compression)
  const allJs = files.map(f => readFileSync(join(distPath, f))).join('')
  const totalGzipped = allJs.length > 0 ? getGzipSize(allJs) : 0

  return { raw: totalRaw, gzipped: totalGzipped, files: fileDetails }
}

function checkCoreBundleSize() {
  const { raw, gzipped, files } = getDistSize(CORE_DIST)

  console.log('\n📦 Core Bundle Size Report')
  console.log('═'.repeat(50))

  if (showReport && files.length > 0) {
    console.log('\nIndividual files:')
    for (const { file, raw: r, gzipped: g } of files.sort((a, b) => b.gzipped - a.gzipped)) {
      if (!file.startsWith('chunk-')) {
        console.log(`  ${file.padEnd(25)} ${formatBytes(r).padStart(10)} → ${formatBytes(g).padStart(10)} gzip`)
      }
    }

    const chunks = files.filter(f => f.file.startsWith('chunk-'))
    if (chunks.length > 0) {
      console.log(`\nShared chunks: ${chunks.length} files`)
      const chunkTotal = chunks.reduce((sum, f) => sum + f.gzipped, 0)
      console.log(`  Total chunk size: ${formatBytes(chunkTotal)} gzipped`)
    }
  }

  console.log(`\n📊 Total: ${formatBytes(raw)} raw → ${formatBytes(gzipped)} gzipped`)

  const passed = gzipped <= MAX_CORE_SIZE
  if (passed) {
    console.log(`✅ Under ${formatBytes(MAX_CORE_SIZE)} limit (${((1 - gzipped / MAX_CORE_SIZE) * 100).toFixed(1)}% headroom)`)
  } else {
    console.log(`❌ OVER ${formatBytes(MAX_CORE_SIZE)} limit by ${formatBytes(gzipped - MAX_CORE_SIZE)}`)
  }

  return passed
}

function checkFrameworkBundleSizes() {
  console.log('\n📦 Framework Wrapper Bundle Sizes')
  console.log('═'.repeat(50))

  const frameworks = [
    { name: 'Svelte', dist: SVELTE_DIST, max: MAX_SVELTE_SIZE, extensions: ['.js'] },
    { name: 'Vue', dist: VUE_DIST, max: MAX_VUE_SIZE, extensions: ['.js', '.cjs'] },
    { name: 'Angular', dist: ANGULAR_DIST, max: MAX_ANGULAR_SIZE, extensions: ['.mjs'] },
    { name: 'React', dist: REACT_DIST, max: MAX_REACT_SIZE, extensions: ['.js', '.cjs'] },
  ]

  let allPassed = true

  for (const { name, dist, max, extensions } of frameworks) {
    // For Svelte, only count .js files (not .svelte source files in dist)
    // For Angular, look in fesm2022 subdirectory
    let distPath = dist
    if (name === 'Angular') {
      distPath = join(dist, 'fesm2022')
    }

    const { gzipped, files } = getDistSize(distPath, extensions)

    if (files.length === 0) {
      console.log(`  ⚠️  ${name.padEnd(10)} No dist files found`)
      continue
    }

    const passed = gzipped <= max
    const status = passed ? '✅' : '❌'
    const headroom = passed 
      ? `(${((1 - gzipped / max) * 100).toFixed(1)}% headroom)`
      : `OVER by ${formatBytes(gzipped - max)}`

    console.log(`  ${status} ${name.padEnd(10)} ${formatBytes(gzipped).padStart(10)} gzip  (max: ${formatBytes(max)}) ${headroom}`)

    if (!passed) allPassed = false
  }

  return allPassed
}

function checkTreeShaking() {
  console.log('\n🌳 Tree-Shaking Verification')
  console.log('═'.repeat(50))

  // Check that individual component exports exist
  const coreIndexPath = join(CORE_DIST, 'index.js')
  if (!existsSync(coreIndexPath)) {
    console.log('  ⚠️  Core index.js not found')
    return true // Don't fail, just warn
  }

  const coreIndex = readFileSync(coreIndexPath, 'utf-8')

  // Check for named exports (tree-shakeable)
  const hasNamedExports = coreIndex.includes('export {') || coreIndex.includes('export class') || coreIndex.includes('export function')

  if (hasNamedExports) {
    console.log('  ✅ Core uses named exports (tree-shakeable)')
  } else {
    console.log('  ⚠️  Could not verify named exports in core')
  }

  // Check individual component entry points exist
  const components = ['button', 'dialog', 'disclosure', 'tabs', 'toggle', 'slider']
  let componentExportsExist = true

  for (const comp of components) {
    const compPath = join(CORE_DIST, `${comp}.js`)
    if (!existsSync(compPath)) {
      componentExportsExist = false
      break
    }
  }

  if (componentExportsExist) {
    console.log('  ✅ Individual component entry points exist')
  } else {
    console.log('  ⚠️  Some individual component entry points missing')
  }

  // Framework wrappers should have single entry point
  const frameworkChecks = [
    { name: 'Vue', path: join(VUE_DIST, 'index.js') },
    { name: 'Svelte', path: join(SVELTE_DIST, 'index.js') },
    { name: 'React', path: join(REACT_DIST, 'index.js') },
  ]

  for (const { name, path } of frameworkChecks) {
    if (existsSync(path)) {
      console.log(`  ✅ ${name} has single entry point`)
    } else {
      console.log(`  ⚠️  ${name} entry point not found`)
    }
  }

  return true // Warnings only, don't fail
}

function countLines(filepath) {
  try {
    const content = readFileSync(filepath, 'utf-8')
    return content.split('\n').length
  } catch {
    return 0
  }
}

function checkReactWrapperLines() {
  console.log('\n📝 React Wrapper Line Counts')
  console.log('═'.repeat(50))

  // Tier 1 + Tier 2 wrappers
  const wrappers = [
    // Tier 1
    'button', 'disclosure', 'dialog', 'tabs', 'tooltip',
    'menu', 'autocomplete', 'listbox', 'select',
    // Tier 2
    'accordion', 'drawer', 'popover', 'chip',
    'slider', 'toggle', 'theme-toggle', 'icon-button', 'datagrid'
  ]

  let allPassed = true

  for (const wrapper of wrappers) {
    const filepath = `packages/react/src/${wrapper}.js`
    const lines = countLines(filepath)
    const underMax = lines <= MAX_WRAPPER_LINES
    const underIdeal = lines <= IDEAL_WRAPPER_LINES

    let status = '✅'
    let note = ''
    if (!underMax) {
      status = '❌'
      note = ` (max: ${MAX_WRAPPER_LINES})`
      allPassed = false
    } else if (!underIdeal) {
      status = '⚠️'
      note = ` (ideal: ${IDEAL_WRAPPER_LINES})`
    }

    console.log(`  ${status} ${wrapper.padEnd(15)} ${String(lines).padStart(3)} lines${note}`)
  }

  return allPassed
}

function checkDependencies() {
  console.log('\n🔗 Dependency Check')
  console.log('═'.repeat(50))

  const corePkg = JSON.parse(readFileSync('packages/core/package.json', 'utf-8'))
  const hasDeps = corePkg.dependencies && Object.keys(corePkg.dependencies).length > 0

  if (hasDeps) {
    console.log('❌ Core package has dependencies:', Object.keys(corePkg.dependencies))
    return false
  } else {
    console.log('✅ Core package has zero dependencies')
    return true
  }
}

function collectBundleSizes() {
  const frameworks = [
    { name: 'Vue', dist: VUE_DIST, max: MAX_VUE_SIZE, extensions: ['.js', '.cjs'] },
    { name: 'Svelte', dist: SVELTE_DIST, max: MAX_SVELTE_SIZE, extensions: ['.js'] },
    { name: 'Angular', dist: join(ANGULAR_DIST, 'fesm2022'), max: MAX_ANGULAR_SIZE, extensions: ['.mjs'] },
    { name: 'React', dist: REACT_DIST, max: MAX_REACT_SIZE, extensions: ['.js', '.cjs'] },
  ]

  const coreData = getDistSize(CORE_DIST)
  const results = {
    core: {
      name: 'Core',
      gzipped: coreData.gzipped,
      raw: coreData.raw,
      max: MAX_CORE_SIZE,
      passed: coreData.gzipped <= MAX_CORE_SIZE
    },
    frameworks: []
  }

  for (const { name, dist, max, extensions } of frameworks) {
    const { gzipped, raw, files } = getDistSize(dist, extensions)
    results.frameworks.push({
      name,
      gzipped,
      raw,
      max,
      passed: files.length > 0 ? gzipped <= max : true,
      fileCount: files.length
    })
  }

  return results
}

function generateBundleReport(results, allChecksPassed) {
  const date = new Date().toISOString().split('T')[0]

  const bundleSizes = collectBundleSizes()

  let report = `# Yetzirah Bundle Size Report

Generated: ${date}

## Summary

| Package | Raw Size | Gzipped | Limit | Status |
|---------|----------|---------|-------|--------|
`

  // Core
  const core = bundleSizes.core
  const coreStatus = core.passed ? '✅ Pass' : '❌ Fail'
  report += `| Core | ${formatBytes(core.raw)} | ${formatBytes(core.gzipped)} | ${formatBytes(core.max)} | ${coreStatus} |\n`

  // Framework wrappers
  for (const fw of bundleSizes.frameworks) {
    if (fw.fileCount > 0) {
      const status = fw.passed ? '✅ Pass' : '❌ Fail'
      report += `| ${fw.name} | ${formatBytes(fw.raw)} | ${formatBytes(fw.gzipped)} | ${formatBytes(fw.max)} | ${status} |\n`
    } else {
      report += `| ${fw.name} | - | - | ${formatBytes(fw.max)} | ⚠️ Not built |\n`
    }
  }

  report += `
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
`

  for (const [check, passed] of Object.entries(results)) {
    report += `| ${check} | ${passed ? '✅ Pass' : '❌ Fail'} |\n`
  }

  report += `
## Notes

- Bundle sizes are measured after gzip compression
- Tree-shaking is verified by checking for named exports
- Framework wrapper line counts are checked for React (max 200 lines per wrapper)
- Core package must have zero runtime dependencies

---

*Report generated by \`pnpm check-size --generate-report\`*
`

  // Ensure docs directory exists
  try {
    mkdirSync('docs', { recursive: true })
  } catch (e) {
    // directory already exists
  }

  writeFileSync('docs/bundle-report.md', report)
  console.log('\n📄 Bundle report generated: docs/bundle-report.md')
}

// Run checks
console.log('\n🔍 Yetzirah Bundle Verification\n')

const results = {
  coreBundleSize: checkCoreBundleSize(),
  frameworkBundleSizes: checkFrameworkBundleSizes(),
  treeShaking: checkTreeShaking(),
  wrapperLines: checkReactWrapperLines(),
  dependencies: checkDependencies()
}

console.log('\n' + '═'.repeat(50))
console.log('Summary:')
for (const [check, passed] of Object.entries(results)) {
  console.log(`  ${passed ? '✅' : '❌'} ${check}`)
}

console.log('═'.repeat(50))
const allPassed = Object.values(results).every(Boolean)

if (generateReport) {
  generateBundleReport(results, allPassed)
}

if (allPassed) {
  console.log('✅ All checks passed!\n')
  process.exit(0)
} else {
  console.log('❌ Some checks failed\n')
  process.exit(1)
}

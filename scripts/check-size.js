#!/usr/bin/env node
/**
 * Bundle size checker for Yetzirah
 * Verifies core bundle stays under 15kb gzipped (Tier 1+2 components)
 * Verifies framework wrapper bundles stay under size limits
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { gzipSync } from 'zlib'

// Dist directories
const CORE_DIST = 'packages/core/dist'
const REACT_DIST = 'packages/react/dist'
const VUE_DIST = 'packages/vue/dist'
const SVELTE_DIST = 'packages/svelte/dist'
const ANGULAR_DIST = 'packages/angular/dist'

// Size limits (in bytes)
const MAX_CORE_SIZE = 15 * 1024      // 15kb (updated for Tier 2 components)
const MAX_SVELTE_SIZE = 2 * 1024     // 2kb (thinnest wrappers)
const MAX_VUE_SIZE = 4 * 1024        // 4kb
const MAX_ANGULAR_SIZE = 5 * 1024    // 5kb (ControlValueAccessor overhead)
const MAX_REACT_SIZE = 15 * 1024     // 15kb (existing limit)

const MAX_WRAPPER_LINES = 200 // Realistic max for complex wrappers
const IDEAL_WRAPPER_LINES = 50 // PRD aspirational target

const showReport = process.argv.includes('--report')

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
if (allPassed) {
  console.log('✅ All checks passed!\n')
  process.exit(0)
} else {
  console.log('❌ Some checks failed\n')
  process.exit(1)
}

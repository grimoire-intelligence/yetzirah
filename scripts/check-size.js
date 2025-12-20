#!/usr/bin/env node
/**
 * Bundle size checker for Yetzirah
 * Verifies core bundle stays under 15kb gzipped (Tier 1+2 components)
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { gzipSync } from 'zlib'

const CORE_DIST = 'packages/core/dist'
const REACT_DIST = 'packages/react/dist'
const MAX_CORE_SIZE = 15 * 1024 // 15kb (updated for Tier 2 components)
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

function checkCoreBundleSize() {
  const files = readdirSync(CORE_DIST).filter(f => f.endsWith('.js') && !f.endsWith('.map'))

  let totalSize = 0
  const sizes = {}

  for (const file of files) {
    const content = readFileSync(join(CORE_DIST, file))
    const gzipped = getGzipSize(content)
    sizes[file] = { raw: content.length, gzipped }
    totalSize += content.length
  }

  // Combine all JS for total gzipped size
  const allJs = files.map(f => readFileSync(join(CORE_DIST, f))).join('')
  const totalGzipped = getGzipSize(allJs)

  console.log('\n📦 Core Bundle Size Report')
  console.log('═'.repeat(50))

  if (showReport) {
    console.log('\nIndividual files:')
    for (const [file, size] of Object.entries(sizes).sort((a, b) => b[1].gzipped - a[1].gzipped)) {
      if (!file.startsWith('chunk-')) {
        console.log(`  ${file.padEnd(25)} ${formatBytes(size.raw).padStart(10)} → ${formatBytes(size.gzipped).padStart(10)} gzip`)
      }
    }

    const chunks = Object.entries(sizes).filter(([f]) => f.startsWith('chunk-'))
    if (chunks.length > 0) {
      console.log(`\nShared chunks: ${chunks.length} files`)
      const chunkTotal = chunks.reduce((sum, [, s]) => sum + s.gzipped, 0)
      console.log(`  Total chunk size: ${formatBytes(chunkTotal)} gzipped`)
    }
  }

  console.log(`\n📊 Total: ${formatBytes(totalSize)} raw → ${formatBytes(totalGzipped)} gzipped`)

  const passed = totalGzipped <= MAX_CORE_SIZE
  if (passed) {
    console.log(`✅ Under ${formatBytes(MAX_CORE_SIZE)} limit (${((1 - totalGzipped / MAX_CORE_SIZE) * 100).toFixed(1)}% headroom)`)
  } else {
    console.log(`❌ OVER ${formatBytes(MAX_CORE_SIZE)} limit by ${formatBytes(totalGzipped - MAX_CORE_SIZE)}`)
  }

  return passed
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
  bundleSize: checkCoreBundleSize(),
  wrapperLines: checkReactWrapperLines(),
  dependencies: checkDependencies()
}

console.log('\n' + '═'.repeat(50))
const allPassed = Object.values(results).every(Boolean)
if (allPassed) {
  console.log('✅ All checks passed!\n')
  process.exit(0)
} else {
  console.log('❌ Some checks failed\n')
  process.exit(1)
}

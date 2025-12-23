#!/usr/bin/env node
/**
 * CDN Bundle Analysis Script for Yetzirah
 * Analyzes bundle sizes and generates detailed reports
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join, basename } from 'path'
import { gzipSync } from 'zlib'

const CDN_DIR = 'packages/core/cdn'
const MAX_TIER1_GZIPPED = 10 * 1024  // 10KB target for Tier 1

// Component tier classification
const TIER_1_COMPONENTS = [
  'button', 'disclosure', 'dialog', 'tabs', 'tooltip',
  'menu', 'autocomplete', 'listbox', 'select',
  'accordion', 'drawer', 'popover'
]

const TIER_2_COMPONENTS = [
  'toggle', 'chip', 'icon-button', 'slider', 'datagrid', 'theme-toggle'
]

const showVerbose = process.argv.includes('--verbose')
const generateReport = process.argv.includes('--report')
const jsonOutput = process.argv.includes('--json')

function getGzipSize(content) {
  return gzipSync(content).length
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(2)} KB`
}

function getBundleInfo(filePath) {
  const content = readFileSync(filePath)
  return {
    raw: content.length,
    gzipped: getGzipSize(content)
  }
}

function analyzeCdnBundles() {
  if (!existsSync(CDN_DIR)) {
    console.error(`CDN directory not found: ${CDN_DIR}`)
    console.error('Run `pnpm build:cdn` first')
    process.exit(1)
  }

  const files = readdirSync(CDN_DIR)
    .filter(f => f.endsWith('.js') && !f.endsWith('.map'))

  const bundles = {}

  for (const file of files) {
    const name = basename(file, '.js')
    const info = getBundleInfo(join(CDN_DIR, file))
    bundles[name] = info
  }

  return bundles
}

function categorizeComponents(bundles) {
  const tier1 = {}
  const tier2 = {}
  const other = {}

  for (const [name, info] of Object.entries(bundles)) {
    if (TIER_1_COMPONENTS.includes(name)) {
      tier1[name] = info
    } else if (TIER_2_COMPONENTS.includes(name)) {
      tier2[name] = info
    } else {
      other[name] = info
    }
  }

  return { tier1, tier2, other }
}

function sumSizes(components, key = 'gzipped') {
  return Object.values(components).reduce((sum, c) => sum + c[key], 0)
}

function printReport(bundles) {
  const { tier1, tier2, other } = categorizeComponents(bundles)

  console.log('\n📦 CDN Bundle Size Analysis')
  console.log('═'.repeat(60))

  // Combined bundles
  console.log('\n📋 Combined Bundles:')
  if (bundles.tier1) {
    const status = bundles.tier1.gzipped <= MAX_TIER1_GZIPPED ? '✅' : '❌'
    console.log(`  tier1.js       ${formatBytes(bundles.tier1.raw).padStart(10)} → ${formatBytes(bundles.tier1.gzipped).padStart(10)} gzip ${status}`)
  }
  if (bundles.core) {
    console.log(`  core.js        ${formatBytes(bundles.core.raw).padStart(10)} → ${formatBytes(bundles.core.gzipped).padStart(10)} gzip (all components)`)
  }
  if (bundles.index) {
    console.log(`  index.js       ${formatBytes(bundles.index.raw).padStart(10)} → ${formatBytes(bundles.index.gzipped).padStart(10)} gzip (tree-shakeable)`)
  }

  // Tier 1 components
  console.log('\n📦 Tier 1 Components (12):')
  const tier1Sorted = Object.entries(tier1).sort((a, b) => a[1].gzipped - b[1].gzipped)
  for (const [name, info] of tier1Sorted) {
    console.log(`  ${(name + '.js').padEnd(20)} ${formatBytes(info.raw).padStart(10)} → ${formatBytes(info.gzipped).padStart(10)} gzip`)
  }
  const tier1Total = sumSizes(tier1)
  console.log(`  ${'─'.repeat(50)}`)
  console.log(`  ${'Sum (individual):'.padEnd(20)} ${formatBytes(sumSizes(tier1, 'raw')).padStart(10)} → ${formatBytes(tier1Total).padStart(10)} gzip`)

  // Tier 2 components
  console.log('\n📦 Tier 2 Components (6):')
  const tier2Sorted = Object.entries(tier2).sort((a, b) => a[1].gzipped - b[1].gzipped)
  for (const [name, info] of tier2Sorted) {
    console.log(`  ${(name + '.js').padEnd(20)} ${formatBytes(info.raw).padStart(10)} → ${formatBytes(info.gzipped).padStart(10)} gzip`)
  }
  const tier2Total = sumSizes(tier2)
  console.log(`  ${'─'.repeat(50)}`)
  console.log(`  ${'Sum (individual):'.padEnd(20)} ${formatBytes(sumSizes(tier2, 'raw')).padStart(10)} → ${formatBytes(tier2Total).padStart(10)} gzip`)

  // Summary
  console.log('\n📊 Summary:')
  console.log('═'.repeat(60))

  const coreGzip = bundles.core?.gzipped || 0

  console.log(`  Core bundle (all components):  ${formatBytes(coreGzip)} gzipped`)
  console.log(`  Tier 1 individual sum:         ${formatBytes(tier1Total)} gzipped`)
  console.log(`  Tier 2 individual sum:         ${formatBytes(tier2Total)} gzipped`)
  console.log(`  All individual sum:            ${formatBytes(tier1Total + tier2Total)} gzipped`)

  // Deduplication analysis
  console.log('\n🔗 Import Map Efficiency:')
  const individualTotal = tier1Total + tier2Total
  const coreSize = bundles.core?.gzipped || 0
  const overhead = individualTotal - coreSize
  const overheadPct = ((overhead / coreSize) * 100).toFixed(1)

  console.log(`  Individual bundles total:      ${formatBytes(individualTotal)}`)
  console.log(`  Core bundle total:             ${formatBytes(coreSize)}`)
  console.log(`  Overhead (duplication):        ${formatBytes(overhead)} (${overheadPct}%)`)
  console.log('')
  console.log('  Note: Individual bundles have utilities inlined.')
  console.log('  With import maps, the core bundle provides better efficiency.')

  // Check against targets
  console.log('\n✅ Size Targets:')
  const tier1BundleGzip = bundles.tier1?.gzipped || 0
  const tier1Pass = tier1BundleGzip <= MAX_TIER1_GZIPPED
  const status = tier1Pass ? '✅ PASS' : '❌ FAIL'
  console.log(`  Tier 1 bundle < 10KB: ${status} (${formatBytes(tier1BundleGzip)})`)

  return {
    passed: tier1Pass,
    bundles,
    tier1,
    tier2,
    summary: {
      tier1BundleGzipped: tier1BundleGzip,
      coreGzipped: coreGzip,
      tier1Total,
      tier2Total,
      individualTotal
    }
  }
}

function generateMarkdownReport(analysis) {
  const { bundles, tier1, tier2, summary } = analysis
  const date = new Date().toISOString().split('T')[0]

  let md = `## CDN Bundle Sizes

Generated: ${date}

### Combined Bundles

| Bundle | Raw | Gzipped | Target | Status |
|--------|-----|---------|--------|--------|
`

  if (bundles.tier1) {
    const tier1Status = bundles.tier1.gzipped <= MAX_TIER1_GZIPPED ? '✅ Pass' : '❌ Fail'
    md += `| tier1.js | ${formatBytes(bundles.tier1.raw)} | ${formatBytes(bundles.tier1.gzipped)} | < 10 KB | ${tier1Status} |\n`
  }
  if (bundles.core) {
    md += `| core.js | ${formatBytes(bundles.core.raw)} | ${formatBytes(bundles.core.gzipped)} | - | All components |\n`
  }
  if (bundles.index) {
    md += `| index.js | ${formatBytes(bundles.index.raw)} | ${formatBytes(bundles.index.gzipped)} | - | Tree-shakeable |\n`
  }

  md += `
### Individual Component Bundles

These standalone bundles can be loaded independently via CDN.

#### Tier 1 Components

| Component | Raw | Gzipped |
|-----------|-----|---------|
`

  const tier1Sorted = Object.entries(tier1).sort((a, b) => a[0].localeCompare(b[0]))
  for (const [name, info] of tier1Sorted) {
    md += `| ${name} | ${formatBytes(info.raw)} | ${formatBytes(info.gzipped)} |\n`
  }
  md += `| **Total** | **${formatBytes(sumSizes(tier1, 'raw'))}** | **${formatBytes(summary.tier1Total)}** |\n`

  md += `
#### Tier 2 Components

| Component | Raw | Gzipped |
|-----------|-----|---------|
`

  const tier2Sorted = Object.entries(tier2).sort((a, b) => a[0].localeCompare(b[0]))
  for (const [name, info] of tier2Sorted) {
    md += `| ${name} | ${formatBytes(info.raw)} | ${formatBytes(info.gzipped)} |\n`
  }
  md += `| **Total** | **${formatBytes(sumSizes(tier2, 'raw'))}** | **${formatBytes(summary.tier2Total)}** |\n`

  md += `
### Size Targets

| Target | Status | Actual |
|--------|--------|--------|
| Tier 1 bundle < 10KB gzip | ${summary.tier1BundleGzipped <= MAX_TIER1_GZIPPED ? '✅ Pass' : '❌ Fail'} | ${formatBytes(summary.tier1BundleGzipped)} |
| All components (core.js) | - | ${formatBytes(summary.coreGzipped)} |

### Import Map Usage Notes

When using import maps with CDN bundles:

- **Single component usage**: Load individual bundles (e.g., \`dialog.js\` at ${formatBytes(bundles.dialog?.gzipped || 0)})
- **Multiple components**: Use \`core.js\` for better efficiency (${formatBytes(summary.coreGzipped)} total vs ${formatBytes(summary.individualTotal)} summed individuals)
- **Tree-shaking**: Use \`index.js\` with a bundler for optimal dead code elimination

---

*Report generated by \`pnpm analyze-bundle --report\`*
`

  return md
}

function main() {
  const bundles = analyzeCdnBundles()

  if (jsonOutput) {
    console.log(JSON.stringify(bundles, null, 2))
    return
  }

  const analysis = printReport(bundles)

  if (generateReport) {
    const mdReport = generateMarkdownReport(analysis)

    // Append to bundle-report.md
    const reportPath = 'docs/bundle-report.md'
    try {
      mkdirSync('docs', { recursive: true })
    } catch (e) {
      // exists
    }

    // Read existing report and append CDN section
    let existingReport = ''
    if (existsSync(reportPath)) {
      existingReport = readFileSync(reportPath, 'utf-8')
      // Remove existing CDN section if present
      existingReport = existingReport.replace(/## CDN Bundle Sizes[\s\S]*?(?=\n## |$)/, '')
    }

    // Insert CDN section before Notes section or at end
    const insertPoint = existingReport.indexOf('## Notes')
    if (insertPoint !== -1) {
      existingReport = existingReport.slice(0, insertPoint) + mdReport + '\n' + existingReport.slice(insertPoint)
    } else {
      existingReport = existingReport.trim() + '\n\n' + mdReport
    }

    writeFileSync(reportPath, existingReport)
    console.log(`\n📄 CDN bundle report appended to: ${reportPath}`)
  }

  if (!analysis.passed) {
    console.log('\n❌ Size target check failed')
    process.exit(1)
  } else {
    console.log('\n✅ All size targets met')
  }
}

main()

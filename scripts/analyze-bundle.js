#!/usr/bin/env node
/**
 * CDN Bundle Analysis Script for Yetzirah
 * Analyzes bundle sizes and generates detailed reports
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join, basename } from 'path'
import { gzipSync } from 'zlib'

const CDN_DIR = 'packages/core/cdn'
const MAX_CORE_GZIPPED = 15 * 1024  // 15KB target for full bundle

// All components
const ALL_COMPONENTS = [
  'button', 'disclosure', 'dialog', 'tabs', 'tooltip',
  'menu', 'autocomplete', 'listbox', 'select',
  'accordion', 'drawer', 'popover',
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
  const components = {}
  const other = {}

  for (const [name, info] of Object.entries(bundles)) {
    if (ALL_COMPONENTS.includes(name)) {
      components[name] = info
    } else {
      other[name] = info
    }
  }

  return { components, other }
}

function sumSizes(components, key = 'gzipped') {
  return Object.values(components).reduce((sum, c) => sum + c[key], 0)
}

function printReport(bundles) {
  const { components, other } = categorizeComponents(bundles)

  console.log('\n📦 CDN Bundle Size Analysis')
  console.log('═'.repeat(60))

  // Combined bundles
  console.log('\n📋 Combined Bundles:')
  if (bundles.core) {
    const status = bundles.core.gzipped <= MAX_CORE_GZIPPED ? '✅' : '❌'
    console.log(`  core.js        ${formatBytes(bundles.core.raw).padStart(10)} → ${formatBytes(bundles.core.gzipped).padStart(10)} gzip ${status}`)
  }
  if (bundles.index) {
    console.log(`  index.js       ${formatBytes(bundles.index.raw).padStart(10)} → ${formatBytes(bundles.index.gzipped).padStart(10)} gzip (tree-shakeable)`)
  }
  if (bundles.auto) {
    console.log(`  auto.js        ${formatBytes(bundles.auto.raw).padStart(10)} → ${formatBytes(bundles.auto.gzipped).padStart(10)} gzip (auto-register)`)
  }

  // All components
  console.log(`\n📦 Components (${Object.keys(components).length}):`)
  const componentsSorted = Object.entries(components).sort((a, b) => a[1].gzipped - b[1].gzipped)
  for (const [name, info] of componentsSorted) {
    console.log(`  ${(name + '.js').padEnd(20)} ${formatBytes(info.raw).padStart(10)} → ${formatBytes(info.gzipped).padStart(10)} gzip`)
  }
  const componentsTotal = sumSizes(components)
  console.log(`  ${'─'.repeat(50)}`)
  console.log(`  ${'Sum (individual):'.padEnd(20)} ${formatBytes(sumSizes(components, 'raw')).padStart(10)} → ${formatBytes(componentsTotal).padStart(10)} gzip`)

  // Summary
  console.log('\n📊 Summary:')
  console.log('═'.repeat(60))

  const coreGzip = bundles.core?.gzipped || 0

  console.log(`  Core bundle (all components):  ${formatBytes(coreGzip)} gzipped`)
  console.log(`  Individual bundles sum:        ${formatBytes(componentsTotal)} gzipped`)

  // Deduplication analysis
  console.log('\n🔗 Import Map Efficiency:')
  const coreSize = bundles.core?.gzipped || 0
  const overhead = componentsTotal - coreSize
  const overheadPct = ((overhead / coreSize) * 100).toFixed(1)

  console.log(`  Individual bundles total:      ${formatBytes(componentsTotal)}`)
  console.log(`  Core bundle total:             ${formatBytes(coreSize)}`)
  console.log(`  Overhead (duplication):        ${formatBytes(overhead)} (${overheadPct}%)`)
  console.log('')
  console.log('  Note: Individual bundles have utilities inlined.')
  console.log('  With import maps, the core bundle provides better efficiency.')

  // Check against targets
  console.log('\n✅ Size Targets:')
  const corePass = coreGzip <= MAX_CORE_GZIPPED
  const status = corePass ? '✅ PASS' : '❌ FAIL'
  console.log(`  Core bundle < 15KB: ${status} (${formatBytes(coreGzip)})`)

  return {
    passed: corePass,
    bundles,
    components,
    summary: {
      coreGzipped: coreGzip,
      componentsTotal,
      individualTotal: componentsTotal
    }
  }
}

function generateMarkdownReport(analysis) {
  const { bundles, components, summary } = analysis
  const date = new Date().toISOString().split('T')[0]

  let md = `## CDN Bundle Sizes

Generated: ${date}

### Combined Bundles

| Bundle | Raw | Gzipped | Target | Status |
|--------|-----|---------|--------|--------|
`

  if (bundles.core) {
    const coreStatus = bundles.core.gzipped <= MAX_CORE_GZIPPED ? '✅ Pass' : '❌ Fail'
    md += `| core.js | ${formatBytes(bundles.core.raw)} | ${formatBytes(bundles.core.gzipped)} | < 15 KB | ${coreStatus} |\n`
  }
  if (bundles.index) {
    md += `| index.js | ${formatBytes(bundles.index.raw)} | ${formatBytes(bundles.index.gzipped)} | - | Tree-shakeable |\n`
  }
  if (bundles.auto) {
    md += `| auto.js | ${formatBytes(bundles.auto.raw)} | ${formatBytes(bundles.auto.gzipped)} | - | Auto-register |\n`
  }

  md += `
### Individual Component Bundles

These standalone bundles can be loaded independently via CDN.

| Component | Raw | Gzipped |
|-----------|-----|---------|
`

  const componentsSorted = Object.entries(components).sort((a, b) => a[0].localeCompare(b[0]))
  for (const [name, info] of componentsSorted) {
    md += `| ${name} | ${formatBytes(info.raw)} | ${formatBytes(info.gzipped)} |\n`
  }
  md += `| **Total** | **${formatBytes(sumSizes(components, 'raw'))}** | **${formatBytes(summary.componentsTotal)}** |\n`

  md += `
### Size Targets

| Target | Status | Actual |
|--------|--------|--------|
| Core bundle < 15KB gzip | ${summary.coreGzipped <= MAX_CORE_GZIPPED ? '✅ Pass' : '❌ Fail'} | ${formatBytes(summary.coreGzipped)} |

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

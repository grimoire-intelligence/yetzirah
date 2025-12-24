#!/usr/bin/env node
/**
 * Performance Testing Suite for Yetzirah
 *
 * Measures load performance, bundle sizes, and runtime metrics
 * for the CDN bundles under various network conditions.
 *
 * Usage:
 *   node scripts/perf-test.js [options]
 *
 * Options:
 *   --report     Generate markdown report
 *   --ci         CI mode (fail on regression)
 *   --baseline   Save current results as baseline
 *   --throttle   Test with network throttling (3G, 4G)
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { gzipSync } from 'zlib'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Configuration
const CDN_DIR = join(ROOT, 'packages/core/cdn')
const BASELINE_FILE = join(ROOT, '.perf-baseline.json')
const REPORT_FILE = join(ROOT, 'docs/perf-report.md')

// Performance budgets (in bytes, gzipped)
const BUDGETS = {
  'core.js': 15 * 1024,      // 15KB - full bundle
  'tier1.js': 10 * 1024,     // 10KB - tier 1 components
  'button.js': 1 * 1024,     // 1KB - individual component
  'dialog.js': 2 * 1024,     // 2KB
  'tabs.js': 2 * 1024,       // 2KB
  'autocomplete.js': 3 * 1024, // 3KB
  'select.js': 3 * 1024,     // 3KB
  'menu.js': 2 * 1024,       // 2KB
  'tooltip.js': 2 * 1024,    // 2KB
  'disclosure.js': 1 * 1024, // 1KB
  'accordion.js': 1.5 * 1024, // 1.5KB
  'drawer.js': 2 * 1024,     // 2KB
  'popover.js': 2 * 1024,    // 2KB
  'listbox.js': 2 * 1024,    // 2KB
  'toggle.js': 1 * 1024,     // 1KB
  'slider.js': 2 * 1024,     // 2KB
  'chip.js': 1 * 1024,       // 1KB
  'icon-button.js': 1 * 1024, // 1KB
  'theme-toggle.js': 1.5 * 1024, // 1.5KB
  'datagrid.js': 4 * 1024,   // 4KB
  'auto.js': 15 * 1024,      // 15KB - auto-registering bundle
}

// Network throttling profiles (simulated)
const NETWORK_PROFILES = {
  'fast-3g': {
    downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
    uploadThroughput: 750 * 1024 / 8,          // 750 Kbps
    latency: 400,                               // 400ms RTT
  },
  '4g': {
    downloadThroughput: 9 * 1024 * 1024 / 8,   // 9 Mbps
    uploadThroughput: 1.5 * 1024 * 1024 / 8,   // 1.5 Mbps
    latency: 170,                               // 170ms RTT
  },
  'broadband': {
    downloadThroughput: 25 * 1024 * 1024 / 8,  // 25 Mbps
    uploadThroughput: 5 * 1024 * 1024 / 8,     // 5 Mbps
    latency: 40,                                // 40ms RTT
  }
}

// CLI arguments
const args = process.argv.slice(2)
const generateReport = args.includes('--report')
const ciMode = args.includes('--ci')
const saveBaseline = args.includes('--baseline')
const testThrottle = args.includes('--throttle')

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(2)} KB`
}

function formatMs(ms) {
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function getGzipSize(content) {
  return gzipSync(content).length
}

function calculateLoadTime(sizeBytes, profile) {
  const { downloadThroughput, latency } = NETWORK_PROFILES[profile]
  // Time = latency + (size / throughput)
  const downloadTime = (sizeBytes / downloadThroughput) * 1000 // ms
  return latency + downloadTime
}

function measureBundleSizes() {
  console.log('\n📦 Bundle Size Analysis')
  console.log('═'.repeat(60))

  const results = {}
  const files = Object.keys(BUDGETS)

  for (const file of files) {
    const filePath = join(CDN_DIR, file)

    if (!existsSync(filePath)) {
      console.log(`  ⚠️  ${file.padEnd(20)} Not found`)
      results[file] = { raw: 0, gzipped: 0, budget: BUDGETS[file], exists: false }
      continue
    }

    const content = readFileSync(filePath)
    const raw = content.length
    const gzipped = getGzipSize(content)
    const budget = BUDGETS[file]
    const underBudget = gzipped <= budget
    const percentUsed = ((gzipped / budget) * 100).toFixed(1)

    const status = underBudget ? '✅' : '❌'
    const budgetInfo = underBudget
      ? `${percentUsed}% of budget`
      : `OVER by ${formatBytes(gzipped - budget)}`

    console.log(`  ${status} ${file.padEnd(20)} ${formatBytes(gzipped).padStart(10)} / ${formatBytes(budget).padStart(8)}  (${budgetInfo})`)

    results[file] = { raw, gzipped, budget, exists: true, underBudget }
  }

  return results
}

function measureNetworkPerformance(bundleSizes) {
  console.log('\n🌐 Estimated Load Times (Network Simulation)')
  console.log('═'.repeat(60))

  const results = {}
  const keyBundles = ['core.js', 'tier1.js', 'button.js', 'auto.js']

  for (const profile of Object.keys(NETWORK_PROFILES)) {
    console.log(`\n  ${profile.toUpperCase()}:`)
    results[profile] = {}

    for (const bundle of keyBundles) {
      const size = bundleSizes[bundle]?.gzipped || 0
      if (size === 0) continue

      const loadTime = calculateLoadTime(size, profile)
      results[profile][bundle] = loadTime

      // Performance thresholds
      let status = '✅'
      if (loadTime > 3000) status = '❌'
      else if (loadTime > 1000) status = '⚠️'

      console.log(`    ${status} ${bundle.padEnd(16)} ${formatMs(loadTime).padStart(10)}`)
    }
  }

  return results
}

function measureParseTime() {
  console.log('\n⚡ JavaScript Parse Time Estimation')
  console.log('═'.repeat(60))

  // Estimate parse time based on bundle size
  // Rule of thumb: ~1ms per KB of minified JS on average device
  // Mobile devices: ~2-3ms per KB

  const results = {}
  const bundles = ['core.js', 'tier1.js', 'auto.js']

  for (const bundle of bundles) {
    const filePath = join(CDN_DIR, bundle)
    if (!existsSync(filePath)) continue

    const content = readFileSync(filePath)
    const sizeKB = content.length / 1024

    const desktop = sizeKB * 0.5  // ~0.5ms per KB on fast desktop
    const mobile = sizeKB * 2     // ~2ms per KB on mobile

    results[bundle] = { desktop, mobile }

    console.log(`  ${bundle.padEnd(16)} Desktop: ${formatMs(desktop).padStart(8)} | Mobile: ${formatMs(mobile).padStart(8)}`)
  }

  return results
}

function compareWithBaseline(currentResults) {
  if (!existsSync(BASELINE_FILE)) {
    console.log('\n📊 No baseline found. Use --baseline to create one.')
    return null
  }

  const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf-8'))

  console.log('\n📈 Comparison with Baseline')
  console.log('═'.repeat(60))

  const regressions = []

  for (const [file, current] of Object.entries(currentResults.bundleSizes)) {
    const base = baseline.bundleSizes?.[file]
    if (!base || !current.exists) continue

    const diff = current.gzipped - base.gzipped
    const percentChange = ((diff / base.gzipped) * 100).toFixed(1)

    let status = '→'
    if (diff > 0) {
      status = '↑'
      if (diff > 500) { // More than 500 bytes increase
        regressions.push({ file, diff, percentChange })
      }
    } else if (diff < 0) {
      status = '↓'
    }

    const changeStr = diff === 0 ? 'no change' : `${diff > 0 ? '+' : ''}${formatBytes(diff)} (${percentChange}%)`
    console.log(`  ${status} ${file.padEnd(20)} ${changeStr}`)
  }

  return { baseline, regressions }
}

function generateMarkdownReport(results) {
  const date = new Date().toISOString().split('T')[0]

  let report = `# Yetzirah Performance Report

Generated: ${date}

## Bundle Sizes

| Bundle | Gzipped | Budget | Status |
|--------|---------|--------|--------|
`

  for (const [file, data] of Object.entries(results.bundleSizes)) {
    if (!data.exists) continue
    const status = data.underBudget ? '✅ Pass' : '❌ Over'
    report += `| ${file} | ${formatBytes(data.gzipped)} | ${formatBytes(data.budget)} | ${status} |\n`
  }

  report += `
## Network Performance (Estimated Load Times)

| Bundle | Fast 3G | 4G | Broadband |
|--------|---------|-----|-----------|
`

  for (const bundle of ['core.js', 'tier1.js', 'button.js', 'auto.js']) {
    const fast3g = results.networkPerf?.['fast-3g']?.[bundle]
    const lte = results.networkPerf?.['4g']?.[bundle]
    const broadband = results.networkPerf?.['broadband']?.[bundle]

    if (!fast3g) continue

    report += `| ${bundle} | ${formatMs(fast3g)} | ${formatMs(lte)} | ${formatMs(broadband)} |\n`
  }

  report += `
## Parse Time Estimation

| Bundle | Desktop | Mobile |
|--------|---------|--------|
`

  for (const [bundle, times] of Object.entries(results.parseTime || {})) {
    report += `| ${bundle} | ${formatMs(times.desktop)} | ${formatMs(times.mobile)} |\n`
  }

  report += `
## Performance Budgets

The following gzipped size budgets are enforced:

| Category | Budget | Rationale |
|----------|--------|-----------|
| Full bundle (core.js) | 15KB | All components, single request |
| Tier 1 bundle | 10KB | Most common components |
| Individual components | 1-4KB | Tree-shaking optimization |
| Auto-register bundle | 15KB | Convenience bundle with auto-registration |

## Network Simulation Profiles

| Profile | Download | Upload | Latency |
|---------|----------|--------|---------|
| Fast 3G | 1.5 Mbps | 750 Kbps | 400ms |
| 4G | 9 Mbps | 1.5 Mbps | 170ms |
| Broadband | 25 Mbps | 5 Mbps | 40ms |

## Notes

- Bundle sizes are measured after gzip compression
- Parse time is estimated based on bundle size
- Network performance is simulated, not measured in real browser
- For real Lighthouse metrics, run with Puppeteer (requires additional setup)

---

*Report generated by \`node scripts/perf-test.js --report\`*
`

  mkdirSync(dirname(REPORT_FILE), { recursive: true })
  writeFileSync(REPORT_FILE, report)
  console.log(`\n📄 Report generated: ${REPORT_FILE}`)
}

function saveBaselineResults(results) {
  writeFileSync(BASELINE_FILE, JSON.stringify(results, null, 2))
  console.log(`\n💾 Baseline saved: ${BASELINE_FILE}`)
}

// Main execution
console.log('\n🔍 Yetzirah Performance Testing Suite\n')

// Check if CDN build exists
if (!existsSync(CDN_DIR)) {
  console.error('❌ CDN build not found. Run `pnpm build:cdn` first.')
  process.exit(1)
}

const results = {
  timestamp: new Date().toISOString(),
  bundleSizes: measureBundleSizes(),
  networkPerf: null,
  parseTime: null,
}

if (testThrottle) {
  results.networkPerf = measureNetworkPerformance(results.bundleSizes)
}

results.parseTime = measureParseTime()

// Compare with baseline
let comparison = null
if (!saveBaseline) {
  comparison = compareWithBaseline(results)
}

// Summary
console.log('\n' + '═'.repeat(60))
console.log('Summary:')

const overBudget = Object.values(results.bundleSizes).filter(b => b.exists && !b.underBudget)
if (overBudget.length === 0) {
  console.log('  ✅ All bundles within budget')
} else {
  console.log(`  ❌ ${overBudget.length} bundle(s) over budget`)
}

if (comparison?.regressions?.length > 0) {
  console.log(`  ⚠️  ${comparison.regressions.length} regression(s) detected`)
  for (const reg of comparison.regressions) {
    console.log(`     - ${reg.file}: +${formatBytes(reg.diff)}`)
  }
}

console.log('═'.repeat(60))

// Generate report if requested
if (generateReport) {
  generateMarkdownReport(results)
}

// Save baseline if requested
if (saveBaseline) {
  saveBaselineResults(results)
}

// Exit with error in CI mode if issues found
if (ciMode) {
  if (overBudget.length > 0) {
    console.log('\n❌ CI check failed: bundles over budget')
    process.exit(1)
  }
  if (comparison?.regressions?.length > 0) {
    console.log('\n❌ CI check failed: performance regressions detected')
    process.exit(1)
  }
  console.log('\n✅ CI check passed')
}

process.exit(0)

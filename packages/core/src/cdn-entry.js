/**
 * CDN Entry Point with Auto-Registration
 *
 * This is the primary entry point for CDN usage via <script type="module">.
 * All components are automatically registered as custom elements when this
 * module is loaded - no additional JavaScript required.
 *
 * Usage:
 *   <script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/auto.js"></script>
 *
 * After loading, all ytz-* elements are available:
 *   <ytz-dialog>...</ytz-dialog>
 *   <ytz-button>...</ytz-button>
 *   etc.
 *
 * Features:
 * - Idempotent: Safe to load multiple times (no duplicate registration errors)
 * - Self-contained: All components bundled, no external dependencies
 * - Side-effect module: Registers elements on import
 *
 * @module @grimoire/yetzirah-core/cdn/auto
 */

// Import all components (triggers their registration via side effects)
import './accordion.js'
import './autocomplete.js'
import './badge.js'
import './button.js'
import './chip.js'
import './datagrid.js'
import './dialog.js'
import './disclosure.js'
import './drawer.js'
import './icon-button.js'
import './listbox.js'
import './menu.js'
import './popover.js'
import './progress.js'
import './select.js'
import './slider.js'
import './snackbar.js'
import './tabs.js'
import './theme-toggle.js'
import './toggle.js'
import './tooltip.js'

// Re-export everything for programmatic access
export * from './index.js'

/**
 * Verify all components are registered.
 * Useful for debugging registration issues.
 *
 * @returns {Object} Registration status for all components
 */
export function getRegistrationStatus() {
  const components = [
    'ytz-accordion',
    'ytz-accordion-item',
    'ytz-autocomplete',
    'ytz-badge',
    'ytz-button',
    'ytz-chip',
    'ytz-datagrid',
    'ytz-datagrid-column',
    'ytz-dialog',
    'ytz-disclosure',
    'ytz-drawer',
    'ytz-icon-button',
    'ytz-listbox',
    'ytz-menu',
    'ytz-menuitem',
    'ytz-option',
    'ytz-popover',
    'ytz-progress',
    'ytz-select',
    'ytz-slider',
    'ytz-snackbar',
    'ytz-tab',
    'ytz-tabpanel',
    'ytz-tabs',
    'ytz-theme-toggle',
    'ytz-toggle',
    'ytz-tooltip',
  ]

  const status = {}
  for (const name of components) {
    status[name] = customElements.get(name) !== undefined
  }
  return status
}

/**
 * Wait for all components to be defined.
 * Useful when components need to be ready before use.
 *
 * @returns {Promise<void>} Resolves when all components are defined
 */
export async function whenAllDefined() {
  const components = [
    'ytz-accordion',
    'ytz-accordion-item',
    'ytz-autocomplete',
    'ytz-badge',
    'ytz-button',
    'ytz-chip',
    'ytz-datagrid',
    'ytz-datagrid-column',
    'ytz-dialog',
    'ytz-disclosure',
    'ytz-drawer',
    'ytz-icon-button',
    'ytz-listbox',
    'ytz-menu',
    'ytz-menuitem',
    'ytz-option',
    'ytz-popover',
    'ytz-progress',
    'ytz-select',
    'ytz-slider',
    'ytz-snackbar',
    'ytz-tab',
    'ytz-tabpanel',
    'ytz-tabs',
    'ytz-theme-toggle',
    'ytz-toggle',
    'ytz-tooltip',
  ]

  await Promise.all(
    components.map(name => customElements.whenDefined(name))
  )
}

// Log registration on load (development aid, tree-shaken in production)
if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  console.log('[Yetzirah] Components auto-registered via CDN entry')
}

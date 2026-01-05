/**
 * @grimoire/yetzirah-alpine
 *
 * Alpine.js plugin for Yetzirah Web Components.
 * Provides directives and magics for Alpine.js integration.
 *
 * @packageDocumentation
 */

// Import and register core web components
import '@grimoire/yetzirah-core'
import { registerDirectives } from './directives'
import { registerModelDirective } from './model'
import { createYtzMagic, type YtzMagic, type SnackbarOptions } from './magics'

/**
 * Re-export VERSION from core
 */
export const VERSION = '0.1.0'

/**
 * Plugin options for configuring Yetzirah Alpine integration
 */
export interface YetzirahAlpineOptions {
  /** Prefix for component directives (default: 'ytz') */
  prefix?: string
}

// Re-export types from magics
export type { YtzMagic, SnackbarOptions }

/**
 * Alpine instance type - simplified for compatibility
 */
interface AlpineInstance {
  magic(name: string, callback: () => unknown): void
  directive(
    name: string,
    callback: (
      el: Element,
      directive: { expression: string; modifiers: string[] },
      utilities: {
        evaluate: (expr: string) => unknown
        effect: (fn: () => void) => void
        cleanup: (fn: () => void) => void
      }
    ) => void
  ): void
  evaluate(el: Element, expression: string): unknown
}

/**
 * Alpine.js plugin that integrates Yetzirah Web Components.
 *
 * This plugin:
 * 1. Registers Yetzirah web components for use in Alpine templates
 * 2. Provides the $ytz magic for programmatic component access
 * 3. Adds x-ytz-* directives for component-specific behaviors
 *
 * @param Alpine - Alpine.js instance
 * @param options - Plugin options
 *
 * @example
 * ```js
 * import Alpine from 'alpinejs'
 * import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
 *
 * Alpine.plugin(yetzirahPlugin)
 * Alpine.start()
 * ```
 *
 * @example
 * ```html
 * <div x-data="{ open: false }">
 *   <ytz-button @click="open = true">Open Dialog</ytz-button>
 *   <ytz-dialog x-ytz-dialog="open">
 *     <p>Dialog content</p>
 *   </ytz-dialog>
 * </div>
 * ```
 */
export function yetzirahPlugin(Alpine: AlpineInstance, options: YetzirahAlpineOptions = {}): void {
  const prefix = options.prefix ?? 'ytz'

  // Register all directives
  registerDirectives(Alpine, prefix)

  // Register x-ytz:model two-way binding directive
  registerModelDirective(Alpine, prefix)

  /**
   * $ytz magic - provides utilities for working with Yetzirah components
   */
  Alpine.magic(prefix, (): YtzMagic => createYtzMagic())
}

// Default export for convenient import
export default yetzirahPlugin

// Re-export directives registration for advanced use
export { registerDirectives } from './directives'
export { registerModelDirective } from './model'
export { createYtzMagic } from './magics'

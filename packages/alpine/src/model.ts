/**
 * x-ytz:model directive for two-way data binding
 *
 * Provides a unified two-way binding directive that auto-detects
 * the component type and syncs Alpine.js state accordingly.
 */

/**
 * Alpine instance type
 */
interface AlpineInstance {
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
 * Component binding configuration
 */
interface ComponentConfig {
  /** Attribute to sync */
  attr: string
  /** Key in CustomEvent detail */
  detailKey: string
  /** Events to listen for */
  events: string[]
  /** Whether the attribute is boolean (present/absent) */
  isBoolean?: boolean
}

/**
 * Create a debounced function
 */
function debounce(fn: (e: Event) => void, ms: number): (e: Event) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (e: Event) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(e), ms)
  }
}

/**
 * Get binding configuration for a component
 */
function getComponentConfig(tagName: string): ComponentConfig | undefined {
  const configs: Record<string, ComponentConfig> = {
    'ytz-slider': { attr: 'value', detailKey: 'value', events: ['change'] },
    'ytz-select': { attr: 'value', detailKey: 'value', events: ['change'] },
    'ytz-toggle': { attr: 'checked', detailKey: 'checked', events: ['change'], isBoolean: true },
    'ytz-autocomplete': { attr: 'value', detailKey: 'value', events: ['input', 'select'] },
    'ytz-listbox': { attr: 'value', detailKey: 'value', events: ['change'] },
    'ytz-dialog': { attr: 'open', detailKey: 'open', events: ['close'], isBoolean: true },
    'ytz-drawer': { attr: 'open', detailKey: 'open', events: ['close'], isBoolean: true },
    'ytz-disclosure': { attr: 'open', detailKey: 'open', events: ['toggle'], isBoolean: true },
    'ytz-popover': { attr: 'open', detailKey: 'open', events: ['toggle'], isBoolean: true },
    'ytz-accordion-item': { attr: 'open', detailKey: 'open', events: ['toggle'], isBoolean: true },
    'ytz-tabs': { attr: 'default-tab', detailKey: 'value', events: ['change'] },
    'ytz-progress': { attr: 'value', detailKey: 'value', events: [] },
    'ytz-badge': { attr: 'count', detailKey: 'count', events: [] },
    'ytz-snackbar': { attr: 'open', detailKey: 'open', events: ['close'], isBoolean: true },
    'ytz-menu': { attr: 'open', detailKey: 'open', events: ['close'], isBoolean: true },
  }
  return configs[tagName]
}

/**
 * Register the x-ytz:model directive with Alpine
 *
 * @param Alpine - Alpine.js instance
 * @param prefix - Directive prefix (default: 'ytz')
 *
 * @example
 * ```html
 * <!-- Slider value binding -->
 * <ytz-slider x-ytz:model="volume"></ytz-slider>
 *
 * <!-- Toggle binding -->
 * <ytz-toggle x-ytz:model="enabled"></ytz-toggle>
 *
 * <!-- With modifiers -->
 * <ytz-slider x-ytz:model.lazy="volume"></ytz-slider>
 * <ytz-autocomplete x-ytz:model.trim="query"></ytz-autocomplete>
 * ```
 */
export function registerModelDirective(Alpine: AlpineInstance, prefix: string): void {
  Alpine.directive(`${prefix}:model`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const tagName = el.tagName.toLowerCase()
    const config = getComponentConfig(tagName)

    if (!config) {
      console.warn(`[ytz:model] Unsupported component: ${tagName}`)
      return
    }

    const isLazy = modifiers.includes('lazy')
    const isNumber = modifiers.includes('number')
    const isTrim = modifiers.includes('trim')

    // Sync Alpine data → component attribute
    effect(() => {
      const value = evaluate(expression)
      if (value === undefined) return

      if (config.isBoolean) {
        if (value) {
          el.setAttribute(config.attr, '')
        } else {
          el.removeAttribute(config.attr)
        }
      } else {
        el.setAttribute(config.attr, String(value))
      }
    })

    // Skip event binding if component doesn't emit events
    if (config.events.length === 0) return

    // Sync component events → Alpine data
    const updateValue = (e: Event) => {
      const customEvent = e as CustomEvent
      let value = customEvent.detail?.[config.detailKey]

      // Handle close events which set value to false
      if (config.isBoolean && (e.type === 'close')) {
        value = false
      }

      // Apply modifiers
      if (isNumber && value !== undefined) {
        value = Number(value)
      }
      if (isTrim && typeof value === 'string') {
        value = value.trim()
      }

      // Update Alpine state
      if (config.isBoolean) {
        Alpine.evaluate(el, `${expression} = ${Boolean(value)}`)
      } else if (typeof value === 'string') {
        Alpine.evaluate(el, `${expression} = '${value.replace(/'/g, "\\'")}'`)
      } else {
        Alpine.evaluate(el, `${expression} = ${JSON.stringify(value)}`)
      }
    }

    const handler = isLazy ? debounce(updateValue, 150) : updateValue

    // Attach event listeners
    for (const event of config.events) {
      el.addEventListener(event, handler)
    }

    // Cleanup on destroy
    cleanup(() => {
      for (const event of config.events) {
        el.removeEventListener(event, handler)
      }
    })
  })
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { registerModelDirective } from '../model'

/**
 * Mock Alpine instance for testing the model directive
 */
interface DirectiveCallback {
  (
    el: Element,
    directive: { expression: string; modifiers: string[] },
    utilities: {
      evaluate: (expr: string) => unknown
      effect: (fn: () => void) => void
      cleanup: (fn: () => void) => void
    }
  ): void
}

function createMockAlpine() {
  const directives = new Map<string, DirectiveCallback>()
  let evaluateResult: unknown = undefined

  return {
    directives,
    setEvaluateResult(value: unknown) {
      evaluateResult = value
    },
    directive(name: string, callback: DirectiveCallback) {
      directives.set(name, callback)
    },
    evaluate: vi.fn(() => evaluateResult),
    getDirective(name: string) {
      return directives.get(name)
    },
  }
}

/**
 * Helper to invoke the model directive with mock utilities
 */
function invokeModelDirective(
  Alpine: ReturnType<typeof createMockAlpine>,
  directiveName: string,
  el: Element,
  expression: string,
  modifiers: string[] = []
) {
  const directive = Alpine.getDirective(directiveName)
  if (!directive) throw new Error(`Directive ${directiveName} not found`)

  const cleanupFns: Array<() => void> = []
  const effectFns: Array<() => void> = []

  const utilities = {
    evaluate: (expr: string) => Alpine.evaluate(el, expr),
    effect: (fn: () => void) => {
      effectFns.push(fn)
      fn() // Run immediately like Alpine does
    },
    cleanup: (fn: () => void) => cleanupFns.push(fn),
  }

  directive(el, { expression, modifiers }, utilities)

  return {
    cleanupFns,
    effectFns,
    runEffects: () => effectFns.forEach(fn => fn()),
    runCleanup: () => cleanupFns.forEach(fn => fn()),
  }
}

describe('x-ytz:model Directive', () => {
  let Alpine: ReturnType<typeof createMockAlpine>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    Alpine = createMockAlpine()
    registerModelDirective(Alpine as never, 'ytz')
    document.body.innerHTML = ''
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    document.body.innerHTML = ''
    consoleWarnSpy.mockRestore()
  })

  describe('component detection', () => {
    it('auto-detects ytz-slider and binds value attribute', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(50)

      invokeModelDirective(Alpine, 'ytz:model', el, 'volume')

      expect(el.getAttribute('value')).toBe('50')
    })

    it('auto-detects ytz-toggle and binds checked attribute', () => {
      const el = document.createElement('ytz-toggle')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'enabled')

      expect(el.hasAttribute('checked')).toBe(true)
    })

    it('auto-detects ytz-toggle and removes checked when false', () => {
      const el = document.createElement('ytz-toggle')
      el.setAttribute('checked', '')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(false)

      invokeModelDirective(Alpine, 'ytz:model', el, 'enabled')

      expect(el.hasAttribute('checked')).toBe(false)
    })

    it('auto-detects ytz-dialog and binds open attribute', () => {
      const el = document.createElement('ytz-dialog')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'isOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('auto-detects ytz-drawer and binds open attribute', () => {
      const el = document.createElement('ytz-drawer')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'drawerOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('auto-detects ytz-select and binds value attribute', () => {
      const el = document.createElement('ytz-select')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('option-1')

      invokeModelDirective(Alpine, 'ytz:model', el, 'selected')

      expect(el.getAttribute('value')).toBe('option-1')
    })

    it('auto-detects ytz-autocomplete and binds value attribute', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('search query')

      invokeModelDirective(Alpine, 'ytz:model', el, 'query')

      expect(el.getAttribute('value')).toBe('search query')
    })

    it('auto-detects ytz-listbox and binds value attribute', () => {
      const el = document.createElement('ytz-listbox')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('item-2')

      invokeModelDirective(Alpine, 'ytz:model', el, 'selectedItem')

      expect(el.getAttribute('value')).toBe('item-2')
    })

    it('auto-detects ytz-disclosure and binds open attribute', () => {
      const el = document.createElement('ytz-disclosure')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'expanded')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('auto-detects ytz-popover and binds open attribute', () => {
      const el = document.createElement('ytz-popover')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'popoverOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('auto-detects ytz-accordion-item and binds open attribute', () => {
      const el = document.createElement('ytz-accordion-item')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'itemOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('auto-detects ytz-tabs and binds default-tab attribute', () => {
      const el = document.createElement('ytz-tabs')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('tab-2')

      invokeModelDirective(Alpine, 'ytz:model', el, 'activeTab')

      expect(el.getAttribute('default-tab')).toBe('tab-2')
    })

    it('auto-detects ytz-progress and binds value attribute', () => {
      const el = document.createElement('ytz-progress')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(75)

      invokeModelDirective(Alpine, 'ytz:model', el, 'progress')

      expect(el.getAttribute('value')).toBe('75')
    })

    it('auto-detects ytz-badge and binds count attribute', () => {
      const el = document.createElement('ytz-badge')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(5)

      invokeModelDirective(Alpine, 'ytz:model', el, 'notificationCount')

      expect(el.getAttribute('count')).toBe('5')
    })

    it('auto-detects ytz-snackbar and binds open attribute', () => {
      const el = document.createElement('ytz-snackbar')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'showSnackbar')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('auto-detects ytz-menu and binds open attribute', () => {
      const el = document.createElement('ytz-menu')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'menuOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })
  })

  describe('event handling', () => {
    it('updates Alpine state on ytz-slider change event', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeModelDirective(Alpine, 'ytz:model', el, 'volume')

      el.dispatchEvent(new CustomEvent('change', { detail: { value: 75 } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'volume = 75')
    })

    it('updates Alpine state on ytz-toggle change event', () => {
      const el = document.createElement('ytz-toggle')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(false)

      invokeModelDirective(Alpine, 'ytz:model', el, 'enabled')

      el.dispatchEvent(new CustomEvent('change', { detail: { checked: true } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'enabled = true')
    })

    it('updates Alpine state on ytz-dialog close event', () => {
      const el = document.createElement('ytz-dialog')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'isOpen')

      el.dispatchEvent(new Event('close'))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'isOpen = false')
    })

    it('updates Alpine state on ytz-drawer close event', () => {
      const el = document.createElement('ytz-drawer')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeModelDirective(Alpine, 'ytz:model', el, 'drawerOpen')

      el.dispatchEvent(new Event('close'))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'drawerOpen = false')
    })

    it('updates Alpine state on ytz-select change event', () => {
      const el = document.createElement('ytz-select')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeModelDirective(Alpine, 'ytz:model', el, 'selected')

      el.dispatchEvent(new CustomEvent('change', { detail: { value: 'option-2' } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "selected = 'option-2'")
    })

    it('updates Alpine state on ytz-autocomplete input event', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeModelDirective(Alpine, 'ytz:model', el, 'query')

      el.dispatchEvent(new CustomEvent('input', { detail: { value: 'new query' } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "query = 'new query'")
    })

    it('updates Alpine state on ytz-autocomplete select event', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeModelDirective(Alpine, 'ytz:model', el, 'query')

      el.dispatchEvent(new CustomEvent('select', { detail: { value: 'selected item' } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "query = 'selected item'")
    })

    it('updates Alpine state on ytz-disclosure toggle event', () => {
      const el = document.createElement('ytz-disclosure')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(false)

      invokeModelDirective(Alpine, 'ytz:model', el, 'expanded')

      el.dispatchEvent(new CustomEvent('toggle', { detail: { open: true } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'expanded = true')
    })

    it('updates Alpine state on ytz-tabs change event', () => {
      const el = document.createElement('ytz-tabs')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('tab-1')

      invokeModelDirective(Alpine, 'ytz:model', el, 'activeTab')

      el.dispatchEvent(new CustomEvent('change', { detail: { value: 'tab-3' } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "activeTab = 'tab-3'")
    })

    it('does not add event listeners for ytz-progress (read-only)', () => {
      const el = document.createElement('ytz-progress')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(50)

      const { cleanupFns } = invokeModelDirective(Alpine, 'ytz:model', el, 'progress')

      // Progress has no events, so no cleanup needed
      expect(cleanupFns.length).toBe(0)
    })

    it('does not add event listeners for ytz-badge (read-only)', () => {
      const el = document.createElement('ytz-badge')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(5)

      const { cleanupFns } = invokeModelDirective(Alpine, 'ytz:model', el, 'count')

      expect(cleanupFns.length).toBe(0)
    })
  })

  describe('modifiers', () => {
    it('.lazy debounces updates on ytz-slider', async () => {
      vi.useFakeTimers()
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeModelDirective(Alpine, 'ytz:model', el, 'volume', ['lazy'])

      el.dispatchEvent(new CustomEvent('change', { detail: { value: 25 } }))
      el.dispatchEvent(new CustomEvent('change', { detail: { value: 50 } }))
      el.dispatchEvent(new CustomEvent('change', { detail: { value: 75 } }))

      // Should not have been called yet (debounced)
      expect(Alpine.evaluate).toHaveBeenCalledTimes(1) // Initial effect

      vi.advanceTimersByTime(200)

      // Only the last value should be set
      expect(Alpine.evaluate).toHaveBeenLastCalledWith(el, 'volume = 75')

      vi.useRealTimers()
    })

    it('.number coerces to number', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeModelDirective(Alpine, 'ytz:model', el, 'volume', ['number'])

      el.dispatchEvent(new CustomEvent('change', { detail: { value: '50' } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'volume = 50')
    })

    it('.trim trims string values', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeModelDirective(Alpine, 'ytz:model', el, 'query', ['trim'])

      el.dispatchEvent(new CustomEvent('input', { detail: { value: '  hello world  ' } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "query = 'hello world'")
    })

    it('.lazy and .number can be combined', async () => {
      vi.useFakeTimers()
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeModelDirective(Alpine, 'ytz:model', el, 'volume', ['lazy', 'number'])

      el.dispatchEvent(new CustomEvent('change', { detail: { value: '100' } }))

      vi.advanceTimersByTime(200)

      expect(Alpine.evaluate).toHaveBeenLastCalledWith(el, 'volume = 100')

      vi.useRealTimers()
    })

    it('.trim only applies to string values', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeModelDirective(Alpine, 'ytz:model', el, 'volume', ['trim'])

      // Numeric value should not be affected by trim
      el.dispatchEvent(new CustomEvent('change', { detail: { value: 50 } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'volume = 50')
    })
  })

  describe('error handling', () => {
    it('warns on unsupported component', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('test')

      invokeModelDirective(Alpine, 'ytz:model', el, 'value')

      expect(consoleWarnSpy).toHaveBeenCalledWith('[ytz:model] Unsupported component: div')
    })

    it('warns on unknown ytz component', () => {
      const el = document.createElement('ytz-unknown')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('test')

      invokeModelDirective(Alpine, 'ytz:model', el, 'value')

      expect(consoleWarnSpy).toHaveBeenCalledWith('[ytz:model] Unsupported component: ytz-unknown')
    })

    it('does not bind when value is undefined', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(undefined)

      invokeModelDirective(Alpine, 'ytz:model', el, 'volume')

      expect(el.hasAttribute('value')).toBe(false)
    })
  })

  describe('cleanup', () => {
    it('removes event listeners on cleanup', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      const { runCleanup } = invokeModelDirective(Alpine, 'ytz:model', el, 'volume')
      runCleanup()

      Alpine.evaluate.mockClear()
      el.dispatchEvent(new CustomEvent('change', { detail: { value: 75 } }))
      expect(Alpine.evaluate).not.toHaveBeenCalled()
    })

    it('removes all event listeners for multi-event components', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      const { runCleanup } = invokeModelDirective(Alpine, 'ytz:model', el, 'query')
      runCleanup()

      Alpine.evaluate.mockClear()
      el.dispatchEvent(new CustomEvent('input', { detail: { value: 'test' } }))
      el.dispatchEvent(new CustomEvent('select', { detail: { value: 'test' } }))
      expect(Alpine.evaluate).not.toHaveBeenCalled()
    })
  })

  describe('special value handling', () => {
    it('escapes single quotes in string values', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeModelDirective(Alpine, 'ytz:model', el, 'query')

      el.dispatchEvent(new CustomEvent('input', { detail: { value: "it's a test" } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "query = 'it\\'s a test'")
    })

    it('handles JSON values for non-string/non-boolean types', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeModelDirective(Alpine, 'ytz:model', el, 'value')

      // Numeric values get JSON.stringify'd
      el.dispatchEvent(new CustomEvent('change', { detail: { value: 42.5 } }))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'value = 42.5')
    })
  })

  describe('custom prefix support', () => {
    it('registers with custom prefix', () => {
      const CustomAlpine = createMockAlpine()
      registerModelDirective(CustomAlpine as never, 'custom')

      expect(CustomAlpine.directives.has('custom:model')).toBe(true)
      expect(CustomAlpine.directives.has('ytz:model')).toBe(false)
    })
  })
})

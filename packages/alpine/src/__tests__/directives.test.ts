import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { registerDirectives } from '../directives'

/**
 * Mock Alpine instance for testing directives
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
 * Helper to invoke a directive with mock utilities
 */
function invokeDirective(
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

describe('Alpine Directive Integration Tests', () => {
  let Alpine: ReturnType<typeof createMockAlpine>

  beforeEach(() => {
    Alpine = createMockAlpine()
    registerDirectives(Alpine as never, 'ytz')
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('x-ytz-dialog', () => {
    it('syncs open attribute from Alpine state when true', () => {
      const el = document.createElement('ytz-dialog')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-dialog', el, 'isOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('removes open attribute when state is false', () => {
      const el = document.createElement('ytz-dialog')
      el.setAttribute('open', '')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(false)

      invokeDirective(Alpine, 'ytz-dialog', el, 'isOpen')

      expect(el.hasAttribute('open')).toBe(false)
    })

    it('updates Alpine state on close event', () => {
      const el = document.createElement('ytz-dialog')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-dialog', el, 'isOpen')
      el.dispatchEvent(new Event('close'))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'isOpen = false')
    })

    it('supports .once modifier (no reactive updates)', () => {
      const el = document.createElement('ytz-dialog')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      const { effectFns } = invokeDirective(Alpine, 'ytz-dialog', el, 'isOpen', ['once'])

      // With .once, effect should not be called (immediate evaluation instead)
      expect(effectFns.length).toBe(0)
      expect(el.hasAttribute('open')).toBe(true)
    })

    it('cleans up event listener on destroy', () => {
      const el = document.createElement('ytz-dialog')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      const { runCleanup } = invokeDirective(Alpine, 'ytz-dialog', el, 'isOpen')
      runCleanup()

      // After cleanup, close event should not update state
      Alpine.evaluate.mockClear()
      el.dispatchEvent(new Event('close'))
      expect(Alpine.evaluate).not.toHaveBeenCalled()
    })
  })

  describe('x-ytz-drawer', () => {
    it('syncs open attribute from Alpine state', () => {
      const el = document.createElement('ytz-drawer')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-drawer', el, 'drawerOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('updates Alpine state on close event', () => {
      const el = document.createElement('ytz-drawer')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-drawer', el, 'drawerOpen')
      el.dispatchEvent(new Event('close'))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'drawerOpen = false')
    })

    it('supports .once modifier', () => {
      const el = document.createElement('ytz-drawer')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      const { effectFns } = invokeDirective(Alpine, 'ytz-drawer', el, 'drawerOpen', ['once'])

      expect(effectFns.length).toBe(0)
      expect(el.hasAttribute('open')).toBe(true)
    })
  })

  describe('x-ytz-tabs', () => {
    it('syncs default-tab attribute from Alpine state', () => {
      const el = document.createElement('ytz-tabs')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('tab-2')

      invokeDirective(Alpine, 'ytz-tabs', el, 'activeTab')

      expect(el.getAttribute('default-tab')).toBe('tab-2')
    })

    it('updates Alpine state on change event', () => {
      const el = document.createElement('ytz-tabs')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('tab-1')

      invokeDirective(Alpine, 'ytz-tabs', el, 'activeTab')

      const changeEvent = new CustomEvent('change', { detail: { value: 'tab-3' } })
      el.dispatchEvent(changeEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "activeTab = 'tab-3'")
    })

    it('supports .once modifier', () => {
      const el = document.createElement('ytz-tabs')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('tab-1')

      const { effectFns } = invokeDirective(Alpine, 'ytz-tabs', el, 'activeTab', ['once'])

      expect(effectFns.length).toBe(0)
      expect(el.getAttribute('default-tab')).toBe('tab-1')
    })
  })

  describe('x-ytz-toggle', () => {
    it('syncs checked attribute from Alpine state when true', () => {
      const el = document.createElement('ytz-toggle')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-toggle', el, 'enabled')

      expect(el.hasAttribute('checked')).toBe(true)
    })

    it('removes checked attribute when state is false', () => {
      const el = document.createElement('ytz-toggle')
      el.setAttribute('checked', '')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(false)

      invokeDirective(Alpine, 'ytz-toggle', el, 'enabled')

      expect(el.hasAttribute('checked')).toBe(false)
    })

    it('updates Alpine state on change event', () => {
      const el = document.createElement('ytz-toggle')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(false)

      invokeDirective(Alpine, 'ytz-toggle', el, 'enabled')

      const changeEvent = new CustomEvent('change', { detail: { checked: true } })
      el.dispatchEvent(changeEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'enabled = true')
    })

    it('supports .once modifier', () => {
      const el = document.createElement('ytz-toggle')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      const { effectFns } = invokeDirective(Alpine, 'ytz-toggle', el, 'enabled', ['once'])

      expect(effectFns.length).toBe(0)
      expect(el.hasAttribute('checked')).toBe(true)
    })
  })

  describe('x-ytz-slider', () => {
    it('syncs value attribute from Alpine state', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(50)

      invokeDirective(Alpine, 'ytz-slider', el, 'volume')

      expect(el.getAttribute('value')).toBe('50')
    })

    it('updates Alpine state on change event', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeDirective(Alpine, 'ytz-slider', el, 'volume')

      const changeEvent = new CustomEvent('change', { detail: { value: 75 } })
      el.dispatchEvent(changeEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'volume = 75')
    })

    it('supports .number modifier', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeDirective(Alpine, 'ytz-slider', el, 'volume', ['number'])

      const changeEvent = new CustomEvent('change', { detail: { value: '50' } })
      el.dispatchEvent(changeEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'volume = 50')
    })

    it('supports .lazy modifier (debounced)', async () => {
      vi.useFakeTimers()
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(0)

      invokeDirective(Alpine, 'ytz-slider', el, 'volume', ['lazy'])

      // Fire multiple change events rapidly
      el.dispatchEvent(new CustomEvent('change', { detail: { value: 25 } }))
      el.dispatchEvent(new CustomEvent('change', { detail: { value: 50 } }))
      el.dispatchEvent(new CustomEvent('change', { detail: { value: 75 } }))

      // None should be called yet (debounced)
      expect(Alpine.evaluate).toHaveBeenCalledTimes(1) // Initial effect call

      // Advance past debounce delay
      vi.advanceTimersByTime(200)

      // Only the last value should be set
      expect(Alpine.evaluate).toHaveBeenLastCalledWith(el, 'volume = 75')

      vi.useRealTimers()
    })

    it('supports .once modifier', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(50)

      const { effectFns } = invokeDirective(Alpine, 'ytz-slider', el, 'volume', ['once'])

      expect(effectFns.length).toBe(0)
      expect(el.getAttribute('value')).toBe('50')
    })
  })

  describe('x-ytz-select', () => {
    it('syncs value attribute from Alpine state', () => {
      const el = document.createElement('ytz-select')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('option-2')

      invokeDirective(Alpine, 'ytz-select', el, 'selected')

      expect(el.getAttribute('value')).toBe('option-2')
    })

    it('updates Alpine state on change event', () => {
      const el = document.createElement('ytz-select')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeDirective(Alpine, 'ytz-select', el, 'selected')

      const changeEvent = new CustomEvent('change', { detail: { value: 'option-3' } })
      el.dispatchEvent(changeEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "selected = 'option-3'")
    })
  })

  describe('x-ytz-disclosure', () => {
    it('syncs open attribute from Alpine state', () => {
      const el = document.createElement('ytz-disclosure')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-disclosure', el, 'expanded')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('updates Alpine state on toggle event', () => {
      const el = document.createElement('ytz-disclosure')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(false)

      invokeDirective(Alpine, 'ytz-disclosure', el, 'expanded')

      const toggleEvent = new CustomEvent('toggle', { detail: { open: true } })
      el.dispatchEvent(toggleEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'expanded = true')
    })
  })

  describe('x-ytz-accordion-item', () => {
    it('syncs open attribute from Alpine state', () => {
      const el = document.createElement('ytz-accordion-item')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-accordion-item', el, 'itemOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('updates Alpine state on toggle event', () => {
      const el = document.createElement('ytz-accordion-item')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(false)

      invokeDirective(Alpine, 'ytz-accordion-item', el, 'itemOpen')

      const toggleEvent = new CustomEvent('toggle', { detail: { open: true } })
      el.dispatchEvent(toggleEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'itemOpen = true')
    })
  })

  describe('x-ytz-popover', () => {
    it('syncs open attribute from Alpine state', () => {
      const el = document.createElement('ytz-popover')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-popover', el, 'popoverOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('updates Alpine state on toggle event', () => {
      const el = document.createElement('ytz-popover')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-popover', el, 'popoverOpen')

      const toggleEvent = new CustomEvent('toggle', { detail: { open: false } })
      el.dispatchEvent(toggleEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'popoverOpen = false')
    })
  })

  describe('x-ytz-autocomplete', () => {
    it('syncs value attribute from Alpine state', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('search query')

      invokeDirective(Alpine, 'ytz-autocomplete', el, 'query')

      expect(el.getAttribute('value')).toBe('search query')
    })

    it('updates Alpine state on input event', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeDirective(Alpine, 'ytz-autocomplete', el, 'query')

      const inputEvent = new CustomEvent('input', { detail: { value: 'new query' } })
      el.dispatchEvent(inputEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "query = 'new query'")
    })

    it('updates Alpine state on select event', () => {
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeDirective(Alpine, 'ytz-autocomplete', el, 'query')

      const selectEvent = new CustomEvent('select', { detail: { value: 'selected item' } })
      el.dispatchEvent(selectEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "query = 'selected item'")
    })

    it('supports .lazy modifier', async () => {
      vi.useFakeTimers()
      const el = document.createElement('ytz-autocomplete')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeDirective(Alpine, 'ytz-autocomplete', el, 'query', ['lazy'])

      el.dispatchEvent(new CustomEvent('input', { detail: { value: 'a' } }))
      el.dispatchEvent(new CustomEvent('input', { detail: { value: 'ab' } }))
      el.dispatchEvent(new CustomEvent('input', { detail: { value: 'abc' } }))

      vi.advanceTimersByTime(200)

      expect(Alpine.evaluate).toHaveBeenLastCalledWith(el, "query = 'abc'")

      vi.useRealTimers()
    })
  })

  describe('x-ytz-listbox', () => {
    it('syncs value attribute from Alpine state', () => {
      const el = document.createElement('ytz-listbox')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('item-2')

      invokeDirective(Alpine, 'ytz-listbox', el, 'selectedItem')

      expect(el.getAttribute('value')).toBe('item-2')
    })

    it('updates Alpine state on change event', () => {
      const el = document.createElement('ytz-listbox')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('')

      invokeDirective(Alpine, 'ytz-listbox', el, 'selectedItem')

      const changeEvent = new CustomEvent('change', { detail: { value: 'item-3' } })
      el.dispatchEvent(changeEvent)

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, "selectedItem = 'item-3'")
    })
  })

  describe('x-ytz-menu', () => {
    it('syncs open attribute from Alpine state', () => {
      const el = document.createElement('ytz-menu')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-menu', el, 'menuOpen')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('updates Alpine state on close event', () => {
      const el = document.createElement('ytz-menu')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-menu', el, 'menuOpen')
      el.dispatchEvent(new Event('close'))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'menuOpen = false')
    })
  })

  describe('x-ytz-progress', () => {
    it('syncs value attribute from Alpine state', () => {
      const el = document.createElement('ytz-progress')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(75)

      invokeDirective(Alpine, 'ytz-progress', el, 'progress')

      expect(el.getAttribute('value')).toBe('75')
    })

    it('supports .number modifier', () => {
      const el = document.createElement('ytz-progress')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('50')

      invokeDirective(Alpine, 'ytz-progress', el, 'progress', ['number'])

      expect(el.getAttribute('value')).toBe('50')
    })

    it('supports .once modifier', () => {
      const el = document.createElement('ytz-progress')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(25)

      const { effectFns } = invokeDirective(Alpine, 'ytz-progress', el, 'progress', ['once'])

      expect(effectFns.length).toBe(0)
      expect(el.getAttribute('value')).toBe('25')
    })

    it('does not add event listeners (read-only)', () => {
      const el = document.createElement('ytz-progress')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(50)

      const { cleanupFns } = invokeDirective(Alpine, 'ytz-progress', el, 'progress')

      // Progress has no cleanup because it doesn't listen to events
      expect(cleanupFns.length).toBe(0)
    })
  })

  describe('x-ytz-snackbar', () => {
    it('syncs open attribute from Alpine state', () => {
      const el = document.createElement('ytz-snackbar')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-snackbar', el, 'showSnackbar')

      expect(el.hasAttribute('open')).toBe(true)
    })

    it('updates Alpine state on close event', () => {
      const el = document.createElement('ytz-snackbar')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(true)

      invokeDirective(Alpine, 'ytz-snackbar', el, 'showSnackbar')
      el.dispatchEvent(new Event('close'))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'showSnackbar = false')
    })
  })

  describe('x-ytz-chip', () => {
    it('calls expression on remove event', () => {
      const el = document.createElement('ytz-chip')
      document.body.appendChild(el)

      invokeDirective(Alpine, 'ytz-chip', el, 'removeChip()')
      el.dispatchEvent(new Event('remove'))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'removeChip()')
    })

    it('cleans up event listener on destroy', () => {
      const el = document.createElement('ytz-chip')
      document.body.appendChild(el)

      const { runCleanup } = invokeDirective(Alpine, 'ytz-chip', el, 'removeChip()')
      runCleanup()

      Alpine.evaluate.mockClear()
      el.dispatchEvent(new Event('remove'))
      expect(Alpine.evaluate).not.toHaveBeenCalled()
    })
  })

  describe('x-ytz-badge', () => {
    it('syncs count attribute from Alpine state', () => {
      const el = document.createElement('ytz-badge')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(5)

      invokeDirective(Alpine, 'ytz-badge', el, 'notificationCount')

      expect(el.getAttribute('count')).toBe('5')
    })

    it('supports .number modifier', () => {
      const el = document.createElement('ytz-badge')
      document.body.appendChild(el)
      Alpine.setEvaluateResult('10')

      invokeDirective(Alpine, 'ytz-badge', el, 'notificationCount', ['number'])

      expect(el.getAttribute('count')).toBe('10')
    })

    it('supports .once modifier', () => {
      const el = document.createElement('ytz-badge')
      document.body.appendChild(el)
      Alpine.setEvaluateResult(3)

      const { effectFns } = invokeDirective(Alpine, 'ytz-badge', el, 'notificationCount', ['once'])

      expect(effectFns.length).toBe(0)
      expect(el.getAttribute('count')).toBe('3')
    })
  })

  describe('x-ytz-init', () => {
    it('runs expression on ytz:ready event', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)

      invokeDirective(Alpine, 'ytz-init', el, 'initSlider()')

      el.dispatchEvent(new Event('ytz:ready'))

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'initSlider()')
    })

    it('runs expression immediately if component is already ready', () => {
      const el = document.createElement('ytz-slider') as HTMLElement & { ready: boolean }
      el.ready = true
      document.body.appendChild(el)

      invokeDirective(Alpine, 'ytz-init', el, 'initSlider()')

      expect(Alpine.evaluate).toHaveBeenCalledWith(el, 'initSlider()')
    })

    it('cleans up event listener on destroy', () => {
      const el = document.createElement('ytz-slider')
      document.body.appendChild(el)

      const { runCleanup } = invokeDirective(Alpine, 'ytz-init', el, 'initSlider()')
      runCleanup()

      Alpine.evaluate.mockClear()
      el.dispatchEvent(new Event('ytz:ready'))
      expect(Alpine.evaluate).not.toHaveBeenCalled()
    })
  })

  describe('Custom prefix support', () => {
    it('registers directives with custom prefix', () => {
      const CustomAlpine = createMockAlpine()
      registerDirectives(CustomAlpine as never, 'custom')

      expect(CustomAlpine.directives.has('custom-dialog')).toBe(true)
      expect(CustomAlpine.directives.has('custom-slider')).toBe(true)
      expect(CustomAlpine.directives.has('ytz-dialog')).toBe(false)
    })
  })
})

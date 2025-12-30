/**
 * Alpine.js directive implementations for Yetzirah components
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
 * Register all Yetzirah directives with Alpine
 */
export function registerDirectives(Alpine: AlpineInstance, prefix: string): void {
  // Dialog directive - syncs dialog open state
  Alpine.directive(`${prefix}-dialog`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const isOpen = evaluate(expression)
      if (isOpen) el.setAttribute('open', '')
    } else {
      effect(() => {
        const isOpen = evaluate(expression)
        if (isOpen) {
          el.setAttribute('open', '')
        } else {
          el.removeAttribute('open')
        }
      })
    }

    const handleClose = () => {
      Alpine.evaluate(el, `${expression} = false`)
    }
    el.addEventListener('close', handleClose)
    cleanup(() => el.removeEventListener('close', handleClose))
  })

  // Drawer directive - syncs drawer open state
  Alpine.directive(`${prefix}-drawer`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const isOpen = evaluate(expression)
      if (isOpen) el.setAttribute('open', '')
    } else {
      effect(() => {
        const isOpen = evaluate(expression)
        if (isOpen) {
          el.setAttribute('open', '')
        } else {
          el.removeAttribute('open')
        }
      })
    }

    const handleClose = () => {
      Alpine.evaluate(el, `${expression} = false`)
    }
    el.addEventListener('close', handleClose)
    cleanup(() => el.removeEventListener('close', handleClose))
  })

  // Tabs directive - syncs tab value
  Alpine.directive(`${prefix}-tabs`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const value = evaluate(expression)
      if (value) el.setAttribute('default-tab', String(value))
    } else {
      effect(() => {
        const value = evaluate(expression)
        if (value) {
          el.setAttribute('default-tab', String(value))
        }
      })
    }

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = '${customEvent.detail?.value || ''}'`)
    }
    el.addEventListener('change', handleChange)
    cleanup(() => el.removeEventListener('change', handleChange))
  })

  // Toggle directive - syncs toggle checked state
  Alpine.directive(`${prefix}-toggle`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const isChecked = evaluate(expression)
      if (isChecked) el.setAttribute('checked', '')
    } else {
      effect(() => {
        const isChecked = evaluate(expression)
        if (isChecked) {
          el.setAttribute('checked', '')
        } else {
          el.removeAttribute('checked')
        }
      })
    }

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = ${customEvent.detail?.checked ?? false}`)
    }
    el.addEventListener('change', handleChange)
    cleanup(() => el.removeEventListener('change', handleChange))
  })

  // Slider directive - syncs slider value
  Alpine.directive(`${prefix}-slider`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')
    const isLazy = modifiers.includes('lazy')
    const isNumber = modifiers.includes('number')

    if (isOnce) {
      const value = evaluate(expression)
      if (value !== undefined) el.setAttribute('value', String(value))
    } else {
      effect(() => {
        const value = evaluate(expression)
        if (value !== undefined) {
          el.setAttribute('value', String(value))
        }
      })
    }

    const updateValue = (e: Event) => {
      const customEvent = e as CustomEvent
      let value = customEvent.detail?.value ?? 0
      if (isNumber) value = Number(value)
      Alpine.evaluate(el, `${expression} = ${value}`)
    }

    const handleChange = isLazy ? debounce(updateValue, 150) : updateValue
    el.addEventListener('change', handleChange)
    cleanup(() => el.removeEventListener('change', handleChange))
  })

  // Select directive - syncs select value
  Alpine.directive(`${prefix}-select`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const value = evaluate(expression)
      if (value !== undefined) el.setAttribute('value', String(value))
    } else {
      effect(() => {
        const value = evaluate(expression)
        if (value !== undefined) {
          el.setAttribute('value', String(value))
        }
      })
    }

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = '${customEvent.detail?.value || ''}'`)
    }
    el.addEventListener('change', handleChange)
    cleanup(() => el.removeEventListener('change', handleChange))
  })

  // Disclosure directive - syncs disclosure open state
  Alpine.directive(`${prefix}-disclosure`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const isOpen = evaluate(expression)
      if (isOpen) el.setAttribute('open', '')
    } else {
      effect(() => {
        const isOpen = evaluate(expression)
        if (isOpen) {
          el.setAttribute('open', '')
        } else {
          el.removeAttribute('open')
        }
      })
    }

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = ${customEvent.detail?.open ?? false}`)
    }
    el.addEventListener('toggle', handleToggle)
    cleanup(() => el.removeEventListener('toggle', handleToggle))
  })

  // Accordion item directive - syncs accordion item open state
  Alpine.directive(`${prefix}-accordion-item`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const isOpen = evaluate(expression)
      if (isOpen) el.setAttribute('open', '')
    } else {
      effect(() => {
        const isOpen = evaluate(expression)
        if (isOpen) {
          el.setAttribute('open', '')
        } else {
          el.removeAttribute('open')
        }
      })
    }

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = ${customEvent.detail?.open ?? false}`)
    }
    el.addEventListener('toggle', handleToggle)
    cleanup(() => el.removeEventListener('toggle', handleToggle))
  })

  // Popover directive - syncs popover open state
  Alpine.directive(`${prefix}-popover`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const isOpen = evaluate(expression)
      if (isOpen) el.setAttribute('open', '')
    } else {
      effect(() => {
        const isOpen = evaluate(expression)
        if (isOpen) {
          el.setAttribute('open', '')
        } else {
          el.removeAttribute('open')
        }
      })
    }

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = ${customEvent.detail?.open ?? false}`)
    }
    el.addEventListener('toggle', handleToggle)
    cleanup(() => el.removeEventListener('toggle', handleToggle))
  })

  // Autocomplete directive - syncs autocomplete value
  Alpine.directive(`${prefix}-autocomplete`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')
    const isLazy = modifiers.includes('lazy')

    if (isOnce) {
      const value = evaluate(expression)
      if (value !== undefined) el.setAttribute('value', String(value))
    } else {
      effect(() => {
        const value = evaluate(expression)
        if (value !== undefined) {
          el.setAttribute('value', String(value))
        }
      })
    }

    const updateValue = (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = '${customEvent.detail?.value || ''}'`)
    }

    const handleInput = isLazy ? debounce(updateValue, 150) : updateValue
    el.addEventListener('input', handleInput)
    el.addEventListener('select', updateValue)
    cleanup(() => {
      el.removeEventListener('input', handleInput)
      el.removeEventListener('select', updateValue)
    })
  })

  // Listbox directive - syncs listbox value
  Alpine.directive(`${prefix}-listbox`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const value = evaluate(expression)
      if (value !== undefined) el.setAttribute('value', String(value))
    } else {
      effect(() => {
        const value = evaluate(expression)
        if (value !== undefined) {
          el.setAttribute('value', String(value))
        }
      })
    }

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = '${customEvent.detail?.value || ''}'`)
    }
    el.addEventListener('change', handleChange)
    cleanup(() => el.removeEventListener('change', handleChange))
  })

  // Menu directive - syncs menu open state
  Alpine.directive(`${prefix}-menu`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const isOpen = evaluate(expression)
      if (isOpen) el.setAttribute('open', '')
    } else {
      effect(() => {
        const isOpen = evaluate(expression)
        if (isOpen) {
          el.setAttribute('open', '')
        } else {
          el.removeAttribute('open')
        }
      })
    }

    const handleClose = () => {
      Alpine.evaluate(el, `${expression} = false`)
    }
    el.addEventListener('close', handleClose)
    cleanup(() => el.removeEventListener('close', handleClose))
  })

  // Progress directive - syncs progress value
  Alpine.directive(`${prefix}-progress`, (el, { expression, modifiers }, { evaluate, effect }) => {
    const isOnce = modifiers.includes('once')
    const isNumber = modifiers.includes('number')

    if (isOnce) {
      let value = evaluate(expression)
      if (isNumber) value = Number(value)
      if (value !== undefined) el.setAttribute('value', String(value))
    } else {
      effect(() => {
        let value = evaluate(expression)
        if (isNumber) value = Number(value)
        if (value !== undefined) {
          el.setAttribute('value', String(value))
        }
      })
    }
  })

  // Snackbar directive - syncs snackbar open state
  Alpine.directive(`${prefix}-snackbar`, (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
    const isOnce = modifiers.includes('once')

    if (isOnce) {
      const isOpen = evaluate(expression)
      if (isOpen) el.setAttribute('open', '')
    } else {
      effect(() => {
        const isOpen = evaluate(expression)
        if (isOpen) {
          el.setAttribute('open', '')
        } else {
          el.removeAttribute('open')
        }
      })
    }

    const handleClose = () => {
      Alpine.evaluate(el, `${expression} = false`)
    }
    el.addEventListener('close', handleClose)
    cleanup(() => el.removeEventListener('close', handleClose))
  })

  // Chip directive - handles chip remove events
  Alpine.directive(`${prefix}-chip`, (el, { expression }, { cleanup }) => {
    const handleRemove = () => {
      Alpine.evaluate(el, expression)
    }
    el.addEventListener('remove', handleRemove)
    cleanup(() => el.removeEventListener('remove', handleRemove))
  })

  // Badge directive - syncs badge count
  Alpine.directive(`${prefix}-badge`, (el, { expression, modifiers }, { evaluate, effect }) => {
    const isOnce = modifiers.includes('once')
    const isNumber = modifiers.includes('number')

    if (isOnce) {
      let value = evaluate(expression)
      if (isNumber) value = Number(value)
      if (value !== undefined) el.setAttribute('count', String(value))
    } else {
      effect(() => {
        let value = evaluate(expression)
        if (isNumber) value = Number(value)
        if (value !== undefined) {
          el.setAttribute('count', String(value))
        }
      })
    }
  })

  // Init directive - runs expression when component is ready
  Alpine.directive(`${prefix}-init`, (el, { expression }, { cleanup }) => {
    const handleReady = () => {
      Alpine.evaluate(el, expression)
    }

    // Check if component is already ready
    if ((el as HTMLElement & { ready?: boolean }).ready) {
      Alpine.evaluate(el, expression)
    } else {
      el.addEventListener('ytz:ready', handleReady, { once: true })
      cleanup(() => el.removeEventListener('ytz:ready', handleReady))
    }
  })
}

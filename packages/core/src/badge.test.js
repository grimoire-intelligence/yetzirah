/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './badge.js'

describe('YtzBadge', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    test('renders badge indicator', () => {
      document.body.innerHTML = '<ytz-badge><button>Messages</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator).not.toBeNull()
    })

    test('indicator has aria-hidden', () => {
      document.body.innerHTML = '<ytz-badge><button>Messages</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.getAttribute('aria-hidden')).toBe('true')
    })

    test('renders in dot mode when no value', () => {
      document.body.innerHTML = '<ytz-badge><button>Messages</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.getAttribute('data-mode')).toBe('dot')
      expect(indicator.textContent).toBe('')
    })

    test('renders in count mode when value is set', () => {
      document.body.innerHTML = '<ytz-badge value="5"><button>Messages</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.getAttribute('data-mode')).toBe('count')
      expect(indicator.textContent).toBe('5')
    })
  })

  describe('value handling', () => {
    test('displays numeric value', () => {
      document.body.innerHTML = '<ytz-badge value="42"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.textContent).toBe('42')
    })

    test('displays string value', () => {
      document.body.innerHTML = '<ytz-badge value="NEW"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.textContent).toBe('NEW')
    })

    test('value="0" hides the badge', () => {
      document.body.innerHTML = '<ytz-badge value="0"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.hidden).toBe(true)
      expect(indicator.getAttribute('data-mode')).toBe('hidden')
    })
  })

  describe('max cap', () => {
    test('shows "max+" when value exceeds max', () => {
      document.body.innerHTML = '<ytz-badge value="150" max="99"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.textContent).toBe('99+')
    })

    test('shows actual value when under max', () => {
      document.body.innerHTML = '<ytz-badge value="50" max="99"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.textContent).toBe('50')
    })

    test('shows actual value when equal to max', () => {
      document.body.innerHTML = '<ytz-badge value="99" max="99"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.textContent).toBe('99')
    })

    test('max has no effect without value', () => {
      document.body.innerHTML = '<ytz-badge max="99"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.getAttribute('data-mode')).toBe('dot')
    })
  })

  describe('hidden states', () => {
    test('hidden attribute hides badge', () => {
      document.body.innerHTML = '<ytz-badge value="5" hidden><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.hidden).toBe(true)
    })

    test('removing hidden attribute shows badge', () => {
      document.body.innerHTML = '<ytz-badge value="5" hidden><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.hidden).toBe(true)

      badge.removeAttribute('hidden')

      expect(indicator.hidden).toBe(false)
    })
  })

  describe('position', () => {
    test('defaults to top-right', () => {
      document.body.innerHTML = '<ytz-badge value="5"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(badge.position).toBe('top-right')
      expect(indicator.getAttribute('data-position')).toBe('top-right')
    })

    test('accepts all valid positions', () => {
      const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left']

      for (const pos of positions) {
        document.body.innerHTML = `<ytz-badge value="5" position="${pos}"><button>Inbox</button></ytz-badge>`
        const badge = document.querySelector('ytz-badge')
        const indicator = badge.querySelector('.ytz-badge-indicator')

        expect(badge.position).toBe(pos)
        expect(indicator.getAttribute('data-position')).toBe(pos)
      }
    })

    test('falls back to top-right for invalid position', () => {
      document.body.innerHTML = '<ytz-badge value="5" position="invalid"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')

      expect(badge.position).toBe('top-right')
    })
  })

  describe('property getters/setters', () => {
    test('value property getter', () => {
      document.body.innerHTML = '<ytz-badge value="10"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')

      expect(badge.value).toBe('10')
    })

    test('value property setter', () => {
      document.body.innerHTML = '<ytz-badge><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(badge.value).toBeNull()

      badge.value = 15
      expect(badge.getAttribute('value')).toBe('15')
      expect(indicator.textContent).toBe('15')

      badge.value = null
      expect(badge.hasAttribute('value')).toBe(false)
      expect(indicator.getAttribute('data-mode')).toBe('dot')
    })

    test('max property getter', () => {
      document.body.innerHTML = '<ytz-badge max="99"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')

      expect(badge.max).toBe(99)
    })

    test('max property setter', () => {
      document.body.innerHTML = '<ytz-badge value="150"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(badge.max).toBeNull()
      expect(indicator.textContent).toBe('150')

      badge.max = 99
      expect(badge.getAttribute('max')).toBe('99')
      expect(indicator.textContent).toBe('99+')

      badge.max = null
      expect(badge.hasAttribute('max')).toBe(false)
      expect(indicator.textContent).toBe('150')
    })

    test('position property setter', () => {
      document.body.innerHTML = '<ytz-badge value="5"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      badge.position = 'bottom-left'
      expect(badge.getAttribute('position')).toBe('bottom-left')
      expect(indicator.getAttribute('data-position')).toBe('bottom-left')
    })
  })

  describe('dynamic updates', () => {
    test('updating value attribute updates indicator', () => {
      document.body.innerHTML = '<ytz-badge value="5"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.textContent).toBe('5')

      badge.setAttribute('value', '10')

      expect(indicator.textContent).toBe('10')
    })

    test('removing value attribute switches to dot mode', () => {
      document.body.innerHTML = '<ytz-badge value="5"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.getAttribute('data-mode')).toBe('count')

      badge.removeAttribute('value')

      expect(indicator.getAttribute('data-mode')).toBe('dot')
      expect(indicator.textContent).toBe('')
    })

    test('updating max attribute recalculates display', () => {
      document.body.innerHTML = '<ytz-badge value="150" max="200"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.textContent).toBe('150')

      badge.setAttribute('max', '99')

      expect(indicator.textContent).toBe('99+')
    })

    test('updating position attribute updates data-position', () => {
      document.body.innerHTML = '<ytz-badge value="5"><button>Inbox</button></ytz-badge>'
      const badge = document.querySelector('ytz-badge')
      const indicator = badge.querySelector('.ytz-badge-indicator')

      expect(indicator.getAttribute('data-position')).toBe('top-right')

      badge.setAttribute('position', 'bottom-right')

      expect(indicator.getAttribute('data-position')).toBe('bottom-right')
    })
  })
})

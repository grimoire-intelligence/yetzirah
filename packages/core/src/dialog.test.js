/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './dialog.js'

describe('YtzDialog', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  describe('rendering', () => {
    test('is hidden by default', () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(dialog.hidden).toBe(true)
    })

    test('is visible when open attribute present', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(dialog.hidden).toBe(false)
    })

    test('has role="dialog"', () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(dialog.getAttribute('role')).toBe('dialog')
    })

    test('has aria-modal="true"', () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(dialog.getAttribute('aria-modal')).toBe('true')
    })
  })

  describe('open/close behavior', () => {
    test('shows when open attribute added', () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(dialog.hidden).toBe(true)

      dialog.setAttribute('open', '')
      expect(dialog.hidden).toBe(false)
    })

    test('hides when open attribute removed', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(dialog.hidden).toBe(false)

      dialog.removeAttribute('open')
      expect(dialog.hidden).toBe(true)
    })

    test('dispatches close event when closed', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      const handler = jest.fn()
      dialog.addEventListener('close', handler)

      dialog.removeAttribute('open')

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('close event bubbles', () => {
      document.body.innerHTML = `
        <div id="parent">
          <ytz-dialog open>
            <p>Content</p>
          </ytz-dialog>
        </div>
      `
      const parent = document.querySelector('#parent')
      const handler = jest.fn()
      parent.addEventListener('close', handler)

      document.querySelector('ytz-dialog').removeAttribute('open')

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('keyboard handling', () => {
    test('closes on Escape key', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <button>Close</button>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(dialog.hasAttribute('open')).toBe(true)

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      document.dispatchEvent(event)

      expect(dialog.hasAttribute('open')).toBe(false)
    })

    test('does not close on other keys', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <button>Close</button>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      document.dispatchEvent(event)

      expect(dialog.hasAttribute('open')).toBe(true)
    })
  })

  describe('backdrop click', () => {
    test('closes when clicking dialog element directly', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <div class="content">Content</div>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      // Simulate click directly on dialog (backdrop)
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: dialog })
      dialog.dispatchEvent(event)

      expect(dialog.hasAttribute('open')).toBe(false)
    })

    test('does not close when clicking content inside', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <div class="content">Content</div>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      const content = dialog.querySelector('.content')

      content.click()

      expect(dialog.hasAttribute('open')).toBe(true)
    })

    test('does not close on backdrop click when static', () => {
      document.body.innerHTML = `
        <ytz-dialog open static>
          <div class="content">Content</div>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      // Simulate click directly on dialog (backdrop)
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: dialog })
      dialog.dispatchEvent(event)

      expect(dialog.hasAttribute('open')).toBe(true)
    })
  })

  describe('scroll lock', () => {
    test('locks body scroll when open', () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(document.body.style.overflow).toBe('')

      dialog.setAttribute('open', '')
      expect(document.body.style.overflow).toBe('hidden')
    })

    test('unlocks body scroll when closed', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <p>Content</p>
        </ytz-dialog>
      `
      expect(document.body.style.overflow).toBe('hidden')

      document.querySelector('ytz-dialog').removeAttribute('open')
      expect(document.body.style.overflow).toBe('')
    })

    test('restores previous overflow value', () => {
      document.body.style.overflow = 'auto'
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      dialog.setAttribute('open', '')
      expect(document.body.style.overflow).toBe('hidden')

      dialog.removeAttribute('open')
      expect(document.body.style.overflow).toBe('auto')
    })
  })

  describe('focus management', () => {
    test('focuses first focusable element on open', async () => {
      document.body.innerHTML = `
        <button id="trigger">Open</button>
        <ytz-dialog>
          <button id="first">First</button>
          <button id="second">Second</button>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      const first = document.querySelector('#first')

      dialog.setAttribute('open', '')

      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve))

      expect(document.activeElement).toBe(first)
    })

    test('restores focus to trigger on close', async () => {
      document.body.innerHTML = `
        <button id="trigger">Open</button>
        <ytz-dialog>
          <button id="close">Close</button>
        </ytz-dialog>
      `
      const trigger = document.querySelector('#trigger')
      const dialog = document.querySelector('ytz-dialog')

      trigger.focus()
      expect(document.activeElement).toBe(trigger)

      dialog.setAttribute('open', '')
      await new Promise(resolve => requestAnimationFrame(resolve))

      dialog.removeAttribute('open')
      expect(document.activeElement).toBe(trigger)
    })

    test('focuses dialog itself if no focusable elements', async () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>No buttons here</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      dialog.setAttribute('open', '')
      await new Promise(resolve => requestAnimationFrame(resolve))

      expect(document.activeElement).toBe(dialog)
      expect(dialog.getAttribute('tabindex')).toBe('-1')
    })
  })

  describe('focus trap', () => {
    test('Tab wraps from last to first element', async () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <button id="first">First</button>
          <button id="last">Last</button>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      const first = document.querySelector('#first')
      const last = document.querySelector('#last')

      await new Promise(resolve => requestAnimationFrame(resolve))

      last.focus()
      expect(document.activeElement).toBe(last)

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
      dialog.dispatchEvent(event)

      expect(document.activeElement).toBe(first)
    })

    test('Shift+Tab wraps from first to last element', async () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <button id="first">First</button>
          <button id="last">Last</button>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      const first = document.querySelector('#first')
      const last = document.querySelector('#last')

      await new Promise(resolve => requestAnimationFrame(resolve))

      first.focus()
      expect(document.activeElement).toBe(first)

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
      dialog.dispatchEvent(event)

      expect(document.activeElement).toBe(last)
    })
  })

  describe('public API', () => {
    test('open getter returns boolean state', () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      expect(dialog.open).toBe(false)

      dialog.setAttribute('open', '')
      expect(dialog.open).toBe(true)
    })

    test('open setter updates attribute', () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      dialog.open = true
      expect(dialog.hasAttribute('open')).toBe(true)

      dialog.open = false
      expect(dialog.hasAttribute('open')).toBe(false)
    })

    test('close() method closes dialog', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      dialog.close()
      expect(dialog.hasAttribute('open')).toBe(false)
    })

    test('showModal() method opens dialog', () => {
      document.body.innerHTML = `
        <ytz-dialog>
          <p>Content</p>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')

      dialog.showModal()
      expect(dialog.hasAttribute('open')).toBe(true)
    })
  })

  describe('cleanup', () => {
    test('cleans up on disconnect', () => {
      document.body.innerHTML = `
        <ytz-dialog open>
          <button>Close</button>
        </ytz-dialog>
      `
      const dialog = document.querySelector('ytz-dialog')
      expect(document.body.style.overflow).toBe('hidden')

      dialog.remove()

      expect(document.body.style.overflow).toBe('')
    })
  })
})

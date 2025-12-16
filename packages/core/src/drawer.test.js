/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './drawer.js'

describe('YtzDrawer', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  describe('rendering', () => {
    test('is hidden by default', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.hidden).toBe(true)
    })

    test('is visible when open attribute present', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.hidden).toBe(false)
    })

    test('has role="dialog"', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.getAttribute('role')).toBe('dialog')
    })

    test('has aria-modal="true"', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.getAttribute('aria-modal')).toBe('true')
    })

    test('defaults to anchor="left"', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.getAttribute('anchor')).toBe('left')
    })
  })

  describe('anchor attribute', () => {
    test('accepts left anchor', () => {
      document.body.innerHTML = `
        <ytz-drawer anchor="left">
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.anchor).toBe('left')
    })

    test('accepts right anchor', () => {
      document.body.innerHTML = `
        <ytz-drawer anchor="right">
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.anchor).toBe('right')
    })

    test('accepts top anchor', () => {
      document.body.innerHTML = `
        <ytz-drawer anchor="top">
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.anchor).toBe('top')
    })

    test('accepts bottom anchor', () => {
      document.body.innerHTML = `
        <ytz-drawer anchor="bottom">
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.anchor).toBe('bottom')
    })

    test('resets invalid anchor to left', () => {
      document.body.innerHTML = `
        <ytz-drawer anchor="invalid">
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.anchor).toBe('left')
    })

    test('anchor setter updates attribute', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      drawer.anchor = 'right'
      expect(drawer.getAttribute('anchor')).toBe('right')
    })

    test('anchor setter ignores invalid values', () => {
      document.body.innerHTML = `
        <ytz-drawer anchor="left">
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      drawer.anchor = 'invalid'
      expect(drawer.getAttribute('anchor')).toBe('left')
    })
  })

  describe('open/close behavior', () => {
    test('shows when open attribute added', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.hidden).toBe(true)

      drawer.setAttribute('open', '')
      expect(drawer.hidden).toBe(false)
    })

    test('hides when open attribute removed', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.hidden).toBe(false)

      drawer.removeAttribute('open')
      expect(drawer.hidden).toBe(true)
    })

    test('dispatches close event when closed', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      const handler = jest.fn()
      drawer.addEventListener('close', handler)

      drawer.removeAttribute('open')

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('close event bubbles', () => {
      document.body.innerHTML = `
        <div id="parent">
          <ytz-drawer open>
            <div>Content</div>
          </ytz-drawer>
        </div>
      `
      const parent = document.querySelector('#parent')
      const handler = jest.fn()
      parent.addEventListener('close', handler)

      document.querySelector('ytz-drawer').removeAttribute('open')

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('keyboard handling', () => {
    test('closes on Escape key', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <button>Close</button>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(drawer.hasAttribute('open')).toBe(true)

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      document.dispatchEvent(event)

      expect(drawer.hasAttribute('open')).toBe(false)
    })

    test('does not close on other keys', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <button>Close</button>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      document.dispatchEvent(event)

      expect(drawer.hasAttribute('open')).toBe(true)
    })
  })

  describe('backdrop click', () => {
    test('closes when clicking drawer element directly', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <div class="content">Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: drawer })
      drawer.dispatchEvent(event)

      expect(drawer.hasAttribute('open')).toBe(false)
    })

    test('does not close when clicking content inside', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <div class="content">Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      const content = drawer.querySelector('.content')

      content.click()

      expect(drawer.hasAttribute('open')).toBe(true)
    })

    test('does not close on backdrop click when static', () => {
      document.body.innerHTML = `
        <ytz-drawer open static>
          <div class="content">Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: drawer })
      drawer.dispatchEvent(event)

      expect(drawer.hasAttribute('open')).toBe(true)
    })
  })

  describe('scroll lock', () => {
    test('locks body scroll when open', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(document.body.style.overflow).toBe('')

      drawer.setAttribute('open', '')
      expect(document.body.style.overflow).toBe('hidden')
    })

    test('unlocks body scroll when closed', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <div>Content</div>
        </ytz-drawer>
      `
      expect(document.body.style.overflow).toBe('hidden')

      document.querySelector('ytz-drawer').removeAttribute('open')
      expect(document.body.style.overflow).toBe('')
    })

    test('restores previous overflow value', () => {
      document.body.style.overflow = 'auto'
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      drawer.setAttribute('open', '')
      expect(document.body.style.overflow).toBe('hidden')

      drawer.removeAttribute('open')
      expect(document.body.style.overflow).toBe('auto')
    })
  })

  describe('focus management', () => {
    test('focuses first focusable element on open', async () => {
      document.body.innerHTML = `
        <button id="trigger">Open</button>
        <ytz-drawer>
          <button id="first">First</button>
          <button id="second">Second</button>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      const first = document.querySelector('#first')

      drawer.setAttribute('open', '')

      await new Promise(resolve => requestAnimationFrame(resolve))

      expect(document.activeElement).toBe(first)
    })

    test('restores focus to trigger on close', async () => {
      document.body.innerHTML = `
        <button id="trigger">Open</button>
        <ytz-drawer>
          <button id="close">Close</button>
        </ytz-drawer>
      `
      const trigger = document.querySelector('#trigger')
      const drawer = document.querySelector('ytz-drawer')

      trigger.focus()
      expect(document.activeElement).toBe(trigger)

      drawer.setAttribute('open', '')
      await new Promise(resolve => requestAnimationFrame(resolve))

      drawer.removeAttribute('open')
      expect(document.activeElement).toBe(trigger)
    })

    test('focuses drawer itself if no focusable elements', async () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <p>No buttons here</p>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      drawer.setAttribute('open', '')
      await new Promise(resolve => requestAnimationFrame(resolve))

      expect(document.activeElement).toBe(drawer)
      expect(drawer.getAttribute('tabindex')).toBe('-1')
    })
  })

  describe('focus trap', () => {
    test('Tab wraps from last to first element', async () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <button id="first">First</button>
          <button id="last">Last</button>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      const first = document.querySelector('#first')
      const last = document.querySelector('#last')

      await new Promise(resolve => requestAnimationFrame(resolve))

      last.focus()
      expect(document.activeElement).toBe(last)

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
      drawer.dispatchEvent(event)

      expect(document.activeElement).toBe(first)
    })

    test('Shift+Tab wraps from first to last element', async () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <button id="first">First</button>
          <button id="last">Last</button>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      const first = document.querySelector('#first')
      const last = document.querySelector('#last')

      await new Promise(resolve => requestAnimationFrame(resolve))

      first.focus()
      expect(document.activeElement).toBe(first)

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
      drawer.dispatchEvent(event)

      expect(document.activeElement).toBe(last)
    })
  })

  describe('public API', () => {
    test('open getter returns boolean state', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      expect(drawer.open).toBe(false)

      drawer.setAttribute('open', '')
      expect(drawer.open).toBe(true)
    })

    test('open setter updates attribute', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      drawer.open = true
      expect(drawer.hasAttribute('open')).toBe(true)

      drawer.open = false
      expect(drawer.hasAttribute('open')).toBe(false)
    })

    test('close() method closes drawer', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      drawer.close()
      expect(drawer.hasAttribute('open')).toBe(false)
    })

    test('show() method opens drawer', () => {
      document.body.innerHTML = `
        <ytz-drawer>
          <div>Content</div>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')

      drawer.show()
      expect(drawer.hasAttribute('open')).toBe(true)
    })
  })

  describe('cleanup', () => {
    test('cleans up on disconnect', () => {
      document.body.innerHTML = `
        <ytz-drawer open>
          <button>Close</button>
        </ytz-drawer>
      `
      const drawer = document.querySelector('ytz-drawer')
      expect(document.body.style.overflow).toBe('hidden')

      drawer.remove()

      expect(document.body.style.overflow).toBe('')
    })
  })
})

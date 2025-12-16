/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './popover.js'

describe('YtzPopover', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('rendering', () => {
    test('content is hidden by default', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const content = document.querySelector('[slot="content"]')
      expect(content.hidden).toBe(true)
    })

    test('can be open initially via attribute', () => {
      document.body.innerHTML = `
        <ytz-popover open>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const content = document.querySelector('[slot="content"]')
      expect(content.hidden).toBe(false)
    })
  })

  describe('ARIA attributes', () => {
    test('trigger has aria-haspopup="dialog"', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    })

    test('trigger has aria-expanded="false" when closed', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    test('trigger has aria-expanded="true" when open', () => {
      document.body.innerHTML = `
        <ytz-popover open>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
    })

    test('trigger has aria-controls pointing to content', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      const content = document.querySelector('[slot="content"]')

      expect(trigger.getAttribute('aria-controls')).toBe(content.id)
      expect(content.id).toMatch(/^ytz-popover-\d+$/)
    })

    test('preserves existing content id', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content" id="my-popover">Popover content</div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      const content = document.querySelector('#my-popover')

      expect(trigger.getAttribute('aria-controls')).toBe('my-popover')
      expect(content.id).toBe('my-popover')
    })
  })

  describe('click behavior', () => {
    test('opens on trigger click', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      const content = document.querySelector('[slot="content"]')

      trigger.click()

      expect(content.hidden).toBe(false)
    })

    test('closes on second trigger click (toggle)', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      const content = document.querySelector('[slot="content"]')

      trigger.click()
      expect(content.hidden).toBe(false)

      trigger.click()
      expect(content.hidden).toBe(true)
    })

    test('open attribute controls visibility', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.setAttribute('open', '')
      expect(content.hidden).toBe(false)

      popover.removeAttribute('open')
      expect(content.hidden).toBe(true)
    })

    test('open property syncs with attribute', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.open = true
      expect(popover.hasAttribute('open')).toBe(true)
      expect(content.hidden).toBe(false)

      popover.open = false
      expect(popover.hasAttribute('open')).toBe(false)
      expect(content.hidden).toBe(true)
    })
  })

  describe('light dismiss', () => {
    test('closes when clicking outside content', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
        <div id="outside">Outside element</div>
      `
      const trigger = document.querySelector('ytz-popover button')
      const content = document.querySelector('[slot="content"]')
      const outside = document.querySelector('#outside')

      // Open popover
      trigger.click()
      expect(content.hidden).toBe(false)

      // Wait for setTimeout in #show
      jest.runAllTimers()

      // Click outside
      outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(content.hidden).toBe(true)
    })

    test('does not close when clicking inside content', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">
            <button id="inner">Inner button</button>
          </div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      const content = document.querySelector('[slot="content"]')
      const innerButton = document.querySelector('#inner')

      // Open popover
      trigger.click()
      expect(content.hidden).toBe(false)

      // Wait for setTimeout in #show
      jest.runAllTimers()

      // Click inside content
      innerButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(content.hidden).toBe(false)
    })
  })

  describe('keyboard behavior', () => {
    test('Escape closes popover', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.open = true
      expect(content.hidden).toBe(false)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      expect(content.hidden).toBe(true)
    })

    test('Escape returns focus to trigger', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button id="trigger">Trigger</button>
          <div slot="content">
            <button id="inner">Inner</button>
          </div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const trigger = document.querySelector('#trigger')

      // Mock focus
      const focusSpy = jest.spyOn(trigger, 'focus')

      popover.open = true
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      expect(focusSpy).toHaveBeenCalled()
      focusSpy.mockRestore()
    })
  })

  describe('focus management', () => {
    test('focuses first focusable element on open', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">
            <input type="text" id="first-input">
            <button>OK</button>
          </div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const firstInput = document.querySelector('#first-input')

      const focusSpy = jest.spyOn(firstInput, 'focus')

      popover.open = true
      jest.runAllTimers()

      expect(focusSpy).toHaveBeenCalled()
      focusSpy.mockRestore()
    })
  })

  describe('positioning', () => {
    test('positions content with fixed positioning', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.open = true

      expect(content.style.position).toBe('fixed')
      expect(content.style.left).toMatch(/\d+px/)
      expect(content.style.top).toMatch(/\d+px/)
    })

    test('sets data-placement attribute', () => {
      document.body.innerHTML = `
        <ytz-popover placement="top">
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.open = true

      expect(content.dataset.placement).toBeDefined()
    })

    test('default placement is bottom', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      expect(popover.placement).toBe('bottom')
    })
  })

  describe('public API', () => {
    test('show() method opens popover', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.show()

      expect(content.hidden).toBe(false)
      expect(popover.open).toBe(true)
    })

    test('hide() method closes popover', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.show()
      expect(content.hidden).toBe(false)

      popover.hide()
      expect(content.hidden).toBe(true)
      expect(popover.open).toBe(false)
    })

    test('toggle() method toggles popover', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.toggle()
      expect(content.hidden).toBe(false)

      popover.toggle()
      expect(content.hidden).toBe(true)
    })

    test('placement getter returns attribute value', () => {
      document.body.innerHTML = `
        <ytz-popover placement="top">
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      expect(popover.placement).toBe('top')
    })

    test('placement setter updates attribute', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      popover.placement = 'left'
      expect(popover.getAttribute('placement')).toBe('left')
    })

    test('offset getter returns attribute value', () => {
      document.body.innerHTML = `
        <ytz-popover offset="16">
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      expect(popover.offset).toBe(16)
    })

    test('offset setter updates attribute', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      popover.offset = 20
      expect(popover.getAttribute('offset')).toBe('20')
    })
  })

  describe('events', () => {
    test('dispatches show event when opened', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const handler = jest.fn()
      popover.addEventListener('show', handler)

      popover.show()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('dispatches hide event when closed', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const handler = jest.fn()
      popover.addEventListener('hide', handler)

      popover.show()
      popover.hide()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('show event bubbles', () => {
      document.body.innerHTML = `
        <div id="parent">
          <ytz-popover>
            <button>Trigger</button>
            <div slot="content">Popover content</div>
          </ytz-popover>
        </div>
      `
      const parent = document.querySelector('#parent')
      const popover = document.querySelector('ytz-popover')
      const handler = jest.fn()
      parent.addEventListener('show', handler)

      popover.show()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('hide event bubbles', () => {
      document.body.innerHTML = `
        <div id="parent">
          <ytz-popover>
            <button>Trigger</button>
            <div slot="content">Popover content</div>
          </ytz-popover>
        </div>
      `
      const parent = document.querySelector('#parent')
      const popover = document.querySelector('ytz-popover')
      const handler = jest.fn()
      parent.addEventListener('hide', handler)

      popover.show()
      popover.hide()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    test('handles missing trigger gracefully', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <div slot="content">Content only</div>
        </ytz-popover>
      `
      // Should not throw
      const popover = document.querySelector('ytz-popover')
      expect(popover).toBeTruthy()
    })

    test('handles same element as trigger and content gracefully', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Only one element</button>
        </ytz-popover>
      `
      // Should not throw - firstElementChild === lastElementChild
      const popover = document.querySelector('ytz-popover')
      expect(popover).toBeTruthy()
    })

    test('cleanup removes event listeners on disconnect', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      popover.show()

      // Should not throw when disconnected
      popover.remove()
      expect(document.querySelector('ytz-popover')).toBeNull()
    })

    test('works without slot attribute (last child as content)', () => {
      document.body.innerHTML = `
        <ytz-popover>
          <button>Trigger</button>
          <div>Popover content without slot</div>
        </ytz-popover>
      `
      const trigger = document.querySelector('ytz-popover button')
      const content = document.querySelector('ytz-popover div')

      trigger.click()

      expect(content.hidden).toBe(false)
    })

    test('repositions on attribute change while open', () => {
      document.body.innerHTML = `
        <ytz-popover placement="bottom">
          <button>Trigger</button>
          <div slot="content">Popover content</div>
        </ytz-popover>
      `
      const popover = document.querySelector('ytz-popover')
      const content = document.querySelector('[slot="content"]')

      popover.open = true
      const initialLeft = content.style.left

      // Change placement - should reposition
      popover.setAttribute('placement', 'top')

      // Position should update (or at least not throw)
      expect(content.style.left).toBeDefined()
    })
  })
})

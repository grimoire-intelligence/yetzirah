/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './menu.js'

describe('YtzMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('structure', () => {
    test('finds trigger element with slot="trigger"', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger).toBeTruthy()
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    })

    test('creates popup wrapper with role="menu"', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const popup = document.querySelector('[role="menu"]')
      expect(popup).toBeTruthy()
      expect(popup.id).toMatch(/^ytz-menu-\d+$/)
    })

    test('moves menuitem children into popup', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
          <ytz-menuitem>Item 2</ytz-menuitem>
        </ytz-menu>
      `
      const popup = document.querySelector('[role="menu"]')
      const items = popup.querySelectorAll('ytz-menuitem')
      expect(items.length).toBe(2)
    })
  })

  describe('ARIA attributes', () => {
    test('trigger has aria-haspopup="menu"', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    })

    test('trigger has aria-controls pointing to menu', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      const popup = document.querySelector('[role="menu"]')
      expect(trigger.getAttribute('aria-controls')).toBe(popup.id)
    })

    test('trigger has aria-expanded="false" when closed', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    test('trigger has aria-expanded="true" when open', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const trigger = document.querySelector('[slot="trigger"]')

      menu.open = true

      expect(trigger.getAttribute('aria-expanded')).toBe('true')
    })
  })

  describe('opening/closing', () => {
    test('opens on trigger click', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const trigger = document.querySelector('[slot="trigger"]')

      trigger.click()

      expect(menu.open).toBe(true)
    })

    test('closes on second trigger click', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const trigger = document.querySelector('[slot="trigger"]')

      trigger.click()
      expect(menu.open).toBe(true)

      trigger.click()
      expect(menu.open).toBe(false)
    })

    test('closes on Escape key', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      menu.open = true

      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      expect(menu.open).toBe(false)
    })

    test('closes on click outside', () => {
      document.body.innerHTML = `
        <div id="outside">Outside</div>
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      menu.open = true

      document.querySelector('#outside').click()

      expect(menu.open).toBe(false)
    })

    test('does not close when clicking inside menu', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const popup = document.querySelector('[role="menu"]')
      menu.open = true

      // Click on popup container (not an item)
      popup.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(menu.open).toBe(true)
    })

    test('closes after selecting item', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const item = document.querySelector('ytz-menuitem')
      menu.open = true

      item.click()

      expect(menu.open).toBe(false)
    })

    test('open attribute controls visibility', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const popup = document.querySelector('[role="menu"]')

      expect(popup.hidden).toBe(true)

      menu.setAttribute('open', '')
      expect(popup.hidden).toBe(false)

      menu.removeAttribute('open')
      expect(popup.hidden).toBe(true)
    })

    test('open property syncs with attribute', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')

      menu.open = true
      expect(menu.hasAttribute('open')).toBe(true)

      menu.open = false
      expect(menu.hasAttribute('open')).toBe(false)
    })
  })

  describe('focus management', () => {
    test('focuses first item when opened', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
          <ytz-menuitem>Item 2</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const firstItem = document.querySelector('ytz-menuitem')

      menu.open = true

      expect(document.activeElement).toBe(firstItem)
    })

    test('skips disabled items when focusing first', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem disabled>Disabled</ytz-menuitem>
          <ytz-menuitem>Item 2</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const enabledItem = document.querySelectorAll('ytz-menuitem')[1]

      menu.open = true

      expect(document.activeElement).toBe(enabledItem)
    })
  })

  describe('keyboard navigation', () => {
    test('ArrowDown moves to next item', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
          <ytz-menuitem>Item 2</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const items = document.querySelectorAll('ytz-menuitem')
      menu.open = true

      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(items[1])
    })

    test('ArrowUp moves to previous item', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
          <ytz-menuitem>Item 2</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const items = document.querySelectorAll('ytz-menuitem')
      menu.open = true
      items[1].focus()

      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

      expect(document.activeElement).toBe(items[0])
    })

    test('Home moves to first item', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
          <ytz-menuitem>Item 2</ytz-menuitem>
          <ytz-menuitem>Item 3</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const items = document.querySelectorAll('ytz-menuitem')
      menu.open = true
      items[2].focus()

      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))

      expect(document.activeElement).toBe(items[0])
    })

    test('End moves to last item', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
          <ytz-menuitem>Item 2</ytz-menuitem>
          <ytz-menuitem>Item 3</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const items = document.querySelectorAll('ytz-menuitem')
      menu.open = true

      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))

      expect(document.activeElement).toBe(items[2])
    })

    test('navigation wraps around', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
          <ytz-menuitem>Item 2</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const items = document.querySelectorAll('ytz-menuitem')
      menu.open = true
      items[1].focus()

      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(items[0])
    })

    test('Enter key selects focused item', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem value="edit">Edit</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const item = document.querySelector('ytz-menuitem')
      const handler = jest.fn()
      menu.addEventListener('select', handler)
      menu.open = true

      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(handler).toHaveBeenCalled()
      expect(menu.open).toBe(false)
    })

    test('Space key selects focused item', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem value="edit">Edit</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const handler = jest.fn()
      menu.addEventListener('select', handler)
      menu.open = true

      menu.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

      expect(handler).toHaveBeenCalled()
    })
  })

  describe('positioning', () => {
    test('positions relative to trigger', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const popup = document.querySelector('[role="menu"]')
      menu.open = true

      expect(popup.style.position).toBe('fixed')
      expect(popup.style.left).toMatch(/\d+px/)
      expect(popup.style.top).toMatch(/\d+px/)
    })

    test('respects placement attribute', () => {
      document.body.innerHTML = `
        <ytz-menu placement="right">
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      expect(menu.placement).toBe('right')
    })
  })

  describe('events', () => {
    test('dispatches open event when opened', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const handler = jest.fn()
      menu.addEventListener('open', handler)

      menu.open = true

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('dispatches close event when closed', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const handler = jest.fn()
      menu.addEventListener('close', handler)

      menu.open = true
      menu.open = false

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('public API', () => {
    test('show() opens menu', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')

      menu.show()

      expect(menu.open).toBe(true)
    })

    test('hide() closes menu', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      menu.open = true

      menu.hide()

      expect(menu.open).toBe(false)
    })

    test('toggle() toggles menu', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')

      menu.toggle()
      expect(menu.open).toBe(true)

      menu.toggle()
      expect(menu.open).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('handles missing trigger gracefully', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      expect(menu).toBeTruthy()
    })

    test('cleanup removes event listeners on disconnect', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      menu.open = true

      menu.remove()

      expect(document.querySelector('ytz-menu')).toBeNull()
    })
  })
})

describe('YtzMenuItem', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('ARIA', () => {
    test('has role="menuitem"', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const item = document.querySelector('ytz-menuitem')
      expect(item.getAttribute('role')).toBe('menuitem')
    })

    test('has tabindex="-1" when not disabled', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const item = document.querySelector('ytz-menuitem')
      expect(item.getAttribute('tabindex')).toBe('-1')
    })

    test('has aria-disabled="true" when disabled', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem disabled>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const item = document.querySelector('ytz-menuitem')
      expect(item.getAttribute('aria-disabled')).toBe('true')
    })
  })

  describe('interaction', () => {
    test('dispatches select event on click', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const item = document.querySelector('ytz-menuitem')
      const handler = jest.fn()
      menu.addEventListener('select', handler)
      menu.open = true

      item.click()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('select event includes value from attribute', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem value="edit">Edit</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const item = document.querySelector('ytz-menuitem')
      let detail = null
      menu.addEventListener('select', (e) => { detail = e.detail })
      menu.open = true

      item.click()

      expect(detail.value).toBe('edit')
    })

    test('select event includes text content if no value', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Edit Item</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const item = document.querySelector('ytz-menuitem')
      let detail = null
      menu.addEventListener('select', (e) => { detail = e.detail })
      menu.open = true

      item.click()

      expect(detail.value).toBe('Edit Item')
    })

    test('disabled item prevents selection', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem disabled>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const menu = document.querySelector('ytz-menu')
      const item = document.querySelector('ytz-menuitem')
      const handler = jest.fn()
      menu.addEventListener('select', handler)
      menu.open = true

      item.click()

      expect(handler).not.toHaveBeenCalled()
      expect(menu.open).toBe(true) // Menu stays open
    })
  })

  describe('properties', () => {
    test('disabled getter returns attribute state', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem disabled>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const item = document.querySelector('ytz-menuitem')
      expect(item.disabled).toBe(true)
    })

    test('disabled setter updates attribute and ARIA', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const item = document.querySelector('ytz-menuitem')

      item.disabled = true

      expect(item.hasAttribute('disabled')).toBe(true)
      expect(item.getAttribute('aria-disabled')).toBe('true')
      expect(item.hasAttribute('tabindex')).toBe(false)

      item.disabled = false

      expect(item.hasAttribute('disabled')).toBe(false)
      expect(item.hasAttribute('aria-disabled')).toBe(false)
      expect(item.getAttribute('tabindex')).toBe('-1')
    })

    test('value getter/setter works', () => {
      document.body.innerHTML = `
        <ytz-menu>
          <button slot="trigger">Open</button>
          <ytz-menuitem>Item 1</ytz-menuitem>
        </ytz-menu>
      `
      const item = document.querySelector('ytz-menuitem')

      item.value = 'test'
      expect(item.value).toBe('test')
      expect(item.getAttribute('value')).toBe('test')

      item.value = null
      expect(item.value).toBeNull()
      expect(item.hasAttribute('value')).toBe(false)
    })
  })
})

describe('clickOutside utility', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('calls callback when clicking outside element', async () => {
    const { clickOutside } = await import('./utils/click-outside.js')

    document.body.innerHTML = `
      <div id="element">Inside</div>
      <div id="outside">Outside</div>
    `
    const element = document.querySelector('#element')
    const outside = document.querySelector('#outside')
    const callback = jest.fn()

    clickOutside(element, callback)
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('does not call callback when clicking inside element', async () => {
    const { clickOutside } = await import('./utils/click-outside.js')

    document.body.innerHTML = `
      <div id="element">
        <span id="inside">Inside</span>
      </div>
    `
    const element = document.querySelector('#element')
    const inside = document.querySelector('#inside')
    const callback = jest.fn()

    clickOutside(element, callback)
    inside.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(callback).not.toHaveBeenCalled()
  })

  test('ignores clicks on ignored element', async () => {
    const { clickOutside } = await import('./utils/click-outside.js')

    document.body.innerHTML = `
      <div id="element">Element</div>
      <button id="ignore">Ignore Me</button>
    `
    const element = document.querySelector('#element')
    const ignore = document.querySelector('#ignore')
    const callback = jest.fn()

    clickOutside(element, callback, { ignore })
    ignore.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(callback).not.toHaveBeenCalled()
  })

  test('destroy() removes listener', async () => {
    const { clickOutside } = await import('./utils/click-outside.js')

    document.body.innerHTML = `
      <div id="element">Inside</div>
      <div id="outside">Outside</div>
    `
    const element = document.querySelector('#element')
    const outside = document.querySelector('#outside')
    const callback = jest.fn()

    const handler = clickOutside(element, callback)
    handler.destroy()

    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(callback).not.toHaveBeenCalled()
  })
})

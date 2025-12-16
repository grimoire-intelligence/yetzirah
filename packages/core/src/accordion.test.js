/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './accordion.js'

describe('YtzAccordion', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('structure', () => {
    test('renders ytz-accordion-item children', () => {
      document.body.innerHTML = `
        <ytz-accordion>
          <ytz-accordion-item>
            <button>Section 1</button>
            <div>Content 1</div>
          </ytz-accordion-item>
          <ytz-accordion-item>
            <button>Section 2</button>
            <div>Content 2</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const accordion = document.querySelector('ytz-accordion')
      expect(accordion.querySelectorAll('ytz-accordion-item').length).toBe(2)
    })

    test('items getter returns all direct child items', () => {
      document.body.innerHTML = `
        <ytz-accordion>
          <ytz-accordion-item>
            <button>Section 1</button>
            <div>Content 1</div>
          </ytz-accordion-item>
          <ytz-accordion-item>
            <button>Section 2</button>
            <div>Content 2</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const accordion = document.querySelector('ytz-accordion')
      expect(accordion.items.length).toBe(2)
      expect(accordion.items[0].tagName.toLowerCase()).toBe('ytz-accordion-item')
    })
  })

  describe('non-exclusive mode (default)', () => {
    test('multiple items can be open simultaneously', () => {
      document.body.innerHTML = `
        <ytz-accordion>
          <ytz-accordion-item open>
            <button>Section 1</button>
            <div>Content 1</div>
          </ytz-accordion-item>
          <ytz-accordion-item open>
            <button>Section 2</button>
            <div>Content 2</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const items = document.querySelectorAll('ytz-accordion-item')
      expect(items[0].open).toBe(true)
      expect(items[1].open).toBe(true)
    })

    test('toggling one item does not affect others', () => {
      document.body.innerHTML = `
        <ytz-accordion>
          <ytz-accordion-item open>
            <button>Section 1</button>
            <div>Content 1</div>
          </ytz-accordion-item>
          <ytz-accordion-item>
            <button>Section 2</button>
            <div>Content 2</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const items = document.querySelectorAll('ytz-accordion-item')

      items[1].querySelector('button').click()

      expect(items[0].open).toBe(true)
      expect(items[1].open).toBe(true)
    })
  })

  describe('exclusive mode', () => {
    test('exclusive attribute enables single-open mode', () => {
      document.body.innerHTML = `
        <ytz-accordion exclusive>
          <ytz-accordion-item>
            <button>Section 1</button>
            <div>Content 1</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const accordion = document.querySelector('ytz-accordion')
      expect(accordion.exclusive).toBe(true)
    })

    test('exclusive property reflects attribute', () => {
      document.body.innerHTML = `
        <ytz-accordion>
          <ytz-accordion-item>
            <button>Section 1</button>
            <div>Content 1</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const accordion = document.querySelector('ytz-accordion')

      expect(accordion.exclusive).toBe(false)

      accordion.exclusive = true
      expect(accordion.hasAttribute('exclusive')).toBe(true)

      accordion.exclusive = false
      expect(accordion.hasAttribute('exclusive')).toBe(false)
    })

    test('opening one item closes others in exclusive mode', () => {
      document.body.innerHTML = `
        <ytz-accordion exclusive>
          <ytz-accordion-item open>
            <button>Section 1</button>
            <div>Content 1</div>
          </ytz-accordion-item>
          <ytz-accordion-item>
            <button>Section 2</button>
            <div>Content 2</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const items = document.querySelectorAll('ytz-accordion-item')

      expect(items[0].open).toBe(true)
      expect(items[1].open).toBe(false)

      items[1].querySelector('button').click()

      expect(items[0].open).toBe(false)
      expect(items[1].open).toBe(true)
    })

    test('closing an item does not open others in exclusive mode', () => {
      document.body.innerHTML = `
        <ytz-accordion exclusive>
          <ytz-accordion-item open>
            <button>Section 1</button>
            <div>Content 1</div>
          </ytz-accordion-item>
          <ytz-accordion-item>
            <button>Section 2</button>
            <div>Content 2</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const items = document.querySelectorAll('ytz-accordion-item')

      items[0].querySelector('button').click()

      expect(items[0].open).toBe(false)
      expect(items[1].open).toBe(false)
    })
  })
})

describe('YtzAccordionItem', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('structure', () => {
    test('finds button trigger', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const trigger = document.querySelector('ytz-accordion-item button')
      expect(trigger).toBeTruthy()
      expect(trigger.hasAttribute('aria-expanded')).toBe(true)
    })

    test('finds content element', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const content = document.querySelector('ytz-accordion-item > div')
      expect(content).toBeTruthy()
      expect(content.hasAttribute('role')).toBe(true)
    })
  })

  describe('ARIA attributes', () => {
    test('trigger has aria-expanded=false when closed', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const trigger = document.querySelector('ytz-accordion-item button')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    test('trigger has aria-expanded=true when open', () => {
      document.body.innerHTML = `
        <ytz-accordion-item open>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const trigger = document.querySelector('ytz-accordion-item button')
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
    })

    test('trigger has aria-controls pointing to content', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const trigger = document.querySelector('ytz-accordion-item button')
      const content = document.querySelector('ytz-accordion-item > div')

      expect(trigger.getAttribute('aria-controls')).toBe(content.id)
      expect(content.id).toMatch(/^ytz-accordion-content-\d+$/)
    })

    test('content has role=region', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const content = document.querySelector('ytz-accordion-item > div')
      expect(content.getAttribute('role')).toBe('region')
    })

    test('content has aria-labelledby pointing to trigger', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const trigger = document.querySelector('ytz-accordion-item button')
      const content = document.querySelector('ytz-accordion-item > div')

      expect(content.getAttribute('aria-labelledby')).toBe(trigger.id)
      expect(trigger.id).toMatch(/^ytz-accordion-trigger-\d+$/)
    })

    test('preserves existing content id', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div id="my-content">Content</div>
        </ytz-accordion-item>
      `
      const trigger = document.querySelector('ytz-accordion-item button')
      const content = document.querySelector('#my-content')

      expect(trigger.getAttribute('aria-controls')).toBe('my-content')
      expect(content.id).toBe('my-content')
    })

    test('preserves existing trigger id', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button id="my-trigger">Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const trigger = document.querySelector('#my-trigger')
      const content = document.querySelector('ytz-accordion-item > div')

      expect(content.getAttribute('aria-labelledby')).toBe('my-trigger')
      expect(trigger.id).toBe('my-trigger')
    })
  })

  describe('state', () => {
    test('content is hidden when closed', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const content = document.querySelector('ytz-accordion-item > div')
      expect(content.hidden).toBe(true)
    })

    test('content is visible when open', () => {
      document.body.innerHTML = `
        <ytz-accordion-item open>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const content = document.querySelector('ytz-accordion-item > div')
      expect(content.hidden).toBe(false)
    })

    test('open attribute toggles visibility', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const item = document.querySelector('ytz-accordion-item')
      const content = item.querySelector('div')

      expect(content.hidden).toBe(true)

      item.setAttribute('open', '')
      expect(content.hidden).toBe(false)

      item.removeAttribute('open')
      expect(content.hidden).toBe(true)
    })

    test('open property syncs with attribute', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const item = document.querySelector('ytz-accordion-item')

      expect(item.open).toBe(false)

      item.open = true
      expect(item.hasAttribute('open')).toBe(true)
      expect(item.open).toBe(true)

      item.open = false
      expect(item.hasAttribute('open')).toBe(false)
      expect(item.open).toBe(false)
    })
  })

  describe('interaction', () => {
    test('clicking trigger toggles open state', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const item = document.querySelector('ytz-accordion-item')
      const trigger = item.querySelector('button')

      expect(item.open).toBe(false)

      trigger.click()
      expect(item.open).toBe(true)

      trigger.click()
      expect(item.open).toBe(false)
    })

    test('toggle() method toggles open state', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const item = document.querySelector('ytz-accordion-item')

      expect(item.open).toBe(false)

      item.toggle()
      expect(item.open).toBe(true)

      item.toggle()
      expect(item.open).toBe(false)
    })

    test('dispatches toggle event with open detail', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-accordion-item>
      `
      const item = document.querySelector('ytz-accordion-item')
      const handler = jest.fn()
      item.addEventListener('toggle', handler)

      item.querySelector('button').click()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail).toEqual({ open: true })
    })

    test('toggle event bubbles', () => {
      document.body.innerHTML = `
        <ytz-accordion>
          <ytz-accordion-item>
            <button>Toggle</button>
            <div>Content</div>
          </ytz-accordion-item>
        </ytz-accordion>
      `
      const accordion = document.querySelector('ytz-accordion')
      const handler = jest.fn()
      accordion.addEventListener('toggle', handler)

      document.querySelector('ytz-accordion-item button').click()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    test('handles missing button gracefully', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <div>Content only</div>
        </ytz-accordion-item>
      `
      const item = document.querySelector('ytz-accordion-item')
      expect(item).toBeTruthy()
    })

    test('handles missing content gracefully', () => {
      document.body.innerHTML = `
        <ytz-accordion-item>
          <button>Toggle only</button>
        </ytz-accordion-item>
      `
      const item = document.querySelector('ytz-accordion-item')
      expect(item).toBeTruthy()
    })
  })
})

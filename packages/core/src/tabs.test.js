/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './tabs.js'

describe('YtzTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('structure and roles', () => {
    test('ytz-tabs has role="tablist"', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelector('ytz-tabs')
      expect(tabs.getAttribute('role')).toBe('tablist')
    })

    test('ytz-tab has role="tab"', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const tab = document.querySelector('ytz-tab')
      expect(tab.getAttribute('role')).toBe('tab')
    })

    test('ytz-tabpanel has role="tabpanel"', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const panel = document.querySelector('ytz-tabpanel')
      expect(panel.getAttribute('role')).toBe('tabpanel')
    })
  })

  describe('ARIA attributes', () => {
    test('active tab has aria-selected="true"', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    })

    test('inactive tabs have aria-selected="false"', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      expect(tabs[1].getAttribute('aria-selected')).toBe('false')
    })

    test('active tab has tabindex="0"', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      expect(tabs[0].getAttribute('tabindex')).toBe('0')
    })

    test('inactive tabs have tabindex="-1"', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      expect(tabs[1].getAttribute('tabindex')).toBe('-1')
    })

    test('tab has aria-controls pointing to panel', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="my-panel">Tab 1</ytz-tab>
          <ytz-tabpanel id="my-panel">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const tab = document.querySelector('ytz-tab')
      expect(tab.getAttribute('aria-controls')).toBe('my-panel')
    })

    test('panel has aria-labelledby pointing to tab', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const tab = document.querySelector('ytz-tab')
      const panel = document.querySelector('ytz-tabpanel')
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
    })
  })

  describe('selection', () => {
    test('first tab selected by default', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabsEl = document.querySelector('ytz-tabs')
      expect(tabsEl.getAttribute('value')).toBe('p1')
    })

    test('clicking tab selects it', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[1].click()

      expect(document.querySelector('ytz-tabs').getAttribute('value')).toBe('p2')
      expect(tabs[0].getAttribute('aria-selected')).toBe('false')
      expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    })

    test('setting value selects corresponding tab', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabsEl = document.querySelector('ytz-tabs')
      tabsEl.value = 'p2'

      const tabs = document.querySelectorAll('ytz-tab')
      expect(tabs[0].getAttribute('aria-selected')).toBe('false')
      expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    })

    test('dispatches change event on selection', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabsEl = document.querySelector('ytz-tabs')
      const handler = jest.fn()
      tabsEl.addEventListener('change', handler)

      document.querySelectorAll('ytz-tab')[1].click()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail).toEqual({ value: 'p2' })
    })

    test('change event bubbles', () => {
      document.body.innerHTML = `
        <div id="parent">
          <ytz-tabs>
            <ytz-tab panel="p1">Tab 1</ytz-tab>
            <ytz-tab panel="p2">Tab 2</ytz-tab>
            <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
            <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
          </ytz-tabs>
        </div>
      `
      const parent = document.querySelector('#parent')
      const handler = jest.fn()
      parent.addEventListener('change', handler)

      document.querySelectorAll('ytz-tab')[1].click()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('keyboard navigation', () => {
    function pressKey(element, key) {
      element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    }

    test('ArrowRight moves to next tab', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[0].focus()

      pressKey(tabs[0], 'ArrowRight')

      expect(document.activeElement).toBe(tabs[1])
      expect(document.querySelector('ytz-tabs').value).toBe('p2')
    })

    test('ArrowLeft moves to previous tab', () => {
      document.body.innerHTML = `
        <ytz-tabs value="p2">
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[1].focus()

      pressKey(tabs[1], 'ArrowLeft')

      expect(document.activeElement).toBe(tabs[0])
      expect(document.querySelector('ytz-tabs').value).toBe('p1')
    })

    test('Home moves to first tab', () => {
      document.body.innerHTML = `
        <ytz-tabs value="p3">
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tab panel="p3">Tab 3</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
          <ytz-tabpanel id="p3">Content 3</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[2].focus()

      pressKey(tabs[2], 'Home')

      expect(document.activeElement).toBe(tabs[0])
      expect(document.querySelector('ytz-tabs').value).toBe('p1')
    })

    test('End moves to last tab', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tab panel="p3">Tab 3</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
          <ytz-tabpanel id="p3">Content 3</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[0].focus()

      pressKey(tabs[0], 'End')

      expect(document.activeElement).toBe(tabs[2])
      expect(document.querySelector('ytz-tabs').value).toBe('p3')
    })

    test('wraps from last to first', () => {
      document.body.innerHTML = `
        <ytz-tabs value="p2">
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[1].focus()

      pressKey(tabs[1], 'ArrowRight')

      expect(document.activeElement).toBe(tabs[0])
    })

    test('wraps from first to last', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[0].focus()

      pressKey(tabs[0], 'ArrowLeft')

      expect(document.activeElement).toBe(tabs[1])
    })
  })

  describe('vertical tabs', () => {
    function pressKey(element, key) {
      element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    }

    test('ArrowDown moves to next tab', () => {
      document.body.innerHTML = `
        <ytz-tabs orientation="vertical">
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[0].focus()

      pressKey(tabs[0], 'ArrowDown')

      expect(document.activeElement).toBe(tabs[1])
    })

    test('ArrowUp moves to previous tab', () => {
      document.body.innerHTML = `
        <ytz-tabs orientation="vertical" value="p2">
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabs = document.querySelectorAll('ytz-tab')
      tabs[1].focus()

      pressKey(tabs[1], 'ArrowUp')

      expect(document.activeElement).toBe(tabs[0])
    })
  })

  describe('panels', () => {
    test('only selected panel is visible', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const panels = document.querySelectorAll('ytz-tabpanel')
      expect(panels[0].hidden).toBe(false)
      expect(panels[1].hidden).toBe(true)
    })

    test('hidden panels have hidden attribute', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const panels = document.querySelectorAll('ytz-tabpanel')
      expect(panels[1].hasAttribute('hidden')).toBe(true)
    })

    test('switching tabs updates panel visibility', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabsEl = document.querySelector('ytz-tabs')
      const panels = document.querySelectorAll('ytz-tabpanel')

      tabsEl.value = 'p2'

      expect(panels[0].hidden).toBe(true)
      expect(panels[1].hidden).toBe(false)
    })
  })

  describe('public API', () => {
    test('value getter returns selected panel id', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabsEl = document.querySelector('ytz-tabs')
      expect(tabsEl.value).toBe('p1')
    })

    test('value setter updates selection', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tab panel="p2">Tab 2</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
          <ytz-tabpanel id="p2">Content 2</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabsEl = document.querySelector('ytz-tabs')
      tabsEl.value = 'p2'
      expect(tabsEl.getAttribute('value')).toBe('p2')
    })

    test('orientation getter returns orientation', () => {
      document.body.innerHTML = `
        <ytz-tabs orientation="vertical">
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabsEl = document.querySelector('ytz-tabs')
      expect(tabsEl.orientation).toBe('vertical')
    })

    test('orientation defaults to horizontal', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const tabsEl = document.querySelector('ytz-tabs')
      expect(tabsEl.orientation).toBe('horizontal')
    })

    test('tab panel getter returns panel id', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="my-panel">Tab 1</ytz-tab>
          <ytz-tabpanel id="my-panel">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      const tab = document.querySelector('ytz-tab')
      expect(tab.panel).toBe('my-panel')
    })
  })

  describe('edge cases', () => {
    test('handles empty tabs gracefully', () => {
      document.body.innerHTML = `<ytz-tabs></ytz-tabs>`
      const tabsEl = document.querySelector('ytz-tabs')
      expect(tabsEl.value).toBeNull()
    })

    test('handles tabs without panels', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tab panel="p1">Tab 1</ytz-tab>
        </ytz-tabs>
      `
      // Should not throw
      const tabsEl = document.querySelector('ytz-tabs')
      expect(tabsEl.value).toBe('p1')
    })

    test('handles panels without tabs', () => {
      document.body.innerHTML = `
        <ytz-tabs>
          <ytz-tabpanel id="p1">Content 1</ytz-tabpanel>
        </ytz-tabs>
      `
      // Should not throw
      const panel = document.querySelector('ytz-tabpanel')
      expect(panel.getAttribute('aria-labelledby')).toBeNull()
    })
  })
})

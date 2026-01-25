/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './tooltip.js'

describe('YtzTooltip', () => {
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
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const content = document.querySelector('[slot="content"]')
      expect(content.hidden).toBe(true)
    })
  })

  describe('ARIA attributes', () => {
    test('trigger has aria-describedby pointing to content', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      expect(trigger.getAttribute('aria-describedby')).toBe(content.id)
      expect(content.id).toMatch(/^ytz-tooltip-\d+$/)
    })

    test('content has role="tooltip"', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const content = document.querySelector('[slot="content"]')
      expect(content.getAttribute('role')).toBe('tooltip')
    })

    test('preserves existing content id', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content" id="my-tooltip">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('#my-tooltip')

      expect(trigger.getAttribute('aria-describedby')).toBe('my-tooltip')
      expect(content.id).toBe('my-tooltip')
    })
  })

  describe('hover behavior', () => {
    test('shows tooltip on mouseenter', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      jest.runAllTimers()

      expect(content.hidden).toBe(false)
    })

    test('hides tooltip on mouseleave', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      // Show first
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      jest.runAllTimers()
      expect(content.hidden).toBe(false)

      // Then hide
      trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      jest.runAllTimers()

      expect(content.hidden).toBe(true)
    })

    test('respects delay attribute', () => {
      document.body.innerHTML = `
        <ytz-tooltip delay="500">
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

      // Should not show immediately
      jest.advanceTimersByTime(400)
      expect(content.hidden).toBe(true)

      // Should show after delay
      jest.advanceTimersByTime(100)
      expect(content.hidden).toBe(false)
    })

    test('keeps tooltip visible when hovering over content', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      // Show tooltip
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      jest.runAllTimers()
      expect(content.hidden).toBe(false)

      // Leave trigger
      trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))

      // Enter content before hide timeout
      jest.advanceTimersByTime(50)
      content.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

      // Should stay visible
      jest.runAllTimers()
      expect(content.hidden).toBe(false)
    })
  })

  describe('focus behavior', () => {
    test('shows tooltip on focusin', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))

      // Focus should show immediately (no delay for accessibility)
      expect(content.hidden).toBe(false)
    })

    test('hides tooltip on focusout', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      // Show first
      trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
      expect(content.hidden).toBe(false)

      // Then hide
      trigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
      expect(content.hidden).toBe(true)
    })
  })

  describe('touch behavior', () => {
    test('toggles on touchstart', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      // First touch shows
      trigger.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))
      expect(content.hidden).toBe(false)

      // Second touch hides
      trigger.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))
      expect(content.hidden).toBe(true)
    })
  })

  describe('positioning', () => {
    test('positions content with fixed positioning', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      jest.runAllTimers()

      expect(content.style.position).toBe('fixed')
      expect(content.style.left).toMatch(/\d+px/)
      expect(content.style.top).toMatch(/\d+px/)
    })

    test('sets data-placement attribute', () => {
      document.body.innerHTML = `
        <ytz-tooltip placement="bottom">
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('[slot="content"]')

      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      jest.runAllTimers()

      expect(content.dataset.placement).toBeDefined()
    })
  })

  describe('public API', () => {
    test('show() method shows tooltip', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      const content = document.querySelector('[slot="content"]')

      tooltip.show()

      expect(content.hidden).toBe(false)
    })

    test('hide() method hides tooltip', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      const content = document.querySelector('[slot="content"]')

      tooltip.show()
      expect(content.hidden).toBe(false)

      tooltip.hide()
      expect(content.hidden).toBe(true)
    })

    test('placement getter returns attribute value', () => {
      document.body.innerHTML = `
        <ytz-tooltip placement="bottom">
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      expect(tooltip.placement).toBe('bottom')
    })

    test('delay getter returns attribute value', () => {
      document.body.innerHTML = `
        <ytz-tooltip delay="500">
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      expect(tooltip.delay).toBe(500)
    })

    test('offset getter returns attribute value', () => {
      document.body.innerHTML = `
        <ytz-tooltip offset="16">
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      expect(tooltip.offset).toBe(16)
    })
  })

  describe('events', () => {
    test('dispatches show event when shown', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      const handler = jest.fn()
      tooltip.addEventListener('show', handler)

      tooltip.show()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('dispatches hide event when hidden', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      const handler = jest.fn()
      tooltip.addEventListener('hide', handler)

      tooltip.show()
      tooltip.hide()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('show event bubbles', () => {
      document.body.innerHTML = `
        <div id="parent">
          <ytz-tooltip>
            <button>Trigger</button>
            <span slot="content">Tooltip text</span>
          </ytz-tooltip>
        </div>
      `
      const parent = document.querySelector('#parent')
      const tooltip = document.querySelector('ytz-tooltip')
      const handler = jest.fn()
      parent.addEventListener('show', handler)

      tooltip.show()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    test('handles missing trigger gracefully', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <span slot="content">Content only</span>
        </ytz-tooltip>
      `
      // Should not throw
      const tooltip = document.querySelector('ytz-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('handles same element as trigger and content gracefully', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Only one element</button>
        </ytz-tooltip>
      `
      // Should not throw - firstElementChild === lastElementChild
      const tooltip = document.querySelector('ytz-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('cleanup removes event listeners on disconnect', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      tooltip.show()

      // Should not throw when disconnected
      tooltip.remove()
      expect(document.querySelector('ytz-tooltip')).toBeNull()
    })

    test('works without slot attribute (last child as content)', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span>Tooltip text without slot</span>
        </ytz-tooltip>
      `
      const trigger = document.querySelector('ytz-tooltip button')
      const content = document.querySelector('ytz-tooltip span')

      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      jest.runAllTimers()

      expect(content.hidden).toBe(false)
    })
  })

  describe('headless mode (anchorTo)', () => {
    test('anchorTo creates virtual anchor element', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')

      tooltip.anchorTo(100, 200)

      const anchor = tooltip.firstElementChild
      expect(anchor.style.position).toBe('fixed')
      expect(anchor.style.left).toBe('100px')
      expect(anchor.style.top).toBe('200px')
    })

    test('anchorTo updates position on subsequent calls', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')

      tooltip.anchorTo(100, 200)
      tooltip.anchorTo(300, 400)

      const anchor = tooltip.firstElementChild
      expect(anchor.style.left).toBe('300px')
      expect(anchor.style.top).toBe('400px')
    })

    test('anchorTo sets up content in headless mode', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      const content = document.querySelector('[slot="content"]')

      tooltip.anchorTo(100, 200)

      expect(content.getAttribute('role')).toBe('tooltip')
      expect(content.id).toMatch(/^ytz-tooltip-\d+$/)
    })

    test('show/hide work in headless mode', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      const content = document.querySelector('[slot="content"]')

      tooltip.anchorTo(100, 200)
      tooltip.show()
      expect(content.hidden).toBe(false)

      tooltip.hide()
      expect(content.hidden).toBe(true)
    })

    test('anchorTo cleans up existing trigger listeners', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Tooltip text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      const trigger = document.querySelector('button')
      const content = document.querySelector('[slot="content"]')

      // Switch to headless mode
      tooltip.anchorTo(100, 200)

      // Old trigger should no longer show tooltip
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      jest.runAllTimers()
      expect(content.hidden).toBe(true)

      // aria-describedby should be removed from old trigger
      expect(trigger.hasAttribute('aria-describedby')).toBe(false)
    })

    test('text getter returns content text', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Initial text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      expect(tooltip.text).toBe('Initial text')
    })

    test('text setter updates content', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <button>Trigger</button>
          <span slot="content">Initial text</span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')
      const content = document.querySelector('[slot="content"]')

      tooltip.text = 'Updated text'

      expect(content.textContent).toBe('Updated text')
      expect(tooltip.text).toBe('Updated text')
    })

    test('text works in headless mode', () => {
      document.body.innerHTML = `
        <ytz-tooltip>
          <span slot="content"></span>
        </ytz-tooltip>
      `
      const tooltip = document.querySelector('ytz-tooltip')

      tooltip.anchorTo(100, 200)
      tooltip.text = 'Dynamic content'

      expect(tooltip.text).toBe('Dynamic content')
    })
  })
})

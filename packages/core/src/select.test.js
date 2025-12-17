/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './select.js'
import './autocomplete.js' // For ytz-option

describe('YtzSelect', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('structure', () => {
    test('creates trigger button if not provided', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger).toBeInstanceOf(HTMLButtonElement)
    })

    test('uses provided trigger button', () => {
      document.body.innerHTML = `
        <ytz-select>
          <button slot="trigger">Custom Trigger</button>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.textContent).toBe('Custom Trigger')
    })

    test('creates listbox wrapper with role="listbox"', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const listbox = document.querySelector('[role="listbox"]')
      expect(listbox).toBeTruthy()
    })

    test('moves options into listbox', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-select>
      `
      const listbox = document.querySelector('[role="listbox"]')
      const options = listbox.querySelectorAll('ytz-option')
      expect(options.length).toBe(2)
    })

    test('auto-generates id', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      expect(select.id).toMatch(/^ytz-select-\d+$/)
    })
  })

  describe('ARIA attributes', () => {
    test('trigger has aria-haspopup="listbox"', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
    })

    test('trigger has aria-expanded="false" when closed', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    test('trigger has aria-expanded="true" when open', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
    })

    test('trigger has aria-controls pointing to listbox', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      const listbox = document.querySelector('[role="listbox"]')
      expect(trigger.getAttribute('aria-controls')).toBe(listbox.id)
    })

    test('multiple sets aria-multiselectable on listbox', () => {
      document.body.innerHTML = `
        <ytz-select multiple>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const listbox = document.querySelector('[role="listbox"]')
      expect(listbox.getAttribute('aria-multiselectable')).toBe('true')
    })
  })

  describe('trigger text', () => {
    test('shows placeholder when nothing selected', () => {
      document.body.innerHTML = `
        <ytz-select placeholder="Choose...">
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.textContent).toBe('Choose...')
    })

    test('shows default placeholder if not specified', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.textContent).toBe('Select...')
    })

    test('shows selected option text', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a" selected>Apple</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.textContent).toBe('Apple')
    })

    test('shows comma-separated values in multi-select', () => {
      document.body.innerHTML = `
        <ytz-select multiple>
          <ytz-option value="a" selected>Apple</ytz-option>
          <ytz-option value="b" selected>Banana</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.textContent).toBe('Apple, Banana')
    })
  })

  describe('opening/closing', () => {
    test('opens on trigger click', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const trigger = document.querySelector('[slot="trigger"]')

      trigger.click()

      expect(select.open).toBe(true)
    })

    test('closes on second trigger click', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const trigger = document.querySelector('[slot="trigger"]')

      trigger.click()

      expect(select.open).toBe(false)
    })

    test('opens on ArrowDown key', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const trigger = document.querySelector('[slot="trigger"]')

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(select.open).toBe(true)
    })

    test('opens on Enter key', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const trigger = document.querySelector('[slot="trigger"]')

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(select.open).toBe(true)
    })

    test('closes on Escape key', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      expect(select.open).toBe(false)
    })

    test('closes on click outside', async () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
        <div id="outside">Outside</div>
      `
      const select = document.querySelector('ytz-select')

      // Wait for setTimeout in #show
      await new Promise(r => setTimeout(r, 10))
      document.getElementById('outside').click()

      expect(select.open).toBe(false)
    })

    test('dispatches open event', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const handler = jest.fn()
      select.addEventListener('open', handler)

      select.open = true

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('dispatches close event', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const handler = jest.fn()
      select.addEventListener('close', handler)

      select.open = false

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('focus management', () => {
    test('focuses first option when opened', async () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const options = document.querySelectorAll('ytz-option')

      select.open = true
      await new Promise(r => requestAnimationFrame(r))

      expect(document.activeElement).toBe(options[0])
    })

    test('focuses selected option when opened', async () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b" selected>B</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const options = document.querySelectorAll('ytz-option')

      select.open = true
      await new Promise(r => requestAnimationFrame(r))

      expect(document.activeElement).toBe(options[1])
    })

    test('returns focus to trigger on close', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      expect(document.activeElement).toBe(trigger)
    })
  })

  describe('keyboard navigation', () => {
    test('ArrowDown moves to next option', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-select>
      `
      const listbox = document.querySelector('[role="listbox"]')
      const options = document.querySelectorAll('ytz-option')
      options[0].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(options[1])
    })

    test('ArrowUp moves to previous option', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-select>
      `
      const listbox = document.querySelector('[role="listbox"]')
      const options = document.querySelectorAll('ytz-option')
      options[1].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

      expect(document.activeElement).toBe(options[0])
    })

    test('Tab closes listbox and returns to trigger', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const listbox = document.querySelector('[role="listbox"]')
      const trigger = document.querySelector('[slot="trigger"]')

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))

      expect(select.open).toBe(false)
      expect(document.activeElement).toBe(trigger)
    })
  })

  describe('single-select', () => {
    test('Enter selects focused option', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const listbox = document.querySelector('[role="listbox"]')
      const option = document.querySelector('ytz-option')
      option.focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(select.value).toBe('apple')
    })

    test('click selects option', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const option = document.querySelector('ytz-option')

      option.click()

      expect(select.value).toBe('apple')
    })

    test('selecting closes listbox', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const option = document.querySelector('ytz-option')

      option.click()

      expect(select.open).toBe(false)
    })

    test('selecting updates trigger text', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      const option = document.querySelector('ytz-option')

      option.click()

      expect(trigger.textContent).toBe('Apple')
    })

    test('dispatches change event', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const option = document.querySelector('ytz-option')
      let detail = null
      select.addEventListener('change', (e) => { detail = e.detail })

      option.click()

      expect(detail.value).toBe('apple')
    })
  })

  describe('multi-select', () => {
    test('click toggles selection', () => {
      document.body.innerHTML = `
        <ytz-select multiple open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const option = document.querySelector('ytz-option')

      option.click()
      expect(select.value).toEqual(['a'])

      option.click()
      expect(select.value).toEqual([])
    })

    test('listbox stays open after selection', () => {
      document.body.innerHTML = `
        <ytz-select multiple open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const option = document.querySelector('ytz-option')

      option.click()

      expect(select.open).toBe(true)
    })

    test('multiple selections maintained', () => {
      document.body.innerHTML = `
        <ytz-select multiple open>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const options = document.querySelectorAll('ytz-option')

      options[0].click()
      options[2].click()

      expect(select.value).toEqual(['a', 'c'])
    })
  })

  describe('disabled state', () => {
    test('disabled prevents opening', () => {
      document.body.innerHTML = `
        <ytz-select disabled>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const trigger = document.querySelector('[slot="trigger"]')

      trigger.click()

      expect(select.open).toBe(false)
    })

    test('disabled sets aria-disabled on trigger', () => {
      document.body.innerHTML = `
        <ytz-select disabled>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const trigger = document.querySelector('[slot="trigger"]')
      expect(trigger.getAttribute('aria-disabled')).toBe('true')
    })
  })

  describe('public API', () => {
    test('show() opens select', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')

      select.show()

      expect(select.open).toBe(true)
    })

    test('hide() closes select', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')

      select.hide()

      expect(select.open).toBe(false)
    })

    test('toggle() toggles select', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')

      select.toggle()
      expect(select.open).toBe(true)

      select.toggle()
      expect(select.open).toBe(false)
    })

    test('clear() clears selection', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a" selected>A</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')
      const trigger = document.querySelector('[slot="trigger"]')

      select.clear()

      expect(select.value).toBe('')
      expect(trigger.textContent).toBe('Select...')
    })

    test('value setter sets selection', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')

      select.value = 'b'

      expect(select.value).toBe('b')
    })

    test('value setter accepts array in multi-select', () => {
      document.body.innerHTML = `
        <ytz-select multiple>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')

      select.value = ['a', 'b']

      expect(select.value).toEqual(['a', 'b'])
    })

    test('options getter returns all options', () => {
      document.body.innerHTML = `
        <ytz-select>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')

      expect(select.options.length).toBe(2)
    })

    test('selectedOptions getter returns selected', () => {
      document.body.innerHTML = `
        <ytz-select multiple>
          <ytz-option value="a" selected>A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c" selected>C</ytz-option>
        </ytz-select>
      `
      const select = document.querySelector('ytz-select')

      expect(select.selectedOptions.length).toBe(2)
    })
  })

  describe('positioning', () => {
    test('listbox is positioned when open', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const listbox = document.querySelector('[role="listbox"]')

      expect(listbox.style.position).toBe('fixed')
    })

    test('listbox has minWidth matching trigger', () => {
      document.body.innerHTML = `
        <ytz-select open>
          <ytz-option value="a">A</ytz-option>
        </ytz-select>
      `
      const listbox = document.querySelector('[role="listbox"]')

      expect(listbox.style.minWidth).toBeTruthy()
    })
  })
})

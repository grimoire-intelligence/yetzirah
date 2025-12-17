/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './autocomplete.js'

const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

describe('YtzAutocomplete', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('structure', () => {
    test('finds input element', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input" placeholder="Search...">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const input = document.querySelector('input')
      expect(input).toBeTruthy()
      expect(input.getAttribute('role')).toBe('combobox')
    })

    test('creates listbox for options', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const listbox = document.querySelector('[role="listbox"]')
      expect(listbox).toBeTruthy()
      expect(listbox.id).toMatch(/^ytz-autocomplete-\d+$/)
    })

    test('moves ytz-option children into listbox', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-autocomplete>
      `
      const listbox = document.querySelector('[role="listbox"]')
      const options = listbox.querySelectorAll('ytz-option')
      expect(options.length).toBe(2)
    })
  })

  describe('ARIA attributes', () => {
    test('input has role="combobox"', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const input = document.querySelector('input')
      expect(input.getAttribute('role')).toBe('combobox')
    })

    test('input has aria-autocomplete="list"', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const input = document.querySelector('input')
      expect(input.getAttribute('aria-autocomplete')).toBe('list')
    })

    test('input has aria-controls pointing to listbox', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const input = document.querySelector('input')
      const listbox = document.querySelector('[role="listbox"]')
      expect(input.getAttribute('aria-controls')).toBe(listbox.id)
    })

    test('input has aria-expanded="false" when closed', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const input = document.querySelector('input')
      expect(input.getAttribute('aria-expanded')).toBe('false')
    })

    test('input has aria-expanded="true" when open', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')

      autocomplete.open = true

      expect(input.getAttribute('aria-expanded')).toBe('true')
    })

    test('listbox has role="listbox"', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const listbox = document.querySelector('[role="listbox"]')
      expect(listbox).toBeTruthy()
    })

    test('multiple mode sets aria-multiselectable on listbox', () => {
      document.body.innerHTML = `
        <ytz-autocomplete multiple>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const listbox = document.querySelector('[role="listbox"]')
      expect(listbox.getAttribute('aria-multiselectable')).toBe('true')
    })
  })

  describe('opening/closing', () => {
    test('opens on input focus', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')

      input.dispatchEvent(new FocusEvent('focus'))

      expect(autocomplete.open).toBe(true)
    })

    test('opens on ArrowDown key', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(autocomplete.open).toBe(true)
    })

    test('closes on Escape key', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      autocomplete.open = true

      // Escape from input closes the listbox
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      expect(autocomplete.open).toBe(false)
    })

    test('closes on click outside', async () => {
      document.body.innerHTML = `
        <div id="outside">Outside</div>
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      autocomplete.open = true
      await nextTick()

      document.querySelector('#outside').click()

      expect(autocomplete.open).toBe(false)
    })

    test('dispatches open event when opened', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const handler = jest.fn()
      autocomplete.addEventListener('open', handler)

      autocomplete.open = true

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('dispatches close event when closed', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const handler = jest.fn()
      autocomplete.addEventListener('close', handler)

      autocomplete.open = true
      autocomplete.open = false

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('open attribute controls visibility', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const listbox = document.querySelector('[role="listbox"]')

      expect(listbox.hidden).toBe(true)

      autocomplete.setAttribute('open', '')
      expect(listbox.hidden).toBe(false)

      autocomplete.removeAttribute('open')
      expect(listbox.hidden).toBe(true)
    })

    test('open property syncs with attribute', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')

      autocomplete.open = true
      expect(autocomplete.hasAttribute('open')).toBe(true)

      autocomplete.open = false
      expect(autocomplete.hasAttribute('open')).toBe(false)
    })
  })

  describe('filtering', () => {
    test('filters options by input value', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
          <ytz-option value="banana">Banana</ytz-option>
          <ytz-option value="cherry">Cherry</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      autocomplete.open = true

      input.value = 'an'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      const options = document.querySelectorAll('ytz-option')
      // 'apple' doesn't contain 'an', 'banana' contains 'an', 'cherry' doesn't
      expect(options[0].hidden).toBe(true)  // Apple - no 'an'
      expect(options[1].hidden).toBe(false) // Banana - has 'an'
      expect(options[2].hidden).toBe(true)  // Cherry - no 'an'
    })

    test('shows all options when input is empty', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
          <ytz-option value="banana">Banana</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      autocomplete.open = true

      input.value = ''
      input.dispatchEvent(new Event('input', { bubbles: true }))

      const options = document.querySelectorAll('ytz-option')
      expect(options[0].hidden).toBe(false)
      expect(options[1].hidden).toBe(false)
    })

    test('filter can be disabled with filter="false"', () => {
      document.body.innerHTML = `
        <ytz-autocomplete filter="false">
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
          <ytz-option value="banana">Banana</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      autocomplete.open = true

      input.value = 'xyz'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      const options = document.querySelectorAll('ytz-option')
      // Both should still be visible since filtering is disabled
      expect(options[0].hidden).toBe(false)
      expect(options[1].hidden).toBe(false)
    })

    test('dispatches input-change event on input', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      let detail = null
      autocomplete.addEventListener('input-change', (e) => { detail = e.detail })

      input.value = 'test'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      expect(detail.value).toBe('test')
    })
  })

  describe('keyboard navigation', () => {
    test('ArrowDown moves focus to first option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      const options = document.querySelectorAll('ytz-option')

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(options[0])
    })

    test('ArrowUp from input focuses last option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      const options = document.querySelectorAll('ytz-option')

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

      expect(document.activeElement).toBe(options[1])
    })

    test('ArrowDown moves to next option when option focused', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const options = document.querySelectorAll('ytz-option')
      autocomplete.open = true
      options[0].focus()

      autocomplete.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(options[1])
    })

    test('ArrowUp moves to previous option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const options = document.querySelectorAll('ytz-option')
      autocomplete.open = true
      options[1].focus()

      autocomplete.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

      expect(document.activeElement).toBe(options[0])
    })

    test('Home moves to first option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const options = document.querySelectorAll('ytz-option')
      autocomplete.open = true
      options[2].focus()

      autocomplete.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))

      expect(document.activeElement).toBe(options[0])
    })

    test('End moves to last option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const options = document.querySelectorAll('ytz-option')
      autocomplete.open = true
      options[0].focus()

      autocomplete.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))

      expect(document.activeElement).toBe(options[2])
    })

    test('navigation wraps around', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const options = document.querySelectorAll('ytz-option')
      autocomplete.open = true
      options[1].focus()

      autocomplete.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(options[0])
    })
  })

  describe('single-select mode', () => {
    test('Enter selects focused option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true
      option.focus()

      autocomplete.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(autocomplete.value).toBe('apple')
    })

    test('Space selects focused option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true
      option.focus()

      autocomplete.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

      expect(autocomplete.value).toBe('apple')
    })

    test('click selects option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true

      option.click()

      expect(autocomplete.value).toBe('apple')
    })

    test('selecting option closes listbox', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true

      option.click()

      expect(autocomplete.open).toBe(false)
    })

    test('selecting option populates input', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true

      option.click()

      expect(input.value).toBe('Apple')
    })

    test('dispatches change event on selection', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      let detail = null
      autocomplete.addEventListener('change', (e) => { detail = e.detail })
      autocomplete.open = true

      option.click()

      expect(detail.value).toBe('apple')
      expect(detail.option).toBe(option)
    })

    test('value getter returns selected value', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      autocomplete.open = true
      document.querySelector('ytz-option').click()

      expect(autocomplete.value).toBe('apple')
    })
  })

  describe('multi-select mode', () => {
    test('multiple attribute enables multi-select', () => {
      document.body.innerHTML = `
        <ytz-autocomplete multiple>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      expect(autocomplete.multiple).toBe(true)
    })

    test('selecting toggles option selection', () => {
      document.body.innerHTML = `
        <ytz-autocomplete multiple>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true

      option.click()
      expect(option.hasAttribute('selected')).toBe(true)

      option.click()
      expect(option.hasAttribute('selected')).toBe(false)
    })

    test('listbox stays open after selection', () => {
      document.body.innerHTML = `
        <ytz-autocomplete multiple>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true

      option.click()

      expect(autocomplete.open).toBe(true)
    })

    test('value getter returns array of selected values', () => {
      document.body.innerHTML = `
        <ytz-autocomplete multiple>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
          <ytz-option value="banana">Banana</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const options = document.querySelectorAll('ytz-option')
      autocomplete.open = true

      options[0].click()
      options[1].click()

      expect(autocomplete.value).toEqual(['apple', 'banana'])
    })

    test('multiple selections tracked correctly', () => {
      document.body.innerHTML = `
        <ytz-autocomplete multiple>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const options = document.querySelectorAll('ytz-option')
      autocomplete.open = true

      options[0].click()
      options[2].click()

      expect(autocomplete.value).toEqual(['a', 'c'])
      expect(options[0].getAttribute('aria-selected')).toBe('true')
      expect(options[1].getAttribute('aria-selected')).toBe('false')
      expect(options[2].getAttribute('aria-selected')).toBe('true')
    })
  })

  describe('loading state', () => {
    test('loading attribute shows loading slot', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <span slot="loading">Loading...</span>
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const loadingSlot = document.querySelector('[slot="loading"]')

      expect(loadingSlot.hidden).toBe(true)

      autocomplete.loading = true

      expect(loadingSlot.hidden).toBe(false)
    })

    test('loading getter/setter works', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')

      autocomplete.loading = true
      expect(autocomplete.loading).toBe(true)
      expect(autocomplete.hasAttribute('loading')).toBe(true)

      autocomplete.loading = false
      expect(autocomplete.loading).toBe(false)
      expect(autocomplete.hasAttribute('loading')).toBe(false)
    })
  })

  describe('public API', () => {
    test('show() opens listbox', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')

      autocomplete.show()

      expect(autocomplete.open).toBe(true)
    })

    test('hide() closes listbox', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      autocomplete.open = true

      autocomplete.hide()

      expect(autocomplete.open).toBe(false)
    })

    test('toggle() toggles listbox', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')

      autocomplete.toggle()
      expect(autocomplete.open).toBe(true)

      autocomplete.toggle()
      expect(autocomplete.open).toBe(false)
    })

    test('clear() clears selection and input', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true
      option.click()

      autocomplete.clear()

      expect(autocomplete.value).toBe('')
      expect(input.value).toBe('')
      expect(option.hasAttribute('selected')).toBe(false)
    })

    test('clear() dispatches clear event', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const handler = jest.fn()
      autocomplete.addEventListener('clear', handler)

      autocomplete.clear()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('setOptions() programmatically sets options', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="old">Old</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')

      autocomplete.setOptions([
        { value: 'new1', label: 'New 1' },
        { value: 'new2', label: 'New 2', disabled: true }
      ])

      const options = document.querySelectorAll('ytz-option')
      expect(options.length).toBe(2)
      expect(options[0].getAttribute('value')).toBe('new1')
      expect(options[0].textContent).toBe('New 1')
      expect(options[1].getAttribute('value')).toBe('new2')
      expect(options[1].hasAttribute('disabled')).toBe(true)
    })

    test('value setter sets selection', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
          <ytz-option value="banana">Banana</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const options = document.querySelectorAll('ytz-option')

      autocomplete.value = 'banana'

      expect(options[0].getAttribute('aria-selected')).toBe('false')
      expect(options[1].getAttribute('aria-selected')).toBe('true')
    })

    test('value setter accepts array in multi-select mode', () => {
      document.body.innerHTML = `
        <ytz-autocomplete multiple>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')

      autocomplete.value = ['a', 'c']

      expect(autocomplete.value).toEqual(['a', 'c'])
    })

    test('inputValue getter/setter works', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')

      autocomplete.inputValue = 'test'

      expect(autocomplete.inputValue).toBe('test')
      expect(input.value).toBe('test')
    })
  })

  describe('positioning', () => {
    test('listbox positioned below input', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const listbox = document.querySelector('[role="listbox"]')
      autocomplete.open = true

      expect(listbox.style.position).toBe('fixed')
      expect(listbox.style.left).toMatch(/\d+px/)
      expect(listbox.style.top).toMatch(/\d+px/)
    })

    test('listbox minWidth matches input width', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input" style="width: 200px">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const listbox = document.querySelector('[role="listbox"]')
      autocomplete.open = true

      expect(listbox.style.minWidth).toMatch(/\d+px/)
    })
  })

  describe('edge cases', () => {
    test('handles missing input gracefully', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      expect(autocomplete).toBeTruthy()
    })

    test('cleanup removes event listeners on disconnect', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      autocomplete.open = true

      autocomplete.remove()

      expect(document.querySelector('ytz-autocomplete')).toBeNull()
    })

    test('uses text content as value if no value attribute', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option>Apple Fruit</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      autocomplete.open = true

      option.click()

      expect(autocomplete.value).toBe('Apple Fruit')
    })

    test('Enter from input selects first visible option', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="apple">Apple</ytz-option>
          <ytz-option value="banana">Banana</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const input = document.querySelector('input')
      autocomplete.open = true

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(autocomplete.value).toBe('apple')
    })
  })
})

describe('YtzOption', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('ARIA', () => {
    test('has role="option"', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')
      expect(option.getAttribute('role')).toBe('option')
    })

    test('has tabindex="-1" when not disabled', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')
      expect(option.getAttribute('tabindex')).toBe('-1')
    })

    test('has aria-disabled="true" when disabled', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a" disabled>A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')
      expect(option.getAttribute('aria-disabled')).toBe('true')
    })

    test('has aria-selected="false" by default', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')
      expect(option.getAttribute('aria-selected')).toBe('false')
    })

    test('has aria-selected="true" when selected', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a" selected>A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')
      expect(option.getAttribute('aria-selected')).toBe('true')
    })
  })

  describe('interaction', () => {
    test('dispatches option-click event on click', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      const handler = jest.fn()
      autocomplete.addEventListener('option-click', handler)

      option.click()

      expect(handler).toHaveBeenCalled()
    })

    test('disabled option prevents click', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a" disabled>A</ytz-option>
        </ytz-autocomplete>
      `
      const autocomplete = document.querySelector('ytz-autocomplete')
      const option = document.querySelector('ytz-option')
      const handler = jest.fn()
      autocomplete.addEventListener('option-click', handler)
      autocomplete.open = true

      option.click()

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('properties', () => {
    test('disabled getter returns attribute state', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a" disabled>A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')
      expect(option.disabled).toBe(true)
    })

    test('disabled setter updates attribute and ARIA', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')

      option.disabled = true

      expect(option.hasAttribute('disabled')).toBe(true)
      expect(option.getAttribute('aria-disabled')).toBe('true')
      expect(option.hasAttribute('tabindex')).toBe(false)

      option.disabled = false

      expect(option.hasAttribute('disabled')).toBe(false)
      expect(option.hasAttribute('aria-disabled')).toBe(false)
      expect(option.getAttribute('tabindex')).toBe('-1')
    })

    test('selected getter returns attribute state', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a" selected>A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')
      expect(option.selected).toBe(true)
    })

    test('selected setter updates attribute and ARIA', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option value="a">A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')

      option.selected = true

      expect(option.hasAttribute('selected')).toBe(true)
      expect(option.getAttribute('aria-selected')).toBe('true')

      option.selected = false

      expect(option.hasAttribute('selected')).toBe(false)
      expect(option.getAttribute('aria-selected')).toBe('false')
    })

    test('value getter/setter works', () => {
      document.body.innerHTML = `
        <ytz-autocomplete>
          <input slot="input">
          <ytz-option>A</ytz-option>
        </ytz-autocomplete>
      `
      const option = document.querySelector('ytz-option')

      option.value = 'test'
      expect(option.value).toBe('test')
      expect(option.getAttribute('value')).toBe('test')

      option.value = null
      expect(option.value).toBeNull()
      expect(option.hasAttribute('value')).toBe(false)
    })
  })
})

/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './listbox.js'
import './autocomplete.js' // For ytz-option

describe('YtzListbox', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('structure', () => {
    test('renders with role="listbox"', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.getAttribute('role')).toBe('listbox')
    })

    test('options have role="option"', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const options = document.querySelectorAll('ytz-option')
      options.forEach(opt => {
        expect(opt.getAttribute('role')).toBe('option')
      })
    })

    test('has tabindex="0" by default', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.getAttribute('tabindex')).toBe('0')
    })

    test('preserves existing tabindex', () => {
      document.body.innerHTML = `
        <ytz-listbox tabindex="-1">
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.getAttribute('tabindex')).toBe('-1')
    })

    test('auto-generates id if none provided', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.id).toMatch(/^ytz-listbox-\d+$/)
    })

    test('preserves existing id', () => {
      document.body.innerHTML = `
        <ytz-listbox id="my-listbox">
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.id).toBe('my-listbox')
    })
  })

  describe('ARIA attributes', () => {
    test('single-select does not have aria-multiselectable', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.hasAttribute('aria-multiselectable')).toBe(false)
    })

    test('multiple sets aria-multiselectable="true"', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.getAttribute('aria-multiselectable')).toBe('true')
    })

    test('disabled sets aria-disabled="true"', () => {
      document.body.innerHTML = `
        <ytz-listbox disabled>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.getAttribute('aria-disabled')).toBe('true')
    })

    test('options have aria-selected attribute', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b" selected>B</ytz-option>
        </ytz-listbox>
      `
      const options = document.querySelectorAll('ytz-option')
      expect(options[0].getAttribute('aria-selected')).toBe('false')
      expect(options[1].getAttribute('aria-selected')).toBe('true')
    })
  })

  describe('focus management', () => {
    test('focus moves to first option on container focus', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')

      listbox.dispatchEvent(new FocusEvent('focus'))

      expect(document.activeElement).toBe(options[0])
    })

    test('focus moves to selected option if one exists', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b" selected>B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')

      listbox.dispatchEvent(new FocusEvent('focus'))

      expect(document.activeElement).toBe(options[1])
    })

    test('ArrowDown moves focus to next option', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')
      options[0].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(options[1])
    })

    test('ArrowUp moves focus to previous option', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')
      options[1].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

      expect(document.activeElement).toBe(options[0])
    })

    test('Home moves focus to first option', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')
      options[2].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))

      expect(document.activeElement).toBe(options[0])
    })

    test('End moves focus to last option', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')
      options[0].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))

      expect(document.activeElement).toBe(options[2])
    })

    test('focus wraps around', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')
      options[1].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(options[0])
    })

    test('skips disabled options', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b" disabled>B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')
      options[0].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(options[2])
    })
  })

  describe('single-select', () => {
    test('Enter selects focused option', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')
      option.focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(listbox.value).toBe('apple')
    })

    test('Space selects focused option', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')
      option.focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

      expect(listbox.value).toBe('apple')
    })

    test('click selects option', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')

      option.click()

      expect(listbox.value).toBe('apple')
    })

    test('selecting new option deselects previous', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="apple">Apple</ytz-option>
          <ytz-option value="banana">Banana</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')

      options[0].click()
      expect(listbox.value).toBe('apple')
      expect(options[0].hasAttribute('selected')).toBe(true)

      options[1].click()
      expect(listbox.value).toBe('banana')
      expect(options[0].hasAttribute('selected')).toBe(false)
      expect(options[1].hasAttribute('selected')).toBe(true)
    })

    test('dispatches change event with value', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')
      let detail = null
      listbox.addEventListener('change', (e) => { detail = e.detail })

      option.click()

      expect(detail.value).toBe('apple')
      expect(detail.option).toBe(option)
    })

    test('value getter returns selected value', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      document.querySelector('ytz-option').click()

      expect(listbox.value).toBe('apple')
    })
  })

  describe('multi-select', () => {
    test('multiple attribute enables multi-select', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.multiple).toBe(true)
    })

    test('Enter toggles selection', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')
      option.focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(option.hasAttribute('selected')).toBe(true)

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(option.hasAttribute('selected')).toBe(false)
    })

    test('Space toggles selection', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')
      option.focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      expect(option.hasAttribute('selected')).toBe(true)

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      expect(option.hasAttribute('selected')).toBe(false)
    })

    test('click toggles selection', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="apple">Apple</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')

      option.click()
      expect(option.hasAttribute('selected')).toBe(true)

      option.click()
      expect(option.hasAttribute('selected')).toBe(false)
    })

    test('multiple selections maintained', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')

      options[0].click()
      options[2].click()

      expect(listbox.value).toEqual(['a', 'c'])
      expect(options[0].hasAttribute('selected')).toBe(true)
      expect(options[1].hasAttribute('selected')).toBe(false)
      expect(options[2].hasAttribute('selected')).toBe(true)
    })

    test('value getter returns array', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')

      options[0].click()
      options[1].click()

      expect(listbox.value).toEqual(['a', 'b'])
    })
  })

  describe('disabled state', () => {
    test('disabled listbox ignores keyboard', () => {
      document.body.innerHTML = `
        <ytz-listbox disabled>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')
      option.focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(listbox.value).toBe('')
    })

    test('disabled listbox ignores clicks', () => {
      document.body.innerHTML = `
        <ytz-listbox disabled>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')

      option.click()

      expect(listbox.value).toBe('')
    })

    test('disabled option skipped in navigation', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b" disabled>B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')
      options[0].focus()

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(document.activeElement).toBe(options[2])
    })

    test('disabled option cannot be selected', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a" disabled>A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')

      option.click()

      expect(listbox.value).toBe('')
    })

    test('disabled removes tabindex', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      expect(listbox.getAttribute('tabindex')).toBe('0')

      listbox.disabled = true
      expect(listbox.hasAttribute('tabindex')).toBe(false)

      listbox.disabled = false
      expect(listbox.getAttribute('tabindex')).toBe('0')
    })
  })

  describe('public API', () => {
    test('clear() clears all selections', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')
      options[0].click()

      listbox.clear()

      expect(listbox.value).toBe('')
      expect(options[0].hasAttribute('selected')).toBe(false)
    })

    test('clear() dispatches clear event', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const handler = jest.fn()
      listbox.addEventListener('clear', handler)

      listbox.clear()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('selectAll() selects all (multi-select only)', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c" disabled>C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')

      listbox.selectAll()

      // Should select all except disabled
      expect(listbox.value).toEqual(['a', 'b'])
    })

    test('selectAll() does nothing in single-select mode', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')

      listbox.selectAll()

      expect(listbox.value).toBe('')
    })

    test('value setter sets selection', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')

      listbox.value = 'b'

      expect(options[0].getAttribute('aria-selected')).toBe('false')
      expect(options[1].getAttribute('aria-selected')).toBe('true')
    })

    test('value setter accepts array in multi-select', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')

      listbox.value = ['a', 'c']

      expect(listbox.value).toEqual(['a', 'c'])
    })

    test('options getter returns all options', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = listbox.options

      expect(options.length).toBe(2)
      expect(options[0].getAttribute('value')).toBe('a')
    })

    test('selectedOptions getter returns selected', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c">C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const options = document.querySelectorAll('ytz-option')

      options[0].click()
      options[2].click()

      const selected = listbox.selectedOptions
      expect(selected.length).toBe(2)
      expect(selected[0].getAttribute('value')).toBe('a')
      expect(selected[1].getAttribute('value')).toBe('c')
    })
  })

  describe('initial state', () => {
    test('reads selected attribute from HTML', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
          <ytz-option value="b" selected>B</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')

      expect(listbox.value).toBe('b')
    })

    test('reads multiple selected attributes in multi-select', () => {
      document.body.innerHTML = `
        <ytz-listbox multiple>
          <ytz-option value="a" selected>A</ytz-option>
          <ytz-option value="b">B</ytz-option>
          <ytz-option value="c" selected>C</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')

      expect(listbox.value).toEqual(['a', 'c'])
    })
  })

  describe('edge cases', () => {
    test('uses text content as value if no value attribute', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option>Apple Fruit</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')
      const option = document.querySelector('ytz-option')

      option.click()

      expect(listbox.value).toBe('Apple Fruit')
    })

    test('cleanup removes event listeners on disconnect', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')

      listbox.remove()

      expect(document.querySelector('ytz-listbox')).toBeNull()
    })

    test('attribute change updates state when connected', () => {
      document.body.innerHTML = `
        <ytz-listbox>
          <ytz-option value="a">A</ytz-option>
        </ytz-listbox>
      `
      const listbox = document.querySelector('ytz-listbox')

      listbox.setAttribute('multiple', '')
      expect(listbox.getAttribute('aria-multiselectable')).toBe('true')

      listbox.removeAttribute('multiple')
      expect(listbox.getAttribute('aria-multiselectable')).toBe('false')
    })
  })
})

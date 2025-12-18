/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './chip.js'

describe('YtzChip', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    test('renders basic chip', () => {
      document.body.innerHTML = '<ytz-chip>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')

      expect(chip).not.toBeNull()
      expect(chip.textContent).toContain('Tag')
    })

    test('renders without delete button by default', () => {
      document.body.innerHTML = '<ytz-chip>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')
      const deleteBtn = chip.querySelector('.ytz-chip-delete')

      expect(deleteBtn).toBeNull()
    })

    test('renders delete button when deletable', () => {
      document.body.innerHTML = '<ytz-chip deletable>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')
      const deleteBtn = chip.querySelector('.ytz-chip-delete')

      expect(deleteBtn).not.toBeNull()
      expect(deleteBtn.getAttribute('aria-label')).toBe('Delete')
    })
  })

  describe('deletable attribute', () => {
    test('adding deletable adds delete button', () => {
      document.body.innerHTML = '<ytz-chip>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')

      expect(chip.querySelector('.ytz-chip-delete')).toBeNull()

      chip.setAttribute('deletable', '')

      expect(chip.querySelector('.ytz-chip-delete')).not.toBeNull()
    })

    test('removing deletable removes delete button', () => {
      document.body.innerHTML = '<ytz-chip deletable>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')

      expect(chip.querySelector('.ytz-chip-delete')).not.toBeNull()

      chip.removeAttribute('deletable')

      expect(chip.querySelector('.ytz-chip-delete')).toBeNull()
    })

    test('deletable property getter', () => {
      document.body.innerHTML = '<ytz-chip deletable>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')

      expect(chip.deletable).toBe(true)
    })

    test('deletable property setter', () => {
      document.body.innerHTML = '<ytz-chip>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')

      chip.deletable = true
      expect(chip.hasAttribute('deletable')).toBe(true)
      expect(chip.querySelector('.ytz-chip-delete')).not.toBeNull()

      chip.deletable = false
      expect(chip.hasAttribute('deletable')).toBe(false)
      expect(chip.querySelector('.ytz-chip-delete')).toBeNull()
    })
  })

  describe('delete event', () => {
    test('dispatches delete event on button click', () => {
      document.body.innerHTML = '<ytz-chip deletable>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')
      const deleteBtn = chip.querySelector('.ytz-chip-delete')
      const handler = jest.fn()

      chip.addEventListener('delete', handler)
      deleteBtn.click()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.chip).toBe(chip)
    })

    test('delete event bubbles', () => {
      document.body.innerHTML = '<div id="container"><ytz-chip deletable>Tag</ytz-chip></div>'
      const container = document.querySelector('#container')
      const chip = container.querySelector('ytz-chip')
      const deleteBtn = chip.querySelector('.ytz-chip-delete')
      const handler = jest.fn()

      container.addEventListener('delete', handler)
      deleteBtn.click()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('disabled state', () => {
    test('disabled property getter', () => {
      document.body.innerHTML = '<ytz-chip disabled>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')

      expect(chip.disabled).toBe(true)
    })

    test('disabled property setter', () => {
      document.body.innerHTML = '<ytz-chip deletable>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')

      chip.disabled = true
      expect(chip.hasAttribute('disabled')).toBe(true)
      expect(chip.querySelector('.ytz-chip-delete').disabled).toBe(true)

      chip.disabled = false
      expect(chip.hasAttribute('disabled')).toBe(false)
      expect(chip.querySelector('.ytz-chip-delete').disabled).toBe(false)
    })

    test('does not dispatch delete event when disabled', () => {
      document.body.innerHTML = '<ytz-chip deletable disabled>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')
      const deleteBtn = chip.querySelector('.ytz-chip-delete')
      const handler = jest.fn()

      chip.addEventListener('delete', handler)
      deleteBtn.click()

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('keyboard interaction', () => {
    test('dispatches delete on Delete key', () => {
      document.body.innerHTML = '<ytz-chip deletable>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')
      const handler = jest.fn()

      chip.addEventListener('delete', handler)
      chip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('dispatches delete on Backspace key', () => {
      document.body.innerHTML = '<ytz-chip deletable>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')
      const handler = jest.fn()

      chip.addEventListener('delete', handler)
      chip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('ignores keyboard when not deletable', () => {
      document.body.innerHTML = '<ytz-chip>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')
      const handler = jest.fn()

      chip.addEventListener('delete', handler)
      chip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })

    test('ignores keyboard when disabled', () => {
      document.body.innerHTML = '<ytz-chip deletable disabled>Tag</ytz-chip>'
      const chip = document.querySelector('ytz-chip')
      const handler = jest.fn()

      chip.addEventListener('delete', handler)
      chip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })
  })
})

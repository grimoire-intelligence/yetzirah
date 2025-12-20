/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './datagrid.js'

// Mock requestAnimationFrame for virtual scroll
global.requestAnimationFrame = (cb) => setTimeout(cb, 0)
global.cancelAnimationFrame = (id) => clearTimeout(id)

describe('YtzDatagrid', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  const sampleData = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ]

  describe('rendering', () => {
    test('renders with role="grid"', () => {
      document.body.innerHTML = `
        <ytz-datagrid>
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')

      expect(grid.getAttribute('role')).toBe('grid')
    })

    test('is focusable by default', () => {
      document.body.innerHTML = `
        <ytz-datagrid>
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')

      expect(grid.getAttribute('tabindex')).toBe('0')
    })

    test('creates header and body elements', () => {
      document.body.innerHTML = `
        <ytz-datagrid>
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')

      expect(grid.querySelector('.ytz-datagrid-header')).not.toBeNull()
      expect(grid.querySelector('.ytz-datagrid-body')).not.toBeNull()
    })

    test('renders column headers', () => {
      document.body.innerHTML = `
        <ytz-datagrid>
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
          <ytz-datagrid-column field="email" header="Email"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      const headerCells = grid.querySelectorAll('.ytz-datagrid-header-cell')

      expect(headerCells.length).toBe(2)
      expect(headerCells[0].textContent).toContain('Name')
      expect(headerCells[1].textContent).toContain('Email')
    })
  })

  describe('data binding', () => {
    test('renders rows when data is set', async () => {
      document.body.innerHTML = `
        <ytz-datagrid row-height="40" style="height: 200px;">
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = sampleData

      // Wait for virtual scroll render
      await new Promise(r => setTimeout(r, 50))

      const rows = grid.querySelectorAll('.ytz-datagrid-row')
      expect(rows.length).toBeGreaterThan(0)
    })

    test('data property returns the data array', () => {
      document.body.innerHTML = `
        <ytz-datagrid>
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = sampleData

      expect(grid.data).toEqual(sampleData)
    })
  })

  describe('YtzDatagridColumn', () => {
    test('field property', () => {
      document.body.innerHTML = '<ytz-datagrid-column field="name"></ytz-datagrid-column>'
      const col = document.querySelector('ytz-datagrid-column')

      expect(col.field).toBe('name')
    })

    test('header property defaults to field', () => {
      document.body.innerHTML = '<ytz-datagrid-column field="name"></ytz-datagrid-column>'
      const col = document.querySelector('ytz-datagrid-column')

      expect(col.header).toBe('name')
    })

    test('header property with explicit value', () => {
      document.body.innerHTML = '<ytz-datagrid-column field="name" header="Full Name"></ytz-datagrid-column>'
      const col = document.querySelector('ytz-datagrid-column')

      expect(col.header).toBe('Full Name')
    })

    test('sortable property', () => {
      document.body.innerHTML = '<ytz-datagrid-column field="name" sortable></ytz-datagrid-column>'
      const col = document.querySelector('ytz-datagrid-column')

      expect(col.sortable).toBe(true)
    })

    test('filterable property', () => {
      document.body.innerHTML = '<ytz-datagrid-column field="name" filterable></ytz-datagrid-column>'
      const col = document.querySelector('ytz-datagrid-column')

      expect(col.filterable).toBe(true)
    })
  })

  describe('sorting', () => {
    test('clicking sortable header triggers sort', async () => {
      document.body.innerHTML = `
        <ytz-datagrid style="height: 200px;">
          <ytz-datagrid-column field="name" header="Name" sortable></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = sampleData

      const handler = jest.fn()
      grid.addEventListener('sort', handler)

      const headerCell = grid.querySelector('.ytz-datagrid-header-cell')
      headerCell.click()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.field).toBe('name')
      expect(handler.mock.calls[0][0].detail.direction).toBe('asc')
    })

    test('sortState reflects current sort', () => {
      document.body.innerHTML = `
        <ytz-datagrid style="height: 200px;">
          <ytz-datagrid-column field="name" header="Name" sortable></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = sampleData

      expect(grid.sortState).toBeNull()

      const headerCell = grid.querySelector('.ytz-datagrid-header-cell')
      headerCell.click()

      expect(grid.sortState).toEqual({ field: 'name', direction: 'asc' })

      headerCell.click()
      expect(grid.sortState).toEqual({ field: 'name', direction: 'desc' })
    })
  })

  describe('filtering', () => {
    test('filterable column shows filter input', () => {
      document.body.innerHTML = `
        <ytz-datagrid>
          <ytz-datagrid-column field="name" header="Name" filterable></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      const filterInput = grid.querySelector('.ytz-datagrid-filter')

      expect(filterInput).not.toBeNull()
      expect(filterInput.placeholder).toContain('Filter')
    })
  })

  describe('CSV export', () => {
    test('exportCSV generates valid CSV', () => {
      document.body.innerHTML = `
        <ytz-datagrid>
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
          <ytz-datagrid-column field="email" header="Email"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = sampleData

      const csv = grid.exportCSV()
      const lines = csv.split('\n')

      expect(lines[0]).toBe('"Name","Email"')
      expect(lines[1]).toBe('"Alice","alice@example.com"')
      expect(lines[2]).toBe('"Bob","bob@example.com"')
    })

    test('exportCSV escapes quotes', () => {
      document.body.innerHTML = `
        <ytz-datagrid>
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = [{ name: 'Test "quoted"' }]

      const csv = grid.exportCSV()
      expect(csv).toContain('Test ""quoted""')
    })
  })

  // Note: Excel export is available in the premium version only

  describe('keyboard navigation', () => {
    test('ArrowDown moves focus down', async () => {
      document.body.innerHTML = `
        <ytz-datagrid style="height: 200px;">
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = sampleData

      await new Promise(r => setTimeout(r, 50))

      grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      await new Promise(r => setTimeout(r, 50))

      const focusedRow = grid.querySelector('.ytz-datagrid-row-focused')
      expect(focusedRow).not.toBeNull()
    })

    test('Enter triggers rowactivate event', async () => {
      document.body.innerHTML = `
        <ytz-datagrid style="height: 200px;">
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = sampleData

      const handler = jest.fn()
      grid.addEventListener('rowactivate', handler)

      grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('row selection', () => {
    test('clicking row dispatches rowselect event', async () => {
      document.body.innerHTML = `
        <ytz-datagrid style="height: 200px;">
          <ytz-datagrid-column field="name" header="Name"></ytz-datagrid-column>
        </ytz-datagrid>
      `
      const grid = document.querySelector('ytz-datagrid')
      grid.data = sampleData

      await new Promise(r => setTimeout(r, 50))

      const handler = jest.fn()
      grid.addEventListener('rowselect', handler)

      const row = grid.querySelector('.ytz-datagrid-row')
      row?.click()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})

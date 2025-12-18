/**
 * ytz-datagrid - Data Grid Web Component.
 * Virtual scrolling, sorting, filtering, keyboard navigation, and export.
 *
 * @module @yetzirah/core/datagrid
 * @example
 * <ytz-datagrid>
 *   <ytz-datagrid-column field="name" header="Name" sortable></ytz-datagrid-column>
 *   <ytz-datagrid-column field="email" header="Email"></ytz-datagrid-column>
 * </ytz-datagrid>
 *
 * // Set data via JavaScript:
 * grid.data = [{ name: 'John', email: 'john@example.com' }, ...]
 */

import { createVirtualScroller } from './utils/virtual-scroll.js'

/**
 * @class YtzDatagridColumn
 * @extends HTMLElement
 */
class YtzDatagridColumn extends HTMLElement {
  get field() { return this.getAttribute('field') || '' }
  get header() { return this.getAttribute('header') || this.field }
  get sortable() { return this.hasAttribute('sortable') }
  get filterable() { return this.hasAttribute('filterable') }
  get width() { return this.getAttribute('width') || 'auto' }
}

customElements.define('ytz-datagrid-column', YtzDatagridColumn)

/**
 * @class YtzDatagrid
 * @extends HTMLElement
 */
class YtzDatagrid extends HTMLElement {
  static observedAttributes = ['row-height', 'page-size']

  /** @type {Array<Object>} */
  #data = []
  /** @type {Array<Object>} */
  #filteredData = []
  /** @type {Array<YtzDatagridColumn>} */
  #columns = []
  /** @type {Object|null} */
  #sortState = null
  /** @type {Object} */
  #filterState = {}
  /** @type {Object|null} */
  #virtualScroller = null
  /** @type {HTMLElement|null} */
  #header = null
  /** @type {HTMLElement|null} */
  #body = null
  /** @type {HTMLElement|null} */
  #viewport = null
  /** @type {number} */
  #focusedRow = 0
  /** @type {number} */
  #focusedCol = 0

  connectedCallback() {
    this.#setup()
  }

  disconnectedCallback() {
    this.#virtualScroller?.destroy()
    this.removeEventListener('keydown', this.#handleKeydown)
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.#render()
    }
  }

  #setup() {
    // Collect column definitions
    this.#columns = Array.from(this.querySelectorAll('ytz-datagrid-column'))

    // Set up ARIA
    this.setAttribute('role', 'grid')
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }

    // Create structure
    this.#createStructure()

    // Event listeners
    this.addEventListener('keydown', this.#handleKeydown)

    // Initial render
    this.#render()
  }

  #createStructure() {
    // Clear existing content (except columns)
    const columns = Array.from(this.querySelectorAll('ytz-datagrid-column'))
    this.innerHTML = ''
    columns.forEach(col => this.appendChild(col))

    // Create header
    this.#header = document.createElement('div')
    this.#header.className = 'ytz-datagrid-header'
    this.#header.setAttribute('role', 'row')
    this.appendChild(this.#header)

    // Create viewport for virtual scrolling
    this.#viewport = document.createElement('div')
    this.#viewport.className = 'ytz-datagrid-viewport'
    this.appendChild(this.#viewport)

    // Create body container
    this.#body = document.createElement('div')
    this.#body.className = 'ytz-datagrid-body'
    this.#body.setAttribute('role', 'rowgroup')
    this.#viewport.appendChild(this.#body)
  }

  #render() {
    this.#renderHeader()
    this.#applyFiltersAndSort()
    this.#initVirtualScroller()
  }

  #renderHeader() {
    if (!this.#header) return

    this.#header.innerHTML = ''

    this.#columns.forEach((col, index) => {
      const cell = document.createElement('div')
      cell.className = 'ytz-datagrid-header-cell'
      cell.setAttribute('role', 'columnheader')
      cell.style.width = col.width
      cell.textContent = col.header

      if (col.sortable) {
        cell.classList.add('ytz-datagrid-sortable')
        cell.addEventListener('click', () => this.#handleSort(col.field))

        // Add sort indicator
        const indicator = document.createElement('span')
        indicator.className = 'ytz-datagrid-sort-indicator'
        if (this.#sortState?.field === col.field) {
          indicator.textContent = this.#sortState.direction === 'asc' ? ' \u25B2' : ' \u25BC'
          cell.setAttribute('aria-sort', this.#sortState.direction === 'asc' ? 'ascending' : 'descending')
        }
        cell.appendChild(indicator)
      }

      if (col.filterable) {
        const input = document.createElement('input')
        input.type = 'text'
        input.className = 'ytz-datagrid-filter'
        input.placeholder = `Filter ${col.header}...`
        input.value = this.#filterState[col.field] || ''
        input.addEventListener('input', (e) => {
          this.#filterState[col.field] = e.target.value
          this.#applyFiltersAndSort()
          this.#initVirtualScroller()
        })
        input.addEventListener('click', (e) => e.stopPropagation())
        cell.appendChild(input)
      }

      this.#header.appendChild(cell)
    })
  }

  #handleSort(field) {
    if (this.#sortState?.field === field) {
      if (this.#sortState.direction === 'asc') {
        this.#sortState.direction = 'desc'
      } else if (this.#sortState.direction === 'desc') {
        this.#sortState = null
      }
    } else {
      this.#sortState = { field, direction: 'asc' }
    }

    this.#applyFiltersAndSort()
    this.#renderHeader()
    this.#initVirtualScroller()

    this.dispatchEvent(new CustomEvent('sort', {
      bubbles: true,
      detail: { ...this.#sortState }
    }))
  }

  #applyFiltersAndSort() {
    let result = [...this.#data]

    // Apply filters
    for (const [field, value] of Object.entries(this.#filterState)) {
      if (value) {
        const searchLower = value.toLowerCase()
        result = result.filter(row => {
          const cellValue = String(row[field] ?? '').toLowerCase()
          return cellValue.includes(searchLower)
        })
      }
    }

    // Apply sort
    if (this.#sortState) {
      const { field, direction } = this.#sortState
      result.sort((a, b) => {
        const aVal = a[field] ?? ''
        const bVal = b[field] ?? ''
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
        return direction === 'asc' ? cmp : -cmp
      })
    }

    this.#filteredData = result
  }

  #initVirtualScroller() {
    // Guard: ensure DOM structure is ready
    if (!this.#viewport || !this.#body) return

    this.#virtualScroller?.destroy()

    const rowHeight = parseInt(this.getAttribute('row-height')) || 40

    this.#virtualScroller = createVirtualScroller({
      container: this.#viewport,
      content: this.#body,
      itemCount: this.#filteredData.length,
      itemHeight: rowHeight,
      renderItem: (index) => this.#renderRow(index)
    })
  }

  #renderRow(index) {
    const rowData = this.#filteredData[index]
    if (!rowData) return null

    const row = document.createElement('div')
    row.className = 'ytz-datagrid-row'
    row.setAttribute('role', 'row')
    row.setAttribute('data-row-index', String(index))
    row.tabIndex = -1

    this.#columns.forEach((col, colIndex) => {
      const cell = document.createElement('div')
      cell.className = 'ytz-datagrid-cell'
      cell.setAttribute('role', 'gridcell')
      cell.style.width = col.width
      cell.textContent = String(rowData[col.field] ?? '')
      cell.setAttribute('data-col-index', String(colIndex))
      row.appendChild(cell)
    })

    row.addEventListener('click', () => {
      this.#focusedRow = index
      this.#updateFocus()
      this.dispatchEvent(new CustomEvent('rowselect', {
        bubbles: true,
        detail: { row: rowData, index }
      }))
    })

    return row
  }

  #handleKeydown = (e) => {
    const maxRow = this.#filteredData.length - 1
    const maxCol = this.#columns.length - 1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        this.#focusedRow = Math.min(maxRow, this.#focusedRow + 1)
        this.#updateFocus()
        break
      case 'ArrowUp':
        e.preventDefault()
        this.#focusedRow = Math.max(0, this.#focusedRow - 1)
        this.#updateFocus()
        break
      case 'ArrowRight':
        e.preventDefault()
        this.#focusedCol = Math.min(maxCol, this.#focusedCol + 1)
        this.#updateFocus()
        break
      case 'ArrowLeft':
        e.preventDefault()
        this.#focusedCol = Math.max(0, this.#focusedCol - 1)
        this.#updateFocus()
        break
      case 'Home':
        e.preventDefault()
        if (e.ctrlKey) {
          this.#focusedRow = 0
        }
        this.#focusedCol = 0
        this.#updateFocus()
        break
      case 'End':
        e.preventDefault()
        if (e.ctrlKey) {
          this.#focusedRow = maxRow
        }
        this.#focusedCol = maxCol
        this.#updateFocus()
        break
      case 'PageDown':
        e.preventDefault()
        this.#focusedRow = Math.min(maxRow, this.#focusedRow + 10)
        this.#updateFocus()
        break
      case 'PageUp':
        e.preventDefault()
        this.#focusedRow = Math.max(0, this.#focusedRow - 10)
        this.#updateFocus()
        break
      case 'Enter':
        e.preventDefault()
        this.dispatchEvent(new CustomEvent('rowactivate', {
          bubbles: true,
          detail: { row: this.#filteredData[this.#focusedRow], index: this.#focusedRow }
        }))
        break
    }
  }

  #updateFocus() {
    // Scroll row into view via virtual scroller
    this.#virtualScroller?.scrollToIndex(this.#focusedRow)

    // Update focus styling
    this.querySelectorAll('.ytz-datagrid-row').forEach(row => {
      row.classList.remove('ytz-datagrid-row-focused')
    })

    const targetRow = this.querySelector(`[data-row-index="${this.#focusedRow}"]`)
    targetRow?.classList.add('ytz-datagrid-row-focused')

    // Update cell focus
    this.querySelectorAll('.ytz-datagrid-cell').forEach(cell => {
      cell.classList.remove('ytz-datagrid-cell-focused')
    })

    const targetCell = targetRow?.querySelector(`[data-col-index="${this.#focusedCol}"]`)
    targetCell?.classList.add('ytz-datagrid-cell-focused')
  }

  /**
   * Export data to CSV format.
   * @returns {string} CSV string
   */
  exportCSV() {
    const headers = this.#columns.map(col => `"${col.header.replace(/"/g, '""')}"`)
    const rows = this.#filteredData.map(row => {
      return this.#columns.map(col => {
        const value = String(row[col.field] ?? '')
        return `"${value.replace(/"/g, '""')}"`
      }).join(',')
    })
    return [headers.join(','), ...rows].join('\n')
  }

  /**
   * Download data as CSV file.
   * @param {string} filename - File name (default: 'data.csv')
   */
  downloadCSV(filename = 'data.csv') {
    const csv = this.exportCSV()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Export data to Excel-compatible format (tab-separated).
   * @returns {string} TSV string
   */
  exportExcel() {
    const headers = this.#columns.map(col => col.header)
    const rows = this.#filteredData.map(row => {
      return this.#columns.map(col => String(row[col.field] ?? '')).join('\t')
    })
    return [headers.join('\t'), ...rows].join('\n')
  }

  /**
   * Download data as Excel-compatible file.
   * @param {string} filename - File name (default: 'data.xls')
   */
  downloadExcel(filename = 'data.xls') {
    const tsv = this.exportExcel()
    const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  // Property accessors
  get data() {
    return this.#data
  }

  set data(value) {
    this.#data = Array.isArray(value) ? value : []
    this.#applyFiltersAndSort()
    this.#initVirtualScroller()
  }

  get sortState() {
    return this.#sortState ? { ...this.#sortState } : null
  }

  get filteredData() {
    return [...this.#filteredData]
  }
}

customElements.define('ytz-datagrid', YtzDatagrid)

export { YtzDatagrid, YtzDatagridColumn }

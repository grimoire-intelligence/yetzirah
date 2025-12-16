/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Menu, MenuItem } from './menu.js'

describe('Menu', () => {
  test('renders children including trigger', () => {
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  test('syncs controlled open prop', async () => {
    const { rerender } = render(
      <Menu open={false}>
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )

    const menu = screen.getByText('Open').closest('ytz-menu')
    expect(menu.open).toBe(false)

    rerender(
      <Menu open={true}>
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )

    expect(menu.open).toBe(true)
  })

  test('calls onOpen when menu opens', async () => {
    const handleOpen = jest.fn()
    render(
      <Menu onOpen={handleOpen}>
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )

    const menu = screen.getByText('Open').closest('ytz-menu')

    await act(async () => {
      menu.dispatchEvent(new CustomEvent('open', { bubbles: true }))
    })

    expect(handleOpen).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when menu closes', async () => {
    const handleClose = jest.fn()
    render(
      <Menu open onClose={handleClose}>
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )

    const menu = screen.getByText('Open').closest('ytz-menu')

    await act(async () => {
      menu.dispatchEvent(new CustomEvent('close', { bubbles: true }))
    })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('passes placement attribute', () => {
    render(
      <Menu placement="bottom-start">
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )
    const menu = screen.getByText('Open').closest('ytz-menu')
    expect(menu).toHaveAttribute('placement', 'bottom-start')
  })

  test('passes className as class', () => {
    render(
      <Menu className="my-menu">
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )
    const menu = screen.getByText('Open').closest('ytz-menu')
    expect(menu).toHaveAttribute('class', 'my-menu')
  })

  test('forwards ref', () => {
    const ref = createRef()
    render(
      <Menu ref={ref}>
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-menu')
  })

  test('passes aria attributes through', () => {
    render(
      <Menu aria-label="Actions menu">
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )
    const menu = screen.getByText('Open').closest('ytz-menu')
    expect(menu).toHaveAttribute('aria-label', 'Actions menu')
  })

  test('passes data attributes through', () => {
    render(
      <Menu data-testid="my-menu">
        <button slot="trigger">Open</button>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    )
    expect(screen.getByTestId('my-menu')).toBeInTheDocument()
  })
})

describe('MenuItem', () => {
  test('renders children', () => {
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem>Edit Item</MenuItem>
      </Menu>
    )
    expect(screen.getByText('Edit Item')).toBeInTheDocument()
  })

  test('passes disabled attribute', () => {
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem disabled>Disabled Item</MenuItem>
      </Menu>
    )
    const item = screen.getByText('Disabled Item')
    expect(item).toHaveAttribute('disabled')
  })

  test('omits disabled attribute when false', () => {
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem disabled={false}>Enabled Item</MenuItem>
      </Menu>
    )
    const item = screen.getByText('Enabled Item')
    expect(item).not.toHaveAttribute('disabled')
  })

  test('passes value attribute', () => {
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem value="edit">Edit</MenuItem>
      </Menu>
    )
    const item = screen.getByText('Edit')
    expect(item).toHaveAttribute('value', 'edit')
  })

  test('calls onSelect when selected', async () => {
    const handleSelect = jest.fn()
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem onSelect={handleSelect} value="edit">Edit</MenuItem>
      </Menu>
    )

    const item = screen.getByText('Edit')

    await act(async () => {
      item.dispatchEvent(new CustomEvent('select', {
        bubbles: true,
        detail: { value: 'edit' }
      }))
    })

    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith({ value: 'edit' })
  })

  test('only handles select events from self', async () => {
    const handleSelect = jest.fn()
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem onSelect={handleSelect}>
          <span>Nested content</span>
        </MenuItem>
      </Menu>
    )

    const nested = screen.getByText('Nested content')

    await act(async () => {
      nested.dispatchEvent(new CustomEvent('select', {
        bubbles: true,
        detail: { value: 'nested' }
      }))
    })

    // Should not be called because event target is nested span, not the menuitem
    expect(handleSelect).not.toHaveBeenCalled()
  })

  test('passes className as class', () => {
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem className="my-item">Item</MenuItem>
      </Menu>
    )
    const item = screen.getByText('Item')
    expect(item).toHaveAttribute('class', 'my-item')
  })

  test('forwards ref', () => {
    const ref = createRef()
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem ref={ref}>Item</MenuItem>
      </Menu>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-menuitem')
  })

  test('passes aria attributes through', () => {
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem aria-label="Edit action">Edit</MenuItem>
      </Menu>
    )
    const item = screen.getByText('Edit')
    expect(item).toHaveAttribute('aria-label', 'Edit action')
  })

  test('passes data attributes through', () => {
    render(
      <Menu>
        <button slot="trigger">Open</button>
        <MenuItem data-testid="edit-item">Edit</MenuItem>
      </Menu>
    )
    expect(screen.getByTestId('edit-item')).toBeInTheDocument()
  })
})

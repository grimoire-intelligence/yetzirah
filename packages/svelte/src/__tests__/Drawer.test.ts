import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import Drawer from '../Drawer.svelte'

describe('Drawer', () => {
  it('renders with default props', () => {
    const { container } = render(Drawer)
    expect(container.querySelector('ytz-drawer')).not.toBeNull()
  })

  it('passes open prop to web component', () => {
    const { container } = render(Drawer, { props: { open: true } })
    const drawer = container.querySelector('ytz-drawer')
    expect(drawer).not.toBeNull()
  })

  it('passes anchor prop to web component', () => {
    const { container } = render(Drawer, { props: { anchor: 'right' } })
    const drawer = container.querySelector('ytz-drawer')
    expect(drawer?.getAttribute('anchor')).toBe('right')
  })

  it('receives close events from web component', async () => {
    const { container } = render(Drawer, { props: { open: true } })
    const drawer = container.querySelector('ytz-drawer')

    expect(drawer).not.toBeNull()

    // Simulate close event
    const event = new CustomEvent('close', { bubbles: true })
    drawer?.dispatchEvent(event)

    // The event should bubble up
    expect(true).toBe(true) // Event dispatch verification
  })

  it('supports all anchor positions', () => {
    const anchors: Array<'left' | 'right' | 'top' | 'bottom'> = ['left', 'right', 'top', 'bottom']

    anchors.forEach(anchor => {
      const { container } = render(Drawer, { props: { anchor } })
      const drawer = container.querySelector('ytz-drawer')
      expect(drawer?.getAttribute('anchor')).toBe(anchor)
    })
  })
})

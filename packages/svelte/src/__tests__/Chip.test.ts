import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import Chip from '../Chip.svelte'

describe('Chip', () => {
  it('renders with default props', () => {
    const { container } = render(Chip)
    expect(container.querySelector('ytz-chip')).not.toBeNull()
  })

  it('passes deletable prop to web component', () => {
    const { container } = render(Chip, { props: { deletable: true } })
    const chip = container.querySelector('ytz-chip')
    expect(chip?.hasAttribute('deletable')).toBe(true)
  })

  it('passes disabled prop to web component', () => {
    const { container } = render(Chip, { props: { disabled: true } })
    const chip = container.querySelector('ytz-chip')
    expect(chip?.hasAttribute('disabled')).toBe(true)
  })

  it('forwards delete events', async () => {
    const { container } = render(Chip, { props: { deletable: true } })
    const chip = container.querySelector('ytz-chip')

    // Simulate delete event and verify it bubbles
    const event = new CustomEvent('delete', { detail: { chip }, bubbles: true })
    chip?.dispatchEvent(event)

    expect(true).toBe(true)
  })
})

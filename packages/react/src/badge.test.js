/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Badge } from './badge.js'

describe('Badge', () => {
  test('renders children', () => {
    render(<Badge><button>Notifications</button></Badge>)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  test('renders as ytz-badge element', () => {
    render(<Badge><span>Content</span></Badge>)
    const badge = screen.getByText('Content').closest('ytz-badge')
    expect(badge).toBeInTheDocument()
  })

  test('sets value attribute from badgeContent prop', () => {
    render(<Badge badgeContent={5}><button>Messages</button></Badge>)
    const badge = screen.getByText('Messages').closest('ytz-badge')
    expect(badge).toHaveAttribute('value', '5')
  })

  test('sets string value attribute from badgeContent prop', () => {
    render(<Badge badgeContent="99+"><button>Inbox</button></Badge>)
    const badge = screen.getByText('Inbox').closest('ytz-badge')
    expect(badge).toHaveAttribute('value', '99+')
  })

  test('renders dot mode when no badgeContent', () => {
    render(<Badge><span>New</span></Badge>)
    const badge = screen.getByText('New').closest('ytz-badge')
    expect(badge).not.toHaveAttribute('value')
  })

  test('passes max prop', () => {
    render(<Badge badgeContent={150} max={99}><button>Overflow</button></Badge>)
    const badge = screen.getByText('Overflow').closest('ytz-badge')
    expect(badge).toHaveAttribute('max', '99')
  })

  test('sets hidden attribute when invisible is true', () => {
    render(<Badge invisible><span>Hidden badge</span></Badge>)
    const badge = screen.getByText('Hidden badge').closest('ytz-badge')
    expect(badge).toHaveAttribute('hidden')
  })

  test('does not set hidden attribute when invisible is false', () => {
    render(<Badge invisible={false}><span>Visible badge</span></Badge>)
    const badge = screen.getByText('Visible badge').closest('ytz-badge')
    expect(badge).not.toHaveAttribute('hidden')
  })

  test('passes position prop', () => {
    render(<Badge position="top-left"><button>Positioned</button></Badge>)
    const badge = screen.getByText('Positioned').closest('ytz-badge')
    expect(badge).toHaveAttribute('position', 'top-left')
  })

  test('passes className as class attribute', () => {
    render(<Badge className="custom-badge"><span>Styled</span></Badge>)
    const badge = screen.getByText('Styled').closest('ytz-badge')
    expect(badge).toHaveAttribute('class', 'custom-badge')
  })

  test('forwards ref to ytz-badge element', () => {
    const ref = createRef()
    render(<Badge ref={ref}><span>Ref test</span></Badge>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-badge')
  })

  test('passes aria attributes through', () => {
    render(<Badge aria-label="5 notifications"><button>Notify</button></Badge>)
    const badge = screen.getByText('Notify').closest('ytz-badge')
    expect(badge).toHaveAttribute('aria-label', '5 notifications')
  })

  test('passes data attributes through', () => {
    render(<Badge data-testid="notification-badge"><span>Test</span></Badge>)
    const badge = screen.getByText('Test').closest('ytz-badge')
    expect(badge).toHaveAttribute('data-testid', 'notification-badge')
  })

  test('handles conditional visibility pattern', () => {
    const { rerender } = render(
      <Badge badgeContent={5} invisible={false}>
        <button>Count</button>
      </Badge>
    )
    const badge = screen.getByText('Count').closest('ytz-badge')
    expect(badge).not.toHaveAttribute('hidden')
    expect(badge).toHaveAttribute('value', '5')

    rerender(
      <Badge badgeContent={0} invisible={true}>
        <button>Count</button>
      </Badge>
    )
    expect(badge).toHaveAttribute('hidden')
  })
})

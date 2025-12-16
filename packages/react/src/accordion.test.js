/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Accordion, AccordionItem } from './accordion.js'

describe('Accordion', () => {
  test('renders children', () => {
    render(
      <Accordion>
        <AccordionItem>
          <button>Section 1</button>
          <div>Content 1</div>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  test('passes exclusive attribute when true', () => {
    render(
      <Accordion exclusive>
        <AccordionItem>
          <button>Section 1</button>
          <div>Content 1</div>
        </AccordionItem>
      </Accordion>
    )
    const accordion = screen.getByText('Section 1').closest('ytz-accordion')
    expect(accordion).toHaveAttribute('exclusive')
  })

  test('omits exclusive attribute when false', () => {
    render(
      <Accordion exclusive={false}>
        <AccordionItem>
          <button>Section 1</button>
          <div>Content 1</div>
        </AccordionItem>
      </Accordion>
    )
    const accordion = screen.getByText('Section 1').closest('ytz-accordion')
    expect(accordion).not.toHaveAttribute('exclusive')
  })

  test('passes className as class attribute', () => {
    render(
      <Accordion className="test-class">
        <AccordionItem>
          <button>Section 1</button>
          <div>Content 1</div>
        </AccordionItem>
      </Accordion>
    )
    const accordion = screen.getByText('Section 1').closest('ytz-accordion')
    expect(accordion).toHaveAttribute('class', 'test-class')
  })

  test('forwards ref to element', () => {
    const ref = createRef()
    render(
      <Accordion ref={ref}>
        <AccordionItem>
          <button>Section 1</button>
          <div>Content 1</div>
        </AccordionItem>
      </Accordion>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-accordion')
  })

  test('passes aria attributes through', () => {
    render(
      <Accordion aria-label="Settings accordion">
        <AccordionItem>
          <button>Section 1</button>
          <div>Content 1</div>
        </AccordionItem>
      </Accordion>
    )
    const accordion = screen.getByText('Section 1').closest('ytz-accordion')
    expect(accordion).toHaveAttribute('aria-label', 'Settings accordion')
  })

  test('passes data attributes through', () => {
    render(
      <Accordion data-testid="my-accordion">
        <AccordionItem>
          <button>Section 1</button>
          <div>Content 1</div>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByTestId('my-accordion')).toBeInTheDocument()
  })
})

describe('AccordionItem', () => {
  test('renders children', () => {
    render(
      <Accordion>
        <AccordionItem>
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByText('Toggle')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  test('syncs controlled open prop to attribute', async () => {
    const { rerender } = render(
      <Accordion>
        <AccordionItem open={false}>
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )

    const item = screen.getByText('Toggle').closest('ytz-accordion-item')
    expect(item).not.toHaveAttribute('open')

    rerender(
      <Accordion>
        <AccordionItem open={true}>
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )

    expect(item).toHaveAttribute('open')
  })

  test('sets defaultOpen attribute initially', () => {
    render(
      <Accordion>
        <AccordionItem defaultOpen>
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )
    const item = screen.getByText('Toggle').closest('ytz-accordion-item')
    expect(item).toHaveAttribute('open')
  })

  test('calls onToggle when toggle event fires', async () => {
    const handleToggle = jest.fn()
    render(
      <Accordion>
        <AccordionItem onToggle={handleToggle}>
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )

    const button = screen.getByText('Toggle')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(handleToggle).toHaveBeenCalledWith(true)
  })

  test('only handles toggle events from self, not nested items', async () => {
    const outerToggle = jest.fn()
    const innerToggle = jest.fn()

    render(
      <Accordion>
        <AccordionItem onToggle={outerToggle}>
          <button>Outer</button>
          <div>
            <Accordion>
              <AccordionItem onToggle={innerToggle}>
                <button>Inner</button>
                <div>Inner Content</div>
              </AccordionItem>
            </Accordion>
          </div>
        </AccordionItem>
      </Accordion>
    )

    const innerButton = screen.getByText('Inner')

    await act(async () => {
      fireEvent.click(innerButton)
    })

    expect(innerToggle).toHaveBeenCalledWith(true)
    expect(outerToggle).not.toHaveBeenCalled()
  })

  test('passes className as class attribute', () => {
    render(
      <Accordion>
        <AccordionItem className="item-class">
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )
    const item = screen.getByText('Toggle').closest('ytz-accordion-item')
    expect(item).toHaveAttribute('class', 'item-class')
  })

  test('forwards ref to element', () => {
    const ref = createRef()
    render(
      <Accordion>
        <AccordionItem ref={ref}>
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-accordion-item')
  })

  test('passes aria attributes through', () => {
    render(
      <Accordion>
        <AccordionItem aria-label="Account section">
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )
    const item = screen.getByText('Toggle').closest('ytz-accordion-item')
    expect(item).toHaveAttribute('aria-label', 'Account section')
  })

  test('passes data attributes through', () => {
    render(
      <Accordion>
        <AccordionItem data-testid="my-item">
          <button>Toggle</button>
          <div>Content</div>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByTestId('my-item')).toBeInTheDocument()
  })
})

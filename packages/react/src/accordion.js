/**
 * React wrappers for ytz-accordion components.
 *
 * @module @yetzirah/react/accordion
 * @example
 * <Accordion exclusive>
 *   <AccordionItem open={expanded === 'panel1'} onToggle={(open) => setExpanded(open ? 'panel1' : null)}>
 *     <button>Section 1</button>
 *     <div><div>Content 1</div></div>
 *   </AccordionItem>
 * </Accordion>
 */

import '@yetzirah/core'
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

/**
 * Accordion container - coordinates accordion items.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.exclusive] - Only one item open at a time
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - AccordionItem children
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 */
export const Accordion = forwardRef(function Accordion(
  { exclusive, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  return (
    <ytz-accordion
      ref={innerRef}
      class={className}
      exclusive={exclusive || undefined}
      {...props}
    >
      {children}
    </ytz-accordion>
  )
})

/**
 * Accordion item - individual expandable panel.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controlled open state
 * @param {boolean} [props.defaultOpen] - Initial open state (uncontrolled)
 * @param {Function} [props.onToggle] - Callback when open state changes
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Trigger button and content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 */
export const AccordionItem = forwardRef(function AccordionItem(
  { open, defaultOpen, onToggle, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Sync controlled open prop to attribute
  useEffect(() => {
    const el = innerRef.current
    if (!el || open === undefined) return

    if (open) {
      el.setAttribute('open', '')
    } else {
      el.removeAttribute('open')
    }
  }, [open])

  // Handle toggle events
  useEffect(() => {
    const el = innerRef.current
    if (!el || !onToggle) return

    const handleToggle = (e) => {
      // Only handle events from this item, not nested items
      if (e.target === el) {
        onToggle(e.detail.open)
      }
    }

    el.addEventListener('toggle', handleToggle)
    return () => el.removeEventListener('toggle', handleToggle)
  }, [onToggle])

  return (
    <ytz-accordion-item
      ref={innerRef}
      class={className}
      open={defaultOpen || undefined}
      {...props}
    >
      {children}
    </ytz-accordion-item>
  )
})

/**
 * React wrapper for ytz-disclosure Web Component.
 * Provides controlled/uncontrolled open state management.
 *
 * @module @yetzirah/react/disclosure
 */

import '@yetzirah/core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Disclosure component - expandable content with toggle trigger.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controlled open state
 * @param {boolean} [props.defaultOpen] - Initial open state (uncontrolled)
 * @param {Function} [props.onToggle] - Callback when open state changes
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Trigger button and content elements
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Disclosure open={open} onToggle={setOpen}>
 *   <button>Toggle</button>
 *   <div>Content</div>
 * </Disclosure>
 */
export const Disclosure = forwardRef(function Disclosure(
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

    const handleToggle = (e) => onToggle(e.detail.open)

    el.addEventListener('toggle', handleToggle)
    return () => el.removeEventListener('toggle', handleToggle)
  }, [onToggle])

  return (
    <ytz-disclosure
      ref={innerRef}
      class={className}
      open={defaultOpen || undefined}
      {...props}
    >
      {children}
    </ytz-disclosure>
  )
})

/**
 * React wrapper for ytz-drawer Web Component.
 * Provides slide-in panel with focus trap, scroll lock, and escape-to-close.
 *
 * @module @yetzirah/react/drawer
 */

import '@yetzirah/core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Drawer component - slide-in panel from screen edge.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controls drawer visibility
 * @param {Function} [props.onClose] - Callback when drawer closes
 * @param {'left'|'right'|'top'|'bottom'} [props.anchor='left'] - Edge to anchor to
 * @param {boolean} [props.static] - Prevents backdrop click close
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Drawer content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Drawer open={isOpen} onClose={() => setOpen(false)} anchor="left">
 *   <nav className="w5 h-100 bg-white pa4">
 *     <a href="/home">Home</a>
 *   </nav>
 * </Drawer>
 */
export const Drawer = forwardRef(function Drawer(
  { open, onClose, anchor = 'left', static: isStatic, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Sync open prop to attribute
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    if (open) {
      el.setAttribute('open', '')
    } else {
      el.removeAttribute('open')
    }
  }, [open])

  // Handle close events
  useEffect(() => {
    const el = innerRef.current
    if (!el || !onClose) return

    el.addEventListener('close', onClose)
    return () => el.removeEventListener('close', onClose)
  }, [onClose])

  return (
    <ytz-drawer
      ref={innerRef}
      class={className}
      anchor={anchor}
      static={isStatic || undefined}
      {...props}
    >
      {children}
    </ytz-drawer>
  )
})

/**
 * React wrapper for ytz-dialog Web Component.
 * Provides modal dialog with focus trap, scroll lock, and escape-to-close.
 *
 * @module @grimoire/yetzirah-react/dialog
 */

import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Dialog component - modal dialog with focus management.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controls dialog visibility
 * @param {Function} [props.onClose] - Callback when dialog closes
 * @param {boolean} [props.static] - Prevents backdrop click close
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Dialog content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Dialog open={isOpen} onClose={() => setOpen(false)} className="pa4 bg-white br3">
 *   <h2>Title</h2>
 *   <p>Content</p>
 *   <Button onClick={() => setOpen(false)}>Close</Button>
 * </Dialog>
 */
export const Dialog = forwardRef(function Dialog(
  { open, onClose, static: isStatic, className, children, ...props },
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
    <ytz-dialog
      ref={innerRef}
      class={className}
      static={isStatic || undefined}
      {...props}
    >
      {children}
    </ytz-dialog>
  )
})

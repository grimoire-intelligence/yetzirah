/**
 * React wrapper for ytz-snackbar Web Component.
 * Provides toast notifications with auto-dismiss and positioning.
 *
 * @module @grimoire/yetzirah-react/snackbar
 */

import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Snackbar component - toast notification with auto-dismiss.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controls snackbar visibility
 * @param {Function} [props.onDismiss] - Callback when snackbar closes
 * @param {number} [props.duration=5000] - Auto-dismiss time in ms (0 = no auto-dismiss)
 * @param {string} [props.position='bottom-center'] - Position anchor
 * @param {boolean} [props.dismissible] - Shows close button
 * @param {number} [props.maxVisible=3] - Maximum snackbars at same position
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Snackbar message content
 * @param {React.Ref} ref - Forwarded ref with show/dismiss methods
 * @returns {JSX.Element}
 *
 * @example
 * <Snackbar open={showMessage} onDismiss={() => setShowMessage(false)}>
 *   File saved successfully
 * </Snackbar>
 *
 * @example
 * const ref = useRef()
 * <Snackbar ref={ref} dismissible>Message</Snackbar>
 * <Button onClick={() => ref.current.show()}>Show</Button>
 */
export const Snackbar = forwardRef(function Snackbar(
  { open, onDismiss, duration, position, dismissible, maxVisible, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    show: (message) => innerRef.current?.show(message),
    dismiss: () => innerRef.current?.dismiss(),
    get element() { return innerRef.current }
  }))

  // Sync open prop to attribute
  useEffect(() => {
    const el = innerRef.current
    if (!el || open === undefined) return

    if (open) {
      el.setAttribute('open', '')
    } else {
      el.removeAttribute('open')
    }
  }, [open])

  // Handle dismiss events
  useEffect(() => {
    const el = innerRef.current
    if (!el || !onDismiss) return

    el.addEventListener('dismiss', onDismiss)
    return () => el.removeEventListener('dismiss', onDismiss)
  }, [onDismiss])

  return (
    <ytz-snackbar
      ref={innerRef}
      class={className}
      duration={duration}
      position={position}
      dismissible={dismissible || undefined}
      max-visible={maxVisible}
      {...props}
    >
      {children}
    </ytz-snackbar>
  )
})

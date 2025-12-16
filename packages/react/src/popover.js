/**
 * React wrapper for ytz-popover Web Component.
 * Click-triggered positioned content for interactive overlays.
 *
 * @module @yetzirah/react/popover
 */

import '@yetzirah/core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Popover component - click-triggered positioned content.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.open] - Controlled open state
 * @param {Function} [props.onOpenChange] - Callback when open state changes
 * @param {Function} [props.onShow] - Callback when popover shows
 * @param {Function} [props.onHide] - Callback when popover hides
 * @param {'top'|'bottom'|'left'|'right'} [props.placement='bottom'] - Position
 * @param {number} [props.offset=8] - Gap between trigger and content
 * @param {string} [props.className] - CSS classes for popover content
 * @param {React.ReactNode} props.children - Trigger (first) and content (second)
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * const [open, setOpen] = useState(false)
 *
 * <Popover open={open} onOpenChange={setOpen} placement="bottom">
 *   <button>Open menu</button>
 *   <div className="pa3 bg-white shadow-2 br2">
 *     <p>Popover content</p>
 *     <button onClick={() => setOpen(false)}>Close</button>
 *   </div>
 * </Popover>
 *
 * @example
 * // Uncontrolled - manages its own state
 * <Popover placement="bottom">
 *   <button>Click me</button>
 *   <div>Popover content</div>
 * </Popover>
 */
export const Popover = forwardRef(function Popover(
  { open, onOpenChange, onShow, onHide, placement, offset, className, children, ...props },
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

  // Bridge show/hide events to callbacks
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const handleShow = () => {
      onShow?.()
      onOpenChange?.(true)
    }
    const handleHide = () => {
      onHide?.()
      onOpenChange?.(false)
    }

    el.addEventListener('show', handleShow)
    el.addEventListener('hide', handleHide)

    return () => {
      el.removeEventListener('show', handleShow)
      el.removeEventListener('hide', handleHide)
    }
  }, [onShow, onHide, onOpenChange])

  // Split children into trigger (first) and content (rest)
  const childArray = Array.isArray(children) ? children : [children]
  const trigger = childArray[0]
  const content = childArray.slice(1)

  return (
    <ytz-popover
      ref={innerRef}
      placement={placement}
      offset={offset}
      {...props}
    >
      {trigger}
      {content.length > 0 && (
        <div slot="content" class={className}>
          {content.length === 1 ? content[0] : content}
        </div>
      )}
    </ytz-popover>
  )
})

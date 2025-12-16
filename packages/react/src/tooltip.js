/**
 * React wrapper for ytz-tooltip Web Component.
 * Provides positioned hint text on hover/focus.
 *
 * @module @yetzirah/react/tooltip
 */

import '@yetzirah/core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Tooltip component - positioned hint text on hover/focus.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.content - Tooltip content (text or elements)
 * @param {'top'|'bottom'|'left'|'right'} [props.placement='top'] - Tooltip position
 * @param {number} [props.delay=0] - Show delay in milliseconds
 * @param {number} [props.offset=8] - Gap between trigger and tooltip
 * @param {Function} [props.onShow] - Callback when tooltip shows
 * @param {Function} [props.onHide] - Callback when tooltip hides
 * @param {string} [props.className] - CSS classes for tooltip content
 * @param {React.ReactNode} props.children - Trigger element
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Tooltip content="Helpful hint" placement="top">
 *   <Button>Hover me</Button>
 * </Tooltip>
 *
 * @example
 * // With callbacks
 * <Tooltip
 *   content="Tracked tooltip"
 *   onShow={() => console.log('shown')}
 *   onHide={() => console.log('hidden')}
 * >
 *   <button>Hover me</button>
 * </Tooltip>
 */
export const Tooltip = forwardRef(function Tooltip(
  { content, placement, delay, offset, onShow, onHide, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Bridge show/hide events
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const handleShow = () => onShow?.()
    const handleHide = () => onHide?.()

    el.addEventListener('show', handleShow)
    el.addEventListener('hide', handleHide)

    return () => {
      el.removeEventListener('show', handleShow)
      el.removeEventListener('hide', handleHide)
    }
  }, [onShow, onHide])

  return (
    <ytz-tooltip
      ref={innerRef}
      placement={placement}
      delay={delay}
      offset={offset}
      {...props}
    >
      {children}
      <span slot="content" className={className}>
        {content}
      </span>
    </ytz-tooltip>
  )
})

/**
 * React wrapper for ytz-chip Web Component.
 * Provides deletable tag/label with keyboard support.
 *
 * @module @yetzirah/react/chip
 */

import '@yetzirah/core'
import { forwardRef, useRef, useImperativeHandle, useEffect, useCallback } from 'react'

/**
 * Chip component - deletable tag/label.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.deletable] - Show delete button
 * @param {Function} [props.onDelete] - Delete handler (receives event with detail.chip)
 * @param {boolean} [props.disabled] - Disable chip interactions
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Chip content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Chip deletable onDelete={() => removeTag(id)}>
 *   JavaScript
 * </Chip>
 *
 * @example
 * <Chip disabled>Read-only tag</Chip>
 */
export const Chip = forwardRef(function Chip(
  { deletable, onDelete, disabled, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Handle delete events from the web component
  const handleDelete = useCallback((e) => {
    if (onDelete) {
      onDelete(e)
    }
  }, [onDelete])

  // Set up event listener for delete events
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    el.addEventListener('delete', handleDelete)
    return () => el.removeEventListener('delete', handleDelete)
  }, [handleDelete])

  return (
    <ytz-chip
      ref={innerRef}
      class={className}
      deletable={deletable || undefined}
      disabled={disabled || undefined}
      {...props}
    >
      {children}
    </ytz-chip>
  )
})

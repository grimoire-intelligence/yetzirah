/**
 * React wrapper for ytz-listbox.
 * @module @yetzirah/react/listbox
 */

import '@yetzirah/core'
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

/**
 * Listbox component - keyboard-navigable list selection.
 *
 * @param {Object} props
 * @param {string|string[]} [props.value] - Controlled selected value(s)
 * @param {Function} [props.onChange] - Callback when selection changes
 * @param {boolean} [props.multiple=false] - Enable multi-select
 * @param {boolean} [props.disabled=false] - Disable all interaction
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Option children
 * @param {React.Ref} ref - Forwarded ref
 */
export const Listbox = forwardRef(function Listbox(
  { value, onChange, multiple, disabled, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)
  useImperativeHandle(ref, () => innerRef.current)

  useEffect(() => {
    const el = innerRef.current
    if (!el || value === undefined) return
    el.value = value
  }, [value])

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const handleChange = (e) => onChange?.(e.detail.value)
    el.addEventListener('change', handleChange)
    return () => el.removeEventListener('change', handleChange)
  }, [onChange])

  return (
    <ytz-listbox
      ref={innerRef}
      class={className}
      multiple={multiple || undefined}
      disabled={disabled || undefined}
      {...props}
    >
      {children}
    </ytz-listbox>
  )
})

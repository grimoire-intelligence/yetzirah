/**
 * React wrapper for ytz-toggle Web Component.
 * Provides controlled toggle with checked/onChange props.
 *
 * @module @yetzirah/react/toggle
 */

import '@yetzirah/core'
import { forwardRef, useRef, useImperativeHandle, useEffect, useCallback } from 'react'

/**
 * Toggle component - switch/checkbox with accessible semantics.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.checked] - Controlled checked state
 * @param {boolean} [props.defaultChecked] - Initial checked state (uncontrolled)
 * @param {Function} [props.onChange] - Change handler (receives event with detail.checked)
 * @param {boolean} [props.disabled] - Disable toggle
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Toggle label
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * // Controlled
 * <Toggle checked={isOn} onChange={(e) => setIsOn(e.detail.checked)}>
 *   Dark mode
 * </Toggle>
 *
 * @example
 * // Uncontrolled
 * <Toggle defaultChecked>Enable notifications</Toggle>
 */
export const Toggle = forwardRef(function Toggle(
  { checked, defaultChecked, onChange, disabled, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Handle change events from the web component
  const handleChange = useCallback((e) => {
    if (onChange) {
      onChange(e)
    }
  }, [onChange])

  // Set up event listener for change events
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    el.addEventListener('change', handleChange)
    return () => el.removeEventListener('change', handleChange)
  }, [handleChange])

  // Sync controlled checked state
  useEffect(() => {
    const el = innerRef.current
    if (!el || checked === undefined) return

    if (checked && !el.hasAttribute('checked')) {
      el.setAttribute('checked', '')
    } else if (!checked && el.hasAttribute('checked')) {
      el.removeAttribute('checked')
    }
  }, [checked])

  // Determine initial checked attribute
  const initialChecked = checked !== undefined ? checked : defaultChecked

  return (
    <ytz-toggle
      ref={innerRef}
      class={className}
      checked={initialChecked || undefined}
      disabled={disabled || undefined}
      {...props}
    >
      {children}
    </ytz-toggle>
  )
})

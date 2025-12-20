/**
 * React wrapper for ytz-slider Web Component.
 * Provides controlled slider with value/onChange props.
 *
 * @module @yetzirah/react/slider
 */

import '@yetzirah/core'
import { forwardRef, useRef, useImperativeHandle, useEffect, useCallback } from 'react'

/**
 * Slider component - range input with keyboard support.
 *
 * @param {Object} props - Component props
 * @param {number} [props.value] - Controlled value
 * @param {number} [props.defaultValue] - Initial value (uncontrolled)
 * @param {number} [props.min=0] - Minimum value
 * @param {number} [props.max=100] - Maximum value
 * @param {number} [props.step=1] - Step increment
 * @param {Function} [props.onChange] - Change handler (receives event with detail.value)
 * @param {boolean} [props.disabled] - Disable slider
 * @param {string} [props.className] - CSS classes
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * // Controlled
 * <Slider
 *   value={volume}
 *   onChange={(e) => setVolume(e.detail.value)}
 *   min={0}
 *   max={100}
 * />
 *
 * @example
 * // Uncontrolled with step
 * <Slider defaultValue={50} step={10} />
 */
export const Slider = forwardRef(function Slider(
  { value, defaultValue, min, max, step, onChange, disabled, className, ...props },
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

  // Sync controlled value
  useEffect(() => {
    const el = innerRef.current
    if (!el || value === undefined) return

    const currentValue = parseFloat(el.getAttribute('value'))
    if (currentValue !== value) {
      el.setAttribute('value', String(value))
    }
  }, [value])

  // Determine initial value attribute
  const initialValue = value !== undefined ? value : defaultValue

  return (
    <ytz-slider
      ref={innerRef}
      class={className}
      value={initialValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled || undefined}
      {...props}
    />
  )
})

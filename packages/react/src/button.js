/**
 * React wrapper for ytz-button Web Component.
 * Provides polymorphic button/anchor based on props.
 *
 * @module @yetzirah/react/button
 */

import '@yetzirah/core'
import { forwardRef, useRef, useImperativeHandle } from 'react'

/**
 * Button component - renders as <a> when href provided, <button> otherwise.
 *
 * @param {Object} props - Component props
 * @param {string} [props.href] - If provided, renders as anchor
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - CSS classes (appended to defaults)
 * @param {boolean} [props.disabled] - Disable button (button only)
 * @param {string} [props.type] - Button type: 'button' | 'submit' | 'reset'
 * @param {React.ReactNode} props.children - Button content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Button href="/dashboard" className="ph3 pv2 br2 white bg-blue">
 *   Dashboard
 * </Button>
 *
 * @example
 * <Button onClick={handleSubmit} className="ph3 pv2 br2 white bg-blue">
 *   Submit
 * </Button>
 */
export const Button = forwardRef(function Button(
  { href, onClick, className, disabled, type, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  return (
    <ytz-button
      ref={innerRef}
      href={href}
      class={className}
      disabled={disabled || undefined}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </ytz-button>
  )
})

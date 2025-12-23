/**
 * React wrapper for ytz-icon-button Web Component.
 * Provides icon button with required aria-label for accessibility.
 *
 * @module @grimoire/yetzirah-react/icon-button
 */

import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useImperativeHandle } from 'react'

/**
 * IconButton component - button for icon-only actions.
 *
 * @param {Object} props - Component props
 * @param {string} props['aria-label'] - Required accessible label
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled] - Disable button
 * @param {boolean} [props.tooltip] - Show tooltip on hover/focus
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Icon content (SVG, emoji, etc.)
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <IconButton aria-label="Close" onClick={handleClose}>
 *   <CloseIcon />
 * </IconButton>
 *
 * @example
 * <IconButton aria-label="Settings" tooltip>
 *   <SettingsIcon />
 * </IconButton>
 */
export const IconButton = forwardRef(function IconButton(
  { onClick, disabled, tooltip, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  return (
    <ytz-icon-button
      ref={innerRef}
      class={className}
      disabled={disabled || undefined}
      tooltip={tooltip || undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </ytz-icon-button>
  )
})

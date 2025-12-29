/**
 * React wrapper for ytz-badge Web Component.
 * Provides notification badge with count or dot indicator.
 *
 * @module @grimoire/yetzirah-react/badge
 */

import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useImperativeHandle } from 'react'

/**
 * Badge component - notification indicator.
 *
 * @param {Object} props - Component props
 * @param {string|number} [props.badgeContent] - Badge value. Omit for dot mode
 * @param {number} [props.max] - Cap displayed value, shows "max+"
 * @param {boolean} [props.invisible] - Hides the badge
 * @param {string} [props.position='top-right'] - Badge position
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Anchored content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * // Count badge
 * <Badge badgeContent={5} max={99}>
 *   <button>Notifications</button>
 * </Badge>
 *
 * @example
 * // Dot badge (no content)
 * <Badge>
 *   <span>New</span>
 * </Badge>
 */
export const Badge = forwardRef(function Badge(
  { badgeContent, max, invisible, position, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  return (
    <ytz-badge
      ref={innerRef}
      value={badgeContent}
      max={max}
      position={position}
      hidden={invisible || undefined}
      class={className}
      {...props}
    >
      {children}
    </ytz-badge>
  )
})

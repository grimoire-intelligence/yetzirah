/**
 * React wrappers for ytz-menu Web Components.
 * Dropdown menu with keyboard navigation.
 *
 * @module @grimoire/yetzirah-react/menu
 */

import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Menu container with trigger and items.
 *
 * @param {Object} props
 * @param {boolean} [props.open] - Controlled open state
 * @param {string} [props.placement] - Positioning ('bottom-start', etc.)
 * @param {Function} [props.onOpen] - Called when menu opens
 * @param {Function} [props.onClose] - Called when menu closes
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Trigger and MenuItems
 * @param {React.Ref} ref
 *
 * @example
 * <Menu onClose={() => console.log('closed')}>
 *   <button slot="trigger">Open Menu</button>
 *   <MenuItem onSelect={() => handleEdit()}>Edit</MenuItem>
 *   <MenuItem disabled>Archive</MenuItem>
 * </Menu>
 */
export const Menu = forwardRef(function Menu(
  { open, placement, onOpen, onClose, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Sync controlled open state
  useEffect(() => {
    const el = innerRef.current
    if (!el || open === undefined) return
    el.open = open
  }, [open])

  // Event listeners
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const handleOpen = () => onOpen?.()
    const handleClose = () => onClose?.()

    el.addEventListener('open', handleOpen)
    el.addEventListener('close', handleClose)
    return () => {
      el.removeEventListener('open', handleOpen)
      el.removeEventListener('close', handleClose)
    }
  }, [onOpen, onClose])

  return (
    <ytz-menu
      ref={innerRef}
      class={className}
      placement={placement}
      {...props}
    >
      {children}
    </ytz-menu>
  )
})

/**
 * Menu item.
 *
 * @param {Object} props
 * @param {boolean} [props.disabled] - Item not selectable
 * @param {string} [props.value] - Value for select event
 * @param {Function} [props.onSelect] - Called when item selected
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Item content
 * @param {React.Ref} ref
 *
 * @example
 * <MenuItem value="edit" onSelect={(detail) => console.log(detail.value)}>
 *   Edit
 * </MenuItem>
 */
export const MenuItem = forwardRef(function MenuItem(
  { disabled, value, onSelect, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Select event
  useEffect(() => {
    const el = innerRef.current
    if (!el || !onSelect) return

    const handleSelect = (e) => {
      if (e.target === el) onSelect(e.detail)
    }

    el.addEventListener('select', handleSelect)
    return () => el.removeEventListener('select', handleSelect)
  }, [onSelect])

  return (
    <ytz-menuitem
      ref={innerRef}
      class={className}
      disabled={disabled || undefined}
      value={value}
      {...props}
    >
      {children}
    </ytz-menuitem>
  )
})

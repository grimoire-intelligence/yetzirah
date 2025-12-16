/**
 * Position utility for tooltips, menus, popovers.
 * Places an element relative to an anchor with flip/shift logic.
 *
 * @module @yetzirah/core/utils/position
 * @internal Not exported from package
 *
 * Limitations (by design):
 * - Does not handle nested scroll containers
 * - Does not support virtual elements
 * - No middleware system
 */

/**
 * Position a floating element relative to an anchor.
 *
 * @param {HTMLElement} anchor - Element to position relative to
 * @param {HTMLElement} floating - Element to position
 * @param {Object} [options] - Positioning options
 * @param {'top'|'bottom'|'left'|'right'} [options.placement='top'] - Preferred placement
 * @param {number} [options.offset=8] - Gap between anchor and floating element
 * @returns {{ x: number, y: number, placement: string }}
 */
export function position(anchor, floating, options = {}) {
  const { placement = 'top', offset = 8 } = options

  const anchorRect = anchor.getBoundingClientRect()
  const floatingRect = floating.getBoundingClientRect()
  const viewport = { width: window.innerWidth, height: window.innerHeight }

  let x, y
  let finalPlacement = placement

  // Calculate position based on placement
  switch (placement) {
    case 'top':
      x = anchorRect.left + (anchorRect.width - floatingRect.width) / 2
      y = anchorRect.top - floatingRect.height - offset
      break
    case 'bottom':
      x = anchorRect.left + (anchorRect.width - floatingRect.width) / 2
      y = anchorRect.bottom + offset
      break
    case 'left':
      x = anchorRect.left - floatingRect.width - offset
      y = anchorRect.top + (anchorRect.height - floatingRect.height) / 2
      break
    case 'right':
      x = anchorRect.right + offset
      y = anchorRect.top + (anchorRect.height - floatingRect.height) / 2
      break
  }

  // Flip if outside viewport
  if (placement === 'top' && y < 0) {
    y = anchorRect.bottom + offset
    finalPlacement = 'bottom'
  } else if (placement === 'bottom' && y + floatingRect.height > viewport.height) {
    y = anchorRect.top - floatingRect.height - offset
    finalPlacement = 'top'
  } else if (placement === 'left' && x < 0) {
    x = anchorRect.right + offset
    finalPlacement = 'right'
  } else if (placement === 'right' && x + floatingRect.width > viewport.width) {
    x = anchorRect.left - floatingRect.width - offset
    finalPlacement = 'left'
  }

  // Shift to stay in viewport
  if (finalPlacement === 'top' || finalPlacement === 'bottom') {
    x = Math.max(0, Math.min(x, viewport.width - floatingRect.width))
  } else {
    y = Math.max(0, Math.min(y, viewport.height - floatingRect.height))
  }

  return { x, y, placement: finalPlacement }
}

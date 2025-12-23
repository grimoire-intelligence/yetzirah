/**
 * Keyboard navigation utility for arrow key navigation.
 * @module @grimoire/yetzirah-core/utils/key-nav
 * @internal Not exported from package
 */

/**
 * Creates keyboard navigation for a set of elements.
 * @param {() => HTMLElement[]} getItems - Function returning navigable elements
 * @param {Object} options
 * @param {'horizontal'|'vertical'} [options.orientation='horizontal']
 * @param {boolean} [options.wrap=true]
 * @param {boolean} [options.autoActivate=true]
 * @param {(item: HTMLElement) => void} [options.onActivate]
 * @returns {{ handleKeyDown: (e: KeyboardEvent) => void }}
 */
export function createKeyNav(getItems, options = {}) {
  const { orientation = 'horizontal', wrap = true, autoActivate = true, onActivate } = options
  const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'

  return {
    handleKeyDown(e) {
      const items = getItems()
      const currentIndex = items.indexOf(document.activeElement)
      if (currentIndex === -1) return

      let newIndex = currentIndex
      if (e.key === prevKey) {
        newIndex = currentIndex - 1
        if (newIndex < 0) newIndex = wrap ? items.length - 1 : 0
      } else if (e.key === nextKey) {
        newIndex = currentIndex + 1
        if (newIndex >= items.length) newIndex = wrap ? 0 : items.length - 1
      } else if (e.key === 'Home') {
        newIndex = 0
      } else if (e.key === 'End') {
        newIndex = items.length - 1
      } else {
        return
      }

      e.preventDefault()
      items[newIndex].focus()
      if (autoActivate && onActivate) onActivate(items[newIndex])
    }
  }
}

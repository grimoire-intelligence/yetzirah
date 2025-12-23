/**
 * Virtual Scroll utility for efficient rendering of large lists.
 * Only renders visible items plus a buffer for smooth scrolling.
 *
 * @module @grimoire/yetzirah-core/utils/virtual-scroll
 */

/**
 * Create a virtual scroller instance.
 * @param {Object} options - Configuration options
 * @param {HTMLElement} options.container - Scrollable container element
 * @param {HTMLElement} options.content - Content element to hold rendered items
 * @param {number} options.itemCount - Total number of items
 * @param {number} options.itemHeight - Height of each item in pixels
 * @param {Function} options.renderItem - Function to render an item by index
 * @param {number} [options.buffer=5] - Number of items to render above/below viewport
 * @returns {Object} Virtual scroller instance
 */
export function createVirtualScroller({
  container,
  content,
  itemCount,
  itemHeight,
  renderItem,
  buffer = 5
}) {
  let scrollTop = 0
  let renderedRange = { start: 0, end: 0 }
  let rafId = null

  // Set up content height to enable scrolling
  const totalHeight = itemCount * itemHeight
  content.style.height = `${totalHeight}px`
  content.style.position = 'relative'

  function calculateVisibleRange() {
    const containerHeight = container.clientHeight
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const end = Math.min(itemCount, start + visibleCount + buffer * 2)
    return { start, end }
  }

  function render() {
    const range = calculateVisibleRange()

    // Skip if range hasn't changed
    if (range.start === renderedRange.start && range.end === renderedRange.end) {
      return
    }

    renderedRange = range

    // Clear and re-render
    content.innerHTML = ''

    for (let i = range.start; i < range.end; i++) {
      const item = renderItem(i)
      if (item) {
        item.style.position = 'absolute'
        item.style.top = `${i * itemHeight}px`
        item.style.height = `${itemHeight}px`
        item.style.left = '0'
        item.style.right = '0'
        content.appendChild(item)
      }
    }
  }

  function handleScroll() {
    scrollTop = container.scrollTop

    // Use RAF for smooth rendering
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    rafId = requestAnimationFrame(render)
  }

  function scrollToIndex(index) {
    const targetTop = index * itemHeight
    const containerHeight = container.clientHeight
    const currentScrollTop = container.scrollTop

    // Only scroll if item is not fully visible
    if (targetTop < currentScrollTop) {
      container.scrollTop = targetTop
    } else if (targetTop + itemHeight > currentScrollTop + containerHeight) {
      container.scrollTop = targetTop - containerHeight + itemHeight
    }
  }

  function destroy() {
    container.removeEventListener('scroll', handleScroll)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    content.innerHTML = ''
  }

  function refresh() {
    const newTotalHeight = itemCount * itemHeight
    content.style.height = `${newTotalHeight}px`
    renderedRange = { start: 0, end: 0 }
    render()
  }

  // Initialize
  container.addEventListener('scroll', handleScroll)
  render()

  return {
    scrollToIndex,
    refresh,
    destroy,
    get renderedRange() {
      return { ...renderedRange }
    }
  }
}

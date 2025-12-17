/**
 * Click outside utility for dismissing popups.
 * @module @yetzirah/core/utils/click-outside
 * @internal Not exported from package
 */

/**
 * Creates a click outside listener.
 * @param {HTMLElement} element - Element to detect clicks outside of
 * @param {Function} callback - Called when click outside occurs
 * @param {Object} [options]
 * @param {HTMLElement} [options.ignore] - Additional element to ignore clicks on (e.g., trigger)
 * @returns {{ destroy: () => void }}
 */
export function clickOutside(element, callback, options = {}) {
  const { ignore } = options

  const handleClick = (e) => {
    if (element.contains(e.target)) return
    if (ignore && ignore.contains(e.target)) return
    callback(e)
  }

  // Use capture to catch clicks before they're stopped
  document.addEventListener('click', handleClick, true)

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true)
    }
  }
}

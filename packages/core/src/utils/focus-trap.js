/**
 * Focus trap utility for modals/dialogs.
 * Keeps focus within a container element.
 *
 * @module @grimoire/yetzirah-core/utils/focus-trap
 * @internal Not exported from package
 */

/** @type {string} Selector for focusable elements */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Creates a focus trap for a container element.
 *
 * @param {HTMLElement} container - Element to trap focus within
 * @returns {{ activate: () => void, deactivate: () => void }}
 */
export function createFocusTrap(container) {
  /** @param {KeyboardEvent} e */
  function handleKeydown(e) {
    if (e.key !== 'Tab') return

    const focusable = [...container.querySelectorAll(FOCUSABLE)]
      .filter(el => !el.hidden && !el.closest('[hidden]')) // visible only

    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return {
    activate() {
      container.addEventListener('keydown', handleKeydown)
    },
    deactivate() {
      container.removeEventListener('keydown', handleKeydown)
    }
  }
}

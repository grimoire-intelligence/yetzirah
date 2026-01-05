/**
 * Shared scroll lock utility with reference counting.
 * Prevents the body scroll stuck bug when multiple components
 * (dialogs, drawers) request scroll lock simultaneously.
 *
 * @module @grimoire/yetzirah-core/utils/scroll-lock
 */

/** @type {number} Number of components currently requesting scroll lock */
let lockCount = 0

/** @type {string} Original overflow value before any locks */
let originalOverflow = ''

/**
 * Request a scroll lock. Call when opening a modal/drawer.
 * Multiple calls are safe - uses reference counting.
 */
export function lockScroll() {
  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount++
}

/**
 * Release a scroll lock. Call when closing a modal/drawer.
 * Only restores scroll when all locks are released.
 */
export function unlockScroll() {
  if (lockCount > 0) {
    lockCount--
    if (lockCount === 0) {
      document.body.style.overflow = originalOverflow
    }
  }
}

/**
 * Get current lock count (for testing/debugging).
 * @returns {number}
 */
export function getScrollLockCount() {
  return lockCount
}

/**
 * Force reset all locks (for testing cleanup).
 */
export function resetScrollLock() {
  if (lockCount > 0) {
    document.body.style.overflow = originalOverflow
  }
  lockCount = 0
  originalOverflow = ''
}

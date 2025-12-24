/**
 * Idempotent custom element registration utility.
 * Prevents duplicate registration errors when scripts load multiple times.
 *
 * @module @grimoire/yetzirah-core/utils/register
 * @internal Not exported from package
 */

/**
 * Register a custom element if not already registered.
 * Safe to call multiple times with the same name.
 *
 * @param {string} name - Custom element tag name (e.g., 'ytz-button')
 * @param {CustomElementConstructor} constructor - The element class
 */
export function register(name, constructor) {
  if (!customElements.get(name)) {
    customElements.define(name, constructor)
  }
}

/**
 * Shared TypeScript types for Vue 3 wrapper components.
 *
 * @module @yetzirah/vue/types
 */

/**
 * Base props common to all Yetzirah Vue components.
 * Extends Vue's native element attributes.
 */
export interface YetzirahComponentProps {
  /**
   * CSS class to apply to the component
   */
  class?: string

  /**
   * Inline styles to apply to the component
   */
  style?: string | Record<string, any>
}

/**
 * Props for components that support disabled state
 */
export interface DisablableProps {
  /**
   * Whether the component is disabled
   */
  disabled?: boolean
}

/**
 * Props for components with open/closed state
 */
export interface OpenableProps {
  /**
   * Whether the component is open
   */
  open?: boolean

  /**
   * Event emitted when the component opens
   */
  onOpen?: () => void

  /**
   * Event emitted when the component closes
   */
  onClose?: () => void
}

/**
 * Props for components with value binding (for v-model support)
 */
export interface ValueProps<T = any> {
  /**
   * The current value (for v-model)
   */
  modelValue?: T

  /**
   * Event emitted when value changes (for v-model)
   */
  'onUpdate:modelValue'?: (value: T) => void
}

/**
 * Common event types for Yetzirah components
 */
export interface YetzirahEvents {
  /**
   * Generic change event
   */
  onChange?: (event: Event) => void

  /**
   * Generic click event
   */
  onClick?: (event: MouseEvent) => void

  /**
   * Generic focus event
   */
  onFocus?: (event: FocusEvent) => void

  /**
   * Generic blur event
   */
  onBlur?: (event: FocusEvent) => void
}

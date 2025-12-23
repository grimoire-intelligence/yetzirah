<template>
  <ytz-toggle
    :checked="checked"
    :disabled="disabled"
    :class="$attrs.class"
    @change="handleChange"
    v-bind="$attrs"
  >
    <slot />
  </ytz-toggle>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-toggle Web Component.
 * Provides v-model:checked for two-way binding with full TypeScript support.
 *
 * @module @yetzirah/vue/Toggle
 *
 * @example
 * <template>
 *   <Toggle v-model:checked="enabled" />
 * </template>
 *
 * @example
 * <template>
 *   <Toggle v-model:checked="darkMode" disabled>
 *     Dark mode
 *   </Toggle>
 * </template>
 */

import '@yetzirah/core'

/**
 * Props for the Toggle component
 */
interface Props {
  /**
   * The checked state (two-way bindable via v-model:checked)
   */
  checked?: boolean

  /**
   * Whether the toggle is disabled
   */
  disabled?: boolean
}

/**
 * Emits for the Toggle component
 */
interface Emits {
  /**
   * Emitted when toggle state changes
   * @param value The new checked state
   */
  (e: 'update:checked', value: boolean): void

  /**
   * Native change event with detail.checked
   * @param event The change event
   */
  (e: 'change', event: Event): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const checked = defineModel<boolean>('checked', { default: false })

/**
 * Handle change events from the underlying web component
 */
function handleChange(event: Event) {
  const detail = (event as CustomEvent).detail
  if (detail && typeof detail.checked === 'boolean') {
    checked.value = detail.checked
  }
  emit('change', event)
}
</script>

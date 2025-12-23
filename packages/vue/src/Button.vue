<template>
  <ytz-button
    :href="href"
    :disabled="disabled"
    :type="type"
    :class="$attrs.class"
    @click="emit('click', $event)"
    v-bind="$attrs"
  >
    <slot />
  </ytz-button>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-button Web Component.
 * Polymorphic button/anchor that renders <a> when href provided, <button> otherwise.
 *
 * @module @grimoire/yetzirah-vue/Button
 *
 * @example
 * <template>
 *   <Button @click="handleSubmit">Submit</Button>
 * </template>
 *
 * @example
 * <template>
 *   <Button href="/dashboard">Dashboard</Button>
 * </template>
 *
 * @example
 * <template>
 *   <Button type="submit" disabled>Save</Button>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Button component
 */
interface Props {
  /**
   * Optional href for link variant (renders as <a> instead of <button>)
   */
  href?: string

  /**
   * Whether the button is disabled (only applies to button variant)
   */
  disabled?: boolean

  /**
   * Button type attribute (only applies to button variant)
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Emits for the Button component
 */
interface Emits {
  /**
   * Emitted when the button is clicked
   * @param event The click event
   */
  (e: 'click', event: MouseEvent): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

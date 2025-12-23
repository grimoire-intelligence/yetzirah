<template>
  <ytz-icon-button
    :disabled="disabled"
    :aria-label="label"
    :href="href"
    :class="$attrs.class"
    @click="emit('click', $event)"
    v-bind="$attrs"
  >
    <slot />
  </ytz-icon-button>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-icon-button Web Component.
 * Provides icon button with required aria-label for accessibility.
 *
 * @module @grimoire/yetzirah-vue/IconButton
 *
 * @example
 * <template>
 *   <IconButton label="Close" @click="close">✕</IconButton>
 * </template>
 *
 * @example
 * <template>
 *   <IconButton label="Settings" disabled>
 *     <svg>...</svg>
 *   </IconButton>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the IconButton component
 */
interface Props {
  /**
   * Accessible label for the icon button (required for a11y)
   */
  label: string

  /**
   * Whether the icon button is disabled
   */
  disabled?: boolean

  /**
   * Optional href for link variant
   */
  href?: string
}

/**
 * Emits for the IconButton component
 */
interface Emits {
  /**
   * Emitted when the icon button is clicked
   * @param event The click event
   */
  (e: 'click', event: MouseEvent): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

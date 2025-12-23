<template>
  <ytz-tooltip
    :placement="placement"
    :delay="delay"
    :offset="offset"
    :class="$attrs.class"
    v-bind="$attrs"
    @show="handleShow"
    @hide="handleHide"
  >
    <slot />
    <template v-if="content || $slots.content">
      <span v-if="content" slot="content" :class="contentClass">{{ content }}</span>
      <slot v-else name="content" />
    </template>
  </ytz-tooltip>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-tooltip Web Component.
 * Provides positioned hint text on hover/focus with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Tooltip
 *
 * @example
 * <template>
 *   <Tooltip content="Helpful hint" placement="top">
 *     <button>Hover me</button>
 *   </Tooltip>
 * </template>
 *
 * @example
 * <template>
 *   <Tooltip placement="bottom" :delay="200">
 *     <button>Hover me</button>
 *     <template #content>
 *       <strong>Rich content</strong> tooltip
 *     </template>
 *   </Tooltip>
 * </template>
 *
 * @example
 * <template>
 *   <Tooltip
 *     content="Tracked tooltip"
 *     @show="onTooltipShow"
 *     @hide="onTooltipHide"
 *   >
 *     <button>Hover me</button>
 *   </Tooltip>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Tooltip component
 */
interface Props {
  /**
   * Tooltip content as text (for simple tooltips)
   */
  content?: string

  /**
   * Tooltip position relative to trigger
   */
  placement?: 'top' | 'bottom' | 'left' | 'right'

  /**
   * Show delay in milliseconds
   */
  delay?: number

  /**
   * Gap between trigger and tooltip
   */
  offset?: number

  /**
   * CSS classes for tooltip content (when using content prop)
   */
  contentClass?: string
}

/**
 * Emits for the Tooltip component
 */
interface Emits {
  /**
   * Emitted when tooltip shows
   * @param event The show event
   */
  (e: 'show', event: Event): void

  /**
   * Emitted when tooltip hides
   * @param event The hide event
   */
  (e: 'hide', event: Event): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * Handle show events from the underlying web component
 */
function handleShow(event: Event) {
  emit('show', event)
}

/**
 * Handle hide events from the underlying web component
 */
function handleHide(event: Event) {
  emit('hide', event)
}
</script>

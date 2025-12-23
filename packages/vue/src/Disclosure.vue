<template>
  <ytz-disclosure
    :open="open || undefined"
    :class="$attrs.class"
    @toggle="handleToggle"
    v-bind="$attrs"
  >
    <slot />
  </ytz-disclosure>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-disclosure Web Component.
 * Provides v-model:open for two-way binding with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Disclosure
 *
 * @example
 * <template>
 *   <Disclosure v-model:open="isOpen">
 *     <button>Toggle Details</button>
 *     <div>Content to show/hide</div>
 *   </Disclosure>
 * </template>
 *
 * @example
 * <template>
 *   <Disclosure :open="true">
 *     <button>Hide Details</button>
 *     <div>Initially visible content</div>
 *   </Disclosure>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Disclosure component
 */
interface Props {
  /**
   * The open state (two-way bindable via v-model:open)
   */
  open?: boolean
}

/**
 * Emits for the Disclosure component
 */
interface Emits {
  /**
   * Emitted when disclosure state changes
   * @param value The new open state
   */
  (e: 'update:open', value: boolean): void

  /**
   * Native toggle event with detail.open
   * @param event The toggle event
   */
  (e: 'toggle', event: Event): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const open = defineModel<boolean>('open', { default: false })

/**
 * Handle toggle events from the underlying web component
 */
function handleToggle(event: Event) {
  const detail = (event as CustomEvent).detail
  if (detail && typeof detail.open === 'boolean') {
    open.value = detail.open
  }
  emit('toggle', event)
}
</script>

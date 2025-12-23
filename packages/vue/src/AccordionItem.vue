<template>
  <ytz-accordion-item
    :open="open || undefined"
    :class="$attrs.class"
    @toggle="handleToggle"
    v-bind="$attrs"
  >
    <slot />
  </ytz-accordion-item>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-accordion-item Web Component.
 * Individual accordion panel with v-model:open for two-way binding.
 *
 * @module @grimoire/yetzirah-vue/AccordionItem
 *
 * @example
 * <template>
 *   <AccordionItem v-model:open="isOpen">
 *     <button>Toggle Section</button>
 *     <div>Content goes here...</div>
 *   </AccordionItem>
 * </template>
 *
 * @example
 * <template>
 *   <AccordionItem :open="true">
 *     <button>Initially Open Section</button>
 *     <div>This content is visible by default</div>
 *   </AccordionItem>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the AccordionItem component
 */
interface Props {
  /**
   * The open state (two-way bindable via v-model:open)
   */
  open?: boolean
}

/**
 * Emits for the AccordionItem component
 */
interface Emits {
  /**
   * Emitted when accordion item state changes
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

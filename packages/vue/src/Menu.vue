<template>
  <ytz-menu
    :open="open || undefined"
    :placement="placement"
    @open="handleOpen"
    @close="handleClose"
    v-bind="$attrs"
    :class="$attrs.class"
  >
    <slot name="trigger" slot="trigger" />
    <slot />
  </ytz-menu>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-menu Web Component.
 * Dropdown menu with keyboard navigation, positioned relative to trigger.
 *
 * @module @grimoire/yetzirah-vue/Menu
 *
 * @example
 * <template>
 *   <Menu>
 *     <template #trigger>
 *       <button>Open Menu</button>
 *     </template>
 *     <MenuItem>Edit</MenuItem>
 *     <MenuItem>Delete</MenuItem>
 *   </Menu>
 * </template>
 *
 * @example
 * <template>
 *   <Menu :open="isOpen" placement="bottom-start" @close="handleClose">
 *     <template #trigger>
 *       <button>Actions</button>
 *     </template>
 *     <MenuItem value="edit">Edit</MenuItem>
 *     <MenuItem disabled>Archive</MenuItem>
 *   </Menu>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Menu component
 */
interface Props {
  /**
   * Controlled open state
   */
  open?: boolean

  /**
   * Menu placement relative to trigger
   * @default 'bottom-start'
   */
  placement?: string
}

/**
 * Emits for the Menu component
 */
interface Emits {
  /**
   * Emitted when menu opens
   * @param event The open event
   */
  (e: 'open', event: CustomEvent): void

  /**
   * Emitted when menu closes
   * @param event The close event
   */
  (e: 'close', event: CustomEvent): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * Handle open events from the underlying web component
 */
function handleOpen(event: Event) {
  emit('open', event as CustomEvent)
}

/**
 * Handle close events from the underlying web component
 */
function handleClose(event: Event) {
  emit('close', event as CustomEvent)
}
</script>

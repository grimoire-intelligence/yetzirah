<template>
  <ytz-dialog
    :open="open || undefined"
    :static="staticDialog || undefined"
    :class="$attrs.class"
    @close="handleClose"
    v-bind="$attrs"
  >
    <slot />
  </ytz-dialog>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-dialog Web Component.
 * Provides v-model:open for two-way binding with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Dialog
 *
 * @example
 * <template>
 *   <Dialog v-model:open="showDialog">
 *     <h2>Dialog Title</h2>
 *     <p>Content goes here.</p>
 *     <button @click="showDialog = false">Close</button>
 *   </Dialog>
 * </template>
 *
 * @example
 * <template>
 *   <Dialog :open="true" static>
 *     <h2>Static Dialog</h2>
 *     <p>Cannot be dismissed by clicking backdrop.</p>
 *   </Dialog>
 * </template>
 */

import '@grimoire/yetzirah-core'
import { computed } from 'vue'

/**
 * Props for the Dialog component
 */
interface Props {
  /**
   * The open state (two-way bindable via v-model:open)
   */
  open?: boolean

  /**
   * Prevent backdrop dismiss when true
   */
  static?: boolean
}

/**
 * Emits for the Dialog component
 */
interface Emits {
  /**
   * Emitted when dialog state changes
   * @param value The new open state
   */
  (e: 'update:open', value: boolean): void

  /**
   * Native close event
   * @param event The close event
   */
  (e: 'close', event: Event): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const open = defineModel<boolean>('open', { default: false })

// Rename 'static' prop to avoid conflicts with reserved keyword
const staticDialog = computed(() => props.static)

/**
 * Handle close events from the underlying web component
 */
function handleClose(event: Event) {
  // Dialog emits close event when closing, set open to false
  open.value = false
  emit('close', event)
}
</script>

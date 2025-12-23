<template>
  <ytz-popover
    :open="open || undefined"
    :placement="placement"
    :offset="offset"
    :class="$attrs.class"
    @show="handleShow"
    @hide="handleHide"
    v-bind="$attrs"
  >
    <slot />
  </ytz-popover>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-popover Web Component.
 * Provides v-model:open for two-way binding with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Popover
 *
 * @example
 * <template>
 *   <Popover v-model:open="isOpen" placement="bottom">
 *     <button>Open menu</button>
 *     <div slot="content" class="pa3 bg-white shadow-2 br2">
 *       <p>Popover content with interactive elements</p>
 *       <button @click="isOpen = false">Close</button>
 *     </div>
 *   </Popover>
 * </template>
 *
 * @example
 * <template>
 *   <Popover placement="top" :offset="12">
 *     <button>Settings</button>
 *     <div slot="content">
 *       <label>
 *         <input type="checkbox"> Enable notifications
 *       </label>
 *       <button>Save</button>
 *     </div>
 *   </Popover>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Popover component
 */
interface Props {
  /**
   * The open state (two-way bindable via v-model:open)
   */
  open?: boolean

  /**
   * Position of the popover relative to trigger
   */
  placement?: 'top' | 'bottom' | 'left' | 'right'

  /**
   * Gap between trigger and content in pixels
   */
  offset?: number
}

/**
 * Emits for the Popover component
 */
interface Emits {
  /**
   * Emitted when popover open state changes
   * @param value The new open state
   */
  (e: 'update:open', value: boolean): void

  /**
   * Emitted when popover shows
   * @param event The show event
   */
  (e: 'show', event: Event): void

  /**
   * Emitted when popover hides
   * @param event The hide event
   */
  (e: 'hide', event: Event): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const open = defineModel<boolean>('open', { default: false })

/**
 * Handle show events from the underlying web component
 */
function handleShow(event: Event) {
  open.value = true
  emit('show', event)
}

/**
 * Handle hide events from the underlying web component
 */
function handleHide(event: Event) {
  open.value = false
  emit('hide', event)
}
</script>

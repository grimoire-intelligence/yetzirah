<template>
  <ytz-snackbar
    :open="open || undefined"
    :duration="duration"
    :position="position"
    :dismissible="dismissible || undefined"
    :max-visible="maxVisible"
    :class="$attrs.class"
    @dismiss="handleDismiss"
    v-bind="$attrs"
  >
    <slot />
  </ytz-snackbar>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-snackbar Web Component.
 * Provides v-model:open for two-way binding with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Snackbar
 *
 * @example
 * <template>
 *   <Snackbar v-model:open="showSnackbar" position="bottom-center">
 *     File saved successfully!
 *   </Snackbar>
 * </template>
 *
 * @example
 * <template>
 *   <Snackbar ref="snackbar" :duration="3000" dismissible>
 *     <span>Action completed</span>
 *   </Snackbar>
 *   <button @click="snackbar?.show('Custom message')">Show</button>
 * </template>
 */

import '@grimoire/yetzirah-core'
import { ref, watch } from 'vue'

/**
 * Snackbar position options
 */
export type SnackbarPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

/**
 * Props for the Snackbar component
 */
interface Props {
  /**
   * The open state (two-way bindable via v-model:open)
   */
  open?: boolean

  /**
   * Auto-dismiss duration in milliseconds
   * @default 5000
   */
  duration?: number

  /**
   * Snackbar position on screen
   * @default 'bottom-center'
   */
  position?: SnackbarPosition

  /**
   * Show close button
   */
  dismissible?: boolean

  /**
   * Maximum number of visible stacked snackbars
   * @default 3
   */
  maxVisible?: number
}

/**
 * Emits for the Snackbar component
 */
interface Emits {
  /**
   * Emitted when snackbar state changes
   * @param value The new open state
   */
  (e: 'update:open', value: boolean): void

  /**
   * Native dismiss event with reason
   * @param event The dismiss event with detail.reason
   */
  (e: 'dismiss', event: CustomEvent<{ reason: 'timeout' | 'manual' }>): void
}

const props = withDefaults(defineProps<Props>(), {
  duration: 5000,
  position: 'bottom-center',
  maxVisible: 3
})

const emit = defineEmits<Emits>()

const open = defineModel<boolean>('open', { default: false })

const snackbarRef = ref<HTMLElement & { show: (message?: string) => void; dismiss: () => void } | null>(null)

/**
 * Handle dismiss events from the underlying web component
 */
function handleDismiss(event: Event) {
  open.value = false
  emit('dismiss', event as CustomEvent<{ reason: 'timeout' | 'manual' }>)
}

/**
 * Programmatically show the snackbar with optional message
 */
function show(message?: string) {
  if (snackbarRef.value) {
    snackbarRef.value.show(message)
  }
  open.value = true
}

/**
 * Programmatically dismiss the snackbar
 */
function dismiss() {
  if (snackbarRef.value) {
    snackbarRef.value.dismiss()
  }
  open.value = false
}

defineExpose({ show, dismiss })
</script>

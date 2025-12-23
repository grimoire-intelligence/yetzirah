<template>
  <ytz-drawer
    :open="open || undefined"
    :anchor="anchor"
    :static="staticDrawer || undefined"
    :class="$attrs.class"
    @close="handleClose"
    v-bind="$attrs"
  >
    <slot />
  </ytz-drawer>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-drawer Web Component.
 * Provides v-model:open for two-way binding with full TypeScript support.
 * Slide-in panel with focus trap, scroll lock, and escape-to-close.
 *
 * @module @grimoire/yetzirah-vue/Drawer
 *
 * @example
 * <template>
 *   <Drawer v-model:open="isMenuOpen" anchor="left">
 *     <nav>Menu items</nav>
 *   </Drawer>
 * </template>
 *
 * @example
 * <template>
 *   <Drawer v-model:open="isDrawerOpen" anchor="right" static>
 *     <div class="drawer-content">Content here</div>
 *   </Drawer>
 * </template>
 *
 * @example
 * <template>
 *   <Drawer :open="showDrawer" @update:open="showDrawer = $event" anchor="bottom">
 *     <div>Bottom drawer</div>
 *   </Drawer>
 * </template>
 */

import '@grimoire/yetzirah-core'
import { computed } from 'vue'

/**
 * Props for the Drawer component
 */
interface Props {
  /**
   * The open state (two-way bindable via v-model:open)
   */
  open?: boolean

  /**
   * Anchor position of the drawer
   * @default 'left'
   */
  anchor?: 'left' | 'right' | 'top' | 'bottom'

  /**
   * Prevents backdrop click close
   */
  static?: boolean
}

/**
 * Emits for the Drawer component
 */
interface Emits {
  /**
   * Emitted when open state changes
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
const staticDrawer = computed(() => props.static)

/**
 * Handle close events from the underlying web component
 */
function handleClose(event: Event) {
  open.value = false
  emit('close', event)
}
</script>

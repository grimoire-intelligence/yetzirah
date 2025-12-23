<template>
  <ytz-menu-item
    :value="value"
    :disabled="disabled || undefined"
    @click="emit('click', $event)"
    v-bind="$attrs"
    :class="$attrs.class"
  >
    <slot />
  </ytz-menu-item>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-menu-item Web Component.
 * Individual menu item within a Menu component.
 *
 * @module @grimoire/yetzirah-vue/MenuItem
 *
 * @example
 * <template>
 *   <Menu>
 *     <template #trigger>
 *       <button>Open Menu</button>
 *     </template>
 *     <MenuItem value="edit" @click="handleEdit">Edit</MenuItem>
 *     <MenuItem value="delete" @click="handleDelete">Delete</MenuItem>
 *     <MenuItem disabled>Archive</MenuItem>
 *   </Menu>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the MenuItem component
 */
interface Props {
  /**
   * Value associated with this menu item
   */
  value?: string

  /**
   * Whether the menu item is disabled
   */
  disabled?: boolean
}

/**
 * Emits for the MenuItem component
 */
interface Emits {
  /**
   * Emitted when the menu item is clicked
   * @param event The click event
   */
  (e: 'click', event: MouseEvent): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <ytz-menu-trigger
    v-bind="$attrs"
    :class="$attrs.class"
  >
    <slot />
  </ytz-menu-trigger>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-menu-trigger Web Component.
 * Trigger element for opening a Menu component.
 *
 * @module @grimoire/yetzirah-vue/MenuTrigger
 *
 * @example
 * <template>
 *   <Menu>
 *     <MenuTrigger>
 *       <button>Open Menu</button>
 *     </MenuTrigger>
 *     <MenuItem>Edit</MenuItem>
 *     <MenuItem>Delete</MenuItem>
 *   </Menu>
 * </template>
 */

import '@grimoire/yetzirah-core'
</script>

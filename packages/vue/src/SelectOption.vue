<template>
  <ytz-option
    :value="value"
    :selected="selected ? '' : undefined"
    :disabled="disabled ? '' : undefined"
    :class="$attrs.class"
    v-bind="$attrs"
  >
    <slot />
  </ytz-option>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-option Web Component (used with Select).
 * Provides type-safe props for option elements.
 *
 * @module @grimoire/yetzirah-vue/SelectOption
 *
 * @example
 * <template>
 *   <Select v-model="selected">
 *     <SelectOption value="red">Red</SelectOption>
 *     <SelectOption value="green">Green</SelectOption>
 *     <SelectOption value="blue" disabled>Blue (unavailable)</SelectOption>
 *   </Select>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the SelectOption component
 */
interface Props {
  /**
   * The value of this option (used for selection)
   */
  value?: string

  /**
   * Whether this option is currently selected
   */
  selected?: boolean

  /**
   * Whether this option is disabled
   */
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <ytz-option
    :value="value"
    :disabled="disabled || undefined"
    :selected="selected || undefined"
    :class="$attrs.class"
    v-bind="$attrs"
  >
    <slot />
  </ytz-option>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-option Web Component (used within Listbox).
 * Represents a selectable option in a listbox.
 *
 * @module @grimoire/yetzirah-vue/ListboxOption
 *
 * @example
 * <template>
 *   <Listbox v-model="selected">
 *     <ListboxOption value="1">Option 1</ListboxOption>
 *     <ListboxOption value="2">Option 2</ListboxOption>
 *     <ListboxOption value="3" disabled>Option 3 (disabled)</ListboxOption>
 *   </Listbox>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the ListboxOption component
 */
interface Props {
  /**
   * The value of this option
   */
  value?: string

  /**
   * Whether the option is disabled
   */
  disabled?: boolean

  /**
   * Whether the option is selected (managed by parent listbox)
   */
  selected?: boolean
}

defineProps<Props>()
</script>

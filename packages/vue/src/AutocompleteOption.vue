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
 * Vue 3 wrapper for ytz-option Web Component (used within Autocomplete/Listbox/Select).
 * Provides Vue-idiomatic API with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/AutocompleteOption
 *
 * @example
 * <template>
 *   <Autocomplete v-model="selected">
 *     <input slot="input" placeholder="Search..." />
 *     <AutocompleteOption value="apple">Apple</AutocompleteOption>
 *     <AutocompleteOption value="banana">Banana</AutocompleteOption>
 *     <AutocompleteOption value="orange" disabled>Orange (out of stock)</AutocompleteOption>
 *   </Autocomplete>
 * </template>
 *
 * @example
 * <template>
 *   <AutocompleteOption :value="item.id" :selected="item.selected">
 *     {{ item.label }}
 *   </AutocompleteOption>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the AutocompleteOption component
 */
interface Props {
  /**
   * The option value
   */
  value?: string

  /**
   * Whether the option is disabled
   */
  disabled?: boolean

  /**
   * Whether the option is selected (managed by parent Autocomplete)
   */
  selected?: boolean
}

defineProps<Props>()
</script>

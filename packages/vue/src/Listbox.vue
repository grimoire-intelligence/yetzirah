<template>
  <ytz-listbox
    :multiple="multiple || undefined"
    :disabled="disabled || undefined"
    :class="$attrs.class"
    @change="handleChange"
    v-bind="$attrs"
  >
    <slot />
  </ytz-listbox>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-listbox Web Component.
 * Provides v-model for two-way binding with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Listbox
 *
 * @example
 * <template>
 *   <Listbox v-model="selectedValue">
 *     <ytz-option value="1">Option 1</ytz-option>
 *     <ytz-option value="2">Option 2</ytz-option>
 *   </Listbox>
 * </template>
 *
 * @example
 * <template>
 *   <Listbox v-model="selectedValues" multiple>
 *     <ytz-option value="a">Option A</ytz-option>
 *     <ytz-option value="b">Option B</ytz-option>
 *     <ytz-option value="c">Option C</ytz-option>
 *   </Listbox>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Listbox component
 */
interface Props {
  /**
   * The selected value (two-way bindable via v-model)
   * Single value when multiple=false, array when multiple=true
   */
  modelValue?: string | string[]

  /**
   * Enable multi-select mode
   */
  multiple?: boolean

  /**
   * Whether the listbox is disabled
   */
  disabled?: boolean
}

/**
 * Emits for the Listbox component
 */
interface Emits {
  /**
   * Emitted when selection changes
   * @param value The new selected value(s)
   */
  (e: 'update:modelValue', value: string | string[]): void

  /**
   * Native change event with detail.value
   * @param event The change event
   */
  (e: 'change', event: Event): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const value = defineModel<string | string[]>('modelValue', { default: '' })

/**
 * Handle change events from the underlying web component
 */
function handleChange(event: Event) {
  const detail = (event as CustomEvent).detail
  if (detail && detail.value !== undefined) {
    value.value = detail.value
  }
  emit('change', event)
}
</script>

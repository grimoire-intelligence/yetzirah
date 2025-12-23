<template>
  <ytz-autocomplete
    :open="open || undefined"
    :multiple="multiple || undefined"
    :loading="loading || undefined"
    :filter="filter !== undefined ? filter : undefined"
    :class="$attrs.class"
    @change="handleChange"
    @input-change="handleInputChange"
    @open="handleOpen"
    @close="handleClose"
    @clear="handleClear"
    v-bind="$attrs"
  >
    <slot />
  </ytz-autocomplete>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-autocomplete Web Component.
 * Provides v-model for two-way binding with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Autocomplete
 *
 * @example
 * <template>
 *   <Autocomplete v-model="selectedValue">
 *     <input slot="input" placeholder="Search..." />
 *     <ytz-option value="apple">Apple</ytz-option>
 *     <ytz-option value="banana">Banana</ytz-option>
 *   </Autocomplete>
 * </template>
 *
 * @example
 * <template>
 *   <Autocomplete v-model="selectedValues" multiple>
 *     <input slot="input" placeholder="Select multiple..." />
 *     <ytz-option value="a">Option A</ytz-option>
 *     <ytz-option value="b">Option B</ytz-option>
 *   </Autocomplete>
 * </template>
 *
 * @example
 * <template>
 *   <Autocomplete v-model="value" :open="isOpen" :loading="isLoading" :filter="false">
 *     <input slot="input" placeholder="Custom filtering..." />
 *     <ytz-option v-for="item in items" :key="item.id" :value="item.id">
 *       {{ item.label }}
 *     </ytz-option>
 *   </Autocomplete>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Autocomplete component
 */
interface Props {
  /**
   * The selected value (two-way bindable via v-model)
   * String for single-select, array of strings for multi-select
   */
  modelValue?: string | string[]

  /**
   * Whether the dropdown is open
   */
  open?: boolean

  /**
   * Enable multi-select mode
   */
  multiple?: boolean

  /**
   * Show loading state
   */
  loading?: boolean

  /**
   * Enable automatic filtering of options (default: true)
   */
  filter?: boolean
}

/**
 * Emits for the Autocomplete component
 */
interface Emits {
  /**
   * Emitted when selected value changes
   * @param value The new selected value(s)
   */
  (e: 'update:modelValue', value: string | string[]): void

  /**
   * Native change event with detail.value and detail.option
   * @param event The change event
   */
  (e: 'change', event: CustomEvent): void

  /**
   * Emitted when input value changes (typing)
   * @param event Event with detail.value (input text)
   */
  (e: 'input-change', event: CustomEvent): void

  /**
   * Emitted when dropdown opens
   * @param event The open event
   */
  (e: 'open', event: Event): void

  /**
   * Emitted when dropdown closes
   * @param event The close event
   */
  (e: 'close', event: Event): void

  /**
   * Emitted when selection is cleared
   * @param event The clear event
   */
  (e: 'clear', event: Event): void
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
  emit('change', event as CustomEvent)
}

/**
 * Handle input-change events (typing in the input)
 */
function handleInputChange(event: Event) {
  emit('input-change', event as CustomEvent)
}

/**
 * Handle open event
 */
function handleOpen(event: Event) {
  emit('open', event)
}

/**
 * Handle close event
 */
function handleClose(event: Event) {
  emit('close', event)
}

/**
 * Handle clear event
 */
function handleClear(event: Event) {
  value.value = ''
  emit('clear', event)
}
</script>

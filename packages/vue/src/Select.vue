<template>
  <ytz-select
    :open="open ? '' : undefined"
    :multiple="multiple ? '' : undefined"
    :disabled="disabled ? '' : undefined"
    :placeholder="placeholder"
    :class="$attrs.class"
    @change="handleChange"
    @open="emit('open', $event)"
    @close="emit('close', $event)"
    @clear="emit('clear', $event)"
    v-bind="$attrs"
    ref="selectRef"
  >
    <slot />
  </ytz-select>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-select Web Component.
 * Provides v-model for two-way binding with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Select
 *
 * @example
 * <template>
 *   <Select v-model="selectedValue">
 *     <SelectOption value="1">Option 1</SelectOption>
 *     <SelectOption value="2">Option 2</SelectOption>
 *     <SelectOption value="3">Option 3</SelectOption>
 *   </Select>
 * </template>
 *
 * @example
 * <template>
 *   <Select v-model="selectedValues" multiple placeholder="Choose options...">
 *     <SelectOption value="a">Alpha</SelectOption>
 *     <SelectOption value="b">Beta</SelectOption>
 *     <SelectOption value="c">Gamma</SelectOption>
 *   </Select>
 * </template>
 */

import '@grimoire/yetzirah-core'
import { ref, watch, onMounted } from 'vue'

/**
 * Props for the Select component
 */
interface Props {
  /**
   * The selected value (two-way bindable via v-model)
   * Single value (string) when multiple=false, array when multiple=true
   */
  modelValue?: string | string[]

  /**
   * Whether the dropdown is open
   */
  open?: boolean

  /**
   * Whether multiple selection is enabled
   */
  multiple?: boolean

  /**
   * Whether the select is disabled
   */
  disabled?: boolean

  /**
   * Placeholder text shown when no option is selected
   */
  placeholder?: string
}

/**
 * Emits for the Select component
 */
interface Emits {
  /**
   * Emitted when selected value changes
   * @param value The new selected value (string or string[])
   */
  (e: 'update:modelValue', value: string | string[]): void

  /**
   * Native change event with detail.value
   * @param event The change event
   */
  (e: 'change', event: Event): void

  /**
   * Emitted when select dropdown opens
   * @param event The open event
   */
  (e: 'open', event: Event): void

  /**
   * Emitted when select dropdown closes
   * @param event The close event
   */
  (e: 'close', event: Event): void

  /**
   * Emitted when select is cleared
   * @param event The clear event
   */
  (e: 'clear', event: Event): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectRef = ref<HTMLElement | null>(null)
const modelValue = defineModel<string | string[]>('modelValue', { default: '' })

/**
 * Handle change events from the underlying web component
 */
function handleChange(event: Event) {
  const detail = (event as CustomEvent).detail
  if (detail && detail.value !== undefined) {
    modelValue.value = detail.value
  }
  emit('change', event)
}

/**
 * Sync modelValue changes to the web component
 */
watch(() => props.modelValue, (newValue) => {
  if (selectRef.value && newValue !== undefined) {
    (selectRef.value as any).value = newValue
  }
}, { immediate: false })

/**
 * Initialize the web component value on mount
 */
onMounted(() => {
  if (selectRef.value && props.modelValue !== undefined) {
    (selectRef.value as any).value = props.modelValue
  }
})
</script>

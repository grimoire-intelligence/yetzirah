<template>
  <ytz-slider
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :class="$attrs.class"
    @change="handleChange"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-slider Web Component.
 * Provides v-model for two-way binding with full TypeScript support.
 *
 * @module @yetzirah/vue/Slider
 *
 * @example
 * <template>
 *   <Slider v-model="volume" :min="0" :max="100" />
 * </template>
 *
 * @example
 * <template>
 *   <Slider v-model="brightness" :min="0" :max="100" :step="5" disabled />
 * </template>
 */

import '@yetzirah/core'

/**
 * Props for the Slider component
 */
interface Props {
  /**
   * The current value (two-way bindable via v-model)
   */
  modelValue?: number

  /**
   * Minimum value
   */
  min?: number

  /**
   * Maximum value
   */
  max?: number

  /**
   * Step increment
   */
  step?: number

  /**
   * Whether the slider is disabled
   */
  disabled?: boolean
}

/**
 * Emits for the Slider component
 */
interface Emits {
  /**
   * Emitted when slider value changes
   * @param value The new value
   */
  (e: 'update:modelValue', value: number): void

  /**
   * Native change event with detail.value
   * @param event The change event
   */
  (e: 'change', event: Event): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const value = defineModel<number>('modelValue', { default: 0 })

/**
 * Handle change events from the underlying web component
 */
function handleChange(event: Event) {
  const detail = (event as CustomEvent).detail
  if (detail && typeof detail.value === 'number') {
    value.value = detail.value
  }
  emit('change', event)
}
</script>

<template>
  <ytz-progress
    :value="value ?? undefined"
    :linear="linear || undefined"
    :size="size"
    :label="label"
    :class="$attrs.class"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-progress Web Component.
 * Provides progress indicator with circular and linear modes.
 *
 * @module @grimoire/yetzirah-vue/Progress
 *
 * @example
 * <template>
 *   <!-- Indeterminate spinner -->
 *   <Progress />
 *
 *   <!-- Determinate progress -->
 *   <Progress :value="75" />
 *
 *   <!-- Linear progress bar -->
 *   <Progress :value="50" linear />
 * </template>
 */

import '@grimoire/yetzirah-core'
import { computed } from 'vue'

/**
 * Progress size options
 */
export type ProgressSize = 'small' | 'medium' | 'large'

/**
 * Props for the Progress component
 */
interface Props {
  /**
   * Progress value 0-100, null/undefined for indeterminate
   */
  value?: number | null

  /**
   * Use linear bar instead of circular spinner
   */
  linear?: boolean

  /**
   * Size variant
   * @default 'medium'
   */
  size?: ProgressSize

  /**
   * Accessible label for screen readers
   */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

/**
 * Whether the progress is in indeterminate mode
 */
const indeterminate = computed(() => props.value === null || props.value === undefined)

defineExpose({ indeterminate })
</script>

<template>
  <ytz-badge
    :value="value ?? undefined"
    :max="max"
    :position="position"
    :hidden="isHidden || undefined"
    :class="$attrs.class"
    v-bind="$attrs"
  >
    <slot />
  </ytz-badge>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-badge Web Component.
 * Provides notification badge with dot, count, and hidden modes.
 *
 * @module @grimoire/yetzirah-vue/Badge
 *
 * @example
 * <template>
 *   <!-- Dot badge -->
 *   <Badge>
 *     <IconButton icon="notifications" />
 *   </Badge>
 *
 *   <!-- Count badge -->
 *   <Badge :value="5">
 *     <IconButton icon="mail" />
 *   </Badge>
 *
 *   <!-- Max cap badge -->
 *   <Badge :value="99" :max="50">
 *     <IconButton icon="inbox" />
 *   </Badge>
 * </template>
 */

import '@grimoire/yetzirah-core'
import { computed } from 'vue'

/**
 * Badge position options
 */
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

/**
 * Props for the Badge component
 */
interface Props {
  /**
   * Badge value. Null for dot mode, number/string for count mode.
   * Value of 0 or "0" hides the badge.
   */
  value?: string | number | null

  /**
   * Maximum displayed value. Shows "max+" when exceeded.
   */
  max?: number

  /**
   * Badge position relative to slotted content
   * @default 'top-right'
   */
  position?: BadgePosition

  /**
   * Force hide the badge
   */
  hidden?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-right'
})

/**
 * Whether the badge should be hidden
 */
const isHidden = computed(() => {
  if (props.hidden) return true
  if (props.value === 0 || props.value === '0') return true
  return false
})

/**
 * Current badge mode
 */
const mode = computed(() => {
  if (isHidden.value) return 'hidden'
  if (props.value === null || props.value === undefined) return 'dot'
  return 'count'
})

defineExpose({ mode, isHidden })
</script>

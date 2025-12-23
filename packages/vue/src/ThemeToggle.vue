<template>
  <ytz-theme-toggle
    ref="rootRef"
    :class="class"
    :storage-key="storageKey"
    :no-persist="noPersist || undefined"
    v-bind="$attrs"
    @themechange="handleThemeChange"
  >
    <slot />
  </ytz-theme-toggle>
</template>

<script setup lang="ts">
/**
 * Vue wrapper for ytz-theme-toggle Web Component.
 * Provides theme switching with persistence and system preference detection.
 *
 * @module @grimoire/yetzirah-vue/ThemeToggle
 *
 * @example
 * // Basic usage
 * <ThemeToggle @themechange="(e) => console.log(e.detail.theme)" />
 *
 * @example
 * // With custom storage key
 * <ThemeToggle storageKey="my-app-theme">Dark mode</ThemeToggle>
 *
 * @example
 * // Without persistence
 * <ThemeToggle no-persist @themechange="(e) => console.log(e.detail.theme)">
 *   Toggle theme
 * </ThemeToggle>
 */

import '@grimoire/yetzirah-core'
import { ref } from 'vue'
import type { YetzirahComponentProps } from './types'

interface ThemeToggleProps extends YetzirahComponentProps {
  /**
   * The current theme ('light' or 'dark')
   */
  theme?: 'light' | 'dark'

  /**
   * localStorage key for persistence (default: 'yetzirah-theme')
   */
  storageKey?: string

  /**
   * Disable localStorage persistence
   */
  noPersist?: boolean
}

interface ThemeChangeEvent extends CustomEvent {
  detail: {
    theme: 'light' | 'dark'
    isDark: boolean
  }
}

defineProps<ThemeToggleProps>()

const rootRef = ref<HTMLElement | null>(null)

const emit = defineEmits<{
  /**
   * Emitted when theme changes
   */
  themechange: [event: ThemeChangeEvent]
}>()

const handleThemeChange = (e: Event) => {
  emit('themechange', e as ThemeChangeEvent)
}
</script>

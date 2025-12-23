<template>
  <ytz-tabs
    :value="value"
    :orientation="orientation"
    :class="$attrs.class"
    @change="handleChange"
    v-bind="$attrs"
  >
    <slot />
  </ytz-tabs>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-tabs Web Component.
 * Provides v-model for two-way binding of selected tab with full TypeScript support.
 *
 * @module @grimoire/yetzirah-vue/Tabs
 *
 * @example
 * <template>
 *   <Tabs v-model="selectedTab">
 *     <Tab panel="account">Account</Tab>
 *     <Tab panel="settings">Settings</Tab>
 *     <TabPanel id="account">Account content</TabPanel>
 *     <TabPanel id="settings">Settings content</TabPanel>
 *   </Tabs>
 * </template>
 *
 * @example
 * <template>
 *   <Tabs v-model="activeTab" orientation="vertical">
 *     <Tab panel="profile">Profile</Tab>
 *     <Tab panel="privacy">Privacy</Tab>
 *     <TabPanel id="profile">Profile settings</TabPanel>
 *     <TabPanel id="privacy">Privacy settings</TabPanel>
 *   </Tabs>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Tabs component
 */
interface Props {
  /**
   * The selected tab panel ID (two-way bindable via v-model)
   */
  modelValue?: string

  /**
   * Tab orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Emits for the Tabs component
 */
interface Emits {
  /**
   * Emitted when selected tab changes
   * @param value The new selected panel ID
   */
  (e: 'update:modelValue', value: string): void

  /**
   * Native change event with detail.value
   * @param event The change event
   */
  (e: 'change', event: Event): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const value = defineModel<string>('modelValue', { default: '' })

/**
 * Handle change events from the underlying web component
 */
function handleChange(event: Event) {
  const detail = (event as CustomEvent).detail
  if (detail && typeof detail.value === 'string') {
    value.value = detail.value
  }
  emit('change', event)
}
</script>

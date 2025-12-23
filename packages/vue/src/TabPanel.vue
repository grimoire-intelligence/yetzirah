<template>
  <ytz-tabpanel
    :id="id"
    :class="$attrs.class"
    v-bind="$attrs"
  >
    <slot />
  </ytz-tabpanel>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-tabpanel Web Component.
 * Represents a content panel controlled by a Tab.
 *
 * @module @grimoire/yetzirah-vue/TabPanel
 *
 * @example
 * <template>
 *   <Tabs v-model="selectedTab">
 *     <Tab panel="dashboard">Dashboard</Tab>
 *     <Tab panel="reports">Reports</Tab>
 *     <TabPanel id="dashboard">Dashboard content here</TabPanel>
 *     <TabPanel id="reports">Reports content here</TabPanel>
 *   </Tabs>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the TabPanel component
 */
interface Props {
  /**
   * The panel ID matching a Tab's panel prop (required)
   */
  id: string
}

defineProps<Props>()
</script>

<template>
  <ytz-tab
    :panel="panel"
    :class="$attrs.class"
    v-bind="$attrs"
  >
    <slot />
  </ytz-tab>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-tab Web Component.
 * Represents a single tab button within a Tabs component.
 *
 * @module @grimoire/yetzirah-vue/Tab
 *
 * @example
 * <template>
 *   <Tabs v-model="selectedTab">
 *     <Tab panel="home">Home</Tab>
 *     <Tab panel="about">About</Tab>
 *     <TabPanel id="home">Home content</TabPanel>
 *     <TabPanel id="about">About content</TabPanel>
 *   </Tabs>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Tab component
 */
interface Props {
  /**
   * The ID of the TabPanel this tab controls (required)
   */
  panel: string
}

defineProps<Props>()
</script>

<template>
  <div :class="$attrs.class" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Semantic wrapper for grouping Tab components.
 * This is a simple container component for better semantic structure.
 *
 * @module @grimoire/yetzirah-vue/TabList
 *
 * @example
 * <template>
 *   <Tabs v-model="selectedTab">
 *     <TabList>
 *       <Tab panel="tab1">Tab 1</Tab>
 *       <Tab panel="tab2">Tab 2</Tab>
 *     </TabList>
 *     <TabPanel id="tab1">Content 1</TabPanel>
 *     <TabPanel id="tab2">Content 2</TabPanel>
 *   </Tabs>
 * </template>
 */
</script>

<style scoped>
div {
  display: flex;
  gap: 0.5rem;
}
</style>

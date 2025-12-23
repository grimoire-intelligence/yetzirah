<script lang="ts">
	/**
	 * Semantic wrapper for grouping Tab components.
	 * This is a simple container component for better semantic structure.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Tabs bind:value={selectedTab}>
	 *   <TabList>
	 *     <Tab panel="tab1">Tab 1</Tab>
	 *     <Tab panel="tab2">Tab 2</Tab>
	 *   </TabList>
	 *   <TabPanel id="tab1">Content 1</TabPanel>
	 *   <TabPanel id="tab2">Content 2</TabPanel>
	 * </Tabs>
	 * ```
	 */
</script>

<div class={$$restProps.class || ''} {...$$restProps}>
	<slot />
</div>

<style>
	div {
		display: flex;
		gap: 0.5rem;
	}
</style>

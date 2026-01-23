<script lang="ts">
	import '@grimoire-intel/yetzirah'

	/**
	 * Svelte wrapper for ytz-tabpanel Web Component.
	 * Contains the content for a tab.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <TabPanel id="settings">Your settings content here</TabPanel>
	 * ```
	 */

	/** Panel ID matching a Tab's panel prop */
	export let id = ''
</script>

<ytz-tabpanel {id} class={$$restProps.class || ''} {...$$restProps}>
	<slot />
</ytz-tabpanel>

<style>
	:global(ytz-tabpanel) {
		display: block;
	}
</style>

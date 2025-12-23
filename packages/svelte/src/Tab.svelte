<script lang="ts">
	import '@grimoire/yetzirah-core'

	/**
	 * Svelte wrapper for ytz-tab Web Component.
	 * Represents a single tab button.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Tab panel="settings">Settings</Tab>
	 * ```
	 */

	let element: HTMLElement & { panel?: string }

	/** ID of the TabPanel this tab controls */
	export let panel = ''

	/**
	 * Sync panel attribute to web component
	 * @private
	 */
	$: if (element) {
		element.panel = panel
	}
</script>

<ytz-tab
	bind:this={element}
	class={$$restProps.class || ''}
	{panel}
	{...$$restProps}
>
	<slot />
</ytz-tab>

<style>
	:global(ytz-tab) {
		display: inline-block;
		cursor: pointer;
	}
</style>

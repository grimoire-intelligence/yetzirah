<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-tabs Web Component.
	 * Provides Svelte-idiomatic two-way binding with bind:value.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Tabs bind:value={selectedTab}>
	 *   <Tab panel="tab1">Account</Tab>
	 *   <Tab panel="tab2">Settings</Tab>
	 *   <TabPanel id="tab1">Account content</TabPanel>
	 *   <TabPanel id="tab2">Settings content</TabPanel>
	 * </Tabs>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Tabs bind:value={selectedTab} orientation="vertical">
	 *   <Tab panel="home">Home</Tab>
	 *   <Tab panel="profile">Profile</Tab>
	 *   <TabPanel id="home">Home content</TabPanel>
	 *   <TabPanel id="profile">Profile content</TabPanel>
	 * </Tabs>
	 * ```
	 */

	let element: HTMLElement & { value?: string; orientation?: string }

	/** Controlled selected tab panel ID */
	export let value = ''

	/** Tab orientation */
	export let orientation: 'horizontal' | 'vertical' = 'horizontal'

	/**
	 * Handle change events from the web component
	 * @private
	 */
	function handleChange(event: CustomEvent<{ value: string }>) {
		if (event.detail) {
			value = event.detail.value
		}
	}

	/**
	 * Sync value state to web component
	 * @private
	 */
	$: if (element) {
		element.value = value
	}

	/**
	 * Sync orientation state to web component
	 * @private
	 */
	$: if (element) {
		element.orientation = orientation
	}

	onMount(() => {
		if (element) {
			element.addEventListener('change', handleChange)

			return () => {
				element.removeEventListener('change', handleChange)
			}
		}
	})
</script>

<ytz-tabs
	bind:this={element}
	class={$$restProps.class || ''}
	{orientation}
	on:change
	{...$$restProps}
>
	<slot />
</ytz-tabs>

<style>
	:global(ytz-tabs) {
		display: block;
	}
</style>

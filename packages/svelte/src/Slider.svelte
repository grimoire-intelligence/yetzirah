<script>
	/**
	 * Svelte wrapper for ytz-slider Web Component.
	 * Provides bind:value for two-way binding with full Svelte integration.
	 *
	 * @module @grimoire/yetzirah-svelte/Slider
	 *
	 * @example
	 * <Slider bind:value={volume} min={0} max={100} />
	 */

	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	let element

	/** The current value (two-way bindable via bind:value) */
	export let value = 0

	/** Minimum value */
	export let min = 0

	/** Maximum value */
	export let max = 100

	/** Step increment */
	export let step = 1

	/** Whether the slider is disabled */
	export let disabled = false

	/** Handle change events from the underlying web component */
	function handleChange(event) {
		const detail = event.detail
		if (detail && typeof detail.value === 'number') {
			value = detail.value
		}
	}

	// Sync value to web component
	$: if (element) {
		element.value = value
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

<ytz-slider
	bind:this={element}
	value={value}
	{min}
	{max}
	{step}
	{disabled}
	on:change
	{...$$restProps}
/>

<script lang="ts">
	import '@yetzirah/core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-toggle Web Component.
	 * Provides Svelte-idiomatic two-way binding with bind:checked.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Toggle bind:checked={enabled}>Dark mode</Toggle>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Toggle bind:checked={enabled} disabled>Premium feature</Toggle>
	 * ```
	 */

	let element: HTMLElement & { checked?: boolean; disabled?: boolean }

	/** Controlled checked state */
	export let checked = false

	/** Disabled state */
	export let disabled = false

	/**
	 * Handle change events from the web component
	 * @private
	 */
	function handleChange(event: CustomEvent<{ checked: boolean }>) {
		if (event.detail) {
			checked = event.detail.checked
		}
	}

	/**
	 * Sync checked state to web component
	 * @private
	 */
	$: if (element) {
		element.checked = checked
	}

	/**
	 * Sync disabled state to web component
	 * @private
	 */
	$: if (element) {
		element.disabled = disabled
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

<ytz-toggle
	bind:this={element}
	class={$$restProps.class || ''}
	{disabled}
	on:change
	{...$$restProps}
>
	<slot />
</ytz-toggle>

<style>
	:global(ytz-toggle) {
		display: inline-block;
	}
</style>

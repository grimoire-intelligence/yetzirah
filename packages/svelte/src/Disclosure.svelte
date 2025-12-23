<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-disclosure Web Component.
	 * Provides Svelte-idiomatic two-way binding with bind:open.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Disclosure bind:open={isExpanded}>
	 *   <button>Show Details</button>
	 *   <div>Hidden content...</div>
	 * </Disclosure>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Disclosure open>
	 *   <button>Hide Details</button>
	 *   <div>Initially visible content...</div>
	 * </Disclosure>
	 * ```
	 */

	let element: HTMLElement & { open?: boolean }

	/** Controlled open state */
	export let open = false

	/**
	 * Handle toggle events from the web component
	 * @private
	 */
	function handleToggle(event: CustomEvent<{ open: boolean }>) {
		if (event.detail) {
			open = event.detail.open
		}
	}

	/**
	 * Sync open state to web component
	 * @private
	 */
	$: if (element) {
		element.open = open
	}

	onMount(() => {
		if (element) {
			element.addEventListener('toggle', handleToggle)

			return () => {
				element.removeEventListener('toggle', handleToggle)
			}
		}
	})
</script>

<ytz-disclosure
	bind:this={element}
	class={$$restProps.class || ''}
	on:toggle
	{...$$restProps}
>
	<slot />
</ytz-disclosure>

<style>
	:global(ytz-disclosure) {
		display: block;
	}
</style>

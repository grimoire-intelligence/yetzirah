<script lang="ts">
	import '@yetzirah/core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-chip Web Component.
	 * Provides a deletable tag/label with keyboard support.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Chip deletable on:delete={removeTag}>JavaScript</Chip>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Chip disabled>Read-only tag</Chip>
	 * ```
	 */

	let element: HTMLElement & { deletable?: boolean; disabled?: boolean }

	/** Show delete button */
	export let deletable = false

	/** Disable chip interactions */
	export let disabled = false

	/**
	 * Handle delete events from the web component
	 * @private
	 */
	function handleDelete(event: CustomEvent<{ chip: HTMLElement }>) {
		// Event is dispatched by the web component
		// Just forward it through Svelte's event system
	}

	/**
	 * Sync deletable state to web component
	 * @private
	 */
	$: if (element) {
		element.deletable = deletable
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
			element.addEventListener('delete', handleDelete)

			return () => {
				element.removeEventListener('delete', handleDelete)
			}
		}
	})
</script>

<ytz-chip
	bind:this={element}
	class={$$restProps.class || ''}
	{deletable}
	{disabled}
	on:delete
	{...$$restProps}
>
	<slot />
</ytz-chip>

<style>
	:global(ytz-chip) {
		display: inline-flex;
		align-items: center;
	}
</style>

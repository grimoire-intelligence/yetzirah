<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-menuitem Web Component.
	 * Individual menu item with select event.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <MenuItem on:select={handleEdit}>Edit</MenuItem>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <MenuItem value="delete" disabled on:select={handleAction}>Delete</MenuItem>
	 * ```
	 */

	let element: HTMLElement & { disabled?: boolean; value?: string }

	/** Disabled state */
	export let disabled = false

	/** Optional value for select event */
	export let value: string | undefined = undefined

	/**
	 * Handle select events from the web component
	 * @private
	 */
	function handleSelect(event: CustomEvent<{ value: string }>) {
		// Event is dispatched by the web component
		// Just forward it through Svelte's event system
	}

	/**
	 * Sync disabled state to web component
	 * @private
	 */
	$: if (element) {
		element.disabled = disabled
	}

	/**
	 * Sync value to web component
	 * @private
	 */
	$: if (element && value !== undefined) {
		element.value = value
	}

	onMount(() => {
		if (element) {
			element.addEventListener('select', handleSelect)

			return () => {
				element.removeEventListener('select', handleSelect)
			}
		}
	})
</script>

<ytz-menuitem
	bind:this={element}
	class={$$restProps.class || ''}
	disabled={disabled || undefined}
	value={value}
	on:select
	{...$$restProps}
>
	<slot />
</ytz-menuitem>

<style>
	:global(ytz-menuitem) {
		display: block;
	}
</style>

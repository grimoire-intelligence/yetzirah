<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-menu Web Component.
	 * Dropdown menu with keyboard navigation, positioned relative to trigger.
	 * Provides Svelte-idiomatic two-way binding with bind:open.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Menu bind:open={isOpen}>
	 *   <button slot="trigger">Open Menu</button>
	 *   <MenuItem>Edit</MenuItem>
	 *   <MenuItem>Delete</MenuItem>
	 * </Menu>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Menu placement="bottom-start">
	 *   <button slot="trigger">Actions</button>
	 *   <MenuItem value="edit">Edit</MenuItem>
	 *   <MenuItem disabled>Archive</MenuItem>
	 * </Menu>
	 * ```
	 */

	let element: HTMLElement & { open?: boolean; placement?: string }

	/** Controlled open state */
	export let open = false

	/** Menu placement relative to trigger */
	export let placement = 'bottom-start'

	/**
	 * Handle open events from the web component
	 * @private
	 */
	function handleOpen(event: CustomEvent) {
		open = true
	}

	/**
	 * Handle close events from the web component
	 * @private
	 */
	function handleClose(event: CustomEvent) {
		open = false
	}

	/**
	 * Sync open state to web component
	 * @private
	 */
	$: if (element) {
		element.open = open
	}

	/**
	 * Sync placement to web component
	 * @private
	 */
	$: if (element) {
		element.placement = placement
	}

	onMount(() => {
		if (element) {
			element.addEventListener('open', handleOpen)
			element.addEventListener('close', handleClose)

			return () => {
				element.removeEventListener('open', handleOpen)
				element.removeEventListener('close', handleClose)
			}
		}
	})
</script>

<ytz-menu
	bind:this={element}
	class={$$restProps.class || ''}
	placement={placement}
	on:open
	on:close
	{...$$restProps}
>
	<slot name="trigger" slot="trigger" />
	<slot />
</ytz-menu>

<style>
	:global(ytz-menu) {
		display: inline-block;
		position: relative;
	}
</style>

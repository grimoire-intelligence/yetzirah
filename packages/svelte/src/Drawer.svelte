<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-drawer Web Component.
	 * Provides Svelte-idiomatic two-way binding with bind:open.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Drawer bind:open={isOpen} anchor="left">
	 *   <nav>
	 *     <a href="/home">Home</a>
	 *   </nav>
	 * </Drawer>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Drawer bind:open={menuOpen} anchor="right" static>
	 *   <div>Sidebar content</div>
	 * </Drawer>
	 * ```
	 */

	let element: HTMLElement & { open?: boolean; anchor?: string }

	/** Controlled open state */
	export let open = false

	/** Anchor position: 'left', 'right', 'top', or 'bottom' */
	export let anchor: 'left' | 'right' | 'top' | 'bottom' = 'left'

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
	 * Sync anchor state to web component
	 * @private
	 */
	$: if (element) {
		element.anchor = anchor
	}

	onMount(() => {
		if (element) {
			element.addEventListener('close', handleClose)

			return () => {
				element.removeEventListener('close', handleClose)
			}
		}
	})
</script>

<ytz-drawer
	bind:this={element}
	class={$$restProps.class || ''}
	{anchor}
	on:close
	{...$$restProps}
>
	<slot />
</ytz-drawer>

<style>
	:global(ytz-drawer) {
		display: block;
	}
</style>

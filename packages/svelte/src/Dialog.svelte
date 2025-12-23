<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-dialog Web Component.
	 * Provides Svelte-idiomatic two-way binding with bind:open.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Dialog bind:open={isOpen}>
	 *   <h2>Dialog Title</h2>
	 *   <p>Content goes here.</p>
	 *   <button on:click={() => isOpen = false}>Close</button>
	 * </Dialog>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Dialog bind:open={isOpen} isStatic>
	 *   <h2>Static Dialog</h2>
	 *   <p>Cannot be dismissed by clicking backdrop</p>
	 * </Dialog>
	 * ```
	 */

	let element: HTMLElement & { open?: boolean }

	/** Controlled open state (two-way bindable via bind:open) */
	export let open = false

	/** Prevent backdrop dismiss */
	export let isStatic: boolean = false

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

	onMount(() => {
		if (element) {
			element.addEventListener('close', handleClose)

			return () => {
				element.removeEventListener('close', handleClose)
			}
		}
	})
</script>

<ytz-dialog
	bind:this={element}
	class={$$restProps.class || ''}
	static={isStatic || undefined}
	on:close
	{...$$restProps}
>
	<slot />
</ytz-dialog>

<style>
	:global(ytz-dialog) {
		display: none;
	}

	:global(ytz-dialog:not([hidden])) {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}
</style>

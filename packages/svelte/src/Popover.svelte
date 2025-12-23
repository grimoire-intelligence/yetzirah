<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-popover Web Component.
	 * Provides Svelte-idiomatic two-way binding with bind:open.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Popover bind:open={isPopoverOpen}>
	 *   <button>Open menu</button>
	 *   <div slot="content">
	 *     <p>Popover content with interactive elements</p>
	 *   </div>
	 * </Popover>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Popover placement="top" offset={12}>
	 *   <button>Settings</button>
	 *   <div slot="content" class="pa3 bg-white shadow-2 br2">
	 *     <label class="db mb2">
	 *       <input type="checkbox"> Enable notifications
	 *     </label>
	 *     <button>Save</button>
	 *   </div>
	 * </Popover>
	 * ```
	 */

	let element: HTMLElement & {
		open?: boolean
		placement?: 'top' | 'bottom' | 'left' | 'right'
		offset?: number
	}

	/** Controlled open state */
	export let open = false

	/** Placement of the popover relative to trigger */
	export let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom'

	/** Offset distance in pixels from trigger */
	export let offset = 8

	/**
	 * Handle show events from the web component
	 * @private
	 */
	function handleShow(event: CustomEvent) {
		open = true
	}

	/**
	 * Handle hide events from the web component
	 * @private
	 */
	function handleHide(event: CustomEvent) {
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

	/**
	 * Sync offset to web component
	 * @private
	 */
	$: if (element) {
		element.offset = offset
	}

	onMount(() => {
		if (element) {
			element.addEventListener('show', handleShow)
			element.addEventListener('hide', handleHide)

			return () => {
				element.removeEventListener('show', handleShow)
				element.removeEventListener('hide', handleHide)
			}
		}
	})
</script>

<ytz-popover
	bind:this={element}
	class={$$restProps.class || ''}
	{placement}
	{offset}
	on:show
	on:hide
	{...$$restProps}
>
	<slot />
</ytz-popover>

<style>
	:global(ytz-popover) {
		display: inline-block;
	}
</style>

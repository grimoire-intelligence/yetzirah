<script lang="ts">
	import '@grimoire/yetzirah-core'

	/**
	 * Svelte wrapper for ytz-tooltip Web Component.
	 * Shows positioned hint text on hover/focus with configurable delay and placement.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Tooltip>
	 *   <button>Hover me</button>
	 *   <span slot="content">Tooltip text</span>
	 * </Tooltip>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Tooltip placement="bottom" delay={200}>
	 *   <button>Hover me</button>
	 *   <span slot="content">Bottom tooltip</span>
	 * </Tooltip>
	 * ```
	 */

	let element: HTMLElement & {
		placement?: 'top' | 'bottom' | 'left' | 'right'
		delay?: number
		offset?: number
		show?: () => void
		hide?: () => void
	}

	/** Tooltip placement relative to trigger */
	export let placement: 'top' | 'bottom' | 'left' | 'right' = 'top'

	/** Delay before showing tooltip on hover (in milliseconds) */
	export let delay = 0

	/** Distance from trigger element (in pixels) */
	export let offset = 8

	/**
	 * Sync placement to web component
	 * @private
	 */
	$: if (element) {
		element.placement = placement
	}

	/**
	 * Sync delay to web component
	 * @private
	 */
	$: if (element) {
		element.delay = delay
	}

	/**
	 * Sync offset to web component
	 * @private
	 */
	$: if (element) {
		element.offset = offset
	}

	/**
	 * Public API: Show the tooltip programmatically
	 */
	export function show() {
		element?.show?.()
	}

	/**
	 * Public API: Hide the tooltip programmatically
	 */
	export function hide() {
		element?.hide?.()
	}
</script>

<ytz-tooltip
	bind:this={element}
	class={$$restProps.class || ''}
	{placement}
	{delay}
	{offset}
	on:show
	on:hide
	{...$$restProps}
>
	<slot />
	<slot name="content" slot="content" />
</ytz-tooltip>

<style>
	:global(ytz-tooltip) {
		display: inline-block;
	}
</style>

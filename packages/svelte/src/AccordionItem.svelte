<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-accordion-item Web Component.
	 * Individual collapsible section within an accordion.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <AccordionItem>
	 *   <button>Section Title</button>
	 *   <div>Section content goes here</div>
	 * </AccordionItem>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <AccordionItem open>
	 *   <button>Initially Open Section</button>
	 *   <div>Content visible by default</div>
	 * </AccordionItem>
	 * ```
	 */

	let element: HTMLElement & { open?: boolean }

	/** Whether the item is expanded */
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

<ytz-accordion-item
	bind:this={element}
	class={$$restProps.class || ''}
	{open}
	on:toggle
	{...$$restProps}
>
	<slot />
</ytz-accordion-item>

<style>
	:global(ytz-accordion-item) {
		display: block;
		border-bottom: 1px solid var(--color-border, #e0e0e0);
	}

	:global(ytz-accordion-item button) {
		width: 100%;
		text-align: left;
		padding: 12px 16px;
		background: var(--color-background, white);
		border: none;
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
	}

	:global(ytz-accordion-item button:hover) {
		background: var(--color-background-hover, #f5f5f5);
	}

	:global(ytz-accordion-item button:focus) {
		outline: 2px solid var(--color-focus, #1976d2);
		outline-offset: -2px;
	}

	:global(ytz-accordion-item > div) {
		overflow: hidden;
		transition: height 0.2s ease;
	}

	:global(ytz-accordion-item[open] > div) {
		padding: 12px 16px;
	}
</style>

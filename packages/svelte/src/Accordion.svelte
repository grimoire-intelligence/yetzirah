<script lang="ts">
	import '@grimoire/yetzirah-core'

	/**
	 * Svelte wrapper for ytz-accordion Web Component.
	 * Coordinated disclosure container managing multiple accordion items.
	 * Supports exclusive mode where only one item can be open at a time.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Accordion>
	 *   <AccordionItem>
	 *     <button>Section 1</button>
	 *     <div>Content 1</div>
	 *   </AccordionItem>
	 *   <AccordionItem>
	 *     <button>Section 2</button>
	 *     <div>Content 2</div>
	 *   </AccordionItem>
	 * </Accordion>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Accordion exclusive>
	 *   <AccordionItem open>
	 *     <button>Section 1 (Initially Open)</button>
	 *     <div>Content 1</div>
	 *   </AccordionItem>
	 *   <AccordionItem>
	 *     <button>Section 2</button>
	 *     <div>Content 2</div>
	 *   </AccordionItem>
	 * </Accordion>
	 * ```
	 */

	let element: HTMLElement & { exclusive?: boolean }

	/** Enable exclusive mode (only one item open at a time) */
	export let exclusive = false

	/**
	 * Sync exclusive state to web component
	 * @private
	 */
	$: if (element) {
		element.exclusive = exclusive
	}
</script>

<ytz-accordion
	bind:this={element}
	class={$$restProps.class || ''}
	{exclusive}
	on:toggle
	{...$$restProps}
>
	<slot />
</ytz-accordion>

<style>
	:global(ytz-accordion) {
		display: block;
	}
</style>

<script lang="ts">
	import '@grimoire/yetzirah-core'

	/**
	 * Svelte wrapper for ytz-option Web Component (used with Select).
	 * Represents a selectable option within a Select component.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <SelectOption value="1">Option 1</SelectOption>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <SelectOption value="premium" disabled>Premium (Coming Soon)</SelectOption>
	 * ```
	 */

	let element: HTMLElement & {
		disabled?: boolean
		selected?: boolean
	}

	/** The option value */
	export let value: string | undefined = undefined

	/** Disabled state */
	export let disabled = false

	/** Selected state */
	export let selected = false

	/**
	 * Sync disabled state to web component
	 * @private
	 */
	$: if (element) {
		element.disabled = disabled
	}

	/**
	 * Sync selected state to web component
	 * @private
	 */
	$: if (element) {
		element.selected = selected
	}
</script>

<ytz-option
	bind:this={element}
	class={$$restProps.class || ''}
	{value}
	{disabled}
	{selected}
	on:option-click
	{...$$restProps}
>
	<slot />
</ytz-option>

<style>
	:global(ytz-option) {
		display: block;
	}
</style>

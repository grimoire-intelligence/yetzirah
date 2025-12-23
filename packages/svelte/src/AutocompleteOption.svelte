<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-option Web Component.
	 * Individual option in autocomplete dropdown.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <AutocompleteOption value="apple">Apple</AutocompleteOption>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <AutocompleteOption value="banana" disabled>Banana (out of stock)</AutocompleteOption>
	 * ```
	 */

	let element: HTMLElement & {
		disabled?: boolean
		selected?: boolean
		value?: string | null
	}

	/** Option value */
	export let value: string = ''

	/** Disabled state */
	export let disabled: boolean = false

	/** Selected state (managed by parent autocomplete) */
	export let selected: boolean = false

	/**
	 * Sync value to web component
	 * @private
	 */
	$: if (element && value) {
		element.value = value
	}

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

	onMount(() => {
		// Component handles its own click events internally
	})
</script>

<ytz-option
	bind:this={element}
	class={$$restProps.class || ''}
	{value}
	{disabled}
	{selected}
	{...$$restProps}
>
	<slot />
</ytz-option>

<style>
	:global(ytz-option) {
		display: block;
		padding: 8px 12px;
		cursor: pointer;
		user-select: none;
	}

	:global(ytz-option:hover:not([disabled])) {
		background-color: var(--color-background-hover, #f5f5f5);
	}

	:global(ytz-option:focus) {
		outline: none;
		background-color: var(--color-background-focus, #e3f2fd);
	}

	:global(ytz-option[selected]) {
		background-color: var(--color-background-selected, #e3f2fd);
		font-weight: 500;
	}

	:global(ytz-option[disabled]) {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>

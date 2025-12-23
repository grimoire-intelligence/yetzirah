<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-listbox Web Component.
	 * Provides keyboard-navigable list selection with single/multi-select modes.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Listbox bind:value={selected}>
	 *   <ListboxOption value="opt1">Option 1</ListboxOption>
	 *   <ListboxOption value="opt2">Option 2</ListboxOption>
	 * </Listbox>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Listbox multiple bind:value={selectedItems}>
	 *   <ListboxOption value="a">Option A</ListboxOption>
	 *   <ListboxOption value="b">Option B</ListboxOption>
	 * </Listbox>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Listbox disabled>
	 *   <ListboxOption value="opt1">Option 1</ListboxOption>
	 * </Listbox>
	 * ```
	 */

	let element: HTMLElement & {
		multiple?: boolean
		disabled?: boolean
		value?: string | string[]
		clear?: () => void
		selectAll?: () => void
	}

	/** Controlled value state (string for single-select, array for multi-select) */
	export let value: string | string[] = ''

	/** Enable multi-select mode */
	export let multiple: boolean = false

	/** Disable listbox interactions */
	export let disabled: boolean = false

	/**
	 * Handle change events from the web component
	 * @private
	 */
	function handleChange(event: CustomEvent<{ value: string | string[]; option: HTMLElement }>) {
		if (event.detail) {
			value = event.detail.value
		}
	}

	/**
	 * Handle clear events from the web component
	 * @private
	 */
	function handleClear() {
		value = multiple ? [] : ''
	}

	/**
	 * Sync value to web component
	 * @private
	 */
	$: if (element && element.value !== value) {
		element.value = value
	}

	/**
	 * Sync multiple state to web component
	 * @private
	 */
	$: if (element) {
		element.multiple = multiple
	}

	/**
	 * Sync disabled state to web component
	 * @private
	 */
	$: if (element) {
		element.disabled = disabled
	}

	onMount(() => {
		if (element) {
			element.addEventListener('change', handleChange)
			element.addEventListener('clear', handleClear)

			return () => {
				element.removeEventListener('change', handleChange)
				element.removeEventListener('clear', handleClear)
			}
		}
	})

	// Expose methods for programmatic control
	export function clear() {
		element?.clear?.()
	}

	export function selectAll() {
		element?.selectAll?.()
	}
</script>

<ytz-listbox
	bind:this={element}
	class={$$restProps.class || ''}
	{multiple}
	{disabled}
	on:change
	on:clear
	{...$$restProps}
>
	<slot />
</ytz-listbox>

<style>
	:global(ytz-listbox) {
		display: block;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		padding: 4px;
		background: white;
		max-height: 300px;
		overflow-y: auto;
	}

	:global(ytz-listbox:focus) {
		outline: none;
		border-color: var(--color-primary, #1976d2);
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
	}

	:global(ytz-listbox[disabled]) {
		opacity: 0.6;
		cursor: not-allowed;
		background-color: var(--color-background-disabled, #f5f5f5);
	}
</style>

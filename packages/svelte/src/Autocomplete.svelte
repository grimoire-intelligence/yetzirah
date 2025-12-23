<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-autocomplete Web Component.
	 * Provides text input with filterable dropdown selection.
	 * Supports single and multi-select modes with async loading.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Autocomplete bind:value={selected}>
	 *   <input slot="input" placeholder="Search..." />
	 *   <AutocompleteOption value="apple">Apple</AutocompleteOption>
	 *   <AutocompleteOption value="banana">Banana</AutocompleteOption>
	 * </Autocomplete>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Autocomplete multiple bind:value={selectedItems}>
	 *   <input slot="input" placeholder="Select multiple..." />
	 *   <AutocompleteOption value="a">Option A</AutocompleteOption>
	 *   <AutocompleteOption value="b">Option B</AutocompleteOption>
	 * </Autocomplete>
	 * ```
	 */

	let element: HTMLElement & {
		open?: boolean
		multiple?: boolean
		loading?: boolean
		filter?: boolean
		value?: string | string[]
		inputValue?: string
		show?: () => void
		hide?: () => void
		toggle?: () => void
		clear?: () => void
		setOptions?: (options: Array<{ value: string; label: string; disabled?: boolean }>) => void
	}

	/** Controlled value state (string for single-select, array for multi-select) */
	export let value: string | string[] = ''

	/** Input value (text currently in the input field) */
	export let inputValue: string = ''

	/** Whether the dropdown is open */
	export let open: boolean = false

	/** Enable multi-select mode */
	export let multiple: boolean = false

	/** Show loading state */
	export let loading: boolean = false

	/** Enable client-side filtering */
	export let filter: boolean = true

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
	 * Handle input-change events from the web component
	 * @private
	 */
	function handleInputChange(event: CustomEvent<{ value: string }>) {
		if (event.detail) {
			inputValue = event.detail.value
		}
	}

	/**
	 * Handle open events from the web component
	 * @private
	 */
	function handleOpen() {
		open = true
	}

	/**
	 * Handle close events from the web component
	 * @private
	 */
	function handleClose() {
		open = false
	}

	/**
	 * Handle clear events from the web component
	 * @private
	 */
	function handleClear() {
		value = multiple ? [] : ''
		inputValue = ''
	}

	/**
	 * Sync value to web component
	 * @private
	 */
	$: if (element && element.value !== value) {
		element.value = value
	}

	/**
	 * Sync inputValue to web component
	 * @private
	 */
	$: if (element && element.inputValue !== inputValue) {
		element.inputValue = inputValue
	}

	/**
	 * Sync open state to web component
	 * @private
	 */
	$: if (element) {
		element.open = open
	}

	/**
	 * Sync multiple state to web component
	 * @private
	 */
	$: if (element) {
		element.multiple = multiple
	}

	/**
	 * Sync loading state to web component
	 * @private
	 */
	$: if (element) {
		element.loading = loading
	}

	/**
	 * Sync filter state to web component
	 * @private
	 */
	$: if (element) {
		element.filter = filter
	}

	onMount(() => {
		if (element) {
			element.addEventListener('change', handleChange)
			element.addEventListener('input-change', handleInputChange)
			element.addEventListener('open', handleOpen)
			element.addEventListener('close', handleClose)
			element.addEventListener('clear', handleClear)

			return () => {
				element.removeEventListener('change', handleChange)
				element.removeEventListener('input-change', handleInputChange)
				element.removeEventListener('open', handleOpen)
				element.removeEventListener('close', handleClose)
				element.removeEventListener('clear', handleClear)
			}
		}
	})

	// Expose methods for programmatic control
	export function show() {
		element?.show?.()
	}

	export function hide() {
		element?.hide?.()
	}

	export function toggle() {
		element?.toggle?.()
	}

	export function clear() {
		element?.clear?.()
	}

	export function setOptions(options: Array<{ value: string; label: string; disabled?: boolean }>) {
		element?.setOptions?.(options)
	}
</script>

<ytz-autocomplete
	bind:this={element}
	class={$$restProps.class || ''}
	{open}
	{multiple}
	{loading}
	filter={filter ? 'true' : 'false'}
	on:change
	on:input-change
	on:open
	on:close
	on:clear
	{...$$restProps}
>
	<slot />
</ytz-autocomplete>

<style>
	:global(ytz-autocomplete) {
		display: inline-block;
		position: relative;
		width: 100%;
	}

	:global(ytz-autocomplete [role='listbox']) {
		position: fixed;
		background: white;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		max-height: 300px;
		overflow-y: auto;
		z-index: 1000;
	}

	:global(ytz-autocomplete input) {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		font-size: 14px;
		line-height: 1.5;
	}

	:global(ytz-autocomplete input:focus) {
		outline: none;
		border-color: var(--color-primary, #1976d2);
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
	}
</style>

<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-select Web Component.
	 * Provides Svelte-idiomatic two-way binding with bind:value.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Select bind:value={selectedValue}>
	 *   <SelectOption value="1">Option 1</SelectOption>
	 *   <SelectOption value="2">Option 2</SelectOption>
	 * </Select>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Select bind:value={selected} multiple>
	 *   <SelectOption value="a">Choice A</SelectOption>
	 *   <SelectOption value="b">Choice B</SelectOption>
	 * </Select>
	 * ```
	 */

	let element: HTMLElement & {
		value?: string | string[]
		open?: boolean
		multiple?: boolean
		disabled?: boolean
		placeholder?: string
	}

	/** Controlled value state (string for single-select, array for multi-select) */
	export let value: string | string[] = ''

	/** Whether the dropdown is open */
	export let open = false

	/** Enable multi-select mode */
	export let multiple = false

	/** Disabled state */
	export let disabled = false

	/** Placeholder text when no selection */
	export let placeholder = 'Select...'

	/**
	 * Handle change events from the web component
	 * @private
	 */
	function handleChange(event: CustomEvent<{ value: string | string[] }>) {
		if (event.detail) {
			value = event.detail.value
		}
	}

	/**
	 * Sync value state to web component
	 * @private
	 */
	$: if (element) {
		element.value = value
	}

	/**
	 * Sync open state to web component
	 * @private
	 */
	$: if (element) {
		element.open = open
	}

	/**
	 * Sync disabled state to web component
	 * @private
	 */
	$: if (element) {
		element.disabled = disabled
	}

	/**
	 * Sync placeholder to web component
	 * @private
	 */
	$: if (element) {
		element.placeholder = placeholder
	}

	onMount(() => {
		if (element) {
			element.addEventListener('change', handleChange)

			return () => {
				element.removeEventListener('change', handleChange)
			}
		}
	})
</script>

<ytz-select
	bind:this={element}
	class={$$restProps.class || ''}
	{open}
	{multiple}
	{disabled}
	{placeholder}
	on:change
	on:open
	on:close
	on:clear
	{...$$restProps}
>
	<slot />
</ytz-select>

<style>
	:global(ytz-select) {
		display: inline-block;
	}
</style>

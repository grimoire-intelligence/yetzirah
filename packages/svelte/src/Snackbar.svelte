<script lang="ts">
	import '@grimoire/yetzirah-core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-snackbar Web Component.
	 * Provides Svelte-idiomatic two-way binding with bind:open.
	 *
	 * @component
	 */

	type SnackbarPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

	let element: HTMLElement

	/** Controlled open state (two-way bindable via bind:open) */
	export let open = false

	/** Auto-dismiss duration in milliseconds */
	export let duration = 5000

	/** Snackbar position on screen */
	export let position: SnackbarPosition = 'bottom-center'

	/** Show close button */
	export let dismissible = false

	/** Maximum number of visible stacked snackbars */
	export let maxVisible = 3

	/** Programmatically show the snackbar */
	export function show(message: string | undefined = undefined) {
		if (element && (element as any).show) {
			(element as any).show(message)
		}
		open = true
	}

	/** Programmatically dismiss the snackbar */
	export function dismiss() {
		if (element && (element as any).dismiss) {
			(element as any).dismiss()
		}
		open = false
	}

	function handleDismiss(event: Event) {
		open = false
	}

	$: if (element) {
		(element as any).open = open
	}

	onMount(() => {
		if (element) {
			element.addEventListener('dismiss', handleDismiss)

			return () => {
				element.removeEventListener('dismiss', handleDismiss)
			}
		}
	})
</script>

<ytz-snackbar
	bind:this={element}
	class={$$restProps.class || ''}
	{position}
	{duration}
	dismissible={dismissible || undefined}
	max-visible={maxVisible}
	on:dismiss
	{...$$restProps}
>
	<slot />
</ytz-snackbar>

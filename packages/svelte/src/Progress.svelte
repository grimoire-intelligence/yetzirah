<script lang="ts">
	import '@grimoire/yetzirah-core'

	/**
	 * Svelte wrapper for ytz-progress Web Component.
	 * Provides progress indicator with circular and linear modes.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <!-- Indeterminate spinner -->
	 * <Progress />
	 *
	 * <!-- Determinate progress -->
	 * <Progress value={75} />
	 *
	 * <!-- Linear progress bar -->
	 * <Progress value={50} linear />
	 * ```
	 */

	type ProgressSize = 'small' | 'medium' | 'large'

	let element: HTMLElement

	/** Progress value 0-100, null/undefined for indeterminate */
	export let value: number | null = null

	/** Use linear bar instead of circular spinner */
	export let linear = false

	/** Size variant */
	export let size: ProgressSize = 'medium'

	/** Accessible label for screen readers */
	export let label: string | undefined = undefined

	/** Whether the progress is in indeterminate mode */
	$: indeterminate = value === null || value === undefined
</script>

<ytz-progress
	bind:this={element}
	class={$$restProps.class || ''}
	value={value ?? undefined}
	linear={linear || undefined}
	{size}
	{label}
	{...$$restProps}
/>

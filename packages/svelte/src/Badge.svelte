<script lang="ts">
	import '@grimoire/yetzirah-core'

	/**
	 * Svelte wrapper for ytz-badge Web Component.
	 * Provides notification badge with dot, count, and hidden modes.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <!-- Dot badge -->
	 * <Badge>
	 *   <IconButton icon="notifications" />
	 * </Badge>
	 *
	 * <!-- Count badge -->
	 * <Badge value={5}>
	 *   <IconButton icon="mail" />
	 * </Badge>
	 *
	 * <!-- Max cap badge -->
	 * <Badge value={99} max={50}>
	 *   <IconButton icon="inbox" />
	 * </Badge>
	 * ```
	 */

	type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

	let element: HTMLElement

	/** Badge value. Null for dot mode, number/string for count mode. */
	export let value: string | number | null = null

	/** Maximum displayed value. Shows "max+" when exceeded. */
	export let max: number | undefined = undefined

	/** Badge position relative to slotted content */
	export let position: BadgePosition = 'top-right'

	/** Force hide the badge */
	export let hidden = false

	/** Whether the badge should be hidden */
	$: isHidden = hidden || value === 0 || value === '0'

	/** Current badge mode */
	$: mode = isHidden ? 'hidden' : (value === null || value === undefined) ? 'dot' : 'count'
</script>

<ytz-badge
	bind:this={element}
	class={$$restProps.class || ''}
	value={value ?? undefined}
	{max}
	{position}
	hidden={isHidden || undefined}
	{...$$restProps}
>
	<slot />
</ytz-badge>

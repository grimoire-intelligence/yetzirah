<script lang="ts">
	/**
	 * Svelte wrapper for menu trigger content.
	 * Container component for menu trigger elements.
	 * Apply slot="trigger" on this component when using with Menu.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Menu>
	 *   <MenuTrigger slot="trigger">
	 *     <button>Open Menu</button>
	 *   </MenuTrigger>
	 *   <MenuItem>Edit</MenuItem>
	 *   <MenuItem>Delete</MenuItem>
	 * </Menu>
	 * ```
	 *
	 * @example
	 * ```svelte
	 * <Menu>
	 *   <MenuTrigger slot="trigger">
	 *     <Button>Actions</Button>
	 *   </MenuTrigger>
	 *   <MenuItem value="edit">Edit</MenuItem>
	 *   <MenuItem disabled>Archive</MenuItem>
	 * </Menu>
	 * ```
	 */
</script>

<div class={$$restProps.class || ''} {...$$restProps}>
	<slot />
</div>

<style>
	div {
		display: contents;
	}
</style>

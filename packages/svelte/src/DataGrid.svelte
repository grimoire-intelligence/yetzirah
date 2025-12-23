<script lang="ts">
	import '@yetzirah/core'
	import { onMount } from 'svelte'

	/**
	 * Svelte wrapper for ytz-datagrid Web Component.
	 * Provides virtualized data grid with sorting, filtering, and keyboard navigation.
	 *
	 * @component
	 * @example
	 * <DataGrid {data} {columns} on:rowclick={onRowClick} />
	 */

	let element: HTMLElement & {
		data?: Array<Record<string, any>>
		sortState?: { field: string; direction: 'asc' | 'desc' } | null
		exportCSV?: () => string
		downloadCSV?: (filename?: string) => void
	}

	/** Array of row data objects */
	export let data: Array<Record<string, any>> = []

	/** Array of column definitions */
	export let columns: Array<{
		field: string
		header?: string
		sortable?: boolean
		filterable?: boolean
		width?: string
	}> = []

	/** Row height in pixels */
	export let rowHeight: number = 40

	/** Enable virtual scrolling */
	export let virtualScroll: boolean = true

	/**
	 * Sync data to web component
	 * @private
	 */
	$: if (element && data) {
		element.data = data
	}

	/**
	 * Sync rowHeight to web component attribute
	 * @private
	 */
	$: if (element && rowHeight) {
		element.setAttribute('row-height', String(rowHeight))
	}

	/**
	 * Handle sort events from the web component
	 * @private
	 */
	function handleSort(event: CustomEvent<{ field: string; direction: 'asc' | 'desc' }>) {
		// Re-dispatch the event for parent listeners
	}

	/**
	 * Handle rowselect events from the web component
	 * @private
	 */
	function handleRowSelect(event: CustomEvent<{ row: Record<string, any>; index: number }>) {
		// Re-dispatch the event for parent listeners
	}

	/**
	 * Handle rowactivate events from the web component
	 * @private
	 */
	function handleRowActivate(event: CustomEvent<{ row: Record<string, any>; index: number }>) {
		// Re-dispatch the event for parent listeners
	}

	/**
	 * Handle columnresize events from the web component
	 * @private
	 */
	function handleColumnResize(event: CustomEvent<{ field: string; width: number }>) {
		// Re-dispatch the event for parent listeners
	}

	onMount(() => {
		if (element) {
			element.addEventListener('sort', handleSort)
			element.addEventListener('rowselect', handleRowSelect)
			element.addEventListener('rowactivate', handleRowActivate)
			element.addEventListener('columnresize', handleColumnResize)

			return () => {
				element.removeEventListener('sort', handleSort)
				element.removeEventListener('rowselect', handleRowSelect)
				element.removeEventListener('rowactivate', handleRowActivate)
				element.removeEventListener('columnresize', handleColumnResize)
			}
		}
	})
</script>

<!-- DataGrid web component with column children -->
<ytz-datagrid
	bind:this={element}
	row-height={rowHeight}
	class={$$restProps.class || ''}
	on:sort
	on:rowselect
	on:rowactivate
	on:columnresize
	{...$$restProps}
>
	<!-- Render columns from columns prop -->
	{#each columns as column, index (column.field || index)}
		<ytz-datagrid-column
			field={column.field}
			header={column.header}
			sortable={column.sortable || undefined}
			filterable={column.filterable || undefined}
			width={column.width}
		/>
	{/each}

	<!-- Also support slot for custom column definitions -->
	<slot />
</ytz-datagrid>

<style>
	:global(ytz-datagrid) {
		display: block;
		width: 100%;
		height: 100%;
		border: 1px solid var(--color-border, #e0e0e0);
		font-family: var(--font-family, system-ui, sans-serif);
	}

	:global(.ytz-datagrid-header) {
		display: flex;
		background-color: var(--color-background-secondary, #f5f5f5);
		border-bottom: 2px solid var(--color-border, #e0e0e0);
		font-weight: 600;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	:global(.ytz-datagrid-viewport) {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
	}

	:global(.ytz-datagrid-row) {
		display: flex;
		border-bottom: 1px solid var(--color-border, #e0e0e0);
		height: v-bind(rowHeight + 'px');
	}

	:global(.ytz-datagrid-row:hover) {
		background-color: var(--color-background-hover, #fafafa);
	}

	:global(.ytz-datagrid-row-focused) {
		background-color: var(--color-focus, #e3f2fd);
	}

	:global(.ytz-datagrid-cell) {
		padding: 0 12px;
		display: flex;
		align-items: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	:global(.ytz-datagrid-cell-focused) {
		outline: 2px solid var(--color-focus, #1976d2);
		outline-offset: -2px;
	}

	:global(.ytz-datagrid-header-cell) {
		padding: 0 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
		user-select: none;
		cursor: default;
		white-space: nowrap;
		position: relative;
	}

	:global(.ytz-datagrid-sortable) {
		cursor: pointer;
	}

	:global(.ytz-datagrid-sortable:hover) {
		background-color: var(--color-background-hover, #fafafa);
	}

	:global(.ytz-datagrid-sort-indicator) {
		font-size: 0.75em;
		margin-left: 4px;
	}

	:global(.ytz-datagrid-filter) {
		padding: 4px 8px;
		border: 1px solid var(--color-border, #d0d0d0);
		border-radius: 3px;
		font-size: 0.9em;
		width: 100%;
		box-sizing: border-box;
	}

	:global(.ytz-datagrid-resize-handle) {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		cursor: col-resize;
		background-color: transparent;
		transition: background-color 0.2s;
	}

	:global(.ytz-datagrid-resize-handle:hover),
	:global(.ytz-datagrid-resizing .ytz-datagrid-resize-handle) {
		background-color: var(--color-focus, #1976d2);
	}
</style>

<template>
  <ytz-datagrid
    :class="$attrs.class"
    :row-height="rowHeight"
    @sort="handleSort"
    @rowselect="handleRowClick"
    v-bind="$attrs"
  >
    <ytz-datagrid-column
      v-for="(col, index) in columns"
      :key="col.key || index"
      :field="col.key"
      :header="col.header"
      :width="col.width"
      :sortable="col.sortable"
    />
  </ytz-datagrid>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-datagrid Web Component.
 * Provides virtual scrolling, sorting, and row selection with full TypeScript support.
 *
 * @module @yetzirah/vue/DataGrid
 *
 * @example
 * <template>
 *   <DataGrid
 *     :data="rows"
 *     :columns="[
 *       { key: 'name', header: 'Name', sortable: true },
 *       { key: 'email', header: 'Email' },
 *       { key: 'age', header: 'Age', width: '100px' }
 *     ]"
 *     @sort="onSort"
 *     @rowclick="onRowClick"
 *   />
 * </template>
 *
 * @example
 * <template>
 *   <DataGrid
 *     :data="users"
 *     :columns="cols"
 *     :row-height="40"
 *     :virtual-scroll="true"
 *   />
 * </template>
 */

import { ref, watch, nextTick } from 'vue'
import '@yetzirah/core'

/**
 * Column definition for DataGrid
 */
export interface DataGridColumn {
  /**
   * Data field name
   */
  key: string

  /**
   * Column header text
   */
  header: string

  /**
   * Column width (CSS value)
   */
  width?: string

  /**
   * Enable sorting for this column
   */
  sortable?: boolean
}

/**
 * Props for the DataGrid component
 */
interface Props {
  /**
   * Row data array
   */
  data?: Array<Record<string, any>>

  /**
   * Column definitions
   */
  columns?: DataGridColumn[]

  /**
   * Row height in pixels
   */
  rowHeight?: number

  /**
   * Enable virtual scrolling
   */
  virtualScroll?: boolean
}

/**
 * Emits for the DataGrid component
 */
interface Emits {
  /**
   * Emitted when a column is sorted
   * @param detail Object with column and direction properties
   */
  (e: 'sort', detail: { column: string; direction: 'asc' | 'desc' }): void

  /**
   * Emitted when a row is clicked
   * @param detail Object with row data
   */
  (e: 'rowclick', detail: { row: Record<string, any> }): void
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  rowHeight: 40,
  virtualScroll: true
})

const emit = defineEmits<Emits>()

const gridRef = ref<any>(null)

/**
 * Watch for data changes and update the grid
 */
watch(
  () => props.data,
  (newData) => {
    if (gridRef.value && Array.isArray(newData)) {
      nextTick(() => {
        gridRef.value.data = newData
      })
    }
  },
  { deep: true, immediate: true }
)

/**
 * Handle sort events from the underlying web component
 */
function handleSort(event: Event) {
  const detail = (event as CustomEvent).detail
  if (detail && detail.field) {
    emit('sort', {
      column: detail.field,
      direction: detail.direction || 'asc'
    })
  }
}

/**
 * Handle row click events from the underlying web component
 */
function handleRowClick(event: Event) {
  const detail = (event as CustomEvent).detail
  if (detail && detail.row) {
    emit('rowclick', {
      row: detail.row
    })
  }
}
</script>

<style scoped>
/* Styles are handled by the ytz-datagrid web component */
</style>

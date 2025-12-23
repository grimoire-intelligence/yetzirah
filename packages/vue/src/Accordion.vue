<template>
  <ytz-accordion
    :exclusive="exclusive || undefined"
    :class="$attrs.class"
    v-bind="$attrs"
  >
    <slot />
  </ytz-accordion>
</template>

<script setup lang="ts">
/**
 * Vue 3 wrapper for ytz-accordion Web Component.
 * Coordinated disclosure container that manages multiple accordion items.
 *
 * @module @grimoire/yetzirah-vue/Accordion
 *
 * @example
 * <template>
 *   <Accordion>
 *     <AccordionItem v-model:open="section1Open">
 *       <button>Section 1</button>
 *       <div>Content 1</div>
 *     </AccordionItem>
 *     <AccordionItem v-model:open="section2Open">
 *       <button>Section 2</button>
 *       <div>Content 2</div>
 *     </AccordionItem>
 *   </Accordion>
 * </template>
 *
 * @example
 * <template>
 *   <!-- Exclusive mode - only one item open at a time -->
 *   <Accordion exclusive>
 *     <AccordionItem :open="true">
 *       <button>First Section</button>
 *       <div>Content 1</div>
 *     </AccordionItem>
 *     <AccordionItem>
 *       <button>Second Section</button>
 *       <div>Content 2</div>
 *     </AccordionItem>
 *   </Accordion>
 * </template>
 */

import '@grimoire/yetzirah-core'

/**
 * Props for the Accordion component
 */
interface Props {
  /**
   * Whether exclusive mode is enabled (only one item open at a time)
   */
  exclusive?: boolean
}

defineProps<Props>()
</script>

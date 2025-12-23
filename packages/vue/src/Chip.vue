<template>
  <ytz-chip
    :deletable="deletable || undefined"
    :disabled="disabled || undefined"
    @delete="handleDelete"
    v-bind="attrs"
    :class="$attrs.class"
  >
    <slot />
  </ytz-chip>
</template>

<script setup lang="ts">
import '@yetzirah/core'
import { useAttrs } from 'vue'

/**
 * Chip component - deletable tag/label.
 *
 * @example
 * <Chip deletable @delete="removeTag">
 *   JavaScript
 * </Chip>
 *
 * @example
 * <Chip disabled>Read-only tag</Chip>
 */

interface Props {
  /** Show delete button */
  deletable?: boolean
  /** Disable chip interactions */
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  /** Emitted when chip is deleted (via button click or keyboard) */
  delete: [event: CustomEvent]
}>()

const attrs = useAttrs()

const handleDelete = (event: Event) => {
  emit('delete', event as CustomEvent)
}
</script>

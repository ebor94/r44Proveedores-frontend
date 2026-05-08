<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-xs font-medium text-negro flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-rojo text-[11px]">*</span>
      <slot name="badge" />
    </label>
    <slot>
      <textarea
        v-if="type === 'textarea'"
        v-bind="attrs"
        :value="modelValue"
        :readonly="readonly"
        :placeholder="placeholder"
        :class="['input-base resize-y h-20 py-2.5', variantClass]"
        @input="emit('update:modelValue', $event.target.value)"
      />
      <select
        v-else-if="type === 'select'"
        v-bind="attrs"
        :value="modelValue"
        :disabled="readonly"
        :class="['input-base', variantClass]"
        @change="emit('update:modelValue', $event.target.value)"
      >
        <option value="">{{ placeholder || 'Seleccionar...' }}</option>
        <option v-for="opt in options" :key="opt.value ?? opt" :value="opt.value ?? opt">
          {{ opt.label ?? opt }}
        </option>
      </select>
      <input
        v-else
        v-bind="attrs"
        :type="type"
        :value="modelValue"
        :readonly="readonly"
        :placeholder="placeholder"
        :class="['input-base', variantClass]"
        @input="emit('update:modelValue', $event.target.value)"
      />
    </slot>
    <span v-if="hint" class="text-[11px] text-gris-texto">{{ hint }}</span>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  required: Boolean,
  readonly: Boolean,
  variant: { type: String, default: 'default' }, // default | auto | cedula
  options: Array,
  hint: String,
})
const emit = defineEmits(['update:modelValue'])

const variantClass = computed(() => {
  if (props.readonly && props.variant === 'cedula') return 'input-cedula cursor-default'
  if (props.readonly && props.variant === 'auto') return 'input-auto cursor-default'
  if (props.readonly) return 'bg-gris-fondo cursor-default text-gris-texto'
  return ''
})
</script>

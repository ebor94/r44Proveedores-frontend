<template>
  <div
    class="relative border-2 border-dashed rounded-[10px] p-5 text-center cursor-pointer transition-all"
    :class="zoneClass"
    @click="triggerInput"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    <!-- Check de completado -->
    <div
      v-if="file"
      class="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px]"
      :class="esCedula ? 'bg-[#8e44ad]' : 'bg-verde-medio'"
    >
      ✓
    </div>

    <div class="text-[28px] mb-2">{{ icon }}</div>
    <div class="text-sm font-semibold text-negro mb-0.5">{{ label }}</div>
    <div class="text-[11px] text-gris-texto">{{ hint }}</div>
    <div v-if="file" class="text-[11px] mt-1.5 font-medium" :class="esCedula ? 'text-[#8e44ad]' : 'text-verde-medio'">
      {{ file.name }}
    </div>

    <input ref="inputRef" type="file" :accept="accept" class="hidden" @change="onFileChange" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  hint: { type: String, default: 'PDF · máx. 10 MB' },
  icon: { type: String, default: '📄' },
  accept: { type: String, default: '.pdf' },
  esCedula: Boolean,
  modelValue: Object, // File | null
})
const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const dragging = ref(false)
const file = computed(() => props.modelValue)

const zoneClass = computed(() => {
  const cedula = props.esCedula
  if (file.value) {
    return cedula
      ? 'border-[#8e44ad] border-solid bg-[#f4ecf7]'
      : 'border-verde-medio border-solid bg-verde-claro'
  }
  if (dragging.value) {
    return cedula ? 'border-[#8e44ad] bg-[#f4ecf7]' : 'border-verde-medio bg-verde-claro'
  }
  return cedula
    ? 'border-gris-borde hover:border-[#8e44ad] hover:bg-[#f4ecf7]'
    : 'border-gris-borde hover:border-verde-medio hover:bg-verde-claro'
})

function triggerInput() {
  inputRef.value?.click()
}

function onFileChange(e) {
  const f = e.target.files[0]
  if (f) emit('update:modelValue', f)
}

function onDrop(e) {
  dragging.value = false
  const f = e.dataTransfer.files[0]
  if (f) emit('update:modelValue', f)
}
</script>
